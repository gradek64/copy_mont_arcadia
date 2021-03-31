import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { pathOr, pluck, isEmpty } from 'ramda'

// Constants
import constants from '../../../constants/espotsDesktop'

// Utilities
import { selectedDeliveryLocation } from '../../../lib/checkout-utilities/reshaper'
import withRestrictedActionDispatch from '../../../lib/restricted-actions'

// Actions
import * as checkoutActions from '../../../actions/common/checkoutActions'
import {
  removeMiniBagMessage,
  deleteFromBag,
} from '../../../actions/common/shoppingBagActions'
import {
  getTrendingProducts,
  getSocialProofBanners,
} from '../../../actions/common/socialProofActions'

// Selectors
import {
  extractDiscountInfo,
  getSubTotal,
  orderContainsOutOfStockProduct,
  orderContainsPartiallyOutOfStockProduct,
  orderContainsStandardDeliveryOnlyProduct,
  getCheckoutOrderCompleted,
} from '../../../selectors/checkoutSelectors'
import { getShoppingBagTotalItems } from '../../../selectors/shoppingBagSelectors'
import {
  isDDPStandaloneOrder,
  isDDPStandaloneOrderCompleted,
} from '../../../selectors/ddpSelectors'
import { getShoppingBagProductsWithInventory } from '../../../selectors/inventorySelectors'
import { isFeatureEnabled } from '../../../selectors/featureSelectors'

// Containers
import Espot from '../../containers/Espot/Espot'

// Components
import OrderProducts from '../OrderProducts/OrderProducts'
import SimpleTotals from '../../common/SimpleTotals/SimpleTotals'
import DeliveryEstimate from '../../common/DeliveryEstimate/DeliveryEstimate'
import EnhancedMessage from '../../common/EnhancedMessage/EnhancedMessage'

