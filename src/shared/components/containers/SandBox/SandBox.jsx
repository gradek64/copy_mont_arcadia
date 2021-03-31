import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { connect } from 'react-redux'
import { omit, path, isEmpty } from 'ramda'
import QubitReact from 'qubit-react/wrapper'
import Loader from '../../common/Loader/Loader'
import CmsWrapper from '../../containers/CmsWrapper/CmsWrapper'
import CmsNotAvailable from '../../common/CmsNotAvailable/CmsNotAvailable'
import * as sandBoxActions from '../../../actions/common/sandBoxActions'
import {
  setContent,
  setFormDefaultSchema,
} from '../../../actions/common/cmsActions'
import cmsUtilities from '../../../lib/cms-utilities'
import { parseCmsForm } from './tempUtils'
import {
  deferStyles,
  activateDeferredStyles,
  activateDeferredStylesCallback,
} from '../../../lib/asset-utils'
import cmsConsts from '../../../constants/cmsConsts'
import { setPageStatusCode } from '../../../actions/common/routingActions'
import { nrBrowserLogError } from '../../../../client/lib/logger'

const isCmsForm = (pageData) => pageData && pageData[0] && pageData[0].formCss

const isErrorPage = (pageTitle) =>
  pageTitle &&
  (pageTitle.includes('404') ||
    pageTitle.includes('error') ||
    pageTitle.includes('Page not found'))

@connect(
  (state, ownProps) => ({
    visited: state.routing.visited,
    pages: state.sandbox.pages,
    isMobile: state.viewport.media === 'mobile',
    useMontyCmsForForms: state.features.status.FEATURE_USE_MONTY_CMS_FOR_FORMS,
    /**
     * There have been issues in how the server vs client handle pathnames, i.e. encoded/decoded
     * To make sure that we only need to handle one type, all links will be used in their encoded form
     */
    ...(ownProps.location && {
      location: {
        ...ownProps.location,
        ...cmsUtilities.sanitiseLocation(ownProps.location),
      },
    }),
  }),
  {
    ...sandBoxActions,
    setContent,
    setFormDefaultSchema,
    setPageStatusCode,
  }
)
class SandBox extends Component {
  static propTypes = {
    isInPageContent: PropTypes.bool, // this represents when the component is not the main content of the page
    getContent: PropTypes.func.isRequired,
    getSegmentedContent: PropTypes.func.isRequired,
    removeContent: PropTypes.func,
    location: PropTypes.object,
    visited: PropTypes.array,
    setContent: PropTypes.func,
    setFormDefaultSchema: PropTypes.func,
    shouldGetContentOnFirstLoad: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool,
    forceMobile: PropTypes.bool,
    isResponsiveCatHeader: PropTypes.bool,
    isFinalResponsiveEspotSolution: PropTypes.bool,
    qubitid: PropTypes.string,
    onContentLoaded: PropTypes.func,
    sandBoxClassName: PropTypes.string,
    cmsPageName: PropTypes.string,
    /**
     * We are forcing the use of the contentType constants to avoid that type of
     * problem in a future => https://arcadiagroup.atlassian.net/browse/DES-4691
     */
    contentType: PropTypes.string.isRequired,
    /**
     * if component receives `segmentationRequestData` it will fetch a responsiveCmsUrl
     * from wcs corresponding to segmented content, which will then be fetched and
     * rendered via MCR - see `getSegmentedContent` action
     */
    segmentationRequestData: PropTypes.shape({
      wcsEndpoint: PropTypes.string,
      responseIdentifier: PropTypes.string,
    }),

    lazyLoad: PropTypes.bool,
  }

  static defaultProps = {
    shouldGetContentOnFirstLoad: false,
    location: {},
    forceMobile: false,
    isResponsiveCatHeader: false,
    isFinalResponsiveEspotSolution: false,
    qubitid: null,
    sandBoxClassName: '',
    cmsPageName: null,
    segmentationRequestData: null,
    lazyLoad: false,
  }

  state = {
    hasError: false,
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    nrBrowserLogError(errorInfo, error)
  }

