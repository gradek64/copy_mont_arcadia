import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ShoppingBag from '../../common/ShoppingBag/ShoppingBag'
import PromotionCode from '../PromotionCode/PromotionCode'
import Price from '../../common/Price/Price'
import Button from '../../common/Button/Button'
import ShoppingBagDeliveryOptions from '../../common/ShoppingBagDeliveryOptions/ShoppingBagDeliveryOptions'
import DeliveryEstimate from '../../common/DeliveryEstimate/DeliveryEstimate'
import FreeShippingMessage from '../../common/FreeShippingMessage/FreeShippingMessage'
import Loader from '../../common/Loader/Loader'
import {
  getTrendingProducts,
  getSocialProofBanners,
} from '../../../actions/common/socialProofActions'
import { browserHistory } from 'react-router'
import QubitReact from 'qubit-react/wrapper'
import {
  sendAnalyticsClickEvent,
  GTM_CATEGORY,
  GTM_ACTION,
  GTM_LABEL,
} from '../../../analytics'
import { selectedDeliveryLocation } from '../../../lib/checkout-utilities/reshaper'
import { pluck } from 'ramda'
import Espot from '../Espot/Espot'
import {
  closeMiniBag,
  changeDeliveryType,
  removeMiniBagMessage,
} from '../../../actions/common/shoppingBagActions'
import EnhancedMessage from '../../common/EnhancedMessage/EnhancedMessage'

// Selectors
import {
  getShoppingBagTotalItems,
  getShoppingBagSubTotal,
  bagContainsOutOfStockProduct,
  bagContainsPartiallyOutOfStockProduct,
  bagContainsStandardDeliveryOnlyProduct,
  bagContainsOnlyDDPProduct,
  calculateBagDiscount,
  bagContainsDDPProduct,
} from '../../../selectors/shoppingBagSelectors'
import { isDDPActiveUserPreRenewWindow } from '../../../selectors/ddpSelectors'
import {
  isFeatureEnabled,
  isFeatureCFSIEnabled,
  isFeaturePUDOEnabled,
} from '../../../selectors/featureSelectors'
// Constants
import constants from '../../../constants/espotsDesktop'

