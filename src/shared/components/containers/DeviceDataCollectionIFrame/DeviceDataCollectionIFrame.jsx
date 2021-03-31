import url from 'url'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'

// Actions
import {
  concludeOrderCreation,
  clearPrePaymentConfig,
} from '../../../actions/common/orderActions'
import { clearFinalisedOrder } from '../../../actions/common/orderAuxiliaryActions'

// Selectors
import { getCardNumber } from '../../../selectors/checkoutSelectors'

// Utilities
import { isUUIDv4 } from '../../../lib/values'
import { nrBrowserLogError } from '../../../../client/lib/logger'

export const MAX_DDC_ATTEMPTS = 2
export const DDC_TIMEOUT = 5 // In seconds

@connect(
  (state) => ({
    cardNumber: getCardNumber(state),
  }),
  {
    concludeOrderCreation,
    clearPrePaymentConfig,
    clearFinalisedOrder,
  }
)
class DeviceDataCollectionIFrame extends PureComponent {
  static propTypes = {
    cardNumber: PropTypes.string,
    prePaymentConfig: PropTypes.object,
    concludeOrderCreation: PropTypes.func.isRequired,
    clearPrePaymentConfig: PropTypes.func.isRequired,
    clearFinalisedOrder: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.iframeRef = React.createRef()
    this.watchdog = null
    this.ddcUrl = null
    this.ddcAttempts = MAX_DDC_ATTEMPTS
    this.formElement = null
  }

  buildForm({ formId, url, bin, jwt }) {
    const childElements = [
      `<input type='hidden' name='Bin' value='${bin}'/>`,
      `<input type='hidden' name='JWT' value='${jwt}'/>`,
    ]

    const formElement =
      `<form id='${formId}' method='post' action='${url}'>` +
      `${childElements.join('')}` +
      `</form>`

    return formElement
  }

  parseUrl(string) {
    this.ddcUrl = url.parse(string)
  }

  validateJwt(jwt) {
    const jwtRegex = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+$/
    return jwtRegex.test(jwt)
  }

  validateBin(bin) {
    return /^\d{6,}|<bin>$/.test(bin)
  }

  redirectOnError({ message, error }) {
    this.props.clearPrePaymentConfig()
    this.props.clearFinalisedOrder()
    nrBrowserLogError(message, error || new Error(message))
    const encodedMessage = window.encodeURIComponent(message)
    browserHistory.replace(`/psd2-order-failure?error=${encodedMessage}`)
  }

  cleanUpGlobals() {
    if (this.watchdog) {
      window.clearTimeout(this.watchdog)
      this.watchdog = null
    }

    this.ddcUrl = null
    this.ddcAttempts = MAX_DDC_ATTEMPTS
    this.formElement = null

    window.removeEventListener('message', this.ddcResponseListener, false)
  }

  authenticateWith3DS2({ dfReferenceId }) {
    this.props.concludeOrderCreation({
      threeDSecure: {
        dfReferenceId,
      },
    })
  }

  authenticateWith3DS1({ ddcDowngradeReason }) {
    this.props.concludeOrderCreation({
      threeDSecure: {
        dfReferenceId: '',
        ddcDowngradeReason,
      },
    })
  }

  parseResponse(string, errorHandler) {
    let ddcResponse
    try {
      ddcResponse = JSON.parse(string)
    } catch (eJSON) {
      return () => errorHandler(eJSON)
    }
    return ddcResponse
  }

  submitDdcRequest = ({ formElement, ddcAttempts } = {}) => {
    if (formElement) {
      this.formElement = formElement
    }

    if (typeof ddcAttempts === 'number' && ddcAttempts >= 0) {
      this.ddcAttempts = ddcAttempts
    }

    if (this.formElement && this.ddcAttempts < MAX_DDC_ATTEMPTS) {
      this.ddcAttempts++
      this.startWatchdog({ timeoutSeconds: DDC_TIMEOUT })

      try {
        this.formElement.submit()
      } catch (eSubmission) {
        this.cleanUpGlobals()
        this.redirectOnError({
          message: 'Device Data Collection form submission fault',
          error: eSubmission,
        })
      }
    } else {
      this.shutdownWatchdog()
    }
  }

