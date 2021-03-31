import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class InputError extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    name: PropTypes.string,
  }

  componentDidMount() {
    if (this.errorText) this.errorText.focus()
  }

  render() {
    const { className, name, children } = this.props

    return (
      <span
        className={className}
        role="alert"
        aria-live="assertive"
        aria-relevant="all"
        id={`${name}-error`}
        ref={(span) => {
          this.errorText = span
        }}
      >
        {children}
      </span>
    )
  }
}
