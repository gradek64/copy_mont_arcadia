import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { omit, contains, path } from 'ramda'
import {
  hasDeliveryAddress,
  hasCreditCard,
} from '../../../shared/lib/routing/v2/checkout/checkout-helpers'
import { pageLoaded as pageLoadedAction } from '../../../shared/actions/common/analyticsActions'
import {
  setPageType,
  clearPageType,
} from '../../../shared/actions/common/pageTypeActions'
import { isUserAuthenticated } from '../../../shared/selectors/userAuthSelectors'
import { getCurrentProductIsPreloaded } from '../../../shared/selectors/productSelectors'
import espots from '../../../shared/constants/espotsMobile'
import { GTM_CATEGORY } from '../../../shared/analytics'

const noop = () => {}

const espotsList = Object.keys(espots).reduce((sum, value) => {
  return [...sum, ...espots[value]]
}, [])

// TODO use switch or rather consider moving this logic to the decorated components
const isComponentLoading = (pageType, state) => {
  if (pageType === GTM_CATEGORY.HOME) {
    return !contains(GTM_CATEGORY.HOME, Object.keys(state.sandbox.pages))
  } else if (pageType === GTM_CATEGORY.MR_CMS) {
    // ignore cms components on the home page
    const cmsPagesList = Object.keys(
      omit([...espotsList, 'navSocial'], state.sandbox.pages)
    )
    if (cmsPagesList.length < 1) {
      return true
    }

    const pathname = state.routing.location.pathname
    const isLoaded = cmsPagesList.some((page) => {
      const decodedPathname = decodeURIComponent(page)

      return pathname === page || pathname === decodedPathname
    })

    const isCmsPageLoaded =
      isLoaded ||
      contains(cmsPagesList[0], ['notFound', 'termsAndConditions']) ||
      /\/size-guide/.test(pathname)

    return !isCmsPageLoaded
  } else if (pageType === GTM_CATEGORY.PLP) {
    return state.products.isLoadingAll
  } else if (
    pageType === GTM_CATEGORY.FIND_IN_STORE ||
    pageType === GTM_CATEGORY.STORE_LOCATOR ||
    pageType === GTM_CATEGORY.COLLECT_FROM_STORE
  ) {
    return state.storeLocator.loading
  } else if (
    pageType === GTM_CATEGORY.PDP ||
    pageType === GTM_CATEGORY.BUNDLE
  ) {
    // i need return if state.currentProduct is a empty object
    return Object.keys(state.currentProduct).length === 0
  } else if (pageType === GTM_CATEGORY.PRODUCT_QUICK_VIEW) {
    return (
      Object.keys(state.quickview.product).length === 0 ||
      state.quickview.productId !== state.quickview.product.productId
    )
  }
  // otherwise, use the loader overlay as a proxy to determine if the component is loading
  return state.loaderOverlay.visible
}

const isDisabled = (pageType, state) => {
  if (
    /%25|^\/$/.test(state.routing.location.pathname) &&
    pageType === GTM_CATEGORY.MR_CMS
  ) {
    return true
  } else if (
    pageType === GTM_CATEGORY.HOME &&
    !/%25|^\/$/.test(state.routing.location.pathname)
  ) {
    return true
  } else if (
    pageType === GTM_CATEGORY.STORE_LOCATOR &&
    /collect-from-store/.test(state.routing.location.pathname)
  ) {
    return true
  } else if (
    pageType === GTM_CATEGORY.PLP &&
    (state.products.products === null ||
      (state.products.products && state.products.products.length === 1))
  ) {
    return true
  } else if (
    pageType === GTM_CATEGORY.MR_CMS &&
    /product/.test(state.routing.location.pathname)
  ) {
    return true
  } else if (pageType === GTM_CATEGORY.WRITE_REVIEW) {
    // the page will be redirected if not logged in so this is to avoid triggering analytics twice
    return !isUserAuthenticated(state)
  }
  return false
}

