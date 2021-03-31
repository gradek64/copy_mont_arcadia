import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import WithQubit from '../Qubit/WithQubit'
import { brandCode } from '../../../../server/api/mapping/constants/product'

// actions
import { clickRecommendation } from '../../../actions/components/RecommendationsActions'

// components
import ProductCarousel from '../ProductCarousel/ProductCarousel'

import {
  sendAnalyticsProductClickEvent,
  GTM_LIST_TYPES,
} from '../../../analytics'

const Recommendations = (
  {
    recommendations,
    registerReferral,
    clickRecommendation,
    brand,
    headerText,
    sendAnalyticsProductClickEvent,

    // these props are only required for Dressipi tracking as part of EXP-208
    onProductLinkClick,
    onQuickViewClick,
    setPredecessorPage,
  },
  { l }
) => {
  const content = () => {
    switch (brand) {
      case brandCode.br:
        return `Recommended For You`
      case brandCode.dp:
      case brandCode.tm:
        return l`you may also like`
      case brandCode.ms:
        return l`you might also like`
      case brandCode.ev:
      case brandCode.ts:
      case brandCode.wl:
      default:
        return l`Why not try?`
    }
  }

  const carouselProducts = recommendations.map(
    ({ productId, title: name, img, amplienceUrl, prices }) => {
      const currency = Object.keys(prices)[0]

      return {
        productId,
        name,
        imageUrl: img,
        amplienceUrl,
        unitPrice: prices[currency].unitPrice.toString(),
        salePrice:
          prices[currency].salePrice && prices[currency].salePrice.toString(),
      }
    }
  )

  const getRecommendationByProductId = (productId) => {
    return recommendations.find(
      (recommendation) => recommendation.productId === productId
    )
  }

  const logAnalyticsClickEvent = (productId) => {
    const { title: name, position, prices } = getRecommendationByProductId(
      productId
    )
    const currency = Object.keys(prices)[0]
    const price = prices[currency].salePrice
      ? prices[currency].salePrice.toString()
      : prices[currency].unitPrice.toString()

    sendAnalyticsProductClickEvent({
      listType: GTM_LIST_TYPES.PDP_RECOMMENDED_PRODUCTS,
      name,
      id: productId,
      price,
      position,
    })
  }

  const productLinkClickHandler = (productId, callback) => {
    const { id } = getRecommendationByProductId(productId)
    clickRecommendation(id)
    registerReferral(productId)
    logAnalyticsClickEvent(productId)
    setPredecessorPage(GTM_LIST_TYPES.PDP_WHY_NOT_TRY)

    if (callback) {
      callback(productId)
    }
  }

  return carouselProducts.length ? (
    <div className="Recommendations">
      <h3 className="Recommendations-header">{l(headerText) || content()}</h3>
      <ProductCarousel
        isImageFallbackEnabled
        products={carouselProducts}
        onProductLinkClick={(productId) => {
          productLinkClickHandler(productId, onProductLinkClick)
        }}
        onQuickViewClick={onQuickViewClick}
        hideProductName
      />
    </div>
  ) : null
}

Recommendations.propTypes = {
  recommendations: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
      img: PropTypes.string,
      prices: PropTypes.objectOf(
        PropTypes.shape({
          unitPrice: PropTypes.number,
          salePrice: PropTypes.number,
        })
      ),
    })
  ),
  registerReferral: PropTypes.func,
  brand: PropTypes.string,
  headerText: PropTypes.string,
  // actions
  clickRecommendation: PropTypes.func.isRequired,

  // these props are only required for Dressipi tracking as part of EXP-208
  onProductLinkClick: PropTypes.func,
  onQuickViewClick: PropTypes.func,
  setPredecessorPage: PropTypes.func.isRequired,
}

Recommendations.defaultProps = {
  recommendations: [],
  registerReferral: () => {},

  // these props are only required for Dressipi tracking as part of EXP-208
  onProductLinkClick: () => {},
  onQuickViewClick: () => {},
}

Recommendations.contextTypes = {
  l: PropTypes.func,
}

// this A/B test wrapper is only required for A/B test EXP-208
export const RecommendationsABTestWrapper = ({
  recommendations,
  shouldRenderDressipiQubitExperience,
  currentProductGroupingId,
  ...props
}) => {
  return (
    <WithQubit
      shouldUseQubit={shouldRenderDressipiQubitExperience}
      id="dressipi-recommendations"
      currentProductGroupingId={currentProductGroupingId}
      renderRecommendations={(
        dressipiRecommendations,
        onProductLinkClick,
        onQuickViewClick
      ) => (
        <Recommendations
          recommendations={dressipiRecommendations}
          onProductLinkClick={onProductLinkClick}
          onQuickViewClick={onQuickViewClick}
          {...props}
        />
      )}
    >
      <Recommendations recommendations={recommendations} {...props} />
    </WithQubit>
  )
}

RecommendationsABTestWrapper.propTypes = {
  recommendations: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
      img: PropTypes.string,
      prices: PropTypes.objectOf(
        PropTypes.shape({
          unitPrice: PropTypes.number,
          salePrice: PropTypes.number,
        })
      ),
    })
  ),
  currentProductGroupingId: PropTypes.string,
  shouldRenderDressipiQubitExperience: PropTypes.bool,
}

export default connect(
  (state) => ({
    recommendations: state.recommendations.recommendations,
    brand: state.config.brandName,
  }),
  { clickRecommendation, sendAnalyticsProductClickEvent }
)(RecommendationsABTestWrapper)

export { Recommendations as WrappedRecommendations }
