import PropTypes from 'prop-types'
import { compose, isEmpty, path, pathOr, equals } from 'ramda'
import React, { Component, Fragment } from 'react'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import classnames from 'classnames'
import WithQubit from '../../common/Qubit/WithQubit'

/**
 * Actions
 */
import * as productsActions from '../../../actions/common/productsActions'
import { clearSortOptions } from '../../../actions/components/sortSelectorActions'
import * as refinementsActions from '../../../actions/components/refinementsActions'
import * as plpContainerActions from '../../../actions/components/PlpContainerActions'
import * as infinityScrollActions from '../../../actions/common/infinityScrollActions'
import * as sandBoxActions from '../../../actions/common/sandBoxActions'
import {
  getTrendingProducts,
  getSocialProofBanners,
} from '../../../actions/common/socialProofActions'

/**
 * Selectors
 */
import { isMobile, isTablet } from '../../../selectors/viewportSelectors'
import { getGlobalEspotName } from '../../../../shared/selectors/espotSelectors'
import { isRefinementsSelected } from '../../../../shared/selectors/refinementsSelectors'
import * as productSelectors from '../../../../shared/selectors/productSelectors'
import { isModalOpen } from '../../../selectors/modalSelectors'
import * as routingSelectors from '../../../selectors/routingSelectors'
import {
  isFeatureHttpsCanonicalEnabled,
  isFeatureSocialProofEnabledForView,
  isFeatureStickyHeaderEnabled,
  isDynamicTitle,
  isFeatureCategoryHeaderShowMoreDesktopEnabled,
  isFeatureCategoryHeaderShowMoreMobileEnabled,
} from '../../../selectors/featureSelectors'
import {
  getMegaNavHeight,
  getCategoryId,
} from '../../../selectors/navigationSelectors'
import { getNumberOfPagesHiddenAtEnd } from '../../../selectors/infinityScrollSelectors'

/**
 * Components
 */
import ProductList from './ProductList'
import PlpHeader from './PlpHeader'
import Filters from './Filters'
import NoSearchResults from '../../common/NoSearchResults/NoSearchResults'
import BackToTop from '../../common/BackToTop/BackToTop'
import Refinements from './Refinements/Refinements'
import SandBox from '../../containers/SandBox/SandBox'
import Espot from '../Espot/Espot'
import NotFound from '../NotFound/NotFound'
import RefinementContainer from './RefinementContainer'
import ProductsBreadcrumbs from '../../common/ProductsBreadCrumbs/ProductsBreadCrumbs'
import RecentlyViewedTab from '../../common/RecentlyViewedTab/RecentlyViewedTab'
import ProductCarousel from '../../common/ProductCarousel/ProductCarousel' // Dependencies for ADP-2861 - Qubit test

/**
 * Helpers
 */
import {
  getPaginationSeoUrls,
  reviseCanonicalUrl,
} from '../../../lib/plp-utils'
import ConnectedAbandonmentModalTrigger from '../AbandonmentModalTrigger/AbandonmentModalTrigger'
import espotsDesktop from '../../../constants/espotsDesktop'
import { getCategoryFromBreadcrumbs } from '../../../lib/products-utils'
import cmsUtilities, { fixCmsUrl } from '../../../lib/cms-utilities'
import { isIE11, isFF } from '../../../lib/browser'
import { getRouteFromUrl } from '../../../lib/get-product-route'

import extractRouteParams from '../../../decorators/extract-route-params'

import { GTM_CATEGORY } from '../../../analytics'
import analyticsDecorator from '../../../../client/lib/analytics/analytics-decorator'
import { withWindowScroll } from '../WindowEventProvider/withWindowScroll'
import espots from '../../../constants/espotsMobile'
import cmsConsts from '../../../constants/cmsConsts'

const NO_INDEX_NO_FOLLOW_META = {
  name: 'robots',
  content: 'noindex,nofollow',
}

