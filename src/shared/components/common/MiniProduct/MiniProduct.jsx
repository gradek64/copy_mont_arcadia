import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import classnames from 'classnames'
import { path } from 'ramda'

import { getProductRouteFromId } from '../../../lib/get-product-route'
import { isMobile } from '../../../selectors/viewportSelectors'
import { getSelectedSKU } from '../../../selectors/productSelectors'
import { enableQuickViewButtonOnBundlePages } from '../../../selectors/brandConfigSelectors'
import { isFeatureWishlistEnabled } from '../../../selectors/featureSelectors'
import {
  IMAGE_SIZES,
  amplienceAssetsPropTypes,
  amplienceAssetsDefaultProps,
} from '../../../constants/amplience'

import { setFormMessage } from '../../../actions/common/formActions'
import * as modalActions from '../../../actions/common/modalActions'
import * as productsActions from '../../../actions/common/productsActions'
import {
  setProductQuickview,
  setProductIdQuickview,
} from '../../../actions/common/quickviewActions'

import BundlesSizes from '../BundlesSizes/BundlesSizes'
import ProductQuickViewButton from '../ProductQuickViewButton/ProductQuickViewButton'
import HistoricalPrice from '../HistoricalPrice/HistoricalPrice'
import ProductQuickview from '../../containers/ProductQuickview/ProductQuickview'
import ResponsiveImage from '../ResponsiveImage/ResponsiveImage'
import AddToBag from '../AddToBag/AddToBag'
import WishlistButton from '../../common/WishlistButton/WishlistButton'
import { getBrandName } from '../../../selectors/configSelectors'

const getThumbnailAssetUrl = path([1, 'url'])

@connect(
  (state, { productId }) => ({
    modal: state.modal,
    sku: getSelectedSKU(productId, state),
    isBundleFlexible: state.currentProduct.bundleType === 'Flexible',
    isMobile: isMobile(state),
    pathname: state.routing.location.pathname,
    lang: state.config.lang,
    enableQuickViewButtonOnBundlePages: enableQuickViewButtonOnBundlePages(
      state
    ),
    isFeatureWishlistEnabled: isFeatureWishlistEnabled(state),
    brandName: getBrandName(state),
  }),
  {
    ...modalActions,
    ...productsActions,
    setFormMessage,
    setProductQuickview,
    setProductIdQuickview,
  }
)
class MiniProduct extends Component {
  static propTypes = {
    sku: PropTypes.string,
    isBundleFlexible: PropTypes.bool.isRequired,
    setFormMessage: PropTypes.func,
    productId: PropTypes.number,
    name: PropTypes.string,
    assets: PropTypes.array,
    amplienceAssets: amplienceAssetsPropTypes,
    unitPrice: PropTypes.string,
    lineNumber: PropTypes.string,
    wasPrice: PropTypes.string,
    wasWasPrice: PropTypes.string,
    rrp: PropTypes.string,
    showModal: PropTypes.func,
    items: PropTypes.array,
    attributes: PropTypes.object,
    className: PropTypes.string,
    setProductIdQuickview: PropTypes.func,
    setProductQuickview: PropTypes.func,
    isMobile: PropTypes.bool,
    modalMode: PropTypes.oneOf(['rollFull', 'plpQuickview']),
    deliveryMessage: PropTypes.string,
    lang: PropTypes.string.isRequired,
    enableQuickViewButtonOnBundlePages: PropTypes.bool.isRequired,
    stockThreshold: PropTypes.number,
    isFeatureWishlistEnabled: PropTypes.bool,
    brandName: PropTypes.string.isRequired,
  }

