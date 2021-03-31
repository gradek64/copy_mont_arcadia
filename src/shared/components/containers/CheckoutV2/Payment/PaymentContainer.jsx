import PropTypes from 'prop-types'
import { path, pluck, pick, pathOr } from 'ramda'
import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'

// Utilities
import { giftCardCoversTotal } from '../../../../lib/checkout'
import { fixTotal } from '../../../../lib/checkout-utilities/helpers'
import { selectedDeliveryLocation } from '../../../../lib/checkout-utilities/reshaper'
import analyticsDecorator from '../../../../../client/lib/analytics/analytics-decorator'
import { GTM_CATEGORY } from '../../../../analytics'
import espotsDesktopConstants from '../../../../constants/espotsDesktop'
import { PAYPAL } from '../../../../constants/paymentTypes'

// CheckoutV2
import BillingAddressForm from '../shared/AddressForm/BillingAddressForm'
import BillingDetailsForm from '../shared/DetailsForm/BillingDetailsForm'
import CheckoutTitle from '../shared/CheckoutTitle'
import GiftCardsContainer from '../shared/GiftCardsContainer'
import OrderErrorMessageContainer from '../shared/OrderErrorMessageContainer'
import PaymentBtnWithTC from '../shared/PaymentBtnWithTC'
import PaymentDetailsContainer from '../shared/PaymentDetailsContainer'
import SavePaymentDetailsCheckboxContainer from '../shared/SavePaymentDetailsCheckboxContainer'
import TotalCost from '../shared/TotalCost'

// Components
import Checkbox from '../../../common/FormComponents/Checkbox/Checkbox'
import QuickViewOrderSummary from '../../../common/QuickViewOrderSummary/QuickViewOrderSummary'
import AddressPreview from '../../../common/AddressPreview/AddressPreview'

// Containers
import Espot from '../../Espot/Espot'
import DeviceDataCollectionIFrame from '../../DeviceDataCollectionIFrame/DeviceDataCollectionIFrame'
import PromotionCode from '../../PromotionCode/PromotionCode'

// Actions
import { sendEvent } from '../../../../actions/common/googleAnalyticsActions'
import { openMiniBag } from '../../../../actions/common/shoppingBagActions'
import { getAllPaymentMethods } from '../../../../actions/common/paymentMethodsActions'
import {
  resetFormPartial,
  setFormField,
  setFormMeta,
  touchedFormField,
  touchedMultipleFormFields,
} from '../../../../actions/common/formActions'
import {
  resetAddress,
  setDeliveryAsBillingFlag,
  copyDeliveryValuesToBillingForms,
  resetBillingForms,
  selectDeliveryCountry,
  validateForms,
} from '../../../../actions/common/checkoutActions'

// Selectors
import { isDDPStandaloneOrder } from '../../../../selectors/ddpSelectors'
import {
  getAddressForm,
  getDetailsForm,
  getErrors,
  selectedDeliveryLocationTypeEquals,
  isOutOfStock,
  getCheckoutPrePaymentConfig,
  shouldMountDDCIFrame,
  isGuestOrder,
} from '../../../../selectors/checkoutSelectors'
import {
  isMobile,
  isMobileBreakpoint,
} from '../../../../selectors/viewportSelectors'
import { getBrandDisplayName } from '../../../../selectors/configSelectors'
import { isGuestRecaptchaEnabled } from '../../../../selectors/recaptchaSelectors'
import { getSelectedPaymentType } from '../../../../selectors/formsSelectors'
import { isFeaturePaypalSmartButtonsEnabled } from '../../../../selectors/featureSelectors'

const formNames = [
  'billingDetails',
  'billingAddress',
  'billingFindAddress',
  'giftCard',
  'billingCardDetails',
  'order',
]

