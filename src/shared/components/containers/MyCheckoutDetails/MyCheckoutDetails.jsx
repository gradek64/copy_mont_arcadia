import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { equals, path, pathOr, pluck, pick, omit, isEmpty } from 'ramda'
import { browserHistory } from 'react-router'

// components
import AccountHeader from '../../common/AccountHeader/AccountHeader'
import DeliveryAddressPreviewEditable from './DeliveryAddress/DeliveryAddressPreviewEditable'
import BillingAddressPreviewEditable from './BillingAddress/BillingAddressPreviewEditable'
import MCDPaymentMethodPreviewEditable from './PaymentDetails/MCDPaymentMethodPreviewEditable'
import DDPSubscription from './DDP/DDPSubscription'
import DDPRenewal from '../../containers/CheckoutV2/shared/DigitalDeliveryPass/DDPRenewal'

// common components
import Button from '../../common/Button/Button'
import Message from '../../common/FormComponents/Message/Message'

// Schemas
import {
  getYourDetailsSchema,
  getYourAddressSchema,
  getFindAddressSchema,
} from '../../../schemas/validation/addressFormValidationSchema'
import { getPaymentMethodFormValidationSchema } from '../../../schemas/validation/paymentFormValidationSchema'

// actions
import {
  updateMyCheckoutDetails,
  getMyCheckoutDetailsData,
  setMyCheckoutDetailsInitialFocus,
} from '../../../actions/common/accountActions'
import {
  setFormField,
  touchedFormField,
  setFormMessage,
  resetForm,
} from '../../../actions/common/formActions'
import { getAllPaymentMethods } from '../../../actions/common/paymentMethodsActions'

// Selectors
import {
  getUser,
  getMyCheckoutDetailsEditingEnabled,
  getMyCheckoutDetailForm,
  getMCDPaymentMethodForm,
  getSelectedPaymentMethodValue,
  isSaveMyCheckoutDetailsDisabled,
  getPaymentCardDetailsMCD,
} from '../../../selectors/common/accountSelectors'
import {
  getFormNames,
  getIsFindAddressVisible,
  getCountryFor,
  getAddressForm,
} from '../../../selectors/formsSelectors'
import {
  getPaymentMethodTypeByValue,
  getPaymentMethods as getPaymentMethodsSelector,
} from '../../../selectors/paymentMethodSelectors'
import { getVisited } from '../../../selectors/common/routingSelectors'
import {
  getPostCodeRules,
  getCountriesByAddressType,
} from '../../../selectors/common/configSelectors'
import {
  isCurrentOrRecentDDPSubscriber,
  isDDPRenewablePostWindow,
} from '../../../selectors/ddpSelectors'
import { isMobile } from '../../../selectors/viewportSelectors'
import { getBrandCode } from '../../../selectors/configSelectors'
import {
  isFeatureDDPEnabled,
  isFeatureDDPRenewable,
} from '../../../selectors/featureSelectors'
import { getDDPProduct } from '../../../selectors/siteOptionsSelectors'

// libs
import { validate } from '../../../lib/validator/index'
import { scrollElementIntoView, scrollToTop } from '../../../lib/scroll-helper'

// decorators
import { connect } from 'react-redux'
import analyticsDecorator from '../../../../client/lib/analytics/analytics-decorator'

// Component Helper
export function composeFindAdressValidationSchema(state, addressType) {
  const addressFormName = getFormNames(addressType).address
  const findAddressFormName = getFormNames(addressType).findAddress
  const country = getCountryFor(addressType, addressFormName, state)
  const addressForm = getAddressForm(addressType, addressFormName, state)
  const findAddressForm = getAddressForm(
    addressType,
    findAddressFormName,
    state
  )
  const postCodeRules = getPostCodeRules(state, country)
  const hasFoundAddress = !path(
    ['fields', 'findAddress', 'value'],
    findAddressForm
  )
  const hasSelectedAddress = !!path(
    ['fields', 'address1', 'value'],
    addressForm
  )
  const isFindAddressVisible = getIsFindAddressVisible(
    addressType,
    addressFormName,
    country,
    state
  )
  return isFindAddressVisible
    ? getFindAddressSchema(postCodeRules, {
        hasFoundAddress,
        hasSelectedAddress,
      })
    : {}
}
export function composeAdressValidationSchema(state, addressType) {
  const addressFormName = getFormNames(addressType).address
  const country = getCountryFor(addressType, addressFormName, state)
  const postCodeRules = getPostCodeRules(state, country)
  const countries = getCountriesByAddressType(state, addressType)
  return getYourAddressSchema(postCodeRules, countries)
}
export function composeDetailsValidationSchema(state, addressType) {
  const addressFormName = getFormNames(addressType).address
  const country = getCountryFor(addressType, addressFormName, state)
  return getYourDetailsSchema(country)
}
export function composeSelectedPaymentMethodType(state) {
  const value = getSelectedPaymentMethodValue(state)
  return getPaymentMethodTypeByValue(state, value)
}

