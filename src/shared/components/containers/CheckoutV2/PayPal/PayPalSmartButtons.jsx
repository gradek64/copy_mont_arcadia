// imports
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

// helpers
import { loadScript } from '../../../../lib/checkout-utilities/paypal-utils'
import * as clientLogger from '../../../../../client/lib/logger'

// selectors
import {
  getCurrencyCode,
  getPaypalSDKClientId,
} from '../../../../selectors/configSelectors'
import { getShoppingBagOrderId } from '../../../../selectors/shoppingBagSelectors'

// actions
import {
  submitOrder,
  setOrderPending,
  updateOrderPending,
  completePaypalOrder,
} from '../../../../actions/common/orderActions'
import { setFormMessage } from '../../../../actions/common/formActions'

import { PAYPAL } from '../../../../../shared/constants/paymentTypes'

const PAYPAL_CONTAINER_ID = 'paypal-button-container'

class PayPalSmartButtons extends Component {
  setPaypalError = () => {
    const { l } = this.context

    this.props.setFormMessage('order', {
      message: l`The transaction has not been authorised. It must be approved with PayPal before your order can proceed.`,
      type: 'error',
    })
  }

  initSmartButtons = async () => {
    const { currencyCode, paypalSDKClientId } = this.props

    if (!window.paypal) await loadScript(paypalSDKClientId, currencyCode)

    window.paypal
      .Buttons({
        style: {
          layout: 'horizontal',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
          height: 54,
          size: 'responsive',
          tagline: false,
        },
        createOrder: async () => {
          try {
            const { token, tranId, policyId } = await this.props.submitOrder()
            // base confirm order request
            const orderPayload = {
              hostname: window.location.hostname,
              policyId,
              orderId: this.props.orderIdShoppingBag.toString(),
              token,
              tranId,
              authProvider: PAYPAL,
            }

            // set order to pending state in the store
            await this.props.setOrderPending(orderPayload)

            return token // need to return the token to open the PayPal modal as per https://developer.paypal.com/docs/checkout/reference/upgrade-integration/#nvp-integrations
          } catch (error) {
            clientLogger.nrBrowserLogError(
              'PayPal Error - could not create order',
              error
            )
            throw error
          }
        },
        onApprove: async (data) => {
          try {
            // Captures transaction details and updates the order pending payload
            await this.props.updateOrderPending({
              payerId: data.payerID,
              userApproved: '1',
            })

            return this.props.completePaypalOrder()
          } catch (error) {
            clientLogger.nrBrowserLogError(
              'PayPal Error - could not approve order',
              error
            )
            throw error
          }
        },
        onCancel: () => {
          this.setPaypalError()
        },
        onError: (error) => {
          clientLogger.nrBrowserLogError('PayPal Error - ', error)
        },
      })
      .render(`#${PAYPAL_CONTAINER_ID}`)
  }

  async componentDidMount() {
    await this.initSmartButtons()
  }

  render() {
    return <div id={PAYPAL_CONTAINER_ID} />
  }
}

const mapStateToProps = (state) => ({
  currencyCode: getCurrencyCode(state),
  paypalSDKClientId: getPaypalSDKClientId(state),
  orderIdShoppingBag: getShoppingBagOrderId(state),
})

const mapDispatchToProps = (dispatch) => ({
  submitOrder: () => dispatch(submitOrder()),
  setOrderPending: (data) => dispatch(setOrderPending(data)),
  updateOrderPending: (data) => dispatch(updateOrderPending(data)),
  completePaypalOrder: () => dispatch(completePaypalOrder()),
  setFormMessage: (formName, data) => dispatch(setFormMessage(formName, data)),
})

PayPalSmartButtons.propTypes = {
  currencyCode: PropTypes.string,
  paypalSDKClientId: PropTypes.string,
}

PayPalSmartButtons.defaultProps = {
  currencyCode: 'GBP',
  paypalSDKClientId: '',
}

PayPalSmartButtons.contextTypes = {
  l: PropTypes.func,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PayPalSmartButtons)
