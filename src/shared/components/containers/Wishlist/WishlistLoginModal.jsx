import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Login from '../Login/Login'
import Register from '../Register/Register'
import ForgetPassword from '../ForgetPassword/ForgetPassword'

import {
  addToWishlistAfterLogin,
  captureWishlistEvent,
  getPaginatedWishlist,
} from '../../../actions/common/wishlistActions'
import {
  closeModal,
  clearModalChildren,
} from '../../../actions/common/modalActions'

import { getRoutePathWithParams } from '../../../selectors/routingSelectors'

if (process.browser) {
  require('./WishlistLoginModal.css')
}

@connect(
  (state) => ({
    relativePath: getRoutePathWithParams(state),
    isModalCancelled: state.modal.cancelled,
    pendingProductId: state.wishlist.pendingProductId,
  }),
  {
    addToWishlistAfterLogin,
    closeModal,
    getPaginatedWishlist,
    clearModalChildren,
    captureWishlistEvent,
  }
)
class WishlistLoginModal extends Component {
  static propTypes = {
    modifier: PropTypes.string,
    relativePath: PropTypes.string,
    pendingProductId: PropTypes.number,
    addToWishlistAfterLogin: PropTypes.func.isRequired,
    captureWishlistEvent: PropTypes.func,
    afterAddToWishlist: PropTypes.func,
    onCancelLogin: PropTypes.func,
    productDetails: PropTypes.object.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  componentDidMount() {
    const { modifier, captureWishlistEvent } = this.props

    captureWishlistEvent('GA_WISHLIST_MODAL_PAGE_VIEW', { modifier })
  }

  componentWillUnmount() {
    const {
      modifier,
      isModalCancelled,
      captureWishlistEvent,
      onCancelLogin,
    } = this.props
    if (isModalCancelled) {
      captureWishlistEvent('GA_WISHLIST_MODAL_CLOSE', { modifier })
      if (onCancelLogin) onCancelLogin()
    }
  }

  handleSuccess = (authType) => {
    const { modifier, captureWishlistEvent } = this.props

    if (authType) {
      const action = `GA_WISHLIST_${authType.toUpperCase()}_SUCCESS`
      captureWishlistEvent(action)
    }

    switch (modifier) {
      case 'wishlist':
        return this.wishlistPageHandler()
      case 'plp':
      case 'pdp':
      case 'quickview':
      case 'minibag':
      case 'bundle':
        return this.addToWishlistHandler()
      default:
        return this.loginUserHandler()
    }
  }

  handleError = (authType) => {
    const { captureWishlistEvent } = this.props
    const action = `GA_WISHLIST_${authType.toUpperCase()}_ERROR`

    captureWishlistEvent(action)
  }

  loginUserHandler = () => {
    const { closeModal, clearModalChildren } = this.props
    const actions = [closeModal(), clearModalChildren()]
    return Promise.all([actions])
  }

  wishlistPageHandler = () => {
    const { closeModal, clearModalChildren, getPaginatedWishlist } = this.props
    const actions = [closeModal(), clearModalChildren(), getPaginatedWishlist()]
    return Promise.all([actions])
  }

  addToWishlistHandler = () => {
    const {
      addToWishlistAfterLogin,
      afterAddToWishlist,
      clearModalChildren,
      closeModal,
      modifier,
      pendingProductId,
      productDetails,
    } = this.props
    const actions = [clearModalChildren(), closeModal()]

    return addToWishlistAfterLogin(
      pendingProductId,
      modifier,
      productDetails
    ).then(() => {
      return Promise.all(actions).then(() => {
        if (afterAddToWishlist) afterAddToWishlist()
      })
    })
  }

  render() {
    const { l } = this.context
    const { relativePath } = this.props

    return (
      <div className="WishlistLoginModal">
        <div className="WishlistLoginModal-header">
          <i className="WishlistLoginModal-heartIcon" />
          <header className="WishlistLoginModal-text">{l`Sign in to save products to your Wishlist`}</header>
        </div>
        <div className="WishlistLoginModal-forms">
          <div className="WishlistLoginModal-formContainer">
            <Login
              className="WishlistLoginModal-loginForm"
              successCallback={() => this.handleSuccess('login')}
              errorCallback={() => this.handleError('login')}
              formName="wishlistLoginModal"
            />
            <ForgetPassword className="WishlistLoginModal-forgetPassword" />
          </div>
          <div className="WishlistLoginModal-formContainer">
            <Register
              className="WishlistLoginModal-register"
              source="WISHLIST"
              successCallback={() => this.handleSuccess('register')}
              errorCallback={() => this.handleError('register')}
              getNextRoute={() => relativePath}
              formName="wishlistLoginModal"
            />
          </div>
        </div>
      </div>
    )
  }
}

export default WishlistLoginModal