  // Example message delivered from Worldpay / Cardinal DDC
  // iframe content via window.postMessage()
  //
  // {
  //   "MessageType": "profile.completed",
  //   "SessionId": "d3197c02-6f63-4ab2-801c-83633d097e32",
  //   "Status": true
  // }
  ddcResponseListener = (event) => {
    const origin = `${this.ddcUrl.protocol}${this.ddcUrl.slashes ? '//' : ''}${
      this.ddcUrl.host
    }`

    // Ignore messages from anywhere but the DDC IFrame content
    if (event.origin !== origin) {
      return
    }

    const ddcResponse = this.parseResponse(event.data, (error) => {
      this.cleanUpGlobals()
      this.redirectOnError({
        message: 'Device Data Collection - DDC JSON',
        error,
      })
    })

    if (typeof ddcResponse === 'function') {
      return ddcResponse()
    }

    // DDC Outcome
    // You are notified via a JavaScript postMessage that DDC has been completed. Your
    // website must listen for this notification which contains the following fields:

    // Name         Value
    // MessageType  profile.completed
    // SessionId    UUID, not present or undefined
    // Status       true or false

    // There are three possible scenarios:

    // Status       Action
    // true         Send SessionId as dfReferenceId in initial payment request.
    // false        SessionId is empty. Either retry DDC or send empty dfReferenceId. This downgrades authentication to 3DS1.
    // No callback  Either retry DDC or send empty dfReferenceId. This downgrades authentication to 3DS1.

    if (ddcResponse.MessageType === 'profile.completed') {
      this.cleanUpGlobals()

      if (ddcResponse.Status && isUUIDv4(ddcResponse.SessionId)) {
        this.authenticateWith3DS2({
          dfReferenceId: ddcResponse.SessionId,
        })
      } else {
        this.authenticateWith3DS1({
          ddcDowngradeReason: 'DDC_3DS2_UNSUPPORTED',
        })
      }
    }
  }

  shutdownWatchdog = () => {
    this.watchdog = null
    this.cleanUpGlobals()

    this.authenticateWith3DS1({
      ddcDowngradeReason: 'DDC_RESPONSE_TIMEOUT',
    })
  }

  // Sets up a watchdog timer to abort the process with an error if the
  // response from Worldpay / Cardinal does not come back in time.
  startWatchdog({ timeoutSeconds }) {
    this.watchdog = window.setTimeout(
      this.submitDdcRequest,
      timeoutSeconds * 1000
    )
  }

  injectForm({ iframe, html, formId }) {
    let formElement = null

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
      div.insertAdjacentHTML('afterend', html)
      formElement = iframe.contentDocument.getElementById(formId)
    } catch (eInjection) {
      this.cleanUpGlobals()
      this.redirectOnError({
        message: 'Device Data Collection form injection fault',
        error: eInjection,
      })
    }

    return formElement
  }

  componentDidMount() {
    // Never initiate Device Data Collection during server side rendering
    if (!process.browser) {
      return
    }

    const iframe = this.iframeRef.current
    const formId = 'deviceDataCollectionForm'

    // 'orderId' also available in prePaymentConfig but unnecessary here.
    const { ddcUrl, binNumber, ddcJwt } = this.props.prePaymentConfig || {}
    const cardNumber = this.props.cardNumber

    // Example: https://secure-test.worldpay.com/shopper/3ds/ddc.html
    try {
      this.parseUrl(ddcUrl)
    } catch (eUrl) {
      return this.redirectOnError({
        message: 'Device Data Collection - DDC URL',
        error: eUrl,
      })
    }

    if (this.ddcUrl.protocol !== 'https:') {
      return this.redirectOnError({
        message: 'Device Data Collection - Insecure DDC URL',
      })
    }

    if (!this.validateJwt(ddcJwt)) {
      return this.redirectOnError({
        message: 'Device Data Collection - Missing or invalid JWT',
      })
    }

    // The UI for a returning user will not present the form containing card
    // details. In this case fall back to the binNumber provided by WCS.
    const bin =
      (typeof cardNumber === 'string' && cardNumber.trim()) || binNumber

    if (!this.validateBin(bin)) {
      return this.redirectOnError({
        message: 'Device Data Collection - Missing or invalid BIN',
      })
    }

    const formString = this.buildForm({
      formId,
      url: this.ddcUrl.href,
      bin,
      jwt: ddcJwt,
    })

    window.addEventListener('message', this.ddcResponseListener, false)

    const formElement = this.injectForm({
      iframe,
      html: formString,
      formId,
    })

    this.submitDdcRequest({
      formElement,
      ddcAttempts: 0,
    })
  }

  // Device Data Collection uses a WorldPay / Cardinal Commerce script
  // to analyse the client device. The iframe in which it runs should
  // not be seen (invisible styling) and should not be discoverable
  // for interaction (tabIndex -1).
  render() {
    const invisible = {
      width: 0,
      height: 0,
      display: 'none',
      position: 'absolute',
    }

    return (
      <iframe
        ref={this.iframeRef}
        style={invisible}
        name="ddc-iframe"
        tabIndex="-1"
        src="about:blank"
        sandbox="allow-forms allow-same-origin allow-scripts"
      >
        Iframes are not supported by this browser.
      </iframe>
    )
  }
}

export default DeviceDataCollectionIFrame