const isPlpInfiniteLoop = /currentPage=/g
const shouldReset = (pageType, nextProps, props) => {
  // Default DON'T reset
  switch (pageType) {
    case GTM_CATEGORY.FIND_IN_STORE:
      // findInStore start on searchEvent
      if (nextProps.isLoading) {
        return true
      }
      break
    case GTM_CATEGORY.PLP:
      // PLP Exclude infinite scroll
      if (
        isPlpInfiniteLoop.test(props.Analyticslocation.search) ||
        isPlpInfiniteLoop.test(nextProps.Analyticslocation.search)
      ) {
        return false
      }
      break
    default:
      break
  }

  // When We change url, usually we reset the pageLoading
  return (
    props.Analyticslocation.pathname !== nextProps.Analyticslocation.pathname ||
    props.Analyticslocation.search !== nextProps.Analyticslocation.search
  )
}

const hasCachedCategory = (pageType, state) => {
  return (
    state.products.location != null &&
    state.products.location.pathname === state.routing.location.pathname &&
    state.products.location.query.q === state.routing.location.query.q &&
    state.products.location.query.category ===
      state.routing.location.query.category
  )
}

const calculatePercentageViewedPlp = (loadedProductsCount, totalProducts) => {
  if (
    loadedProductsCount <= 20 &&
    loadedProductsCount !== parseInt(totalProducts, 10)
  ) {
    return 20
  } else if (loadedProductsCount >= totalProducts || totalProducts === 0) {
    return 100
  }

  return 50
}

const getPercentageViewedPlp = (pageType, state) => {
  if (pageType === GTM_CATEGORY.PLP) {
    const totalProducts = parseInt(state.products.totalProducts, 10)
    const loadedProducts = state.products.products
    if (loadedProducts) {
      const loadedProductsCount = loadedProducts.length
      const percentageViewedPlp = calculatePercentageViewedPlp(
        loadedProductsCount,
        totalProducts
      )
      return {
        percentageViewedPlp,
        loadedProductsCount,
      }
    }
  }
}

const isInitialRender = (pageType, state) => {
  return (
    state.routing.visited.length === 1 &&
    pageType !== GTM_CATEGORY.PRODUCT_QUICK_VIEW
  )
}

