import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import removeHttp from '../../../lib/remove-http'
import { imageSizesPropTypes } from '../../../constants/amplience'

import ResponsiveImage from '../ResponsiveImage/ResponsiveImage'
import WishlistButton from '../WishlistButton/WishlistButton'

// Qubit
import WithQubit from '../Qubit/WithQubit'

const IMAGE_PREFERENCE_ORDER = ['IMAGE_NORMAL', 'IMAGE_LARGE', 'IMAGE_THUMB']
const IMAGE_OUTFIT_REGEX = /IMAGE_OUTFIT/g
const IMAGE_NOT_AVAILABLE_URL = '/assets/common/images/image-not-available.png'

export default class ProductImages extends Component {
  static propTypes = {
    lazyLoad: PropTypes.bool,
    isImageFallbackEnabled: PropTypes.bool,
    assets: PropTypes.array.isRequired,
    productBaseImageUrl: PropTypes.string.isRequired,
    outfitBaseImageUrl: PropTypes.string,
    additionalAssets: PropTypes.array,
    showProductView: PropTypes.bool,
    productDescription: PropTypes.string,
    sizes: imageSizesPropTypes.isRequired,
    showWishlistButton: PropTypes.bool,
    isMobile: PropTypes.bool.isRequired,
    productDetails: PropTypes.object.isRequired,
    isCarouselItem: PropTypes.bool,
  }

  static defaultProps = {
    isImageFallbackEnabled: false,
    lazyLoad: false,
    outfitBaseImageUrl: '',
    showWishlistButton: false,
    isCarouselItem: false,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      hovered: false,
      loadStates: {
        product: {
          loaded: false,
          errored: false,
        },
        outfit: {
          loaded: false,
          errored: false,
        },
      },
    }
  }

  hasOutfitImage(additionalAssets = []) {
    return additionalAssets.some(({ assetType }) =>
      assetType.match(IMAGE_OUTFIT_REGEX)
    )
  }

  getImageUrl = (assets) => {
    if (!assets.length) {
      return IMAGE_NOT_AVAILABLE_URL
    }

    const image =
      IMAGE_PREFERENCE_ORDER.reduce((selected, targetType) => {
        return (
          selected || assets.find(({ assetType }) => assetType === targetType)
        )
      }, null) || assets[0]

    return removeHttp(image.url)
  }

  getOutfitImage = (url) => {
    const { additionalAssets } = this.props
    return this.hasOutfitImage(additionalAssets)
      ? url.replace(/_F_|_P_/i, '_M_')
      : url
  }

  handleOnLoad = (which) => {
    this.setState({
      loadStates: {
        ...this.state.loadStates,
        [which]: {
          loaded: true,
          errored: false,
        },
      },
    })
  }

  handleOnError = (which) => {
    this.setState({
      loadStates: {
        ...this.state.loadStates,
        [which]: {
          loaded: false,
          errored: true,
        },
      },
    })
  }

  renderProductImage = (url) => {
    if (this.state.loadStates.product.errored) {
      return (
        <ResponsiveImage
          isImageFallbackEnabled
          className="ProductImages-image ProductImages-image--showing"
          src={IMAGE_NOT_AVAILABLE_URL}
        />
      )
    }
    const {
      lazyLoad,
      productBaseImageUrl,
      isImageFallbackEnabled,
      sizes,
      productDescription,
      isMobile,
    } = this.props

    const showing = !lazyLoad || this.state.loadStates.product.loaded
    return (
      <ResponsiveImage
        className={cn([
          'ProductImages-image',
          {
            'ProductImages-mobile': isMobile,
            'ProductImages-mobile--showing': showing,
          },
        ])}
        isImageFallbackEnabled={isImageFallbackEnabled}
        lazyLoad={lazyLoad}
        amplienceUrl={productBaseImageUrl}
        sizes={sizes}
        src={url}
        alt={productDescription}
        aria-hidden={!showing}
        useProgressiveJPG
        onLoad={() => this.handleOnLoad('product')}
        onError={() => this.handleOnError('product')}
      />
    )
  }

  renderOutfitImage = (url) => {
    if (this.state.loadStates.outfit.errored) {
      return (
        <ResponsiveImage
          isImageFallbackEnabled
          className="ProductImages-image ProductImages-image--showing"
          src={IMAGE_NOT_AVAILABLE_URL}
        />
      )
    }
    const {
      lazyLoad,
      outfitBaseImageUrl,
      sizes,
      productDescription,
      isMobile,
    } = this.props
    const { l } = this.context

    const showing = !lazyLoad || this.state.loadStates.outfit.loaded
    return (
      <ResponsiveImage
        lazyLoad={lazyLoad}
        className={cn([
          'ProductImages-image',
          {
            'ProductImages-mobile': isMobile,
            'ProductImages-mobile--showing': showing,
          },
        ])}
        amplienceUrl={outfitBaseImageUrl}
        sizes={sizes}
        src={url}
        alt={l`${productDescription} as part of an outfit`}
        aria-hidden={!showing}
        useProgressiveJPG
        onLoad={() => this.handleOnLoad('outfit')}
        onError={() => this.handleOnError('outfit')}
      />
    )
  }

  shouldShowProduct = () => {
    const { additionalAssets, showProductView, isMobile } = this.props
    // if there's no outfit image, always show the product
    if (!this.hasOutfitImage(additionalAssets)) {
      return true
    }

    if (isMobile) return showProductView

    return (
      (showProductView && !this.state.hovered) ||
      (!showProductView && this.state.hovered)
    )
  }

  render() {
    const {
      assets,
      showWishlistButton,
      productId,
      productDetails,
      productRoute,
      addToBag,
      touchEnabled,
      isBundleOrOutfit,
      isCarouselItem,
    } = this.props

    const url = this.getImageUrl(assets)
    const showProduct = this.shouldShowProduct()

    return (
      <div
        className="ProductImages"
        onMouseEnter={() => this.setState({ hovered: true })}
        onMouseLeave={() => this.setState({ hovered: false })}
      >
        {!touchEnabled &&
          !isCarouselItem && (
            <WithQubit
              id="qubit-quick-add-to-bag"
              shouldUseQubit={!isBundleOrOutfit}
              viewport="desktop"
              productId={productId}
              productRoute={productRoute}
              addToBag={addToBag}
              classnames={cn}
            />
          )}
        {showProduct
          ? this.renderProductImage(url)
          : this.renderOutfitImage(this.getOutfitImage(url))}
        {showWishlistButton && (
          <WishlistButton
            productId={productId}
            productDetails={productDetails}
            modifier="plp"
          />
        )}
      </div>
    )
  }
}
