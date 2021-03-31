/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'

/**
 * Helpers
 */
import { isIE11 } from '../../../lib/browser'
import { getRouteFromUrl } from '../../../lib/get-product-route'
import { heDecode } from '../../../lib/html-entities'
import analyticsDecorator from '../../../../client/lib/analytics/analytics-decorator'
import { GTM_CATEGORY } from '../../../analytics'

/**
 * Actions
 */
import * as productsActions from '../../../actions/common/productsActions'
import { toggleModal } from '../../../actions/common/modalActions'
import { preserveScroll } from '../../../actions/common/infinityScrollActions'
import {
  getQuickViewProduct,
  showQuickviewModal,
  setProductIdQuickview,
  updateQuickviewShowItemsError,
  updateQuickViewActiveItem,
  updateQuickViewActiveItemQuantity,
} from '../../../actions/common/quickviewActions'
import { captureWishlistEvent } from '../../../actions/common/wishlistActions'

/**
 * Components
 */
import AccessibleText from '../../common/AccessibleText/AccessibleText'
import AddToBag from '../../common/AddToBag/AddToBag'
import Button from '../../common/Button/Button'
import ProductQuantity from '../../common/ProductQuantity/ProductQuantity'
import ProductSizes from '../../common/ProductSizes/ProductSizes'
import HistoricalPrice from '../../common/HistoricalPrice/HistoricalPrice'
import Loader from '../../common/Loader/Loader'
import RatingImage from '../../common/RatingImage/RatingImage'
import Swatches from '../../common/Swatches/Swatches'
import Message from '../../common/FormComponents/Message/Message'
import ProductMedia from '../../common/ProductMedia/ProductMedia'
import LowStock from '../../common/LowStock/LowStock'
import FitAttributes from '../../common/FitAttributes/FitAttributes'
import WishlistButton from '../../common/WishlistButton/WishlistButton'
import FreeShippingMessage from '../../common/FreeShippingMessage/FreeShippingMessage'

/**
 * Selectors
 */
import { enableSizeGuideButtonAsSizeTile } from '../../../selectors/brandConfigSelectors'
import {
  getMaximumNumberOfSizeTiles,
  getBrandName,
} from '../../../selectors/configSelectors'
import {
  isFeatureEnabled,
  isFeatureWishlistEnabled,
  isFeaturePdpQuantity,
} from '../../../selectors/featureSelectors'
import {
  getQuickviewActiveItem,
  getQuickViewProduct as getQuickViewProductSelector,
  getQuickViewProductId,
  shouldShowQuickviewError,
  getQuickviewQuantity,
} from '../../../selectors/quickviewSelectors'
import { getRoutePath } from '../../../selectors/routingSelectors'

@analyticsDecorator(GTM_CATEGORY.PRODUCT_QUICK_VIEW, {
  isAsync: true,
  suppressPageTypeTracking: true,
})
@connect(
  (state) => ({
    activeItem: getQuickviewActiveItem(state),
    showItemError: shouldShowQuickviewError(state),
    product: getQuickViewProductSelector(state),
    productId: getQuickViewProductId(state),
    pathname: getRoutePath(state),
    maximumNumberOfSizeTiles: getMaximumNumberOfSizeTiles(state),
    enableSizeGuideButtonAsSizeTile: enableSizeGuideButtonAsSizeTile(state),
    isFeatureWishlistEnabled: isFeatureWishlistEnabled(state),
    isFeaturePdpQuantity: isFeaturePdpQuantity(state),
    selectedQuantity: getQuickviewQuantity(state),
    isThresholdEnabled: isFeatureEnabled(
      state,
      'FEATURE_DELIVERY_THRESHOLD_MESSAGE_DETAILS'
    ),
    brandName: getBrandName(state),
  }),
  {
    ...productsActions,
    showQuickviewModal,
    getQuickViewProduct,
    setProductIdQuickview,
    toggleModal,
    preserveScroll,
    updateQuickviewShowItemsError,
    updateQuickViewActiveItem,
    updateQuickViewActiveItemQuantity,
    captureWishlistEvent,
  }
)
class ProductQuickview extends Component {
  static propTypes = {
    fromWishlist: PropTypes.bool,
    activeItem: PropTypes.object.isRequired,
    showItemError: PropTypes.bool.isRequired,
    getQuickViewProduct: PropTypes.func.isRequired,
    product: PropTypes.object.isRequired,
    productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    toggleModal: PropTypes.func.isRequired,
    setProductIdQuickview: PropTypes.func,
    updateQuickviewShowItemsError: PropTypes.func.isRequired,
    maximumNumberOfSizeTiles: PropTypes.number.isRequired,
    enableSizeGuideButtonAsSizeTile: PropTypes.bool.isRequired,
    updateQuickViewActiveItem: PropTypes.func.isRequired,
    showQuickviewModal: PropTypes.func.isRequired,
    updateQuickViewActiveItemQuantity: PropTypes.func.isRequired,
    selectedQuantity: PropTypes.number,
    isThresholdEnabled: PropTypes.bool,
  }

