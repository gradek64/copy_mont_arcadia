import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Image from '../Image/Image'
import * as ShoppingBagActions from '../../../actions/common/shoppingBagActions'
import * as ModalActions from '../../../actions/common/modalActions'
import {
  isFeatureCFSIEnabled,
  isFeatureWishlistEnabled,
} from '../../../selectors/featureSelectors'
import {
  getTotalStockQuantityForProduct,
  isStandardDeliveryOnlyProduct,
} from '../../../selectors/inventorySelectors'
import OrderProductNotification from '../OrderProductNotification/OrderProductNotification'
import MinibagWishlistButton from '../WishlistButton/MinibagWishlistButton'
import Button from '../Button/Button'
import OrderProduct from './OrderProduct'
import Price from '../Price/Price'
import Select from '../FormComponents/Select/Select'
import { findIndex, path, propEq, range, min, contains } from 'ramda'
import { isCFSIToday } from '../../../lib/get-delivery-days/isCfsi'
import OrderProductPromo from './OrderProductPromo'
import { analyticsShoppingBagClickEvent } from '../../../analytics/tracking/site-interactions'
import {
  sendAnalyticsClickEvent,
  GTM_ACTION,
  GTM_CATEGORY,
} from '../../../analytics'
import { isMobile } from '../../../selectors/viewportSelectors'
import { getSelectedDeliveryLocationType } from '../../../selectors/checkoutSelectors'
import Form from '../FormComponents/Form/Form'