  static defaultProps = {
    isMobile: true,
    modalMode: 'rollFull',
    deliveryMessage: '',
    stockThreshold: 3,
    assets: [],
    amplienceAssets: amplienceAssetsDefaultProps,
    lineNumber: '',
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  componentDidMount() {
    this.handleLoad()
    // diable css animation if javascript is available
    const node = this.product
    if (node) node.style.animation = 'none'
  }

  handleLoad = () => {
    // if image is loaded on cache or image on load
    const node = this.product
    const image = this.image
    if (image && image.naturalWidth && node) node.style.opacity = 1
  }

  shouldAddToBag = ({ showError = true } = {}) => {
    const { sku, setFormMessage, productId } = this.props
    if (sku) return true
    if (showError)
      setFormMessage(
        'bundlesAddToBag',
        'Please select your size to continue',
        productId
      )
  }

  openQuickviewOrPdp = (e) => {
    e.preventDefault()
    if (this.props.isMobile) {
      const { pathname } = this.props
      const { l } = this.context

      browserHistory.push(
        getProductRouteFromId(pathname, this.props.productId, l)
      )
    } else {
      this.showQuickview()
    }
  }

  showQuickview = () => {
    const {
      productId,
      setProductQuickview,
      setProductIdQuickview,
      showModal,
      modalMode,
    } = this.props
    // We explicitly set the product quick view state to an empty object here
    // in order to aid our analytics decorator on ProductQuickView to know
    // that a product is being quick-viewed. This helps with cases where you
    // quick view the same product sequentially.
    setProductQuickview({})
    // Set the productId of product to be quickview-ed:
    setProductIdQuickview(productId)
    showModal(<ProductQuickview />, { mode: modalMode })
  }

  renderAddToBag = (sku, productId, deliveryMessage, catEntryId) => (
    <AddToBag
      className="AddToBag--bundles"
      productId={productId}
      quantity={1}
      sku={sku}
      partNumber={sku}
      deliveryMessage={deliveryMessage}
      shouldShowInlineConfirm
      shouldShowMiniBagConfirm
      shouldAddToBag={this.shouldAddToBag}
      catEntryId={catEntryId}
    />
  )

  renderWishlistButton = (productId, productDetails) => (
    <WishlistButton
      productId={productId}
      productDetails={productDetails}
      modifier="bundle"
    />
  )

  renderButtonGroup = () => {
    const {
      sku,
      productId,
      deliveryMessage,
      isBundleFlexible,
      isFeatureWishlistEnabled,
      items,
      lineNumber,
      unitPrice,
    } = this.props

    const catEntryId = sku
      ? items.find((item) => item.sku === sku).catEntryId
      : undefined

    const productDetails = {
      lineNumber,
      price: unitPrice,
    }

    return (
      <div className="MiniProduct-secondaryButtonGroup">
        {isBundleFlexible &&
          this.renderAddToBag(sku, productId, deliveryMessage, catEntryId)}
        {isBundleFlexible &&
          isFeatureWishlistEnabled &&
          this.renderWishlistButton(productId, productDetails)}
      </div>
    )
  }

  render() {
    const {
      name,
      unitPrice,
      assets,
      amplienceAssets: { images: amplienceImages },
      attributes,
      items,
      wasPrice,
      wasWasPrice,
      rrp,
      productId,
      className,
      isMobile,
      lang,
      enableQuickViewButtonOnBundlePages,
      stockThreshold,
      brandName,
    } = this.props

    const quickViewButton = !isMobile &&
      enableQuickViewButtonOnBundlePages && (
        <div className="MiniProduct-quickView">
          <ProductQuickViewButton onClick={this.openQuickviewOrPdp} />
        </div>
      )

    const classNames = classnames(
      'MiniProduct',
      `MiniProduct--${lang}`,
      className,
      { 'MiniProduct--hasQuickView': enableQuickViewButtonOnBundlePages }
    )

    return (
      <div
        ref={(div) => {
          this.product = div
        }}
        className={classNames}
      >
        <div className="MiniProduct-container">
          <div className="MiniProduct-imageContainer">
            <ResponsiveImage
              className="MiniProduct-image"
              ref={(image) => {
                this.image = image
              }}
              src={getThumbnailAssetUrl(assets)}
              amplienceUrl={amplienceImages[0]}
              sizes={IMAGE_SIZES.bundleProductSlots}
              onLoad={() => this.handleLoad()}
              onClick={this.openQuickviewOrPdp}
              aria-hidden="true"
            />
          </div>
          <div className="MiniProduct-details">
            <h3
              role="presentation"
              onClick={this.openQuickviewOrPdp}
              className="MiniProduct-title"
            >
              {name}
            </h3>
            <HistoricalPrice
              className="HistoricalPrice--miniProduct"
              brandName={brandName}
              price={unitPrice}
              wasPrice={wasPrice}
              wasWasPrice={wasWasPrice}
              rrp={rrp}
            />
            <BundlesSizes
              attributes={attributes}
              items={items}
              productId={productId}
              stockThreshold={stockThreshold}
            />
            {quickViewButton}
            {!isMobile && this.renderButtonGroup()}
          </div>
        </div>
        {isMobile && this.renderButtonGroup()}
      </div>
    )
  }
}

export default MiniProduct
