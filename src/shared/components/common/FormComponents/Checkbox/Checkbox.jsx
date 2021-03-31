import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { path } from 'ramda'
import { connect } from 'react-redux'

import {
  sendAnalyticsValidationState,
  GTM_VALIDATION_STATES,
} from '../../../../analytics'
import { isInCheckout as checkIfInCheckout } from '../../../../selectors/routingSelectors'

const Checkbox = (props, { l }) => {
  const {
    children,
    className,
    labelClassName,
    checked,
    name,
    isDisabled,
    isRequired,
    reverse,
    field,
    errors,
    isInCheckout,
    sendValidationState,
    ...attributes
  } = props
  const error = errors && errors[name]
  const isErroring = !!(field.isTouched && error)
  const classNames = classnames(
    `FormComponent-${name}`,
    'Checkbox',
    `CheckboxName-${name}`,
    className,
    {
      'Checkbox--reverse': reverse,
      'is-disabled': isDisabled,
      'is-erroring': isErroring,
    }
  )
  const checkedValue = path(['value'], checked)
  const handleBlur = () => {
    if (errors && isInCheckout) {
      sendValidationState({
        id: name,
        validationStatus: errors[name]
          ? GTM_VALIDATION_STATES.FAILURE
          : GTM_VALIDATION_STATES.SUCCESS,
      })
    }
  }

  return (
    <label className={classNames} htmlFor={`${name}-checkbox`}>
      <span className="Checkbox-checkboxContainer">
        <input
          id={`${name}-checkbox`}
          name={name}
          checked={checkedValue}
          className="Checkbox-field"
          type="checkbox"
          disabled={isDisabled}
          role="checkbox"
          aria-checked={checkedValue}
          aria-labelledby={`${name}-label`}
          onBlur={handleBlur}
          {...attributes}
        />
        <span className="Checkbox-check" />
      </span>
      <span
        className={`Checkbox-label ${labelClassName}`}
        id={`${name}-label`}
        aria-label={name}
        htmlFor={name}
      >
        {children}
        {isRequired && <span className="Checkbox-required">*</span>}
        {isErroring && (
          <span className="Checkbox-validationMessage">{l(error)}</span>
        )}
      </span>
    </label>
  )
}

Checkbox.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  checked: PropTypes.object.isRequired,
  name: PropTypes.string,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  reverse: PropTypes.bool,
  field: PropTypes.object,
  errors: PropTypes.objectOf(PropTypes.string),
  sendValidationState: PropTypes.func.isRequired,
}

Checkbox.defaultProps = {
  className: '',
  labelClassName: '',
  field: {},
  errors: null,
  checked: {},
}

Checkbox.contextTypes = {
  l: PropTypes.func,
}

export default connect(
  (state) => ({
    isInCheckout: checkIfInCheckout(state),
  }),
  { sendValidationState: sendAnalyticsValidationState }
)(Checkbox)
