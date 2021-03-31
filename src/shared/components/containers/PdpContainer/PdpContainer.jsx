import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { path, isEmpty } from 'ramda'

import ProductDetail from '../ProductDetail/ProductDetail'
import Bundles from '../Bundles/Bundles'
import SeoSchema from '../../common/SeoSchema/SeoSchema'
import NoSearchResults from '../../common/NoSearchResults/NoSearchResults'
import Loader from '../../common/Loader/Loader'
import Espot from '../Espot/Espot'
import AccessibleText from '../../common/AccessibleText/AccessibleText'
import BackToTop from '../../common/BackToTop/BackToTop'
import ProductsBreadcrumbs from '../../common/ProductsBreadCrumbs/ProductsBreadCrumbs'
import OutOfStockProductDetail from '../OutOfStockProductDetail/OutOfStockProductDetail'

import * as productsActions from '../../../actions/common/productsActions'
import { initCarousel } from '../../../actions/common/carousel-actions'
import * as sandBoxActions from '../../../actions/common/sandBoxActions'
import espots from '../../../constants/espotsMobile'
import cmsConsts from '../../../constants/cmsConsts'
import * as geoIPActions from '../../../actions/common/geoIPActions'
import { getItem } from '../../../../client/lib/cookie/utils'

import { checkIfOOS } from '../../../selectors/inventorySelectors'
import { getGlobalEspotName } from '../../../../shared/selectors/espotSelectors'
import {
  getPdpBreadcrumbs,
  getCurrentProduct,
} from '../../../../shared/selectors/productSelectors'
import { isFeatureHttpsCanonicalEnabled } from '../../../../shared/selectors/featureSelectors'
import {
  getPrevPath,
  selectHostname,
} from '../../../../shared/selectors/routingSelectors'
import { prefixWithHttpsProtocol } from '../../../lib/canonicalisation'
import ConnectedAbandonmentModalTrigger from '../AbandonmentModalTrigger/AbandonmentModalTrigger'
import espotsDesktop from '../../../constants/espotsDesktop'
import { isAbsoluteUrl } from '../../../lib/url-utils'
import { isMobile } from './../../../selectors/viewportSelectors'

export const getSuitableOGImage = (product) => {
  if (
    !product.assets ||
    (product.assets && typeof product.assets[0] !== 'object')
  ) {
    return ''
  }

  const image = product.assets.find(
    (asset) => asset.assetType === 'IMAGE_NORMAL'
  )

  return image ? image.url : ''
}

