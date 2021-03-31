import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { divide, isNil } from 'ramda'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import classnames from 'classnames'

import ProductImages from '../ProductImages/ProductImages'
import ProductImagesOverlay from '../ProductImagesOverlay/ProductImagesOverlay'
import ProductPromoBanner from '../ProductPromoBanner/ProductPromoBanner'
import RatingImage from '../RatingImage/RatingImage'
import HistoricalPrice from '../HistoricalPrice/HistoricalPrice'
import ProductQuickview from '../../containers/ProductQuickview/ProductQuickview'
import ProductQuickViewButton from '../ProductQuickViewButton/ProductQuickViewButton'
import SocialProofProductMetaLabel from '../SocialProofMessaging/SocialProofProductMetaLabel'

import Swatches from '../Swatches/Swatches'

import { PROMO_BANNER } from '../../../constants/productAssetTypes'
import { imageSizesPropTypes } from '../../../constants/amplience'

import {
  mobilePromoBanner,
  getColourSwatchesIndex,
} from '../../../lib/products-utils'
import { touchDetection } from '../../../lib/viewHelper'
import { Measure } from '../../../lib'
import { isIE11 } from '../../../lib/browser'

import { preserveScroll } from '../../../actions/common/infinityScrollActions'
import * as modalActions from '../../../actions/common/modalActions'
import * as productsActions from '../../../actions/common/productsActions'
import {
  setProductQuickview,
  setProductIdQuickview,
} from '../../../actions/common/quickviewActions'

import { isMobile, isDesktop } from '../../../selectors/viewportSelectors'
import { getSelectedProductSwatches } from '../../../selectors/productSelectors'
import { isProductViewSelected } from '../../../selectors/productViewsSelectors'
import {
  isFeatureWishlistEnabled,
  isFeatureLogBadAttributeBannersEnabled,
} from '../../../selectors/featureSelectors'
import { getBrandName } from '../../../selectors/configSelectors'

import { getRouteFromUrl } from '../../../lib/get-product-route'
import { removeQuery } from '../../../lib/query-helper'

// Qubit ADP-2050
import WithQubit from '../Qubit/WithQubit'
import { addToBag } from '../../../actions/common/shoppingBagActions'

@connect(
  (state) => ({
    swatchProducts: state.swatches.products,
    isFeatureWishlistEnabled: isFeatureWishlistEnabled(state),
    isMobile: isMobile(state),
    isDesktop: isDesktop(state),
    isIos: state.viewport.iosAgent,
    selectedProductSwatches: getSelectedProductSwatches(state),
    productViewSelected: isProductViewSelected(state),
    isFeatureLogBadAttributeBannersEnabled: isFeatureLogBadAttributeBannersEnabled(
      state
    ),
    brandName: getBrandName(state),
  }),
  {
    ...modalActions,
    preserveScroll,
    ...productsActions,
    setProductQuickview,
    setProductIdQuickview,
    addToBag,
  }
)
class Product extends Component {
  constructor(props) {
    super(props)

    this.isTouchEnabled = touchDetection()
    this.state = {
      swatchSize: {
        desktop: {
          width: 28, // This should match $SwatchSizeDesktop in Swatch.css
          padding: 10, // This should match $SwatchMarginDesktop in Swatch.css
        },
        mobile: {
          width: 22, // This should match $SwatchSizeMobile Swatch.css
          padding: 6, // This should match $SwatchMarginMobile in Swatch.css
        },
      },
    }
  }

