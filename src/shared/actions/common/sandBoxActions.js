import { isEmpty, path, flatten } from 'ramda'
import { getCacheExpiration } from '../../lib/cacheable-urls'
import superagent from '../../lib/superagent'
import { get } from '../../lib/api-service'
import cmsUtilities from '../../lib/cms-utilities'
import {
  isFeatureHomePageSegmentationEnabled,
  isFeatureDeferCmsContentEnabled,
  isFeatureCategoryHeaderShowMoreDesktopEnabled,
} from '../../selectors/featureSelectors'
import { getViewportMedia, isMobile } from '../../selectors/viewportSelectors'
import { getProductsSearchResultsTotal } from '../../selectors/productSelectors'
import cmsConsts from '../../constants/cmsConsts'
import espots from '../../constants/espotsMobile'
import espotsDesktopConstants from '../../constants/espotsDesktop'

const isBrowser = !!process.browser
const prefix = isBrowser
  ? `${window.location.protocol}//${window.location.host}`
  : ':3000'

const isAnEspotError = (contentType, pageNameFromCMS) =>
  contentType === cmsConsts.ESPOT_CONTENT_TYPE &&
  pageNameFromCMS &&
  (pageNameFromCMS.toLowerCase().includes('error') ||
    pageNameFromCMS.includes('404'))

const mobileEspots = flatten(Object.values(espots)) || []

const isMobileEspot = (cmsPageName) => mobileEspots.includes(cmsPageName)

// e.g.:
// getContent({ pathname: '/en/tsuk/.../home' })
// getContent(null, 'home')
// getContent(null, espots.home[0], cmsConsts.ESPOT_CONTENT_TYPE)
//
// In case of error from mrCMS we try to call the getContent a second time to retrieve at least the error404 page to be able
// to show something to the User and not just an error message.
// In the just mentioned scenario the call to getContent is like:
//    getContent(null, 'error404', null, true, 'home')
// We pass as fourth argument the original page identifier so that we able to save it in the store in a way that is retrievable
// from the component. Hence in the store there will be sandbox>pages[home] containing the data of an error404 page.
export const getContent = (
  location,
  cmsPageName,
  contentType,
  secondCallToCMS,
  originalPage,
  { host = prefix } = {},
  forceMobile,
  lazyLoad
) => {
  let cleanLocation = location || {}
  const {
    query: { mobileCMSUrl, responsiveCMSUrl, formEmail } = {},
  } = cleanLocation

  if (responsiveCMSUrl) {
    cleanLocation = {
      pathname: responsiveCMSUrl,
    }
  }
  if (cleanLocation) {
    cleanLocation = cmsUtilities.sanitiseLocation(cleanLocation)
  }

  const pageKeyInStore = originalPage || cmsPageName || cleanLocation.pathname

  return (dispatch, getState) => {
    if (cmsPageName && !isMobile(getState()) && isMobileEspot(cmsPageName))
      return Promise.resolve()

    const {
      config: { storeCode, brandName, siteId },
      viewport: { media: viewportMedia },
    } = getState()

    /**
     * NOTE:  When making any changes that change a value in any of the properties
     *        below, it must be tested in both mobile & desktop viewports.
     *        The viewportMedia property changes the how montyCR interacts with WCS,
     *        results may vary.
     */
    let queryParams = {
      storeCode,
      brandName,
      mobileCMSUrl,
      formEmail,
      viewportMedia,
      siteId,
      forceMobile,
      location: cleanLocation,
      cmsPageName,
      lazyLoad,
    }

    if (cmsPageName === 'catHeader') {
      const catHeaderProps = {
        totalProducts: getProductsSearchResultsTotal(getState()),
        isMobile: isMobile(getState()),
        categoryHeaderShowMoreDesktopEnabled: isFeatureCategoryHeaderShowMoreDesktopEnabled(
          getState()
        ),
        truncateDescription: isMobile(getState()),
      }
      queryParams = {
        ...queryParams,
        catHeaderProps,
        cmsPageName: null,
      }
    }
    if (process.env.FUNCTIONAL_TESTS === 'true') {
      host = `localhost:${process.env.CORE_API_PORT}`
    }

    const updatedQueryParams = cmsUtilities.updateViewportMedia(queryParams)

    const request = superagent
      .get(`${host}/cmscontent`)
      .query(updatedQueryParams)

    if (!process.browser && request.cache) {
      request.cache(
        process.env.NODE_ENV !== 'production'
          ? false
          : getCacheExpiration('hapi', '/cmscontent')
      )
    }

    return request
      .then(({ body }) => {
        if (!body || isEmpty(body)) {
          throw new Error('Empty response body from mrCMS')
        }
        if (body.statusCode && !String(body.statusCode).startsWith('2')) {
          throw new Error('Unsuccessful response status code')
        }

        if (body.head && body.head.metaDescription) {
          body.head = {
            ...body.head,
            meta: [
              {
                name: 'description',
                content: body.head.metaDescription,
              },
            ],
          }
        }

        const pageNameFromCMS =
          body.props && body.props.data && body.props.data.pageName
        if (isAnEspotError(contentType, pageNameFromCMS)) {
          throw new Error('Error retrieving CMS content')
        }
        dispatch({
          type: 'SET_SANDBOX_CONTENT',
          key: pageKeyInStore,
          content: {
            ...body,
          },
        })
      })
      .catch((err) => {
        if (!secondCallToCMS && contentType !== cmsConsts.ESPOT_CONTENT_TYPE) {
          // Trying to display at least a 404 page to the User.
          return dispatch(
            getContent(
              null,
              'error404',
              null,
              true,
              cmsPageName || cleanLocation.pathname
            )
          )
        }

        dispatch({
          type: 'SET_SANDBOX_CONTENT',
          key: pageKeyInStore,
          content: err.message || err,
        })
      })
  }
}

