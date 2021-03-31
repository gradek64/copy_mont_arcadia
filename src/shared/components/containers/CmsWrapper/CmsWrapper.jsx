import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import { getContent } from '../../../actions/common/cmsActions'
import CmsPage from '../../common/CmsPage/CmsPage'
import Loader from '../../common/Loader/Loader'
import CmsNotAvailable from '../../common/CmsNotAvailable/CmsNotAvailable'
import CmsForm from '../../containers/CmsForm/CmsForm'
import TermsAndConditions from '../../containers/TermsAndConditions/TermsAndConditions'
import { getCanonicalHostname } from '../../../../shared/lib/canonicalisation'
import { fromSeoUrlToRedirectionUrl } from '../../../../shared/lib/navigation'
import { getTemplateComponent } from '../../../../custom/templateRoutes'
import {
  findCmsFeaturePagePrefixIn,
  isNotEspot,
} from '../../../../shared/lib/cmslib'

function isCmsFormPage(pageData) {
  return pageData && pageData[0] && pageData[0].formCss
}

@connect(
  (state) => ({
    cmsPages: state.cms.pages,
    baseUrl: state.routing.hostname,
    menuLinks: state.navigation.menuLinks,
    viewportHeight: state.viewport.height,
    visited: state.routing.visited,
    assets: state.config.assets,
  }),
  { getContent }
)
class CmsWrapper extends Component {
  static propTypes = {
    baseUrl: PropTypes.string,
    cmsPages: PropTypes.object,
    getContent: PropTypes.func,
    route: PropTypes.object,
    location: PropTypes.object,
    params: PropTypes.object,
    menuLinks: PropTypes.array,
    visited: PropTypes.array,
    mode: PropTypes.string,
    assets: PropTypes.object,
    isModal: PropTypes.bool,
    // The following is temporary and passed from Sandbox to delegate to CmsWrapper the rendering of the
    // "non standard" CMS pages thath Sandbox at the moment is not capable to render.
    dataAlreadyFetchedByMrCMS: PropTypes.bool,
  }

  componentDidMount() {
    const {
      getContent,
      route,
      params,
      location,
      params: { hygieneType, contentType },
      visited,
      isModal,
    } = this.props
    const clientSideRendered = visited.length > 1
    const cmsPageName = params.cmsPageName || route.cmsPageName

    if (clientSideRendered || isModal) {
      if (this.props.dataAlreadyFetchedByMrCMS) {
        // The props are passed from Sandbox in one of those cases where he is unable to handle a particular kind of page (at the moment
        // CmsForms, Custom - Campaign) and then the page data has already been retrieved from mrCMS.
        return
      }
      getContent({
        cmsPageName,
        pathname: location && location.pathname,
        hygieneType,
        contentType,
      })
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      getContent,
      route,
      params,
      location,
      params: { hygieneType },
    } = nextProps

    const pathname = location && location.pathname
    const currentLocationPathname =
      this.props.location && this.props.location.pathname
    const cmsPageName = params.cmsPageName || route.cmsPageName

    if (pathname !== currentLocationPathname) {
      getContent({ cmsPageName, pathname, hygieneType })
    }
  }

  getTemplateName = ({ template }) => template

  getCss = ({ css }) => {
    if (!css) return []

    const assets = this.props.assets

    return css.reduce((prev, url) => {
      const stylesheet = assets.css[url.replace('/assets/', '')]
      return stylesheet
        ? [...prev, { rel: 'stylesheet', href: stylesheet }]
        : prev
    }, [])
  }

  getJs = ({ js }) => {
    return js ? js.map((url) => ({ type: 'text/javascript', src: url })) : []
  }

  isTsAndCsLikeContent(pageData) {
    return typeof pageData === 'object' && pageData['1stlevel']
  }

  isCmsStandardContent(pageData) {
    return (
      pageData &&
      Array.isArray(pageData) &&
      pageData.length &&
      typeof pageData[0] === 'object'
    )
  }

  static needs = [getContent]

  render() {
    const {
      cmsPages,
      route,
      params,
      baseUrl,
      params: { hygieneType },
      location,
      menuLinks,
      mode,
    } = this.props
    const contentType = params.contentType || (route && route.contentType)

    let pageType
    const seoUrl = location && location.pathname
    const redirectionUrl = fromSeoUrlToRedirectionUrl(seoUrl, menuLinks)
    const featurePagePrefix = findCmsFeaturePagePrefixIn(
      decodeURIComponent(redirectionUrl)
    )
    if (featurePagePrefix) {
      const pageNameInRedirectionUrl = redirectionUrl.replace(
        featurePagePrefix,
        ''
      )
      // redirectionUrl = /size-guide/{pageName}
      pageType =
        redirectionUrl === pageNameInRedirectionUrl
          ? redirectionUrl.replace(encodeURIComponent(featurePagePrefix), '')
          : pageNameInRedirectionUrl
    } else {
      // <Route path="/about-us" cmsPageName="aboutUs" component={ CmsWrapper } />
      // or
      // <Route path="/**/**/category/help-information**/:hygieneType-**" component={ CmsWrapper }/>
      pageType = params.cmsPageName || route.cmsPageName || hygieneType
    }

    const pageContent = cmsPages[pageType]

    let component = isNotEspot(contentType) && <Loader />
    const pageData =
      pageContent && pageContent.pageData ? pageContent.pageData : false
    const pageSettings =
      pageContent && pageContent.settings ? pageContent.settings : {}

    if (pageContent && pageContent.error && isNotEspot(contentType)) {
      // If we display this component it means that we failed to get the CMS content for the intended
      // page and we failed to get the CMS content for the associated error.
      component = <CmsNotAvailable />
    } else if (
      this.isCmsStandardContent(pageData) ||
      this.isTsAndCsLikeContent(pageData)
    ) {
      let cmsPage

      if (this.isTsAndCsLikeContent(pageData)) {
        cmsPage = <TermsAndConditions tsAndCs={pageContent} />
      } else {
        cmsPage = isCmsFormPage(pageData) ? (
          <CmsForm formContent={pageData[0]} formName={pageType} />
        ) : (
          <CmsPage page={pageContent} />
        )
      }

      const canonicalHref =
        pageType === 'home'
          ? getCanonicalHostname(baseUrl)
          : getCanonicalHostname(baseUrl) + decodeURIComponent(redirectionUrl)

      const cmsWrapperClass = !isNotEspot(contentType)
        ? `CmsWrapper-espot${mode ? `--${mode}` : ''}`
        : `CmsWrapper${mode ? `-${mode}` : ''}`

      const cmsTemplate = pageSettings.template
        ? getTemplateComponent(pageSettings.template, { pageContent })
        : null
      if (cmsTemplate) cmsPage = cmsTemplate

      component = (
        <div className={`${cmsWrapperClass} ${pageSettings.template}`}>
          {isNotEspot(contentType) && (
            <Helmet
              title={pageContent.pageName}
              meta={[{ name: pageType, content: pageType }]}
              link={[
                { rel: 'canonical', href: canonicalHref },
                ...this.getCss(pageSettings),
              ]}
              script={[...this.getJs(pageSettings)]}
            />
          )}
          {cmsPage}
        </div>
      )
    }
    return component
  }
}

export default CmsWrapper
