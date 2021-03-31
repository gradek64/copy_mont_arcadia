import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
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

class ExpiredPassword extends Component {
  static propTypes = {
    forgetPwd: PropTypes.bool.isRequired,
    forgetPasswordForm: PropTypes.shape({
      fields: PropTypes.shape({
        email: PropTypes.shape({
          value: PropTypes.string,
          isDirty: PropTypes.bool,
          isTouched: PropTypes.bool,
          isFocused: PropTypes.bool,
        }),
        isLoading: PropTypes.bool,
        message: PropTypes.oneOf([
          PropTypes.shape({}),
          PropTypes.shape({
            type: PropTypes.string,
            message: PropTypes.string,
          }),
        ]),
      }),
    }).isRequired,
    isFeatureDesktopResetPasswordEnabled: PropTypes.func.isRequired,
    forgetPwdRequest: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    resetPasswordLinkRequest: PropTypes.func.isRequired,
    setForgetPassword: PropTypes.func.isRequired,
    setFormField: PropTypes.func.isRequired,
    setFormMessage: PropTypes.func.isRequired,
    touchedFormField: PropTypes.func.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  render() {
    const { className, ...props } = this.props
    const { l } = this.context
    return (
      <section className="ExpiredPassword">
        <h2>{l`Reset link expired or not valid`}</h2>
        <p>{l`link no longer valid`}</p>
        <p>{l`link expires in one hour`}</p>
        <ForgetPasswordForm {...props} />
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
)(ExpiredPassword)

export { ExpiredPassword as WrappedExpiredPassword }
