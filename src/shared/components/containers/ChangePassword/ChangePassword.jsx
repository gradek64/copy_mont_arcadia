import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { path, pathOr, prop, isEmpty, mapObjIndexed } from 'ramda'
import { changePwdRequest } from '../../../actions/common/accountActions'
import { changePasswordSuccess } from '../../../actions/components/ChangePasswordActions'
import {
  setFormField,
  resetForm,
  setFormMessage,
  touchedFormField,
} from '../../../actions/common/formActions'
import Input from '../../common/FormComponents/Input/Input'
import Button from '../../common/Button/Button'
import Message from '../../common/FormComponents/Message/Message'
import AccountHeader from '../../common/AccountHeader/AccountHeader'
import BackToAccountLink from '../MyAccount/BackToAccountLink'
import { validate } from '../../../lib/validator'
import { isNotSameAs } from '../../../lib/validator/validators'
import analyticsDecorator from '../../../../client/lib/analytics/analytics-decorator'

import Form from '../../common/FormComponents/Form/Form'
import PasswordCriteriaIndicator from './../../common/PasswordCriteriaIndicator/PasswordCriteriaIndicator'

@analyticsDecorator('change-password')
@connect(
  (state) => ({
    email: state.account.user.email,
    changePassword: state.forms.changePassword,
    success: state.changePassword.success,
    postResetURL: state.changePassword.postResetURL,
  }),
  {
    changePwdRequest,
    setFormField,
    resetForm,
    setFormMessage,
    touchedFormField,
    changePasswordSuccess,
  }
)
class ChangePassword extends Component {
  static propTypes = {
    email: PropTypes.string,
    setFormMessage: PropTypes.func,
    changePassword: PropTypes.object,
    setFormField: PropTypes.func,
    touchedFormField: PropTypes.func,
    changePwdRequest: PropTypes.func,
    changePasswordSuccess: PropTypes.func,
    resetForm: PropTypes.func,
    success: PropTypes.bool,
    resetPassword: PropTypes.bool,
    postResetURL: PropTypes.string,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  // For validation to work we need to add the email address
  // to the form model from the user account object
  componentDidMount() {
    const { l } = this.context
    const { setFormField, email } = this.props
    this.validationSchema = {
      email: 'email',
      oldPassword: 'password',
      newPassword: [
        'passwordV1',
        isNotSameAs(
          l`Your new password can't be the same as your previous password.`,
          'oldPassword'
        ),
        isNotSameAs(
          l`Please ensure that your password does not contain your email address.`,
          'email'
        ),
      ],
    }
    setFormField('changePassword', 'email', email)
  }

  componentDidUpdate(lastProps) {
    if (lastProps.success && !this.props.success && this.oldPassword)
      this.oldPassword.setFocus()
  }

  componentWillUnmount() {
    this.props.setFormMessage('changePassword', {})
    this.props.changePasswordSuccess(false)
    this.resetForm()
  }

  onSubmit = (ev) => {
    ev.preventDefault()
    const {
      changePwdRequest,
      email,
      changePassword,
      resetPassword,
    } = this.props
    const { oldPassword, newPassword } = changePassword.fields

    changePwdRequest(
      {
        emailAddress: email,
        oldPassword: oldPassword.value,
        newPassword: newPassword.value,
        // passwordConfirm has been removed from changePassword form
        // but changePwdRequest API still needs this therefore is the same value as password.value
        newPasswordConfirm: newPassword.value,
      },
      resetPassword
    )
  }

  resetForm = () => {
    const { email, resetForm } = this.props
    resetForm('changePassword', {
      email,
      oldPassword: '',
      newPassword: '',
    })
  }

  changePasswordAgain = () => {
    this.resetForm()
    this.props.setFormMessage('changePassword', {})
    this.props.changePasswordSuccess(false)
  }

  backToAccount = (e) => {
    const { resetPassword, postResetURL } = this.props
    e.preventDefault()
    browserHistory.push(
      resetPassword && postResetURL ? postResetURL : '/my-account'
    )
    this.props.changePasswordSuccess(false)
  }

  render() {
    const { l } = this.context
    const {
      setFormField,
      touchedFormField,
      success,
      changePassword,
      resetPassword,
      postResetURL,
    } = this.props
    const setField = (name) => (e) =>
      setFormField('changePassword', name, e.target.value)
    const touchedField = (name) => () =>
      touchedFormField('changePassword', name)
    const errors = validate(
      this.validationSchema,
      mapObjIndexed(prop('value'), changePassword.fields),
      l
    )
    const fields = changePassword.fields
    const newPasswordValue = pathOr('', ['newPassword', 'value'], fields)
    const isNewPasswordTouched = pathOr(
      false,
      ['newPassword', 'isTouched'],
      fields
    )

    return (
      <section className="ChangePassword">
        {!resetPassword && (
          <AccountHeader
            link="/my-account"
            label={l`Back to My Account`}
            title={l`My password`}
          />
        )}
        <Form
          onSubmit={this.onSubmit}
          className="MyAccount-form MyAccount-wrapper"
        >
          <Input
            isDisabled={success}
            field={changePassword.fields.oldPassword}
            name="oldPassword"
            type="password"
            errors={errors}
            label={l`Current password`}
            placeholder={l`Current password`}
            setField={setField}
            touchedField={touchedField}
            ref={(input) => {
              this.oldPassword = input
            }}
            isRequired
          />
          <h3>{l`New password`}</h3>
          <p
          >{l`We recommend choosing a password that you haven't used for another online account`}</p>
          <Input
            isDisabled={success}
            field={changePassword.fields.newPassword}
            name="newPassword"
            type="password"
            errors={errors}
            label={l`New password`}
            placeholder={l`New password`}
            setField={setField}
            touchedField={touchedField}
            isRequired
          />
          <PasswordCriteriaIndicator
            password={newPasswordValue}
            isTouched={isNewPasswordTouched}
          />
          <Button
            type="submit"
            isDisabled={!isEmpty(errors) || success}
            className="ChangePassword-saveChanges"
          >{l`Save New Password`}</Button>
          <Message
            message={path(['message', 'message'], changePassword)}
            type={path(['message', 'type'], changePassword)}
          />
          <div className={success ? '' : ' hidden'}>
            <BackToAccountLink
              clickHandler={this.backToAccount}
              text={
                resetPassword && postResetURL && postResetURL === '/checkout'
                  ? l`Continue to checkout`
                  : l`Back to My Account`
              }
            />
          </div>
        </Form>
      </section>
    )
  }
}

export default ChangePassword
