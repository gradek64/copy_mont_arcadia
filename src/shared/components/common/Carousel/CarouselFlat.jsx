import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Hammer from 'react-hammerjs'
import Image from '../Image/Image'

export default class CarouselFlat extends Component {
  static propTypes = {
    name: PropTypes.string,
    carousel: PropTypes.object,
    assets: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.shape({
          url: PropTypes.string,
        })
      ),
      PropTypes.node,
    ]).isRequired,
    onClick: PropTypes.func,
    backCarousel: PropTypes.func,
    forwardCarousel: PropTypes.func,
    handleSwipe: PropTypes.func,
    mode: PropTypes.string,
    className: PropTypes.string,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  render() {
    const { l } = this.context
    const {
      assets,
      forwardCarousel,
      backCarousel,
      carousel,
      name,
      handleSwipe,
      mode,
      onClick = () => {},
      className,
    } = this.props

    const { current } = carousel[name]
    const visibleItemsCount = 4
    const itemWidth = `${100 / assets.length}%`
    const listWidth = `${assets.length * (100 / visibleItemsCount)}%`

    const listItems = assets.map((asset, i) => (
      <li
        role="presentation"
        key={`i${name}${asset.url}`}
        className="Carousel-item"
        onClick={() => onClick(i)}
        style={{ width: itemWidth }}
      >
        {asset.url ? (
          <Image className="Carousel-image" src={asset.url} />
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
          <div className="Carousel-images">
            <ul className="Carousel-list" style={{ width: listWidth }}>
              {listItems.slice(current)}
              {listItems.slice(0, current)}
            </ul>
          </div>
        </Hammer>

        {assets.length > 4
          ? [
              <button
                key="left"
                className={`Carousel-arrow Carousel-arrow--left`}
                onClick={() => backCarousel(name)}
              >{l`left`}</button>,
              <button
                key="right"
                className={`Carousel-arrow Carousel-arrow--right`}
                onClick={() => forwardCarousel(name)}
              >{l`right`}</button>,
            ]
          : ''}
      </div>
    )
  }
}
