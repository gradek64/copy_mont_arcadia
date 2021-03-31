import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Hammer from 'react-hammerjs'
import ResponsiveImage from '../ResponsiveImage/ResponsiveImage'
import {
  amplienceImagesPropTypes,
  imageSizesPropTypes,
} from '../../../constants/amplience'

export default class CarouselThumbnail extends Component {
  static propTypes = {
    carousel: PropTypes.object,
    assets: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.shape({
          url: PropTypes.string,
        })
      ),
      PropTypes.node,
    ]).isRequired,
    amplienceImages: amplienceImagesPropTypes,
    sizes: imageSizesPropTypes,
    name: PropTypes.string,
    mode: PropTypes.string,
    className: PropTypes.string,
    handleSwipe: PropTypes.func,
    onClick: PropTypes.func,
    backCarousel: PropTypes.func,
    forwardCarousel: PropTypes.func,
  }

  static defaultProps = {
    amplienceImages: [],
    sizes: null,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  addClassNamesToCarouselImages(assets, visibleItemsCount) {
    // If carousel buttons have rendered
    // then add spacing/padding to avoid overlapping
    return assets.length > visibleItemsCount
      ? 'Carousel-images Carousel-images--padding'
      : 'Carousel-images'
  }

  centerThumbnails(assets, visibleItemsCount) {
    // If there are more than 4 assets center thumbnails
    return assets.length > visibleItemsCount ? { justifyContent: 'center' } : {}
  }

  render() {
    const { l } = this.context
    const {
      handleSwipe,
      forwardCarousel,
      backCarousel,
      onClick = () => {},
      assets,
      name,
      carousel,
      mode,
      className = '',
      amplienceImages,
      sizes,
    } = this.props

    const { current } = carousel[name]
    const visibleItemsCount = 4

    const listItems = assets.map((asset, i) => (
      <li
        key={`thumb-${name}${asset.url}`}
        className="Carousel-item"
        onClick={() => onClick(i)}
        role="presentation"
      >
        {asset.url ? (
          <ResponsiveImage
            amplienceUrl={amplienceImages[i]}
            sizes={sizes}
            className="Carousel-image"
            src={asset.url}
          />
        ) : (
          asset
        )}
      </li>
    ))

    return (
      <div
        className={`Carousel${mode ? ` Carousel--${mode}` : ''} ${className}`}
      >
        <Hammer onSwipe={(e) => handleSwipe(e)}>
          <div
            className={this.addClassNamesToCarouselImages(
              assets,
              visibleItemsCount
            )}
          >
            <ul
              className="Carousel-list"
              style={this.centerThumbnails(assets, visibleItemsCount)}
            >
              {listItems.slice(current)}
              {listItems.slice(0, current)}
            </ul>
          </div>
        </Hammer>

        {assets.length > visibleItemsCount
          ? [
              <button
                key="left"
                className={`Carousel-arrow Carousel-arrow--top`}
                onClick={() => backCarousel(name)}
              >{l`left`}</button>,
              <button
                key="right"
                className={`Carousel-arrow Carousel-arrow--bottom`}
                onClick={() => forwardCarousel(name)}
              >{l`right`}</button>,
            ]
          : ''}
      </div>
    )
  }
}