const mapStateToProps = (state) => ({
  brandName: getBrandDisplayName(state),
  isDDPStandaloneOrder: isDDPStandaloneOrder(state),
  billingAddress: getAddressForm('billingCheckout', state), // @TODO REFACTOR
  billingDetails: getDetailsForm('billingCheckout', state), // @TODO REFACTOR
  billingCardDetails: state.forms.checkout.billingCardDetails,
  yourAddress: getAddressForm('deliveryCheckout', state), // @TODO REFACTOR
  yourDetails: getDetailsForm('deliveryCheckout', state), // @TODO REFACTOR
  isMobile: isMobile(state),
  isMobileBreakpoint: isMobileBreakpoint(state),
  location: state.routing.location,
  shoppingBag: state.shoppingBag,
  orderSummary: state.checkout.orderSummary,
  orderSummaryHash: state.klarna.orderSummaryHash,
  useDeliveryAsBilling: state.checkout.useDeliveryAsBilling,
  homeDeliverySelected: selectedDeliveryLocationTypeEquals(state, 'HOME'),
  errorMessage: path(
    ['forms', 'checkout', 'order', 'message', 'message'],
    state
  ),
  formErrors: getErrors(formNames, state),
  isOutOfStock: isOutOfStock(state),
  isGuestOrder: isGuestOrder(state),
  mountDDCIFrame: shouldMountDDCIFrame(state),
  prePaymentConfig: getCheckoutPrePaymentConfig(state),
  isGuestRecaptchaEnabled: isGuestRecaptchaEnabled(state),
  selectedPaymentMethod: getSelectedPaymentType(state),
  isNewPaypalEnabled: isFeaturePaypalSmartButtonsEnabled(state),
})

const mapDispatchToProps = {
  resetAddress,
  setDeliveryAsBillingFlag,
  copyDeliveryValuesToBillingForms,
  resetBillingForms,
  selectDeliveryCountry,
  resetFormPartial,
  setFormField,
  setFormMeta,
  touchedFormField,
  touchedMultipleFormFields,
  openMiniBag,
  validateForms,
  sendEvent,
}

class PaymentContainer extends Component {
  static propTypes = {
    brandName: PropTypes.string.isRequired,
    isDDPStandaloneOrder: PropTypes.bool.isRequired,
    orderSummary: PropTypes.object.isRequired,
    location: PropTypes.object,
    yourDetails: PropTypes.object,
    billingAddress: PropTypes.object,
    billingCardDetails: PropTypes.object,
    resetAddress: PropTypes.func,
    openMiniBag: PropTypes.func,
    orderSummaryHash: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    setDeliveryAsBillingFlag: PropTypes.func,
    homeDeliverySelected: PropTypes.bool,
    formErrors: PropTypes.object,
    sendEvent: PropTypes.func.isRequired,
    isOutOfStock: PropTypes.bool,
    mountDDCIFrame: PropTypes.bool,
    prePaymentConfig: PropTypes.object,
    isGuestOrder: PropTypes.bool,
    isGuestRecaptchaEnabled: PropTypes.bool.isRequired,
    isNewPaypalEnabled: PropTypes.bool.isRequired,
    selectedPaymentMethod: PropTypes.string.isRequired,
  }

  static defaultProps = {
    isDDPStandaloneOrder: false,
    errorMessage: undefined,
    formNames,
    formErrors: {},
    isOutOfStock: false,
    mountDDCIFrame: false,
    prePaymentConfig: null,
  }

  static contextTypes = {
    l: PropTypes.func,
    p: PropTypes.func,
  }

  static needs = [getAllPaymentMethods]

  componentDidMount() {
    const element =
      this.props.location.hash &&
      document.getElementById(this.props.location.hash.substring(1))
    const scrollPos = element ? element.offsetTop : 0

    window.scrollTo(0, scrollPos)

    if (!this.props.useDeliveryAsBilling) {
      // N.B This resets the find address search state, not the users address info.
      this.props.resetAddress()
    }

    this.props.sendEvent('Checkout', 'Payment', 'Billing Options')
  }

  onChangeDeliveryAsBilling = (checked) => {
    const {
      setDeliveryAsBillingFlag,
      copyDeliveryValuesToBillingForms,
      resetBillingForms,
    } = this.props
    if (checked) {
      copyDeliveryValuesToBillingForms()
    } else {
      resetBillingForms()
    }
    setDeliveryAsBillingFlag(checked)
  }

  onChangeBillingAddress = () => {
    this.props.setDeliveryAsBillingFlag(false)
  }

  onSetBillingDetailsFormField = (formName, field, value, key) => {
    const { setFormField, setDeliveryAsBillingFlag, yourDetails } = this.props
    const deliveryValue = path(['fields', field, 'value'], yourDetails)
    if (deliveryValue !== value) {
      setDeliveryAsBillingFlag(false)
    }
    setFormField(formName, field, value, key)
  }

