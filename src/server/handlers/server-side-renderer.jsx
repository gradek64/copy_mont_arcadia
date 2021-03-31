import React from 'react'
import { omit, path, pathOr } from 'ramda'
import { renderToString } from 'react-dom/server'
import Helmet from 'react-helmet'
import { RouterContext, match as routerMatch } from 'react-router'
import { Provider as ReduxProvider } from 'react-redux'
import Boom from 'boom'
import {
  getSiteConfig,
  getBrandHostnames,
  getSiteConfigByPreferredISO,
  getFirstPreferredISO,
  getTrustArcDomain,
  getLangAndDomainsByBrandName,
  getBrandThirdPartySiteUrls,
} from '../config'
import { getFooterConfig } from '../config/footer_config'
import getVersion from './version-handler'
import fetchComponentData from '../../shared/lib/fetch-component-data'
import configureStore from '../../shared/lib/configure-store'
import getRoutes from '../../shared/getRoutes'
import * as actions from '../../shared/actions/common/authActions'
import { userAccount } from '../../shared/actions/common/accountActions'
import * as configActions from '../../shared/actions/common/configActions'
import { setFooterConfig } from '../../shared/actions/common/footerActions'
import { isDayLightSaving } from '../lib/date-time-utils'
import { updateShoppingBagBadgeCount } from '../../shared/actions/common/shoppingBagActions'
import {
  getLocaleDictionary,
  localise,
  getGeoIPDictionary,
} from '../../shared/lib/localisation'
import * as routingActions from '../../shared/actions/common/routingActions'
import * as localisationActions from '../../shared/actions/common/localisationActions'
import {
  allowDebug,
  setDebugInfo,
} from '../../shared/actions/components/debugActions'
import { setKlarnaClientToken } from '../../shared/actions/common/klarnaActions'
import { generateAssets } from '../lib/get-assets-util'
import { getPreloadScripts, getScripts } from '../lib/get-assets'
import { zeroAjaxCounter } from '../../shared/actions/components/LoaderOverlayActions'
import * as logger from '../lib/logger'
import * as montyNewrelic from '../lib/newrelic'
import { initFeatures } from '../../shared/actions/common/featuresActions'
import { preCacheReset } from '../../shared/actions/common/pageCacheActions'
import { selectView } from '../../shared/actions/common/productViewsActions'
import { updateMediaType } from '../../shared/actions/common/viewportActions'
import ContextProvider from '../../shared/lib/context-provider'
import { format as formatPrice } from '../../shared/lib/price'
import { getFeatures } from '../lib/features-service'
import urlp from 'url'
import {
  setJsessionid,
  setSessionJwt,
} from '../../shared/actions/common/sessionTokenActions'
import {
  getJsessionid,
  getSessionJwt,
} from '../../shared/selectors/sessionTokenSelectors'
import { setHostnameProperties } from '../../shared/actions/common/hostnameActions'
import { getJsessionidCookieOptions } from '../api/constants/jsessionid-cookie-opts'
import {
  isFeatureQubitHiddenEnabled,
  isFeatureBrandlockEnabled,
} from '../../shared/selectors/featureSelectors'
import {
  getRedirect,
  getLocation,
  getPageStatusCode,
} from '../../shared/selectors/routingSelectors'
import { PRODUCT, OUTFIT } from '../../shared/constants/productImageTypes'
import { getTraceIdFromCookie, getCookieValue } from '../../shared/lib/cookie'
import * as geoIPActions from '../../shared/actions/common/geoIPActions'
import {
  getRedirectURL,
  getUserISOPreference,
} from '../../shared/lib/geo-ip-utils'
import { toggleModal } from '../../shared/actions/common/modalActions'
import { generateNewSessionKey } from '../api/api'
import newrelic from 'newrelic'
import * as serverSideAnalytics from '../api/mapping/mappers/order/server_side_analytics'
import { isApps } from '../api/mapping/utils/headerUtils'
import { getBrandedEnvironmentVariable } from '../lib/env-utils'
import {
  getGoogleTagManagerQueryParams,
  getGoogleTagManagerId,
} from '../lib/google-utils'
import { BACKEND_JWT } from '../api/constants/cookies'

let generatedAssets
let criticalCssContents

const version = JSON.stringify(getVersion())
const buildInfo = JSON.parse(version)