const plpStates = {
  LOADING: 'loading',
  PRODUCT_LIST: 'productList',
  NO_SEARCH_RESULTS_WITH_REFINEMENTS: 'noSearchResultsWithRefinements',
  NO_SEARCH_RESULTS_INCLUDES_SEARCH: 'noSearchResultsIncludesSearch',
  NOT_FOUND: 'notFound',
}

const locationChanged = (location, nextLocation) => {
  return (
    location.pathname !== nextLocation.pathname ||
    !equals(location.query, nextLocation.query)
  )
}

class PlpContainer extends Component {
  constructor(props) {
    super(props)
    this.ResultSectionRef = React.createRef()
    this.PlpHeaderRef = React.createRef()
    this.state = {
      scrollY: 0,
    }
  }

  static propTypes = {
    visited: PropTypes.array,
    location: PropTypes.object,
    products: PropTypes.array,
    breadcrumbs: PropTypes.array,
    categoryId: PropTypes.number,
    canonicalUrl: PropTypes.string,
    getProducts: PropTypes.func,
    totalProducts: PropTypes.number,
    title: PropTypes.string,
    categoryTitle: PropTypes.string,
    categoryDescription: PropTypes.string,
    isLoadingMore: PropTypes.bool,
    isLoadingAll: PropTypes.bool,
    preservedScroll: PropTypes.number,
    isInfinityScrollActive: PropTypes.bool,
    hasReachedPageBottom: PropTypes.bool,
    hitWaypointBottom: PropTypes.func,
    updateProductsLocation: PropTypes.func,
    productsRefinements: PropTypes.array,
    refinements: PropTypes.object,
    showTacticalMessage: PropTypes.func,
    hideTacticalMessage: PropTypes.func,
    clearRefinements: PropTypes.func,
    clearSortOptions: PropTypes.func,
    refreshPlp: PropTypes.bool,
    plpPropsRefresh: PropTypes.func,
    redirectIfOneProduct: PropTypes.bool,
    isMobile: PropTypes.bool.isRequired,
    categoryBanner: PropTypes.string,
    shouldIndex: PropTypes.bool.isRequired,
    isModalOpen: PropTypes.bool.isRequired,
    miniBagOpen: PropTypes.bool.isRequired,
    isFeatureHttpsCanonicalEnabled: PropTypes.bool.isRequired,
    getTrendingProducts: PropTypes.func.isRequired,
    isFeaturePLPSocialProofEnabled: PropTypes.bool.isRequired,
    megaNavHeight: PropTypes.number.isRequired,
    isFeatureStickyHeaderEnabled: PropTypes.bool.isRequired,
    isDynamicTitle: PropTypes.bool.isRequired,
    locationQuery: PropTypes.object.isRequired,
    isFeatureCategoryHeaderShowMoreMobileEnabled: PropTypes.bool.isRequired,
    isFeatureCategoryHeaderShowMoreDesktopEnabled: PropTypes.bool.isRequired,
    numberOfPagesHiddenAtEnd: PropTypes.number.isRequired,
    setInfinityPage: PropTypes.func.isRequired,
    currentPage: PropTypes.number.isRequired,
    isRefinementsSelected: PropTypes.bool,
  }

