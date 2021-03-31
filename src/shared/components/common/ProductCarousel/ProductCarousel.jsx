import PropTypes from 'prop-types'
import { mathMod } from 'ramda'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import Hammer from 'react-hammerjs'

import { isMobile } from '../../../selectors/viewportSelectors'
import {
  CAROUSEL_AXIS_HORIZONTAL,
  CAROUSEL_AXIS_VERTICAL,
  CAROUSEL_VERTICAL_SIZE_DESKTOP,
  CAROUSEL_HORIZONTAL_SIZE_MOBILE,
  CAROUSEL_HORIZONTAL_SIZE_DESKTOP,
} from '../../../constants/productCarouselConstants'
import { IMAGE_SIZES } from '../../../constants/amplience'

// components
import ProductCarouselItem from './ProductCarouselItem'

const Arrow = ({ direction, onClick }) => {
  return (
    <button
      className={`ProductCarousel-arrow ProductCarousel-arrow--${direction}`}
      onClick={onClick}
      aria-hidden
    />
  )
}

Arrow.propTypes = {
  direction: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

// helpers
const doubleArray = (array) => array.concat(array)

const getCarouselSize = (isMobile, axis) => {
  if (axis === CAROUSEL_AXIS_VERTICAL) {
    return CAROUSEL_VERTICAL_SIZE_DESKTOP
  } else if (axis === CAROUSEL_AXIS_HORIZONTAL && isMobile) {
    return CAROUSEL_HORIZONTAL_SIZE_MOBILE
  }

  return CAROUSEL_HORIZONTAL_SIZE_DESKTOP
}

class ProductCarousel extends Component {
  static propTypes = {
    isImageFallbackEnabled: PropTypes.bool,
    carouselSize: PropTypes.number.isRequired,
    products: PropTypes.arrayOf(
      PropTypes.shape({
        productId: PropTypes.number,
        name: PropTypes.string,
        price: PropTypes.string,
        unitPrice: PropTypes.string,
        salePrice: PropTypes.string,
        url: PropTypes.string,
        imageUrl: PropTypes.string,
        amplienceUrl: PropTypes.string,
      })
    ),
    imageSize: PropTypes.oneOf(Object.values(IMAGE_SIZES)),
    canRemoveProduct: PropTypes.bool,
    hideProductMeta: PropTypes.bool,
    hideProductName: PropTypes.bool,
    hideQuickViewIcon: PropTypes.bool,
    hidePrice: PropTypes.bool,
    openQuickViewOnProductClick: PropTypes.bool,
    onProductRemove: PropTypes.func,
    onProductLinkClick: PropTypes.func,
    onQuickViewClick: PropTypes.func,
    axis: PropTypes.oneOf([CAROUSEL_AXIS_HORIZONTAL, CAROUSEL_AXIS_VERTICAL]),
    peepNextItem: PropTypes.bool,
    hammerOptions: PropTypes.object,
    onCarouselArrowClick: PropTypes.func,
  }

  static defaultProps = {
    isImageFallbackEnabled: false,
    products: [],
    canRemoveProduct: false,
    onProductRemove: () => {},
    onProductLinkClick: () => {},
    onQuickViewClick: () => {},
    onCarouselArrowClick: () => {},
    hideProductMeta: false,
    hideProductName: false,
    hideQuickViewIcon: false,
    hidePrice: false,
    imageSize: IMAGE_SIZES.smallProduct,
    openQuickViewOnProductClick: false,
    axis: CAROUSEL_AXIS_HORIZONTAL,
    peepNextItem: false,
    hammerOptions: {},
  }

  state = {
    position: 1,
  }

  handleSwipe = ({ direction } = {}) => {
    const { axis } = this.props
    const BACKWARD = 2
    const FORWARD = 4

    if (axis === CAROUSEL_AXIS_HORIZONTAL) {
      if (direction === BACKWARD) {
        this.moveCarouselForward()
      } else if (direction === FORWARD) {
        this.moveCarouselBackward()
      }
    }
  }

  handleOnCarouselArrowClick = () => {
    const { onCarouselArrowClick } = this.props

    if (typeof onCarouselArrowClick === 'function') {
      onCarouselArrowClick()
    }
  }

  moveCarouselForward = () => {
    this.handleOnCarouselArrowClick()
    this.moveCarousel('forward')
  }

  moveCarouselBackward = () => {
    this.handleOnCarouselArrowClick()
    this.moveCarousel('backward')
  }

  moveCarousel(direction) {
    const { position } = this.state
    const newPostion = direction === 'forward' ? position - 1 : position + 1
    this.setState({
      position: mathMod(newPostion, this.getCarouselItems().length),
    })
  }

  getCarouselItems() {
    const { products, carouselSize } = this.props
    // if there is exactly one more item than the carousel size, 'double' the items (to avoid the wrapping effect)
    return products.length === carouselSize + 1
      ? doubleArray(products)
      : products
  }

  getCarouselArrowsPositions() {
    const { axis } = this.props
    const positions = {
      arrowPosition1: 'left',
      arrowPosition2: 'right',
    }

    if (axis === CAROUSEL_AXIS_VERTICAL) {
      positions.arrowPosition1 = 'top'
      positions.arrowPosition2 = 'bottom'
    }

    return positions
  }

  renderProductCarouselItem = (product, index) => {
    const {
      canRemoveProduct,
      onProductRemove,
      onProductLinkClick,
      onQuickViewClick,
      hideProductMeta,
      hideProductName,
      hideQuickViewIcon,
      hidePrice,
      carouselSize,
      imageSize,
      isImageFallbackEnabled,
      axis,
      openQuickViewOnProductClick,
      peepNextItem,
    } = this.props

    const carouselItems = this.getCarouselItems()
    const style = {}
    const peepCarouselSize = peepNextItem ? carouselSize + 0.3 : carouselSize

    if (axis === CAROUSEL_AXIS_HORIZONTAL) {
      style.width = `${100 / peepCarouselSize}%`
    } else {
      style.height = `${100 / carouselSize}%`
    }

    if (carouselItems.length > carouselSize) {
      const carouselPosition = mathMod(
        this.state.position + index,
        carouselItems.length
      )

      const isVisible = carouselPosition > 0 && carouselPosition <= carouselSize
      const translate = (carouselPosition - index - 1) * 100

      if (axis === CAROUSEL_AXIS_HORIZONTAL) {
        style.transform = `translateX(${translate}%)`
      } else {
        style.transform = `translateY(${translate}%)`
      }
      style.zIndex = isVisible ? '1' : '0'
    }

    return (
      <ProductCarouselItem
        isImageFallbackEnabled={isImageFallbackEnabled}
        key={index} // eslint-disable-line react/no-array-index-key
        lazyLoad
        productId={product.productId}
        name={product.name}
        price={product.price}
        unitPrice={product.unitPrice}
        salePrice={product.salePrice}
        url={product.url}
        imageUrl={product.imageUrl}
        amplienceUrl={product.amplienceUrl}
        imageSize={imageSize}
        style={style}
        axis={axis}
        onLinkClick={onProductLinkClick}
        onQuickViewButtonClick={onQuickViewClick}
        canRemoveProduct={canRemoveProduct}
        onProductRemove={onProductRemove}
        hideProductMeta={hideProductMeta}
        hideProductName={hideProductName}
        hideQuickViewIcon={hideQuickViewIcon}
        hidePrice={hidePrice}
        openQuickViewOnProductClick={openQuickViewOnProductClick}
      />
    )
  }

  render() {
    const carouselItems = this.getCarouselItems()
    const { carouselSize, axis, peepNextItem, hammerOptions } = this.props

    const isCarousel = carouselItems.length > carouselSize
    const { arrowPosition1, arrowPosition2 } = this.getCarouselArrowsPositions()
    const shouldShowArrows = isCarousel && !peepNextItem

    return carouselItems.length ? (
      <div className={`ProductCarousel ProductCarousel-${axis}`}>
        {shouldShowArrows && (
          <Arrow
            direction={arrowPosition1}
            onClick={this.moveCarouselBackward}
          />
        )}
        <Hammer onSwipe={this.handleSwipe} options={hammerOptions}>
          <div className="ProductCarousel-container">
            {carouselItems.map(this.renderProductCarouselItem)}
          </div>
        </Hammer>
        {shouldShowArrows && (
          <Arrow
            direction={arrowPosition2}
            onClick={this.moveCarouselForward}
          />
        )}
      </div>
    ) : null
  }
}

export default connect((state, { axis = CAROUSEL_AXIS_HORIZONTAL }) => ({
  carouselSize: getCarouselSize(isMobile(state), axis),
}))(ProductCarousel)

export { ProductCarousel as WrappedProductCarousel, Arrow }