function getGeneratedAssets() {
  if (!generatedAssets) generatedAssets = generateAssets()
  return generatedAssets
}

function isQubitEnabled(state) {
  return !(
    isFeatureQubitHiddenEnabled(state) || process.env.QUBIT_DISABLED === 'true'
  )
}

function getSmartServeId(smartServeConfig = {}) {
  const env = process.env.QUBIT_ENVIRONMENT === 'stage' ? 'stage' : 'prod'
  return pathOr(false, [env], smartServeConfig)
}

function setTransactionName(renderProps) {
  const transactionName = pathOr(
    null,
    ['routes', 1, 'transactionName'],
    renderProps
  )
  if (transactionName) {
    newrelic.setTransactionName(transactionName)
  }
}

function shouldUseNewHandler() {
  return typeof process.env.USE_NEW_HANDLER === 'string'
    ? process.env.USE_NEW_HANDLER === 'true'
    : Boolean(process.env.USE_NEW_HANDLER)
}

function getAuthCookieValue(req) {
  const authCookie = path(['state', 'authenticated'], req)

  return Array.isArray(authCookie) ? authCookie[0] : authCookie
}

function getAuthenticatedState(req) {
  const authCookieValue = getAuthCookieValue(req)

  return authCookieValue === 'yes' ? 'full' : authCookieValue
}

function isAuthenticated(req) {
  if (shouldUseNewHandler()) {
    const authCookieValue = getAuthCookieValue(req)

    return authCookieValue === 'yes' || authCookieValue === 'partial'
  }
  return !!path(['jwtPayload', 'exists'], req)
}

function getEnvironment() {
  return shouldUseNewHandler()
    ? process.env.WCS_ENVIRONMENT
    : urlp.parse(process.env.API_URL).host.split('.')[0]
}

function getUserAgent(req) {
  return path(['headers', 'user-agent'], req)
}

function getSessionJwtFromReq(req) {
  const currentSessionJwt = path(['state', BACKEND_JWT], req)
  if (currentSessionJwt) {
    logger.info('server-side-render', {
      loggerMessage: `Setting ${BACKEND_JWT} from Cookie`,
      [BACKEND_JWT]: currentSessionJwt,
    })
    return currentSessionJwt
  }
  return ''
}

function getJsessionIdFromReq(req) {
  const currentJsessionId = path(['state', 'jsessionid'], req)
  if (currentJsessionId) {
    logger.info('server-side-render', {
      loggerMessage: 'Setting jsessionId from Cookie',
      jsessionid: currentJsessionId,
    })
    return currentJsessionId
  }

  const sessionKey = generateNewSessionKey({
    userAgentCallingSsr: getUserAgent(req),
  })
  montyNewrelic.addCustomAttribute('sessionKey', sessionKey)

  return sessionKey
}

function getDeviceType(req) {
  return pathOr('desktop', ['headers', 'monty-client-device-type'], req)
}

function getIsDebugEnabled(req) {
  return (
    path(['state', 'montydebug'], req) ||
    path(['url', 'query', 'montydebug'], req) !== undefined
  )
}

function getGeoIPState(headers, cookie, siteConfig) {
  const geoISO = path(['x-user-geo'], headers)
  const storedGeoPreference = getCookieValue(cookie, 'GEOIP')
  const userISOPreference = getUserISOPreference(geoISO, storedGeoPreference)
  const userGeoConfig = getSiteConfigByPreferredISO(
    userISOPreference,
    siteConfig.brandCode
  )
  return {
    geoISO,
    storedGeoPreference,
    userISOPreference,
    userRegionPreference: userGeoConfig.region,
    userLanguagePreference: userGeoConfig.language,
  }
}

function respondWithError(reply, error) {
  if (process.env.NODE_ENV !== 'production') {
    logger.error('server-side-renderer', {
      loggerMessage:
        error instanceof Error ? error.stack || error.message : error,
    })
  }

  // Some code may return an error to map to a boom error
  // This is to avoid importing boom in shared code and having it end up in the js bundle
  const boomErr = path(['error', 'boom'], error)
  if (boomErr) {
    error = Boom[boomErr]()
  }

  // Akamai will return the site down error page to the user when Monty returns a 500 Internal Server Error
  return reply(error)
}