  componentWillMount() {
    const page = this.getPage(this.props)
    const pageData = path(['props', 'data', 'pageData'], page)

    if (!this.props.useMontyCmsForForms && isCmsForm(pageData)) {
      const data = {
        ...page.props.data,
        pageData: [parseCmsForm(page.props.data.pageData[0])],
      }

      this.props.setContent(page.props.location.pathname, data)
      this.props.setFormDefaultSchema(
        data.pageData[0] && data.pageData[0].fieldSchema
      )
    }
  }

  componentDidMount() {
    const { visited, shouldGetContentOnFirstLoad } = this.props

    if (visited.length > 1 || shouldGetContentOnFirstLoad) {
      this.getCmsContent({
        ...this.props,
        cmsPageName: this.getCmsPageName(),
      })
    }
    const content = this.getPage(this.props)
    if (content) this.setWindowProps(content.props)
    cmsUtilities.mapMountedSandboxDOMNodeToBundle()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { location, removeContent, isMobile } = this.props
    const { location: nextLocation, isMobile: nextIsMobile } = nextProps

    const nextCmsPageName = this.getCmsPageName(nextProps)

    const changeOfLocation = (location, nextLocation) =>
      location &&
      nextLocation &&
      nextLocation.pathname &&
      decodeURIComponent(nextLocation.pathname) !==
        decodeURIComponent(location.pathname)
    const changeOfPageName = () => this.getCmsPageName() !== nextCmsPageName

    const viewportDeviceTypeHasChanged = isMobile !== nextIsMobile

    if (
      changeOfLocation(location, nextLocation) ||
      changeOfPageName() ||
      viewportDeviceTypeHasChanged
    ) {
      const id = this.getID(this.props)

      if (id) {
        // To avoid memory leak resulting in one React context (visible in React Chrome dev tools) for each navigation to a CMS page.
        cmsUtilities.unmountPreviousSandboxDOMNode(id)
        // The following is necessary in order to avoid getting the pages from the Store (from previous navigation) since this would cause
        // the CMS bundle to not kick in (to not even be downloaded since the Helmet div does not get updated)
        // and the mapping of the bundle with the Sandbox DOM node to be unsuccessful.
        removeContent(id)
      }

      const { forceMobile } = nextProps
      this.getCmsContent({
        ...this.props,
        location: nextLocation,
        cmsPageName: nextCmsPageName,
        forceMobile,
        isMobile: nextIsMobile,
      })
      return
    }

    const content = this.getPage(this.props)
    const nextContent = this.getPage(nextProps)

    if (content !== nextContent && nextContent) {
      this.setWindowProps(nextContent.props)
    }
  }

  getCmsContent = ({
    segmentationRequestData,
    location,
    cmsPageName,
    contentType,
    forceMobile,
    isMobile,
  }) => {
    const { getSegmentedContent, getContent, lazyLoad } = this.props
    if (segmentationRequestData && !isMobile) {
      const { wcsEndpoint, responseIdentifier } = segmentationRequestData
      getSegmentedContent(
        wcsEndpoint,
        responseIdentifier,
        cmsPageName,
        lazyLoad
      )
    } else {
      getContent(
        location,
        cmsPageName,
        contentType,
        undefined,
        undefined,
        undefined,
        forceMobile,
        lazyLoad
      )
    }
  }

  deferredNotifyContentLoaded = () => {
    const { onContentLoaded } = this.props
    if (!this.sandboxRef || !onContentLoaded) return
    const content = this.sandboxRef.firstElementChild
    if (content && content.clientHeight) {
      clearInterval(this.contentLoadedInterval)
      onContentLoaded()
    }
  }

  componentDidUpdate() {
    cmsUtilities.mapMountedSandboxDOMNodeToBundle()
  }

  componentWillUnmount() {
    // Resetting Store.sandbox and React CMS context to manage scenarios like e-receipts > home > e-receipts.
    const { removeContent } = this.props
    const id = this.getID(this.props)
    cmsUtilities.unmountPreviousSandboxDOMNode(id)
    removeContent(id)
    if (this.contentLoadedInterval) clearInterval(this.contentLoadedInterval)
  }

  setWindowProps = (props) => {
    // One scenario for the next one is Internal Server Error in mrCMS.
    if (!props) return

    if (
      !this.props.useMontyCmsForForms &&
      isCmsForm(props.data && props.data.pageData)
    )
      return

    const sandboxDOMNodeId = this.getID(props)

    cmsUtilities.updateNewSandBox(sandboxDOMNodeId, props)
  }

