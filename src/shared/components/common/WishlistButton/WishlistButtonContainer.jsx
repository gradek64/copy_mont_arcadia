import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import WishlistButtonComponent from './WishlistButtonComponent'

import WishlistLoginModal from '../../containers/Wishlist/WishlistLoginModal'

import {
  triggerWishlistLoginModal,
  addToWishlist,
  removeProductFromWishlist,
} from '../../../actions/common/wishlistActions'

class WishlistButtonContainer extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    isAddedToWishlist: PropTypes.bool.isRequired,
    modifier: PropTypes.oneOf(['plp', 'pdp', 'quickview', 'bundle', 'minibag'])
      .isRequired,
    productId: PropTypes.number.isRequired,
    addToWishlist: PropTypes.func.isRequired,
    triggerWishlistLoginModal: PropTypes.func.isRequired,
    removeProductFromWishlist: PropTypes.func.isRequired,
    onClickPreHook: PropTypes.func,
    afterAddToWishlist: PropTypes.func,
    onAuthenticationPreHook: PropTypes.func,
    onCancelLogin: PropTypes.func,
    renderRemoveFromWishlistText: PropTypes.func,
    renderAddToWishlistText: PropTypes.func,
    isFromQuickView: PropTypes.bool,
    productDetails: PropTypes.object.isRequired,
  }

  static defaultProps = {
    isAuthenticated: false,
    isAddedToWishlist: false,
    onClickPreHook: null,
    removeProductFromWishlistOverride: null,
    afterAddToWishlist: null,
    onAuthenticationPreHook: null,
    onCancelLogin: null,
    isFromQuickView: false,
  }

  // @NOTE isAddedToWishlist will be used only to initialize the 'selected' state
  constructor(props) {
    super(props)
    this.state = {
      isInWishlist: props.isAddedToWishlist,
      isAdding: false,
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // @NOTE Syncing local state `isInWishlist` with `isAddedToWishlist`
    if (
      this.props.isAddedToWishlist !== nextProps.isAddedToWishlist &&
      nextProps.isAddedToWishlist !== this.state.isInWishlist
    ) {
      this.setState({
        isInWishlist: nextProps.isAddedToWishlist,
      })
    }
  }

  handleWishlistClick = (e) => {
    e.preventDefault()
    const { isInWishlist } = this.state
    const {
      productId,
      isAuthenticated,
      triggerWishlistLoginModal,
      modifier,
      onAuthenticationPreHook,
      onClickPreHook,
      afterAddToWishlist,
      onCancelLogin,
      isFromQuickView,
      productDetails,
    } = this.props

    if (this.state.isAdding) return
    if (onClickPreHook) onClickPreHook()

    if (isAuthenticated) {
      return isInWishlist
        ? this.removeFromWishlistOptimistic()
        : this.addToWishlistOptimistic()
    }

    const actions = []
    if (onAuthenticationPreHook) actions.push(onAuthenticationPreHook())

    actions.push(
      triggerWishlistLoginModal(
        productId,
        WishlistLoginModal,
        modifier,
        afterAddToWishlist,
        onCancelLogin,
        isFromQuickView,
        productDetails
      )
    )

    return Promise.all(actions)
  }

  addToWishlistOptimistic = () => {
    const {
      productId,
      addToWishlist,
      modifier,
      afterAddToWishlist,
      productDetails,
    } = this.props

    this.setState({ isInWishlist: true, isAdding: true })

    return addToWishlist(productId, modifier, productDetails)
      .then(() => {
        if (afterAddToWishlist) return afterAddToWishlist()
      })
      .catch(() => {
        this.setState({ isInWishlist: false })
      })
      .then(() => {
        this.setState({ isAdding: false })
      })
  }

  removeFromWishlistOptimistic = () => {
    const {
      productId,
      modifier,
      removeProductFromWishlist,
      productDetails,
    } = this.props

    this.setState({ isInWishlist: false })

    return removeProductFromWishlist({
      productId,
      modifier,
      productDetails,
      reportToGA: true,
    }).catch(() => {
      this.setState({ isInWishlist: true })
    })
  }

  render() {
    const {
      modifier,
      renderAddToWishlistText,
      renderRemoveFromWishlistText,
    } = this.props
    return (
      <WishlistButtonComponent
        onClick={this.handleWishlistClick}
        isSelected={this.state.isInWishlist}
        isAdding={this.state.isAdding}
        modifier={modifier}
        renderAddToWishlistText={renderAddToWishlistText}
        renderRemoveFromWishlistText={renderRemoveFromWishlistText}
      />
    )
  }
}

const mapDispatchToProps = {
  triggerWishlistLoginModal,
  addToWishlist,
  removeProductFromWishlist,
}

export default connect(
  null,
  mapDispatchToProps
)(WishlistButtonContainer)
