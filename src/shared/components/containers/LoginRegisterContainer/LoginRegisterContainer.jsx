import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { splitQuery } from '../../../lib/query-helper'
import { slice, join, split, compose } from 'ramda'
import { getCanonicalHostname } from '../../../../shared/lib/canonicalisation'
import analyticsDecorator from '../../../../client/lib/analytics/analytics-decorator'
import LoginRegister from '../LoginRegister/LoginRegister'
import { getOrderSummary } from '../../../actions/common/checkoutActions'
import { sendEvent } from '../../../actions/common/googleAnalyticsActions'
import ContactBanner from '../../common/ContactBanner/ContactBanner'

import {
  getRoutePath,
  getRouteSearch,
  selectHostname,
} from '../../../selectors/routingSelectors'
import { isFeatureHttpsCanonicalEnabled } from '../../../../shared/selectors/featureSelectors'

export const mapStateToProps = (state) => ({
  hostname: selectHostname(state),
  search: getRouteSearch(state),
  pathname: getRoutePath(state),
  isFeatureHttpsCanonicalEnabled: isFeatureHttpsCanonicalEnabled(state),
})

@analyticsDecorator('unified-register-login', { isAsync: true })
@connect(
  mapStateToProps,
  {
    getOrderSummary,
    sendEvent,
  }
)
class LoginRegisterContainer extends Component {
  static propTypes = {
    hostname: PropTypes.string.isRequired,
    pathname: PropTypes.string,
    search: PropTypes.string,
    getOrderSummary: PropTypes.func.isRequired,
    sendEvent: PropTypes.func.isRequired,
    isFeatureHttpsCanonicalEnabled: PropTypes.bool,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  constructor(props) {
    super(props)
    const { hostname, pathname, search, isFeatureHttpsCanonicalEnabled } = props

    if (pathname.includes('checkout')) {
      this.type = 'checkoutRegisterLogin'
    } else {
      this.type = 'normalRegisterLogin'
    }

    const bazaarVoiceUri = splitQuery(search).return
    this.bazaarVoicePath =
      bazaarVoiceUri &&
      compose(
        join('/'),
        slice(3, Infinity),
        split('/')
      )(bazaarVoiceUri)

    this.helmetLink = [
      {
        rel: 'canonical',
        href:
          getCanonicalHostname(hostname, isFeatureHttpsCanonicalEnabled) +
          pathname,
      },
    ]

    this.loginRegisterProps = {
      callbacks: this.callbacks,
    }
  }

  componentDidMount() {
    if (this.type === 'checkoutRegisterLogin') {
      this.props.sendEvent('Checkout', 'Login', 'Sign In')
    }
  }

  getNextLoginRoute = () => {
    switch (this.type) {
      case 'checkoutRegisterLogin':
        return '/checkout'

      case 'normalRegisterLogin':
        return this.bazaarVoicePath || '/my-account'

      default:
        return '/my-account'
    }
  }

  getNextRegisterRoute = () => {
    switch (this.type) {
      case 'checkoutRegisterLogin':
        return '/checkout?new-user'

      case 'normalRegisterLogin':
        return this.bazaarVoicePath || '/register-success'

      default:
        return '/register-success'
    }
  }

  get callbacks() {
    switch (this.type) {
      case 'checkoutRegisterLogin':
        return {
          loginSuccessCallback: this.props.getOrderSummary,
        }
      default:
        return {}
    }
  }

  render() {
    const { l } = this.context

    return (
      <div className="LoginRegisterContainer">
        <Helmet title={l`Sign In`} link={this.helmetLink} />
        <ContactBanner />
        <section className="LoginRegisterContainer-wrapper">
          <LoginRegister
            getNextLoginRoute={this.getNextLoginRoute}
            getNextRegisterRoute={this.getNextRegisterRoute}
            {...this.loginRegisterProps.callbacks}
          />
        </section>
      </div>
    )
  }
}

export default LoginRegisterContainer
