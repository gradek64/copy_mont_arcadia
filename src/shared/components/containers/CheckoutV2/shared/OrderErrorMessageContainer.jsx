import { connect } from 'react-redux'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

// Selectors
import { getCheckoutOrderError } from '../../../../selectors/checkoutSelectors'
import { getOrderFormErrorMessage } from '../../../../selectors/formsSelectors'

// Components
import Message from '../../../common/FormComponents/Message/Message'

const mapStateToProps = (state) => ({
  errorMessage: getOrderFormErrorMessage(state),
  orderError: getCheckoutOrderError(state),
})

const mapDispatchToProps = {}

@connect(
  mapStateToProps,
  mapDispatchToProps
)
class OrderErrorMessageContainer extends Component {
  static propTypes = {
    errorMessage: PropTypes.string,
    orderError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  onMessageDidMount = (message) => {
    setTimeout(() => {
      message.scrollTo()
    }, 500)
  }

  render() {
    const { errorMessage, orderError } = this.props
    const { l } = this.context
    const message = errorMessage || orderError

    if (!errorMessage && !orderError) {
      return null
    }

    return (
      <Message
        message={message && l(message)}
        type="error"
        onDidMount={this.onMessageDidMount}
      />
    )
  }
}

export default OrderErrorMessageContainer
