import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { validate } from '../../../lib/validator'
import {
  sendAnalyticsClickEvent,
  sendAnalyticsErrorMessage,
  ANALYTICS_ERROR,
  GTM_CATEGORY,
  GTM_ACTION,
} from '../../../analytics'
import {
  setFormField,
  touchedFormField,
  resetForm,
  setFormMessage,
  touchedMultipleFormFields,
  focusedFormField,
} from '../../../actions/common/formActions'
import { loginRequest } from '../../../actions/common/authActions'
import Button from '../../common/Button/Button'
import Input from '../../common/FormComponents/Input/Input'
import Message from '../../common/FormComponents/Message/Message'
import Form from '../../common/FormComponents/Form/Form'
import { prop, mapObjIndexed, path, isEmpty } from 'ramda'
import Checkbox from '../../common/FormComponents/Checkbox/Checkbox'
import { isFeatureRememberMeEnabled } from '../../../../shared/selectors/featureSelectors'
import { isUserPartiallyAuthenticated } from '../../../../shared/selectors/userAuthSelectors'
import { getUserEmail } from '../../../selectors/common/accountSelectors'

const defaultFormName = 'login'

@connect(
  (state, props) => ({
    loginForm: state.forms[props.formName || defaultFormName],
    isFeatureRememberMeEnabled: isFeatureRememberMeEnabled(state),
    isUserPartiallyAuthenticated: isUserPartiallyAuthenticated(state),
    userEmail: getUserEmail(state),
    isPartiallyAuthenticated: isUserPartiallyAuthenticated(state),
  }),
  {
    setFormField,
    touchedFormField,
    resetForm,
    sendAnalyticsClickEvent,
    sendAnalyticsErrorMessage,
    setFormMessage,
    touchedMultipleFormFields,
    focusedFormField,
    loginUser: loginRequest,
  }
)
class Login extends Component {
  static propTypes = {
    loginForm: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired,
    setFormField: PropTypes.func.isRequired,
    touchedFormField: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    setFormMessage: PropTypes.func.isRequired,
    touchedMultipleFormFields: PropTypes.func.isRequired,
    focusedFormField: PropTypes.func.isRequired,
    getNextRoute: PropTypes.func,
    className: PropTypes.string,
    successCallback: PropTypes.func,
    errorCallback: PropTypes.func,
    formName: PropTypes.string,
    userEmail: PropTypes.string,
    isPartiallyAuthenticated: PropTypes.bool,
  }

