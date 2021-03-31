import PropTypes from 'prop-types'
import { chain, isEmpty, keys, pathOr, pluck, values } from 'ramda'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import { validate } from '../../../../lib/validator'
import { scrollElementIntoView } from '../../../../lib/scroll-helper'
import {
  getDeliveryInstructionsSchema,
  getFindAddressSchema,
  getYourAddressSchema,
  getYourDetailsSchema,
  guestUserSchema,
} from '../shared/validationSchemas'
// selectors
import {
  isGuestOrder,
  isOutOfStock,
} from '../../../../selectors/checkoutSelectors'
import {
  getAddressForm,
  getCountryFor,
  getFormNames,
  getIsFindAddressVisible,
} from '../../../../selectors/formsSelectors'
import { bagContainsOnlyDDPProduct } from '../../../../selectors/shoppingBagSelectors'
import { isMobile } from '../../../../selectors/viewportSelectors'
import { getDDPDefaultName } from '../../../../selectors/ddpSelectors'

// actions
import {
  setFormField,
  touchedFormField,
  touchedMultipleFormFields,
} from '../../../../actions/common/formActions'
import { showModal } from '../../../../actions/common/modalActions'
import { setDeliveryAsBilling } from '../../../../actions/common/checkoutActions'
import {
  ANALYTICS_ERROR,
  GTM_ACTION,
  GTM_CATEGORY,
  sendAnalyticsClickEvent,
  sendAnalyticsErrorMessage,
} from '../../../../analytics'
// components
import DeliveryMethodsContainer from '../shared/DeliveryMethodsContainer'

import DeliveryDetailsForm from '../shared/DetailsForm/DeliveryDetailsForm'
import DeliveryAddressForm from '../shared/AddressForm/DeliveryAddressForm'
import DeliveryCTAProceed from './DeliveryCTAProceed'
import GuestUserEmailForm from '../Guest/GuestUserEmailForm'
import Separator from '../../../common/Separator/Separator'

@connect(
  (state) => {
    const addressType = 'deliveryCheckout'

    const formNames = getFormNames(addressType)
    const country = getCountryFor(addressType, formNames.address, state)
    const isFindAddressVisible = getIsFindAddressVisible(
      addressType,
      formNames.address,
      country,
      state
    )

    return {
      bagContainsOnlyDDPProduct: bagContainsOnlyDDPProduct(state),
      config: state.config,
      deliveryInstructions: state.forms.checkout.deliveryInstructions,
      ddpDefaultName: getDDPDefaultName(state),
      findAddressForm: getAddressForm(
        addressType,
        formNames.findAddress,
        state
      ),
      findAddressState: state.findAddress,
      orderSummary: state.checkout.orderSummary,
      useDeliveryAsBilling: state.checkout.useDeliveryAsBilling,
      user: state.account.user,
      yourAddress: getAddressForm(addressType, formNames.address, state),
      yourDetails: getAddressForm(addressType, formNames.details, state),
      isFindAddressVisible,
      shippingDestination: state.shippingDestination.destination,
      isMobile: isMobile(state),
      isOutOfStock: isOutOfStock(state),
      pathname: pathOr('', ['routing', 'location', 'pathname'], state),
      isGuestOrder: isGuestOrder(state),
      guestUserForm: pathOr('', ['forms', 'checkout', 'guestUser'], state),
    }
  },
  {
    setDeliveryAsBilling,
    showModal,
    setFormField,
    sendAnalyticsClickEvent,
    sendAnalyticsErrorMessage,
    touchedFormField,
    touchedMultipleFormFields,
  }
)
class HomeDelivery extends Component {
  static propTypes = {
    bagContainsOnlyDDPProduct: PropTypes.bool.isRequired,
    ddpDefaultName: PropTypes.string,
    config: PropTypes.object.isRequired,
    deliveryInstructions: PropTypes.object.isRequired,
    findAddressForm: PropTypes.object.isRequired,
    findAddressState: PropTypes.object.isRequired,
    yourAddress: PropTypes.object.isRequired,
    yourDetails: PropTypes.object.isRequired,
    useDeliveryAsBilling: PropTypes.bool.isRequired,
    setDeliveryAsBilling: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    touchedMultipleFormFields: PropTypes.func.isRequired,
    isFindAddressVisible: PropTypes.bool,
    nextButtonHidden: PropTypes.bool,
    isOutOfStock: PropTypes.bool,
    isGuestOrder: PropTypes.bool,
  }

