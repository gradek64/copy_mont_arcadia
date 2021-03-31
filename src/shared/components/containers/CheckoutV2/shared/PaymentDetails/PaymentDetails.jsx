import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { pluck } from 'ramda'

import * as types from './types'
import * as paymentTypes from '../../../../../constants/paymentTypes'

// components
import PaymentMethodPreview from './PaymentMethods/PaymentMethodPreview'
import AddressPreview from '../../../../common/AddressPreview/AddressPreview'
import BillingDetailsForm from '../DetailsForm/BillingDetailsForm'
import BillingAddressForm from '../AddressForm/BillingAddressForm'
import CheckoutTitle from '../CheckoutTitle'

// Const
import { paymentMethod as paymentMethodType } from '../../../../../constants/propTypes/paymentMethods'
import PaymentMethodsOptions from './PaymentMethodOptions'

class PaymentDetails extends Component {
  static propTypes = {
    billingAddressForm: PropTypes.object.isRequired,
    billingDetailsForm: PropTypes.object.isRequired,
    combinedPaymentMethods: PropTypes.arrayOf(types.combinedPaymentMethod)
      .isRequired,
    inDeliveryAndPayment: PropTypes.bool.isRequired,
    isMobileBreakpoint: PropTypes.bool.isRequired,
    storedPaymentDetails: types.paymentDetails.isRequired,
    storedCombinedPaymentMethod: types.combinedPaymentMethod,
    storedPaymentMethod: paymentMethodType,
    showPaymentForm: PropTypes.bool.isRequired,
    setFormField: PropTypes.func.isRequired,
    setManualAddressMode: PropTypes.func.isRequired,
    shoppingBagTotalItems: PropTypes.number.isRequired,
    saveSelectedPaymentMethod: PropTypes.func.isRequired,
    selectedPaymentMethod: PropTypes.string.isRequired,
    storedCardHasExpired: PropTypes.bool,
    openPaymentMethods: PropTypes.func,
    closePaymentMethods: PropTypes.func,
    userAccountSelectedPaymentMethod: PropTypes.string.isRequired,
    isApplePayAvailableWithActiveCard: PropTypes.bool.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  static defaultProps = {
    billingAddressForm: {},
    billingDetailsForm: {},
    combinedPaymentMethods: [{}],
    inDeliveryAndPayment: false,
    isMobileBreakpoint: false,
    showPaymentForm: false,
    setManualAddressMode: () => {},
    shoppingBagTotalItems: 0,
    saveSelectedPaymentMethod: () => {},
    selectedPaymentMethod: '',
  }

  constructor(props) {
    super(props)

    /* @showPaymentPreview
     *
     * storedPaymentDetails.type: { String } When storedPaymentDetails.type is
     * an empty string it sets "showPaymentPreview" to false.
     *
     * props.showPaymentForm: { boolean } If payment form is loaded it will
     * set "showPaymentPreview" to false.
     *
     *  */
    this.state = {
      showPaymentPreview:
        (!!props.storedPaymentDetails.type && !props.showPaymentForm) ||
        props.storedCardHasExpired,
      showAddressPreview: true,
    }
  }

  componentDidMount() {
    const { storedCombinedPaymentMethod } = this.props

    if (storedCombinedPaymentMethod) {
      this.savePaymentMethod(storedCombinedPaymentMethod.value)
    }
  }

  handlePaymentMethodPreviewChange = () => {
    const { setFormField, openPaymentMethods } = this.props
    setFormField('billingCardDetails', 'paymentType', null, null, {
      isDirty: false,
    })
    openPaymentMethods()
    this.setState({
      showPaymentPreview: false,
    })
  }

  loginNotice = (selectedAPMLabel) => {
    const { l } = this.context

    return l`You will be asked to log onto ${selectedAPMLabel} to confirm your order`
  }

  handleAddressPreviewChange() {
    this.props.setManualAddressMode()
    this.setState({ showAddressPreview: false })
  }

  renderBillingAddressPreviewOrForm() {
    const {
      billingAddressForm,
      billingDetailsForm,
      isMobileBreakpoint,
    } = this.props
    const { showAddressPreview } = this.state

    return showAddressPreview ? (
      <div className="PaymentDetails-wrapper">
        <AddressPreview
          address={pluck('value', billingAddressForm.fields)}
          details={pluck('value', billingDetailsForm.fields)}
          onClickChangeButton={() => this.handleAddressPreviewChange()}
          heading
          rightAlignedButton
        />
      </div>
    ) : (
      <div className="PaymentDetails-wrapper">
        <BillingDetailsForm renderTelephone={isMobileBreakpoint} />
        <BillingAddressForm renderTelephone={!isMobileBreakpoint} />
      </div>
    )
  }

  savePaymentMethod = (paymentMethod) => {
    const { selectedPaymentMethod, saveSelectedPaymentMethod } = this.props
    if (selectedPaymentMethod !== paymentMethod) {
      saveSelectedPaymentMethod(paymentMethod)
    }
  }

  renderPaymentPreview() {
    const {
      storedPaymentDetails,
      storedPaymentMethod,
      storedCombinedPaymentMethod,
      shoppingBagTotalItems,
      storedCardHasExpired,
      closePaymentMethods,
    } = this.props
    const { l } = this.context

    return storedCombinedPaymentMethod ? (
      <PaymentMethodPreview
        onChange={this.handlePaymentMethodPreviewChange}
        type={storedCombinedPaymentMethod.type}
        value={storedCombinedPaymentMethod.value}
        storedPaymentMethod={storedPaymentMethod}
        shoppingBagTotalItems={shoppingBagTotalItems}
        storedCardHasExpired={storedCardHasExpired}
        closePaymentMethods={closePaymentMethods}
      >
        {storedCombinedPaymentMethod.type === 'OTHER' ? (
          <div>
            <p className="PaymentDetails-preview">
              {l(storedCombinedPaymentMethod.label)}
            </p>
            {storedCombinedPaymentMethod.value !== paymentTypes.APPLEPAY && (
              <p className="PaymentDetails-preview">
                {storedCombinedPaymentMethod.description}
              </p>
            )}
          </div>
        ) : (
          <div>
            <p className="PaymentDetails-preview">
              {l`Ending in`}:{' '}
              {storedPaymentDetails.cardNumberStar &&
                storedPaymentDetails.cardNumberStar.replace(/\*/g, '')}
            </p>
            <p className="PaymentDetails-preview">
              {l`Expires on`}: {storedPaymentDetails.expiryMonth}/{
                storedPaymentDetails.expiryYear
              }
            </p>
          </div>
        )}
      </PaymentMethodPreview>
    ) : null
  }

  renderPaymentMethodsOrPreview() {
    const previewPayment = this.state.showPaymentPreview
    const {
      isCountrySupportedByKlarna,
      userAccountSelectedPaymentMethod,
      isApplePayAvailableWithActiveCard,
    } = this.props
    const klarnaNotSupported =
      userAccountSelectedPaymentMethod === paymentTypes.KLARNA &&
      !isCountrySupportedByKlarna

    const applePayNotSupported =
      userAccountSelectedPaymentMethod === paymentTypes.APPLEPAY &&
      !isApplePayAvailableWithActiveCard

    if (previewPayment) {
      // Klarna: Checking if the latest order was paid with klarna and if the current
      // selected delivery country is supported by klarna. If the country is not
      // supported by klarna we show the payment options
      // ApplePay: if the latest order was paid with ApplePay and user user log in
      // with a not supported ApplePay device, we will show the payment options.
      if (klarnaNotSupported || applePayNotSupported) {
        return (
          <PaymentMethodsOptions
            savePaymentMethod={this.savePaymentMethod}
            loginNotice={this.loginNotice}
          />
        )
      }

      return this.renderPaymentPreview()
    }

    return (
      <PaymentMethodsOptions
        savePaymentMethod={this.savePaymentMethod}
        loginNotice={this.loginNotice}
      />
    )
  }

  render() {
    const { inDeliveryAndPayment, combinedPaymentMethods } = this.props

    return (
      <div className="PaymentDetails">
        <CheckoutTitle separator={inDeliveryAndPayment}>
          {this.context.l`Payment details`}
        </CheckoutTitle>
        {inDeliveryAndPayment && this.renderBillingAddressPreviewOrForm()}
        <CheckoutTitle subheader>{this.context.l`Payment type`}</CheckoutTitle>
        {!!combinedPaymentMethods.length &&
          this.renderPaymentMethodsOrPreview()}
      </div>
    )
  }
}

export default PaymentDetails