  render() {
    const { l, p } = this.context
    const {
      isDDPStandaloneOrder,
      billingAddress,
      billingCardDetails,
      isMobile,
      orderSummary,
      openMiniBag,
      orderSummary: { giftCards, basket },
      useDeliveryAsBilling,
      yourDetails,
      homeDeliverySelected,
      formErrors,
      isOutOfStock,
      isGuestOrder,
      mountDDCIFrame,
      prePaymentConfig,
      brandName,
      isGuestRecaptchaEnabled,
      selectedPaymentMethod,
      isNewPaypalEnabled,
    } = this.props
    let calculateTotal
    let shippingInfo
    let priceInfo
    let discounts
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

    const paymentType = pathOr(
      '',
      ['fields', 'paymentType', 'value'],
      billingCardDetails
    )
    const billingFormsHidden = homeDeliverySelected && useDeliveryAsBilling

    if (!Object.keys(orderSummary).length) return null

    return (
      <section className="PaymentContainer PaymentContainer--v2">
        <Helmet title={l`Billing Options`} />
        {mountDDCIFrame && (
          <DeviceDataCollectionIFrame prePaymentConfig={prePaymentConfig} />
        )}
        <QuickViewOrderSummary
          isMobile={isMobile}
          openMiniBag={openMiniBag}
          l={l}
          totalCost={p(calculateTotal)}
        />
        <div className="PaymentContainer-content">
          {isMobile && <TotalCost totalCost={p(calculateTotal)} />}
          <PromotionCode
            isOpenIfPopulated
            isContentPadded={false}
            key="PromotionCode"
            gtmCategory={GTM_CATEGORY.CHECKOUT}
          />
          <CheckoutTitle separator>{l`Billing address`}</CheckoutTitle>
          <Checkbox
            className="PaymentContainer-checkbox"
            checked={{ value: useDeliveryAsBilling }}
            onChange={() =>
              this.onChangeDeliveryAsBilling(!useDeliveryAsBilling)
            }
            name="deliveryAsBilling"
          >
            {l`Same as delivery address`}
          </Checkbox>
          <div className="PaymentContainer-sectionWrapper">
            {billingFormsHidden ? (
              <AddressPreview
                address={pluck('value', billingAddress.fields)}
                details={pluck('value', yourDetails.fields)}
                onClickChangeButton={this.onChangeBillingAddress}
                rightAlignedButton
              />
            ) : (
              <div>
                <BillingDetailsForm />
                <BillingAddressForm />
              </div>
            )}
            <Espot
              identifier={espotsDesktopConstants.orderSummary.discountIntro}
            />
          </div>
          <div className="PaymentContainer-sectionWrapper">
            <GiftCardsContainer showTotal />
          </div>

          <Espot identifier={espotsDesktopConstants.orderSummary.toBeDefined} />

          {giftCards &&
            basket &&
            !giftCardCoversTotal(giftCards, basket.total) &&
            (!orderSummary.creditCard || billingCardDetails.isShown) && (
              <PaymentDetailsContainer />
            )}
          {!isGuestOrder && <SavePaymentDetailsCheckboxContainer />}
          <div className="PaymentContainer-sectionWrapper">
            <PaymentBtnWithTC
              brandName={brandName}
              isDDPStandaloneOrder={isDDPStandaloneOrder}
              isMobile={isMobile}
              shippingInfo={shippingInfo}
              priceInfo={priceInfo}
              discounts={discounts}
              formNames={formNames}
              formErrors={formErrors}
              paymentType={paymentType}
              isGuestOrder={isGuestOrder}
              isGuestRecaptchaEnabled={isGuestRecaptchaEnabled}
              paypalSmartButtons={
                isNewPaypalEnabled && selectedPaymentMethod === PAYPAL
              }
            />
          </div>
          {!isOutOfStock && <OrderErrorMessageContainer />}
        </div>
      </section>
    )
  }
}

export default analyticsDecorator('payment-details', {
  isAsync: false,
})(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PaymentContainer)
)

export {
  PaymentContainer as WrappedPaymentContainer,
  mapStateToProps,
  mapDispatchToProps,
}