export const getSegmentedContent = (
  wcsEndpoint,
  identifier,
  cmsPageName,
  lazyLoad
) => {
  const getResponsiveCMSUrl = path([
    identifier,
    'EspotContents',
    'cmsMobileContent',
    'responsiveCMSUrl',
  ])
  return (dispatch, getState) => {
    return get(wcsEndpoint).then(({ body }) => {
      return getContent(
        { pathname: encodeURIComponent(`/${getResponsiveCMSUrl(body)}`) },
        null,
        null,
        null,
        cmsPageName,
        {},
        null,
        lazyLoad
      )(dispatch, getState)
    })
  }
}

// TODO: remove this action and instead call getSegmentedContent directly
//  from Home component when FEATURE_HOME_PAGE_SEGMENTATION is no longer needed
//  - we need this action for now so that we can check the feature flag when
//  the Home component's `needs` are executed on SSR
export const getHomePageContent = () => {
  return (dispatch, getState) => {
    if (
      isFeatureHomePageSegmentationEnabled(getState()) &&
      getViewportMedia(getState()) !== 'mobile'
    ) {
      return getSegmentedContent(
        '/home',
        espotsDesktopConstants.home.mainBody,
        'home',
        isFeatureDeferCmsContentEnabled(getState())
      )(dispatch, getState)
    }
    return getContent(
      null,
      'home',
      cmsConsts.PAGE_CONTENT_TYPE,
      true,
      null,
      {},
      null,
      isFeatureDeferCmsContentEnabled(getState())
    )(dispatch, getState)
  }
}

export const removeContent = (key) => {
  return {
    type: 'REMOVE_SANDBOX_CONTENT',
    key,
  }
}

export const resetContent = () => {
  return {
    type: 'RESET_SANDBOX_CONTENT',
  }
}

export function showTacticalMessage() {
  return {
    type: 'SHOW_TACTICAL_MESSAGE',
  }
}

export function hideTacticalMessage() {
  return {
    type: 'HIDE_TACTICAL_MESSAGE',
  }
}
