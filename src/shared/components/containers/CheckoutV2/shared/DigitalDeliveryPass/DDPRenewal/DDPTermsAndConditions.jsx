import React from 'react'
import PropTypes from 'prop-types'

const DDPTermsAndConditions = ({ openModal, buttonText }) => (
  <div className="DDPTermsAndConditions">
    <button
      type="button"
      className="DDPTermsAndConditions-button"
      onClick={() => openModal()}
    >
      {buttonText}
    </button>
  </div>
)

DDPTermsAndConditions.propTypes = {
  openModal: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
}

export default DDPTermsAndConditions
