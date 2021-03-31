import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Header from './Header'
import HeaderBig from './HeaderBig'
import { WindowScroll } from '../WindowEventProvider/WindowScroll'
import { isMinViewPort } from '../../../selectors/viewportSelectors'
import { isFeatureStickyHeaderEnabled } from '../../../selectors/featureSelectors'
import { shouldDisplayMobileHeaderIfSticky } from '../../../selectors/pageHeaderSelectors'
import { isInCheckout } from '../../../selectors/routingSelectors'
import { setSticky } from '../../../actions/common/headerActions'
import { isCheckoutPath } from '../../../lib/checkout'

const stickyHeaderBreakpoints = {
  topshop: () => 38,
  topman: () => 38,
  missselfridge: () => 38,
  dorothyperkins: (isMinViewPort) => (isMinViewPort('laptop') ? 87 : 42),
  burton: () => 84,
  wallis: () => 0,
  evans: () => 0,
}

@connect(
  (state) => ({
    brandName: state.config.brandName,
    isMobile: state.viewport.media === 'mobile',
    featureBigHeader: state.features.status.FEATURE_HEADER_BIG,
    featureResponsive: state.features.status.FEATURE_RESPONSIVE,
    sticky: state.pageHeader.sticky,
    isInCheckout: isInCheckout(state),
    forceMobileHeaderIfSticky: shouldDisplayMobileHeaderIfSticky(state),
    isFeatureStickyHeaderEnabled: isFeatureStickyHeaderEnabled(state),
  }),
  {
    setSticky,
    isMinViewPort,
  }
)
class HeaderContainer extends Component {
  static propTypes = {
    brandName: PropTypes.string,
    location: PropTypes.object.isRequired,
    isMobile: PropTypes.bool.isRequired,
    featureBigHeader: PropTypes.bool,
    featureResponsive: PropTypes.bool,
    forceMobileHeaderIfSticky: PropTypes.bool,
    sticky: PropTypes.bool,
    isFeatureStickyHeaderEnabled: PropTypes.bool,
    isInCheckout: PropTypes.bool,
    isMinViewPort: PropTypes.func,
    isStickyMobile: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.ref = React.createRef()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { isInCheckout, sticky, setSticky, isMobile } = this.props
    const { isInCheckout: newIsInCheckout, isMobile: newIsMobile } = nextProps

    const isCheckoutStickyHeader = sticky && !isInCheckout && newIsInCheckout
    const isResizeIntoMobile = !isMobile && newIsMobile

    if (isCheckoutStickyHeader || isResizeIntoMobile) setSticky(false)
  }

  onScroll = (event, { scrollY, pageYOffset }) => {
    const y = scrollY || pageYOffset
    this.onUpdateScrollPosition(y)
  }

  onUpdateScrollPosition = (y) => {
    const {
      brandName,
      setSticky,
      sticky,
      isMinViewPort,
      isInCheckout,
    } = this.props
    if (!this.ref || !this.ref.current) return
    if (isInCheckout) return
    const offsetTop = this.ref.current.offsetTop

    const brandStickyOffset =
      stickyHeaderBreakpoints[brandName](isMinViewPort) || 0
    const stickyOffsetBreached = y > offsetTop + brandStickyOffset
    const newSticky = stickyOffsetBreached && !isInCheckout
    if ((newSticky && !sticky) || (!newSticky && sticky)) setSticky(newSticky)
  }

  renderHeader = () => {
    const {
      isMobile,
      location: { pathname },
      featureBigHeader,
      featureResponsive,
      forceMobileHeaderIfSticky,
      sticky,
      isStickyMobile,
    } = this.props
    const isCheckout = isCheckoutPath(pathname)
    const isCheckoutLogin = isCheckout && pathname.includes('login')
    const isCheckoutSummary = isCheckout && pathname.includes('summary')
    const isCheckoutBig = isCheckout && featureBigHeader && !isMobile

    const bigHeader =
      featureBigHeader && featureResponsive && !isMobile && !isCheckout

    const forceMobile = forceMobileHeaderIfSticky && sticky
    return (
      <React.Fragment>
        <Header
          hasMenuButton={!isCheckout}
          hasSearchBar={
            !isCheckout && (isMobile || !featureResponsive || !featureBigHeader)
          }
          hasCartIcon={!isCheckoutLogin && !isCheckoutSummary && !isCheckoutBig}
          isCheckoutBig={isCheckoutBig}
          forceDisplay={forceMobile}
          isStickyMobile={isStickyMobile}
          ref={this.ref}
        />
        {bigHeader && !forceMobile && <HeaderBig />}
      </React.Fragment>
    )
  }

  render() {
    const { isFeatureStickyHeaderEnabled, isMobile } = this.props
    const scrollDelay = 50

    if (isFeatureStickyHeaderEnabled && !isMobile) {
      return (
        <WindowScroll scrollDelay={scrollDelay} onCustomScroll={this.onScroll}>
          {this.renderHeader()}
        </WindowScroll>
      )
    }
    return this.renderHeader()
  }
}

export default HeaderContainer
