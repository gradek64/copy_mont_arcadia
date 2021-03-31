import PropTypes from 'prop-types'
import { pluck, chain, values, keys, isEmpty, pathOr } from 'ramda'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import { validate } from '../../../../lib/validator'
import { scrollElementIntoView } from '../../../../lib/scroll-helper'
import {
  getYourDetailsSchema,
  guestUserSchema,
} from '../shared/validationSchemas'
import { composeStoreName } from '../../../../lib/store-utilities'

// Selectors
import {
  isOutOfStock,
  getCheckoutOrderError,
  getCheckoutOrderSummary,
  getUseDeliveryAsBilling,
  isGuestOrder,
} from '../../../../selectors/checkoutSelectors'

// Actions
import { searchStoresCheckout } from '../../../../actions/components/UserLocatorActions'
import * as formActions from '../../../../actions/common/formActions'
import { clearOrderError } from '../../../../actions/common/orderActions'
import * as checkoutActions from '../../../../actions/common/checkoutActions'
import {
  GTM_ACTION,
  GTM_CATEGORY,
  ANALYTICS_ERROR,
  sendAnalyticsClickEvent,
  sendAnalyticsErrorMessage,
} from '../../../../analytics'

// components
import UserLocatorInput from '../../../common/UserLocatorInput/UserLocatorInput'
import Message from '../../../common/FormComponents/Message/Message'
import DeliveryMethodsContainer from '../shared/DeliveryMethodsContainer'
import Button from '../../../common/Button/Button'
import DeliveryDetailsForm from '../shared/DetailsForm/DeliveryDetailsForm'
import CheckoutPrimaryTitle from '../shared/CheckoutPrimaryTitle'
import DeliveryCTAProceed from './DeliveryCTAProceed'
import Separator from '../../../common/Separator/Separator'

import OrderErrorMessageContainer from '../shared/OrderErrorMessageContainer'
import Form from '../../../common/FormComponents/Form/Form'
import GuestUserEmailForm from '../Guest/GuestUserEmailForm'

@connect(
  (state) => ({
    yourDetails: state.forms.checkout.yourDetails,
    config: state.config,
    orderSummary: getCheckoutOrderSummary(state),
    isMobile: state.viewport.media === 'mobile',
    storeUpdating: state.checkout.storeUpdating,
    useDeliveryAsBilling: getUseDeliveryAsBilling(state),
    isOutOfStock: isOutOfStock(state),
    pathname: pathOr('', ['routing', 'location', 'pathname'], state),
    orderError: getCheckoutOrderError(state),
    isGuestOrder: isGuestOrder(state),
    guestUserForm: pathOr('', ['forms', 'checkout', 'guestUser'], state),
  }),
  {
    ...formActions,
    ...checkoutActions,
    clearOrderError,
    searchStoresCheckout,
    sendAnalyticsClickEvent,
    sendAnalyticsErrorMessage,
  }
)
class StoreDelivery extends Component {
  state = { message: '' }

