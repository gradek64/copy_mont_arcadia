import React, { Component } from 'react'
import classNames from 'classnames'
import { scrollToPoint } from '../../../lib/scroll-helper'
import Hammer from 'react-hammerjs'
import ResponsiveImage from '../ResponsiveImage/ResponsiveImage'
import AccessibleText from '../AccessibleText/AccessibleText'
import PropTypes from 'prop-types'
import { path } from 'ramda'
import { browserHistory } from 'react-router'
import CarouselImagesOverlay from './CarouselImagesOverlay'

import KEYS from '../../../constants/keyboardKeys'
import {
  imageSizesPropTypes,
  amplienceImagesPropTypes,
} from '../../../constants/amplience'

const ZOOM_FACTOR = 2.5
const ZOOM_FACTOR_DESKTOP = 2
const KEYBOARD_PAN_DIFF = 20

export const EMPTY_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

export default class CarouselNormal extends Component {
  constructor(props) {
    super(props)
    this.CarouselImageListRef = React.createRef()
    this.CarouselRef = React.createRef()
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    carousel: PropTypes.object.isRequired,
    assets: PropTypes.array.isRequired,
    amplienceImages: amplienceImagesPropTypes,
    sizes: imageSizesPropTypes,
    mode: PropTypes.string,
    setCarouselIndex: PropTypes.func,
    backCarousel: PropTypes.func.isRequired,
    forwardCarousel: PropTypes.func.isRequired,
    carouselZoom: PropTypes.func,
    carouselPan: PropTypes.func,
    handleSwipe: PropTypes.func,
    showcase: PropTypes.bool,
    lazyLoad: PropTypes.bool,
    autoplay: PropTypes.bool,
    arrowColor: PropTypes.string,
    isMobile: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    enableImageOverlay: PropTypes.bool,
    touchEnabled: PropTypes.bool,
    isHidden: PropTypes.bool,
    useProgressiveJPG: PropTypes.bool,
    productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  static defaultProps = {
    isHidden: false,
    enableImageOverlay: false,
    touchEnabled: false,
    className: '',
    amplienceImages: [],
    sizes: null,
    useProgressiveJPG: false,
    productId: undefined,
  }

  state = {
    shouldAnimate: false,
    height: undefined,
  }

  componentDidMount() {
    this.originX = 0
    this.originY = 0
    this.carouselAutoPlayInterval = setInterval(this.autoplay, 4000)
    if (!this.props.isMobile && !this.props.touchEnabled) this.addHoverPan()
    const firstCarouselImage = this.getSelectedCarouselImage()
    if (firstCarouselImage) {
      firstCarouselImage.addEventListener('load', this.setInitialHeight)
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { isMobile, touchEnabled } = this.props
    const { name } = nextProps

    if (
      path(['carousel', name, 'current'], nextProps) !==
      path(['carousel', name, 'current'], this.props)
    ) {
      this.setState({ shouldAnimate: true })
    }

    if (isMobile && !nextProps.isMobile && !touchEnabled) this.addHoverPan()
    else if (!isMobile && nextProps.isMobile && !touchEnabled)
      this.removeHoverPan()
  }

  componentWillUnmount() {
    const {
      name,
      carouselZoom,
      carouselPan,
      isMobile,
      touchEnabled,
    } = this.props

    window.removeEventListener('resize', this.clearCarouselHeight)
    carouselZoom(name, 1)
    carouselPan(name, 0, 0)
    clearInterval(this.carouselAutoPlayInterval)
    if (!isMobile && !touchEnabled) this.removeHoverPan()
  }

  setInitialHeight = () => {
    const firstCarouselImage = this.getSelectedCarouselImage()
    if (firstCarouselImage) {
      this.updateCarouselHeight(firstCarouselImage)
      firstCarouselImage.removeEventListener('load', this.setInitialHeight)
    }
  }

  onClick = (i) => {
    //
    // In case of PDP Carousel
    // assets = [{"assetType":"IMAGE_LARGE","index":2,"url":"http://media.topshop.com/wcsstore/TopShop/images/catalog/TS20L01JMVE_Zoom_M_1.jpg"}], ...]
    //
    // In case of CMS home page Carousel
    // assets = [{"target":"","alt":"Slider 3","link":"/en/tsuk/category/clothing-427/shorts-448/N-89nZ208lZdgl","source":"http://media.topshop.com/wcsstore/ConsumerDirectStorefrontAssetStore/images…ors/color7/cms/pages/json/json-0000116661/images/DENIM-BACK-GIRLFRIEND.jpg","url":"http://media.topshop.com/wcsstore/ConsumerDirectStorefrontAssetStore/images…ors/color7/cms/pages/json/json-0000116661/images/DENIM-BACK-GIRLFRIEND.jpg"}, ...]
    //
    const { assets, onClick } = this.props
    onClick(i)

    if (assets[i].link) {
      browserHistory.push(assets[i].link)
    }
  }

  onKeyDown = (e) => {
    const { keyCode } = e
    const {
      carouselPan,
      carousel,
      name,
      backCarousel,
      forwardCarousel,
    } = this.props
    const { zoom, panX, panY } = carousel[name]
    const isZoomed = zoom > 1

    const stop = () => {
      e.preventDefault()
      e.stopPropagation()
    }

    const pan = (diffX, diffY) => {
      const newX =
        Math.abs(this.originX + diffX) < this.diffX
          ? this.originX + diffX
          : panX
      const newY =
        Math.abs(this.originY + diffY) < this.diffY
          ? this.originY + diffY
          : panY
      this.originX = newX
      this.originY = newY
      carouselPan(name, newX, newY)
    }

    switch (keyCode) {
      case KEYS.ENTER:
        return forwardCarousel(name)
      case KEYS.A:
        stop()
        return isZoomed ? pan(KEYBOARD_PAN_DIFF, 0) : backCarousel(name)
      case KEYS.D:
        stop()
        return isZoomed ? pan(-KEYBOARD_PAN_DIFF, 0) : forwardCarousel(name)
      case KEYS.W:
        stop()
        return isZoomed && pan(0, KEYBOARD_PAN_DIFF)
      case KEYS.S:
        stop()
        return isZoomed && pan(0, -KEYBOARD_PAN_DIFF)
      case KEYS.Z:
        stop()
        this.handleDoubleTap()
        break
      default:
    }
  }

  autoplay = () => {
    const { autoplay, handleSwipe, assets } = this.props
    if (autoplay && assets.length > 1) handleSwipe({ direction: 2 })
  }

  getCurrentImage() {
    return this.CarouselRef.current.querySelector(
      '.Carousel-item.is-selected img'
    )
  }

  handleDoubleTap = () => {
    const carouselOffset = this.CarouselRef.offsetTop - 8
    const scrollYPos = window.scrollY || window.pageYOffset
    if (scrollYPos >= carouselOffset) scrollToPoint(carouselOffset, 100)
    const { isMobile, name, carousel, carouselZoom, carouselPan } = this.props
    if (!isMobile) return
    const { zoom } = carousel[name]

    this.panScroll = false

    const carouselImage = this.getCurrentImage()
    this.carouselWidth = carouselImage.offsetWidth
    this.carouselHeight = carouselImage.offsetHeight

    if (zoom === 1) {
      carouselZoom(name, ZOOM_FACTOR)
    } else {
      carouselZoom(name, 1)
      carouselPan(name, 0, 0)
      this.originX = 0
      this.originY = 0
    }

    this.diffX = (this.carouselWidth * ZOOM_FACTOR - this.carouselWidth) / 2
    this.diffY = (this.carouselHeight * ZOOM_FACTOR - this.carouselHeight) / 2
  }

  handlePan = (e) => {
    const { name, carouselPan, carousel } = this.props
    const { zoom, panX, panY } = carousel[name]
    if (zoom !== 1) {
      const newX =
        Math.abs(this.originX + e.deltaX) < this.diffX
          ? this.originX + e.deltaX
          : panX
      const newY =
        Math.abs(this.originY + e.deltaY) < this.diffY
          ? this.originY + e.deltaY
          : panY

      this.panScroll =
        panY < 0 && Math.abs(this.originY + e.deltaY) >= this.diffY

      if (e.isFinal) {
        this.originX = newX
        this.originY = newY
      }

      carouselPan(name, newX, newY)
    }
  }

  getSelectedCarouselImage = () => {
    return document.querySelector('.Carousel-item.is-selected .Carousel-image')
  }

  handleBackAndForwardClickEvent = (e, callback) => {
    e.preventDefault()

    const img = this.getSelectedCarouselImage()

    this.updateCarouselHeight(img).then(() => {
      callback()
    })
  }

  carouselMouseMoveEvent = (e) => {
    const { name, carousel, carouselZoom } = this.props
    const { zoom } = carousel[name]

    if (zoom === 1) carouselZoom(name, ZOOM_FACTOR_DESKTOP)

    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0

    const boundingClient = this.CarouselRef.current.getBoundingClientRect()

    const carouselImage = this.getCurrentImage()
    carouselImage.style['transform-origin'] = `${((e.pageX -
      boundingClient.left) /
      boundingClient.width) *
      100}% ${((e.pageY - scrollTop - boundingClient.top) /
      boundingClient.height) *
      100}%`
  }

  resetCarouselMouseMoveEvent = () => {
    const { name, carousel, carouselZoom } = this.props
    const { zoom } = carousel[name]
    if (zoom !== 1) carouselZoom(name, 1)

    const carouselImage = this.getCurrentImage()
    carouselImage.style['transform-origin'] = 'none'
  }

  addHoverPan() {
    this.CarouselImageListRef.current.addEventListener(
      'mousemove',
      this.carouselMouseMoveEvent,
      false
    )
    this.CarouselImageListRef.current.addEventListener(
      'mouseout',
      this.resetCarouselMouseMoveEvent,
      false
    )
  }

  removeHoverPan() {
    this.CarouselImageListRef.current.removeEventListener(
      'mousemove',
      this.carouselMouseMoveEvent
    )
    this.CarouselImageListRef.current.removeEventListener(
      'mouseout',
      this.resetCarouselMouseMoveEvent
    )
  }

  renderControls() {
    const { l } = this.context
    const {
      assets,
      setCarouselIndex,
      carousel,
      name,
      showcase,
      arrowColor,
      isMobile,
      backCarousel,
      forwardCarousel,
    } = this.props
    const { current, zoom } = carousel[name]

    const baseControls = [
      <button
        key="left"
        className={classNames('Carousel-arrow', 'Carousel-arrow--left', {
          'is-hidden': isMobile && zoom !== 1,
        })}
        onClick={(e) => {
          this.handleBackAndForwardClickEvent(e, () => {
            backCarousel(name)
          })
        }}
        aria-hidden="true"
        tabIndex="-1"
        style={{ backgroundColor: arrowColor }}
      >
        {l`View previous image`}
      </button>,
      <button
        key="right"
        className={classNames('Carousel-arrow', 'Carousel-arrow--right', {
          'is-hidden': isMobile && zoom !== 1,
        })}
        onClick={(e) => {
          this.handleBackAndForwardClickEvent(e, () => {
            forwardCarousel(name)
          })
        }}
        aria-hidden="true"
        tabIndex="-1"
        style={{ backgroundColor: arrowColor }}
      >
        {l`View next image`}
      </button>,
    ]

    return showcase
      ? [
          <ul
            key="selectors"
            className={classNames('Carousel-selectors', {
              'is-hidden': isMobile && zoom !== 1,
            })}
            aria-hidden="true"
          >
            {assets.map((image, i) => {
              const isSelected = current === i
              return (
                <li
                  role="presentation"
                  key={`s${name}${image.url}`}
                  className={`Carousel-selector${
                    isSelected ? ' is-selected' : ''
                  }`}
                  onClick={() => setCarouselIndex(name, i)}
                />
              )
            })}
          </ul>,
        ].concat(baseControls)
      : baseControls
  }

  renderZoomControls() {
    const { onClick } = this.props
    return (
      <button
        key="Carousel-zoomControl"
        className="Carousel-zoom"
        onClick={onClick}
      />
    )
  }

  clearCarouselHeight = () => {
    window.removeEventListener('resize', this.clearCarouselHeight)
    this.setState({ height: undefined })
  }

  updateCarouselHeight = (imageEl) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const { height, src } = imageEl
        if (height === this.state.height) return resolve()
        if (height === 0) {
          return resolve()
        }
        if (src === EMPTY_IMAGE) {
          return resolve()
        }

        if (this.state.height !== undefined && height <= this.state.height) {
          return resolve()
        }

        window.addEventListener('resize', this.clearCarouselHeight)

        this.setState(
          {
            height,
          },
          resolve
        )
      }, 0)
    })
  }

  render() {
    const { l } = this.context
    const {
      assets,
      amplienceImages,
      sizes,
      carousel,
      mode,
      name,
      handleSwipe,
      showcase,
      lazyLoad,
      autoplay,
      isMobile,
      className,
      enableImageOverlay,
      isHidden,
      useProgressiveJPG,
      productId,
    } = this.props

    if (!carousel[name]) return null

    const {
      current,
      previous,
      direction,
      zoom,
      panX,
      panY,
      initialIndex,
    } = carousel[name]

    const options = {
      recognizers: {
        tap: {
          interval: 500,
          threshold: 200,
          posThreshold: 200,
          time: 1000,
          taps: 2,
        },
      },
    }

    const imageScaleStyle = {
      transform: `scale(${zoom})`,
      WebkitTransform: `scale(${zoom})`,
      transition: isMobile ? 'transform 0.3s ease' : 'none',
    }

    const imgPanStyle = {
      transform: `translate(${panX}px, ${panY}px)`,
      WebkitTransform: `translate(${panX}px, ${panY}px)`,
    }

    const content = (
      <div
        ref={this.CarouselImageListRef}
        className="Carousel-images"
        aria-hidden="true"
      >
        <ul
          className="Carousel-list"
          tabIndex="-1"
          style={{
            height: this.state.height,
          }}
        >
          {assets.map((asset, i) => {
            const selected = current === i
            const isFirst = i === initialIndex
            const selectedClass = selected
              ? 'selected'
              : previous === i
                ? 'previous'
                : 'inactive'

            const itemClass = () => {
              if (!this.state.shouldAnimate && isFirst) {
                return 'Carousel-initialItem'
              }
              return `Carousel-${direction}Item`
            }

            return (
              <li
                role="presentation"
                onClick={() => this.onClick(i)}
                key={`i${name}${asset.url}`}
                ref={`CarouselItem${i}`}
                className={`Carousel-item is-${selectedClass} ${itemClass()}`}
              >
                {typeof asset.url === 'string' ? (
                  <div style={selected ? imgPanStyle : null}>
                    <ResponsiveImage
                      deferLoad={!selected}
                      amplienceUrl={amplienceImages[i]}
                      sizes={sizes}
                      className="Carousel-image"
                      src={
                        !lazyLoad || previous >= 0 || Math.abs(current - i) <= 1
                          ? asset.url
                          : EMPTY_IMAGE
                      }
                      style={selected ? imageScaleStyle : null}
                      draggable="false"
                      alt={`${l`Carousel Image`} ${i}`}
                      useProgressiveJPG={useProgressiveJPG}
                    />
                  </div>
                ) : (
                  <div>{asset}</div>
                )}
              </li>
            )
          })}
        </ul>
        <CarouselImagesOverlay productId={productId} />
        {enableImageOverlay && this.renderZoomControls()}
      </div>
    )

    return (
      <div
        role="presentation"
        className={classNames('Carousel', className, {
          'Carousel--invisible': isHidden,
          [`Carousel--${mode}`]: Boolean(mode),
        })}
        ref={this.CarouselRef}
        onKeyDown={this.onKeyDown}
      >
        <AccessibleText
        >{l`Image carousel, press Enter to cycle through the images, press the Z key to zoom in and out of an image. Once zoomed in, use WASD keys to pan around image.`}</AccessibleText>
        {showcase ? (
          <Hammer
            onSwipe={handleSwipe}
            onPan={this.handlePan}
            onTap={!autoplay ? this.handleDoubleTap : () => {}}
            direction={
              zoom !== 1 && !this.panScroll
                ? 'DIRECTION_ALL'
                : 'DIRECTION_HORIZONTAL'
            }
            options={options}
          >
            {/*
             * We must wrap content in a div to stop Hammer to duplicate refs from react 16.8
             * https://github.com/JedWatson/react-hammerjs/issues/93
             */}
            <div>{content}</div>
          </Hammer>
        ) : (
          content
        )}
        {assets.length > 1 && !autoplay && this.renderControls()}
      </div>
    )
  }
}