  static defaultProps = {
    addressType: 'deliveryCheckout',
    bagContainsOnlyDDPProduct: false,
    isFindAddressVisible: false,
    nextButtonHidden: false,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  validateHomeDelivery() {
    const { l } = this.context
    const {
      config,
      deliveryInstructions,
      findAddressForm,
      yourAddress,
      yourDetails,
      isFindAddressVisible,
      guestUserForm,
      isGuestOrder,
    } = this.props
    const country = yourAddress.fields.country.value
    const rules = config.checkoutAddressFormRules[country]

    const errors = {
      yourDetails: validate(
        getYourDetailsSchema(country),
        pluck('value', yourDetails.fields),
        l
      ),
      deliveryInstructions: validate(
        getDeliveryInstructionsSchema(country),
        pluck('value', deliveryInstructions.fields),
        l
      ),
      findAddress: {},
      yourAddress: {},
      guestUser: {},
    }

    if (isGuestOrder) {
      errors.guestUser = validate(
        guestUserSchema(),
        pluck('value', guestUserForm.fields),
        l
      )
    }

    if (isFindAddressVisible) {
      errors.findAddress = validate(
        this.getFindAddressSchema(rules),
        pluck('value', findAddressForm.fields),
        l
      )
    } else {
      errors.yourAddress = validate(
        getYourAddressSchema(rules),
        pluck('value', yourAddress.fields),
        l
      )
    }

    return errors
  }

  getFindAddressSchema(rules) {
    const {
      findAddressState: { monikers = [] },
    } = this.props

    /** @NOTE
     *
     * monikers here they might not get updated
     * therefore initial implmentation hasFoundAddresses: monikers.length > 0 always creates false.
     * for validation We also need selectAddress to be present hence the solution,
     * but that could be potentially removed or rewrite decscribed in : https://arcadiagroup.atlassian.net/browse/ADP-2487
     */

    return getFindAddressSchema(rules, {
      hasFoundAddresses: monikers.length > 0,
      hasSelectedAddress: monikers.length > 0,
    })
  }

  focusEl(el) {
    const field = el.querySelector('input,select,button')
    if (field) field.focus()
  }

  scrollToFirstError(name) {
    const el = document.querySelector(`.HomeDeliveryV2 .FormComponent-${name}`)
    const offset = el && el.type === 'select-one' ? 30 : 20
    setTimeout(() => {
      scrollElementIntoView(el, 400, offset).then(() => {
        this.focusEl(el)
      })
    }, 15)
  }

  nextHandler(e, errors) {
    const {
      setDeliveryAsBilling,
      touchedMultipleFormFields,
      useDeliveryAsBilling,
      sendAnalyticsClickEvent,
      sendAnalyticsErrorMessage,
      isGuestOrder,
    } = this.props

    const erroringFields = chain(keys, values(errors))

    // TODO: guest checkout analytics required
    sendAnalyticsClickEvent({
      category: GTM_CATEGORY.CHECKOUT,
      action: GTM_ACTION.CLICKED,
      label: window.location.href,
      value: '',
    })

    if (erroringFields.length) {
      this.scrollToFirstError(erroringFields[0])
      touchedMultipleFormFields('yourDetails', keys(errors.yourDetails))
      touchedMultipleFormFields('findAddress', keys(errors.findAddress))
      touchedMultipleFormFields('yourAddress', keys(errors.yourAddress))
      touchedMultipleFormFields('guestUser', keys(errors.guestUser))

      // TODO: guest checkout analytics required
      sendAnalyticsErrorMessage(ANALYTICS_ERROR.PROCEED_TO_PAYMENT)
    } else {
      if (useDeliveryAsBilling) {
        setDeliveryAsBilling(true)
      }

      const path = isGuestOrder
        ? '/guest/checkout/payment'
        : '/checkout/payment'
      browserHistory.push(path)
    }
  }

  showDDPAddressModal() {
    const { l } = this.context
    const { showModal, ddpDefaultName } = this.props
    const modalHTML = (
      <p className="HomeDeliveryV2-textContainer">
        {l`While ${ddpDefaultName} is an online service, we need your delivery...`}
      </p>
    )
    showModal(modalHTML, { type: 'alert dialog box' })
  }

  render() {
    const {
      bagContainsOnlyDDPProduct,
      nextButtonHidden,
      isMobile,
      isOutOfStock,
      pathname,
      isGuestOrder,
    } = this.props

    const errors = this.validateHomeDelivery()
    const noErrors = Object.keys(errors).reduce((value, err) => {
      if (!isEmpty(errors[err])) value = false
      return value
    }, true)

    return (
      <section className="HomeDeliveryV2">
        <div className="HomeDeliveryV2-form">
          <DeliveryDetailsForm
            bagContainsOnlyDDPProduct={bagContainsOnlyDDPProduct}
            showDDPAddressModal={() => this.showDDPAddressModal()}
          />

          {isGuestOrder && <GuestUserEmailForm errors={errors.guestUser} />}
          <DeliveryAddressForm />
        </div>
        {!bagContainsOnlyDDPProduct && (
          <div>
            <Separator/>
            <DeliveryMethodsContainer />
            <Separator/>
          </div>
        )}
        <DeliveryCTAProceed
          nextButtonHidden={nextButtonHidden}
          isActive={noErrors}
          isDisabled={isOutOfStock}
          nextHandler={(e) => this.nextHandler(e, errors)}
          isMobile={isMobile}
          isOutOfStock={isOutOfStock}
          pathname={pathname}
        />
      </section>
    )
  }
}

export default HomeDelivery