@connect(
  (state) => ({
    // @NOTE we are connecting to multiple props all from shoppingBag
    // @TODO prop cleaning
    shoppingBag: state.shoppingBag,
    miniBagOpen: state.shoppingBag.miniBagOpen,
    autoClose: state.shoppingBag.autoClose,
    bagProducts: state.shoppingBag.bag.products,
    bagSubtotal: getShoppingBagSubTotal(state),
    bagTotal: state.shoppingBag.bag.total,
    bagCount: getShoppingBagTotalItems(state),
    bagDiscount: calculateBagDiscount(state),
    bagDeliveryOptions: state.shoppingBag.bag.deliveryOptions,
    loadingShoppingBag: state.shoppingBag.loadingShoppingBag,
    pathname: state.routing.location.pathname,
    inCheckout: state.routing.location.pathname.startsWith('/checkout'),
    orderSummary: state.checkout.orderSummary,
    yourDetails: state.forms.checkout.yourDetails,
    yourAddress: state.forms.checkout.yourAddress,
    isCFSIEnabled: isFeatureCFSIEnabled(state),
    isPUDOEnabled: isFeaturePUDOEnabled(state),
    selectedStore: state.selectedBrandFulfilmentStore,
    bagMessages: state.shoppingBag.messages,
    bagContainsOutOfStockProduct: bagContainsOutOfStockProduct(state),
    bagContainsPartiallyOutOfStockProduct: bagContainsPartiallyOutOfStockProduct(
      state
    ),
    bagContainsStandardDeliveryOnlyProduct: bagContainsStandardDeliveryOnlyProduct(
      state
    ),
    bagContainsOnlyDDPProduct: bagContainsOnlyDDPProduct(state),
    isLockImageEnabled: isFeatureEnabled(state, 'FEATURE_CHECKOUT_BUTTON_LOCK'),
    isFeatureThresholdMessageEnabled: isFeatureEnabled(
      state,
      'FEATURE_DELIVERY_THRESHOLD_MESSAGE_MINIBAG'
    ),
    isFeatureSocialProofMinibagBadgeEnabled: isFeatureEnabled(
      state,
      'FEATURE_SOCIAL_PROOF_MINIBAG_BADGE'
    ),
    isDDPActiveUserPreRenewWindow: isDDPActiveUserPreRenewWindow(state),
    bagContainsDDPProduct: bagContainsDDPProduct(state),
  }),
  {
    closeMiniBag,
    sendAnalyticsClickEvent,
    changeDeliveryType,
    removeMiniBagMessage,
    getTrendingProducts,
    getSocialProofBanners,
  }
)
class MiniBag extends Component {
  static propTypes = {
    bagProducts: PropTypes.array.isRequired,
    shoppingBag: PropTypes.object,
    orderSummary: PropTypes.object,
    yourAddress: PropTypes.object,
    yourDetails: PropTypes.object,
    selectedStore: PropTypes.object,
    bagDiscount: PropTypes.number,
    bagDeliveryOptions: PropTypes.array,
    inCheckout: PropTypes.bool,
    isCFSIEnabled: PropTypes.bool,
    isPUDOEnabled: PropTypes.bool,
    loadingShoppingBag: PropTypes.bool,
    bagTotal: PropTypes.string,
    closeMiniBag: PropTypes.func,
    sendAnalyticsClickEvent: PropTypes.func.isRequired,
    changeDeliveryType: PropTypes.func,
    bagMessages: PropTypes.array,
    removeMiniBagMessage: PropTypes.func,
    bagContainsOutOfStockProduct: PropTypes.bool,
    bagContainsPartiallyOutOfStockProduct: PropTypes.bool,
    bagContainsStandardDeliveryOnlyProduct: PropTypes.bool,
    isLockImageEnabled: PropTypes.bool.isRequired,
    bagSubtotal: PropTypes.number,
    isFeatureThresholdMessageEnabled: PropTypes.bool,
    getTrendingProducts: PropTypes.func.isRequired,
    getSocialProofBanners: PropTypes.func.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  state = { isHovered: false }

  autoCloseInterval = null

  AUTO_CLOSE_DELAY_LENGTH = 3000

  UNSAFE_componentWillReceiveProps(nextProps) {
    const shouldFetchTrendingProducts =
      nextProps.bagProducts.length > 0 &&
      this.props.isFeatureSocialProofMinibagBadgeEnabled &&
      !this.props.miniBagOpen &&
      nextProps.miniBagOpen

    if (
      !this.props.miniBagOpen &&
      nextProps.autoClose &&
      nextProps.miniBagOpen
    ) {
      this.autoCloseInterval = setInterval(
        this.closeMiniBagIfNeeded,
        this.AUTO_CLOSE_DELAY_LENGTH
      )
    } else if (this.props.miniBagOpen && !nextProps.miniBagOpen) {
      this.stopAutoClose()
    }

    if (shouldFetchTrendingProducts) {
      this.props.getTrendingProducts('minibag')
      this.props.getSocialProofBanners()
    }
  }

  closeMiniBagIfNeeded = () => {
    if (!this.state.isHovered) {
      this.stopAutoClose()
      this.props.closeMiniBag()
    }
  }

  stopAutoClose = () => {
    if (this.autoCloseInterval) {
      clearInterval(this.autoCloseInterval)
      this.autoCloseInterval = null
    }
  }

  handleMouseEnter = () => {
    this.setState({ isHovered: true })
  }

  handleMouseLeave = () => {
    this.setState({ isHovered: false })
  }

  scrollMinibag = (pos) => {
    const miniBagContent = this.miniContent
    if (miniBagContent)
      miniBagContent.scrollTop = pos - miniBagContent.offsetHeight
  }

  clickHandler = () => {
    const { sendAnalyticsClickEvent, closeMiniBag } = this.props
    browserHistory.push('/checkout')
    sendAnalyticsClickEvent({
      category: GTM_CATEGORY.SHOPPING_BAG,
      action: GTM_ACTION.CLICKED,
      label: 'checkout-button',
    })
    closeMiniBag()
  }

  renderEmptyProducts() {
    const { l } = this.context
    const { closeMiniBag } = this.props
    return (
      <div className="MiniBag-emptyBag">
        <p className="MiniBag-emptyLabel">{l`Your shopping bag is currently empty.`}</p>
        <Button className="Button--primary" clickHandler={closeMiniBag}>
          {l`Continue shopping`}
        </Button>
      </div>
    )
  }

  renderDelivery = () => {
    const { l } = this.context
    const { bagDeliveryOptions } = this.props

    const selectedDeliveryOption =
      bagDeliveryOptions && bagDeliveryOptions.find(({ selected }) => selected)
    // scrAPI returns no selected option in EU
    const deliveryOptionLabel =
      selectedDeliveryOption && selectedDeliveryOption.label

    return (
      deliveryOptionLabel && (
        <div className="MiniBag-summaryRow">
          <span className="MiniBag-leftCol">{l`Delivery`}:</span>
          <span className="MiniBag-rightCol MiniBag-deliveryOption">
            {deliveryOptionLabel}
          </span>
        </div>
      )
    )
  }

  renderDiscount = (discount) => {
    const { l } = this.context

    return discount ? (
      <div className="MiniBag-summaryRow">
        <span className="MiniBag-leftCol">{l`Your discount`}:</span>
        <span className="MiniBag-rightCol MiniBag-discount">
          -<Price price={discount} />
        </span>
      </div>
    ) : null
  }

  renderCheckoutNowButton = (isDisabled) => {
    const { isLockImageEnabled } = this.props
    const { l } = this.context
    const minibagLock = isLockImageEnabled ? 'MiniBag-lock' : ''

    return (
      <div className="MiniBag-summaryButtonSection">
        <Button
          className={`MiniBag-continueButton`}
          clickHandler={this.clickHandler}
          isDisabled={isDisabled}
          ariaLabel={l('Checkout now')}
        >
          <span className={`${minibagLock} translate`}>
            {l('Checkout now')}
          </span>
        </Button>
      </div>
    )
  }

  renderCheckoutNowButtonWithError = () => {
    const { l } = this.context

    return (
      <div className="MiniBag-summaryButtonSection">
        <EnhancedMessage
          header={l`Some items are no longer available.`}
          message={l`Please review your bag.`}
          isError
        >
          {this.renderCheckoutNowButton(true)}
        </EnhancedMessage>
      </div>
    )
  }

  renderBackToCheckout = () => {
    const { l } = this.context
    const { closeMiniBag } = this.props
    return (
      <Button
        className="MiniBag-backToCheckout"
        clickHandler={closeMiniBag}
      >{l`Back to checkout`}</Button>
    )
  }
  getDetailsInfo() {
    const { yourDetails } = this.props
    const details = pluck('value', yourDetails.fields)
    return details
  }

  getAddressInfo() {
    const { yourAddress } = this.props
    const address = pluck('value', yourAddress.fields)
    return { ...this.getDetailsInfo(), ...address }
  }

  renderDeliveryEstimate = () => {
    const { orderSummary } = this.props
    const shippingInfo = {
      ...selectedDeliveryLocation(orderSummary.deliveryLocations),
      estimatedDelivery: orderSummary.estimatedDelivery,
    }
    const isHomeDelivery = /HOME/.test(shippingInfo.deliveryType)
    const address = isHomeDelivery
      ? this.getAddressInfo()
      : { ...this.getDetailsInfo(), ...orderSummary.storeDetails }
    const deliveryType =
      orderSummary.deliveryLocations &&
      orderSummary.deliveryLocations.find(({ selected }) => selected)
        .deliveryLocationType

    return (
      <DeliveryEstimate
        className="miniBag"
        shippingInfo={shippingInfo}
        address={address}
        deliveryType={deliveryType}
      />
    )
  }

  renderBagContent = () => {
    const { l } = this.context
    const {
      bagProducts,
      shoppingBag,
      changeDeliveryType,
      bagSubtotal,
      bagTotal,
      bagDiscount,
      inCheckout,
      pathname,
      isCFSIEnabled,
      isPUDOEnabled,
      bagMessages,
      removeMiniBagMessage,
      bagContainsOutOfStockProduct,
      bagContainsPartiallyOutOfStockProduct,
      bagContainsStandardDeliveryOnlyProduct,
      bagContainsOnlyDDPProduct,
      isFeatureThresholdMessageEnabled,
      bagContainsDDPProduct,
      isDDPActiveUserPreRenewWindow,
    } = this.props
    const deliveryEstimateVisible = /\/checkout\/payment/.test(pathname)
    const promotionCodeVisible = !inCheckout
    const deliveryOptionsVisible = !inCheckout && !bagContainsOnlyDDPProduct
    const shouldDisplayBagDiscountText =
      isFeatureThresholdMessageEnabled &&
      !isDDPActiveUserPreRenewWindow &&
      !bagContainsDDPProduct

    return (
      <div
        className="MiniBag-content"
        ref={(div) => {
          this.miniContent = div
        }}
      >
        {inCheckout && this.renderBackToCheckout()}
        {!inCheckout &&
          (bagContainsOutOfStockProduct || bagContainsPartiallyOutOfStockProduct
            ? this.renderCheckoutNowButtonWithError()
            : this.renderCheckoutNowButton(false))}
        <div className="MiniBag-messages">
          {bagMessages &&
            bagMessages.map((message) => (
              <EnhancedMessage
                key={message.id}
                onTransitionComplete={removeMiniBagMessage}
                {...message}
              />
            ))}
          {bagContainsStandardDeliveryOnlyProduct && (
            <EnhancedMessage
              message={l`Some items are only available via Standard Delivery.`}
            />
          )}
        </div>
        <ShoppingBag
          bagProducts={bagProducts}
          scrollMinibag={this.scrollMinibag}
        />
        {shouldDisplayBagDiscountText && (
          <FreeShippingMessage modifier="minibag" />
        )}
        {deliveryEstimateVisible && this.renderDeliveryEstimate()}
        <Espot
          identifier={constants.miniBag.middle}
          className="MiniBag-espot"
        />
        {promotionCodeVisible && (
          <QubitReact id="qubit-minibag-promo">
            <PromotionCode
              key="PromotionCode"
              isCompactHeader
              gtmCategory={GTM_CATEGORY.SHOPPING_BAG}
              isOpenIfPopulated
              scrollOnPromoCodeError={false}
            />
          </QubitReact>
        )}
        {deliveryOptionsVisible && (
          // @TODO create a selector to pass the filtered options to ShoppingBagDeliveryOptions
          // then we can only pass `options` & `changeDeliveryType` props
          <QubitReact id="qubit-minibag-delivery">
            <ShoppingBagDeliveryOptions
              shoppingBag={shoppingBag}
              changeDeliveryType={changeDeliveryType}
              isCFSIEnabled={isCFSIEnabled}
              isPUDOEnabled={isPUDOEnabled}
            />
          </QubitReact>
        )}
        <div className="MiniBag-summary MiniBag-footer">
          <QubitReact id="qubit-mini-bag-summary">
            <div className="MiniBag-summarySection">
              <QubitReact id="qubit-minibag-labels">
                {!bagContainsOnlyDDPProduct && this.renderDelivery()}
                {this.renderDiscount(bagDiscount)}
              </QubitReact>
              <div tabIndex="0" className="MiniBag-summaryRow MiniBag-bagTotal">
                <span className="MiniBag-leftCol MiniBag-totalCost">
                  <QubitReact id="qubit-minibag-total-wording">
                    {l`Total to pay`}:
                  </QubitReact>
                </span>
                <span className="MiniBag-rightCol MiniBag-totalCost">
                  <QubitReact
                    id="qubit-minibag-total-price"
                    render={() => <Price price={bagSubtotal} />}
                  >
                    <Price price={bagTotal} />
                  </QubitReact>
                </span>
              </div>
            </div>
          </QubitReact>
          {!inCheckout &&
            (bagContainsOutOfStockProduct ||
            bagContainsPartiallyOutOfStockProduct
              ? this.renderCheckoutNowButtonWithError()
              : this.renderCheckoutNowButton(false))}
        </div>
      </div>
    )
  }

  handleClose = () => {
    const { closeMiniBag, sendAnalyticsClickEvent } = this.props
    closeMiniBag()
    sendAnalyticsClickEvent({
      category: GTM_CATEGORY.SHOPPING_BAG,
      action: GTM_ACTION.CLICKED,
      label: GTM_LABEL.CLOSE_BUTTON,
    })
  }

  render() {
    const { l } = this.context
    const {
      bagProducts,
      bagCount,
      loadingShoppingBag,
    } = this.props

    return (
      <div
        role="toolbar"
        className="MiniBag"
        onClick={this.stopAutoClose}
        onTouchStart={this.stopAutoClose}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <Espot identifier={constants.miniBag.top} className="MiniBag-espot" />
        <QubitReact id="qubit-MiniBag-header">
          <div>
            <h3 className="MiniBag-header notranslate">
              <span className="translate">{l`My Bag`}</span>
              {bagCount ? (
                <span className="translate">{` (${bagCount})`}</span>
              ) : null}
            </h3>
            <button
              className="MiniBag-closeButton"
              onClick={this.handleClose}
              role="button"
            >
              <img
                className="MiniBag-closeButtonImg"
                src="/assets/common/images/close-icon.svg"
                alt="close"
              />
            </button>
          </div>
        </QubitReact>
        {loadingShoppingBag ? (
          <Loader />
        ) : !bagProducts.length ? (
          this.renderEmptyProducts()
        ) : (
          this.renderBagContent()
        )}
        <QubitReact id="qubit-minibag-bottom-espot">
          <Espot
            identifier={constants.miniBag.bottom}
            className="MiniBag-espot"
          />
        </QubitReact>
      </div>
    )
  }
}

export default MiniBag
