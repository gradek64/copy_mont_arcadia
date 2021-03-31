import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class NavButton extends Component {
  static propTypes = {
    className: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired,
    maxVisible: PropTypes.number.isRequired,
    thumbsLength: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  render() {
    const {
      className,
      thumbsLength,
      maxVisible,
      direction,
      onClick,
    } = this.props

    if (thumbsLength <= maxVisible) {
      return null
    }

    const baseClass = className && direction ? `${className}-navButton` : ''

    return (
      <div className={`${className}-navContainer`}>
        <button
          className={`${baseClass} ${
            baseClass && direction ? `${baseClass}--${direction}` : ''
          }`}
          onClick={onClick}
        />
      </div>
    )
  }
}