  static propTypes = {
    lazyLoad: PropTypes.bool,
    isImageFallbackEnabled: PropTypes.bool,
    productId: PropTypes.number,
    swatchProducts: PropTypes.object.isRequired,
    grid: PropTypes.number.isRequired,
    productUrl: PropTypes.string.isRequired,
    showPrice: PropTypes.bool,
    isFeatureWishlistEnabled: PropTypes.bool,
    isMobile: PropTypes.bool.isRequired,
    isDesktop: PropTypes.bool.isRequired,
    hideProductMeta: PropTypes.bool,
    hideProductName: PropTypes.bool,
    hideQuickViewIcon: PropTypes.bool,
    bazaarVoiceData: PropTypes.object,
    className: PropTypes.string,
    assets: PropTypes.array, //eslint-disable-line
    wasPrice: PropTypes.string,
    wasWasPrice: PropTypes.string,
    rrp: PropTypes.string,
    additionalAssets: PropTypes.array,
    colourSwatches: PropTypes.array,
    rating: PropTypes.number,
    selectedProductSwatches: PropTypes.object.isRequired,
    preserveScroll: PropTypes.func,
    showModal: PropTypes.func,
    setProductIdQuickview: PropTypes.func,
    setProductQuickview: PropTypes.func,
    onLinkClick: PropTypes.func,
    onQuickViewButtonClick: PropTypes.func,
    productViewSelected: PropTypes.bool,
    sizes: imageSizesPropTypes.isRequired,
    isCarouselItem: PropTypes.bool,
    lineNumber: PropTypes.string,
    openQuickViewOnProductClick: PropTypes.bool,
    isIos: PropTypes.bool,
    addToBag: PropTypes.func,
    brandName: PropTypes.string.isRequired,
  }

