import React, { Component } from 'react'
import PropTypes from 'prop-types'

if (process.browser) {
  require('./SignInMessage.css')
}

export default class SignInMessage extends Component {
  static propTypes = {
    centerAlign: PropTypes.bool,
  }
  static contextTypes = {
    l: PropTypes.func,
  }
  render() {
    const { l } = this.context
    const { centerAlign } = this.props
    return (
      <div
        className={`SignInMessage${
          centerAlign ? ' SignInMessage--center' : ''
        }`}
      >
        <p className="SignInMessage-header">{l`You’ve been inactive for a while`}</p>
        <p className="SignInMessage-body">{l`Sign in again to pick up where you left off`}</p>
      </div>
    )
  }
}
