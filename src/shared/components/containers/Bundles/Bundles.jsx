import classnames from 'classnames'
import PropTypes from 'prop-types'
import { compose, flatten, pluck, path } from 'ramda'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import constants from '../../../constants/espotsDesktop'
import { GTM_CATEGORY } from '../../../analytics'
import {
  isPersonalisedEspotsEnabled,
  isFeatureCarouselThumbnailEnabled,
  isFeatureDressipiRecommendationsEnabled,
  isFeatureBnplPaymentsBreakdownPdp,
} from '../../../selectors/featureSelectors'
import { getStoreCode } from '../../../selectors/configSelectors'
import { isMobile } from '../../../selectors/viewportSelectors'

import { deleteRecentlyViewedProduct } from '../../../actions/common/recentlyViewedActions'
import { setPredecessorPage } from '../../../actions/common/productsActions'
import { setCarouselIndex } from '../../../actions/common/carousel-actions'
import { getPDPBundleEspots } from '../../../actions/common/espotActions'
import { showModal } from '../../../actions/common/modalActions'

import ProductMedia from '../../common/ProductMedia/ProductMedia'
import ProductCarouselThumbnails from '../ProductCarouselThumbnails/ProductCarouselThumbnails'
import Price from '../../common/Price/Price'
import BundlesAddAll from '../../common/BundlesAddAll/BundlesAddAll'
import BundleProducts from '../../common/BundleProducts/BundleProducts'
import ProductDescription from '../../common/ProductDescription/ProductDescription'
import ProductDescriptionExtras from '../../common/ProductDescriptionExtras/ProductDescriptionExtras'
import RecentlyViewed from '../../common/RecentlyViewed/RecentlyViewed'
import Recommendations from '../../common/Recommendations/Recommendations'
import BnplPaymentsBreakdown from '../../common/BnplPaymentsBreakdown/BnplPaymentsBreakdown'
import Espot from '../../containers/Espot/Espot'
import DressipiRecommendationsRail from '../../common/Recommendations/DressipiRecommendationsRail'
import analyticsDecorator from '../../../../client/lib/analytics/analytics-decorator'