export default (
  pageType,
  { isAsync = false, suppressPageTypeTracking = false } = {}
) => {
  return (Component) => {
    @connect(
      (state) => ({
        isLoading: isComponentLoading(pageType, state),
        isInitialRender: isInitialRender(pageType, state),
        isDisabled: isDisabled(pageType, state),
        hasCachedCategory: hasCachedCategory(pageType, state),
        percentageViewedPlp: getPercentageViewedPlp(pageType, state),
        user: state.account.user,
        Analyticslocation: state.routing.location,
        queryString: state.routing.location.search,
        modal: state.modal,
        isTrackingPageType: !suppressPageTypeTracking,
        productIsPreloaded: getCurrentProductIsPreloaded(state),
      }),
      {
        pageLoadedAction,
        setPageType,
        clearPageType,
      }
    )
    // TODO - move this class definition out of here, so only one is used
    class AnalyticsDecorator extends React.Component {
      static propTypes = {
        isLoading: PropTypes.bool,
        isInitialRender: PropTypes.bool.isRequired,
        pageLoadedAction: PropTypes.func,
        isDisabled: PropTypes.bool.isRequired,
        hasCachedCategory: PropTypes.bool,
        user: PropTypes.object,
        Analyticslocation: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
        queryString: PropTypes.string,
        modal: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
        setPageType: PropTypes.func,
        clearPageType: PropTypes.func,
      }

      static defaultProps = {
        isLoading: false,
        pageLoadedAction: noop,
        setPageType: noop,
        clearPageType: noop,
        queryString: '',
      }

      static WrappedComponent = Component

      constructor(props) {
        super(props)
        this.pageType = pageType
        this.isAsync = isAsync

        if (
          pageType === GTM_CATEGORY.DELIVERY_PAYMENT &&
          hasDeliveryAddress(this.props.user) &&
          hasCreditCard(this.props.user)
        ) {
          this.isAsync = true
        }
        if (
          pageType === GTM_CATEGORY.DELIVERY_DETAILS &&
          /(^\?|&)new-user(&|$)/.test(this.props.queryString)
        ) {
          this.isAsync = false
        }
        this.hasHandledOnLoad = false
        // if this is the initial render, use the Navigation Timing API to determine the 'start' time
        // TODO - x-broswer for window.performance
        this.startTime = this.props.isInitialRender
          ? path(['performance', 'timing', 'navigationStart'], window)
          : Date.now()

        this.currentMaxPercentageViewed = 0
        this.shouldResend = false
      }

      // LifeCycle
      componentDidMount() {
        if (this.props.isTrackingPageType) {
          this.props.setPageType(this.pageType)
        }

        switch (pageType) {
          case GTM_CATEGORY.FIND_IN_STORE:
            return
          case GTM_CATEGORY.PLP:
            // for scenario when PLP is cached (user goes to dresses, than goes to another pages except PLPs, then goes back to dresses)
            if (!this.props.isInitialRender && this.props.hasCachedCategory) {
              this.handleOnLoad()
              return
            }
            break
          case GTM_CATEGORY.PDP:
          case GTM_CATEGORY.BUNDLE:
            if (!this.props.productIsPreloaded) this.handleOnLoad()
            return
          case GTM_CATEGORY.PRODUCT_QUICK_VIEW:
            // A product quick view is via a popup so the isInitialRender is always true if you activate the popup
            // from a page that was the initial render. Additionally it is always async so we will just return here.
            return
          default:
            break
        }

        // if this component isn't async, or this is the initial render, then assume the component has already loaded
        if (!this.isAsync || this.props.isInitialRender) {
          this.handleOnLoad()
        }
      }

      // handle Quick view - edge case - because it is treated as a page, we need forse resend for plp when QV closed
      handleQuickview(pageType, props, nextProps) {
        if (pageType === GTM_CATEGORY.PLP) {
          // in plp, quick view is about to open
          if (
            props.modal.mode === 'plpQuickview' &&
            props.modal.open &&
            !nextProps.modal.open
          ) {
            // when QV is about to close we want to reset plp's timer
            // and force to resend pageView again, we are sure all dependencies are loaded
            this.shouldResend = true
            this.startTime = Date.now()
            this.hasHandledOnLoad = false
          }
        }
      }

      UNSAFE_componentWillReceiveProps(nextProps) {
        if (shouldReset(pageType, nextProps, this.props)) this.reset()

        this.handleQuickview(pageType, this.props, nextProps)
      }

      componentDidUpdate(prevProps) {
        // if state changes from loading to not loading, assume the component has loaded
        // sometimes (e.g. when shopping bag closes) we want to force resending for mounted and loaded component
        const productIsPreloadedChanged =
          prevProps.productIsPreloaded && !this.props.productIsPreloaded

        if (
          (prevProps.isLoading && !this.props.isLoading) ||
          this.shouldResend ||
          productIsPreloadedChanged
        ) {
          this.handleOnLoad()
          if (this.shouldResend) this.shouldResend = false
        }
      }

      componentWillUnmount() {
        if (this.props.isTrackingPageType) {
          this.props.clearPageType()
        }
      }

      setUpLoadChecking() {
        let count = 0
        this.loadingChecking = setInterval(() => {
          if (count === 4) {
            this.endLoadChecking()
          }
          count++
        }, 250)
      }

      endLoadChecking() {
        clearInterval(this.loadingChecking)
      }

      isSpecialCmsPage() {
        return contains(this.props.cmsPageName, [...espotsList, 'navSocial'])
      }

      handleOnLoad() {
        if (
          !this.hasHandledOnLoad &&
          !this.props.isDisabled &&
          !this.isSpecialCmsPage()
        ) {
          const loadTime = Date.now() - this.startTime
          // we do this to allow all sync actions within the render tree to be resolved first
          setTimeout(() => {
            this.props.pageLoadedAction(this.pageType, loadTime)
          }, 0)
          this.hasHandledOnLoad = true
          // start counting Percentage Viewed when page loaded
          if (!this.props.isDisabled && this.pageType !== GTM_CATEGORY.PLP) {
            this.setUpLoadChecking()
          }
        }
      }

      reset() {
        this.hasHandledOnLoad = false
        this.startTime = Date.now()
      }

      render() {
        const staticProps = omit(
          [
            'isLoading',
            'isInitialRender',
            'isDisabled',
            'Analyticslocation',
            'user',
            'hasCachedCategory',
            'queryString',
            'modal',
            'setPageType',
            'clearPageType',
            'isTrackingPageType',
          ],
          this.props
        )
        return <Component {...staticProps} />
      }
    }

    return AnalyticsDecorator
  }
}