  static defaultProps = {
    className: '',
    isPartiallyAuthenticated: false,
    formName: defaultFormName,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  componentDidMount() {
    this.resetForm()
  }

  componentDidUpdate(prevProps) {
    const {
      focusedFormField,
      loginForm,
      userEmail,
      isFeatureRememberMeEnabled,
      formName,
    } = this.props

    if (isFeatureRememberMeEnabled && prevProps.userEmail !== userEmail) {
      this.updateUserEmail()
    }

    if (isFeatureRememberMeEnabled !== prevProps.isFeatureRememberMeEnabled) {
      this.resetForm()
    }

    const { isFocused } = loginForm.fields.password
    const wasFocused = prevProps.loginForm.fields.password.isFocused
    if (isFocused && wasFocused !== isFocused) {
      focusedFormField(formName, 'password', false)
    }
  }

  componentWillUnmount() {
    this.resetForm()
  }

  onSubmit = (e) => {
    e.preventDefault()
    const {
      touchedMultipleFormFields,
      loginUser,
      getNextRoute,
      loginForm,
      successCallback,
      errorCallback,
      formName,
      sendAnalyticsClickEvent,
      sendAnalyticsErrorMessage,
    } = this.props
    touchedMultipleFormFields(formName, Object.keys(loginForm.fields))
    if (Object.keys(this.getErrors()).length) {
      sendAnalyticsErrorMessage(ANALYTICS_ERROR.LOGIN_FAILED)
      return
    }

    const {
      email,
      password,
      // Temporarily set default value for `rememberMe` incase it is not enabled
      rememberMe = { value: false },
    } = loginForm.fields

    sendAnalyticsClickEvent({
      category: GTM_CATEGORY.SIGN_IN,
      action: GTM_ACTION.SUBMIT,
      label: 'sign-in-button',
      rememberMe: !!rememberMe.value,
    })

    loginUser({
      credentials: {
        username: email.value,
        password: password.value,
        rememberMe: !!rememberMe.value,
      },
      getNextRoute,
      successCallback,
      errorCallback,
      formName,
    })
  }

  getErrors = () => {
    const validationSchema = {
      email: 'email',
      password: 'password',
      rememberMe: 'rememberMe',
    }
    return validate(
      validationSchema,
      mapObjIndexed(prop('value'), this.props.loginForm.fields),
      this.context.l
    )
  }

  updateUserEmail = () => {
    const {
      setFormField,
      isFeatureRememberMeEnabled,
      userEmail,
      formName,
    } = this.props

    if (!isFeatureRememberMeEnabled) {
      return
    }

    setFormField(formName, 'email', userEmail)
  }

  resetForm = () => {
    const {
      resetForm,
      setFormMessage,
      isFeatureRememberMeEnabled,
      userEmail,
      formName,
    } = this.props

    setFormMessage(formName, {})

    const formValues = {
      email: '',
      password: '',
    }

    if (isFeatureRememberMeEnabled) {
      const userRememberMe = this.getRememberMe()
      formValues.email = userRememberMe ? userEmail : ''
      formValues.rememberMe = userRememberMe
    }

    resetForm(formName, formValues)
  }

  // When 'Remember Me' is enabled
  //   Pre-fill the email address for a remembered user but don't force it to persist
  //   once the user edits the email field.
  // Otherwise
  //   Pass the email field through unaltered.
  getPreferredEmail(email) {
    if (this.props.isFeatureRememberMeEnabled) {
      const userRememberMe = this.getRememberMe()
      return userRememberMe && email.value === '' && !email.isDirty
        ? { ...email, value: this.props.userEmail }
        : email
    }

    return email
  }

  // When 'Remember Me' is enabled
  //   Pre-fill the 'Remember me' checkbox for a remembered user but don't force it
  //   to persist once the user toggles the checkbox.
  // Otherwise
  //   "Don't care" value, because it should only be used under this feature flag.
  getPreferredRememberMe(rememberMe) {
    if (this.props.isFeatureRememberMeEnabled) {
      const userRememberMe = this.getRememberMe()
      return userRememberMe && rememberMe.value === false && !rememberMe.isDirty
        ? { ...rememberMe, value: userRememberMe }
        : rememberMe
    }

    return undefined
  }

  getRememberMe() {
    return (
      Boolean(this.props.isFeatureRememberMeEnabled) &&
      Boolean(this.props.isUserPartiallyAuthenticated)
    )
  }

  render() {
    const { l } = this.context
    const {
      loginForm,
      formName,
      setFormField,
      touchedFormField,
      className,
      isFeatureRememberMeEnabled,
      isPartiallyAuthenticated,
    } = this.props
    const { email, password, rememberMe } = loginForm.fields
    const isPasswordFocused = password.isFocused
    const errors = this.getErrors()
    const message = path(['message', 'message'], loginForm)
    const setField = (field) => (e) =>
      setFormField(formName, field, e.target.value)
    const setChecked = (field) => (e) =>
      setFormField(formName, field, e.target.checked)
    const touchedField = (field) => () => touchedFormField(formName, field)

    const preferredEmail = this.getPreferredEmail(email)
    const preferredRememberMe = this.getPreferredRememberMe(rememberMe)

    return (
      <section className={`Login ${className}`}>
        <h3 className="Login-header">{l`Sign In`}</h3>
        <Form className="Login-form" onSubmit={this.onSubmit} method="POST">
          <Input
            id="Login-email"
            field={preferredEmail}
            name="email"
            type="email"
            errors={errors}
            label={l`Email address`}
            placeholder={l`example@domain.com`}
            setField={setField}
            touchedField={touchedField}
            autocomplete={isPartiallyAuthenticated ? 'off' : undefined}
            isRequired
          />

          <Input
            id="Login-password"
            field={password}
            name="password"
            type="password"
            errors={errors}
            label={l`Password`}
            setField={setField}
            touchedField={touchedField}
            isFocused={isPasswordFocused}
            autocomplete={isPartiallyAuthenticated ? 'on' : undefined}
            isRequired
          />

          {isFeatureRememberMeEnabled && (
            <Checkbox
              className="Checkbox-remember-me"
              checked={preferredRememberMe}
              onChange={setChecked('rememberMe')}
              name="rememberMe"
            >{l`Remember me`}</Checkbox>
          )}

          <Button
            className="Login-submitButton"
            isActive={isEmpty(errors)}
            isDisabled={!isEmpty(errors)}
            type="submit"
          >{l`Sign In`}</Button>
          {message && (
            <Message
              message={message}
              type={path(['message', 'type'], loginForm)}
            />
          )}
        </Form>
      </section>
    )
  }
}

export default Login