function setupStore(options) {
  const {
    authenticated,
    authenticatedState,
    bagCount,
    siteConfig,
    bvToken,
    deviceType,
    environment,
    features,
    featuresOverride,
    footerConfig,
    geoIPDictionary,
    geoIPState,
    hostname,
    hostnames,
    hrefLanguages,
    isDebugEnabled,
    jsessionid,
    sessionJwt,
    jwtPayload,
    klarnaClientToken,
    localeDictionary,
    productIsActive,
    token,
    traceId,
    thirdPartySiteUrls,
    url,
    setCookies,
    setRedirect,
    originalUserAgent,
  } = options

  const store = configureStore(
    {
      auth: {
        authentication: false,
        // token set here to use it when fetching component needs, not needed on the client
        token,
      },
    },
    {
      traceId,
      xUserGeo: geoIPState.geoISO,
      setCookies,
      setRedirect,
      originalUserAgent,
    }
  )

  const googleTagManagerId = getGoogleTagManagerId(siteConfig)
  store.dispatch(
    configActions.setConfig({
      ...siteConfig,
      hrefLanguages,
      googleTagManagerId,
    })
  )
  store.dispatch(setHostnameProperties(hostname))
  store.dispatch(setFooterConfig(footerConfig))
  store.dispatch(
    localisationActions.setLocaleDictionary(localeDictionary, geoIPDictionary)
  )
  store.dispatch(configActions.setBrandHostnames(hostnames))
  store.dispatch(configActions.setThirdPartySiteUrls(thirdPartySiteUrls))
  store.dispatch(configActions.isDayLightSavingTime(isDayLightSaving()))

  if (isDebugEnabled) {
    store.dispatch(allowDebug())
  }

  store.dispatch(setDebugInfo({ environment, buildInfo }))

  if (klarnaClientToken) {
    store.dispatch(setKlarnaClientToken(klarnaClientToken))
  }

  store.dispatch(setJsessionid(jsessionid))
  store.dispatch(setSessionJwt(sessionJwt))
  store.dispatch(initFeatures([...features], featuresOverride))
  store.dispatch(
    geoIPActions.setGeoIPRequestData({
      hostname,
      ...geoIPState,
    })
  )

  if (bagCount) {
    store.dispatch(updateShoppingBagBadgeCount(parseInt(bagCount, 10)))
  }

  if (productIsActive !== undefined) {
    store.dispatch(selectView(productIsActive === 'true' ? PRODUCT : OUTFIT))
  }

  store.dispatch(configActions.setAssets(getGeneratedAssets()))
  store.dispatch(configActions.setEnvCookieMessage(process.env.COOKIE_MESSAGE))
  store.dispatch(routingActions.updateLocationServer(url, hostname))
  store.dispatch(updateMediaType(deviceType))

  if (authenticated) {
    store.dispatch(actions.authLogin(bvToken))
    store.dispatch(actions.setAuthentication(authenticatedState))
  }

  // Testing for isPwdReset is part of the forgotten password flow, getting email info from cookie
  if (authenticatedState === 'full' || path(['isPwdReset'], jwtPayload)) {
    store.dispatch(
      userAccount(omit(['arcadia-session-key', 'iat'], jwtPayload))
    )
  }

  // Without explicitly checking and calling this here we get a fairly substantial
  // delay in the rendering of the GeoIP Modal and the background Content Overlay
  if (getRedirectURL(store.getState())) {
    store.dispatch(toggleModal())
  }

  return store
}

function getImageServerUrl(brandName, hostname) {
  const tldRegex = new RegExp(`${brandName}(.*)$`)
  const tldMatch = hostname.match(tldRegex)
  const tld = tldMatch && tldMatch[1]

  return tld && `${brandName}${tld}`
}

function reactElementToObj(reactEl) {
  if (Array.isArray(reactEl)) {
    return reactEl.map((el) => el.props)
  }

  throw new Error('Non-array not supported.')
}

