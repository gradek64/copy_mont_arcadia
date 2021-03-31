import React, { Component } from 'react'
import { connect } from 'react-redux'
import { equals, keys, pick } from 'ramda'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import ResponsiveImage from '../ResponsiveImage/ResponsiveImage'
import SocialProofOrderProductBadge from '../SocialProofMessaging/SocialProofOrderProductBadge'
import HistoricalPrice from '../HistoricalPrice/HistoricalPrice'
import { IMAGE_SIZES } from '../../../constants/amplience'
import { getRouteFromUrl } from '../../../lib/get-product-route'
import { isProductTrending } from '../../../selectors/socialProofSelectors'
import {
  sendAnalyticsClickEvent,
  GTM_ACTION,
  GTM_CATEGORY,
  GTM_LABEL,
} from '../../../analytics'
import { getBrandName } from '../../../selectors/configSelectors'

class OrderProduct extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    assets: PropTypes.array,
    baseImageUrl: PropTypes.string,
    imageUrl: PropTypes.string,
    size: PropTypes.string,
    quantity: PropTypes.number,
    unitPrice: PropTypes.string,
    wasPrice: PropTypes.string,
    wasWasPrice: PropTypes.string,
    rrp: PropTypes.string,
    children: PropTypes.node,
    isDDPProduct: PropTypes.bool,
    sourceUrl: PropTypes.string,
    shouldLinkToPdp: PropTypes.bool,
    sendAnalyticsClickEvent: PropTypes.func.isRequired,
    isTrending: PropTypes.bool.isRequired,
    shouldDisplaySocialProofLabel: PropTypes.bool,
    brandName: PropTypes.string.isRequired,
  }

  static defaultProps = {
    baseImageUrl: '',
    sourceUrl: '',
    shouldLinkToPdp: false,
    shouldDisplaySocialProofLabel: false,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  shouldComponentUpdate(nextProps) {
    // todo: refactor when header is simplified .. DES-292
    const compare = pick(
      [
        'name',
        'imageUrl',
        'lowStock',
        'inStock',
        'size',
        'quantity',
        'unitPrice',
        'wasPrice',
        'wasWasPrice',
        'rrp',
        'children',
        'isTrending',
      ],
      nextProps
    )
    const current = pick(keys(compare), this.props)
    return !equals(compare, current)
  }

  renderImage = () => {
    const { name, assets, baseImageUrl, imageUrl } = this.props
    return (
      <ResponsiveImage
        alt={name}
        className="OrderProducts-productImage"
        amplienceUrl={baseImageUrl}
        sizes={IMAGE_SIZES.miniBag}
        src={
          assets
            ? assets.find((asset) => asset.assetType === 'IMAGE_THUMB').url
            : imageUrl
        }
      />
    )
  }

  renderHeader = () => {
    const { name } = this.props
    return <header className="OrderProducts-productName">{name}</header>
  }

  trackLinkClick = () => {
    const { sendAnalyticsClickEvent } = this.props
    sendAnalyticsClickEvent({
      category: GTM_CATEGORY.SHOPPING_BAG,
      action: GTM_ACTION.CLICKED,
      label: GTM_LABEL.PRODUCT_DETAILS,
    })
  }

  wrapInPdpLink = (element) => {
    const { shouldLinkToPdp, sourceUrl, isDDPProduct } = this.props
    if (shouldLinkToPdp && sourceUrl && !isDDPProduct) {
      return (
        <Link to={getRouteFromUrl(sourceUrl)} onClick={this.trackLinkClick}>
          {element}
        </Link>
      )
    }
    return element
  }

  render() {
    const {
      size,
      quantity,
      unitPrice,
      wasPrice,
      wasWasPrice,
      rrp,
      children,
      isDDPProduct,
      isTrending,
      shouldDisplaySocialProofLabel,
      brandName,
    } = this.props
    const { l } = this.context

    const showSellingFastBadge = shouldDisplaySocialProofLabel && isTrending

    return (
      <div className="OrderProducts-media">
        <div className="OrderProducts-mediaLeft">
          {this.wrapInPdpLink(this.renderImage())}
          {showSellingFastBadge && <SocialProofOrderProductBadge />}
        </div>
        <div className="OrderProducts-mediaBody">
          {this.wrapInPdpLink(this.renderHeader())}
          <div>
            <div className="OrderProducts-mediaBodyContent">
              {!isDDPProduct && (
                <p className="OrderProducts-row OrderProducts-productSize">
                  <span className="OrderProducts-label">{`${quantity || 1} x ${
                    size
                      ? `${l`size`} ${decodeURIComponent(size)}`
                      : l`One sized item`
                  }`}</span>
                </p>
              )}
              <p className="OrderProducts-row OrderProducts-price">
                <HistoricalPrice
                  className="HistoricalPrice--orderProducts"
                  brandName={brandName}
                  price={unitPrice}
                  wasPrice={wasPrice}
                  wasWasPrice={wasWasPrice}
                  rrp={rrp}
                />
              </p>
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  (state, { productId, socialProofView }) => ({
    isTrending: isProductTrending(state, productId, socialProofView),
    brandName: getBrandName(state),
  }),
  { sendAnalyticsClickEvent }
)(OrderProduct)
