/* eslint-disable react/no-did-mount-set-state */
/**
 * This is the reset password link component, which is meant to be used to
 * handle the reset password link that gets sent to a user via an email
 * when the /api/account/reset-password-link endpoint is hit.
 *
 * NOTE: the link within the email goes to legacy desktop and comes out
 * in the following format:
 * https://ts.pplive.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/ResetPasswordLink?storeId=12556&token=iaresean%40gmail.com&hash=PTDX9O3cs1pqfZabugt1Y4xOjec%3D%0A&catalogId=33057&langId=-1&stop_mobi=yes&CMPID=EML_SER_4
 *
 * All the query string paramaters from the link need to be forwarded
 * to the rewritten URL.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import {
  compose,
  path,
  pathOr,
  prop,
  isEmpty,
  isNil,
  mapObjIndexed,
} from 'ramda'
import analyticsDecorator from '../../../../client/lib/analytics/analytics-decorator'
import Input from '../../common/FormComponents/Input/Input'
import Button from '../../common/Button/Button'
import Message from '../../common/FormComponents/Message/Message'
import Form from '../../common/FormComponents/Form/Form'
import { validate } from '../../../lib/validator'
import { isNotSameAs } from '../../../lib/validator/validators'
import {
  resetForm,
  setFormField,
  setFormMessage,
  touchedFormField,
} from '../../../actions/common/formActions'
import { leavingResetPasswordForm } from '../../../actions/components/ResetPasswordActions'
import {
  resetPasswordRequest,
  resetPasswordLinkRequest,
  validateResetPasswordLinkExpiry,
} from '../../../actions/common/accountActions'
import {
  getForgetPasswordForm,
  getResetPasswordForm,
} from '../../../selectors/formsSelectors'
import {
  getSuccess,
  getBasketCount,
} from '../../../selectors/resetPasswordSelectors'
import { isResetPasswordLinkValid } from '../../../selectors/common/accountSelectors'
import ExpiredPassword from '../ExpiredPassword/ExpiredPassword'
import PasswordCriteriaIndicator from './../../common/PasswordCriteriaIndicator/PasswordCriteriaIndicator'

const isNilOrEmpty = (x) => isNil(x) || isEmpty(x)

export class ResetPassword extends Component {
  static propTypes = {
    leavingResetPasswordForm: PropTypes.func,
    location: PropTypes.object,
    passwordResetSuccessfully: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
    resetForm: PropTypes.func,
    resetPasswordForm: PropTypes.object,
    resetPasswordRequest: PropTypes.func,
    resetPasswordLinkRequest: PropTypes.func,
    setFormField: PropTypes.func,
    setFormMessage: PropTypes.func,
    touchedFormField: PropTypes.func,
    basketCount: PropTypes.number, // eslint-disable-line react/no-unused-prop-types
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  static needs = [(location) => validateResetPasswordLinkExpiry(location)]

  constructor(props) {
    super(props)
    this.state = {
      invalidEmailData: false,
      emailData: undefined,
    }
  }

  UNSAFE_componentWillMount() {
    // Parse the query string to ensure we have all the expected parameters from
    // the respective email link
    const { location } = this.props
    const { query } = location
    const { hash, token, orderId } = query
    if (isNilOrEmpty(hash) || isNilOrEmpty(token)) {
      this.setState(() => ({ invalidEmailData: true }))
      return
    }

    // Store the minimum set of fields we are required to forward on the
    // reset password handler in order to complete the reset password action.
    this.setState(() => ({
      emailData: {
        hash,
        token,
        orderId,
      },
    }))

    // Set up the form validator
    const { l } = this.context
    const { setFormField } = this.props
    this.validationSchema = {
      // For validation to work we need to add the email address
      // to the form model so that it can be referred to by the
      // isNotSameAs helpers.
      email: 'required',
      password: [
        'passwordV1',
        isNotSameAs(
          l`Please ensure that your password does not contain your email address.`,
          'email'
        ),
      ],
    }

    // Ensure we use the email address from the token against our email
    // field so that validation works as expected
    setFormField('resetPassword', 'email', token)
  }

  componentDidMount() {
    // Focus on the new password field. We have to do a setTimeout trick
    // otherwise the focus does not work.
    setTimeout(() => {
      const input = path(
        [
          'passwordEl',
          // The input is wrapped by redux 😭 so we need this additional tapping
          // into in order to get the actual instance.
          'refs',
          'wrappedInstance',
        ],
        this
      )
      if (input) {
        input.setFocus()
      }
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { passwordResetSuccessfully, basketCount } = nextProps

    const { emailData } = this.state
    const { orderId } = emailData

    if (!this.passwordResetSuccessfully && passwordResetSuccessfully) {
      if (orderId && orderId !== '0') {
        browserHistory.push('/checkout')
      } else {
        browserHistory.push(`/my-account?getBasket=${basketCount > 0}`)
      }
    }
  }

  componentWillUnmount() {
    const { resetForm, setFormMessage, leavingResetPasswordForm } = this.props
    leavingResetPasswordForm()
    setFormMessage('resetPassword', {})
    resetForm('resetPassword', {
      email: '',
      password: '',
    })
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { resetPasswordRequest, resetPasswordForm } = this.props
    const { fields } = resetPasswordForm
    const { password } = fields
    const { emailData } = this.state
    const { hash, CMPID, orderId } = emailData
    resetPasswordRequest({
      CMPID,
      email: emailData.token,
      hash: encodeURIComponent(hash),
      orderId,
      password: password.value,
      // passwordConfirm has been removed from resetPassword form
      // but resetPasswordRequest API still needs this therefore is the same value as password.value
      passwordConfirm: password.value,
    })
  }

  onGetAnotherLink = (e) => {
    e.preventDefault()
    const { emailData } = this.state
    const data = { email: decodeURIComponent(emailData.token) }
    this.props.resetPasswordLinkRequest(data)
  }

  passwordRef = (el) => {
    if (el == null) return
    this.passwordEl = el
  }

  render() {
    const { invalidEmailData } = this.state
    const { l } = this.context

    if (invalidEmailData) {
      return (
        <section className="ResetPassword">
          <div className="ResetPassword-form">
            <h3>{l`Reset password`}</h3>
            <Message
              message={l`This reset password link is invalid.`}
              type="error"
            />
          </div>
        </section>
      )
    }

    const {
      resetPasswordForm,
      setFormField,
      touchedFormField,
      success,
      isResetPasswordLinkValid,
    } = this.props
    const setField = (name) => (e) =>
      setFormField('resetPassword', name, e.target.value)
    const touchedField = (name) => () => touchedFormField('resetPassword', name)
    const errors = validate(
      this.validationSchema,
      mapObjIndexed(prop('value'), resetPasswordForm.fields),
      l
    )
    const message = path(['message', 'message'], resetPasswordForm)
    const messageType = path(['message', 'type'], resetPasswordForm)
    const fields = resetPasswordForm.fields
    const passwordValue = pathOr('', ['password', 'value'], fields)
    const isPasswordTouched = pathOr(false, ['password', 'isTouched'], fields)

    return isResetPasswordLinkValid ? (
      <section className="ResetPassword ResetPassword-form">
        <Form onSubmit={this.onSubmit}>
          <h3>{l`Enter New Password`}</h3>
          <p
          >{l`We recommend choosing a password that you haven't used for another online account`}</p>
          <Input
            errors={errors}
            field={resetPasswordForm.fields.password}
            isDisabled={success}
            isRequired
            label={l`New password`}
            name="password"
            placeholder={l`New password`}
            ref={this.passwordRef}
            setField={setField}
            touchedField={touchedField}
            type="password"
          />
          <PasswordCriteriaIndicator
            password={passwordValue}
            isTouched={isPasswordTouched}
          />
          {message && <Message type={messageType} message={message} />}
          <Button
            className="ResetPassword-saveChanges"
            isDisabled={!isEmpty(errors) || success}
            type="submit"
          >
            {l`Save New Password`}
          </Button>
        </Form>
      </section>
    ) : (
      <ExpiredPassword />
    )
  }
}

export default compose(
  analyticsDecorator('reset-password'),
  connect(
    (state) => ({
      forgetPasswordForm: getForgetPasswordForm(state),
      resetPasswordForm: getResetPasswordForm(state),
      passwordResetSuccessfully: getSuccess(state),
      basketCount: getBasketCount(state),
      isResetPasswordLinkValid: isResetPasswordLinkValid(state),
    }),
    {
      leavingResetPasswordForm,
      resetForm,
      resetPasswordRequest,
      resetPasswordLinkRequest,
      setFormField,
      setFormMessage,
      touchedFormField,
    }
  )
)(ResetPassword)
