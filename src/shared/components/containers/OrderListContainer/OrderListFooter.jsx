import React from 'react'
import PropTypes from 'prop-types'
import CustomerServiceNumber from '../../common/CustomerServiceNumber/CustomerServiceNumber'

const OrderListFooter = ({ displayText, historyRequest, contact }) => {
  return (
    <div className="OrderList-customerMessage">
      <p className="OrderList-customerMessage-limit">{displayText}</p>
      <p className="OrderList-customerMessage-contact">
        {historyRequest}
        <span className="OrderList-customerMessage-contact-spacing" />
        <br className="OrderList-customerMessage-contact-break" />
        {contact}
        <CustomerServiceNumber />
      </p>
    </div>
  )
}

OrderListFooter.propTypes = {
  displayText: PropTypes.string.isRequired,
  historyRequest: PropTypes.string.isRequired,
  contact: PropTypes.string.isRequired,
}

export default OrderListFooter
