import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { paymentMethod as paymentMethodType } from '../../../../../../constants/propTypes/paymentMethods'
import { KLARNA } from '../../../../../../constants/paymentTypes'

// components
import ConfirmCVV from '../ConfirmCVV'
import KlarnaForm from '../../../Klarna/KlarnaForm'
import Image from '../../../../../common/Image/Image'

class PaymentMethodPreview extends Component {
  componentDidMount() {
    this.props.closePaymentMethods()
  }

  render() {
    const {
      children,
      type,
      value,
      onChange,
      storedPaymentMethod = {},
      shoppingBagTotalItems,
    } = this.props
    const { l } = this.context

    return (
      <div className="PaymentMethodPreview">
        <div className="PaymentMethodPreview-col">
          <div className="PaymentMethodPreview-cardInfo">
            <Image
              className="PaymentMethodPreview-icon"
              src={
                storedPaymentMethod.icon
                  ? `/assets/common/images/${storedPaymentMethod.icon}`
                  : '/assets/{brandName}/images/credit-card.svg'
              }
            />
            {children}
          </div>
          <a
            className="PaymentMethodPreview-cta"
            onClick={onChange}
            role="button"
            tabIndex="0"
          >{l`Change`}</a>
          {['CARD', 'OTHER_CARD'].includes(type) && (
            <ConfirmCVV className="PaymentMethodPreview-confirmCVV" />
          )}
          {value === KLARNA && shoppingBagTotalItems >= 1 && <KlarnaForm />}
        </div>
      </div>
    )
  }
}

PaymentMethodPreview.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  storedPaymentMethod: paymentMethodType,
  closePaymentMethods: PropTypes.func,
}

PaymentMethodPreview.defaultProps = {
  type: undefined,
  onChange: () => {},
  closePaymentMethods: () => {},
}

PaymentMethodPreview.contextTypes = {
  l: PropTypes.func,
}

export default PaymentMethodPreview