@analyticsDecorator('my-checkout-details', { isAsync: false })
@connect(
  (state) => ({
    paymentMethods: getPaymentMethodsSelector(state),
    user: getUser(state),
    myCheckoutDetailsForm: getMyCheckoutDetailForm(state),
    isEnabledEditing: getMyCheckoutDetailsEditingEnabled(state),
    visited: getVisited(state),
    // address forms
    billingAddressForm: getAddressForm(
      'billingMCD',
      getFormNames('billingMCD').address,
      state
    ),
    billingAddressFormValidationSchema: composeAdressValidationSchema(
      state,
      'billingMCD'
    ),
    deliveryAddressForm: getAddressForm(
      'deliveryMCD',
      getFormNames('deliveryMCD').address,
      state
    ),
    deliveryAddressFormValidationSchema: composeAdressValidationSchema(
      state,
      'deliveryMCD'
    ),
    // details forms
    billingDetailsForm: getAddressForm(
      'billingMCD',
      getFormNames('billingMCD').details,
      state
    ),
    billingDetailsFormValidationSchema: composeDetailsValidationSchema(
      state,
      'billingMCD'
    ),
    deliveryDetailsForm: getAddressForm(
      'deliveryMCD',
      getFormNames('deliveryMCD').details,
      state
    ),
    deliveryDetailsFormValidationSchema: composeDetailsValidationSchema(
      state,
      'deliveryMCD'
    ),
    // findAddress forms
    billingFindAddressForm: getAddressForm(
      'billingMCD',
      getFormNames('billingMCD').findAddress,
      state
    ),
    billingFindAddressFormValidationSchema: composeFindAdressValidationSchema(
      state,
      'billingMCD'
    ),
    deliveryFindAddressForm: getAddressForm(
      'deliveryMCD',
      getFormNames('deliveryMCD').findAddress,
      state
    ),
    deliveryFindAddressFormValidationSchema: composeFindAdressValidationSchema(
      state,
      'deliveryMCD'
    ),
    // payment forms
    paymentMethodForm: getMCDPaymentMethodForm(state),
    paymentMethodFormValidationSchema: getPaymentMethodFormValidationSchema(
      state
    ),
    selectedPaymentMethodType: composeSelectedPaymentMethodType(state),
    initialFocus: pathOr(
      null,
      ['account', 'myCheckoutDetails', 'initialFocus'],
      state
    ),
    isMobile: isMobile(state),
    scrollElementIntoView,
    saveMyCheckoutDetailsDisabled: isSaveMyCheckoutDetailsDisabled(state),
    brandCode: getBrandCode(state),
    paymentCardDetailsMCD: getPaymentCardDetailsMCD(state),
    isCurrentOrRecentDDPSubscriber: isCurrentOrRecentDDPSubscriber(state),
    isDDPRenewablePostWindow: isDDPRenewablePostWindow(state),
    isFeatureDDPEnabled: isFeatureDDPEnabled(state),
    ddpProduct: getDDPProduct(state),
    isFeatureDDPRenewable: isFeatureDDPRenewable(state),
  }),
  {
    updateMyCheckoutDetails,
    setFormField,
    touchedFormField,
    setMyCheckoutDetailsInitialFocus,
    setFormMessage,
    resetForm,
    getAllPaymentMethods,
  }
)
class MyCheckoutDetails extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    isEnabledEditing: PropTypes.bool.isRequired,
    myCheckoutDetailsForm: PropTypes.object.isRequired,
    visited: PropTypes.array.isRequired,
    // actions
    getAllPaymentMethods: PropTypes.func.isRequired,
    setFormField: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    updateMyCheckoutDetails: PropTypes.func.isRequired,
    touchedFormField: PropTypes.func.isRequired,
    setMyCheckoutDetailsInitialFocus: PropTypes.func.isRequired,
    setDeliveryFormsFromBillingForms: PropTypes.func.isRequired,
    initialFocus: PropTypes.string,
    isMobile: PropTypes.bool,
  }

  static defaultProps = {
    initialFocus: null,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  static needs = [getMyCheckoutDetailsData]

  componentDidMount() {
    const { setFormField, paymentMethods, getAllPaymentMethods } = this.props

    if (!paymentMethods.length) {
      // ADP-3321: Replacing getPaymentMethods with getAllPaymentMethods.
      // This is a provisional change as the ultimate goal is populate paymentMethods in the SSR.
      // @TODO To be removed in ADP-3653
      getAllPaymentMethods()
    }

    setFormField(
      'myCheckoutDetailsForm',
      'isDeliveryAndBillingAddressEqual',
      this.isBillingSameAsDelivery(this.props)
    )
  }

  isBillingSameAsDelivery(nextProps) {
    const {
      billingDetails,
      deliveryDetails,
      billingAddress,
      deliveryAddress,
    } = this.getBillingAndDelivery(nextProps)
    return (
      equals(billingDetails, deliveryDetails) &&
      equals(billingAddress, deliveryAddress)
    )
  }

  /**
   * DES-5375 : bug fix to allow to enter in postcode details,
   * once the delivery/billing address1 is empty
   * @param nextProps
   */
  clearBillingAndDeliveryAddress(nextProps) {
    const { resetForm } = this.props

    const { deliveryAddress, billingAddress } = this.getBillingAndDelivery(
      nextProps
    )
    const formAddress = {
      houseNumber: '',
      message: '',
      findAddress: '',
      selectAddress: '',
      postcode: '',
    }

    if (!path(['address1'], deliveryAddress)) {
      resetForm('deliveryFindAddressMCD', formAddress)
    } else if (!path(['address1'], billingAddress)) {
      resetForm('billingFindAddressMCD', formAddress)
    }
  }

  isDirtyForm(form, props, oldProps) {
    const oldFields = path([form, 'fields'], oldProps)
    const newFields = path([form, 'fields'], props)
    return newFields
      ? !equals(pluck('isDirty', newFields), pluck('isDirty', oldFields)) ||
          !equals(pluck('value', newFields), pluck('value', oldFields))
      : false
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { setFormField } = this.props
    if (
      this.isDirtyForm('billingDetailsForm', nextProps, this.props) ||
      this.isDirtyForm('billingAddressForm', nextProps, this.props) ||
      this.isDirtyForm('deliveryDetailsForm', nextProps, this.props) ||
      this.isDirtyForm('deliveryAddressForm', nextProps, this.props)
    ) {
      this.clearBillingAndDeliveryAddress(nextProps)
      setFormField(
        'myCheckoutDetailsForm',
        'isDeliveryAndBillingAddressEqual',
        this.isBillingSameAsDelivery(nextProps)
      )
    }
  }

  componentDidUpdate() {
    const {
      isEnabledEditing,
      initialFocus,
      scrollElementIntoView,
      setMyCheckoutDetailsInitialFocus,
    } = this.props
    if (process.browser && isEnabledEditing && initialFocus) {
      scrollElementIntoView(document.querySelector(initialFocus), 0, 10)
      // stop the edit page refocusing in future
      setMyCheckoutDetailsInitialFocus(undefined)
    }
  }

  getBillingAndDelivery(props) {
    const {
      billingAddressForm,
      billingDetailsForm,
      deliveryAddressForm,
      deliveryDetailsForm,
    } = props

    const billingDetails = pluck('value', billingDetailsForm.fields)
    const deliveryDetails = pluck('value', deliveryDetailsForm.fields)

    const billingAddress = omit(
      ['county'],
      pluck('value', billingAddressForm.fields)
    )
    const deliveryAddress = omit(
      ['county'],
      pluck('value', deliveryAddressForm.fields)
    )

    return {
      billingDetails,
      deliveryDetails,
      billingAddress,
      deliveryAddress,
    }
  }

  saveAssemble = () => {
    const {
      paymentMethodForm,
      selectedPaymentMethodType,
      paymentCardDetailsMCD,
    } = this.props

    const {
      billingDetails,
      deliveryDetails,
      billingAddress,
      deliveryAddress,
    } = this.getBillingAndDelivery(this.props)

    const creditCard = pick(
      ['expiryYear', 'expiryMonth', 'type', 'cardNumber'],
      {
        ...pluck('value', paymentCardDetailsMCD.fields),
        type: path(['fields', 'paymentType', 'value'], paymentMethodForm),
      }
    )

    /* HACK BECAUSE THE CURRENT API
      IF `OTHER` TYPE PAYMENT SELECTED: RESET CREDIT CARD VALUES TO FAKE DEFAULT
    */
    if (selectedPaymentMethodType === 'OTHER') {
      const date = new Date()
      creditCard.cardNumber = '0'
      creditCard.expiryMonth = date.getMonth() + 1
      creditCard.expiryYear = date.getFullYear()
    }

    return {
      billingDetails: {
        nameAndPhone: billingDetails,
        address: billingAddress,
      },
      deliveryDetails: {
        nameAndPhone: deliveryDetails,
        address: deliveryAddress,
      },
      creditCard,
    }
  }

  scrollToFirstError = (name) => {
    if (process.browser) {
      const el =
        document.querySelector(`.MyCheckoutDetails .Input-${name}`) ||
        document.querySelector(`.MyCheckoutDetails select[name=${name}]`)
      scrollElementIntoView(el, 400, 20)
    }
  }

  validateForm = (validationSchema, formData, formName) => {
    const { l } = this.context
    const { touchedFormField } = this.props
    const errors = validate(validationSchema, formData, l)
    if (!isEmpty(errors)) {
      // ADP-3849 don`t take expireMonth error it doesnt belong to textfield
      const refinedErrors = omit(['expiryMonth'], errors)
      this.scrollToFirstError(Object.keys(refinedErrors)[0])
      Object.keys(validationSchema).forEach((name) =>
        touchedFormField(formName, name)
      )
      return false
    }
    return true
  }

  validateForms = () => {
    const {
      billingAddressFormValidationSchema,
      deliveryAddressFormValidationSchema,
      billingDetailsFormValidationSchema,
      deliveryDetailsFormValidationSchema,
      billingFindAddressFormValidationSchema,
      deliveryFindAddressFormValidationSchema,
      billingFindAddressForm,
      deliveryFindAddressForm,
      paymentMethodFormValidationSchema,
    } = this.props

    // compose the object
    const assemble = this.saveAssemble()

    // get find Address form values
    const billingFindAddressValues = pluck(
      'value',
      billingFindAddressForm.fields
    )
    const deliveryFindAddressValues = pluck(
      'value',
      deliveryFindAddressForm.fields
    )

    // validation
    const allValidated = [
      this.validateForm(
        billingAddressFormValidationSchema,
        assemble.billingDetails.address,
        getFormNames('billingMCD').address
      ),
      this.validateForm(
        billingDetailsFormValidationSchema,
        assemble.billingDetails.nameAndPhone,
        getFormNames('billingMCD').details
      ),
      this.validateForm(
        billingFindAddressFormValidationSchema,
        billingFindAddressValues,
        getFormNames('billingMCD').findAddress
      ),
      this.validateForm(
        deliveryAddressFormValidationSchema,
        assemble.deliveryDetails.address,
        getFormNames('deliveryMCD').address
      ),
      this.validateForm(
        deliveryDetailsFormValidationSchema,
        assemble.deliveryDetails.nameAndPhone,
        getFormNames('deliveryMCD').details
      ),
      this.validateForm(
        deliveryFindAddressFormValidationSchema,
        deliveryFindAddressValues,
        getFormNames('deliveryMCD').findAddress
      ),
      this.validateForm(
        paymentMethodFormValidationSchema,
        assemble.creditCard,
        getFormNames('payment').paymentCardDetailsMCD
      ),
    ].every((value) => value)

    return allValidated
  }

  handleSaveMyCheckoutDetails = async () => {
    const { updateMyCheckoutDetails } = this.props
    // compose the object
    const assemble = this.saveAssemble()

    if (this.validateForms()) {
      await updateMyCheckoutDetails(assemble, 'myCheckoutDetailsForm')
      scrollToTop(100)
    }
  }

  handleDeliveryBillingEqualChecked = (name) => (e) => {
    const { setFormField, setDeliveryFormsFromBillingForms } = this.props
    setFormField('myCheckoutDetailsForm', name, e.target.checked)

    // when tick the checkbox, the Delivery Form is copied from Billing Form
    if (e.target.checked === true) {
      setDeliveryFormsFromBillingForms()
    } else {
      this.validateForms()
    }
  }

  handleLinkClick = (event) => {
    const { isEnabledEditing, visited } = this.props
    if (isEnabledEditing) {
      event.preventDefault()
      const lastVisited = visited && visited[visited.length - 2]
      if (lastVisited === '/my-account/details') {
        browserHistory.goBack()
      } else {
        browserHistory.push('/my-account/details')
      }
    }
  }

  render() {
    const { l } = this.context
    const {
      isEnabledEditing,
      myCheckoutDetailsForm,
      isMobile,
      user,
      saveMyCheckoutDetailsDisabled,
      brandCode,
      isCurrentOrRecentDDPSubscriber,
      isDDPRenewablePostWindow,
      isFeatureDDPEnabled,
      ddpProduct,
      isFeatureDDPRenewable,
    } = this.props
    const saveMessage =
      myCheckoutDetailsForm &&
      path(['message', 'message'], myCheckoutDetailsForm)
    const saveMessageType =
      myCheckoutDetailsForm && path(['message', 'type'], myCheckoutDetailsForm)
    const checkboxName = 'isDeliveryAndBillingAddressEqual'
    const deliveryAddressChangeScrollSelector = isMobile
      ? `#${checkboxName}-checkbox`
      : '.AddressFormDetails--delivery'

    return (
      <section className="MyCheckoutDetails">
        <AccountHeader
          link="/my-account"
          onLinkClick={this.handleLinkClick}
          label={
            isEnabledEditing
              ? l`Back to My Delivery & Payment Details`
              : l`Back to My Account`
          }
          title={l`My Delivery & Payment Details`}
        />
        {!isEnabledEditing &&
          saveMessageType === 'confirm' && (
            <section className="MyCheckoutDetails-message">
              <Message message={l(saveMessage)} type={saveMessageType} />
            </section>
          )}
        <section className="MyCheckoutDetails-address">
          <div className="MyCheckoutDetails-addressItem">
            <BillingAddressPreviewEditable
              scrollSelector={'.AddressFormDetails--billing'}
              user={user}
            />
          </div>
          <div className="MyCheckoutDetails-addressItem">
            <DeliveryAddressPreviewEditable
              scrollSelector={deliveryAddressChangeScrollSelector}
              user={user}
            />
          </div>
        </section>
        <section className="MyCheckoutDetails-payment">
          <MCDPaymentMethodPreviewEditable
            scrollSelector={'.MyCheckoutDetails-payment'}
            user={user}
          />
          {isFeatureDDPEnabled &&
            !isFeatureDDPRenewable &&
            isCurrentOrRecentDDPSubscriber && (
              <DDPSubscription
                user={user}
                isDDPRenewablePostWindow={isDDPRenewablePostWindow}
                brandCode={brandCode}
                ddpProduct={ddpProduct}
              />
            )}
        </section>
        {isEnabledEditing &&
          saveMessageType === 'error' && (
            <section className="MyCheckoutDetails-message">
              <Message message={l(saveMessage)} type={saveMessageType} />
            </section>
          )}
        {isEnabledEditing && (
          <Button
            className="PaymentContainer-paynow"
            type="submit"
            isDisabled={saveMyCheckoutDetailsDisabled}
            clickHandler={this.handleSaveMyCheckoutDetails}
          >
            {l`SAVE CHANGES`}
          </Button>
        )}

        {!isEnabledEditing && (
          <DDPRenewal
            isMyAccountDetail
            withMoreDetailsLink
            withOuterDDPTitleAndSeparator
          />
        )}
      </section>
    )
  }
}

export default MyCheckoutDetails
