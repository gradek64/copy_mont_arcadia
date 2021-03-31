import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { prop, mapObjIndexed, isEmpty, path, pick, contains } from 'ramda'
import { connect } from 'react-redux'
import throttle from 'lodash.throttle'
import { bindActionCreators } from 'redux'
import { validate } from '../../../lib/validator'
import { isSameAs } from '../../../lib/validator/validators'
import {
  setFormField,
  touchedFormField,
  resetForm,
  setFormMessage,
  touchedMultipleFormFields,
  focusedFormField,
} from '../../../actions/common/formActions'
import {
  loginRequest,
  registerRequest,
} from '../../../actions/common/authActions'
import Message from '../../common/FormComponents/Message/Message'
import { checkAccountExists } from '../../../actions/common/accountActions'
import Input from '../../common/FormComponents/Input/Input'
import SubmitButton from './SubmitButton'
import Checkbox from '../../common/FormComponents/Checkbox/Checkbox'
import PrivacyNotice from '../../common/PrivacyNotice/PrivacyNotice'
import LoginRegisterHeader from './LoginRegisterHeader'
import Form from '../../common/FormComponents/Form/Form'

const emailValueFormPath = ['registerLoginForm', 'fields', 'email', 'value']
const formType = 'registerLogin'

const formSchema = (l) => ({
  email: 'email',
  password: 'password',
  confirmPassword: [
    'password',
    isSameAs(l`Please ensure that both passwords match`, 'password'),
  ],
})

@connect(
  (state) => ({
    registerLoginForm: state.forms[formType],
  }),
  (dispatch) => {
    const actions = bindActionCreators(
      {
        checkAccountExists,
        focusedFormField,
        loginUser: loginRequest,
        registerRequest,
        resetForm,
        setFormField,
        setFormMessage,
        touchedFormField,
        touchedMultipleFormFields,
      },
      dispatch
    )
    return {
      ...actions,
      checkAccountExists: throttle(actions.checkAccountExists, 500, {
        leading: true,
      }),
    }
  }
)
class LoginRegister extends Component {
  static propTypes = {
    checkAccountExists: PropTypes.func.isRequired,
    className: PropTypes.string,
    errorCallback: PropTypes.func,
    formName: PropTypes.string,
    loginUser: PropTypes.func.isRequired,
    getNextLoginRoute: PropTypes.func,
    getNextRegisterRoute: PropTypes.func,
    registerLoginForm: PropTypes.object.isRequired,
    resetForm: PropTypes.func.isRequired,
    setFormField: PropTypes.func.isRequired,
    setFormMessage: PropTypes.func.isRequired,
    successCallback: PropTypes.func,
    touchedFormField: PropTypes.func,
    touchedMultipleFormFields: PropTypes.func.isRequired,
  }

