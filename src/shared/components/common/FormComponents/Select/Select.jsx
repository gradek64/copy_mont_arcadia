import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { PrivacyGuard } from '../../../../lib'
import InputError from '../InputError/InputError'
import {
  sendAnalyticsValidationState,
  GTM_VALIDATION_STATES,
} from '../../../../analytics'
import { isInCheckout as checkIfInCheckout } from '../../../../selectors/routingSelectors'

@connect(
  (state) => ({
    isInCheckout: checkIfInCheckout(state),
  }),
  { sendAnalyticsValidationState }
)
class Select extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    field: PropTypes.object,
    errors: PropTypes.object,
    options: PropTypes.array,
    firstDisabled: PropTypes.string,
    className: PropTypes.string,
    selectContainerClassName: PropTypes.string,
    label: PropTypes.string,
    hideLabel: PropTypes.bool,
    defaultValue: PropTypes.string,
    value: PropTypes.string,
    onBlur: PropTypes.func,
    isDisabled: PropTypes.bool,
    autofocus: PropTypes.bool,
    isRequired: PropTypes.bool,
    noTranslate: PropTypes.bool,
    privacyProtected: PropTypes.bool,
    isInCheckout: PropTypes.bool,
    sendAnalyticsValidationState: PropTypes.func.isRequired,
  }

  static defaultProps = {
    options: [],
    className: '',
    selectContainerClassName: '',
    label: '',
    onBlur: () => {},
    isInCheckout: false,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  // Set the displayed default value in the form model as well
  // otherwise sends empty payload if not changed
  componentDidMount() {
    if (this.props.defaultValue)
      this.changeHandler({ target: { value: this.props.defaultValue } })
    if (this.props.value) this.selected = true
  }

  // on clear form if the value changes to '' then set it to the default value
  UNSAFE_componentWillUpdate({ defaultValue, value }) {
    if (value === '' && defaultValue)
      this.changeHandler({ target: { value: defaultValue } })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.value) this.selected = true
  }

  handleBlur = (...args) => {
    const { name, errors, onBlur, isInCheckout } = this.props
    if (errors && isInCheckout) {
      this.props.sendAnalyticsValidationState({
        id: name,
        validationStatus: errors[name]
          ? GTM_VALIDATION_STATES.FAILURE
          : GTM_VALIDATION_STATES.SUCCESS,
      })
    }
    onBlur(...args)
  }

  getSelectHead = (
    name,
    label,
    error,
    isTouched = false,
    hideLabel,
    isRequired
  ) => {
    const { l } = this.context
    const showError =
      (this.selected === true && !!error) ||
      (this.selected === undefined && !!error && isTouched)

    if (!label && !showError) return null

    return (
      <div className="Select-head">
        {label && (
          <label
            className={`Select-label ${hideLabel ? 'screen-reader-text' : ''}`}
            htmlFor={name}
          >
            {label}
            {isRequired && <span className="Select-required">*</span>}
          </label>
        )}
        {showError && (
          <InputError className="Select-validationMessage" name={name}>
            {l(error)}
          </InputError>
        )}
      </div>
    )
  }

  changeHandler = (e) => {
    const { onChange } = this.props

    onChange(e)
    this.selected = true
  }

  render() {
    const {
      className,
      label,
      options,
      name,
      field,
      value,
      firstDisabled,
      isDisabled,
      isRequired,
      errors,
      hideLabel,
      autofocus,
      noTranslate,
      privacyProtected,
      selectContainerClassName,
    } = this.props

    const containerClassName = `${name ? ` FormComponent-${name}` : ''}`

    return (
      <div
        className={`${containerClassName} Select ${className}${
          errors && errors[name] && field && field.isTouched
            ? ' is-erroring'
            : ''
        }${isDisabled ? ' is-disabled' : ''}${
          !firstDisabled || this.selected ? ' is-selected' : ''
        }`}
      >
        {this.getSelectHead(
          name,
          label,
          errors && errors[name],
          field && field.isTouched,
          hideLabel,
          isRequired
        )}
        <div className={`Select-container ${selectContainerClassName}`}>
          <PrivacyGuard noProtection={!privacyProtected}>
            <select
              autoFocus={autofocus}
              className={`Select-select`}
              name={name}
              value={value || firstDisabled}
              onChange={(e) => this.changeHandler(e)}
              onBlur={this.handleBlur}
              disabled={isDisabled}
              id={name}
              aria-label={label}
              aria-activedescendant={value}
              role="listbox"
              required={isRequired}
            >
              {firstDisabled && (
                <option
                  disabled
                  className={`Select-select--option ${
                    noTranslate ? ' notranslate' : ''
                  }`}
                >
                  {firstDisabled}
                </option>
              )}
              {options[0] instanceof Object
                ? options.map((opt, i) => (
                    <option
                      className={`Select-select--option ${
                        noTranslate ? ' notranslate' : ''
                      }`}
                      key={i} // eslint-disable-line react/no-array-index-key
                      disabled={opt.disabled}
                      value={opt.value}
                      role="option"
                      aria-selected={false}
                    >
                      {opt.label}
                    </option>
                  ))
                : options.map((opt, i) => (
                    <option
                      className={`Select-select--option ${
                        noTranslate ? ' notranslate' : ''
                      }`}
                      key={i} // eslint-disable-line react/no-array-index-key
                      value={opt}
                      role="option"
                      aria-selected={false}
                    >
                      {opt}
                    </option>
                  ))}
            </select>
          </PrivacyGuard>
        </div>
      </div>
    )
  }
}

export default Select
