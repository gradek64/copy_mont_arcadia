import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { path, pathOr, isEmpty } from 'ramda'

import RecentlyViewed from '../../common/RecentlyViewed/RecentlyViewed'
import Recommendations from '../../common/Recommendations/Recommendations'
import Button from '../../common/Button/Button'
import Price from '../../common/Price/Price'
import ResponsiveImage from '../../common/ResponsiveImage/ResponsiveImage'
import OOSProductDescription from '../../common/OOSProductDescription/OOSProductDescription'
import DressipiRecommendationsRail from '../../common/Recommendations/DressipiRecommendationsRail'

import { isMobile } from '../../../selectors/viewportSelectors'
import { isFeatureDressipiRecommendationsEnabled } from '../../../selectors/featureSelectors'

import { getPDPCategoryAndUrl } from '../../../lib/product-utilities'

import { setPredecessorPage } from '../../../actions/common/productsActions'

import { IMAGE_SIZES } from '../../../constants/amplience'

const getThumbnailAssetUrl = path([1, 'url'])

@connect(
  (state) => ({
    currentProductGroupingId: path(['currentProduct', 'grouping'], state),
    isMobile: isMobile(state),
    isFeatureDressipiRecommendationsEnabled: isFeatureDressipiRecommendationsEnabled(
      state
    ),
  }),
  { setPredecessorPage }
)
class OutOfStockProductDetail extends Component {
  static propTypes = {
    product: PropTypes.object.isRequired,
    setPredecessorPage: PropTypes.func.isRequired,
    currentProductGroupingId: PropTypes.string,
    isMobile: PropTypes.bool.isRequired,
    isFeatureDressipiRecommendationsEnabled: PropTypes.bool.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  renderProductDescription = () => {
    const {
      product: { description },
    } = this.props
    const { l } = this.context

    return (
      <OOSProductDescription
        description={description}
        header={l`Product Details`}
      />
    )
  }

  render() {
    const {
      currentProductGroupingId,
      setPredecessorPage,
      isMobile,
      isFeatureDressipiRecommendationsEnabled,
      product: {
        breadcrumbs,
        name,
        lineNumber,
        productId,
        unitPrice,
        assets,
        amplienceAssets,
      },
    } = this.props
    const category = getPDPCategoryAndUrl(breadcrumbs)
    const referringProduct = {
      productId,
      lineNumber,
      name,
    }
    const productHasCategory = !isEmpty(category)
    const { l } = this.context
    return (
      <div className="OutOfStockProductDetail">
        <h1 className="OutOfStockProductDetail-pageHeading">
          {l`Item not available`}
        </h1>
        <div className="OutOfStockProductDetail-productWrapper">
          <div className="OutOfStockProductDetail-productWrapperImage">
            <ResponsiveImage
              className="MiniProduct-image"
              src={getThumbnailAssetUrl(assets)}
              amplienceUrl={pathOr(null, ['images', 0], amplienceAssets)}
              sizes={IMAGE_SIZES.bundleProductSlots}
              aria-hidden="true"
            />
          </div>
          <div className="OutOfStockProductDetail-productWrapperDescription">
            <div className="OutOfStockProductDetail-productWrapperDescriptionMinimal">
              <h2>{name}</h2>
              <Price price={unitPrice} />
            </div>
            {!isMobile && this.renderProductDescription()}
          </div>
        </div>
        {isMobile && this.renderProductDescription()}

        {isFeatureDressipiRecommendationsEnabled ? (
          <DressipiRecommendationsRail
            currentProductGroupingId={currentProductGroupingId}
            setPredecessorPage={setPredecessorPage}
          />
        ) : (
          <Recommendations
            referringProduct={referringProduct}
            currentProductGroupingId={currentProductGroupingId}
            setPredecessorPage={setPredecessorPage}
            shouldRenderDressipiQubitExperience
          />
        )}

        {productHasCategory && (
          <Button
            className="Button--primary OutOfStockProductDetail-shopAllBtn"
            clickHandler={() => browserHistory.push(category.url)}
          >
            {new RegExp(l`All`).test(category.label) ? (
              <span className="translate">{category.label}</span>
            ) : (
              <span className="translate">{`${l`SHOP ALL`} ${
                category.label
              }`}</span>
            )}
          </Button>
        )}
        <RecentlyViewed
          referringProduct={referringProduct}
          currentProductId={referringProduct.productId}
        />
      </div>
    )
  }
}

export default OutOfStockProductDetail
