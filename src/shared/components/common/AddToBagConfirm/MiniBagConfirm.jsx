import classnames from 'classnames'
import PropTypes from 'prop-types'
import { propEq, sort } from 'ramda'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

// actions
import {
  openMiniBag,
  showMiniBagConfirm,
} from '../../../actions/common/shoppingBagActions'

// components
import OrderProduct from '../OrderProducts/OrderProduct'
import ToolTip from '../ToolTip/ToolTip'
import Button from '../Button/Button'

class MiniBagConfirm extends Component {
  static propTypes = {
    isShown: PropTypes.bool,
    quantity: PropTypes.number,
    products: PropTypes.array,
    redirectTo: PropTypes.func,
    setTimeout: PropTypes.func,
    clearTimeout: PropTypes.func,
    // actions
    showMiniBagConfirm: PropTypes.func.isRequired,
    openMiniBag: PropTypes.func.isRequired,
  }

  static defaultProps = {
    isShown: false,
    quantity: 0,
    products: [],
    redirectTo:
      typeof browserHistory !== 'undefined' && 'push' in browserHistory
        ? browserHistory.push
        : () => {},
    setTimeout:
      typeof window !== 'undefined' && 'setTimeout' in window
        ? window.setTimeout.bind(window)
        : () => {},
    clearTimeout:
      typeof window !== 'undefined' && 'clearTimeout' in window
        ? window.clearTimeout.bind(window)
        : () => {},
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  timeoutID = undefined

  componentDidUpdate(prevProps) {
    const { isShown, setTimeout, showMiniBagConfirm } = this.props
    if (!prevProps.isShown && isShown) {
      this.timeoutID = setTimeout(() => {
        showMiniBagConfirm(false)
        this.timeoutID = undefined
      }, 6000)
    }
  }

  componentWillUnmount() {
    this.props.clearTimeout(this.timeoutID)
  }

  closeAndRun = (func) => (evt) => {
    if (evt) evt.stopPropagation()
    this.closePopup()
    func()
  }

  closePopup = () => {
    const { setTimeout, showMiniBagConfirm } = this.props
    this.timeoutID = setTimeout(() => {
      showMiniBagConfirm(false)
      this.timeoutID = undefined
    }, 200)
  }

  render() {
    const { l } = this.context
    const { isShown, products, quantity, openMiniBag, redirectTo } = this.props
    const hydratedProducts = products.map((product) => ({
      ...product,
      quantity,
      totalPrice: parseFloat(product.unitPrice) * quantity,
    }))
    const className = classnames('MiniBagConfirm', {
      'is-visible': isShown && hydratedProducts.length,
    })

    return (
      <div className={className}>
        <ToolTip>
          <div className="MiniBagConfirm-content">
            <button
              className="MiniBagConfirm-closeIcon Modal-closeIcon"
              onClick={this.closePopup}
            >
              <span className="screen-reader-text">Close confirmation</span>
            </button>
            <ul className="MiniBagConfirm-products">
              {hydratedProducts.map((product) => (
                <li key={product.productId}>
                  <OrderProduct {...product} />
                </li>
              ))}
            </ul>
            <Button
              className="MiniBagConfirm-goToCheckout"
              clickHandler={this.closeAndRun(
                redirectTo.bind(null, '/checkout')
              )} // eslint-disable-line react/jsx-no-bind
            >{l`Checkout now`}</Button>
            <Button
              className="MiniBagConfirm-viewBag Button--secondary"
              clickHandler={this.closeAndRun(openMiniBag)}
            >{l`View bag`}</Button>
          </div>
        </ToolTip>
      </div>
    )
  }
}

const sortProducts = (bundleProducts, products) => {
  return sort(({ productId: productOneId }, { productId: productTwoId }) => {
    return (
      bundleProducts.findIndex(propEq('productId', productOneId)) -
      bundleProducts.findIndex(propEq('productId', productTwoId))
    )
  }, products)
}

export default connect(
  ({
    currentProduct: { bundleProducts = [] } = {},
    shoppingBag: { recentlyAdded },
  }) => ({
    isShown: recentlyAdded.isMiniBagConfirmShown,
    quantity: recentlyAdded.quantity,
    products: sortProducts(bundleProducts, recentlyAdded.products),
  }),
  { showMiniBagConfirm, openMiniBag }
)(MiniBagConfirm)

export { MiniBagConfirm as WrappedMiniBagConfirm }
