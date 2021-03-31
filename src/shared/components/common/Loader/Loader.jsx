import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class Loader extends Component {
  static propTypes = {
    fillColor: PropTypes.string,
    className: PropTypes.string,
    isButton: PropTypes.bool,
  }

  static defaultProps = {
    fillColor: '#000',
    className: '',
    isButton: false,
  }

  render() {
    const { fillColor, isButton, isInInput, className } = this.props

    /**
     * This modifies class name to ensure globally applied styles aren't
     * applied in this instance
     */
    const classModifier = `${isButton ? '--button' : ''}${
      isInInput ? '--in-input' : ''
    }`
    return (
      <div
        className={`Loader${classModifier} ${className || ''}`}
        role="progressbar"
      >
        <svg
          className={`Loader-image${classModifier}`}
          viewBox="0 0 75 75"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Loading</title>
          <g fill="none" fillRule="evenodd">
            <g fill={fillColor}>
              <circle
                className="Loader-circle Loader-circle1"
                cx="59.5"
                cy="16.5"
                r="7.5"
              />
              <circle
                className="Loader-circle Loader-circle2"
                cx="67.5"
                cy="37.5"
                r="7.5"
              />
              <circle
                className="Loader-circle Loader-circle3"
                cx="58.5"
                cy="58.5"
                r="7.5"
              />
              <circle
                className="Loader-circle Loader-circle4"
                cx="37.5"
                cy="67.5"
                r="7.5"
              />
              <circle
                className="Loader-circle Loader-circle5"
                cx="16.5"
                cy="58.5"
                r="7.5"
              />
              <circle
                className="Loader-circle Loader-circle6"
                cx="7.5"
                cy="37.5"
                r="7.5"
              />
              <circle
                className="Loader-circle Loader-circle7"
                cx="16.5"
                cy="15.5"
                r="7.5"
              />
              <circle
                className="Loader-circle Loader-circle8"
                cx="38.5"
                cy="7.5"
                r="7.5"
              />
            </g>
          </g>
        </svg>
      </div>
    )
  }
}
