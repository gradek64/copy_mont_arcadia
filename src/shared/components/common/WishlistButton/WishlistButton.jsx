import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import WishlistButtonContainer from './WishlistButtonContainer'

import { isProductAddedToWishlist } from '../../../selectors/wishlistSelectors'
import { isUserAtLeastPartiallyAuthenticated } from '../../../selectors/userAuthSelectors'

class WishlistButton extends Component {
  static propTypes = {
    productId: PropTypes.number.isRequired,
    modifier: PropTypes.oneOf(['plp', 'pdp', 'quickview', 'bundle']).isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    isAddedToWishlist: PropTypes.bool.isRequired,
    afterAddToWishlist: PropTypes.func,
    renderRemoveFromWishlistText: PropTypes.func,
    renderAddToWishlistText: PropTypes.func,
    isFromQuickView: PropTypes.bool,
    productDetails: PropTypes.object.isRequired,
  }

  static defaultProps = {
    isAuthenticated: false,
    isAddedToWishlist: false,
    isFromQuickView: false,
  }

  render() {
    const {
      productId,
      modifier,
      isAuthenticated,
      isAddedToWishlist,
      afterAddToWishlist,
      renderRemoveFromWishlistText,
      renderAddToWishlistText,
      isFromQuickView,
      productDetails,
    } = this.props
    return (
      <WishlistButtonContainer
        productId={productId}
        modifier={modifier}
        isAuthenticated={isAuthenticated}
        isAddedToWishlist={isAddedToWishlist}
        afterAddToWishlist={afterAddToWishlist}
        renderRemoveFromWishlistText={renderRemoveFromWishlistText}
        renderAddToWishlistText={renderAddToWishlistText}
        isFromQuickView={isFromQuickView}
        productDetails={productDetails}
      />
    )
  }
}

const mapStateToProps = (state, { productId }) => ({
  isAddedToWishlist: isProductAddedToWishlist(state, productId),
  isAuthenticated: isUserAtLeastPartiallyAuthenticated(state),
})
export default connect(mapStateToProps)(WishlistButton)
