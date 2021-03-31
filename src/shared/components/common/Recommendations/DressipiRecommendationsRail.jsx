import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { brandCode } from '../../../../server/api/mapping/constants/product'
import ProductCarousel from '../ProductCarousel/ProductCarousel'

import {
  getDressipiRelatedRecommendations,
  getDressipiContentId,
  getDressipiEventId,
} from '../../../../shared/selectors/common/dressipiRecommendationsSelectors'
import {
  getBrandName,
  getDressipiBaseUrl,
} from '../../../selectors/configSelectors'

import {
  fetchDressipiRelatedRecommendations,
  clickRecommendation,
} from '../../../../shared/actions/common/dressipiRecommendationsActions'

import {
  sendAnalyticsProductClickEvent,
  GTM_LIST_TYPES,
} from '../../../analytics'

import { emitDressipiEvent } from '../../../lib/dressipi-utils'
import { getRouteFromUrl } from '../../../lib/get-product-route'
import { removeQuery } from '../../../lib/query-helper'

import {
  DRESSIPI_MODES,
  DRESSIPI_EVENT_TYPES,
} from '../../../../shared/constants/dressipiConstants'

class DressipiRecommendationsRail extends Component {
  static propTypes = {
    dressipiRelatedRecommendations: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        amplienceUrl: PropTypes.string,
        productId: PropTypes.number,
        prices: PropTypes.shape({
          unitPrice: PropTypes.number,
          salePrice: PropTypes.number,
        }),
      })
    ),
    brand: PropTypes.string.isRequired,
    headerText: PropTypes.string,
    clickRecommendation: PropTypes.func.isRequired,
    mode: PropTypes.string,
    currentProductGroupingId: PropTypes.string,
    fetchDressipiRelatedRecommendations: PropTypes.func.isRequired,
    dressipiBaseUrl: PropTypes.string.isRequired,
    setPredecessorPage: PropTypes.func.isRequired,
    dressipiEventId: PropTypes.string,
    dressipiContentId: PropTypes.string,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  static defaultProps = {
    dressipiRelatedRecommendations: [],
    mode: DRESSIPI_MODES.related,
    dressipiContentId: null,
  }

  componentDidMount() {
    const { currentProductGroupingId, dressipiBaseUrl } = this.props
    if (currentProductGroupingId && dressipiBaseUrl) {
      this.getDressipiRecommendations()
    }
  }

  getDressipiRecommendations = () => {
    const {
      mode,
      currentProductGroupingId,
      dressipiBaseUrl,
      fetchDressipiRelatedRecommendations,
    } = this.props
    // mode can be used for different dressipi products, e.g. related, outfit
    if (mode === DRESSIPI_MODES.related) {
      fetchDressipiRelatedRecommendations(
        currentProductGroupingId,
        dressipiBaseUrl
      )
    }
  }

  getRecommendationByProductId = (productId) => {
    const { dressipiRelatedRecommendations } = this.props
    return dressipiRelatedRecommendations.find(
      (recommendation) => recommendation.productId === productId
    )
  }

  logAnalyticsClickEvent = (name, position, price, productId) => {
    sendAnalyticsProductClickEvent({
      listType: GTM_LIST_TYPES.PDP_RECOMMENDED_PRODUCTS,
      name,
      id: productId,
      price,
      position,
    })
  }

  productLinkClickHandler = (productId) => {
    const { clickRecommendation, setPredecessorPage } = this.props
    const {
      id,
      name,
      position,
      salePrice,
      unitPrice,
      productCode,
    } = this.getRecommendationByProductId(productId)

    this.handleEmitDressipiEvent(DRESSIPI_EVENT_TYPES.pdp, productCode)
    clickRecommendation(id)
    setPredecessorPage(GTM_LIST_TYPES.PDP_WHY_NOT_TRY)
    this.logAnalyticsClickEvent(
      name,
      position,
      salePrice || unitPrice,
      productId
    )
  }

  renderAlternativeHeader = () => {
    const { brand } = this.props
    const { l } = this.context
    switch (brand) {
      case brandCode.br:
        return `Recommended For You`
      case brandCode.dp:
      case brandCode.tm:
        return l`you may also like`
      case brandCode.ms:
        return l`you might also like`
      default:
        return l`Why not try?`
    }
  }

  handleEmitDressipiEvent = (eventType, productCode = null) => {
    const { dressipiBaseUrl, dressipiEventId, dressipiContentId } = this.props
    const event = {
      event_type: eventType,
      ...(productCode && { product_code: productCode }),
      root_event_id: dressipiEventId,
      content_id: dressipiContentId,
    }

    emitDressipiEvent(dressipiBaseUrl, event)
  }

  onQuickViewClickHandler = (productId) => {
    const { productCode } = this.getRecommendationByProductId(productId)

    this.handleEmitDressipiEvent(DRESSIPI_EVENT_TYPES.quickView, productCode)
  }

  onCarouselArrowClickHandler = () => {
    this.handleEmitDressipiEvent(DRESSIPI_EVENT_TYPES.widgetInteracted)
  }

  carouselProducts = () =>
    this.props.dressipiRelatedRecommendations.map(
      ({ productId, name, img, amplienceUrl, prices, url }) => {
        return {
          productId,
          name,
          img,
          amplienceUrl,
          unitPrice: prices.unitPrice.toString(),
          salePrice: prices.salePrice && prices.salePrice.toString(),
          url: removeQuery(getRouteFromUrl(url)),
        }
      }
    )

  render() {
    const { headerText, dressipiRelatedRecommendations } = this.props
    const { l } = this.context

    return (
      <Fragment>
        {dressipiRelatedRecommendations.length ? (
          <div className="Recommendations Dressipi">
            <h3 className="Recommendations-header">
              {l(headerText) || this.renderAlternativeHeader()}
            </h3>
            <ProductCarousel
              isImageFallbackEnabled
              products={dressipiRelatedRecommendations}
              onProductLinkClick={this.productLinkClickHandler}
              onQuickViewClick={this.onQuickViewClickHandler}
              onCarouselArrowClick={this.onCarouselArrowClickHandler}
              hideProductName
            />
          </div>
        ) : null}
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    dressipiRelatedRecommendations: getDressipiRelatedRecommendations(state),
    brand: getBrandName(state),
    dressipiBaseUrl: getDressipiBaseUrl(state),
    dressipiEventId: getDressipiEventId(state),
    dressipiContentId: getDressipiContentId(state),
  }
}

const mapDispatchToProps = {
  fetchDressipiRelatedRecommendations,
  clickRecommendation,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DressipiRecommendationsRail)
