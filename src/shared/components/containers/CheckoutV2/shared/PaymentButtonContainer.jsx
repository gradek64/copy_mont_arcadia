import PropTypes from 'prop-types'
import React, { Component } from 'react'
import QubitReact from 'qubit-react/wrapper'
import { connect } from 'react-redux'
import ReCAPTCHA from 'react-google-recaptcha'
import {
  sendAnalyticsClickEvent,
  sendAnalyticsErrorMessage,
  GTM_ACTION,
  GTM_CATEGORY,
  ANALYTICS_ERROR,
} from '../../../../analytics'
import OrderProductNotification from '../../../common/OrderProductNotification/OrderProductNotification'
import { isEmpty } from 'ramda'
import classnames from 'classnames'
import * as paymentTypes from '../../../../constants/paymentTypes'
import * as logger from '../../../../../client/lib/logger'

// selectors
import {
  getPaymentType,
  getTotal,
  getCheckoutOrderSummaryShippingCountry,
  isOutOfStock,
  getCheckoutPaymentButtonLabel,
  paymentMethodsAreOpen,
  storedCardHasExpired,
  isOrderCoveredByGiftCards,
} from '../../../../selectors/checkoutSelectors'
import { shouldKlarnaBlockPaymentButton } from '../../../../selectors/klarnaSelectors'
import { isDDPStandaloneOrder } from '../../../../selectors/ddpSelectors'
import {
  getGoogleRecaptchaSiteKey,
  getLang,
} from '../../../../selectors/configSelectors'
import { isGuestRecaptchaEnabled } from '../../../../selectors/recaptchaSelectors'
import { isCardOrAccountCard } from '../../../../selectors/paymentMethodSelectors'

// actions
import { submitOrder } from '../../../../actions/common/orderActions'
import { validateForms } from '../../../../actions/common/checkoutActions'
import { validateDDPForCountry } from '../../../../actions/common/ddpActions'

// components
import Button from '../../../common/Button/Button'
import ApplePayButton from '../ApplePayButton/ApplePayButton'

const mapStateToProps = (state) => {
  const paymentType = getPaymentType(state) || ''
  return {
    isDDPStandaloneOrder: isDDPStandaloneOrder(state),
    checkoutOrderSummaryCountry: getCheckoutOrderSummaryShippingCountry(state),
    paymentType,
    isOrderCoveredByGiftCards: isOrderCoveredByGiftCards(state),
    total: getTotal(state),
    isOutOfStock: isOutOfStock(state),
    isKlarnaPaymentBlocked: shouldKlarnaBlockPaymentButton(state),
    isCardPaymentSelected: isCardOrAccountCard(state, paymentType),
    paymentButtonLabel: getCheckoutPaymentButtonLabel(state),
    storedCardHasExpired: storedCardHasExpired(state),
    paymentMethodsAreOpen: paymentMethodsAreOpen(state),
    googleRecaptchaSiteKey: getGoogleRecaptchaSiteKey(state),
    isGuestRecaptchaEnabled: isGuestRecaptchaEnabled(state),
    siteLang: getLang(state),
  }
}

const mapDispatchToProps = {
  submitOrder,
  validateForms,
  sendAnalyticsClickEvent,
  sendAnalyticsErrorMessage,
  validateDDPForCountry,
}

@connect(mapStateToProps, mapDispatchToProps)
class PaymentButtonContainer extends Component {
  static propTypes = {
    isDDPStandaloneOrder: PropTypes.bool.isRequired,
    checkoutOrderSummaryCountry: PropTypes.string.isRequired,
    validateDDPForCountry: PropTypes.func.isRequired,
    className: PropTypes.string,
    formNames: PropTypes.arrayOf(PropTypes.string).isRequired,
    storedCardHasExpired: PropTypes.bool.isRequired,
    paymentMethodsAreOpen: PropTypes.bool.isRequired,
    formErrors: PropTypes.object,
    submitOrder: PropTypes.func,
    validateForms: PropTypes.func,
    isOutOfStock: PropTypes.bool,
    isKlarnaPaymentBlocked: PropTypes.bool,
    isCardPaymentSelected: PropTypes.bool,
    googleRecaptchaSiteKey: PropTypes.string,
    isGuestRecaptchaEnabled: PropTypes.bool.isRequired,
    siteLang: PropTypes.string,
  }

