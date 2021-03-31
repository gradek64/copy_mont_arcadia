import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Price from '../Price/Price'
import MiniProduct from '../MiniProduct/MiniProduct'
import { path } from 'ramda'
import * as carouselActions from '../../../actions/common/carousel-actions'
import Image from '../Image/Image'
import Carousel from '../Carousel/Carousel'

// Qubit
import QubitReact from 'qubit-react/wrapper'

@connect(
  (state) => ({
    carousel: state.carousel,
  }),
  { ...carouselActions }
)
class BundleProducts extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    carousel: PropTypes.object,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  renderMiniProduct = (product, isBundle = false) => {
    return (
      <MiniProduct
        key={product.productId}
        className={isBundle ? 'BundleProducts-bundle' : ''}
        modalMode="plpQuickview"
        {...product}
      />
    )
  }

  renderCarouselThumb = (product, key, i) => {
    const { carousel } = this.props
    const isSelected =
      carousel && carousel[`slot${key}`] && i === carousel[`slot${key}`].current
        ? 'is-selected'
        : ''

    return [
      <Image
        key={`cim${product.productId}`}
        className={`Carousel-image ${isSelected}`}
        src={
          product.assets.filter((asset) => asset.assetType === 'IMAGE_THUMB')[0]
            .url
        }
      />,
      <Price key={`cpr${product.productId}`} price={product.unitPrice} />,
    ]
  }

  renderMiniProductsCarousel = (products, key) => {
    return (
      <Carousel
        name={`miniProductCarousel${key}`}
        mode="panel"
        assets={products.map((product) => this.renderMiniProduct(product))}
        currentItemReferencePath={path(['props', 'productId'])}
      />
    )
  }

  render() {
    const { l } = this.context
    const { items } = this.props
    if (!items) return null
    const isOutfit = Boolean(items.find(({ products }) => products.length > 1))
    return (
      <QubitReact id="qubit-pdp-BundleProducts">
        <div className="BundleProducts">
          <div className="BundleProducts-dividingLineAboveHeading" />
          {!isOutfit && (
            <div
              className="BundleProducts-outfitHeading"
              tabIndex="0"
            >{l`Select your items`}</div>
          )}
          <div className="BundleProducts-dividingLineUnderHeading" />
          {items.map(({ products }, i) => (
            <div
              className="BundleProducts-item"
              key={`BI${i}`} // eslint-disable-line react/no-array-index-key
            >
              {products.length > 1
                ? this.renderMiniProductsCarousel(products, i)
                : this.renderMiniProduct(products[0], true)}
              {i < items.length - 1 && (
                <div className="BundleProducts-dividingLineBetweenItems" />
              )}
            </div>
          ))}
        </div>
      </QubitReact>
    )
  }
}

export default BundleProducts