  static propTypes = {
    config: PropTypes.object.isRequired,
    yourDetails: PropTypes.object.isRequired,
    orderSummary: PropTypes.object.isRequired,
    isMobile: PropTypes.bool,
    storeUpdating: PropTypes.bool,
    searchStoresCheckout: PropTypes.func,
    setStoreUpdating: PropTypes.func,
    touchedMultipleFormFields: PropTypes.func,
    openCollectFromStoreModal: PropTypes.func,
    setDeliveryAsBilling: PropTypes.func,
    setDeliveryAsBillingFlag: PropTypes.func,
    nextButtonHidden: PropTypes.bool,
    isOutOfStock: PropTypes.bool,
    clearOrderError: PropTypes.func,
    orderError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    isGuestOrder: PropTypes.bool,
    isScrollToFirstErrorActive: PropTypes.bool,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  static defaultProps = {
    nextButtonHidden: false,
  }

  componentDidMount() {
    window.onpopstate = this.onBackButtonEvent
  }

  UNSAFE_componentWillUpdate(nextProps) {
    const { storeUpdating, isMobile, setStoreUpdating } = this.props
    if (storeUpdating && isMobile !== nextProps.isMobile)
      setStoreUpdating(false)
  }

  // Hijacking the Backbutton because users can get forms into an invalid state using it (MON-2044)
  // TODO Remove once MON-2046 is done (making a central checkout data model where we can validate)
  onBackButtonEvent = () => {
    const errors = this.validateStoreDelivery()

    if (chain(keys, values(errors)).length) {
      window.history.go(1)
      this.nextHandler(errors)
    }
  }

  validateStoreDelivery() {
    const { l } = this.context
    const {
      yourDetails,
      config,
      storeUpdating,
      orderSummary,
      guestUserForm,
      isGuestOrder,
    } = this.props

    const errors = {
      yourDetails: validate(
        getYourDetailsSchema(config.country),
        pluck('value', yourDetails.fields),
        l
      ),
      store:
        storeUpdating || !orderSummary.storeDetails
          ? { storeDetails: true }
          : undefined,
      guestUser: {},
    }

    if (isGuestOrder) {
      errors.guestUser = validate(
        guestUserSchema(),
        pluck('value', guestUserForm.fields),
        l
      )
    }
    return errors
  }

  goToDeliveryStoreLocator = (event) => {
    event.preventDefault()
    this.props.searchStoresCheckout()
  }

  scrollToFirstError(name, isScrollToFirstErrorActive) {
    const el = document.querySelector(`.StoreDeliveryV2 .Input-${name}`)
    if (isScrollToFirstErrorActive) {
      setTimeout(() => {
        scrollElementIntoView(el, 400, 20)
      }, 15)
    }
  }

  nextHandler(errors, isScrollToFirstErrorActive) {
    const {
      touchedMultipleFormFields,
      setDeliveryAsBillingFlag,
      setDeliveryAsBilling,
      useDeliveryAsBilling,
      sendAnalyticsClickEvent,
      sendAnalyticsErrorMessage,
      isOutOfStock,
      orderError,
      clearOrderError,
      isGuestOrder,
    } = this.props
    const errorsArray = chain(keys, values(errors))

    sendAnalyticsClickEvent({
      category: GTM_CATEGORY.CHECKOUT,
      action: GTM_ACTION.CLICKED,
      label: window.location.href,
      value: '',
    })

    if (errors.store && errors.store.storeDetails) {
      this.setState({
        message: 'Please select a delivery location before you proceed',
      })
    }

    if (errorsArray.length) {
      this.scrollToFirstError(errorsArray[0], isScrollToFirstErrorActive)
      touchedMultipleFormFields('yourDetails', keys(errors.yourDetails))
      touchedMultipleFormFields('guestUser', keys(errors.guestUser))

      sendAnalyticsErrorMessage(ANALYTICS_ERROR.PROCEED_TO_PAYMENT)
    } else {
      if (useDeliveryAsBilling) {
        setDeliveryAsBillingFlag(true)
        setDeliveryAsBilling(true)
        checkoutActions.copyDeliveryValuesToBillingForms()
      }

      if (!isOutOfStock && orderError) {
        clearOrderError()
      }

      const path = isGuestOrder
        ? '/guest/checkout/payment'
        : '/checkout/payment'
      browserHistory.push(path)
    }
  }

  changeStore = () => {
    const { openCollectFromStoreModal, isMobile, setStoreUpdating } = this.props
    setStoreUpdating(true)
    this.setState({ message: '' })
    if (!isMobile) openCollectFromStoreModal()
  }

  renderChangeStoreCTA() {
    return (
      <button
        className="StoreDeliveryV2-changeStoreCTA"
        onClick={this.changeStore}
      >
        CHANGE
      </button>
    )
  }

  renderStoreDeliveryInfo = () => {
    const { l } = this.context
    const {
      orderSummary: { deliveryStoreCode, storeDetails },
    } = this.props
    const { message } = this.state
    const { address1: address, city, postcode } = storeDetails || {}
    const storeName = composeStoreName(deliveryStoreCode, storeDetails)
    const storeType =
      deliveryStoreCode && deliveryStoreCode.startsWith('S') ? 'shop' : 'store'
    const selectMessage = `Select ${storeType}`

    return (
      <div className="StoreDeliveryV2-storeInfo">
        {!storeDetails && (
          <Button
            className="StoreDeliveryV2-selectStoreCTA"
            clickHandler={this.changeStore}
          >
            {selectMessage}
          </Button>
        )}
        {storeDetails && (
          <div className="StoreDeliveryV2-storeHeader">
            <CheckoutPrimaryTitle title="Collection Point" />
            {this.renderChangeStoreCTA()}
          </div>
        )}
        {storeDetails ? (
          <div className="StoreDeliveryV2-storeAddress">
            {storeName && (
              <p className="StoreDeliveryV2-storeName">{storeName}</p>
            )}
            {address && (
              <p className="StoreDeliveryV2-storeAddressLine">{address}</p>
            )}
            {city && <p className="StoreDeliveryV2-storeAddressLine">{city}</p>}
            {postcode && (
              <p className="StoreDeliveryV2-storeAddressLine">{postcode}</p>
            )}
          </div>
        ) : (
          <Message message={l(message)} type="error" />
        )}
      </div>
    )
  }

  render() {
    const {
      orderSummary,
      isMobile,
      storeUpdating,
      nextButtonHidden,
      isOutOfStock,
      pathname,
      isGuestOrder,
      isScrollToFirstErrorActive,
    } = this.props
    const errors = this.validateStoreDelivery()
    const noErrors = isEmpty(errors.yourDetails) && errors.store === undefined
    return (
      <div className="StoreDeliveryV2" aria-label="Store Delivery">
        {!isMobile || (!storeUpdating && !!orderSummary.storeDetails) ? (
          <div>
            {this.renderStoreDeliveryInfo()}
            <DeliveryDetailsForm isCollection />
            {isGuestOrder && <GuestUserEmailForm errors={errors.guestUser} />}
            <Separator/>
            <DeliveryMethodsContainer isCollection />
            <Separator/>
            <DeliveryCTAProceed
              nextButtonHidden={nextButtonHidden}
              isActive={noErrors}
              isDisabled={isOutOfStock}
              nextHandler={() =>
                this.nextHandler(errors, !isScrollToFirstErrorActive)
              }
              isMobile={isMobile}
              isOutOfStock={isOutOfStock}
              pathname={pathname}
            />
            {!isOutOfStock && <OrderErrorMessageContainer />}
          </div>
        ) : (
          <Form onSubmit={this.goToDeliveryStoreLocator}>
            <UserLocatorInput
              selectedCountry="United Kingdom"
              submitHandler={this.goToDeliveryStoreLocator}
            />
          </Form>
        )}
      </div>
    )
  }
}

export default StoreDelivery