@connect(
  (state) => ({
    product: getCurrentProduct(state),
    region: state.config.region,
    scrollToTopFeature: state.features.status.FEATURE_PDP_SCROLL_TO_TOP,
    globalEspotName: getGlobalEspotName(state),
    breadcrumbsProduct: getPdpBreadcrumbs(state), // breadcrumb from the server in relation to the canonical product
    categoryBreadcrumbs: state.products.breadcrumbs, // breadCrumb following the user journey up to the plp page
    prevPath: getPrevPath(state),
    isFeatureHttpsCanonicalEnabled: isFeatureHttpsCanonicalEnabled(state),
    hostname: selectHostname(state),
    isMobile: isMobile(state),
  }),
  {
    ...productsActions,
    initCarousel,
    ...sandBoxActions,
  }
)
class PdpContainer extends Component {
  static propTypes = {
    product: PropTypes.object,
    params: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
    location: PropTypes.object,
    getProductDetail: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    clearProduct: PropTypes.func,
    showTacticalMessage: PropTypes.func,
    hideTacticalMessage: PropTypes.func,
    scrollToTopFeature: PropTypes.bool,
    globalEspotName: PropTypes.string.isRequired,
    categoryBreadcrumbs: PropTypes.array.isRequired,
    isFeatureHttpsCanonicalEnabled: PropTypes.bool.isRequired,
    getProductStock: PropTypes.func.isRequired, // eslint-disable-line
    isMobile: PropTypes.bool.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  state = {
    urlHasUpdated: false,
    breadcrumbs: null, // client side breadcrumbs following the user journey up to the product page
  }

  UNSAFE_componentWillMount() {
    this.fetchPdpData(this.props)
  }

  fetchPdpData(props) {
    const { params, getProductDetail, getProductStock, product } = props

    if (!process.browser) return

    const isPreloaded = path(['isPreloaded'], product)
    if (isEmpty(product) || !product.productId || isPreloaded) {
      getProductDetail({ ...params })
    } else if (getItem('authenticated') === 'yes') {
      getProductStock(product.productId)
    }
  }

  handleBreadcrumbs = () => {
    const { categoryBreadcrumbs, prevPath, product } = this.props
    // if no previous visited path from the user return
    // if list is undefined = user navigate to a pdp from mini bag product
    const isProductList = path(['list'], product)
    if (prevPath === 'direct link' || !prevPath || !isProductList) return
    const updatedBreadCrumb = Array.isArray(categoryBreadcrumbs)
      ? [...categoryBreadcrumbs]
      : [{ label: 'Home' }]
    // add the url of the last category
    const lastIndex = categoryBreadcrumbs.length - 1
    updatedBreadCrumb[lastIndex].url =
      updatedBreadCrumb[lastIndex].label === 'Home' ? '/' : prevPath

    this.setState({
      breadcrumbs: updatedBreadCrumb,
    })
  }

  componentDidMount() {
    if (window) window.scrollTo(0, 0)
    this.props.showTacticalMessage()
    // Hook for the Qubit tag "iProspect Floodlight PDP"
    document.dispatchEvent(new Event('landedOnPDP'))

    // update breadCrumbs
    // this is call here because this life cycle is not trigger on SSR,
    // that way we are not trying to build the Breadcrumbs without a user journey to show
    // and we can display the breadcrumb of the product based on the product canonical url
    this.handleBreadcrumbs()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { getProductDetail, params, location = {} } = nextProps
    if (this.props.location.pathname === location.pathname) return null
    // if the user access another PDP page from a PDP render Server-side breadcrumb
    if (this.props.location.pathname !== location.pathname) {
      this.setState({
        breadcrumbs: null,
      })
    }

    const { l } = this.context

    if (location.pathname === '/webapp/wcs/stores/servlet/ProductDisplay') {
      // [MJI-1077] We need to handle the deprecated PDP URLs:
      // /webapp/wcs/stores/servlet/ProductDisplay?langId=-1&catalogId=33057&storeId=12556&productId=32409407.
      const productId = path(['query', 'productId'], location)
      return getProductDetail({ identifier: productId })
    }

    if (location.pathname.includes(`/${l`product`}/`)) {
      getProductDetail({ ...params }, false)
    }
  }

  componentDidUpdate({ product, location }) {
    if (this.props.product !== product && window) window.scrollTo(0, 0)

    if (location && location.search !== this.props.location.search)
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        urlHasUpdated: true,
      })
  }

  componentWillUnmount() {
    const { clearProduct, hideTacticalMessage } = this.props
    clearProduct()
    hideTacticalMessage()
  }

  renderProductDetails(clientSideBreadcrumbs) {
    const { product, location, isMobile } = this.props
    const { isBundleOrOutfit } = product
    const isOOS = checkIfOOS(product.items)

    if (isBundleOrOutfit) {
      return <Bundles product={product} />
    } else if (isOOS) {
      return <OutOfStockProductDetail product={product} />
    }

    return (
      <ProductDetail
        product={product}
        location={location}
        mobileBreadcrumbs={isMobile && clientSideBreadcrumbs}
      />
    )
  }

  static needs = [
    initCarousel.bind(null, 'productDetail', 1, 0),
    initCarousel.bind(null, 'bundles', 1, 0),
    (...args) => (dispatch, getState) =>
      dispatch(productsActions.getProductDetail(...args)).then(() =>
        dispatch(
          geoIPActions.setRedirectURLForPDP(getState().currentProduct.grouping)
        )
      ),
    sandBoxActions.showTacticalMessage,
    () =>
      sandBoxActions.getContent(
        null,
        espots.pdp[0],
        cmsConsts.ESPOT_CONTENT_TYPE
      ),
    () =>
      sandBoxActions.getContent(
        null,
        espots.pdp[1],
        cmsConsts.ESPOT_CONTENT_TYPE
      ),
  ]

  render() {
    const {
      product,
      location,
      scrollToTopFeature,
      globalEspotName,
      breadcrumbsProduct,
      hostname,
      isMobile,
      isFeatureHttpsCanonicalEnabled,
    } = this.props

    const { l } = this.context
    const abandonmentModalEspot = espotsDesktop.abandonment_modal.PDP
    const { urlHasUpdated, breadcrumbs } = this.state

    const loader = (
      <div>
        <AccessibleText>{l`Product information loading`}</AccessibleText>
        <Loader />
      </div>
    )

    if (!product) return loader

    const {
      success,
      name,
      productId,
      isBundleOrOutfit,
      sourceUrl,
      canonicalUrl,
      metaDescription,
    } = product

    let absoluteCanonical

    if (canonicalUrl) {
      absoluteCanonical = isAbsoluteUrl(canonicalUrl)
        ? canonicalUrl
        : `${hostname}${canonicalUrl}`
    } else {
      absoluteCanonical = false
    }

    const prefixedCanonicalURL = prefixWithHttpsProtocol(
      absoluteCanonical || sourceUrl,
      isFeatureHttpsCanonicalEnabled
    )

    const clientSideBreadcrumbs = breadcrumbs
      ? isMobile
        ? [...breadcrumbs]
        : [...breadcrumbs, { label: name }]
      : breadcrumbsProduct

    if (success === false)
      return <NoSearchResults urlHasUpdated={urlHasUpdated} />

    if (!productId) return loader

    return (
      <div className="container PdpContainer">
        <Helmet
          title={name}
          meta={[
            { name: 'description', content: metaDescription },
            { name: 'og:title', content: name },
            { name: 'og:type', content: 'product' },
            { name: 'og:url', content: prefixedCanonicalURL },
            {
              name: 'og:image',
              content: getSuitableOGImage(product),
            },
            { name: 'og:description', content: metaDescription },
          ]}
          link={[
            {
              rel: 'canonical',
              href: prefixedCanonicalURL,
            },
          ]}
        />
        <SeoSchema
          location={location}
          type="Product"
          data={this.props.product}
        />
        {!isBundleOrOutfit && (
          <AccessibleText>
            {l`This is the product page for: ${name}`}
          </AccessibleText>
        )}
        <Espot key="pdpGlobalEspot" identifier={globalEspotName} />
        {!isMobile && (
          <ProductsBreadcrumbs breadcrumbs={clientSideBreadcrumbs} />
        )}

        {this.renderProductDetails(clientSideBreadcrumbs)}

        {scrollToTopFeature && <BackToTop />}
        <ConnectedAbandonmentModalTrigger espot={abandonmentModalEspot} />
      </div>
    )
  }
}

export default PdpContainer
