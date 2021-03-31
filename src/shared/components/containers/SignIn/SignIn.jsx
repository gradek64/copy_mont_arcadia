import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { splitQuery } from '../../../lib/query-helper'
import { pathOr } from 'ramda'
import { getCanonicalHostname } from '../../../../shared/lib/canonicalisation'
import analyticsDecorator from '../../../../client/lib/analytics/analytics-decorator'
import { GTM_CATEGORY } from '../../../../shared/analytics'

// ACTIONS
import { closeModal } from '../../../actions/common/modalActions'
import { hideSessionExpiredMessage } from '../../../actions/common/sessionActions'

// COMPONENTS
import RegisterLogin from '../../common/RegisterLogin/RegisterLogin'
import SignInMessage from './SignInMessage'
import ContactBanner from '../../common/ContactBanner/ContactBanner'

import { isFeatureHttpsCanonicalEnabled } from '../../../selectors/featureSelectors'

@analyticsDecorator(GTM_CATEGORY.REGISTER_LOGIN)
@connect(
  (state) => ({
    location: state.routing.location,
    showMessage: state.errorSession.showSessionExpiredMessage,
    isFeatureHttpsCanonicalEnabled: isFeatureHttpsCanonicalEnabled(state),
  }),
  { closeModal, hideSessionExpiredMessage }
)
class SignIn extends Component {
  static propTypes = {
    location: PropTypes.shape({
      hostname: PropTypes.string.isRequired,
      pathname: PropTypes.string,
      search: PropTypes.string,
    }).isRequired,
    hideRegister: PropTypes.bool,
    showSessionExpiredMessage: PropTypes.bool,
    closeModel: PropTypes.func,
    formName: PropTypes.string,
    isFeatureHttpsCanonicalEnabled: PropTypes.bool,
    successCallback: PropTypes.func,
  }

  static defaultProps = {
    hideRegister: false,
    formName: 'login',
    successCallback: () => {},
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  componentWillUnmount() {
    const { hideSessionExpiredMessage } = this.props
    if (hideSessionExpiredMessage) hideSessionExpiredMessage()
  }

  getNextRoute = () => {
    const {
      search,
      query: { redirectUrl },
    } = this.props.location
    const bazaarvoiceUri = pathOr('', ['return'], splitQuery(search))

    if (redirectUrl) return redirectUrl
    if (bazaarvoiceUri)
      return bazaarvoiceUri
        .split('/')
        .slice(3, Infinity)
        .join('/')
    return '/my-account'
  }

  render() {
    const { l } = this.context
    const {
      location: { hostname, pathname },
      hideRegister,
      closeModal,
      showMessage,
      formName,
      isFeatureHttpsCanonicalEnabled,
      successCallback,
    } = this.props

    const helmet = {
      title: l`Sign In`,
      link: [
        {
          rel: 'canonical',
          href:
            getCanonicalHostname(hostname, isFeatureHttpsCanonicalEnabled) +
            pathname,
        },
      ],
    }

    // "hideRegister" value can be used to identify if the SignIn component
    // is loaded inside a modal.
    const isModal = hideRegister
    const registerLoginProps = isModal
      ? {
          successCallback: () => {
            closeModal()
            successCallback()
          },
        }
      : {
          getLoginNextRoute: this.getNextRoute,
          getRegisterNextRoute: this.getNextRoute,
        }
    return (
      <section className="SignIn">
        {!isModal && <ContactBanner />}
        {showMessage && <SignInMessage centerAlign={hideRegister} />}
        <RegisterLogin
          loginFormName={formName}
          hideRegister={hideRegister}
          helmet={helmet}
          source="MYACCOUNT"
          {...registerLoginProps}
        />
      </section>
    )
  }
}

export default SignIn
