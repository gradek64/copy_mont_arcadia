import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { path, pathOr } from 'ramda'
import classnames from 'classnames'

import { PrivacyGuard } from '../../../../lib'
import Image from '../../Image/Image'
import InputError from '../InputError/InputError'
import FeatureCheck from '../../FeatureCheck/FeatureCheck'
import PreloadImages from '../../PreloadImages/PreloadImages'
import {
  sendAnalyticsValidationState,
  GTM_VALIDATION_STATES,
} from '../../../../analytics'
import { isCheckoutPath } from '../../../../lib/checkout'
import { isIOS } from '../../../../lib/user-agent'

@connect(null, { sendAnalyticsValidationState })
class Input extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    autocomplete: PropTypes.string,
    autofocus: PropTypes.bool,
    className: PropTypes.string,
    errors: PropTypes.object,
    field: PropTypes.object,
    id: PropTypes.string,
    isDisabled: PropTypes.bool,
    isFocused: PropTypes.bool,
    suppressValidationIcon: PropTypes.bool,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    maxLength: PropTypes.number,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
    privacyProtected: PropTypes.bool,
    pattern: PropTypes.string,
    // functions
    setField: PropTypes.func.isRequired,
    touchedField: PropTypes.func.isRequired,
    analyticsOnChange: PropTypes.func,
    onBlur: PropTypes.func,
    sendAnalyticsValidationState: PropTypes.func.isRequired,
    messagePosition: PropTypes.oneOf(['default', 'bottom']),
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    id: undefined,
    pattern: undefined,
    suppressValidationIcon: false,
    field: {},
    onBlur: () => {},
    errors: null,
    messagePosition: 'default',
  }

  analyticEventsValue = null
  blurred = false

  state = {
    isActive: false,
    showPassword: false,
  }

  componentDidMount() {
    // in case input triggered a change event before react was loaded
    this.syncDomValue()

    if (isIOS()) {
      // IOS doesn't trigger react onChange event on autocomplete
      this.inputField.addEventListener('change', this.syncDomValue)
      // IOS doesn't trigger change event on autofill
      this.syncDomValueInterval = setInterval(this.syncDomValue, 100)
    }
  }

  componentDidUpdate(prevProps) {
    const { isFocused, analyticsOnChange } = this.props
    if (prevProps.isFocused !== isFocused && isFocused) {
      this.setFocus()
    }

    const currentValue = path(['field', 'value'], prevProps)
    /**
     * we only want to send analytics events when: blurred, no error, value exists and is a new value
     * need to do here as the errors do not appear until after blur
     * need a flag to show a blur has occurred as componentDidUpdate is frequently called
     */
    if (
      analyticsOnChange &&
      this.blurred &&
      !this.shouldShowError() &&
      currentValue &&
      currentValue !== this.analyticEventsValue
    ) {
      this.analyticEventsValue = currentValue
    }

    this.blurred = false
  }

  componentWillUnmount() {
    this.inputField.removeEventListener('change', this.syncDomValue)
    window.clearInterval(this.syncDomValueInterval)
  }

  setFocus = () => {
    if (!this.inputField) return
    this.inputField.focus()
  }

  syncDomValue = (event) => {
    const { value, name, setField } = this.props
    const domValue = event
      ? event.target.value
      : this.inputField && this.inputField.value
    if (domValue) {
      window.clearInterval(this.syncDomValueInterval)
      if (domValue !== value) {
        setField(name)({
          target: {
            value: domValue,
          },
        })
      }
    }
  }

  handleBlur = (ev) => {
    const { field, name, touchedField, onBlur, errors } = this.props
    const isTouched = pathOr(false, ['isTouched'], field)
    if (!isTouched) {
      touchedField(name)()
    }
    this.toggleActive()
    onBlur(ev)

    if (errors && isCheckoutPath(window.location.pathname)) {
      this.props.sendAnalyticsValidationState({
        id: this.inputField.id,
        validationStatus: errors[name]
          ? GTM_VALIDATION_STATES.FAILURE
          : GTM_VALIDATION_STATES.SUCCESS,
      })
    }
    this.blurred = true
  }

  handleFocus = () => {
    this.toggleActive()
  }

  toggleActive = () => {
    this.setState((state) => ({
      ...state,
      isActive: !state.isActive,
    }))
  }

  togglePassword = (e) => {
    e.preventDefault()
    this.setState(
      (state) => ({
        ...state,
        showPassword: !state.showPassword,
      }),
      () => {
        this.setFocus()
      }
    )
  }

  renderValidationSuccessImage = () => {
    const {
      field,
      value = '',
      suppressValidationIcon,
      errors,
      name,
    } = this.props
    const inputValue = pathOr(value, ['value'], field)
    const isTouched = pathOr(false, ['isTouched'], field)

    return (
      errors &&
      !errors[name] &&
      isTouched &&
      !suppressValidationIcon &&
      inputValue !== '' && (
        <span className="Input-validateIcon Input-validateSuccess">
          <Image
            className={'Image--width100'}
            src="/assets/{brandName}/images/validate-success.svg"
          />
        </span>
      )
    )
  }

  renderValidationErrorImage = () => {
    const { suppressValidationIcon } = this.props

    return (
      this.shouldShowError() &&
      !suppressValidationIcon && (
        <span className="Input-validateIcon Input-validateFail">
          <Image
            className={'Image--width100'}
            src="/assets/{brandName}/images/validate-fail.svg"
          />
        </span>
      )
    )
  }

  renderValidationMessage = (modifier) => {
    const { errors, name } = this.props
    const { l } = this.context
    const classNames = classnames('Input-validationMessage', {
      [`Input-validationMessage--${modifier}`]: modifier,
    })
    return (
      this.shouldShowError() && (
        <InputError className={classNames} name={name}>
          {l(errors[name])}
        </InputError>
      )
    )
  }

  renderInput = () => {
    const {
      field,
      errors,
      label,
      placeholder,
      type,
      name,
      autocomplete,
      value = '',
      setField,
      isDisabled,
      autofocus,
      maxLength,
      privacyProtected,
      pattern,
      id,
    } = this.props

    const { showPassword } = this.state
    const inputType = this.getType()
    const inputValue = pathOr(value, ['value'], field)
    // NOTE: give a default pattern if number type, so iOS displays the numeric keyboard on focus
    const inputPattern = pattern || (type === 'number' ? '[0-9]*' : undefined)
    return (
      <PrivacyGuard noProtection={!(showPassword || privacyProtected)}>
        <input
          id={id || `${name}-${inputType}`}
          className={`Input-field Input-field-${name}`}
          placeholder={placeholder}
          type={inputType}
          name={name}
          autoComplete={autocomplete}
          value={inputValue}
          onChange={setField(name)}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          disabled={isDisabled}
          ref={(node) => {
            this.inputField = node
          }}
          autoFocus={autofocus}
          maxLength={maxLength}
          aria-invalid={!!(errors && errors[name])}
          aria-label={label}
          aria-describedby={`${name}-error`}
          pattern={inputPattern}
        />
      </PrivacyGuard>
    )
  }

  getType() {
    const { type } = this.props
    const { showPassword } = this.state

    return showPassword ? 'text' : type || 'text'
  }

  shouldShowError = () => {
    const { errors, field, name } = this.props

    const isTouched = pathOr(false, ['isTouched'], field)

    return errors && errors[name] && isTouched
  }

  render() {
    const {
      field,
      label,
      name,
      value = '',
      isDisabled,
      isRequired,
      className,
      messagePosition,
    } = this.props

    const { showPassword, isActive } = this.state

    const inputValue = pathOr(value, ['value'], field)
    const isTouched = pathOr(false, ['isTouched'], field)
    const isError = this.shouldShowError()
    const containerClasses = classnames({
      [`FormComponent-${name}`]: !!name,
      Input: true,
      [`Input-${name}`]: true,
      'is-disabled': isDisabled,
      'is-touched': isTouched && inputValue,
      'is-active': isActive,
      'is-erroring': isError,
      [className]: true,
    })

    return (
      <div className={containerClasses}>
        <div className="Input-head">
          <label className="Input-label" htmlFor={`${name}-${this.getType()}`}>
            {label}
            {isRequired && <span className="Input-required">*</span>}
          </label>
          {messagePosition === 'default' && this.renderValidationMessage()}
        </div>
        <div className="Input-row">
          {this.props.type === 'password' ? (
            /* eslint-disable jsx-a11y/no-static-element-interactions */
            <FeatureCheck flag="PASSWORD_SHOW_TOGGLE">
              <PreloadImages
                sources={[
                  '/assets/common/images/password_showing.svg',
                  '/assets/common/images/password_hidden.svg',
                ]}
                render={() => (
                  <div
                    className="Input-toggleButton"
                    onClick={this.togglePassword}
                  >
                    {showPassword ? (
                      <Image
                        className={
                          'Input-revealPasswordImage Input-revealPasswordImage-showing'
                        }
                        src="/assets/common/images/password_showing.svg"
                      />
                    ) : (
                      <Image
                        className={
                          'Input-revealPasswordImage Input-revealPasswordImage-hidden'
                        }
                        src="/assets/common/images/password_hidden.svg"
                      />
                    )}
                  </div>
                )}
              />
            </FeatureCheck>
          ) : /* eslint-enable jsx-a11y/no-static-element-interactions */
          null}
          <div className="Input-container">
            {this.renderInput()}
            {this.renderValidationSuccessImage()}
            {this.renderValidationErrorImage()}
            {messagePosition === 'bottom' &&
              this.renderValidationMessage(messagePosition)}
          </div>
        </div>
      </div>
    )
  }
}

export default Input