class Bundles extends Component {
  static propTypes = {
    setCarouselIndex: PropTypes.func.isRequired,
    getPDPBundleEspots: PropTypes.func.isRequired,
    isFeatureCarouselThumbnailEnabled: PropTypes.bool,
    product: PropTypes.object.isRequired,
    carousel: PropTypes.object.isRequired,
    firstBundleItemProductGroupingId: PropTypes.string,
    isFeatureDressipiRecommendationsEnabled: PropTypes.bool.isRequired,
    isFeatureBnplPaymentsBreakdownPdp: PropTypes.bool.isRequired,
    showModal: PropTypes.func.isRequired,
    storeCode: PropTypes.string.isRequired,
    isMobile: PropTypes.bool.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  componentDidMount() {
    const { isPersonalisedEspotsEnabled, getPDPBundleEspots } = this.props
    if (isPersonalisedEspotsEnabled) getPDPBundleEspots()
  }

  getItems = (bundleSlots) => bundleSlots.filter((slot) => slot.products.length)

  getFixedBundleProductIds(product) {
    const { carousel } = this.props
    const currentProductIdsFromCarousels = Object.keys(carousel)
      .filter(
        (name) =>
          name.includes('miniProductCarousel') &&
          carousel[name].currentItemReference
      )
      .map((name) => carousel[name].currentItemReference)

    if (
      Array.isArray(currentProductIdsFromCarousels) &&
      currentProductIdsFromCarousels.length > 0
    ) {
      return currentProductIdsFromCarousels
    }

    return compose(
      pluck('productId'),
      flatten,
      pluck('products')
    )(product.bundleSlots)
  }

  clickCarouselThumbs = (index) => {
    const { setCarouselIndex } = this.props
    setCarouselIndex('bundles', index)
  }

  render() {
    const { l } = this.context
    const {
      product: {
        amplienceAssets,
        assets,
        bundleSlots,
        bundleType,
        description,
        name,
        unitPrice,
        seeMoreValue,
        bnplPaymentOptions,
      },
      isFeatureCarouselThumbnailEnabled,
      product,
      firstBundleItemProductGroupingId,
      setPredecessorPage,
      isFeatureDressipiRecommendationsEnabled,
      isFeatureBnplPaymentsBreakdownPdp,
      showModal,
      storeCode,
      isMobile,
    } = this.props
    const bundleProducts = this.getItems(bundleSlots)

    // bundle is discounted if any one of its products are discounted
    const isDiscounted = flatten(
      bundleProducts.map(({ products }) => products)
    ).some(({ wasWasPrice }) => wasWasPrice)
    const priceClassNames = classnames('Bundles-price', {
      'Bundles-price--discounted': isDiscounted,
    })
    const referringProduct = {
      productId: product.productId,
      lineNumber: product.lineNumber,
      name: product.name,
    }

    return (
      <div className={`Bundles is-${bundleType.toLowerCase()}`}>
        <div className="Bundles-topWrapper">
          <div className="Bundles-topWrapperPart Bundles-carousel">
            <div
              className={
                isFeatureCarouselThumbnailEnabled
                  ? ' Bundles-carouselWithThumbnails'
                  : ''
              }
            >
              <ProductCarouselThumbnails
                maxVisible={5}
                setCarouselIndex={this.clickCarouselThumbs}
                className="ProductCarouselThumbnails"
                amplienceAssets={amplienceAssets}
                amplienceImages={amplienceAssets ? amplienceAssets.images : []}
                thumbs={assets.filter(
                  (asset) => asset.assetType === 'IMAGE_SMALL'
                )}
              />
              <ProductMedia
                name="bundles"
                productId={product.productId}
                amplienceAssets={product.amplienceAssets}
                assets={assets}
                enableImageOverlay
                className="Bundles-productMedia"
              />
            </div>
            <Espot
              identifier={constants.product.col1pos1}
              className="Bundles-espot"
            />
            <Espot
              identifier={constants.product.klarna1}
              className="Bundles-espot"
            />
            <Espot
              identifier={constants.product.klarna2}
              className="Bundles-espot"
            />
          </div>

          <div className="Bundles-topWrapperPart">
            <div className="Bundles-header">
              <h1 className="Bundles-title">{name}</h1>
              <p className={priceClassNames}>
                <span className="Bundles-priceFrom">{l`From`}</span>{' '}
                <Price className="Bundles-priceValue" price={unitPrice} />
              </p>
            </div>
            {isFeatureBnplPaymentsBreakdownPdp && (
              <BnplPaymentsBreakdown
                unitPrice={unitPrice}
                bnplPaymentOptions={bnplPaymentOptions}
                showModal={showModal}
                storeCode={storeCode}
                isMobile={isMobile}
              />
            )}
            <BundleProducts items={bundleProducts} />
            {bundleType === 'Fixed' && (
              <BundlesAddAll
                productId={product.productId}
                deliveryMessage={product.deliveryMessage}
                bundleProductIds={this.getFixedBundleProductIds(product)}
                bundleProducts={product.bundleProducts}
              />
            )}
          </div>
        </div>

        <ProductDescription
          description={description}
          seeMoreValue={seeMoreValue}
          className="ProductDescription--bundle"
        >
          <ProductDescriptionExtras
            attributes={[{ label: l`Code`, value: product.lineNumber }]}
          />
        </ProductDescription>

        <Espot
          identifier={constants.product.content1}
          className="Bundles-espot"
        />

        {isFeatureDressipiRecommendationsEnabled ? (
          <DressipiRecommendationsRail
            currentProductGroupingId={firstBundleItemProductGroupingId}
            setPredecessorPage={setPredecessorPage}
          />
        ) : (
          <Recommendations
            referringProduct={referringProduct}
            currentProductGroupingId={firstBundleItemProductGroupingId}
            setPredecessorPage={setPredecessorPage}
            shouldRenderDressipiQubitExperience
          />
        )}

        <RecentlyViewed
          referringProduct={referringProduct}
          currentProductId={referringProduct.productId}
        />
      </div>
    )
  }
}

export default compose(
  analyticsDecorator(GTM_CATEGORY.BUNDLE, { isAsync: true }),
  connect(
    (state) => ({
      carousel: state.carousel,
      // prop required for EXP-208 Dressipi Test
      firstBundleItemProductGroupingId: path(
        ['currentProduct', 'bundleProducts', 0, 'grouping'],
        state
      ),
      isFeatureCarouselThumbnailEnabled: isFeatureCarouselThumbnailEnabled(
        state
      ),
      isPersonalisedEspotsEnabled: isPersonalisedEspotsEnabled(state),
      isFeatureDressipiRecommendationsEnabled: isFeatureDressipiRecommendationsEnabled(
        state
      ),
      isFeatureBnplPaymentsBreakdownPdp: isFeatureBnplPaymentsBreakdownPdp(
        state
      ),
      storeCode: getStoreCode(state),
      isMobile: isMobile(state),
    }),
    {
      deleteRecentlyViewedProduct,
      setCarouselIndex,
      getPDPBundleEspots,
      setPredecessorPage,
      showModal,
    }
  )
)(Bundles)

export { Bundles as WrappedBundles }
