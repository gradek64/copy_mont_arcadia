import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { heDecode } from '../../../../lib/html-entities'

export default class Message extends Component {
  static propTypes = {
    message: PropTypes.string,
    type: PropTypes.oneOf(['message', 'confirm', 'error', 'normal']),
    className: PropTypes.string,
    onDidMount: PropTypes.func,
    onUnMount: PropTypes.func,
    isCompact: PropTypes.bool,
    window: PropTypes.object,
  }

  static defaultProps = {
    type: 'confirm',
    isCompact: false,
  }

  componentDidMount() {
    const { onDidMount } = this.props
    if (onDidMount) onDidMount(this)
  }

  componentWillUnmount() {
    const { onUnMount } = this.props
    if (onUnMount) onUnMount()
  }

  scrollTo() {
    const actualWindow = this.props.window || window
    if (this.messageElement && actualWindow) {
      actualWindow.scrollTo(0, this.messageElement.offsetTop)
    }
  }

  render() {
    const { message, type, className, isCompact } = this.props
    return (
      <div
        className={`Message${isCompact ? ' Message--compact' : ''} ${
          message ? 'is-shown' : 'is-hidden'
        } ${`is-${type}`} ${className || ''}`}
        role="alert"
        aria-live="assertive"
        aria-relevant="additions removals"
        ref={(element) => {
          this.messageElement = element
        }}
      >
        <p
          className={`Message-message${className ? ` ${className}Inner` : ''}`}
        >
          {heDecode(message)}
        </p>
      </div>
    )
  }
}
