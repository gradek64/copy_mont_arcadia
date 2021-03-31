import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { pick } from 'ramda'

import url from 'url'
import { getRedirectURL, getURLPath } from '../../../lib/geo-ip-utils'
import { closeModal } from '../../../actions/common/modalActions'
import { sendAnalyticsDisplayEvent } from '../../../../shared/analytics/analytics-actions'
import { error, info } from '../../../../client/lib/logger'
import RedirectionPrompt from './RedirectionPrompt'
import GeoIPPixelCookies from './GeoIPPixelCookies'
import { GTM_EVENT } from '../../../analytics'
import { toggleLoaderOverlay } from '../../../actions/components/LoaderOverlayActions'
import {
  getGeoIPUserISOPreference,
  getGeoIPUserRegionPreference,
  getGeoIPUserLanguagePreference,
} from '../../../selectors/geoIPSelectors'
import { getLang, getLanguageRegion } from '../../../selectors/configSelectors'

import { translateGeoIPTextInPreferredLanguage } from '../../../lib/localisation'

export const addClientURLPartsToLink = (link) => {
  const { port = null, protocol = null } = window.location
  link = protocol ? `${protocol}//${link}` : link

  const parsedLink = url.parse(link)
  delete parsedLink.host
  delete parsedLink.href
  parsedLink.port = port
  return url.format(parsedLink)
}