function renderView(renderProps, options) {
  const {
    siteConfig: {
      brandName,
      googleTagManager,
      lang = 'en',
      logoVersion,
      qubit: { smartserveIds },
      region,
      storeCode,
      brandlockId,
    },
    hostname,
    isRedAnt,
    localisation: { l, p },
    store,
    chunks,
  } = options

  const App = renderToString(
    <ContextProvider localise={l} formatPrice={p}>
      <ReduxProvider store={store}>
        <RouterContext {...renderProps} />
      </ReduxProvider>
    </ContextProvider>
  )

  const initialState = JSON.stringify(store.getState()).replace(
    /<(\/?)script>/g,
    '&lt;$1script>'
  ) // #MON-1938

  const woosmapKey = process.env.WOOSMAP_API_KEY
  const { title, meta, link, script = {}, noscript } = Helmet.rewind()

  let mcrScript = []
  if (script.toComponent) {
    mcrScript = reactElementToObj(script.toComponent())
  }

  const googleMapsKey = getBrandedEnvironmentVariable({
    variable: 'GOOGLE_API_KEY',
    brandName,
  })
  const googleTagManagerId = getGoogleTagManagerId(options.siteConfig)
  const googleTagManagerQueryParams = getGoogleTagManagerQueryParams(
    googleTagManager,
    hostname
  )

  const qubitEnabled = isQubitEnabled(store.getState())
  const storeFeatures = store.getState().features
  const scripts = getScripts({
    googleMapsKey,
    region,
    woosmapKey,
    lang,
    features: storeFeatures,
    smartServeId: qubitEnabled ? getSmartServeId(smartserveIds) : undefined,
    brandName,
    trustArcDomain: getTrustArcDomain(storeCode),
    mcrScript,
    chunks,
  })

  const preloadScripts = getPreloadScripts(chunks)
  const criticalCss = path([brandName], criticalCssContents)
  const isBrandlockEnabled = isFeatureBrandlockEnabled(store.getState())
  const FEATURE_GOOGLE_TAG_MANAGER_DISABLED = storeFeatures.status.FEATURE_GOOGLE_TAG_MANAGER_DISABLED
  return {
    criticalCss,
    html: App,
    nreum: montyNewrelic.getBrowserScript(),
    initialState,
    preloadScripts,
    scripts,
    noscript,
    brandName,
    lang,
    googleTagManagerId,
    googleTagManagerQueryParams,
    logoVersion,
    title: title.toString(),
    meta: meta.toString(),
    link: link.toString(),
    version,
    webpackManifest: JSON.stringify(getGeneratedAssets()),
    isRedAnt,
    iePolyFill: generatedAssets.js['common/polyfill-ie11.js'],
    imageUrl: getImageServerUrl(brandName, hostname),
    woosmapKey,
    googleMapsKey,
    brandlockId: isBrandlockEnabled && brandlockId,
    isLocalDev: process.env.NODE_ENV !== 'production',
    FEATURE_GTM_DISABLED: FEATURE_GOOGLE_TAG_MANAGER_DISABLED,
  }
}

function matchRoute(options) {
  const {
    store,
    localisation: { l },
    location,
  } = options

  return new Promise((resolve, reject) => {
    routerMatch(
      { routes: getRoutes(store, { l }), location },
      (error, redirectLocation, renderProps) => {
        setTransactionName(renderProps)

        if (error) {
          reject(error)
        } else {
          resolve({
            renderProps,
            redirectLocation,
          })
        }
      }
    )
  })
}

function throwRedirectError(montyRedirect) {
  const error = Object.assign(new Error('Redirect'), {
    montyRedirect,
  })

  throw error
}

async function fetchData(renderProps, location, store) {
  const innerRoute = pathOr({}, ['routes', 1], renderProps)
  const cmsPageName = pathOr(
    innerRoute.cmsPageName,
    ['params', 'cmsPageName'],
    renderProps
  )
  const isCmsPage = innerRoute.contentType === 'page'

  if (innerRoute.cacheable) {
    store.dispatch(preCacheReset())
  }
  await fetchComponentData(store.dispatch, renderProps.components, {
    ...renderProps.params,
    ...location,
    // In case of request to the server for the route='/' then the following object
    // will contain the property "cmsPageName" that needs to be passed to the action
    // responsible for the cms content fetching.
    cmsPageName,
    isCmsPage,
  })

  const state = store.getState()
  const redirect = getRedirect(state)

  if (redirect) {
    throwRedirectError(redirect)
  }

  const jsessionidValue = getJsessionid(state)
  const sessionJwtValue = getSessionJwt(state)
  // Removing the jsessionid and sessiontJwt value from the state so that we avoid passing it to the Client in __INITIAL_STATE__
  // inside the source of the page which could be cached by AKAMAI and served to other
  // Users.
  store.dispatch(setJsessionid())
  store.dispatch(setSessionJwt())
  store.dispatch(zeroAjaxCounter())

  return {
    jsessionidValue,
    sessionJwtValue,
  }
}

