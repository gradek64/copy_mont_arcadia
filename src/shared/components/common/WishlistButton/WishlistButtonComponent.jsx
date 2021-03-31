import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import WishListIcon from '../WishList/WishListIcon'

class WishlistButtonComponent extends Component {
  static propTypes = {
    isSelected: PropTypes.bool,
    isAdding: PropTypes.bool,
    modifier: PropTypes.oneOf(['plp', 'pdp', 'quickview', 'minibag', 'bundle']),
    onClick: PropTypes.func,
    renderRemoveFromWishlistText: PropTypes.func,
    renderAddToWishlistText: PropTypes.func,
  }

  static defaultProps = {
    isAdding: false,
    isSelected: false,
  }

  renderWishlistText = () => {
    const {
      isSelected,
      renderAddToWishlistText,
      renderRemoveFromWishlistText,
    } = this.props

    if (isSelected) {
      return (
        renderRemoveFromWishlistText && (
          <span className="translate">{renderRemoveFromWishlistText()}</span>
        )
      )
    }
    return (
      renderAddToWishlistText && (
        <span className="translate">{renderAddToWishlistText()}</span>
      )
    )
  }

  render() {
    const { modifier, isSelected, onClick, isAdding } = this.props
    return (
      <button
        className={classNames(
          `WishlistButton`,
          'notranslate',
          modifier ? `WishlistButton--${modifier}` : null
        )}
        onClick={onClick}
      >
        <div>
          <span className="WishlistButton-icon">
            <WishListIcon
              id="wishlistIcon"
              modifier={modifier}
              isSelected={isSelected}
              isAdding={isAdding}
            />
          </span>
          {this.renderWishlistText()}
        </div>
      </button>
    )
  }
}

export default WishlistButtonComponent
