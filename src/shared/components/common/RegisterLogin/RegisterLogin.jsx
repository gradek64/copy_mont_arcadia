import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import Login from '../../containers/Login/Login'
import Register from '../../containers/Register/Register'
import ForgetPassword from '../../containers/ForgetPassword/ForgetPassword'

if (process.browser) {
  require('./RegisterLogin.css')
}

export default class RegisterLogin extends Component {
  static propTypes = {
    helmet: PropTypes.object,
    source: PropTypes.string.isRequired,
    getLoginNextRoute: PropTypes.func.isRequired,
    getRegisterNextRoute: PropTypes.func,
    successCallback: PropTypes.func,
    hideRegister: PropTypes.bool,
    loginFormName: PropTypes.string,
  }

  static defaultProps = {
    hideRegister: false,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  render() {
    const {
      helmet,
      getLoginNextRoute,
      getRegisterNextRoute,
      source,
      successCallback,
      hideRegister,
      loginFormName,
    } = this.props

    return (
      <section className="RegisterLogin">
        <Helmet {...helmet} />
        <div
          className={`RegisterLogin-loginSection${
            hideRegister ? ' RegisterLogin-loginSection--noMargin' : ''
          }`}
        >
          <Login
            formName={loginFormName}
            getNextRoute={getLoginNextRoute}
            successCallback={successCallback}
            className="Login--signin"
          />
          <ForgetPassword
            className="ForgetPassword--signin"
            enableScrollToMessage
          />
        </div>
        <div
          className={`RegisterLogin-registerSection${
            hideRegister ? ' RegisterLogin-registerSection--hide' : ''
          }`}
        >
          <Register
            getNextRoute={getRegisterNextRoute}
            source={source}
            successCallback={successCallback}
            className="Register--signin"
          />
        </div>
      </section>
    )
  }
}