// @NOTE this component needs refactoring in able to better distinguish between pre & post order complete states
@withRestrictedActionDispatch({ deleteFromBag })
@connect(
  (state) => ({
    isDDPStandaloneOrder:
      isDDPStandaloneOrder(state) || isDDPStandaloneOrderCompleted(state), // temporary solution till component refactor
    inCheckout: state.routing.location.pathname.includes('/checkout/'),
    yourDetails: state.forms.checkout.yourDetails,
    yourAddress: state.forms.checkout.yourAddress,
    pathName: state.routing.location.pathname,
    orderCompleted: getCheckoutOrderCompleted(state),
    bagProducts: getShoppingBagProductsWithInventory(state),
    discountInfo: extractDiscountInfo(state),
    subTotal: getSubTotal(state),
    totalShoppingBagItems: getShoppingBagTotalItems(state),
    bagMessages: state.shoppingBag.messages,
    orderContainsOutOfStockProduct: orderContainsOutOfStockProduct(state),
    orderContainsPartiallyOutOfStockProduct: orderContainsPartiallyOutOfStockProduct(
      state
    ),
    orderContainsStandardDeliveryOnlyProduct: orderContainsStandardDeliveryOnlyProduct(
      state
    ),
    isFeatureSocialProofCheckoutBadgeEnabled: isFeatureEnabled(
      state,
      'FEATURE_SOCIAL_PROOF_CHECKOUT_BADGE'
    ),
  }),
  {
    ...checkoutActions,
    removeMiniBagMessage,
    getTrendingProducts,
    getSocialProofBanners,
  }
)
class CheckoutBagSide extends Component {
  static propTypes = {
    isDDPStandaloneOrder: PropTypes.bool,
    className: PropTypes.string,
    pathName: PropTypes.string,
    canModify: PropTypes.bool,
    drawer: PropTypes.bool,
    inCheckout: PropTypes.bool,
    orderCompleted: PropTypes.object,
    showDiscounts: PropTypes.bool,
    orderProducts: PropTypes.array,
    orderSummary: PropTypes.object,
    bagProducts: PropTypes.array,
    yourAddress: PropTypes.object,
    yourDetails: PropTypes.object,
    scrollMinibag: PropTypes.func,
    discountInfo: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.string,
        ]),
        label: PropTypes.string,
      })
    ),
    subTotal: PropTypes.string,
    totalShoppingBagItems: PropTypes.number.isRequired,
    bagMessages: PropTypes.array,
    removeMiniBagMessage: PropTypes.func,
    orderContainsOutOfStockProduct: PropTypes.bool,
    orderContainsPartiallyOutOfStockProduct: PropTypes.bool,
    orderContainsStandardDeliveryOnlyProduct: PropTypes.bool,
    isFeatureSocialProofCheckoutBadgeEnabled: PropTypes.bool,
    getTrendingProducts: PropTypes.func.isRequired,
    getSocialProofBanners: PropTypes.func.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  static defaultProps = {
    isDDPStandaloneOrder: false,
    canModify: true,
    showDiscounts: false,
  }

  isOrderCompleted() {
    const { orderCompleted } = this.props
    return (
      typeof orderCompleted === 'object' &&
      Object.keys(orderCompleted).length > 0
    )
  }

  componentDidMount() {
    if (
      this.props.isFeatureSocialProofCheckoutBadgeEnabled &&
      !this.isOrderCompleted()
    ) {
      this.props.getTrendingProducts('checkout')
      this.props.getSocialProofBanners()
    }
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

  getShippingInfo() {
    const { orderSummary, orderCompleted } = this.props
    const { deliveryMethod, deliveryCost, deliveryPrice } = orderCompleted || {}
    return orderSummary && orderSummary.deliveryLocations
      ? {
          ...selectedDeliveryLocation(orderSummary.deliveryLocations),
          estimatedDelivery: orderSummary.estimatedDelivery,
        }
      : { cost: deliveryCost || deliveryPrice, label: deliveryMethod }
  }

  getDeliveryEstimate() {
    const { pathName, orderSummary, isDDPStandaloneOrder } = this.props
    const shippingInfo = this.getShippingInfo()
    if (orderSummary && !isEmpty(orderSummary) && !isDDPStandaloneOrder) {
      const isHomeDelivery = /HOME/.test(shippingInfo.deliveryType)
      const address = isHomeDelivery
        ? this.getAddressInfo()
        : { ...this.getDetailsInfo(), ...orderSummary.storeDetails }
      const shouldDisplayAddress = /\/checkout\/payment/.test(pathName)
      const deliveryType =
        orderSummary.deliveryLocations &&
        orderSummary.deliveryLocations.find(({ selected }) => selected)
          .deliveryLocationType
      return (
        <DeliveryEstimate
          className="checkoutBagSide"
          shippingInfo={shippingInfo}
          address={address}
          shouldDisplayAddress={shouldDisplayAddress}
          deliveryType={deliveryType}
        />
      )
    }
  }

  render() {
    const { l } = this.context
    const {
      isDDPStandaloneOrder,
      bagProducts,
      canModify,
      className,
      drawer,
      inCheckout,
      orderProducts,
      orderSummary,
      scrollMinibag,
      showDiscounts,
      subTotal,
      totalShoppingBagItems,
      bagMessages,
      removeMiniBagMessage,
      orderContainsOutOfStockProduct,
      orderContainsPartiallyOutOfStockProduct,
      orderContainsStandardDeliveryOnlyProduct,
      pathName,
      isFeatureSocialProofCheckoutBadgeEnabled,
    } = this.props
    const discountInfo = showDiscounts ? this.props.discountInfo : []

    const isOrderSummary =
      typeof orderSummary === 'object' && Object.keys(orderSummary).length > 0

    const isOrderCompleted = this.isOrderCompleted()

    if (!(isOrderSummary || isOrderCompleted)) {
      return null
    }

    const products = orderProducts || bagProducts
    const inventoryPositions = pathOr(
      [],
      ['basket', 'inventoryPositions'],
      orderSummary
    )
    const shippingInfo = this.getShippingInfo()

    // we can use orderSummary as it's only for DeliveryEstimate Component which is rendered on !orderCompleted
    const deliveryEstimate = this.getDeliveryEstimate()

    // Used for Simple Totals
    const priceInfo = { subTotal }

    // Used to hide the merged bag message for a user with no order history
    const inPaymentPage = pathName.endsWith('/payment')

    return (
      <div
        className={`CheckoutBagSide${className ? ` ${className}` : ''}${
          drawer ? ' CheckoutBagSide--drawer' : ''
        }`}
      >
        <h3 className="CheckoutBagSide-title">
          {isOrderCompleted
            ? l`Your order`
            : `${l`My Bag`}${
                totalShoppingBagItems ? ` (${totalShoppingBagItems})` : ''
              }`}
        </h3>

        <div className="CheckoutBagSide-messages">
          {bagMessages &&
            !inPaymentPage &&
            bagMessages.map((message) => (
              <EnhancedMessage
                key={message.id}
                onTransitionComplete={removeMiniBagMessage}
                {...message}
              />
            ))}
          {(orderContainsOutOfStockProduct ||
            orderContainsPartiallyOutOfStockProduct) && (
            <EnhancedMessage
              header={l`Some items are no longer available.`}
              message={l`Please review your bag.`}
              isError
            />
          )}
          {orderContainsStandardDeliveryOnlyProduct &&
            !isOrderCompleted && (
              <EnhancedMessage
                message={l`Some items are only available via Standard Delivery.`}
              />
            )}
        </div>

        {isOrderCompleted && (
          <Espot
            identifier={constants.thankyou.sideBar1}
            className="CheckoutBagSide-espot"
          />
        )}
        <OrderProducts
          className="OrderProducts--checkoutBagSide"
          canModify={canModify}
          products={products}
          scrollOnEdit={scrollMinibag}
          allowEmptyBag={!inCheckout}
          scrollable
          drawer={drawer}
          inventoryPositions={inventoryPositions}
          hasDiscountText
          shouldDisplaySocialProofLabel={
            isFeatureSocialProofCheckoutBadgeEnabled && !isOrderCompleted
          }
        />
        {deliveryEstimate}
        {isOrderCompleted && (
          <Espot
            identifier={constants.thankyou.sideBar2}
            className="CheckoutBagSide-espot"
          />
        )}
        {isOrderCompleted && (
          <Espot
            identifier={constants.thankyou.sideBar3}
            className="CheckoutBagSide-espot"
          />
        )}
        <SimpleTotals
          isDDPStandaloneOrder={isDDPStandaloneOrder}
          shippingInfo={shippingInfo}
          priceInfo={priceInfo}
          discounts={discountInfo}
        />
      </div>
    )
  }
}

export default CheckoutBagSide
