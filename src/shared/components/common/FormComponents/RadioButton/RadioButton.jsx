import React from 'react'
import PropTypes from 'prop-types'

const RadioButton = ({
  id,
  checked = false,
  label,
  name,
  onChange,
  isDisabled,
  children,
  fullWidth,
  noMargin,
  value,
}) => {
  const containerClassName = `${name ? ` FormComponent-${name}` : ''}`

  return (
    <label
      className={`${containerClassName} RadioButton ${
        isDisabled ? 'is-disabled' : ''
      } ${fullWidth ? 'RadioButton--fullWidth' : ''} ${
        noMargin ? 'RadioButton--noMargin' : ''
      }`}
      htmlFor={id}
    >
      <input
        id={id}
        checked={checked}
        className="RadioButton-input"
        type="radio"
        aria-label={label}
        name={name}
        onChange={(e) => {
          if (e.target.checked !== checked) {
            onChange(e)
          }
        }}
        value={value}
        disabled={isDisabled}
      />
      <span className="RadioButton-content">{children || label}</span>
    </label>
  )
}

RadioButton.propTypes = {
  checked: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  value: PropTypes.string,
}

RadioButton.defaultProps = {
  name: '',
  isDisabled: false,
}

export default RadioButton
