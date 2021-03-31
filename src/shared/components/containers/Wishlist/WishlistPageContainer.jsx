import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'
import { connect } from 'react-redux'
import { compose } from 'ramda'

/**
 * Actions
 */
import {
  getPaginatedWishlist,
  triggerWishlistLoginModal,
} from '../../../actions/common/wishlistActions'

/**
 * Selectors
 */
import { isUserAuthenticated } from '../../../selectors/userAuthSelectors'
import { isMobile } from '../../../selectors/viewportSelectors'
import {
  getWishlistItemDetails,
  isWishlistSync,
  getWishlistItemCount,
  isLoadingWishlistItemDetails,
  getWishlistPageNo,
} from '../../../selectors/wishlistSelectors'
import { getVisitedPaths } from '../../../selectors/routingSelectors'

/**
 * Helpers
 */
import { isIE11 } from '../../../lib/browser'

/**
 * Constants
 */
import { MAX_WISHLIST_ITEMS } from '../../../constants/wishlistConstants'

/**
 * Decorators
 */
import { withWindowScroll } from '../WindowEventProvider/withWindowScroll'
import analyticsDecorator from '../../../../client/lib/analytics/analytics-decorator'

/**
 * Components
 */
import EmptyWishlist from './EmptyWishlist'
import WishlistItemContainer from './WishlistItemContainer'
import WishlistLimitInfo from './WishlistLimitInfo'
import WishlistLoginModal from '../../containers/Wishlist/WishlistLoginModal'
import Loader from '../../common/Loader/Loader'

export class WishlistPageContainer extends Component {
  static propTypes = {
    isUserAuthenticated: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool,
    isWishlistSync: PropTypes.bool,
    totalItems: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(PropTypes.object),
    isLoadingItems: PropTypes.bool.isRequired,
    loadedPages: PropTypes.number.isRequired,
    preservedScroll: PropTypes.number,
    location: PropTypes.object,
    visited: PropTypes.array,
    hasReachedPageBottom: PropTypes.bool,
    // actions:
    getPaginatedWishlist: PropTypes.func,
    triggerWishlistLoginModal: PropTypes.func,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  componentDidMount = () => {
    if (!this.props.isWishlistSync) this.props.getPaginatedWishlist()

    // IE11 fix for react-router preserve scroll issue
    const { preservedScroll } = this.props
    const withPreservedScroll =
      process.browser &&
      this.props.location.action !== 'PUSH' &&
      preservedScroll
    if (isIE11() && withPreservedScroll) {
      window.scrollTo(0, preservedScroll)
    } else {
      window.scrollTo(0, 0)
    }
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (this.props.isLoadingItems) return
    /**
     * This is to handle updates to the Wishlist from else where.
     * If the product count changes we refetch the first page.
     * The list is ordered by recently added so any new things will always render at the top.
     */
    if (nextProps.totalItems !== this.props.totalItems) {
      this.props.getPaginatedWishlist()
    }
    if (
      nextProps.hasReachedPageBottom &&
      !this.props.hasReachedPageBottom &&
      this.getTotalLoadedItems() < this.props.totalItems
    ) {
      this.props.getPaginatedWishlist(this.props.loadedPages + 1)
    }
  }

  getTotalLoadedItems = (props = this.props) => {
    const { items } = props
    return Array.isArray(items) ? items.length : 0
  }

  onSignInHandler = () => {
    this.props.triggerWishlistLoginModal(null, WishlistLoginModal, 'wishlist')
  }

  renderEmptyWishlist = () => {
    const isEmpty =
      !this.props.isUserAuthenticated || this.props.totalItems === 0
    return (
      <CSSTransition
        classNames="fade"
        timeout={{ enter: 400, exit: 0 }}
        in={isEmpty}
        unmountOnExit
      >
        <EmptyWishlist
          isUserAuthenticated={this.props.isUserAuthenticated}
          onSignInHandler={this.onSignInHandler}
          visited={this.props.visited}
        />
      </CSSTransition>
    )
  }

  renderLoader = () => {
    // items are fetched client side but on SSR we know the user's totalItems.
    // Therefore, if totalItems !== 0, we should render a loader on SSR to
    // indicate that the items will be loaded when the app initialises
    const shouldShowLoaderOnSSR =
      this.props.isUserAuthenticated && this.props.totalItems
    const shouldShowLoader =
      (!process.browser && shouldShowLoaderOnSSR) || this.props.isLoadingItems
    return shouldShowLoader && <Loader />
  }

  render() {
    const { l } = this.context
    const { totalItems, items, isMobile } = this.props
    const grid = isMobile ? 2 : 4
    return (
      <div className="WishlistPageContainer">
        <h1 className="WishlistPageContainer-title">{l`My Wishlist`}</h1>
        {!!totalItems && (
          <span className="WishlistPageContainer-itemCount">
            {`${totalItems} ${totalItems === 1 ? l('item') : l('items')}`}
          </span>
        )}
        {this.renderEmptyWishlist()}
        {totalItems >= MAX_WISHLIST_ITEMS && (
          <WishlistLimitInfo withMarginTop />
        )}
        <CSSTransition
          classNames="fade"
          timeout={400}
          in={this.getTotalLoadedItems() > 0}
          unmountOnExit
        >
          <WishlistItemContainer items={items} grid={grid} />
        </CSSTransition>
        {this.renderLoader()}
        {this.getTotalLoadedItems() >= MAX_WISHLIST_ITEMS && (
          <WishlistLimitInfo />
        )}
      </div>
    )
  }
}

export default compose(
  analyticsDecorator('wishlist'),
  connect(
    (state) => ({
      isUserAuthenticated: isUserAuthenticated(state),
      isMobile: isMobile(state),
      isWishlistSync: isWishlistSync(state),
      totalItems: getWishlistItemCount(state),
      items: getWishlistItemDetails(state),
      isLoadingItems: isLoadingWishlistItemDetails(state),
      loadedPages: getWishlistPageNo(state),
      preservedScroll: state.infinityScroll.preservedScroll,
      visited: getVisitedPaths(state),
    }),
    {
      getPaginatedWishlist,
      triggerWishlistLoginModal,
    }
  ),
  withWindowScroll({
    notifyWhenReachedBottomOfPage: true,
    pageBottomBuffer: 700,
  })
)(WishlistPageContainer)
