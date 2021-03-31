import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { scrollElementIntoView } from '../../../lib/scroll-helper'
import { getSelectedSKUs } from '../../../selectors/productSelectors'

// actions
import { setFormMessage } from '../../../actions/common/formActions'

// components
import AddToBag from '../../common/AddToBag/AddToBag'

const mapStateToProps = (state) => ({
  selectedSKUs: getSelectedSKUs(state),
})

const mapDispatchToProps = { setFormMessage }

class BundlesAddAll extends Component {
  static propTypes = {
    productId: PropTypes.number.isRequired,
    bundleProductIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    selectedSKUs: PropTypes.objectOf(PropTypes.string),
    deliveryMessage: PropTypes.string,
    getElement: PropTypes.func,
    scrollToElement: PropTypes.func,
    bundleProducts: PropTypes.arrayOf(PropTypes.object),
    // actions
    setFormMessage: PropTypes.func.isRequired,
  }

  static defaultProps = {
    selectedSKUs: {},
    deliveryMessage: '',
    getElement:
      typeof window !== 'undefined'
        ? document.querySelector.bind(document)
        : () => {},
    scrollToElement: scrollElementIntoView,
  }

  getUnselectedProducts = () => {
    const { bundleProductIds, selectedSKUs } = this.props
    return bundleProductIds.filter(
      (bundleProductId) => !(bundleProductId in selectedSKUs)
    )
  }

  shouldAddToBag = ({ showError = true } = {}) => {
    const { setFormMessage, getElement, scrollToElement } = this.props
    const unselectedProducts = this.getUnselectedProducts()

    if (unselectedProducts.length === 0) return true

    if (showError) {
      unselectedProducts.forEach((productId) => {
        setFormMessage(
          'bundlesAddToBag',
          'Please select your size to continue',
          productId
        )
      })
      // scroll to first, failing, size dropdown
      const element = getElement(`[data-product-id="${unselectedProducts[0]}"]`)
      scrollToElement(element, 400, 200)
    }
  }

  render() {
    const {
      productId,
      deliveryMessage,
      bundleProductIds,
      selectedSKUs,
      bundleProducts,
    } = this.props

    const bundleItems = bundleProductIds.reduce(
      (bundleItems, bundleProductId) => {
        if (bundleProductId in selectedSKUs) {
          const sku = selectedSKUs[bundleProductId]

          const getCatEntryIdFromItems = (sku) => {
            let item
            for (let i = 0; i < bundleProducts.length; i++) {
              item = bundleProducts[i].items.find((bundleItem) => {
                return bundleItem.sku === sku
              })

              if (item) return item.catEntryId
            }
          }

          const catEntryId = getCatEntryIdFromItems(sku)

          return [
            ...bundleItems,
            {
              productId: bundleProductId,
              sku,
              catEntryId,
            },
          ]
        }
        return bundleItems
      },
      []
    )

    return (
      <AddToBag
        productId={productId}
        bundleItems={bundleItems}
        quantity={bundleItems.length}
        message={deliveryMessage}
        shouldShowInlineConfirm
        shouldShowMiniBagConfirm
        shouldAddToBag={this.shouldAddToBag}
      />
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BundlesAddAll)

export {
  BundlesAddAll as WrappedBundlesAddAll,
  mapStateToProps,
  mapDispatchToProps,
}