  static defaultProps = {
    redirectIfOneProduct: false,
    catHeaderResponsiveCmsUrl: '',
    clearSortOptions: () => {},
    clearRefinements: () => {},
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  state = {
    urlHasUpdated: false,
  }

  UNSAFE_componentWillMount() {
    const {
      clearSortOptions,
      clearRefinements,
      location: {
        query: { refinements },
      },
      location,
      productsLocation,
      resetProductState,
      visited,
    } = this.props

    // Ensure UI is cleared of previous PLP data
    // if it's not the same PLP as before
    const isNotInitialRender = process.browser && visited.length > 1

    if (
      isNotInitialRender &&
      productsLocation &&
      locationChanged(location, productsLocation)
    ) {
      resetProductState()
    }

    if (!refinements) {
      // blank slate when loading component if refinements is not present in url query
      clearSortOptions()
      clearRefinements()
    }
  }

  // function is to stop calls to wcs with invalid query string
  isSearchPathWithNoQueryParam = () => {
    const { location, locationQuery } = this.props
    const q = pathOr('', ['q'], locationQuery)
    let qs = ''
    if (!isEmpty(q)) {
      qs = `?q=${q}`
    }
    return /^(\/|\w)search(\/|)(?!=\?)*$/.test(location.pathname + qs)
  }

  isSearchPage = () => this.props.location.pathname.includes('search')

  componentDidMount() {
    const {
      visited,
      location,
      getProducts,
      updateProductsLocation,
      productsRefinements: refinements,
      canonicalUrl,
      preservedScroll,
      showTacticalMessage,
      plpPropsRefresh,
      products,
      getTrendingProducts,
      getSocialProofBanners,
      setInfinityPage,
      currentPage,
    } = this.props

    if (!this.isSearchPage()) setInfinityPage(currentPage)

    if (visited.length > 1 || !products) {
      if (this.isSearchPathWithNoQueryParam()) return null
      getProducts(location)
    }

    showTacticalMessage()
    plpPropsRefresh()
    // On the first load, if we landed on a PLP theres a chance the URL is
    // from useablenet, using category params
    // Get rid of them.

    if (visited.length === 1) {
      if (location.query.category) {
        updateProductsLocation({ refinements, canonicalUrl }, location)
      }
    }

    // IE11 and Firefox fix for react-router preserve scroll issue
    if (isIE11() || isFF()) {
      if (process.browser && location.action !== 'PUSH' && preservedScroll) {
        window.scrollTo(0, preservedScroll)
      } else {
        window.scrollTo(0, 0)
      }
    }

    // Hook for the Qubit tag "iProspect Floodlight PLP"
    document.dispatchEvent(new Event('landedOnPLP'))

    if (this.props.isFeaturePLPSocialProofEnabled) {
      getTrendingProducts('PLP')
      getSocialProofBanners()
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.props.isLoadingAll && nextProps.isLoadingAll) {
      this.setState({ scrollY: window.scrollY })
    }

    const {
      location: nextLocation,
      products: nextProducts,
      isLoadingAll: nextIsLoadingAll,
      hasReachedPageBottom: nextHasReachedPageBottom,
      isModalOpen,
    } = nextProps

    const {
      location,
      getProducts,
      visited,
      clearRefinements,
      hasReachedPageBottom,
      redirectIfOneProduct,
      isInfinityScrollActive,
      miniBagOpen,
    } = this.props

    if (
      !isModalOpen &&
      !miniBagOpen &&
      isInfinityScrollActive &&
      nextHasReachedPageBottom &&
      !hasReachedPageBottom
    ) {
      return this.loadingMoreProducts()
    }

    // TODO Should be in the search action
    /*
      The logic `visited.length > 1` is to check whether the user has gone straight to
      a specific canonical url.

      If the user has then do not redirect to the pdp if there is only one product.
     */
    if (
      redirectIfOneProduct &&
      !nextIsLoadingAll &&
      nextProducts &&
      nextProducts.length === 1 &&
      nextProducts[0] &&
      visited.length > 1
    ) {
      const { sourceUrl, seoUrl } = nextProducts[0]
      browserHistory.replace(getRouteFromUrl(sourceUrl || seoUrl))
      return
    }

    if (locationChanged(nextLocation, location)) {
      // If we navigate around using the browser back, need to clear the refinements
      if (nextLocation.action === 'POP') clearRefinements()

      // Block getProducts Action. Infinite scroll triggers addToProducts
      // loading more products and then updates the browser url. PlpContainer
      // is triggered by browser url change and getProducts is not required.
      if (path(['query', 'currentPage'], nextLocation) !== undefined)
        return false
      getProducts(nextLocation)
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.location.search !== nextProps.location.search) {
      return true
    }

    const props = [
      'products',
      'breadcrumbs',
      'totalProducts',
      'categoryTitle',
      'categoryDescription',
      'isLoadingAll',
      'isLoadingMore',
      'isMobile',
      'stickyHeader',
    ]
    return props.some((prop) => nextProps[prop] !== this.props[prop])
  }

  scrollToRef = (ref) => {
    const { isMobile } = this.props
    const heightToSubstract = this.props.isFeatureStickyHeaderEnabled
      ? this.props.megaNavHeight
      : 0
    const offset = ref.current.offsetTop - heightToSubstract
    const isBelowFiltersRow = this.state.scrollY > offset

    if (isMobile)
      return window.scrollTo({ top: offset, left: 0, behavior: 'smooth' })

    if (isBelowFiltersRow) return window.scrollTo(0, offset)

    return window.scrollTo(0, 0)
  }

  handleScrollToRef = () => {
    const { isMobile } = this.props
    return isMobile
      ? this.scrollToRef(this.PlpHeaderRef)
      : this.scrollToRef(this.ResultSectionRef)
  }

  componentDidUpdate(prevProps) {
    const {
      isLoadingAll,
      location,
      catHeaderResponsiveCmsUrl,
      breadcrumbs,
    } = this.props

    const {
      isLoadingAll: prevIsLoadingAll,
      breadcrumbs: prevBreadcrumbs,
    } = prevProps

    if (process.browser && prevIsLoadingAll && !isLoadingAll) {
      /**
       * The below logic is for scrolling to the results or the PlpHeader section depending if mobile or desktop on the PLP
       * We need to wait for the category header to load before scrolling,
       * If it's ie11, the waiting functionality will not work, so scroll to the top... for consistency
       * If there is not a category header, we can scroll immediately
       * If there category header is loaded, we can scroll immediately
       * Otherwise, wait for it to load
       */
      if (isIE11()) return window.scrollTo(0, 0)

      if (
        getCategoryFromBreadcrumbs(prevBreadcrumbs) !==
        getCategoryFromBreadcrumbs(breadcrumbs)
      )
        return window.scrollTo(0, 0)

      if (!path(['sandbox', 'mapped'], window)) return window.scrollTo(0, 0)

      if (!catHeaderResponsiveCmsUrl) return this.handleScrollToRef()

      const elementReference = cmsUtilities.getSandboxId(
        encodeURIComponent(fixCmsUrl(catHeaderResponsiveCmsUrl))
      )

      if (pathOr([], ['sandbox', 'mapped'], window).includes(elementReference))
        return this.handleScrollToRef()

      this.handleScrollToRef()

      const listenerId = cmsUtilities.registerListener(
        'set',
        (target, property, value) => {
          if (value === elementReference) {
            this.scrollToRef(this.ResultSectionRef)
            this.scrollToRef(this.PlpHeaderRef)
            cmsUtilities.removeListener('set', listenerId)
          }
        }
      )
    }

    if (prevProps.location.search !== location.search)
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        urlHasUpdated: true,
      })
  }

  componentWillUnmount() {
    const { hideTacticalMessage } = this.props
    hideTacticalMessage()
  }

  getMobileEspot = () => {
    return (
      <SandBox
        key={2}
        cmsPageName={espots.plp[0]}
        contentType={cmsConsts.ESPOT_CONTENT_TYPE}
        isInPageContent
        shouldGetContentOnFirstLoad
      />
    )
  }

  getFilter = () => {
    return <Filters key={1} />
  }

  getRefinements = () => {
    return <Refinements key={3} />
  }

  getListHeader = (filter, mobileEspot, refinements) => {
    return [filter, mobileEspot, refinements]
  }

  getProductListToRender = () => {
    const { isLoadingMore, products } = this.props
    const productListType = this.productListType
    const { urlHasUpdated } = this.state
    const filter = this.getFilter()
    const refinements = this.getRefinements()
    const listHeader = [filter, this.getMobileEspot(), refinements]

    switch (productListType) {
      case plpStates.LOADING:
        return [...listHeader, <ProductList isLoading key={'lo4'} />]

      case plpStates.PRODUCT_LIST:
        return [
          ...listHeader,
          ...(products && products.length
            ? [
                <ProductList
                  key="pl4"
                  products={products}
                  isLoading={isLoadingMore}
                />,
                <BackToTop key="plp-back-to-top" isPlp />,
                this.getPagination(),
              ]
            : [
                <NoSearchResults
                  isFiltered
                  productListType={productListType}
                  key={'ns4'}
                  urlHasUpdated={urlHasUpdated}
                />,
              ]),
        ]

      case plpStates.NO_SEARCH_RESULTS_WITH_REFINEMENTS:
        return [
          ...listHeader,
          <NoSearchResults
            isFiltered
            productListType={productListType}
            key={'ns4'}
            urlHasUpdated={urlHasUpdated}
          />,
        ]

      case plpStates.NO_SEARCH_RESULTS_INCLUDES_SEARCH:
        return [
          /**
            ADP-2971 Added listHeader to prevent Refinements.jsx to be unMounted. This lifecycle method will trigger
            `updateProductsRefinements` action which will re-fetch the products. When the promise is resolved, the 
            productsReducer does not get updated with the resulting products payload but the existing state instead
            (look at dispatch(setProducts(...)))
          */
          ...listHeader,
          <NoSearchResults
            productListType={productListType}
            key={'ns4'}
            urlHasUpdated={urlHasUpdated}
          />,
        ]

      default:
        return null
    }
  }

  get productListType() {
    const {
      isLoadingAll,
      totalProducts,
      refinements,
      location: { pathname },
      isMobile,
    } = this.props

    const domainsToExclude = ['dpth', 'dpmy']

    if (domainsToExclude.some((d) => pathname.includes(d))) {
      return plpStates.NOT_FOUND
    }

    if (isLoadingAll) {
      return plpStates.LOADING
    }

    if (totalProducts > 0) {
      return plpStates.PRODUCT_LIST
    }

    if (isMobile && totalProducts === 0 && !this.isSearchPage()) {
      return plpStates.PRODUCT_LIST
    }

    if (this.isSearchPage() && (totalProducts === 0 && isEmpty(refinements))) {
      return plpStates.NO_SEARCH_RESULTS_INCLUDES_SEARCH
    }

    return plpStates.NO_SEARCH_RESULTS_WITH_REFINEMENTS
  }

  getHelmetProps = () => {
    const {
      isLoadingAll,
      title,
      categoryTitle,
      categoryDescription,
      shouldIndex,
    } = this.props
    const canonicalUrl = reviseCanonicalUrl(this.props)
    const { nextPageUrl, prevPageUrl } = getPaginationSeoUrls(this.props)
    const { l } = this.context

    if (this.isSearchPage()) {
      return {
        title: l`Search - ${categoryTitle}`,
        meta: [
          {
            name: 'description',
            content: l`Search - ${categoryTitle}`,
          },
          NO_INDEX_NO_FOLLOW_META,
        ],
      }
    }

    const canonical = canonicalUrl && { rel: 'canonical', href: canonicalUrl }
    const prevPage = prevPageUrl && { rel: 'prev', href: prevPageUrl }
    const nextPage = nextPageUrl && { rel: 'next', href: nextPageUrl }

    const link = [canonical, prevPage, nextPage].filter(Boolean)

    if (isLoadingAll) {
      return {
        link,
        title: l`loading products`,
        meta: [
          {
            name: 'description',
            content: l`loading products`,
          },
          NO_INDEX_NO_FOLLOW_META,
        ],
      }
    }

    const desc = {
      name: 'description',
      content: categoryDescription,
    }

    return {
      link,
      title,
      meta: shouldIndex ? [desc] : [desc, NO_INDEX_NO_FOLLOW_META],
    }
  }

  getHelmet = () => {
    return <Helmet {...this.getHelmetProps()} />
  }

  getPagination = () => {
    const { nextPageUrl, prevPageUrl } = getPaginationSeoUrls(this.props)
    const { l } = this.context
    return (
      <div key={6} className="PlpContainer-pagination">
        <a
          className={`PlpContainer-paginationPrev`}
          href={prevPageUrl}
        >{l`Previous`}</a>
        <a
          className={`PlpContainer-paginationNext`}
          href={nextPageUrl}
        >{l`Next`}</a>
      </div>
    )
  }

  loadingMoreProducts = () => {
    const {
      products = [],
      totalProducts,
      hitWaypointBottom,
      numberOfPagesHiddenAtEnd,
    } = this.props
    if (
      numberOfPagesHiddenAtEnd ||
      products.length < parseInt(totalProducts, 10)
    ) {
      return hitWaypointBottom()
    }
  }

  static needs = [
    sandBoxActions.showTacticalMessage,
    productsActions.getServerProducts,
    () =>
      sandBoxActions.getContent(
        null,
        espots.plp[0],
        cmsConsts.ESPOT_CONTENT_TYPE
      ),
  ]

  get hasNoSearchResult() {
    return (
      this.productListType === plpStates.NO_SEARCH_RESULTS_WITH_REFINEMENTS ||
      this.productListType === plpStates.NO_SEARCH_RESULTS_INCLUDES_SEARCH
    )
  }

  refinementContainer = (productListType, refinements, stickyHeader) => {
    if (productListType !== plpStates.NO_SEARCH_RESULTS_INCLUDES_SEARCH)
      return (
        <RefinementContainer
          stickyHeader={stickyHeader}
          hasNoSearchResult={this.hasNoSearchResult}
          refinements={refinements}
        />
      )
  }

  render() {
    const {
      totalProducts,
      categoryBanner,
      isMobile,
      isTablet,
      location,
      globalEspotName,
      refinements,
      brandCode,
      breadcrumbs,
      categoryId,
      stickyHeader,
      catHeaderResponsiveCmsUrl,
      isLoadingAll,
      isFeatureStickyHeaderEnabled,
      title,
      categoryTitle,
      isDynamicTitle,
      isFeatureCategoryHeaderShowMoreDesktopEnabled,
      isFeatureCategoryHeaderShowMoreMobileEnabled,
      isRefinementsSelected,
    } = this.props
    const abandonmentModalEspot = espotsDesktop.abandonment_modal.CATEGORY
    const classNames = classnames('PlpContainer-resultsSection', {
      'is-stickyHeader': isFeatureStickyHeaderEnabled,
      'is-loading': isLoadingAll && !isMobile,
    })

    return (
      <Fragment>
        <div className="PlpContainer">
          {this.getHelmet()}
          {this.productListType === plpStates.NOT_FOUND ? (
            <NotFound />
          ) : (
            <Fragment>
              <ProductsBreadcrumbs breadcrumbs={breadcrumbs} />
              <Espot identifier={globalEspotName} customClassName="PlpEspot" />
              <div className="PlpHeaderWrapper" ref={this.PlpHeaderRef}>
                <PlpHeader
                  key={0}
                  categoryTitle={categoryTitle}
                  isDynamicTitle={isDynamicTitle}
                  title={title}
                  total={totalProducts.toString()}
                  bannerHTML={categoryBanner}
                  isMobile={isMobile}
                  brandCode={brandCode}
                  location={location}
                  catHeaderResponsiveCmsUrl={catHeaderResponsiveCmsUrl}
                  showCatHeaderForMobile={
                    isFeatureCategoryHeaderShowMoreMobileEnabled
                  }
                  showCatHeaderForDesktop={
                    isFeatureCategoryHeaderShowMoreDesktopEnabled
                  }
                />
              </div>

              <WithQubit
                id="qubit-adp-2861-dressipi-plp-spotlight"
                shouldUseQubit={!isRefinementsSelected && !!categoryId}
                ProductCarousel={ProductCarousel}
                peepNextItem={isMobile || isTablet}
                categoryId={categoryId}
                hammerOptions={{ domEvents: true }}
                // eslint-disable-next-line react/no-children-prop
                children={null}
              />

              <div ref={this.ResultSectionRef} className={classNames}>
                {this.refinementContainer(
                  this.productListType,
                  refinements,
                  stickyHeader
                )}
                <div className="PlpContainer-productListContainer">
                  {this.getProductListToRender()}
                </div>
              </div>
            </Fragment>
          )}
          <RecentlyViewedTab />
        </div>
        <ConnectedAbandonmentModalTrigger espot={abandonmentModalEspot} />
      </Fragment>
    )
  }
}