  static defaultProps = {
    isImageFallbackEnabled: false,
    lazyLoad: false,
    assets: [],
    additionalAssets: [],
    showPrice: true,
    hideProductMeta: false,
    hideProductName: false,
    hideQuickViewIcon: false,
    isCarouselItem: false,
    lineNumber: '',
    openQuickViewOnProductClick: false,
    onLinkClick: () => {},
    onQuickViewButtonClick: () => {},
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  // @NOTE use only mobile sizes for promo banners
  get promoBanner() {
    const { assets, additionalAssets } = this.getProductInfo()

    // @NOTE scrAPIPromoBanner to be DELETED once rollout is complete
    // ScrAPI indexes the promo banners as IMAGE_PROMO_GRAPHIC on the assets property
    // Need to validate that asset url is an actual promoBanner after verifying
    // strange behaviour on scrAPI where the promoBanner was indexed by copying
    // the mobile attribute banner
    const scrAPIPromoBanner = assets.find(({ assetType, url }) => {
      return assetType === PROMO_BANNER && url.includes('/promo_code_') // <= MonkeyPatch alert!
    })

    const coreAPIPromoBanner = additionalAssets.find(mobilePromoBanner)

    return scrAPIPromoBanner || coreAPIPromoBanner
  }

  getProductInfo() {
    const {
      colourSwatches,
      productId,
      wasPrice,
      wasWasPrice,
      rrp,
      additionalAssets,
      rating,
      bazaarVoiceData,
      swatchProducts,
      lineNumber,
    } = this.props
    const swatchProduct = swatchProducts[productId] || {}

    const swatchIndex =
      typeof swatchProduct.selected !== 'undefined'
        ? swatchProduct.selected
        : getColourSwatchesIndex(lineNumber, colourSwatches)

    // If there are swatches, and there is one at the index we expect
    if (colourSwatches && colourSwatches[swatchIndex]) {
      // Overwrite props with swatchProduct info
      const data = {
        ...colourSwatches[swatchIndex].swatchProduct,
        parentProductId: productId,
      }

      /**
       * We use the parent-product data if NOT on the selected swatch product
       * wasPrice, wasWasPrice, rrp, additionalAssets
       */
      if (!data.wasPrice) {
        data.wasPrice = wasPrice || ''
        data.wasWasPrice = wasWasPrice || ''
      }
      if (!data.rrp) data.rrp = rrp // Not used anymore from WCS, we keep because can be reintroduced in the future.
      if (!data.additionalAssets) data.additionalAssets = additionalAssets

      return data
    }

    // MONKEY PATCH #2
    // If the API is returning bazaarVoiceData instead of rating, copy across the average value
    if (!rating && bazaarVoiceData && bazaarVoiceData.average) {
      return {
        ...this.props,
        rating: bazaarVoiceData.average,
      }
    }

    // No swatches, or bad index - just use the props
    return this.props
  }

  linkClickHandler = (e) => {
    const isWishlistButton =
      e && e.target && e.target.id && e.target.id === 'wishlistIcon'
    const {
      productId,
      preserveScroll,
      onLinkClick,
      openQuickViewOnProductClick,
    } = this.props
    const scrollYPos = window.scrollY || window.pageYOffset
    if (isIE11()) preserveScroll(scrollYPos)
    onLinkClick(productId, !!isWishlistButton)

    if (openQuickViewOnProductClick) {
      this.openQuickView()
      e.preventDefault()
    }
  }

  openQuickView = () => {
    const {
      selectedProductSwatches,
      productId,
      setProductIdQuickview,
      setProductQuickview,
      showModal,
      onQuickViewButtonClick,
    } = this.props
    // We explicitly set the product quick view state to an empty object here
    // in order to aid our analytics decorator on ProductQuickView to know
    // that a product is being quick-viewed. This helps with cases where you
    // quick view the same product sequentially.
    setProductQuickview({})
    const quickviewProductId = selectedProductSwatches[productId] || productId
    setProductIdQuickview(quickviewProductId)

    showModal(<ProductQuickview />, { mode: 'plpQuickview' })
    onQuickViewButtonClick(productId)
  }

  addClassNamesToHistoricalPrice(colIndex, centerAlign) {
    const className = 'HistoricalPrice'
    const classNames = [`${className}--product`, `${className}--col${colIndex}`]

    if (centerAlign) {
      classNames.push(`${className}--center`)
    }
    return classNames.join(' ')
  }

  calSwatchWidth = (isDesktop) => {
    const { desktop, mobile } = this.state.swatchSize

    return isDesktop
      ? desktop.width + desktop.padding * 2
      : mobile.width + mobile.padding * 2
  }

  // Calculate the maximum number of swatches that can fit into the parent container
  calMaxNumOfSwatches = (width, isDesktop) => {
    const SWATCH_ELEMENT_WIDTH = this.calSwatchWidth(isDesktop)
    // Minimum number of swatches to render
    const MIN_NUM_OF_SWATCHES = 1

    return isNil(width)
      ? MIN_NUM_OF_SWATCHES
      : // Divide parent container width into SWATCH_ELEMENT_WIDTH to get Max number of swatches
        Math.floor(divide(width, SWATCH_ELEMENT_WIDTH))
  }

  renderSwatches = (
    grid,
    colourSwatches,
    parentProductId,
    parentProductUrl,
    name,
    lineNumber
  ) => ({ componentWidth }) => {
    const { isDesktop } = this.props
    const maxSwatches = this.calMaxNumOfSwatches(componentWidth, isDesktop)

    return (
      <div className={`Product-swatches Product-swatches--col${grid}`}>
        <Swatches
          swatches={colourSwatches}
          maxSwatches={maxSwatches}
          productId={parentProductId}
          productUrl={parentProductUrl}
          name={name}
          lineNumber={lineNumber}
        />
      </div>
    )
  }

  render() {
    const {
      lazyLoad,
      className,
      productViewSelected,
      grid,
      colourSwatches,
      productUrl: parentProductUrl,
      showPrice,
      isFeatureWishlistEnabled,
      isMobile,
      hideProductMeta,
      hideProductName,
      hideQuickViewIcon,
      sizes,
      isCarouselItem,
      isImageFallbackEnabled,
      isFeatureLogBadAttributeBannersEnabled,
      lineNumber,
      productNumber,
      addToBag,
      isIos,
      brandName,
    } = this.props

    const {
      name,
      unitPrice,
      assets,
      productId,
      productBaseImageUrl,
      outfitBaseImageUrl,
      parentProductId,
      rating,
      wasPrice,
      wasWasPrice,
      rrp,
      additionalAssets,
      productUrl,
      isBundleOrOutfit,
    } = this.getProductInfo()

    const productDetails = {
      lineNumber,
      price: unitPrice,
    }

    const productClassName = classnames(
      'Product',
      `Product--col${grid}`,
      className
    )

    const swatchProductId = parentProductId || productId
    const shouldRenderBanners = !isMobile || !(grid === 3)
    const isWishlistButtonEnabled =
      isFeatureWishlistEnabled && !(isBundleOrOutfit || isCarouselItem)
    const hideTrendingProductLabel = isCarouselItem

    // TODO: replace with canonical URL
    const productRoute = removeQuery(productUrl) || getRouteFromUrl(productUrl)

    return (
      <div className={productClassName} data-product-number={productNumber}>
        <div className="Product-images-container">
          <Link
            className="Product-link"
            to={productRoute}
            onClick={this.linkClickHandler}
          >
            <div className="Product-images">
              <ProductImages
                isImageFallbackEnabled={isImageFallbackEnabled}
                lazyLoad={lazyLoad}
                productId={productId}
                productRoute={productRoute}
                grid={grid}
                assets={assets}
                productBaseImageUrl={productBaseImageUrl}
                outfitBaseImageUrl={outfitBaseImageUrl}
                sizes={sizes}
                additionalAssets={additionalAssets}
                showProductView={productViewSelected}
                productDescription={name}
                showWishlistButton={isWishlistButtonEnabled}
                isMobile={isMobile}
                productDetails={productDetails}
                // Qubit Props ADP-2050
                addToBag={addToBag}
                touchEnabled={this.isTouchEnabled}
                isBundleOrOutfit={isBundleOrOutfit}
                isCarouselItem={isCarouselItem}
              />
            </div>
            {shouldRenderBanners && (
              <ProductImagesOverlay
                productId={productId}
                productUrl={productUrl}
                additionalAssets={additionalAssets}
                isFeatureLogBadAttributeBannersEnabled={
                  isFeatureLogBadAttributeBannersEnabled
                }
                hideTrendingProductLabel={hideTrendingProductLabel}
              />
            )}
          </Link>
        </div>
        {!hideProductMeta && (
          <div className="Product-meta">
            {shouldRenderBanners &&
              this.promoBanner && (
                <ProductPromoBanner
                  src={this.promoBanner.url}
                  productURL={productUrl}
                  isFeatureLogBadAttributeBannersEnabled={
                    isFeatureLogBadAttributeBannersEnabled
                  }
                />
              )}
            <div className={`Product-info Product-info--col${grid}`}>
              {!hideProductName && (
                <header className="Product-name">
                  <h2>
                    <Link
                      className="Product-nameLink"
                      to={productRoute}
                      onClick={this.linkClickHandler}
                    >
                      {name}
                    </Link>
                  </h2>
                </header>
              )}
              {showPrice && (
                <HistoricalPrice
                  className={this.addClassNamesToHistoricalPrice(
                    grid,
                    hideQuickViewIcon
                  )}
                  brandName={brandName}
                  price={unitPrice}
                  wasPrice={wasPrice}
                  wasWasPrice={wasWasPrice}
                  rrp={rrp}
                />
              )}
              {!hideQuickViewIcon &&
                !isBundleOrOutfit &&
                !isMobile && (
                  <ProductQuickViewButton onClick={this.openQuickView} />
                )}
              {!hideTrendingProductLabel && (
                <SocialProofProductMetaLabel productId={productId} />
              )}
              {colourSwatches &&
                colourSwatches.length > 1 && (
                  <Measure>
                    {this.renderSwatches(
                      grid,
                      colourSwatches,
                      swatchProductId,
                      parentProductUrl,
                      name,
                      lineNumber
                    )}
                  </Measure>
                )}
              {this.isTouchEnabled &&
                !isCarouselItem && (
                  <WithQubit
                    id="qubit-quick-add-to-bag"
                    shouldUseQubit={!isBundleOrOutfit}
                    viewport="mobile"
                    productId={productId}
                    productRoute={productRoute}
                    addToBag={addToBag}
                    classnames={classnames}
                    isIos={isIos}
                  />
                )}
              {rating && (
                <RatingImage rating={rating} className="Product-ratingImage" />
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default Product
