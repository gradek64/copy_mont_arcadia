import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Image from '../Image/Image'
import { Link } from 'react-router'

export default class Swatch extends Component {
  static propTypes = {
    className: PropTypes.string,
    selected: PropTypes.bool,
    onSelect: PropTypes.func,
    index: PropTypes.number,
    imageUrl: PropTypes.string,
    colourName: PropTypes.string,
    seoUrl: PropTypes.string,
    onSwatchClick: PropTypes.func,
  }

  static defaultProps = {
    onSwatchClick: () => {},
  }

  onSelect = (event) => {
    event.preventDefault()
    const { onSelect, index, onSwatchClick } = this.props
    if (onSelect) onSelect(event, index)
    if (onSwatchClick) onSwatchClick(event)
  }

  render() {
    const {
      index,
      imageUrl,
      selected,
      colourName,
      className,
      seoUrl,
    } = this.props

    const colour = typeof colourName === 'string' && colourName.trim()
    const backgroundStyle = colour ? { background: `#${colour}` } : undefined
    // SeoUrl may be blank as the API is not ready. So we back it up with '' to make sure Link doesn't break
    // It is over written with a back up click handler, but will currently break in no-js mode, but this isn't a priority.
    return (
      <div
        className={`Swatch${className ? ` ${className}` : ''}${
          selected ? ' is-selected' : ''
        }`}
      >
        <Link
          key={index}
          className={`Swatch-link${selected ? ' is-selected' : ''}`}
          to={seoUrl || ''}
          onClick={this.onSelect}
          style={backgroundStyle}
        >
          {!colour && <Image className="Swatch-linkImage" src={imageUrl} />}
        </Link>
      </div>
    )
  }
}
