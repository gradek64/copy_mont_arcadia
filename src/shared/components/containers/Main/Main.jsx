import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { pathOr } from 'ramda'
import TopNavMenu from '../TopNavMenu/TopNavMenu'
import ScrollToTop from '../../behaviour/ScrollToTop'
import HeaderContainer from '../Header/HeaderContainer'
import FooterContainer from '../Footer/FooterContainer/FooterContainer'
import DebugButton from '../DebugButton/DebugButton'
import MontyVisualIndicator from '../../common/MontyVisualIndicator/MontyVisualIndicator'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import Modal from '../../common/Modal/Modal'
import CheckoutMiniBag from '../CheckoutMiniBag/CheckoutMiniBag'
import Drawer from '../Drawer/Drawer'
import SizeGuideDrawer from '../../common/SizeGuideDrawer/SizeGuideDrawer'
import MiniBag from '../MiniBag/MiniBag'
import TacticalMessage from '../TacticalMessage/TacticalMessage'
import LoaderOverlay from '../../common/LoaderOverlay/LoaderOverlay'
import ContentOverlay from '../../common/ContentOverlay/ContentOverlay'
import FooterCheckout from '../Footer/FooterCheckout/FooterCheckout'
import MarketingSlideUp from '../MarketingSlideUp/MarketingSlideUp'
import Espot from '../Espot/Espot'
import * as viewportActions from '../../../actions/common/viewportActions'
import * as siteOptionsActions from '../../../actions/common/siteOptionsActions'
import { getAccount } from '../../../actions/common/accountActions'
import { getContent } from '../../../actions/common/sandBoxActions'
import {
  getBag,
  initShoppingBag,
} from '../../../actions/common/shoppingBagActions'
import { initFeaturesListener } from '../../../actions/common/featuresActions'
import { retrieveCachedData } from '../../../actions/common/pageCacheActions'
import * as navigationActions from '../../../actions/common/navigationActions'
import * as storeLocatorActions from '../../../actions/components/StoreLocatorActions'
import * as footerActions from '../../../actions/common/footerActions'
import { addDDPToBag } from '../../../actions/common/ddpActions'
import { getViewport, touchDetection } from '../../../lib/viewHelper'
import espots from '../../../constants/espotsMobile'
import cmsConsts from '../../../constants/cmsConsts'
import throttle from 'lodash.throttle'
import breakpoints from '../../../constants/responsive'
import { WindowEventProvider } from '../WindowEventProvider/WindowEventProvider'
import { WindowNavigationListener } from '../WindowEventProvider/WindowNavigationListener'
import espotsDesktopConstants from '../../../../shared/constants/espotsDesktop'
import { getRedirectURL } from '../../../lib/geo-ip-utils'
import GeoIPModal from '../../common/GeoIP'
import * as modalActions from '../../../actions/common/modalActions'
import { debug } from '../../../../server/lib/logger'
import { getDefaultWishlist } from '../../../actions/common/wishlistActions'

import CookieMessage from '../../common/CookieMessage/CookieMessage'
import {
  isFeatureRememberMeEnabled,
  isFeaturePOCWebchatHackEnabled,
  isFeatureEspotHeaderHomepageEnabled,
  isFeatureEnabled,
  isFeatureDeferCmsContentEnabled,
} from '../../../selectors/featureSelectors'
import { syncState } from '../../../actions/common/syncState'