export function composeCategoryBanner(state) {
  return (
    path(['products', 'categoryBanner', 'encodedcmsMobileContent'], state) ||
    path(['products', 'categoryBanner', 'bannerHtml'], state) ||
    ''
  )
}

export default compose(
  analyticsDecorator(GTM_CATEGORY.PLP, { isAsync: true }),
  connect(
    (state) => ({
      locationQuery: routingSelectors.getLocationQuery(state),
      visited: routingSelectors.getVisitedPaths(state),
      products: state.products.products,
      productsRefinements: state.products.refinements,
      productsLocation: state.products.location,
      totalProducts: productSelectors.getProductsSearchResultsTotal(state),
      canonicalUrl: state.products.canonicalUrl,
      title: state.products.title,
      categoryTitle: state.products.categoryTitle,
      categoryDescription: state.products.categoryDescription,
      breadcrumbs: state.products.breadcrumbs,
      categoryId: getCategoryId(
        state,
        routingSelectors.getRoutePath.bind(null, state)
      ),
      brandCode: state.config.brandCode,
      isLoadingMore: state.products.isLoadingMore,
      isLoadingAll: state.products.isLoadingAll,
      isInfinityScrollActive: state.infinityScroll.isActive,
      preservedScroll: state.infinityScroll.preservedScroll,
      refinements: state.refinements.selectedOptions,
      refreshPlp: state.plpContainer.refreshPlp,
      miniBagOpen: state.shoppingBag.miniBagOpen,
      isMobile: isMobile(state),
      isTablet: isTablet(state),
      categoryBanner: composeCategoryBanner(state),
      catHeaderResponsiveCmsUrl: path(
        ['products', 'categoryBanner', 'cmsMobileContent', 'responsiveCMSUrl'],
        state
      ),
      globalEspotName: getGlobalEspotName(state),
      shouldIndex: productSelectors.getShouldIndex(state),
      stickyHeader: state.pageHeader.sticky,
      isModalOpen: isModalOpen(state),
      isFeatureHttpsCanonicalEnabled: isFeatureHttpsCanonicalEnabled(state),
      isFeaturePLPSocialProofEnabled: isFeatureSocialProofEnabledForView(
        state,
        'PLP'
      ),
      megaNavHeight: getMegaNavHeight(state),
      isFeatureStickyHeaderEnabled: isFeatureStickyHeaderEnabled(state),
      isDynamicTitle: isDynamicTitle(state),
      isFeatureCategoryHeaderShowMoreDesktopEnabled: isFeatureCategoryHeaderShowMoreDesktopEnabled(
        state
      ),
      isFeatureCategoryHeaderShowMoreMobileEnabled: isFeatureCategoryHeaderShowMoreMobileEnabled(
        state
      ),
      numberOfPagesHiddenAtEnd: getNumberOfPagesHiddenAtEnd(state),
      currentPage: routingSelectors.getCurrentPageFromRouting(state),
      isRefinementsSelected: isRefinementsSelected(state),
    }),
    {
      ...productsActions,
      ...plpContainerActions,
      ...infinityScrollActions,
      ...sandBoxActions,
      ...refinementsActions,
      clearSortOptions,
      getTrendingProducts,
      getSocialProofBanners,
    }
  ),
  withWindowScroll({
    notifyWhenReachedBottomOfPage: true,
    pageBottomBuffer: 1400,
  }),
  extractRouteParams(['redirectIfOneProduct'])
)(PlpContainer)

export { PlpContainer as WrappedPlpContainer }
