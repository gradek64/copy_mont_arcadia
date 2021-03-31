import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isEmpty, prop, map, path } from 'ramda'
import { validate } from '../../../lib/validator'
import Button from '../../common/Button/Button'
import Input from '../../common/FormComponents/Input/Input'
import Form from '../../common/FormComponents/Form/Form'
import { connect } from 'react-redux'

// selectors
import { getBrandName } from '../../../selectors/configSelectors'

const contactUsUrl = require('./ContactUsUrls.json')

const getContactUsUrlForBrand = (brandName) => {
  return path([brandName], contactUsUrl)
}

const validationSchema = { email: 'email' }

@connect(
  (state) => ({
    brandName: getBrandName(state),
  }),
  {}
)
class ForgetPasswordForm extends Component {
  static propTypes = {
    forgetPasswordForm: PropTypes.object,
    forgetPwdRequest: PropTypes.func,
    isFeatureDesktopResetPasswordEnabled: PropTypes.bool,
    resetForm: PropTypes.func,
    resetPasswordLinkRequest: PropTypes.func,
    setForgetPassword: PropTypes.func,
    setFormField: PropTypes.func,
    setFormMessage: PropTypes.func,
    touchedFormField: PropTypes.func,
    className: PropTypes.string,
    orderId: PropTypes.number,
    enableScrollToMessage: PropTypes.bool,
  }

  static defaultProps = {
    className: '',
    enableScrollToMessage: false,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.formRef = React.createRef()
  }

  componentWillUnmount() {
    this.resetForm()
  }

  scrollToItem() {
    if (
      this.props.enableScrollToMessage &&
      this.formRef &&
      this.formRef.current
    ) {
      const boundingRect = this.formRef.current.getBoundingClientRect()

      if (boundingRect.y + boundingRect.height > window.innerHeight) {
        this.formRef.current.scrollIntoView()
      }
    }
  }

  submitHandler = async (event) => {
    event.preventDefault()

    const {
      forgetPwdRequest,
      forgetPasswordForm,
      isFeatureDesktopResetPasswordEnabled,
      orderId,
    } = this.props

    const data = {
      email: forgetPasswordForm.fields.email.value,
      orderId,
      pageTitle: orderId ? 'ShoppingBag' : undefined,
    }

    if (isFeatureDesktopResetPasswordEnabled) {
      await this.props.resetPasswordLinkRequest(data)
    } else {
      forgetPwdRequest(data)
    }
    this.scrollToItem()
  }

  resetForm = () => {
    if (this.props.setForgetPassword) {
      this.props.setForgetPassword(false)
    }

    if (this.props.setFormMessage) {
      this.props.setFormMessage('forgetPassword', {})
    }

    if (this.props.resetForm) {
      this.props.resetForm('forgetPassword', {
        email: '',
      })
    }
  }

  render() {
    const { l } = this.context

    const {
      forgetPasswordForm,
      setFormField,
      touchedFormField,
      className,
      brandName,
    } = this.props

    const { email } = forgetPasswordForm.fields

    const setField = (field) => (event) =>
      setFormField('forgetPassword', field, event.target.value)

    const touchedField = (field) => () =>
      touchedFormField('forgetPassword', field)

    const errors = validate(
      validationSchema,
      map(prop('value'), forgetPasswordForm.fields),
      l
    )

    const message = path(['message', 'message'], forgetPasswordForm)

    const translatedMessage = message ? l(message) : ''

    const contactUsLink =
      message &&
      message ===
        l`If you have entered an email address that we recognise, you should receive a password reset email shortly. Any problems getting your email?`
        ? l`Contact Us`
        : ''

    return (
      <Form
        className={className}
        onSubmit={this.submitHandler}
        ref={this.formRef}
      >
        <Input
          field={email}
          name="email"
          type="email"
          errors={errors}
          label={l`Email address`}
          placeholder={l`example@domain.com`}
          setField={setField}
          touchedField={touchedField}
        />
        <Button
          className="ForgetPassword-button"
          type="submit"
          isDisabled={!isEmpty(errors)}
        >
          {l`Send Password Reset Email`}
        </Button>
        <p id="ForgetPassword-message">
          {`${translatedMessage} `}
          <a href={getContactUsUrlForBrand(brandName)}>{contactUsLink}</a>
        </p>
      </Form>
    )
  }
}

export default ForgetPasswordForm
