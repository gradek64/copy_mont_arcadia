import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class ButtonLink extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
    isDisabled: PropTypes.bool,
    clickHandler: PropTypes.func,
    type: PropTypes.string,
  }

  static defaultProps = {
    type: 'button',
    className: '',
    isDisabled: false,
  }

  handleClick = (e) => {
    const { isDisabled, clickHandler } = this.props
    if (!isDisabled && clickHandler) clickHandler(e)
  }

  render() {
    const { isDisabled, type, className } = this.props

    return (
      <div className={'ButtonLink'}>
        <button
          className={`ButtonLink-button${
            className ? ` ${className}` : className
          }`}
          type={type}
          role="button"
          disabled={isDisabled}
          aria-disabled={isDisabled}
          aria-hidden={isDisabled}
          onClick={this.handleClick}
        >
          {this.props.children}
        </button>
      </div>
    )
  }
}
