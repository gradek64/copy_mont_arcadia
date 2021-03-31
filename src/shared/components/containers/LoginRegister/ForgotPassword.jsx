import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { isFeatureDesktopResetPasswordEnabled } from '../../../selectors/featureSelectors'
import {
  forgetPwdRequest,
  resetPasswordLinkRequest,
  setForgetPassword,
} from '../../../actions/common/accountActions'
import {
  resetForm,
  setFormField,
  setFormMessage,
  touchedFormField,
} from '../../../actions/common/formActions'
import ForgetPasswordForm from '../../common/ForgetPasswordForm/ForgetPasswordForm'
import LoginRegisterHeader from './LoginRegisterHeader'

class ForgotPassword extends Component {
  static contextTypes = {
    l: PropTypes.func,
  }
  goBack = () => {
    browserHistory.goBack()
  }
  render() {
    const { l } = this.context
    return (
      <section className={'ForgotPassword'}>
        <div className={'ForgotPassword-inner'}>
          <div className={'ForgotPassword-textContainer'}>
            <LoginRegisterHeader>
              {l`Forgot your password?`}
            </LoginRegisterHeader>
            <p className="ForgotPassword-text">{l`Not to worry, we will email you a single use link to reset your password`}</p>
          </div>
          <ForgetPasswordForm className="ForgotPassword-form" {...this.props} />
          <button
            className={'ForgotPassword-cancel'}
            onClick={this.goBack}
          >{l`Cancel`}</button>
        </div>
      </section>
    )
  }
}

export default connect(
  (state) => ({
    forgetPwd: state.account.forgetPwd,
    forgetPasswordForm: state.forms.forgetPassword,
    isFeatureDesktopResetPasswordEnabled: isFeatureDesktopResetPasswordEnabled(
      state
    ),
  }),
  {
    forgetPwdRequest,
    resetForm,
    resetPasswordLinkRequest,
    setForgetPassword,
    setFormField,
    setFormMessage,
    touchedFormField,
  }
)(ForgotPassword)

export { ForgotPassword as WrappedForgotPassword }
