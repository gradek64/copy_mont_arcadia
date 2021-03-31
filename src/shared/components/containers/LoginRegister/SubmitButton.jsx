import React from 'react'
import PropTypes from 'prop-types'
import Button from '../../common/Button/Button'

const SubmitButton = ({ formMode, isActive }, { l }) => {
  let buttonText
  let disabled
  switch (formMode) {
    case 'register':
      buttonText = l`Register`
      disabled = !isActive
      break
    case 'login':
      disabled = !isActive
      buttonText = l`Sign In`
      break
    default:
      disabled = true
      buttonText = l`Continue`
  }
  return (
    <Button
      className="Login-submitButton"
      isActive={!disabled}
      type="submit"
      isDisabled={disabled}
    >
      {buttonText}
    </Button>
  )
}
SubmitButton.propTypes = {
  formMode: PropTypes.oneOf(['default', 'login', 'register']),
  isActive: PropTypes.bool,
}
SubmitButton.contextTypes = {
  l: PropTypes.func,
}

export default SubmitButton
