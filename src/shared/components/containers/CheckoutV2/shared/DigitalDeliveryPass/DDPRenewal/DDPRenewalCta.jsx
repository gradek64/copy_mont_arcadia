import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const DDPRenewalCta = ({ isContentCentered, buttonText, clickHandler }) => {
  const buttonClass = classNames('Button DDPRenewal-button', {
    'DDPRenewal-button--centered': isContentCentered,
  })
  return (
    <button className={buttonClass} onClick={clickHandler}>
      {buttonText}
    </button>
  )
}

DDPRenewalCta.propTypes = {
  buttonText: PropTypes.string.isRequired,
  clickHandler: PropTypes.func.isRequired,
  isContentCentered: PropTypes.bool,
}

DDPRenewalCta.defaultProps = {
  isContentCentered: false,
}

export default DDPRenewalCta
