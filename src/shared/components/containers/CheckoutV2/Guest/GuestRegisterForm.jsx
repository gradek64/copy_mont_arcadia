// Imports
import React from 'react'
import PropTypes from 'prop-types'

// Components
import Register from '../../Register/Register'

const GuestRegisterForm = ({ l }) => {
  const formHeader = l`Enter a password to checkout faster next time!`
  const formCopy = l`We recommend choosing a password that you haven't used for another online account`
  return (
    <div className="GuestRegisterForm">
      <div className="GuestRegisterForm-header">
        <h1 className="GuestRegisterForm-header--left">{formHeader}</h1>
      </div>
      <p className="GuestRegisterForm-copy">{formCopy}</p>
      <Register className="Register--guest" isGuestCheckoutForm />
    </div>
  )
}

GuestRegisterForm.contextTypes = {
  l: PropTypes.func.isRequired,
}

export default GuestRegisterForm
