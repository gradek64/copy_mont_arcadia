// Imports
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isEmpty, mapObjIndexed, path, prop, pathOr } from 'ramda'
import { connect } from 'react-redux'

// Actions
import {
  setFormField,
  touchedFormField,
  resetForm,
} from '../../../actions/common/formActions'
import { registerUser } from '../../../actions/common/authActions'
import {
  sendAnalyticsClickEvent,
  sendAnalyticsErrorMessage,
  ANALYTICS_ERROR,
  GTM_CATEGORY,
  GTM_ACTION,
} from '../../../analytics'

// Selectors
import { isFeatureRememberMeEnabled } from '../../../../shared/selectors/featureSelectors'

// Validators
import { validate } from '../../../lib/validator'
import { isNotSameAs } from '../../../lib/validator/validators'

// Components
import Form from '../../common/FormComponents/Form/Form'
import PrivacyNotice from '../../common/PrivacyNotice/PrivacyNotice'
import Message from '../../common/FormComponents/Message/Message'
import Input from '../../common/FormComponents/Input/Input'
import Checkbox from '../../common/FormComponents/Checkbox/Checkbox'
import Button from '../../common/Button/Button'
import PasswordCriteriaIndicator from '../../common/PasswordCriteriaIndicator/PasswordCriteriaIndicator'

/*
 * We have to name the 'Remember me' checkbox 'rememberMeRegister'
 * to distinguish it from the 'Remember me' checkbox in Login.jsx
 * because a label element's htmlFor assumes that names are unique.
 */

const defaultValues = {
  email: '',
  password: '',
  subscribe: false,
  rememberMeRegister: false,
}

@connect(
  (state) => ({
    registrationForm: state.forms.register,
    isFeatureRememberMeEnabled: isFeatureRememberMeEnabled(state),
  }),
  {
    touchedFormField,
    setFormField,
    sendAnalyticsClickEvent,
    sendAnalyticsErrorMessage,
    resetForm,
    registerUser,
  }
)
class Register extends Component {
  // TODO - to review the required properties as they don't seem to be used
  static propTypes = {
    registrationForm: PropTypes.object.isRequired,
    setFormField: PropTypes.func.isRequired,
    touchedFormField: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    registerUser: PropTypes.func.isRequired,
    getNextRoute: PropTypes.func,
    className: PropTypes.string,
    successCallback: PropTypes.func,
    errorCallback: PropTypes.func,
    formName: PropTypes.string,
    isGuestCheckoutForm: PropTypes.bool,
  }

  static defaultProps = {
    className: '',
    isGuestCheckoutForm: false,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  componentDidMount() {
    const { resetForm } = this.props
    resetForm('register', defaultValues)
  }

  getErrors = () => {
    const { l } = this.context
    const validationSchema = {
      email: 'email',
      password: [
        'passwordV1',
        isNotSameAs(l`Password cannot be your email`, 'email'),
      ],
    }
    return validate(
      validationSchema,
      mapObjIndexed(prop('value'), this.props.registrationForm.fields),
      l
    )
  }

  getSanitisedFormData(fields, source) {
    const { isGuestCheckoutForm } = this.props
    let formData = mapObjIndexed(prop('value'), fields)
    // rename rememberMeRegister -> rememberMe
    formData = {
      ...formData,
      source,
      passwordConfirm: formData.password,
      rememberMe: formData.rememberMeRegister,
      mergeGuestOrder: isGuestCheckoutForm,
    }
    delete formData.rememberMeRegister

    return formData
  }

  submitHandler = (e) => {
    e.preventDefault()
    const {
      getNextRoute,
      source,
      registrationForm: { fields },
      registerUser,
      formName,
      successCallback,
      sendAnalyticsClickEvent,
      sendAnalyticsErrorMessage,
      errorCallback,
    } = this.props
    if (Object.keys(this.getErrors()).length) {
      sendAnalyticsErrorMessage(ANALYTICS_ERROR.REGISTRATION_FAILED)
      return
    }

    const formData = this.getSanitisedFormData(fields, source)
    sendAnalyticsClickEvent({
      category: GTM_CATEGORY.REGISTER,
      action: GTM_ACTION.SUBMIT,
      label: 'register-in-button',
      rememberMe: !!formData.rememberMe,
    })
    registerUser({
      formData,
      getNextRoute,
      formName,
      successCallback,
      errorCallback,
    })
  }

  render() {
    const { l } = this.context
    const {
      setFormField,
      touchedFormField,
      registrationForm,
      className,
      isFeatureRememberMeEnabled,
      isGuestCheckoutForm,
    } = this.props
    const setField = (name) => (e) =>
      setFormField('register', name, e.target.value)
    const setChecked = (name) => (e) =>
      setFormField('register', name, e.target.checked)
    const touchedField = (name) => () => touchedFormField('register', name)
    const fields = registrationForm.fields
    const errors = this.getErrors()
    const passwordValue = pathOr('', ['password', 'value'], fields)
    const isPasswordTouched = pathOr(false, ['password', 'isTouched'], fields)

    return (
      <section className={`Register ${className}`}>
        {!isGuestCheckoutForm && (
          <h3 className="Register-header">{l`New Customer?`}</h3>
        )}
        <Form onSubmit={this.submitHandler} className="Register-form">
          {!isGuestCheckoutForm && (
            <Input
              id="Register-email"
              field={fields.email}
              name="email"
              type="email"
              errors={errors}
              label={l`Email address`}
              placeholder={l`example@domain.com`}
              setField={setField}
              touchedField={touchedField}
              isRequired
            />
          )}
          <Input
            id="Register-password"
            field={fields.password}
            name="password"
            type="password"
            errors={errors}
            label={l`Password`}
            setField={setField}
            touchedField={touchedField}
            isRequired
          />

          <PasswordCriteriaIndicator
            password={passwordValue}
            isTouched={isPasswordTouched}
          />

          {isFeatureRememberMeEnabled && (
            <Checkbox
              className="Checkbox-remember-me"
              checked={fields.rememberMeRegister}
              onChange={setChecked('rememberMeRegister')}
              name="rememberMeRegister"
            >{l`Remember me`}</Checkbox>
          )}

          <Checkbox
            className="Checkbox-subscription"
            checked={fields.subscribe}
            onChange={setChecked('subscribe')}
            name="subscribe"
          >{l`Please sign me up for emails`}</Checkbox>

          <PrivacyNotice />
          <Button
            type="submit"
            isDisabled={!isEmpty(errors)}
            isActive={isEmpty(errors)}
            className="Register-saveChanges"
          >
            {l`CREATE AN ACCOUNT`}
          </Button>
          <Message
            message={path(['message', 'message'], registrationForm)}
            type={path(['message', 'type'], registrationForm)}
          />
        </Form>
      </section>
    )
  }
}

export default Register