import { isModalOpen } from '../../../selectors/modalSelectors'
import {
  getPageTitle,
  getMetaDescription,
  getDDPDefaultSku,
} from '../../../selectors/siteOptionsSelectors'
import {
  shouldDisplayMobileHeaderIfSticky,
  isHeaderSticky,
} from '../../../selectors/pageHeaderSelectors'
import {
  isHomePage,
  isInCheckout,
  isNotFound,
  isOrderComplete,
  isOrderSuccess,
  isRestrictedPath,
  getRoutePath,
} from '../../../selectors/routingSelectors'
import { getWishlistItemIds } from '../../../selectors/wishlistSelectors'
import { getRegion } from '../../../selectors/common/configSelectors'
import {
  getBrandName,
  getBrandDisplayName,
  getBrandCode,
  getStylesheetProps,
} from '../../../selectors/configSelectors'
import { getMegaNavSelectedCategory } from '../../../selectors/navigationSelectors'
import { getSandboxStylesheets } from '../../../selectors/sandboxSelectors'
import {
  isDDPUserInPreExpiryWindow,
  isDDPRenewablePostWindow,
  isDDPActiveUserPreRenewWindow,
  ddpExpressDeliveryPrice,
  ddpSavingsValue,
  ddpEndDate,
  isDDPUser,
  getDDPDefaultName,
  ddpLogoSrc,
} from '../../../selectors/ddpSelectors'
import { bagContainsDDPProduct } from '../../../selectors/shoppingBagSelectors'
import { isLoggedIn } from '../../../selectors/common/accountSelectors'
import { getItem, setItem } from '../../../../client/lib/cookie/utils'
import {
  deferStyles,
  activateDeferredStylesCallback,
} from '../../../lib/asset-utils'
import { isIOS } from '../../../lib/user-agent'
import storageHandlers from '../../../../client/lib/state-sync/handlers/index'
import { SHOPPING_BAG_SYNC_KEY } from '../../../../client/lib/state-sync/handlers/shoppingBagSyncHandler'
import Debug from '../../common/Debug/Debug'
import WithQubit from '../../common/Qubit/WithQubit'

if (process.browser) {
  require('../../../styles/typography.css')
  require('../../../styles/base.css')
  require('../../../styles/flag-icons.css')
}

