import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { browserHistory } from 'react-router'

import Button from '../../common/Button/Button'

const WISHLIST_ICON = `<i class='EmptyWishlist-wishlistIcon'></i>`

class EmptyWishlist extends Component {
  static propTypes = {
    isUserAuthenticated: PropTypes.bool,
    onSignInHandler: PropTypes.func,
    visited: PropTypes.array.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  continueShoppingHandler = () => {
    const { visited } = this.props
    const excludedRoutes = [
      '/wishlist',
      '/login',
      '/my-account',
      '/order-complete',
    ]
    if (visited.length <= 1) {
      browserHistory.replace('/')
      return
    }
    const prevRoute = visited[visited.length - 2] // gets prev routes for array lengths 2 and over
    const checkExcluded = excludedRoutes.filter((route) =>
      prevRoute.includes(route)
    )
    return checkExcluded.length > 0
      ? browserHistory.replace('/')
      : browserHistory.goBack()
  }

  render() {
    const { l } = this.context
    const { isUserAuthenticated, onSignInHandler } = this.props

    return (
      <div className="EmptyWishlist">
        <span
          className="EmptyWishlist-message"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: l`Select the ${WISHLIST_ICON} icon next to our products to save them to your Wishlist.`,
          }}
        />
        <Button
          className="EmptyWishlist-continueButton"
          clickHandler={this.continueShoppingHandler}
        >
          {l`Continue Shopping`}
        </Button>
        {!isUserAuthenticated && (
          <span className="EmptyWishlist-message">
            {l`Or `}
            <button
              className="EmptyWishlist-signInButton"
              onClick={onSignInHandler}
            >
              {l`Sign In`}
            </button>
            {l` to retrieve previous Wishlists.`}
          </span>
        )}
      </div>
    )
  }
}

export default EmptyWishlist
