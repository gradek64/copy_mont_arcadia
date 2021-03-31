import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import * as productCarouselConstants from '../../../constants/productCarouselConstants'
import { deleteRecentlyViewedProduct } from '../../../actions/common/recentlyViewedActions'
import ProductCarousel from '../ProductCarousel/ProductCarousel'
import { getRecentlyViewedProductsWithAmplienceUrl } from '../../../selectors/recentlyViewedSelectors'
import { getBrandName } from '../../../selectors/configSelectors'
import {
  sendAnalyticsProductClickEvent,
  GTM_LIST_TYPES,
} from '../../../analytics'

const PLP_PROPS = {
  hideProductName: true,
  axis: productCarouselConstants.CAROUSEL_AXIS_VERTICAL,
  openQuickViewOnProductClick: true,
}

const RecentlyViewed = (props, { l }) => {
  const {
    recentlyViewed,
    currentProductId,
    registerReferral,
    deleteRecentlyViewedProduct,
    sendAnalyticsProductClickEvent,
    isPlp,
    brand,
    setPredecessorPage,
  } = props
  const carouselProducts = recentlyViewed.filter(
    ({ productId }) => productId !== currentProductId
  )
  const listType = isPlp
    ? GTM_LIST_TYPES.PLP_RECENTLY_VIEWED
    : GTM_LIST_TYPES.PDP_RECENTLY_VIEWED

  const handleLinkClick = (productId) => {
    registerReferral(productId)
    setPredecessorPage(listType)

    const index = carouselProducts.findIndex(
      (product) => product.productId === productId
    )
    const {
      name,
      productId: id,
      unitPrice: price,
      iscmCategory: category,
    } = carouselProducts[index]
    sendAnalyticsProductClickEvent({
      listType,
      name,
      id,
      price,
      brand,
      category,
      position: index + 1,
    })
  }

  return carouselProducts.length ? (
    <div className="RecentlyViewed">
      {!isPlp && (
        <h3 className="RecentlyViewed-header">{l`Recently viewed`}</h3>
      )}
      <ProductCarousel
        products={carouselProducts}
        onProductLinkClick={handleLinkClick}
        onProductRemove={deleteRecentlyViewedProduct}
        hideProductMeta
        {...(isPlp ? PLP_PROPS : null)}
      />
    </div>
  ) : null
}

RecentlyViewed.propTypes = {
  recentlyViewed: PropTypes.arrayOf(
    PropTypes.shape({
      productId: PropTypes.number,
      name: PropTypes.string,
      imageUrl: PropTypes.string,
      amplienceUrl: PropTypes.string,
    })
  ),
  currentProductId: PropTypes.number,
  registerReferral: PropTypes.func,
  brand: PropTypes.string.isRequired,
  // actions
  deleteRecentlyViewedProduct: PropTypes.func.isRequired,
  sendAnalyticsProductClickEvent: PropTypes.func.isRequired,
  isPlp: PropTypes.bool,
}

RecentlyViewed.defaultProps = {
  recentlyViewed: [],
  currentProductId: undefined,
  isPlp: false,
  registerReferral: () => {},
}

RecentlyViewed.contextTypes = {
  l: PropTypes.func,
}

export default connect(
  (state) => ({
    recentlyViewed: getRecentlyViewedProductsWithAmplienceUrl(state),
    brand: getBrandName(state),
  }),
  { deleteRecentlyViewedProduct, sendAnalyticsProductClickEvent }
)(RecentlyViewed)