  static defaultProps = {
    className: '',
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  constructor(props, context) {
    super(props)
    this.state = {
      formMode: 'default',
      errors: {},
    }
    this.formSchema = formSchema(context.l)
  }

  componentWillUnmount() {
    this.resetForm()
  }

  onSubmit = (e) => {
    e.preventDefault()
    const {
      touchedMultipleFormFields,
      loginUser,
      registerRequest,
      getNextLoginRoute,
      getNextRegisterRoute,
      registerLoginForm: {
        fields: { email, password, confirmPassword, subscribe },
      },
      successCallback,
      errorCallback,
      formName = formType,
    } = this.props

    const { formMode } = this.state

    touchedMultipleFormFields(formType, Object.keys(this.formFields))

    if (Object.keys(this.formErrors).length) {
      return
    }

    if (formMode === 'login') {
      loginUser({
        credentials: {
          username: email.value,
          password: password.value,
        },
        getNextRoute: getNextLoginRoute,
        successCallback,
        errorCallback,
        formName,
      })
    } else if (formMode === 'register') {
      registerRequest({
        formData: {
          email: email.value,
          password: password.value,
          passwordConfirm: confirmPassword.value,
          subscribe,
        },
        getNextRoute: getNextRegisterRoute,
      })
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { checkAccountExists } = this.props
    const errors = this.getValidationErrors(nextProps)
    this.setState({ errors })
    const email = path(emailValueFormPath, this.props)
    const nextEmail = path(emailValueFormPath, nextProps)
    if (email !== nextEmail) {
      if (isEmpty(nextEmail)) {
        this.setState({
          formMode: 'default',
        })
      } else {
        const error = this.getFieldErrors('email', errors)
        if (isEmpty(error))
          checkAccountExists({
            email: nextEmail,
            successCallback: this.setAccountState,
          })
      }
    }
  }

  getFieldErrors = (fieldOrFields, errors = this.state.errors) => {
    const fields = Array.isArray(fieldOrFields)
      ? fieldOrFields
      : [fieldOrFields]
    return pick(fields, errors)
  }

  getValidationErrors = (propData = this.props) => {
    const value = prop('value')
    const validationObject = mapObjIndexed(
      value,
      path(['registerLoginForm', 'fields'], propData)
    )
    return validate(this.formSchema, validationObject, this.context.l)
  }

  resetForm = () => {
    const { resetForm, setFormMessage } = this.props

    setFormMessage(formType, {})
    resetForm(formType, {
      email: '',
      password: '',
      confirmPassword: '',
      rememberme: false,
      subscribe: false,
    })
  }

  setAccountState = ({ body: { exists: accountExists } }) => {
    const { setFormMessage, registerLoginForm } = this.props
    const {
      message: { message },
    } = registerLoginForm
    if (accountExists) {
      this.setState({
        formMode: 'login',
      })
    } else {
      this.setState({
        formMode: 'register',
      })
    }
    if (message) setFormMessage(formType, {})
  }

  setFormField = (field) => (e) =>
    this.props.setFormField(formType, field, e.target.value)

  touchedFormField = (field) => () =>
    this.props.touchedFormField(formType, field)

  setChecked = (name) => (e) =>
    this.props.setFormField(formType, name, e.target.checked)

  get formErrors() {
    const { formMode } = this.state
    switch (formMode) {
      case 'login':
        return this.getFieldErrors(['email'])
      case 'register':
        return this.getFieldErrors(['email', 'password', 'confirmPassword'])
      default:
        return this.getFieldErrors(['email'])
    }
  }

  get formFields() {
    const { formMode } = this.state
    const { registerLoginForm } = this.props
    switch (formMode) {
      case 'login':
        return pick(['email', 'password'], registerLoginForm.fields)
      case 'register':
        return pick(
          ['email', 'password', 'confirmPassword'],
          registerLoginForm.fields
        )
      default:
        return pick(['email'], registerLoginForm.fields)
    }
  }

  get passwordFields() {
    const { l } = this.context
    const { formMode } = this.state
    const { password, confirmPassword } = this.formFields
    switch (formMode) {
      case 'login':
        return (
          <Input
            id="Login-password"
            field={password}
            name="password"
            type="password"
            errors={this.formErrors}
            label={l`Password`}
            setField={this.setFormField}
            touchedField={this.touchedFormField}
            isFocused={this.formFields.password.isFocused}
            isRequired
            suppressValidationIcon
            messagePosition="bottom"
          />
        )
      case 'register':
        return [
          <Input
            id="Register-password"
            key="Register-password"
            field={password}
            name="password"
            type="password"
            errors={this.formErrors}
            label={l`Password`}
            setField={this.setFormField}
            touchedField={this.touchedFormField}
            isFocused={this.formFields.password.isFocused}
            isRequired
            messagePosition="bottom"
          />,
          <Input
            id="Register-confirmPassword"
            key="Register-confirmPassword"
            field={confirmPassword}
            type="password"
            name="confirmPassword"
            errors={this.formErrors}
            label={l`Confirm Password`}
            setField={this.setFormField}
            touchedField={this.touchedFormField}
            isRequired
            messagePosition="bottom"
          />,
        ]
      default:
        return null
    }
  }

  get headerText() {
    const { l } = this.context
    const { formMode } = this.state

    if (formMode === 'register')
      return (
        <LoginRegisterHeader>
          {l`Looks like you're new`}
          <br />
          {l`Please sign up`}
        </LoginRegisterHeader>
      )
    if (formMode === 'login')
      return (
        <LoginRegisterHeader>
          {l`Good to see you again`}
          <br />
          {l`Please sign in`}
        </LoginRegisterHeader>
      )
    return (
      <LoginRegisterHeader>
        {l`Welcome`} <br /> {l`Please enter your email`}
      </LoginRegisterHeader>
    )
  }

  get checkBoxesAndPrivacy() {
    const { l } = this.context
    const { registerLoginForm } = this.props
    const { fields } = registerLoginForm
    const { subscribe, rememberme } = fields
    return [
      <Checkbox
        className="Checkbox-rememberme"
        key="rememberme"
        checked={rememberme}
        onChange={this.setChecked('rememberme')}
        name="rememberme"
      >{l`Remember me`}</Checkbox>,
      <Checkbox
        key="subscribe"
        className="Checkbox-subscription"
        checked={subscribe}
        onChange={this.setChecked('subscribe')}
        name="subscribe"
      >{l`Please sign me up for emails`}</Checkbox>,
      <PrivacyNotice />,
    ]
  }

  render() {
    const { l } = this.context
    const { formMode } = this.state
    const { registerLoginForm, className } = this.props
    const {
      message: { message, type },
    } = registerLoginForm
    const isLogin = formMode === 'login'
    const isLoginOrRegister = contains(formMode, ['register', 'login'])
    const submitActive = isEmpty(this.formErrors) && isLoginOrRegister

    return (
      <section className={`LoginRegister ${className}`}>
        {this.headerText}
        <Form
          className="LoginRegister-form"
          onSubmit={this.onSubmit}
          method="POST"
        >
          <Input
            id="LoginRegister-email"
            errors={this.formErrors}
            field={this.formFields.email}
            isRequired
            label={l`Email address`}
            name="email"
            placeholder={l`example@domain.com`}
            setField={this.setFormField}
            touchedField={this.touchedFormField}
            type="email"
            messagePosition="bottom"
          />
          {isLogin && (
            <Link
              className={'LoginRegister-forgotPassword'}
              to="/forgot-password"
            >{l`Forgotten your password?`}</Link>
          )}
          {this.passwordFields}
          {message && <Message message={message} type={type} />}
          {isLoginOrRegister && this.checkBoxesAndPrivacy}
          <SubmitButton formMode={formMode} isActive={submitActive} />
        </Form>
      </section>
    )
  }
}

export default LoginRegister
