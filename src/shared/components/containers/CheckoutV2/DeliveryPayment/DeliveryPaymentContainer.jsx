import React, { Component } from 'react'
import { all, compose, isNil, path, pathOr, pick, pluck, values } from 'ramda'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// components
import CheckoutContentContainer from '../shared/CheckoutContentContainer'
import PaymentDetailsContainer from '../shared/PaymentDetailsContainer'
import DeliveryOptionsContainer from '../shared/DeliveryOptionsContainer'
import DeliveryMethodsContainer from '../shared/DeliveryMethodsContainer'
import PromotionCode from '../../../../components/containers/PromotionCode/PromotionCode'
import GiftCardsContainer from '../shared/GiftCardsContainer'
import StoreDeliveryContainer from '../shared/StoreDeliveryContainer'
import DeliveryAddressDetailsContainer from '../shared/DeliveryAddressDetailsContainer'
import TotalCost from '../shared/TotalCost'
import Espot from '../../Espot/Espot'
import SavePaymentDetailsCheckboxContainer from '../shared/SavePaymentDetailsCheckboxContainer'
import PaymentBtnWithTC from '../shared/PaymentBtnWithTC'
import OrderErrorMessageContainer from '../shared/OrderErrorMessageContainer'
import DDPRenewal from '../shared/DigitalDeliveryPass/DDPRenewal'
// eslint-disable-next-line import/no-named-as-default
import AddressBook from '../../AddressBook/AddressBook'
import OrderSummaryEspot from '../Delivery/OrderSummaryEspot'
import DeviceDataCollectionIFrame from '../../DeviceDataCollectionIFrame/DeviceDataCollectionIFrame'
import Separator from '../../../common/Separator/Separator'

// actions
import { sendEvent } from '../../../../actions/common/googleAnalyticsActions'

// selectors
import { getOrderDetails } from '../../../../selectors/common/orderDetails'
import { isMobile } from '../../../../selectors/viewportSelectors'
import {
  getDeliveryPaymentPageFormNames,
  getDeliveryPaymentPageFormErrors,
  isOutOfStock,
  hasSelectedStore,
  selectedDeliveryLocationTypeEquals,
  getCheckoutOrderSummary,
  getCheckoutPrePaymentConfig,
  getCheckoutOrderSummaryShippingCountry,
  shouldMountDDCIFrame,
} from '../../../../selectors/checkoutSelectors'
import {
  isDDPOrder,
  isDDPStandaloneOrder,
} from '../../../../selectors/ddpSelectors'
import {
  isFeatureAddressBookEnabled,
  isFeatureMobileCheckoutEspotEnabled,
  isFeaturePaypalSmartButtonsEnabled,
} from '../../../../selectors/featureSelectors'
import { getSelectedPaymentType } from '../../../../selectors/formsSelectors'

import { validateDDPForCountry } from '../../../../../shared/actions/common/ddpActions'
import { whenCheckedOut } from '../../../../decorators/checkoutDecorators'
import analyticsDecorator from '../../../../../client/lib/analytics/analytics-decorator'
import { selectedDeliveryLocation } from '../../../../lib/checkout-utilities/reshaper'
import { giftCardCoversTotal } from '../../../../lib/checkout'
import { fixTotal } from '../../../../lib/checkout-utilities/helpers'
import espotsDesktopConstants from '../../../../constants/espotsDesktop'
import { GTM_CATEGORY } from '../../../../analytics/analytics-constants'
import { PAYPAL } from '../../../../constants/paymentTypes'

const mapStateToProps = (state = {}) => {
  const orderDetails = getOrderDetails({
    config: {},
    ...state,
  })

  return {
    isDDPStandaloneOrder: isDDPStandaloneOrder(state),
    orderDetails: compose(
      all(isNil),
      values
    )(orderDetails)
      ? undefined
      : orderDetails,
    isMobile: isMobile(state),
    shippingCountry: getCheckoutOrderSummaryShippingCountry(state),
    orderSummary: getCheckoutOrderSummary(state),
    formNames: getDeliveryPaymentPageFormNames(state),
    formErrors: getDeliveryPaymentPageFormErrors(state),
    isHomeDeliverySelected: selectedDeliveryLocationTypeEquals(state, 'HOME'),
    hasSelectedStore: hasSelectedStore(state),
    isFeatureAddressBookEnabled: isFeatureAddressBookEnabled(state),
    isDDPOrder: isDDPOrder(state),
    isOutOfStock: isOutOfStock(state),
    billingCardDetails: state.forms.checkout.billingCardDetails,
    isFeatureMobileCheckoutEspotEnabled: isFeatureMobileCheckoutEspotEnabled(
      state
    ),
    mountDDCIFrame: shouldMountDDCIFrame(state),
    prePaymentConfig: getCheckoutPrePaymentConfig(state),
    selectedPaymentMethod: getSelectedPaymentType(state),
    isNewPaypalEnabled: isFeaturePaypalSmartButtonsEnabled(state),
  }
}

const mapDispatchToProps = {
  sendEvent,
  validateDDPForCountry,
}