function extractParameters(req) {
  const {
    headers,
    info: { hostname },
    jwtPayload,
    state: {
      bagCount,
      bvToken,
      featuresOverride,
      klarnaSessionId,
      klarnaClientToken,
      productIsActive,
      token,
    },
    url,
    url: { pathname },
  } = req

  const siteConfig = getSiteConfig(hostname)
  const cookie = path(['cookie'], headers)

  const { brandName, language, region } = siteConfig
  const features = getFeatures(siteConfig)
  const geoIPState = getGeoIPState(headers, cookie, siteConfig)
  const geoIPDictionary = getGeoIPDictionary(
    siteConfig,
    geoIPState.userLanguagePreference
  )

  return {
    authenticated: isAuthenticated(req),
    authenticatedState: getAuthenticatedState(req),
    bagCount,
    siteConfig,
    bvToken,
    cookie,
    deviceType: getDeviceType(req),
    environment: getEnvironment(),
    features,
    featuresOverride,
    footerConfig: getFooterConfig(brandName, region),
    geoIPDictionary,
    geoIPState,
    hostname,
    hostnames: getBrandHostnames(brandName, hostname),
    hrefLanguages: getLangAndDomainsByBrandName(brandName),
    isDebugEnabled: getIsDebugEnabled(req),
    isRedAnt: !!path(['ar-app-bundleid'], headers),
    jsessionid: getJsessionIdFromReq(req),
    sessionJwt: getSessionJwtFromReq(req),
    jwtPayload,
    klarnaClientToken,
    klarnaSessionId,
    localeDictionary: getLocaleDictionary(language, brandName),
    pathname,
    productIsActive,
    sessionKey: path(['jwtPayload', 'arcadia-session-key'], req),
    token,
    traceId: getTraceIdFromCookie(cookie) || path(['x-trace-id'], headers),
    url,
    thirdPartySiteUrls: getBrandThirdPartySiteUrls(brandName),
    originalUserAgent: getUserAgent(req),
  }
}

export const getAsyncChunks = (components) => {
  const assets = getGeneratedAssets()
  return components.reduce((asyncChunks, c) => {
    if (!c.webpackChunkName) return asyncChunks
    const chunkName = `common/${c.webpackChunkName}.js`
    if (!assets.js[chunkName]) return asyncChunks
    return asyncChunks.concat(assets.js[chunkName])
  }, [])
}

/**
 * Renders an SPA route and sends it to the client, along with the Redux
 * store state necessary to (re)render the route client-side.
 *
 * @param  {Object} req                                       Incoming request
 * @param  {Object} reply                                     Hapi reply toolkit
 * @param  {[Object]} sequenceHelpers                         Overrideable helpers invoked at specific points in the rendering sequence
 * @param  {[Function]} sequenceHelpers.postStorePopulation   Helper invoked immediately after Redux store setup: (req, store) => {}
 * @return {Promise}
 */