@connect(
  (state) => ({
    orderId: state.shoppingBag.bag.orderId,
    selectedStore: state.selectedBrandFulfilmentStore,
    isCFSIEnabled: isFeatureCFSIEnabled(state),
    selectedDeliveryLocation: getSelectedDeliveryLocationType(state),
    isFeatureWishlistEnabled: isFeatureWishlistEnabled(state),
    isMobile: isMobile(state),
    pathname: state.routing.location.pathname,
  }),
  { ...ShoppingBagActions, ...ModalActions, sendAnalyticsClickEvent }
)
class OrderProducts extends Component {
  static propTypes = {
    products: PropTypes.array,
    orderId: PropTypes.number,
    onUpdateProduct: PropTypes.func,
    deleteFromBag: PropTypes.func,
    fetchProductItemSizesAndQuantities: PropTypes.func,
    persistShoppingBagProduct: PropTypes.func,
    showModal: PropTypes.func,
    closeModal: PropTypes.func,
    scrollOnEdit: PropTypes.func,
    updateShoppingBagProduct: PropTypes.func,
    canModify: PropTypes.bool,
    oosOnly: PropTypes.bool,
    allowEmptyBag: PropTypes.bool,
    scrollable: PropTypes.bool,
    className: PropTypes.string,
    selectedStore: PropTypes.object,
    isCFSIEnabled: PropTypes.bool,
    isFeatureWishlistEnabled: PropTypes.bool,
    closeMiniBag: PropTypes.func,
    openMiniBag: PropTypes.func,
    allowMoveToWishlist: PropTypes.bool.isRequired,
    sendAnalyticsClickEvent: PropTypes.func.isRequired,
    shouldProductsLinkToPdp: PropTypes.bool,
    selectedDeliveryLocation: PropTypes.string,
    hasDiscountText: PropTypes.bool,
    shouldDisplaySocialProofLabel: PropTypes.bool,
    socialProofView: PropTypes.string,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  static defaultProps = {
    onUpdateProduct: () => {},
    canModify: true,
    className: '',
    allowMoveToWishlist: false,
    shouldProductsLinkToPdp: false,
    shouldDisplaySocialProofLabel: false,
  }

  constructor(props) {
    super(props)
    this.editSizeQtyFormRef = React.createRef()
  }

  products = []

  componentDidUpdate(prevProps) {
    const prevProducts = prevProps.products
    const { products, scrollOnEdit, canModify } = this.props

    const shouldScroll =
      products && prevProducts && products.length === prevProducts.length

    if (canModify && scrollOnEdit && shouldScroll) {
      prevProducts.forEach((bagProduct, i) => {
        const refProduct = this.products[i]
        if (!bagProduct.editing && products[i].editing)
          scrollOnEdit(refProduct.offsetTop + refProduct.offsetHeight)
      })
    }

    if (this.editSizeQtyFormRef && this.editSizeQtyFormRef.current) {
      this.editSizeQtyFormRef.current.focus()
    }
  }

  getOptionLabel = (item) => {
    const { l } = this.context
    if (item.quantity === 0) {
      return `${item.size}: ${l`Out of stock`}`
    } else if (item.quantity <= 3) {
      return `${item.size}: ${l`Low stock`}`
    }
    return `${item.size}`
  }

  getSizeOptions = (bagProduct) => {
    if (bagProduct.size) {
      return bagProduct.items.map((item) => {
        return {
          value: item.size,
          label: this.getOptionLabel(item),
          disabled: item.quantity === 0,
        }
      })
    }
    return []
  }

  getQuantityOptions = (bagProduct) => {
    if (bagProduct.size) {
      const sizeIndex = findIndex(
        propEq('size', bagProduct.sizeSelected || bagProduct.size),
        bagProduct.items
      )
      const item = bagProduct.items[sizeIndex]
      const ranges = range(1, (item && item.quantity + 1) || 10)
      const result = ranges.map((currentQuantity) => {
        return {
          value: currentQuantity,
          label: currentQuantity,
          disabled: false,
        }
      })
      return result
    }
    return []
  }

  editProduct = (index, bagProduct) => {
    const { sendAnalyticsClickEvent } = this.props
    sendAnalyticsClickEvent({
      category: GTM_CATEGORY.BAG_DRAWER,
      action: GTM_ACTION.BAG_DRAW_EDIT,
      label: bagProduct.productId,
    })
    this.updateProduct(index, { editing: true })
    this.props.fetchProductItemSizesAndQuantities(index)
  }

  sizeChangeHandler = (evt, productIndex, bagProduct) => {
    const {
      target: {
        value: size,
        options: { selectedIndex: newSizeIndex },
      },
    } = evt

    const correctedQuantity = this.correctQuantitySelected(
      bagProduct,
      newSizeIndex
    )

    this.updateProduct(productIndex, {
      catEntryIdToAdd: newSizeIndex,
      sizeSelected: size,
      quantitySelected: correctedQuantity.correctedQuantity,
      selectedQuantityWasCorrected:
        correctedQuantity.selectedQuantityWasCorrected,
    })

    analyticsShoppingBagClickEvent({
      ea: 'sizeUpdate',
      el: bagProduct.productId,
    })
  }

  quantityChangeHandler = (productIndex, evt) => {
    const { value } = evt.target
    this.updateProduct(productIndex, {
      quantitySelected: value,
      selectedQuantityWasCorrected: false,
    })
  }

  updateProduct = (index, update) => {
    this.props.onUpdateProduct(index, update)
    this.props.updateShoppingBagProduct(index, update)
  }

  doDeleteFromBag = (
    bagProduct,
    closeConfirmationModal,
    successModalText = null
  ) => () => {
    const { deleteFromBag, orderId, closeModal } = this.props
    const actions = []
    if (closeConfirmationModal) actions.push(closeModal())
    actions.push(deleteFromBag(orderId, bagProduct, successModalText))
    return Promise.all(actions)
  }

  confirmDeleteFromBag = (bagProduct) => () => {
    const { l } = this.context
    const modalHTML = (
      <div className="OrderProducts-modal">
        <p>{l`Are you sure you want to remove ${
          bagProduct.name
        } from your bag?`}</p>
        <Button
          className="OrderProducts-deleteButton"
          clickHandler={this.doDeleteFromBag(bagProduct, true)}
        >{l`Delete`}</Button>
      </div>
    )
    this.props.showModal(modalHTML, { type: 'alertdialog' })
  }

  renderStoreAvailabity() {
    const { selectedStore } = this.props
    return (
      <p className="OrderProducts-collectionDetails">
        In stock at {selectedStore.brandName} {selectedStore.name}
      </p>
    )
  }

  afterAddToWishlist = (bagProduct) => () => {
    const { l } = this.context
    const { openMiniBag } = this.props
    return Promise.all([
      this.doDeleteFromBag(
        bagProduct,
        false,
        l`${bagProduct.name} has been moved to your Wishlist`
      )(),
      openMiniBag(),
    ])
  }

  renderMovingToWishlistText = () => {
    const { l } = this.context
    return (
      <span className="OrderProducts-movingToWishlistLabel">
        {l`Moving to Wishlist`}
      </span>
    )
  }

  renderAddToWishlistText = () => {
    const { l } = this.context
    return (
      <span className="OrderProducts-addToWishlistLabel">
        {l`Move to Wishlist`}
      </span>
    )
  }

  // Corrects the quantitySelected property in the event that the maximum quantity for a given size is too high
  correctQuantitySelected = (product, newSizeIndex) => {
    const quantityOfCurrentSize = product.quantity
    const quantityLastSelectedInUI = product.quantitySelected
    const maxQuantityForNewSize = path(
      ['items', newSizeIndex, 'quantity'],
      product
    )
    const quantityUsedForCalculation =
      quantityLastSelectedInUI || quantityOfCurrentSize
    const correctedQuantity = min(
      quantityUsedForCalculation,
      maxQuantityForNewSize
    )

    return {
      correctedQuantity: correctedQuantity.toString(),
      selectedQuantityWasCorrected:
        quantityUsedForCalculation !== correctedQuantity,
    }
  }

  saveBag(evt, productIndex) {
    this.props.persistShoppingBagProduct(productIndex)
  }

  canEditDeleteProduct = (bagProduct) => {
    const { oosOnly, canModify } = this.props
    return !oosOnly && canModify && !bagProduct.editing
  }

  renderEditRemoveButton = (bagProduct, canDeleteItem, index) => {
    const { l } = this.context
    return (
      <div className="OrderProducts-editContainer">
        {!bagProduct.isDDPProduct && (
          <button
            className="OrderProducts-editText notranslate"
            onClick={() => {
              this.editProduct(index, bagProduct)
            }}
            role="button"
          >
            <span className="OrderProducts-editLabel translate">{l`Edit`}</span>
          </button>
        )}
        {canDeleteItem && (
          <button
            className="OrderProducts-deleteText notranslate"
            onClick={this.confirmDeleteFromBag(bagProduct)}
          >
            <Image
              alt={l`Remove`}
              className="OrderProducts-deleteIcon"
              src={'/assets/{brandName}/images/trashcan-icon.svg'}
            />
          </button>
        )}
      </div>
    )
  }

  renderStockMessages = (bagProduct) => {
    const { l } = this.context
    const { pathname } = this.props
    const stockAvailability = getTotalStockQuantityForProduct(bagProduct)
    const lowStockMessage = l`Low stock`
    const outOfStockMessage = l`Out of stock`
    const partiallyOutOfStockMessage = l`Only ${stockAvailability} available`
    const pleaseRemoveMessage = l`Please edit or remove`
    const isDDPProduct = bagProduct.isDDPProduct
    const isProductOutOfStock = !bagProduct.inStock
    const isProductLowStock =
      stockAvailability >= bagProduct.quantity && bagProduct.lowStock
    const isProductPartiallyOutOfStock =
      stockAvailability < bagProduct.quantity && bagProduct.inStock
    const isThankYouPage = contains(pathname, ['/order-complete'])

    return (
      !isDDPProduct &&
      !isThankYouPage && (
        <div className="OrderProducts-productStockContainer">
          {isProductLowStock && (
            <div className="OrderProducts-productLowStockContainer">
              <span className="OrderProducts-productLowStockMessage">
                {lowStockMessage}
              </span>
            </div>
          )}
          {(isProductOutOfStock || isProductPartiallyOutOfStock) && (
            <div className="OrderProducts-productOutOfStockContainer">
              <Image
                alt={l`Remove`}
                className="OrderProducts-errorIcon"
                src={'/assets/common/images/icon-info-error.svg'}
              />
              <div className="OrderProducts-productOutOfStockMessageContainer">
                <span className="OrderProducts-productOutOfStockMessage">
                  {isProductOutOfStock
                    ? outOfStockMessage
                    : partiallyOutOfStockMessage}
                </span>
                <span className="OrderProducts-productOutOfStockMessage">
                  {pleaseRemoveMessage}
                </span>
              </div>
            </div>
          )}
        </div>
      )
    )
  }

  render() {
    const { l } = this.context
    const {
      oosOnly,
      allowEmptyBag,
      scrollable,
      products: propsProducts,
      className,
      selectedStore,
      drawer,
      isFeatureWishlistEnabled,
      closeMiniBag,
      allowMoveToWishlist,
      isMobile,
      shouldProductsLinkToPdp,
      isCFSIEnabled,
      selectedDeliveryLocation,
      hasDiscountText,
      shouldDisplaySocialProofLabel,
      socialProofView,
    } = this.props
    const products = Array.isArray(propsProducts) ? propsProducts : []
    const currentProducts = oosOnly
      ? products.filter((product) => !product.inStock || product.lowStock)
      : products
    const canDeleteItem = allowEmptyBag || currentProducts.length > 1
    const shouldScroll = !drawer && scrollable && currentProducts.length > 3
    const isStoreSelected =
      selectedDeliveryLocation === 'STORE' && path(['brandName'], selectedStore)

    return (
      <div
        className={`OrderProducts ${className}${
          shouldScroll ? ' is-scrollable' : ''
        }`}
      >
        <div className="OrderProducts-wrapper">
          {currentProducts.map((bagProduct, i) => {
            const productDetails = {
              lineNumber: bagProduct.lineNumber,
              price: bagProduct.unitPrice,
            }

            const shouldRenderStoreAvailability =
              !oosOnly &&
              isCFSIEnabled &&
              isStoreSelected &&
              !bagProduct.isDDPProduct &&
              isCFSIToday(bagProduct, selectedStore)

            const isStandardDeliveryOnly = isStandardDeliveryOnlyProduct(
              bagProduct
            )
            const totalStockAvailability = getTotalStockQuantityForProduct(
              bagProduct
            )
            const selectDefaultQuantity =
              totalStockAvailability < bagProduct.quantity
                ? totalStockAvailability
                : bagProduct.quantity

            const canModifyProduct = this.canEditDeleteProduct(bagProduct)

            return (
              <div
                key={i} // eslint-disable-line react/no-array-index-key
                className="OrderProducts-product"
                ref={(div) => {
                  this.products[i] = div
                }}
              >
                <OrderProduct
                  {...bagProduct}
                  shouldLinkToPdp={shouldProductsLinkToPdp}
                  shouldDisplaySocialProofLabel={shouldDisplaySocialProofLabel}
                  socialProofView={socialProofView}
                >
                  {shouldRenderStoreAvailability &&
                    this.renderStoreAvailabity()}
                  {!oosOnly && (
                    <p className="OrderProducts-row OrderProducts-productSubtotal">
                      <span className="OrderProducts-label OrderProducts-total">
                        {l`Total`}:
                      </span>
                      <Price
                        className="OrderProducts-price"
                        price={bagProduct.totalPrice || bagProduct.total}
                      />
                    </p>
                  )}
                  <OrderProductPromo
                    product={bagProduct}
                    hasDiscountText={hasDiscountText}
                  />
                  {!isMobile && canModifyProduct ? (
                    <div className="OrderProducts-stockEditRemove">
                      {this.renderStockMessages(bagProduct)}
                      {this.renderEditRemoveButton(
                        bagProduct,
                        canDeleteItem,
                        i
                      )}
                    </div>
                  ) : null}
                  {isFeatureWishlistEnabled &&
                    allowMoveToWishlist &&
                    !bagProduct.isDDPProduct && (
                      <div className="OrderProducts-movetowishlistContainer">
                        <MinibagWishlistButton
                          productId={bagProduct.productId}
                          productDetails={productDetails}
                          renderRemoveFromWishlistText={
                            this.renderMovingToWishlistText
                          }
                          renderAddToWishlistText={this.renderAddToWishlistText}
                          afterAddToWishlist={this.afterAddToWishlist(
                            bagProduct
                          )}
                          onAuthenticationPreHook={closeMiniBag}
                        />
                      </div>
                    )}
                </OrderProduct>
                {isMobile && canModifyProduct ? (
                  <div className="OrderProducts-stockEditRemove">
                    {this.renderStockMessages(bagProduct)}
                    {this.renderEditRemoveButton(bagProduct, canDeleteItem, i)}
                  </div>
                ) : null}
                {isStandardDeliveryOnly && (
                  <OrderProductNotification
                    message={l`Only available via Standard Delivery`}
                  />
                )}
                {bagProduct.editing ? (
                  <Form ref={this.editSizeQtyFormRef} tabIndex="0">
                    <div className="OrderProducts-formItem">
                      <Select
                        className="OrderProducts-sizes"
                        onChange={(evt) =>
                          this.sizeChangeHandler(evt, i, bagProduct)
                        }
                        options={this.getSizeOptions(bagProduct)}
                        label={l`Size`}
                        name="bagItemSize"
                        value={bagProduct.sizeSelected || bagProduct.size}
                      />
                    </div>
                    <div className="OrderProducts-formItem">
                      <Select
                        className="OrderProducts-quantities"
                        onChange={(evt) => this.quantityChangeHandler(i, evt)}
                        options={this.getQuantityOptions(bagProduct)}
                        label={l`Quantity`}
                        name="bagItemQuantity"
                        defaultValue={selectDefaultQuantity.toString()}
                        value={
                          bagProduct.quantitySelected
                            ? bagProduct.quantitySelected.toString()
                            : bagProduct.quantity.toString()
                        }
                      />
                    </div>
                    {/* TODO: THIS MESSAGE BOX HAS BEEN HIDDEN VIA CSS UNTIL THE DESIGNS ARE FINALISED */}
                    {bagProduct.selectedQuantityWasCorrected && (
                      <div className="OrderProducts-infoBox">
                        We have changed the quantity of this item as it is low
                        in stock
                      </div>
                    )}
                    <div className="OrderProducts-inlineButtons">
                      <Button
                        className="OrderProducts-saveButton Button--secondary Button--halfWidth"
                        clickHandler={(evt) => this.saveBag(evt, i)}
                      >
                        {l`Save`}
                      </Button>
                      <Button
                        className="OrderProducts-cancelButton Button--secondary Button--halfWidth"
                        clickHandler={() =>
                          this.updateProduct(i, { editing: false })
                        }
                      >
                        {l`Cancel`}
                      </Button>
                    </div>
                  </Form>
                ) : (
                  ''
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default OrderProducts
