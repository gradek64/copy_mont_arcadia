import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ResponsiveImage from '../../common/ResponsiveImage/ResponsiveImage'
import { imageSizesPropTypes } from '../../../constants/amplience'

export default class Thumbnail extends Component {
  static propTypes = {
    source: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    className: PropTypes.string,
    carouselFull: PropTypes.bool.isRequired,
    setCarouselIndex: PropTypes.func.isRequired,
    amplienceUrl: PropTypes.string,
    sizes: imageSizesPropTypes.isRequired,
    useProgressiveJPG: PropTypes.bool,
  }

  static defaultProps = {
    className: '',
    amplienceUrl: '',
    useProgressiveJPG: false,
  }

  render() {
    const {
      source,
      className,
      setCarouselIndex,
      index,
      carouselFull,
      amplienceUrl,
      sizes,
      useProgressiveJPG,
    } = this.props

    const fullClass = carouselFull ? `${className}-thumb--fullCarousel` : ''

    return (
      <ResponsiveImage
        className={`${className}-thumb ${fullClass}`}
        amplienceUrl={amplienceUrl}
        sizes={sizes}
        src={source}
        onClick={() => {
          setCarouselIndex(index)
        }}
        useProgressiveJPG={useProgressiveJPG}
      />
    )
  }
}
