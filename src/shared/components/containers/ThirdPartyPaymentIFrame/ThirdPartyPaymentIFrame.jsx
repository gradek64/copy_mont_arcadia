import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'

// Utilities
import { nrBrowserLogError } from '../../../../client/lib/logger'

/**
 * Third Party Payment verification services, for example 3D Secure
 * will be contained in this iframe.
 *
 * Each payment processor may have a different mechanism for redirecting
 * the iframe to their verification service. Additional redirection
 * modes may be defined to handle each mechanism.
 */
export default class ThirdPartyPaymentIFrame extends Component {
  static propTypes = {
    redirectionMode: PropTypes.oneOf(['three-d-secure-form']).isRequired,
    threeDSecureForm: PropTypes.string,
  }

  constructor(props) {
    super(props)
    this.iframeRef = React.createRef()
  }

  redirectOnError({ message, error }) {
    nrBrowserLogError(message, error || new Error(message))
    const encodedMessage = window.encodeURIComponent(message)
    browserHistory.replace(`/psd2-order-failure?error=${encodedMessage}`)
  }

  redirectThreeDSecure({ iframe, threeDSecureForm }) {
    if (!threeDSecureForm) {
      return this.redirectOnError({ message: '3D Secure form missing' })
    }

    try {
      // NB: The iframe 'srcDoc' property cannot be used.
      //
      // It would be preferable because the form could be passed in directly
      // without having to manipulate the iframe DOM.
      //
      // Unfortunately 'srcDoc' is not supported by IE 11 or Edge 18, both
      // of which are officially supported by the platform.
      const div = iframe.contentDocument.createElement('div')
      iframe.contentDocument.body.appendChild(div)
      div.insertAdjacentHTML('afterend', threeDSecureForm)
      iframe.contentDocument.getElementById('paymentForm').submit()
    } catch (eInjection) {
      this.redirectOnError({
        message: '3D Secure form injection fault',
        error: eInjection,
      })
    }
  }

  componentDidMount() {
    const iframe = this.iframeRef.current

    if (this.props.redirectionMode === 'three-d-secure-form') {
      this.redirectThreeDSecure({
        iframe,
        threeDSecureForm: this.props.threeDSecureForm,
      })
    }
  }

  render() {
    // @Note Sandbox settings are the superset supporting the two documents
    // that are expected to be loaded into the iframe:
    // - 3rd party payment provider's authorisation site/web-app
    // - Monty's /psd2-order-punchout
    return (
      <iframe
        className="ThirdPartyPaymentIFrame"
        ref={this.iframeRef}
        name="payment-punchout-iframe"
        src="about:blank"
        sandbox="allow-forms allow-same-origin allow-scripts"
      >
        Iframes are not supported by this browser.
      </iframe>
    )
  }
}
