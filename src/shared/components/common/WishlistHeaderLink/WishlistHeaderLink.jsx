import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

/**
 * Helpers
 */
import { isIE11, isFF } from '../../../lib/browser'

import { getWishlistItemCount } from '../../../selectors/wishlistSelectors'
import { isUserAuthenticated } from '../../../selectors/userAuthSelectors'
import { isFeatureWishlistEnabled } from '../../../selectors/featureSelectors'

import { preserveScroll } from '../../../actions/common/infinityScrollActions'

class WishlistHeaderLink extends Component {
  static propTypes = {
    label: PropTypes.string,
    className: PropTypes.string,
    isAuthenticated: PropTypes.bool,
    isWishlistEnabled: PropTypes.bool,
    itemsCount: PropTypes.number,
    preserveScroll: PropTypes.func,
  }

  static defaultProps = {
    label: undefined,
    className: '',
    isAuthenticated: false,
    isWishlistEnabled: false,
    itemsCount: 0,
    preserveScroll: undefined,
  }

  iconClickHandler = () => {
    const scrollYPos = window.scrollY || window.pageYOffset
    if (isIE11() || isFF()) this.props.preserveScroll(scrollYPos)
  }

  render() {
    const {
      label,
      isAuthenticated,
      isWishlistEnabled,
      itemsCount,
      className,
    } = this.props
    const isSelected = isAuthenticated && itemsCount > 0

    return isWishlistEnabled ? (
      <Link
        onClick={this.iconClickHandler}
        className={`WishlistHeaderLink${className ? ` ${className}` : ``}`}
        to="/wishlist"
      >
        {label && <span className="WishlistHeaderLink-label">{label}</span>}
        <div
          className={`WishlistHeaderLink-icon${
            isSelected ? ' is-selected' : ''
          }`}
        />
      </Link>
    ) : null
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated: isUserAuthenticated(state),
  isWishlistEnabled: isFeatureWishlistEnabled(state),
  itemsCount: getWishlistItemCount(state),
})

const mapDispatchToProps = {
  preserveScroll,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WishlistHeaderLink)