  static defaultProps = {
    isDDPStandaloneOrder: false,
    checkoutOrderSummaryCountry: '',
    validateDDPForCountry: () => {},
    className: '',
    formErrors: {},
    googleRecaptchaSiteKey: '',
    isGuestRecaptchaEnabled: false,
    siteLang: 'en',
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      blockSubmit: false,
    }
    this.recaptchaRef = React.createRef()
  }

  handleSubmit = () => {
    const {
      formNames,
      isDDPStandaloneOrder,
      checkoutOrderSummaryCountry,
      submitOrder,
      validateForms,
      validateDDPForCountry,
      formErrors,
      sendAnalyticsClickEvent,
      sendAnalyticsErrorMessage,
      isGuestRecaptchaEnabled,
    } = this.props

    // Block users from submitting more than once
    if (this.state.blockSubmit) return null
    this.setState({ blockSubmit: true })

    if (
      isDDPStandaloneOrder &&
      checkoutOrderSummaryCountry !== 'United Kingdom'
    ) {
      return validateDDPForCountry(checkoutOrderSummaryCountry)
    }

    sendAnalyticsClickEvent({
      category: GTM_CATEGORY.CHECKOUT,
      action: GTM_ACTION.CLICKED,
      label: 'confirm-and-pay',
      value: '',
    })

    if (Object.keys(formErrors).length > 0)
      sendAnalyticsErrorMessage(ANALYTICS_ERROR.CONFIRM_AND_PAY)

    return validateForms(formNames, {
      onValid: async () => {
        return submitOrder(
          isGuestRecaptchaEnabled && {
            recaptchaToken: await this.recaptchaRef.current.executeAsync(),
          }
        ).finally(() => {
          this.setState({ blockSubmit: false })
        })
      },
      onInvalid: () => {
        this.setState({ blockSubmit: false })
      },
    })
  }

  render() {
    const { l } = this.context
    const {
      className,
      formErrors,
      isOutOfStock,
      isKlarnaPaymentBlocked,
      paymentButtonLabel,
      paymentType,
      isOrderCoveredByGiftCards,
      isCardPaymentSelected,
      storedCardHasExpired,
      paymentMethodsAreOpen,
      googleRecaptchaSiteKey,
      isGuestRecaptchaEnabled,
      siteLang,
    } = this.props

    const paymentButtonClass = classnames('PaymentButtonContainer', {
      'PaymentButtonContainer--hasError': isOutOfStock,
    })

    const expiredCardCheck = storedCardHasExpired && !paymentMethodsAreOpen
    const isActive = isEmpty(formErrors)

    const SubmitButton =
      paymentType === paymentTypes.APPLEPAY ? ApplePayButton : Button

    const paymentFormCompleted =
      (isActive && isCardPaymentSelected) || !isCardPaymentSelected

    const shouldBeDisabled = () =>
      isOutOfStock ||
      isKlarnaPaymentBlocked ||
      expiredCardCheck ||
      !paymentFormCompleted ||
      (!paymentType && !isOrderCoveredByGiftCards)

    return (
      <div className={paymentButtonClass}>
        <QubitReact
          id="qubit-disable-payment-button"
          defaultDisabled={isOutOfStock || isKlarnaPaymentBlocked}
          hasNoPaymentType={!paymentType}
        >
          <SubmitButton
            className={className}
            lang={siteLang}
            type="submit"
            clickHandler={this.handleSubmit}
            isActive={isActive}
            isDisabled={shouldBeDisabled()}
          >
            <QubitReact
              id="qubit-payment-button-text"
              paymentType={paymentType}
            >
              {/*
                NOTE: Translations don't work with template strings when the text
                being translated is within a variable. So instead of doing l`${buttonLabel}`,
                we have to do l(buttonLabel)
              */}
              {l(paymentButtonLabel)}
            </QubitReact>
          </SubmitButton>
        </QubitReact>
        {isOutOfStock && (
          <OrderProductNotification
            boldMessage={l`Some items are no longer available.`}
            message={l`Please review your bag.`}
            hasError
          />
        )}
        {isGuestRecaptchaEnabled && (
          <ReCAPTCHA
            ref={this.recaptchaRef}
            size="invisible"
            sitekey={googleRecaptchaSiteKey}
            onErrored={(e = {}) => {
              logger.nrBrowserLogError('ReCaptcha, token errored', e)
            }}
            onExpired={(e = {}) => {
              logger.nrBrowserLogError('ReCaptcha, token expired', e)
            }}
          />
        )}
      </div>
    )
  }
}

export default PaymentButtonContainer