export async function serverSideRenderer(
  req,
  reply,
  sequenceHelpers = {
    postStorePopulation: () => {},
  }
) {
  let redirect = null

  const getRedirect = () => redirect
  const setRedirect = (location, statusCode) => {
    if (redirect) {
      throw new Error(
        'Attempts to set redirect location multiple times are not allowed'
      )
    }

    redirect = {
      location,
      permanent: statusCode === 301,
      rewritable: statusCode === 302,
    }
  }

  try {
    const parameters = extractParameters(req)
    const {
      authenticatedState,
      siteConfig = {},
      storedGeoPreference,
      deviceType,
      jwtPayload,
      pathname,
      sessionKey,
      originalUserAgent,
    } = parameters
    const { brandName, currencyCode, language } = siteConfig

    logger.info('server-side-render', {
      hasToken: !!jwtPayload,
      authenticatedState,
      sessionKey,
    })

    const store = setupStore({
      ...parameters,
      setCookies: (cookies) => {
        cookies.forEach((cookieValues) => {
          reply.state(...cookieValues)
        })
      },
      setRedirect,
    })

    sequenceHelpers.postStorePopulation(req, store)

    if (!storedGeoPreference) {
      reply.state('GEOIP', getFirstPreferredISO(siteConfig), {
        path: '/',
      })
    }

    const location = getLocation(store.getState())
    const localisation = {
      l: localise.bind(null, language, brandName),
      p: formatPrice.bind(null, currencyCode),
    }

    const { renderProps, redirectLocation } = await matchRoute({
      store,
      localisation,
      location,
    })

    /*
     * We need to have the redirect condition before getting the AsyncChunk to  be render
     * in the case of a necessary redirect no components needs to be render
     */

    if (redirectLocation) {
      return reply.redirect(redirectLocation.pathname)
    }

    const chunks = getAsyncChunks(renderProps.components)

    const { jsessionidValue, sessionJwtValue } = await fetchData(
      renderProps,
      location,
      store
    )

    if (getRedirect()) {
      throwRedirectError({
        url: redirect.location,
        rewritable: redirect.rewritable,
        permanent: redirect.permanent,
      })
    }

    const viewData = renderView(renderProps, {
      ...parameters,
      localisation,
      store,
      chunks,
    })

    const pageStatusCode = getPageStatusCode(store.getState())

    if (!isApps(req.headers) && pathname.includes('/order-complete')) {
      serverSideAnalytics.logSsrOrderComplete({
        completedOrder: path(['checkout', 'orderCompleted'], store.getState()),
        analyticsId: path(['query', 'ga'], req),
        headerBrandCode: path(['siteConfig', 'brandCode'], parameters),
        analyticsHost: parameters.hostname,
      })
    }

    const secureCookieOptions = getJsessionidCookieOptions(originalUserAgent)

    if (sessionJwtValue) {
      reply.state(BACKEND_JWT, sessionJwtValue, secureCookieOptions)
    }

    reply
      .view('index', viewData)
      .state('jsessionid', jsessionidValue, secureCookieOptions)
      .state('deviceType', deviceType, { path: '/' })
      .code(pageStatusCode || 200)
  } catch (error) {
    if (error.montyRedirect) {
      const { url, permanent, rewritable = false } = error.montyRedirect
      const response = reply.redirect(url)
      return permanent
        ? response.permanent(true)
        : response.rewritable(rewritable)
    }

    return respondWithError(reply, error)
  }
}

/**
 * Renders a Handlebars template and sends it to the client.
 *
 * Error handling:
 *    If supplied, a failure template and context builder offers customisable error handling
 *    Otherwise, replies with the error as-is
 *
 * @param  {String} options.template                  Template name
 * @param  {Function} options.buildContext            Builds the context necessary to populate the template
 * @param  {[Number]} options.successCode             HTTP response code for success, defaults to 200
 * @param  {[String]} options.failureTemplate         Failure template name
 * @param  {[Function]} options.failureBuildContext   Builds the context necessary to populate the failure template
 * @param  {[Number]} options.failureCode             HTTP response code for failure, defaults to 500
 * @param  {Object} options.request                   Incoming request
 * @param  {Object} options.reply                     Hapi reply toolkit
 * @return {Promise}
 */
export async function serverSideRendererLite({
  template,
  buildContext,
  successCode = 200,
  failureTemplate,
  failureBuildContext,
  failureCode = 500,
  request,
  reply,
}) {
  const userAgent = getUserAgent(request)
  const jsessionIdCookieOptions = getJsessionidCookieOptions(userAgent)

  try {
    const context = await buildContext(request)

    return reply
      .view(template, context)
      .state('jsessionid', request.state.jsessionid, jsessionIdCookieOptions)
      .state('deviceType', getDeviceType(request), { path: '/' })
      .code(successCode)
  } catch (error) {
    // logger.error() creates an event in addition to the existing transaction.
    // To avoid artificially doubling the reported error levels the existing
    // transaction has the extra detail added to it instead of calling
    // logger.error().
    newrelic.addCustomAttribute(
      'errorDetails',
      error instanceof Error ? error.stack || error.message : error
    )

    if (failureTemplate && failureBuildContext) {
      const failureContext = await failureBuildContext(request, error)

      return reply
        .view(failureTemplate, failureContext)
        .state('jsessionid', request.state.jsessionid, jsessionIdCookieOptions)
        .code(failureCode)
    }

    return reply(error).code(failureCode)
  }
}

export function setCriticalCssFiles(files) {
  criticalCssContents = files
}

export function getCriticalCssFiles() {
  return criticalCssContents
}
