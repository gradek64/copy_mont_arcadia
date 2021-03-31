import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import analyticsDecorator from '../../../../client/lib/analytics/analytics-decorator'
import QubitReact from 'qubit-react/wrapper'

// Selectors
import { getUserEmail } from '../../../selectors/common/accountSelectors'
import {
  isFeatureGuestCheckoutEnabled,
  isFeatureRememberMeEnabled,
} from '../../../selectors/featureSelectors'
import {
  bagContainsDDPProduct,
  getShoppingBagOrderId,
} from '../../../selectors/shoppingBagSelectors'
import { isUserPartiallyAuthenticated } from '../../../selectors/userAuthSelectors'

// Actions
import { intendedUserChanged } from '../../../lib/restricted-actions'
import { sendEvent } from '../../../actions/common/googleAnalyticsActions'
import {
  getOrderSummary,
  emptyOrderSummary,
} from '../../../actions/common/checkoutActions'
import { continueAsGuest } from '../../../actions/common/authActions'

// Components
import ForgetPassword from '../ForgetPassword/ForgetPassword'
import Login from '../../../components/containers/Login/Login'
import Register from '../../../components/containers/Register/Register'
import SignInMessage from '../SignIn/SignInMessage'
import GuestCheckoutButton from './Guest/GuestCheckoutButton'
import Accordion from '../../common/Accordion/Accordion'

class LoginContainer extends Component {
  static propTypes = {
    continueAsGuest: PropTypes.func.isRequired,
    getOrderSummary: PropTypes.func.isRequired,
    sendEvent: PropTypes.func.isRequired,
    orderId: PropTypes.number,
    showMessage: PropTypes.bool,
    isGuestCheckoutEnabled: PropTypes.bool,
    shoppingBagContainsDDP: PropTypes.bool,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      returningCustomerSelected: props.isUserPartiallyAuthenticated,
      newCustomerSelected: false,
      guestCustomerSelected: false,
    }
  }

  componentDidMount() {
    if (window) window.scrollTo(0, 0)
    this.props.sendEvent('Checkout', 'Login', 'Sign In')
    this.restrictedActionsIntendedUserChanged = intendedUserChanged()
  }

  componentDidUpdate() {
    this.restrictedActionsIntendedUserChanged = intendedUserChanged()
  }

  getLoginNextRoute = (loginResponse = {}) => {
    const {
      location: {
        query: { redirectUrl },
      },
      isRememberMeEnabled,
      userEmail,
    } = this.props

    if (
      isRememberMeEnabled &&
      typeof this.restrictedActionsIntendedUserChanged === 'function'
    ) {
      const userChanged = this.restrictedActionsIntendedUserChanged(userEmail)

      if (userChanged) {
        return '/my-account'
      }
    }

    if (redirectUrl) {
      return redirectUrl
    }

    if (loginResponse.basketItemCount === 0) return '/'
    return '/checkout'
  }

  getRegisterNextRoute = () => {
    return '/checkout?new-user'
  }

  handleSuccess = () => {
    const { getOrderSummary, userEmail } = this.props
    const shouldGetOrderSummary =
      typeof this.restrictedActionsIntendedUserChanged !== 'function' ||
      this.restrictedActionsIntendedUserChanged(userEmail)

    return shouldGetOrderSummary ? getOrderSummary() : Promise.resolve()
  }

  toggleAccordion = (name) => {
    Object.keys(this.state).forEach((key) => {
      this.setState({
        [key]: name === key && !this.state[name],
      })
    })
  }

  isSelected = (name) => (this.state[name] ? 'Selected' : '')

  renderGuestCheckout = () => {
    const { continueAsGuest } = this.props
    const { l } = this.context

    return (
      <section
        className={`LoginContainer-guestCustomer ${this.isSelected(
          'guestCustomerSelected'
        )}`}
      >
        <Accordion
          expanded={this.state.guestCustomerSelected}
          className="guest-customer"
          header={l`Guest Customer`}
          subHeader={l`Checkout quickly without an account`}
          accordionName="checkoutLogin"
          onAccordionToggle={() =>
            this.toggleAccordion('guestCustomerSelected')
          }
          noContentPadding
          noHeaderPadding
          noContentBorderTop
          noMaxHeight
        >
          <GuestCheckoutButton clickGuestCheckout={continueAsGuest} />
        </Accordion>
      </section>
    )
  }

  render() {
    const { l } = this.context
    const {
      getOrderSummary,
      isGuestCheckoutEnabled,
      orderId,
      showMessage,
      shoppingBagContainsDDP,
    } = this.props

    return (
      <div className="LoginContainer">
        <hr className="LoginContainer-horizontalLine" />
        {showMessage && <SignInMessage />}
        <section className="LoginContainer-wrapper">
          <Helmet title={l`Sign In`} />
          <div className="LoginContainer-secure">{l('Secure Checkout')}</div>
          <section
            className={`LoginContainer-returningCustomer ${this.isSelected(
              'returningCustomerSelected'
            )}`}
          >
            <Accordion
              expanded={this.state.returningCustomerSelected}
              className="returning-customer"
              header={l`Returning Customer`}
              subHeader={l`Sign in to checkout`}
              accordionName="checkoutLogin"
              onAccordionToggle={() =>
                this.toggleAccordion('returningCustomerSelected')
              }
              noContentPadding
              noHeaderPadding
              noContentBorderTop
              noMaxHeight
            >
              <Login
                getNextRoute={this.getLoginNextRoute}
                successCallback={this.handleSuccess}
              />
            </Accordion>
            {this.state.returningCustomerSelected && (
              <ForgetPassword noContentBorderTop orderId={orderId} />
            )}
          </section>
          <section
            className={`LoginContainer-newCustomer ${this.isSelected(
              'newCustomerSelected'
            )}`}
          >
            <Accordion
              expanded={this.state.newCustomerSelected}
              className="new-customer"
              header={l`New Customer`}
              subHeader={l`Create an account to checkout`}
              accordionName="checkoutLogin"
              onAccordionToggle={() =>
                this.toggleAccordion('newCustomerSelected')
              }
              noContentPadding
              noHeaderPadding
              noContentBorderTop
              noMaxHeight
            >
              <section className="LoginContainer-newUserSection">
                <Register
                  getNextRoute={this.getRegisterNextRoute}
                  source="CHECKOUT"
                  successCallback={getOrderSummary}
                />
              </section>
            </Accordion>
          </section>
          {!shoppingBagContainsDDP &&
            (isGuestCheckoutEnabled ? (
              this.renderGuestCheckout()
            ) : (
              <QubitReact
                id="ADP-3161-guest-checkout"
                renderProp={this.renderGuestCheckout}
              >
                {null}
              </QubitReact>
            ))}
        </section>
      </div>
    )
  }
}

const mapDispatchToProps = {
  continueAsGuest,
  emptyOrderSummary,
  getOrderSummary,
  sendEvent,
}

export default analyticsDecorator('checkout-login', { isAsync: true })(
  connect(
    (state) => ({
      orderId: getShoppingBagOrderId(state),
      userEmail: getUserEmail(state),
      showMessage: state.errorSession.showSessionExpiredMessage,
      isRememberMeEnabled: isFeatureRememberMeEnabled(state),
      isGuestCheckoutEnabled: isFeatureGuestCheckoutEnabled(state),
      shoppingBagContainsDDP: bagContainsDDPProduct(state),
      isUserPartiallyAuthenticated: isUserPartiallyAuthenticated(state),
    }),
    mapDispatchToProps
  )(LoginContainer)
)

export { LoginContainer as WrappedLoginContainer, mapDispatchToProps }
