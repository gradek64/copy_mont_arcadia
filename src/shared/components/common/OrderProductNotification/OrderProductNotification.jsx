import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default class OrderProductNotification extends Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    boldMessage: PropTypes.string,
    hasError: PropTypes.bool,
  }

  static defaultProps = {
    hasError: false,
    boldMessage: '',
  }

  render() {
    const { message, hasError, boldMessage } = this.props
    const messageClass = classnames('OrderProductNotification-message', {
      'OrderProductNotification-message--hasError': hasError,
    })
    const iconClass = classnames('OrderProductNotification-icon', {
      'OrderProductNotification-icon--hasError': hasError,
    })
    return message ? (
      <div className="OrderProductNotification">
        <div className="OrderProductNotification-content">
          <span className={iconClass} />
          <p className={messageClass}>
            {boldMessage && (
              <span className="OrderProductNotification-bold">
                {boldMessage}
              </span>
            )}{' '}
            {message}
          </p>
        </div>
      </div>
    ) : null
  }
}
