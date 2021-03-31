import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Select from '../FormComponents/Select/Select'
import { path } from 'ramda'
import SizeGuide from '../SizeGuide/SizeGuide'
import {
  initForm,
  setFormField,
  setFormMessage,
} from '../../../actions/common/formActions'
import {
  sendAnalyticsClickEvent,
  GTM_ACTION,
  GTM_CATEGORY,
} from '../../../analytics'
import { isMobile } from '../../../selectors/viewportSelectors'

// Libs/Helpers
import { isLowStockProduct } from '../../../lib/products-utils'

@connect(
  (state) => ({
    addToBagForm: state.forms.bundlesAddToBag,
    isMobile: isMobile(state),
  }),
  {
    initForm,
    setFormField,
    setFormMessage,
    sendAnalyticsClickEvent,
  }
)
class BundlesSizes extends Component {
  static propTypes = {
    addToBagForm: PropTypes.object.isRequired,
    attributes: PropTypes.object,
    items: PropTypes.array.isRequired,
    productId: PropTypes.number.isRequired,
    initForm: PropTypes.func,
    setFormField: PropTypes.func,
    isMobile: PropTypes.bool,
    stockThreshold: PropTypes.number,
    sendAnalyticsClickEvent: PropTypes.func,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  componentDidMount() {
    const { productId, initForm } = this.props
    initForm('bundlesAddToBag', productId)
  }

  getOptionValue = (item) => {
    const { l } = this.context
    const outOfStock = item.quantity === 0 ? `: ${l`Out of stock`}` : ''
    const lowStock = this.isLowStock(item) ? `: ${l`Low stock`}` : ''
    return `${l`Size`} ${item.size}${outOfStock}${lowStock}`
  }

  isLowStock = (item) => {
    const { stockThreshold } = this.props
    return (
      item &&
      item.quantity !== 0 &&
      isLowStockProduct(item.quantity, stockThreshold)
    )
  }

  handleChange = (event) => {
    const { productId, setFormField, sendAnalyticsClickEvent } = this.props
    const selectedSizeIndex = path(['target', 'selectedIndex'], event)
    const selectedSizeText = path(['target', selectedSizeIndex, 'text'], event)

    setFormField('bundlesAddToBag', 'size', event.target.value, productId)
    sendAnalyticsClickEvent({
      category: GTM_CATEGORY.BUNDLE,
      action: GTM_ACTION.CLICKED,
      label: `${GTM_ACTION.SIZE_SELECTED} ${selectedSizeText}`,
    })
  }

  render() {
    const { addToBagForm, items, attributes, productId, isMobile } = this.props
    const { l } = this.context
    const currentSize = path(
      [productId, 'fields', 'size', 'value'],
      addToBagForm
    )
    const message = path([productId, 'message', 'message'], addToBagForm)
    const sizes = items.map((item) => ({
      value: item.sku,
      label: this.getOptionValue(item),
      disabled: item.quantity === 0,
    }))

    return (
      <div className="BundlesSizes" data-product-id={productId}>
        <Select
          className="BundlesSizes-size"
          onChange={this.handleChange}
          options={sizes}
          label=""
          name={`bundleSize:${productId}`}
          value={currentSize || l`Select size`}
          firstDisabled={l`Select size`}
        />

        {!currentSize && message ? (
          <p className="BundlesSizes-error">{message}</p>
        ) : null}

        <SizeGuide
          type="bundles"
          attributes={attributes}
          items={items}
          openDrawer={!isMobile}
        />
      </div>
    )
  }
}

export default BundlesSizes
