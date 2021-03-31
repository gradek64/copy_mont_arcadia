import { get } from '../../lib/api-service'
import { fromSeoUrlToRedirectionUrl } from '../../../shared/lib/navigation'
import { findCmsFeaturePagePrefixIn } from '../../../shared/lib/cmslib'
import { localise } from '../../lib/localisation'
import cmsConsts from '../../constants/cmsConsts'
import { setPageStatusCode } from './routingActions'

export function setContent(pageName, content) {
  return {
    type: 'SET_CONTENT',
    pageName,
    content,
  }
}

export function setFormDefaultSchema(fields) {
  return {
    type: 'SET_CMS_FORM_DEFAULT_SCHEMA',
    fields,
  }
}

function setForm(formName, content) {
  return {
    type: 'SET_FORM',
    formName,
    content,
  }
}

function isCmsFormPage(content) {
  return (
    content &&
    content.pageData &&
    content.pageData[0] &&
    content.pageData[0].formCss
  )
}

function isCmsPage(content) {
  return content && content.pageData
}

function getAndHandleCmsContent(
  dispatch,
  pageName,
  url,
  handleError,
  contentType
) {
  return dispatch(get(url, handleError))
    .then(({ body }) => {
      if (['error404'].includes(pageName)) {
        dispatch(setPageStatusCode(404))
      }
      if (isCmsPage(body) || isCmsFormPage(body)) {
        // Got the CMS page content for the desired page
        // TODO API is currently sending back status code 200 for page not found errors.
        // Ideally it should send back a 404 status code for page not found errors so we can handle the error correctly.
        // We can then remove the following .includes() checks.
        if (
          contentType === cmsConsts.ESPOT_CONTENT_TYPE &&
          (body.pageName.toLowerCase().includes('error') ||
            body.pageName.includes('404'))
        ) {
          throw new Error('Error retrieving CMS content')
        } else {
          if (isCmsFormPage(body)) {
            dispatch(setFormDefaultSchema(body.pageData[0].fieldSchema))
          }
          dispatch(setContent(pageName, body))
        }
      } else {
        // Something went wrong getting the CMS page content
        if (
          body &&
          body.success === false &&
          body.message.includes('CMS page not supported on mobile')
        ) {
          return dispatch(get('/cms/pages/notSupported'))
        }
        return dispatch(get('/cms/pages/error404'))
      }
    })
    .then((errorCMSContent) => {
      const body = errorCMSContent ? errorCMSContent.body : null
      if (body) {
        // Error page content handling
        if (body.pageData) {
          return dispatch(setContent(pageName, body))
        }
        // We were not even able to get CMS error content.
        return dispatch(
          setContent(pageName, { error: 'No CMS content available' })
        )
      }
    })
}

//
// If the route resolved is like this:
//      <Route path="/**/**/category/help-information**/:hygieneType-**" component={ CmsWrapper }/>
// then:
//      args = {
//        pathname: '/en/tsuk/category/help-information-4912595/e-receipts-4912436',
//        ...
//        hygieneType: 'e-receipts',
//        cmsPageName: undefined }
//
// If the route resolved is like this:
//      <Route path="/about-us" cmsPageName="aboutUs" component={ CmsWrapper } />
// then:
//      args = {
//        pathname: '/about-us',
//        ...
//        cmsPageName: 'aboutUs' }
//
export function getContent({
  cmsPageName,
  hygieneType,
  pathname,
  contentType,
  handleError,
  isCmsPage,
}) {
  // Default to ignoring errors for Espots - any explicitly set 'handleError' come first
  const shouldHandleError =
    typeof handleError !== 'undefined'
      ? handleError
      : contentType !== cmsConsts.ESPOT_CONTENT_TYPE

  return (dispatch, getState) => {
    let getCMS
    const menuLinks = getState().navigation.menuLinks
    const { language, brandName } = getState().config
    const l = localise.bind(null, language, brandName)
    const redirectionUrl = fromSeoUrlToRedirectionUrl(pathname, menuLinks)
    const featurePagePrefix = findCmsFeaturePagePrefixIn(
      decodeURIComponent(redirectionUrl)
    )

    if (pathname && pathname.endsWith(l`/home`)) {
      //
      // Scenario happening when the CMS resource has to be accessible from outside the navigation and
      // hence we don't have seoUrl/redirectionUrl like from the navigation but just the pathname.
      // An example is given when we try to access the Gift Card page by setting the browser URL to
      // http://localhost:8080/en/tsuk/category/topshop-gift-card-247/home?TS=1466070708078
      //
      // In the case above cmsPageName=topshop-gift-card
      //
      getCMS = getAndHandleCmsContent(
        dispatch,
        cmsPageName,
        `/cms/page/url?url=${pathname}`,
        shouldHandleError
      )
    } else if (cmsPageName) {
      //
      // In this case the route that has been hit is one of those managed by us, e.g. "/", "/about-us"
      //
      getCMS = getAndHandleCmsContent(
        dispatch,
        cmsPageName,
        `/cms/pages/${cmsPageName}`,
        shouldHandleError,
        contentType
      )
    } else if (featurePagePrefix) {
      //
      // redirectionUrl=/content/pageName and we will be get the CMS content through /cms/pages/pageName
      //

      // /size-guide/Generic, /size-guide/abc, /content/def, ...
      const pageName = redirectionUrl.replace(
        encodeURIComponent(featurePagePrefix),
        ''
      )
      getCMS = getAndHandleCmsContent(
        dispatch,
        pageName,
        `/cms/pages/${pageName}`,
        shouldHandleError
      )
    } else {
      // redirection Url=/en/tsuk/... and we will get the CMS content through /cms/page/url?url=redirectionUrl

      getCMS = getAndHandleCmsContent(
        dispatch,
        hygieneType,
        `/cms/page/url?url=${redirectionUrl}`,
        shouldHandleError
      )
    }

    return getCMS.catch((error) => {
      if (
        isCmsPage &&
        error.response &&
        error.response.statusCode === 404 &&
        cmsPageName !== 'error404'
      ) {
        dispatch(setPageStatusCode(404))
        return getAndHandleCmsContent(
          dispatch,
          'error404',
          '/cms/pages/error404',
          true
        )
      }
      dispatch(
        setContent(cmsPageName, {
          error: error.message,
          statusCode: error.response && error.response.statusCode,
        })
      )
    })
  }
}

export function clearHygienePageInStore() {
  return {
    type: 'CLEAR_HYGIENE_PAGE_CONTENT',
  }
}

export function getCmsForm({ cmsFormName }) {
  return (dispatch) => {
    return dispatch(get(`/cms/forms/${cmsFormName}`))
      .then(({ body }) => {
        dispatch(setFormDefaultSchema(body.fieldSchema))
        dispatch(setForm(body.formName, body))
      })
      .catch((error) => {
        dispatch(setContent('form', { error: error.message }))
      })
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
