import React from 'react'
import PropTypes from 'prop-types'

const OrderListTagline = ({ tagline }) => {
  return <p className="OrderList-tagline">{tagline}</p>
}

OrderListTagline.propTypes = {
  tagline: PropTypes.string.isRequired,
}

export default OrderListTagline
