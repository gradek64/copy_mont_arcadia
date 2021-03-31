import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectView } from '../../../actions/common/productViewsActions'
import { isProductViewSelected } from '../../../selectors/productViewsSelectors'
import { PRODUCT, OUTFIT } from '../../../constants/productImageTypes'

import { toggleFeature } from '../../../actions/common/featuresActions'

@connect(
  (state) => ({
    productViewSelected: isProductViewSelected(state),
  }),
  { selectView, toggleFeature }
)
class ProductViews extends Component {
  static propTypes = {
    productViewSelected: PropTypes.bool,
    className: PropTypes.string,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  renderButton = (name, viewType, isActive) => {
    const { l } = this.context
    const { selectView } = this.props
    return (
      <button
        aria-pressed={isActive}
        type="button"
        className={`Button ProductViews-button ${isActive ? 'is-active' : ''}`}
        onClick={() => selectView(viewType)}
      >
        {l(name)}
      </button>
    )
  }

  render() {
    const { productViewSelected, className } = this.props
    return (
      <div className={`ProductViews${className ? ` ${className}` : ''}`}>
        {this.renderButton('product', PRODUCT, productViewSelected)}
        {this.renderButton('outfit', OUTFIT, !productViewSelected)}
      </div>
    )
  }
}

export default ProductViews
