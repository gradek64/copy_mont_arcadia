import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as topNavMenuActions from '../../../actions/components/TopNavMenuActions'
import * as shoppingBagActions from '../../../actions/common/shoppingBagActions'
import * as modalActions from '../../../actions/common/modalActions'
import * as searchBarActions from '../../../actions/components/search-bar-actions'
import { hideSizeGuide } from '../../../actions/common/productsActions'
import { clearMovingProductToWishlist } from '../../../actions/common/wishlistActions'
import { isMovingAnyProductToWishlist } from '../../../selectors/wishlistSelectors'

@connect(
  (state) => ({
    modalOpen: state.modal.open,
    topNavMenuOpen: state.topNavMenu.open,
    productsSearchOpen: state.productsSearch.open,
    sizeGuideOpen: state.productDetail.sizeGuideOpen,
    isMovingProductToWishlist: isMovingAnyProductToWishlist(state),
    isIos: state.viewport.iosAgent,
  }),
  {
    ...topNavMenuActions,
    ...shoppingBagActions,
    ...modalActions,
    ...searchBarActions,
    hideSizeGuide,
    clearMovingProductToWishlist,
  }
)
class ContentOverlay extends Component {
  static propTypes = {
    showOverlay: PropTypes.bool,
    modalOpen: PropTypes.bool,
    topNavMenuOpen: PropTypes.bool,
    productsSearchOpen: PropTypes.bool,
    toggleTopNavMenu: PropTypes.func.isRequired,
    toggleProductsSearchBar: PropTypes.func.isRequired,
    closeMiniBag: PropTypes.func.isRequired,
    setTimeout: PropTypes.func.isRequired,
    hideSizeGuide: PropTypes.func.isRequired,
    sizeGuideOpen: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    setModalCancelled: PropTypes.func.isRequired,
    isMovingProductToWishlist: PropTypes.bool,
    clearMovingProductToWishlist: PropTypes.func,
    isMobile: PropTypes.bool.isRequired,
    isDrawerOpen: PropTypes.bool,
    isIos: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    showOverlay: false,
    modalOpen: false,
    topNavMenuOpen: false,
    productsSearchOpen: false,
    setModalCancelled: () => {},
    setTimeout:
      typeof window !== 'undefined' && 'setTimeout' in window
        ? window.setTimeout.bind(window)
        : () => {},
  }

  // added for sticky mobile nav to scroll user back to
  // last position when unfixing the screen
  state = {
    lastKnownScrollPosition: undefined,
  }

  fixBackgroundToScrollPosition = () => {
    document.body.style.top = `-${this.state.lastKnownScrollPosition}px`
  }

  unfixBackgroundAndScrollToLastPosition = (isIos) => {
    if (isIos) {
      document.body.style.top = ''
    }
    window.scrollTo(0, this.state.lastKnownScrollPosition)
  }

  shouldComponentUpdate() {
    // We touch the 'document' a lot in the componentDidUpdate
    // and on server side rendering, document isn't available
    // causing the error 'document is not defined
    // This protects it:
    if (!process.browser) return false

    return true
  }

  static getDerivedStateFromProps(
    { isDrawerOpen, isMobile, modalOpen },
    { lastKnownScrollPosition }
  ) {
    if (isMobile && process.browser) {
      if (!isDrawerOpen && !modalOpen) {
        return null
      }
      return {
        lastKnownScrollPosition: document.body.classList.contains(
          'not-scrollable'
        )
          ? lastKnownScrollPosition
          : window.scrollY,
      }
    }
    return null
  }

  componentDidUpdate({
    isDrawerOpen: prevDrawerOpen,
    modalOpen: prevModalOpen,
  }) {
    const {
      isDrawerOpen: nextDrawerOpen,
      modalOpen: nextModalOpen,
      isMobile,
      isIos,
    } = this.props
    const hasDrawerClosed = prevDrawerOpen && !nextDrawerOpen
    const hasDrawerOpened = !prevDrawerOpen && nextDrawerOpen
    const hasModalOpened = !prevModalOpen && nextModalOpen
    const hasModalClosed = prevModalOpen && !nextModalOpen

    if (
      hasModalOpened ||
      (hasModalClosed && !nextDrawerOpen) ||
      hasDrawerOpened ||
      hasDrawerClosed
    ) {
      const shouldPreventScrolling = hasModalOpened || hasDrawerOpened
      document.body.classList.toggle(`not-scrollable`, shouldPreventScrolling)
      if (isIos && isMobile) {
        document.body.classList.toggle('ios', shouldPreventScrolling)
      }
    }

    // IOS devices stick/ unstick background
    if (isMobile) {
      if (hasDrawerOpened || hasModalOpened) {
        if (isIos) {
          this.fixBackgroundToScrollPosition()
        }
      } else if (hasDrawerClosed || (hasModalClosed && !nextDrawerOpen)) {
        this.unfixBackgroundAndScrollToLastPosition(isIos)
      }
    }
  }

  clickContentOverlay = (evt) => {
    const {
      toggleTopNavMenu,
      topNavMenuOpen,
      modalOpen,
      toggleProductsSearchBar,
      productsSearchOpen,
      closeMiniBag,
      setTimeout,
      hideSizeGuide,
      sizeGuideOpen,
      onClick,
      setModalCancelled,
      isMovingProductToWishlist,
      clearMovingProductToWishlist,
    } = this.props

    if (modalOpen) setModalCancelled(true)
    if (evt) evt.stopPropagation()
    if (topNavMenuOpen) setTimeout(toggleTopNavMenu, 10)
    if (productsSearchOpen) toggleProductsSearchBar()
    if (sizeGuideOpen) setTimeout(hideSizeGuide, 10)
    if (!modalOpen) setTimeout(closeMiniBag, 10)
    if (isMovingProductToWishlist) clearMovingProductToWishlist()
    return onClick()
  }

  render() {
    const { showOverlay, modalOpen } = this.props
    const contentOverlayState = showOverlay ? '' : ' is-hidden'
    const modalModifier = modalOpen ? ' ContentOverlay--modalOpen' : ''
    return (
      <div // eslint-disable-line jsx-a11y/no-static-element-interactions
        className={`ContentOverlay${modalModifier}${contentOverlayState}`}
        onClick={showOverlay ? this.clickContentOverlay : () => {}}
      />
    )
  }
}

export default ContentOverlay