class DeliveryPaymentContainer extends Component {
  static propTypes = {
    isDDPStandaloneOrder: PropTypes.bool.isRequired,
    isFeatureAddressBookEnabled: PropTypes.bool.isRequired,
    orderSummary: PropTypes.object.isRequired,
    isMobile: PropTypes.bool,
    formNames: PropTypes.arrayOf(PropTypes.string),
    formErrors: PropTypes.object,
    isHomeDeliverySelected: PropTypes.bool,
    hasSelectedStore: PropTypes.bool,
    isDDPOrder: PropTypes.bool,
    isFeatureMobileCheckoutEspotEnabled: PropTypes.bool,
    mountDDCIFrame: PropTypes.bool,
    prePaymentConfig: PropTypes.object,
    isNewPaypalEnabled: PropTypes.bool.isRequired,
    selectedPaymentMethod: PropTypes.string.isRequired,
    // functions
    sendEvent: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isDDPStandaloneOrder: false,
    bagContainsOnlyDDPProduct: false,
    isMobile: false,
    orderSummary: {},
    hasPaymentMethods: false,
    orderDetails: undefined,
    formNames: [],
    formErrors: {},
    isHomeDeliverySelected: false,
    hasSelectedStore: false,
    isFeatureAddressBookEnabled: false,
    isDDPOrder: false,
    isOutOfStock: false,
    isFeatureMobileCheckoutEspotEnabled: false,
    mountDDCIFrame: false,
    prePaymentConfig: null,
  }

  static contextTypes = {
    l: PropTypes.func,
    p: PropTypes.func,
  }

  componentDidMount() {
    const { sendEvent } = this.props
    sendEvent('Checkout', 'DeliveryPayment', 'Delivery and Payment')
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isDDPOrder && this.props.isDDPOrder) {
      const { validateDDPForCountry, shippingCountry } = this.props
      validateDDPForCountry(shippingCountry)
    }
  }

  render() {
    const { l, p } = this.context
    const {
      isDDPStandaloneOrder,
      isMobile,
      isHomeDeliverySelected,
      hasSelectedStore,
      orderSummary,
      formNames,
      formErrors,
      isFeatureAddressBookEnabled,
      isOutOfStock,
      billingCardDetails,
      isFeatureMobileCheckoutEspotEnabled,
      mountDDCIFrame,
      prePaymentConfig,
      selectedPaymentMethod,
      isNewPaypalEnabled,
    } = this.props

    let shippingInfo
    let priceInfo
    let discounts
    let calculateTotal

    if (orderSummary && orderSummary.deliveryLocations && orderSummary.basket) {
      shippingInfo = {
        ...selectedDeliveryLocation(orderSummary.deliveryLocations),
        estimatedDelivery: orderSummary.estimatedDelivery,
      }
      priceInfo = pick(['subTotal'], orderSummary.basket)
      discounts = path(['basket', 'discounts'], orderSummary)
      calculateTotal = fixTotal(
        priceInfo.subTotal,
        shippingInfo.cost,
        pluck('value', discounts)
      )
    }

    const giftCards = pathOr(null, ['giftCards'], orderSummary)
    const basketTotal = pathOr(null, ['basket', 'total'], orderSummary)
    const paymentType = pathOr(
      '',
      ['fields', 'paymentType', 'value'],
      billingCardDetails
    )
    const deliveryAddress = isFeatureAddressBookEnabled ? (
      <AddressBook />
    ) : (
      <DeliveryAddressDetailsContainer />
    )

    return (
      <div className="DeliveryPaymentContainer">
        <CheckoutContentContainer>
          <Helmet title={l`Delivery and Payment`} />
          {mountDDCIFrame && (
            <DeviceDataCollectionIFrame prePaymentConfig={prePaymentConfig} />
          )}
          {isMobile && <TotalCost totalCost={p(calculateTotal)} />}
          <PromotionCode
            isOpenIfPopulated
            isContentPadded={false}
            gtmCategory={GTM_CATEGORY.CHECKOUT}
          />
          <Separator margin='0 0 30px'/>
          {!isDDPStandaloneOrder && <DeliveryOptionsContainer />}
          <Separator/>
          {isDDPStandaloneOrder && <DDPRenewal canShowAdded />}
          <OrderSummaryEspot
            isMobile={isMobile}
            isFeatureMobileCheckoutEspotEnabled={
              isFeatureMobileCheckoutEspotEnabled
            }
          />
          <StoreDeliveryContainer />
          {(isHomeDeliverySelected || hasSelectedStore) && (
            <div>
              {isHomeDeliverySelected && deliveryAddress}
              <Separator/>
              {!isDDPStandaloneOrder && [
                <DeliveryMethodsContainer/>,
                <Espot
                  identifier={espotsDesktopConstants.orderSummary.toBeDefined}
                />,
              ]}
              <Separator margin='30px 0 0'/>
              <div className="DeliveryPaymentContainer-wrapper">
                <GiftCardsContainer showTotal />
              </div>
              {!giftCardCoversTotal(giftCards, basketTotal) && (
                <PaymentDetailsContainer />
              )}
              <SavePaymentDetailsCheckboxContainer />
              <PaymentBtnWithTC
                isDDPStandaloneOrder={isDDPStandaloneOrder}
                isMobile={isMobile}
                shippingInfo={shippingInfo}
                priceInfo={priceInfo}
                discounts={discounts}
                formNames={formNames}
                formErrors={formErrors}
                paymentType={paymentType}
                paypalSmartButtons={
                  isNewPaypalEnabled && selectedPaymentMethod === PAYPAL
                }
              />
              {!isOutOfStock && <OrderErrorMessageContainer />}
            </div>
          )}
        </CheckoutContentContainer>
      </div>
    )
  }
}

export default analyticsDecorator('delivery-payment', { isAsync: true })(
  whenCheckedOut(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(DeliveryPaymentContainer)
  )
)

export { DeliveryPaymentContainer, mapStateToProps, mapDispatchToProps }