// Comment to test Jenkins Migration
@connect(
  (state) => ({
    topNavMenuOpen: state.topNavMenu.open,
    sizeGuideOpen: state.productDetail.sizeGuideOpen,
    productsSearchOpen: state.productsSearch.open,
    refinementsOpen: state.refinements.isShown,
    modalOpen: isModalOpen(state),
    modalMode: state.modal.mode,
    miniBagOpen: state.shoppingBag.miniBagOpen,
    iosAgent: state.viewport.iosAgent,
    brandName: getBrandName(state),
    brandDisplayName: getBrandDisplayName(state),
    googleSiteVerification: state.config.googleSiteVerification,
    errorMessage: state.errorMessage,
    totalItems: state.shoppingBag.totalItems,
    showTacticalMessage: state.sandbox.showTacticalMessage,
    debugShown: state.debug.isShown,
    stylesheetProps: getStylesheetProps(state),
    sandboxStylesheets: getSandboxStylesheets(state),
    media: state.viewport.media,
    isMobile: state.viewport.media === 'mobile',
    featureResponsive: state.features.status.FEATURE_RESPONSIVE,
    featureMegaNav: state.features.status.FEATURE_MEGA_NAV,
    touchEnabled: state.viewport.touch,
    redirectURL: getRedirectURL(state),
    isHomePage: isHomePage(state),
    wishlistedItemIds: getWishlistItemIds(state),
    stickyHeader: isHeaderSticky(state),
    forceMobileHeader: shouldDisplayMobileHeaderIfSticky(state),
    metaDescription: getMetaDescription(state),
    pageTitle: getPageTitle(state),
    megaNavSelectedCategory: getMegaNavSelectedCategory(state),
    featureRememberMe: isFeatureRememberMeEnabled(state),
    isCheckout: isInCheckout(state),
    isOrderCompletePage: isOrderComplete(state),
    isOrderSuccessPage: isOrderSuccess(state),
    brandCode: getBrandCode(state),
    region: getRegion(state),
    isFeaturePOCWebchatHackEnabled: isFeaturePOCWebchatHackEnabled(state),
    isFeatureEspotHeaderHomepageEnabled: isFeatureEspotHeaderHomepageEnabled(
      state
    ),
    isNotFound: isNotFound(state),
    isRestrictedPath: isRestrictedPath(state),
    isStickyMobileEnabled: isFeatureEnabled(
      state,
      'FEATURE_STICKY_MOBILE_HEADER'
    ),
    isDDPUserInPreExpiryWindow: isDDPUserInPreExpiryWindow(state),
    ddpEndDate: ddpEndDate(state),
    isLoggedIn: isLoggedIn(state),
    route: getRoutePath(state),
    ddpDefaultSku: getDDPDefaultSku(state),
    ddpSavingsValue: ddpSavingsValue(state),
    ddpExpressDeliveryPrice: ddpExpressDeliveryPrice(state),
    isDDPRenewablePostWindow: isDDPRenewablePostWindow(state),
    isDDPActiveUserPreRenewWindow: isDDPActiveUserPreRenewWindow(state),
    isDDPUser: isDDPUser(state),
    bagContainsDDPProduct: bagContainsDDPProduct(state),
    getDDPDefaultName: getDDPDefaultName(state),
    ddpLogoSrc: ddpLogoSrc(state),
  }),
  {
    ...viewportActions,
    ...modalActions,
    setMegaNavSelectedCategory: navigationActions.setMegaNavSelectedCategory,
    getBag,
    getAccount,
    getDefaultWishlist,
    initFeaturesListener,
    retrieveCachedData,
    initShoppingBag,
    syncState,
    addDDPToBag,
  }
)
class Main extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    brandDisplayName: PropTypes.string.isRequired,
    iosAgent: PropTypes.bool,
    refinementsOpen: PropTypes.bool,
    children: PropTypes.object,
    errorMessage: PropTypes.object,
    topNavMenuOpen: PropTypes.bool,
    miniBagOpen: PropTypes.bool,
    productsSearchOpen: PropTypes.bool,
    modalOpen: PropTypes.bool,
    modalMode: PropTypes.string,
    showTacticalMessage: PropTypes.bool,
    debugShown: PropTypes.bool,
    googleSiteVerification: PropTypes.string,
    media: PropTypes.string,
    isMobile: PropTypes.bool,
    featureResponsive: PropTypes.bool,
    touchEnabled: PropTypes.bool,
    updateWindow: PropTypes.func,
    setAndUpdateMediaType: PropTypes.func,
    updateAgent: PropTypes.func,
    updateTouch: PropTypes.func,
    initFeaturesListener: PropTypes.func,
    retrieveCachedData: PropTypes.func,
    initShoppingBag: PropTypes.func,
    sizeGuideOpen: PropTypes.bool.isRequired,
    showModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    isHomePage: PropTypes.bool.isRequired,
    isCheckout: PropTypes.bool.isRequired,
    isOrderCompletePage: PropTypes.bool.isRequired,
    isOrderSuccessPage: PropTypes.bool.isRequired,
    wishlistedItemIds: PropTypes.array,
    getDefaultWishlist: PropTypes.func,
    stickyHeader: PropTypes.bool.isRequired,
    forceMobileHeader: PropTypes.bool.isRequired,
    metaDescription: PropTypes.string,
    pageTitle: PropTypes.string,
    megaNavSelectedCategory: PropTypes.string.isRequired,
    setMegaNavSelectedCategory: PropTypes.func.isRequired,
    featureRememberMe: PropTypes.bool.isRequired,
    syncState: PropTypes.func.isRequired,
    isNotFound: PropTypes.bool.isRequired,
    isFeatureEspotHeaderHomepageEnabled: PropTypes.bool.isRequired,
    isRestrictedPath: PropTypes.bool.isRequired,
    isStickyMobileEnabled: PropTypes.bool.isRequired,
    stylesheetProps: PropTypes.array,
    sandboxStylesheets: PropTypes.array,
    route: PropTypes.string.isRequired,
  }

  static defaultProps = {
    metaDescription: '',
    pageTitle: '',
    forceMobileHeader: false,
    stickyHeader: false,
  }

  static contextTypes = {
    store: PropTypes.object,
    l: PropTypes.func,
  }

  UNSAFE_componentWillMount() {
    const { showModal, redirectURL } = this.props

    if (redirectURL) {
      debug('GeoIP', { message: 'Rendering GeoIP modal', redirectURL })
      showModal(
        <GeoIPModal
          handleClose={this.handleClose}
          handleRemoveCloseHandler={this.removeCloseHandler}
          store={this.context.store}
        />,
        { mode: 'slideUpFromBottom' }
      )
    } else {
      debug('GeoIP', { message: 'Not showing GeoIP modal', redirectURL })
    }
  }

  componentDidMount() {
    const {
      location,
      updateAgent,
      initFeaturesListener,
      retrieveCachedData,
      updateTouch,
      initShoppingBag,
      getDefaultWishlist,
      wishlistedItemIds,
      featureRememberMe,
      syncState,
      isNotFound,
    } = this.props

    const isNotOrderComplete = !location.pathname.includes('/order-complete')
    const isNotCheckout = isNotFound || !location.pathname.includes('/checkout')
    const isNotMyAccount =
      isNotFound || !location.pathname.includes('/my-account')
    const storageSyncKeys = Object.keys(storageHandlers)
    // on order-complete prevent get bag as it conflicts with a concurrent request to update bag
    const stateKeysToUpdate =
      isNotCheckout && isNotOrderComplete
        ? storageSyncKeys
        : storageSyncKeys.filter((key) => key !== SHOPPING_BAG_SYNC_KEY)

    if (isNotCheckout && isNotOrderComplete) retrieveCachedData()
    if (isNotOrderComplete) initShoppingBag()

    if (process.browser) {
      // 'authenticated' cookie  can be 'yes' or 'partial', in both cases we need to
      //  (attempt) to get the user account details when 'Remember Me' is enabled.
      const shouldGetAccount =
        isNotMyAccount &&
        (featureRememberMe
          ? getItem('authenticated')
          : getItem('authenticated') === 'yes')

      if (shouldGetAccount) this.props.getAccount()

      syncState(stateKeysToUpdate)

      updateAgent(isIOS())
      this.windowResizeEvent()
      // Development and desktop

      updateTouch(touchDetection())

      window.addEventListener(
        'resize',
        throttle(this.windowResizeEvent.bind(this), 100)
      )

      window.addEventListener(
        'message',
        this.punchoutPostMessageHandler.bind(this),
        false
      )

      /**
       * History workaround on CriOS
       *
       * There could be some extraneous WebKit `popstate` events which is
       * distingueshed by the `history` module by checking if the `event.state`
       * is undefined. The problem isriOS (Chrome on iOS) could raise a
       * `popstate` event with undefined state too, so an extra condition needs
       * to be added to the module for this which has been fixed in a later
       * version so we have to keep this until we will have the updated
       * history to v4.4.1
       *
       * [fix]{@link https://github.com/mjackson/history/pull/383}
       */
      window.addEventListener('popstate', (event) => {
        const isRealEvent =
          event.state === undefined && navigator.userAgent.includes('CriOS')
        if (isRealEvent) {
          const customEvent = new Event('popstate')
          customEvent.state = {
            key: 'custom',
          }
          window.dispatchEvent(customEvent)
        }
      })

      initFeaturesListener()

      if (!wishlistedItemIds) {
        getDefaultWishlist()
      }
    }
  }

  stickyMobileHeader = () => {
    const { isRestrictedPath, isStickyMobileEnabled, isMobile } = this.props
    return !isRestrictedPath && isStickyMobileEnabled && isMobile
  }

  // The ThirdPartyPaymentIframe loads the punchout template to signal
  // to this handler that it can be closed by the Main component.
  punchoutPostMessageHandler(event) {
    if (
      event.origin === window.location.origin &&
      event.data &&
      event.data.punchout
    ) {
      this.props.closeModal(false)
      this.props.clearModalChildren()
      browserHistory.replace(event.data.nextUrl)
    }
  }

  isDrawerOpen = ({ miniBagOpen, isMobile, sizeGuideOpen }) =>
    miniBagOpen || (!isMobile && sizeGuideOpen)
  isTopNavMenuOpen = ({ topNavMenuOpen }) => !!topNavMenuOpen

  windowResizeEvent() {
    const { updateWindow, setAndUpdateMediaType, media } = this.props
    const dimensions = getViewport()
    updateWindow(dimensions)

    Object.keys(breakpoints).forEach((name) => {
      if (name === media) return
      const data = breakpoints[name]
      if (data.file && dimensions.width >= data.min) {
        if (data.max && dimensions.width > data.max) return
        setAndUpdateMediaType(name)
      }
    })

    // Updates deviceType cookie in the browser to prevent incorrect viewport
    // type being cached and loaded when application is rendered.
    const currentDevice = Object.keys(breakpoints)
      .filter(
        (breakpointDevice) =>
          breakpoints[breakpointDevice].min <= dimensions.width
      )
      .reverse()
      .reduce((breakpointDevice) => breakpointDevice)
    setItem('deviceType', currentDevice)
  }

  handleClose = (handler) => {
    this.closeModalHandler = handler
  }

  removeCloseHandler = () => {
    this.closeModalHandler = null
  }

  closeModal = () => {
    const closeModal = () => {
      if (this.props.modalMode !== 'warning') this.props.closeModal()
    }

    if (this.closeModalHandler) {
      if (this.closePromise) return

      this.closePromise = this.closeModalHandler().then(() => {
        closeModal()
        this.closePromise = null
      })
    } else {
      closeModal()
    }
  }

  getDrawerComponent = (checkout) => {
    const { sizeGuideOpen, isMobile } = this.props

    if (checkout) return CheckoutMiniBag
    if (!isMobile && sizeGuideOpen) return SizeGuideDrawer
    return MiniBag
  }

  static needs = [
    // navigationActions.getCategories,
    // navigationActions.getMegaNav,
    siteOptionsActions.getSiteOptions,
    () => (dispatch, getState) => {
      return dispatch(
        getContent(
          null,
          espots.navMenu[0],
          cmsConsts.ESPOT_CONTENT_TYPE,
          true,
          null,
          {},
          false,
          isFeatureDeferCmsContentEnabled(getState())
        )
      )
    },
    () =>
      getContent(null, espots.tacticalMessage[0], cmsConsts.ESPOT_CONTENT_TYPE),
    footerActions.getFooterContent,
    storeLocatorActions.getCountries,
    getDefaultWishlist,
  ]

  getDisplayContent() {
    const { errorMessage } = this.props
    return !errorMessage || (errorMessage && errorMessage.isOverlay)
  }

  getShowOverlay() {
    const {
      sizeGuideOpen,
      miniBagOpen,
      topNavMenuOpen,
      productsSearchOpen,
      modalOpen,
    } = this.props
    return (
      topNavMenuOpen ||
      productsSearchOpen ||
      modalOpen ||
      miniBagOpen ||
      sizeGuideOpen
    )
  }

  getClassNames() {
    const {
      isHomePage,
      topNavMenuOpen,
      miniBagOpen,
      isMobile,
      refinementsOpen,
      debugShown,
      iosAgent,
      stickyHeader,
    } = this.props
    return classNames('Main-body', {
      'is-homePage': isHomePage,
      'is-right': topNavMenuOpen,
      'is-left': !topNavMenuOpen && miniBagOpen && isMobile,
      'is-notScrollable': refinementsOpen || debugShown,
      ios: iosAgent,
      'is-stickyHeader': stickyHeader,
      'is-stickyMobileHeader': this.stickyMobileHeader(),
    })
  }

  closeOverlayAndPreventClickingLinks = (e) => {
    const { setMegaNavSelectedCategory } = this.props
    e.preventDefault()
    setMegaNavSelectedCategory('')
  }

  getMegaNavOverlay(footer) {
    const { megaNavSelectedCategory, touchEnabled, stickyHeader } = this.props
    if (!megaNavSelectedCategory) {
      return null
    }
    const overlayClassNames = classNames('MegaNav-overlay', {
      'MegaNav-overlay--noTouch': !touchEnabled,
      'MegaNav-overlay--sticky': stickyHeader && !footer,
      'MegaNav-overlay--stickyFooter': stickyHeader && footer,
    })
    return (
      <div
        onTouchEnd={this.closeOverlayAndPreventClickingLinks}
        className={overlayClassNames}
      />
    )
  }

  renderTacticalMessage() {
    return this.props.isMobile && this.props.showTacticalMessage ? (
      <TacticalMessage onSetHeight={this.onSetTacticalMessageHeight} />
    ) : null
  }

  getEspotHeader() {
    const {
      isHomePage,
      isOrderCompletePage,
      isCheckout,
      isFeatureEspotHeaderHomepageEnabled,
    } = this.props

    if (
      isCheckout ||
      isOrderCompletePage ||
      (isFeatureEspotHeaderHomepageEnabled && isHomePage)
    )
      return null

    return (
      <Espot identifier={espotsDesktopConstants.navigation.siteWideHeader} />
    )
  }

  getNoscriptStylesheets = (
    mainStyleSheetProps = [],
    sandboxStylesheets = []
  ) => {
    const stylesheets = [...mainStyleSheetProps, ...sandboxStylesheets]

    return stylesheets.map((style) => ({
      innerHTML: `<link rel="stylesheet" media="${pathOr(
        'all',
        ['data-breakpoint'],
        style
      )}" href="${style.href}" />`,
    }))
  }
  /* eslint-disable */
  render() {
    const {
      location,
      sizeGuideOpen,
      closeModal,
      brandDisplayName,
      children,
      modalOpen,
      debugShown,
      googleSiteVerification,
      media,
      stylesheetProps,
      sandboxStylesheets,
      featureResponsive,
      isMobile,
      touchEnabled,
      metaDescription,
      pageTitle,
      forceMobileHeader,
      megaNavSelectedCategory,
      isCheckout,
      isOrderCompletePage,
      isOrderSuccessPage,
      brandCode,
      region,
      isFeaturePOCWebchatHackEnabled,
      isDDPUserInPreExpiryWindow,
      isDDPRenewablePostWindow,
      isDDPActiveUserPreRenewWindow,
      ddpEndDate,
      isLoggedIn,
      route,
      addDDPToBag,
      ddpDefaultSku,
      ddpSavingsValue,
      ddpExpressDeliveryPrice,
      isDDPUser,
      bagContainsDDPProduct,
      getDDPDefaultName,
      ddpLogoSrc,
    } = this.props

    const stylesheets = process.browser
      ? stylesheetProps
      : deferStyles(stylesheetProps)
    const appClass = this.getClassNames()
    const displayContent = this.getDisplayContent()
    const showOverlay = this.getShowOverlay()
    const isInAcceptedRegion = ['uk', 'fr', 'us', 'de', 'eu'].includes(region)
    const ogSiteName = `${brandDisplayName} (${region.toUpperCase()})`
    const showFooterCheckout =
      isCheckout || isOrderCompletePage || isOrderSuccessPage

    const metaData = [
      {
        name: 'google-site-verification',
        content: googleSiteVerification,
      },
      {
        name: 'og:site_name',
        content: ogSiteName,
      },
    ]

    if (metaDescription) {
      metaData.push({
        name: 'description',
        content: metaDescription,
      })
    }

    const DrawerComponent = this.getDrawerComponent(isCheckout)
    const mainInnerClassNames = classNames('Main-inner', {
      'Main-inner--overlay': megaNavSelectedCategory,
      'Main-inner--stickyMobile': this.stickyMobileHeader(),
    })
    const footerInnerClassNames = classNames({
      'FooterContainer-overlay': megaNavSelectedCategory,
    })

    return (
      <ScrollToTop>
        <WindowEventProvider>
          <WindowNavigationListener
            modalOpen={modalOpen}
            closeModal={closeModal}
          >
            <div
              role="presentation"
              className={`Main ${!touchEnabled ? 'no-touch' : ''}`}
            >
              <Helmet
                titleTemplate={`%s | ${brandDisplayName}`}
                title={pageTitle}
                meta={metaData}
                noscript={this.getNoscriptStylesheets(
                  stylesheetProps,
                  sandboxStylesheets
                )}
              />
              <Helmet
                link={stylesheets}
                onChangeClientState={activateDeferredStylesCallback}
              />
              <ContentOverlay
                onClick={this.closeModal}
                showOverlay={showOverlay}
                isDrawerOpen={
                  this.isTopNavMenuOpen(this.props) ||
                  this.isDrawerOpen(this.props)
                }
                isMobile={isMobile}
              />
              {this.getEspotHeader()}
              {this.renderTacticalMessage()}
              <HeaderContainer
                location={location}
                isStickyMobile={this.stickyMobileHeader()}
              />
              <div className={appClass}>
                <ErrorMessage />
                <div tabIndex="0" id="Main-content" />
                <WithQubit
                  shouldUseQubit={
                    isDDPUserInPreExpiryWindow || isDDPRenewablePostWindow
                  }
                  id="qubit-toast-notification"
                  brandCode={brandCode}
                  route={route}
                  isMobile={isMobile}
                  isLoggedIn={isLoggedIn}
                  ddpEndDate={ddpEndDate}
                  isDDPUserInPreExpiryWindow={isDDPUserInPreExpiryWindow}
                  isDDPRenewablePostWindow={isDDPRenewablePostWindow}
                  isDDPActiveUserPreRenewWindow={isDDPActiveUserPreRenewWindow}
                  addDDPToBag={addDDPToBag}
                  ddpDefaultSku={ddpDefaultSku.sku}
                  ddpDefaultSkuPrice={ddpDefaultSku.unitPrice}
                  ddpSavingsValue={ddpSavingsValue}
                  ddpExpressDeliveryPrice={ddpExpressDeliveryPrice}
                  isDDPUser={isDDPUser}
                  bagContainsDDPProduct={bagContainsDDPProduct}
                  getDDPDefaultName={getDDPDefaultName}
                  ddpLogoSrc={ddpLogoSrc}
                />
                <div className={mainInnerClassNames}>
                  {displayContent && children}
                  {this.getMegaNavOverlay(false)}
                  {isFeaturePOCWebchatHackEnabled && [
                    <div
                      key="0"
                      id="divicw"
                      data-bind="8a2035c4-6ccd-11e9-bf0b-0213261164bb"
                      data-org=""
                    />,
                    <script
                      key="1"
                      src="https://attachuk.imi.chat/widget/js/imichatinit.js"
                    />,
                  ]}
                </div>
                {showFooterCheckout &&
                  isInAcceptedRegion && (
                    <FooterCheckout brandCode={brandCode} region={region} />
                  )}
              </div>
              {!featureResponsive || media === 'mobile' || forceMobileHeader ? (
                <TopNavMenu />
              ) : null}
              {!isMobile &&
                (!showFooterCheckout || !isInAcceptedRegion) && (
                  <div className={footerInnerClassNames}>
                    {this.getMegaNavOverlay(true)}
                    <FooterContainer />
                  </div>
                )}
              {!isMobile && <MontyVisualIndicator />}
              <Drawer
                isOpen={this.isDrawerOpen(this.props)}
                isScrollable={sizeGuideOpen}
              >
                <DrawerComponent />
              </Drawer>
              <Modal onCloseModal={this.closeModal} />
              <LoaderOverlay />
              {debugShown && <Debug />}
              <DebugButton />
              <CookieMessage />
              <MarketingSlideUp
                areSideDrawersOpen={
                  this.isTopNavMenuOpen(this.props) ||
                  this.isDrawerOpen(this.props)
                }
              />
            </div>
          </WindowNavigationListener>
        </WindowEventProvider>
      </ScrollToTop>
    )
  }
}

export default Main
