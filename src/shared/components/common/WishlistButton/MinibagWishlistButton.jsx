import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  setMovingProductToWishlist,
  clearMovingProductToWishlist,
} from '../../../actions/common/wishlistActions'
import WishlistButtonContainer from './WishlistButtonContainer'

import {
  isMovingProductToWishlist,
  isProductAddedToWishlist,
} from '../../../selectors/wishlistSelectors'
import { isUserAuthenticated } from '../../../selectors/userAuthSelectors'
import QubitReact from 'qubit-react/wrapper'

// this component effectively overrides the standard WishlistButton behaviour
// making it not a toggle, but a one-way 'push product into the wishlist' button
// if the user is authenticated and the product is already in the wishlist, it does not render
// if, after authentication, the product is found to be already in the wishlist, it does nothing except what it
// would have done after adding to the wishlist for real
// it keeps track of whether a product is in the process of being added to the wishlist (movingProductToWishlist)
//   and uses this to override the standard 'display as selected' logic
// i.e. it only displays as selected (filled) during an 'add' operation
class MinibagWishlistButton extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    isAddedToWishlist: PropTypes.bool.isRequired,
    movingProductToWishlist: PropTypes.bool,
    setMovingProductToWishlist: PropTypes.func,
    clearMovingProductToWishlist: PropTypes.func,
    afterAddToWishlist: PropTypes.func.isRequired,
    productId: PropTypes.number.isRequired,
    renderRemoveFromWishlistText: PropTypes.func,
    renderAddToWishlistText: PropTypes.func,
    onAuthenticationPreHook: PropTypes.func,
    productDetails: PropTypes.object.isRequired,
  }
  static defaultProps = {
    afterAddToWishlist: () => Promise.resolve(),
    isAuthenticated: false,
    isAddedToWishlist: false,
  }

  onClickPreHook = () => {
    const { productId, setMovingProductToWishlist } = this.props
    return setMovingProductToWishlist(productId)
  }

  afterAddToWishlist = () => {
    const { afterAddToWishlist, clearMovingProductToWishlist } = this.props
    return afterAddToWishlist()
      .catch(() => null)
      .then(clearMovingProductToWishlist)
  }

  render() {
    const {
      clearMovingProductToWishlist,
      isAddedToWishlist,
      isAuthenticated,
      movingProductToWishlist,
      productId,
      renderRemoveFromWishlistText,
      renderAddToWishlistText,
      onAuthenticationPreHook,
      productDetails,
    } = this.props
    if (isAuthenticated && isAddedToWishlist && !movingProductToWishlist)
      return null
    return (
      <QubitReact
        id="exp-349-wishlist-phrase-change-186709"
        renderAddToWishlistText={renderAddToWishlistText}
      >
        <WishlistButtonContainer
          productId={productId}
          productDetails={productDetails}
          modifier={'minibag'}
          isAuthenticated={isAuthenticated}
          isAddedToWishlist={isAddedToWishlist}
          renderRemoveFromWishlistText={renderRemoveFromWishlistText}
          renderAddToWishlistText={renderAddToWishlistText}
          onAuthenticationPreHook={onAuthenticationPreHook}
          onClickPreHook={this.onClickPreHook}
          afterAddToWishlist={this.afterAddToWishlist}
          onCancelLogin={clearMovingProductToWishlist}
        />
      </QubitReact>
    )
  }
}

const mapStateToProps = (state, { productId }) => ({
  isAddedToWishlist: isProductAddedToWishlist(state, productId),
  movingProductToWishlist: isMovingProductToWishlist(state, productId),
  isAuthenticated: isUserAuthenticated(state),
})
const mapDispatchToActions = {
  setMovingProductToWishlist,
  clearMovingProductToWishlist,
}

export default connect(
  mapStateToProps,
  mapDispatchToActions
)(MinibagWishlistButton)
