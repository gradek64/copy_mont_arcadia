import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

// Components
import Button from '../../Button/Button'
import InputError from '../InputError/InputError'

const FormButton = (
  {
    name,
    error = '',
    isDisabled = false,
    type = 'button',
    onClick,
    children,
    customClass,
    touched = false,
  },
  { l }
) => {
  const componentClassName = classnames(
    'ButtonContainer',
    {
      [`ButtonContainer-${name}`]: !!name,
    },
    {
      [`FormComponent-${name}`]: !!name,
    },
    customClass
  )

  return (
    <div className={componentClassName}>
      {!isDisabled && touched && error ? (
        <InputError name={name} className="Input-validationMessage">
          {l(error)}
        </InputError>
      ) : null}
      <Button isDisabled={isDisabled} type={type} clickHandler={onClick}>
        {children}
      </Button>
    </div>
  )
}

FormButton.propTypes = {
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
  isDisabled: PropTypes.bool,
  type: PropTypes.string,
  onClick: PropTypes.func,
  customClass: PropTypes.string,
}

FormButton.contextTypes = {
  l: PropTypes.func,
}

export default FormButton
