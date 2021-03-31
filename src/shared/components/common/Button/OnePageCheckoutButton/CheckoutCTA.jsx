// Imports
import React from 'react'
import PropTypes from 'prop-types'

const CheckoutCTA = ({ copy, action }) => {
  return (
    <div role="button" tabIndex={0} className="CheckoutCTA" onClick={action}>
      <span className="CheckoutCTA-copy">{copy}</span>
    </div>
  )
}

CheckoutCTA.propTypes = {
  copy: PropTypes.string.isRequired,
  action: PropTypes.func,
}

export default CheckoutCTA