@connect(
  (state) => {
    const redirectURL = getRedirectURL(state)
    const showFootnote =
      redirectURL && /^\/(\?|#|$)/.test(getURLPath(redirectURL))

    return {
      redirectURL,
      currentSiteRegion: state.config.region,
      currentSiteISO: state.config.preferredISOs[0],
      userISOPreference: getGeoIPUserISOPreference(state),
      userRegionPreference: getGeoIPUserRegionPreference(state),
      userLanguagePreference: getGeoIPUserLanguagePreference(state),
      brandName: state.config.brandName,
      showFootnote,
      geoIPReduxState: state.geoIP,
      currentSiteLanguage: getLang(state),
      currentSiteLanguageRegion: getLanguageRegion(state),
    }
  },
  { closeModal, sendAnalyticsDisplayEvent, toggleLoaderOverlay }
)
class GeoIPModal extends React.Component {
  static propTypes = {
    redirectURL: PropTypes.string.isRequired,
    userISOPreference: PropTypes.string.isRequired,
    userRegionPreference: PropTypes.string,
    userLanguagePreference: PropTypes.string,
    handleClose: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    showFootnote: PropTypes.bool.isRequired,
    geoIPReduxState: PropTypes.object.isRequired,
    currentSiteISO: PropTypes.string.isRequired,
    currentSiteRegion: PropTypes.string,
    currentSiteLanguage: PropTypes.string,
    currentSiteLanguageRegion: PropTypes.string,
    handleRemoveCloseHandler: PropTypes.func,
    sendAnalyticsDisplayEvent: PropTypes.func.isRequired,
    toggleLoaderOverlay: PropTypes.func.isRequired,
  }

  static defaultProps = {
    currentSiteRegion: 'uk',
    currentSiteLanguage: 'en',
    currentSiteLanguageRegion: 'en-gb',
    userRegionPreference: 'uk',
    userLanguagePreference: 'en-gb',
  }

  constructor(props) {
    super(props)

    this.state = {
      cookieValue: null,
      shouldRedirect: false,
      shouldSetGeoIPCookies: false,
    }

    this.geoTranslate = translateGeoIPTextInPreferredLanguage.bind(
      null,
      this.props.userLanguagePreference,
      this.props.currentSiteLanguageRegion,
      this.props.brandName
    )
  }

  /**
   * Logic is here in the componentWillMount in order pass the closer handler to
   * the parent Modal component as well as the separate ContentOverlay component;
   * following the observer pattern. We do this as it is bad practice and an anti-pattern
   * to store functions in the redux state, coupled with the way the Modal and
   * ContentOverlay components have been written and separated out. Ultimately
   * we should look into rewriting the Modal logic to accommodate this new use case:
   * requiring some extra logic to be handled upon closing the Modal.
   */
  UNSAFE_componentWillMount() {
    this.props.handleClose(() => {
      if (this.finishedGeoPixel)
        throw new Error('Cannot call handleClose callback multiple times')

      return new Promise((resolve) => {
        this.finishedGeoPixel = resolve
        this.setGeoIPCookies({
          cookieValue: this.props.currentSiteISO,
          shouldRedirect: false,
        })()
      })
    })
  }

  componentDidMount() {
    const {
      sendAnalyticsDisplayEvent,
      userRegionPreference,
      currentSiteRegion,
    } = this.props

    sendAnalyticsDisplayEvent(
      {
        currentLocale: currentSiteRegion,
        suggestedLocale: userRegionPreference,
      },
      GTM_EVENT.GEO_IP_MODAL_DISPLAYED
    )
  }

  componentWillUnmount() {
    this.props.handleRemoveCloseHandler()
  }

  setGeoIPCookies = ({ cookieValue, shouldRedirect }) => () => {
    const { toggleLoaderOverlay } = this.props
    toggleLoaderOverlay()
    this.setState({
      shouldSetGeoIPCookies: true,
      shouldRedirect,
      cookieValue,
    })
  }

  handleGeoIPCookieError = (err) => {
    const { geoIPReduxState } = this.props
    const { shouldRedirect, cookieValue } = this.state

    error('GeoIP', {
      message: 'GeoIP pixel error when setting cookie for all hostnames',
      sourceURL: window.location.href,
      geoPixelURL: err.nativeEvent.currentTarget.currentSrc,
      newGeoPreference: cookieValue,
      userRequestedRedirect: shouldRedirect,
      geoIPReduxState,
    })
  }

  handleGeoIPCookieSuccess = () => {
    const { shouldRedirect, cookieValue } = this.state
    const {
      redirectURL,
      geoIPReduxState,
      currentSiteISO,
      closeModal,
      toggleLoaderOverlay,
    } = this.props

    if (shouldRedirect) {
      info('GeoIP', {
        message: 'User has been redirected to their preferred site',
        sourceURL: window.location.href,
        newGeoPreference: cookieValue,
        geoIPReduxState,
        redirectURL,
      })
      return window.location.assign(addClientURLPartsToLink(redirectURL))
    }
    info('GeoIP', {
      message: 'User has chosen to stay on the requested site',
      sourceURL: window.location.href,
      newGeoPreference: currentSiteISO,
      geoIPReduxState,
      redirectURL,
    })
    if (this.finishedGeoPixel) {
      this.finishedGeoPixel()
    } else {
      closeModal()
    }
    toggleLoaderOverlay()
  }

  getRedirectionPromptProps() {
    return {
      ...pick(
        [
          'currentSiteRegion',
          'userRegionPreference',
          'userISOPreference',
          'currentSiteISO',
          'showFootnote',
        ],
        this.props
      ),
      setGeoIPCookies: this.setGeoIPCookies,
      geoTranslate: this.geoTranslate,
    }
  }

  render() {
    /**
     * We translate the text in the GeoIPModal based on the userISOPreference,
     * rather than using the default site language and so we have to maintain
     * a mini dictionary for it (see translateGeoIPTextInPreferredLanguage).
     *
     * If you change or add a subcomponent please make sure all strings are
     * included in geoIPDictionaryStrings - see shared/lib/localisation.js
     */

    return (
      <div className="GeoIP" data-id="GeoIPModal">
        <div>
          <RedirectionPrompt {...this.getRedirectionPromptProps()} />
          {this.state.shouldSetGeoIPCookies && (
            <GeoIPPixelCookies
              handleSuccess={this.handleGeoIPCookieSuccess}
              handleError={this.handleGeoIPCookieError}
              cookieValue={this.state.cookieValue}
            />
          )}
        </div>
      </div>
    )
  }
}

export default GeoIPModal