  getID = (propData) => {
    const props = propData || this.props
    const cmsPageName = this.getCmsPageName() || this.getCmsPageName(props)
    if (cmsPageName) return cmsPageName
    if (props.location && props.location.pathname)
      return props.location.pathname
    if (this.props.location && this.props.location.pathname)
      return this.props.location.pathname
    return null
  }

  getPage = (props) => {
    const pageId = this.getID(props)
    // TODO: use path/if and make it easy to read
    return props && props.pages ? props.pages[pageId] : null
  }

  getCmsPageName = (propData) => {
    const { route, params, cmsPageName } = propData || this.props

    if (cmsPageName) return cmsPageName
    if (route && route.cmsPageName) return route.cmsPageName
    if (params && params.cmsPageName) return params.cmsPageName
  }

  setSandboxRef = (ref) => {
    this.sandboxRef = ref
    if (ref && this.props.onContentLoaded) {
      this.contentLoadedInterval = setInterval(
        this.deferredNotifyContentLoaded,
        100
      )
    }
  }

  static needs = [
    (location) => sandBoxActions.getContent(location, location.cmsPageName),
  ]

  render() {
    const {
      contentType,
      isInPageContent,
      location,
      isMobile,
      useMontyCmsForForms,
      isResponsiveCatHeader,
      isFinalResponsiveEspotSolution,
      qubitid,
      sandBoxClassName,
    } = this.props

    const { hasError } = this.state

    if (hasError) return null

    const page = this.getPage(this.props)

    const pathnameLocation = path(['pathname'], location)

    const responsiveCatHeaderTemplateAvailable =
      isResponsiveCatHeader && pathnameLocation

    if (
      contentType === cmsConsts.ESPOT_CONTENT_TYPE &&
      !isMobile &&
      !isFinalResponsiveEspotSolution
    ) {
      return null
    }

    const isMainContent =
      !isInPageContent &&
      contentType !== cmsConsts.ESPOT_CONTENT_TYPE &&
      !isFinalResponsiveEspotSolution

    if (!page) {
      return isMainContent || responsiveCatHeaderTemplateAvailable ? (
        <Loader className="PlpContainer-plpHeader" />
      ) : null
    }

    if (page.cmsTestMode === true) {
      return <div className="CmsMock">CMS content mocked</div>
    }

    // For example when Internal Server Error on mrCMS.
    if (!page.initialBody && isMainContent) {
      return <CmsNotAvailable />
    }

    const pageData =
      page && page.props && page.props.data && page.props.data.pageData

    if (!useMontyCmsForForms && isCmsForm(pageData)) {
      return (
        <CmsWrapper
          dataAlreadyFetchedByMrCMS
          params={{
            cmsPageName: page.props.location.pathname,
          }}
        />
      )
    }
    const title = page.head && page.head.title

    if (isErrorPage(title)) {
      if (!process.browser && isMainContent) {
        this.props.setPageStatusCode(404)
      } else if (!isMainContent) {
        return null
      }
    }

    const head = !isMainContent ? omit(['title'], page.head) : page.head
    const headLinks = path(['link'], head)

    const pageId = this.getID()

    // server side defer styles
    if (!process.browser && headLinks && !isEmpty(headLinks)) {
      head.link = deferStyles(headLinks)
    }

    // make sure helmet ssr does not break already activated deferred css styles loaded through Sandbox
    if (process.browser && head && path(['link'], head)) {
      head.link = activateDeferredStyles(head.link)
      head.link = head.link.map((l) => ({
        ...l,
        media: 'all',
        'data-breakpoint': 'all',
      }))
    }

    const sandboxInstance = (
      <div className={`CmsFrame ${sandBoxClassName}`}>
        <Helmet
          {...head}
          onChangeClientState={activateDeferredStylesCallback}
        />
        <div
          ref={this.setSandboxRef}
          id={`Sandbox-${pageId}`}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: page.initialBody }}
        />
      </div>
    )

    return qubitid && isFinalResponsiveEspotSolution ? (
      <QubitReact id={qubitid}>{sandboxInstance}</QubitReact>
    ) : (
      sandboxInstance
    )
  }
}

export default SandBox