  static defaultProps = {
    selectedQuantity: 1,
    fromWishlist: false,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  shouldAddToBag = ({ showError = true } = {}) => {
    const { activeItem, updateQuickviewShowItemsError } = this.props
    if (activeItem.sku) return true
    if (showError) updateQuickviewShowItemsError()
  }

  getQuickviewProduct = (productId) => {
    const { setProductIdQuickview } = this.props
    setProductIdQuickview(productId)
  }

  UNSAFE_componentWillMount() {
    const { getQuickViewProduct, productId } = this.props
    getQuickViewProduct({ identifier: productId })
  }

  componentDidMount() {
    this.focus({})
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { getQuickViewProduct, productId } = this.props
    if (nextProps.productId && productId !== nextProps.productId) {
      getQuickViewProduct({ identifier: nextProps.productId })
    }
  }

  componentDidUpdate(prevProps) {
    this.focus(prevProps)
  }

  componentWillUnmount() {
    this.props.updateQuickViewActiveItem({})
  }

  onSwatchSelect = (e, product) => {
    e.preventDefault()

    const { productId } = product || {}
    this.props.setProductIdQuickview(productId)
  }

  focus({ product: prevProduct = {} }) {
    const { product = {}, productId } = this.props
    if (
      product.productId &&
      product.productId === productId &&
      (!prevProduct.productId || prevProduct.productId !== productId) &&
      this.intro
    ) {
      // If we have a product, and it's the right product, and previously it was not there or was a different product
      // And we have a ref to the title - focus it.
      this.intro.focus()
    }
  }

  /**
   * Does this product have at least one size that is in stock
   * @param {import('../../../actions/common/productsActions').ProductItem[]} [items]
   * @returns {boolean}
   */
  isInStock = (items = []) => items.some((item) => item.quantity > 0)

  /**
   * if route of app begins with wishlist this function will
   * @param {import('../../../actions/common/wishlistActions').ProductDetailsForWishlistEvent} productDetailsForWishlist
   */
  triggerWishlistEvent = (productDetailsForWishlist) => () =>
    this.props.captureWishlistEvent(
      'GA_ADD_TO_BAG_FROM_WISHLIST',
      productDetailsForWishlist
    )

  renderAddToBag = () => {
    const {
      product,
      activeItem: { sku },
      selectedQuantity,
      fromWishlist,
    } = this.props
    const { productId, isDDPProduct, unitPrice, lineNumber } = product
    const productDetailsForWishlist = {
      price: unitPrice,
      productId,
      lineNumber,
      pageType: 'wishlist-quickview',
    }
    const updateWishlist = fromWishlist
      ? this.triggerWishlistEvent(productDetailsForWishlist)
      : null
    return (
      <AddToBag
        key="add-to-bag"
        productId={productId}
        sku={sku}
        updateWishlist={updateWishlist}
        partNumber={sku}
        isDDPProduct={isDDPProduct}
        shouldShowInlineConfirm
        shouldAddToBag={this.shouldAddToBag}
        quantity={selectedQuantity}
        product={product}
      />
    )
  }

  /**
   * @param {boolean} inStock - is this product in stock
   * @return {JSX.Element}
   */
  renderCallToActions = (inStock) => {
    const { product, isFeatureWishlistEnabled, showQuickviewModal } = this.props
    const { productId, lineNumber, unitPrice } = product

    const productDetails = {
      productId,
      lineNumber,
      price: unitPrice,
    }

    return (
      <div className={'ProductQuickview-secondaryButtonGroup'}>
        {inStock && this.renderAddToBag()}
        {isFeatureWishlistEnabled && (
          <WishlistButton
            productId={productId}
            productDetails={productDetails}
            modifier="quickview"
            afterAddToWishlist={showQuickviewModal}
            isFromQuickView
          />
        )}
      </div>
    )
  }

  directToDetails = () => {
    const { toggleModal, product, preserveScroll } = this.props
    const { sourceUrl } = product
    const scrollYPos = window.scrollY || window.pageYOffset

    if (isIE11()) {
      preserveScroll(scrollYPos)
    }

    toggleModal()
    browserHistory.push(getRouteFromUrl(sourceUrl))
  }

  render() {
    const {
      toggleModal,
      product,
      activeItem,
      showItemError,
      maximumNumberOfSizeTiles,
      enableSizeGuideButtonAsSizeTile,
      updateQuickViewActiveItem,
      updateQuickViewActiveItemQuantity,
      selectedQuantity,
      isThresholdEnabled,
      isFeaturePdpQuantity,
      brandName,
    } = this.props

    const {
      colourSwatches,
      productId,
      unitPrice,
      wasPrice,
      wasWasPrice,
      rrp,
      name,
      items,
      assets,
      amplienceAssets,
      seoUrl,
      sourceUrl,
      stockThreshold,
      attributes,
      description,
      tpmLinks,
    } = product
    const { l } = this.context

    const ratingValue =
      product.ratingValue ||
      (product.attributes && product.attributes.AverageOverallRating)
    const inStock = this.isInStock(items)

    const shouldShowSizeDropdown =
      items && items.length && items.length > maximumNumberOfSizeTiles

    // omiting bullet points list in product description - in QA short one is
    const shortDescription =
      description && description.replace(/&lt;ul&gt;.*&lt;\/ul&gt;/g, '')

    if (
      !productId ||
      parseInt(productId, 10) !== parseInt(this.props.productId, 10)
    ) {
      return (
        <div aria-live="assertive">
          <AccessibleText
            data-modal-focus
          >{l`Product information loading`}</AccessibleText>
          <Loader />
        </div>
      )
    }

    const getProductSizesClass = () => {
      if (shouldShowSizeDropdown) {
        return 'ProductSizes--sizeGuideDropdown'
      }
      return enableSizeGuideButtonAsSizeTile
        ? 'ProductSizes--sizeGuideButtonAsSizeTile'
        : 'ProductSizes--sizeGuideBox'
    }

    return (
      <div className="ProductQuickview" key={productId}>
        <AccessibleText
          ref={(intro) => {
            this.intro = intro
          }}
          data-modal-focus
        >{l`This is the quick product view page for: ${name}`}</AccessibleText>
        <div className="ProductQuickview-left">
          <ProductMedia
            name="productQuickview"
            productId={productId}
            assets={assets}
            enableVideo
            amplienceAssets={amplienceAssets}
          />
        </div>
        <div className="ProductQuickview-right">
          <h1 className="ProductQuickview-title">{name}</h1>
          <HistoricalPrice
            className="HistoricalPrice--quickview"
            brandName={brandName}
            currency={'\u00A3'}
            price={unitPrice}
            wasPrice={wasPrice}
            wasWasPrice={wasWasPrice}
            rrp={rrp}
          />
          {ratingValue > 0 && (
            <div className="ProductQuickview-ratings">
              <RatingImage
                className="ProductQuickview-ratingsImage"
                rating={ratingValue}
              />
              <Link
                to={`${getRouteFromUrl(sourceUrl)}#BVReviews`}
                onClick={toggleModal}
              >{l`Read reviews`}</Link>
            </div>
          )}
          {tpmLinks &&
            tpmLinks.length > 0 && (
              <FitAttributes
                fitAttributes={tpmLinks[0]}
                isQuickview
                onClick={this.getQuickviewProduct}
              />
            )}
          <Swatches
            swatches={colourSwatches}
            maxSwatches={5}
            productId={productId}
            seoUrl={seoUrl}
            name={name}
            selectedId={productId}
            onSelect={this.onSwatchSelect}
            showAllColours
            pageClass="pdp"
          />
          <div className="ProductQuickview-sizeAndQuantity">
            <ProductSizes
              key="product-sizes"
              label={l`Select size`}
              productId={productId}
              items={items}
              className={`ProductSizes--pdp ${getProductSizesClass()}`}
              stockThreshold={stockThreshold}
              notifyEmail={
                attributes.NotifyMe === 'Y' ||
                attributes.EmailBackInStock === 'Y'
              }
              activeItem={activeItem}
              onSelectSize={updateQuickViewActiveItem}
            />
            <LowStock
              activeItem={activeItem}
              stockThreshold={product.stockThreshold}
              isFeaturePdpQuantity={isFeaturePdpQuantity}
            />
            {inStock && (
              <ProductQuantity
                key="product-quantity"
                activeItem={activeItem}
                selectedQuantity={selectedQuantity}
                onSelectQuantity={updateQuickViewActiveItemQuantity}
              />
            )}
          </div>
          {showItemError && (
            <Message
              key="error-message"
              message={l`Please select your size to continue`}
              type="error"
            />
          )}
          {this.renderCallToActions(inStock)}
          <div className="ProductQuickview-productDescription">
            <h4 className="ProductQuickview-productDescriptionTitle">{l`Product details`}</h4>
            <div
              className="ProductQuickview-productDescriptionContent"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: heDecode(shortDescription) }}
            />
          </div>
          {isThresholdEnabled && <FreeShippingMessage modifier="quickview" />}
          <Button
            className="ProductQuickview-link Button--secondary"
            clickHandler={this.directToDetails}
          >
            {l`See full details`}
          </Button>
        </div>
      </div>
    )
  }
}

export default ProductQuickview
