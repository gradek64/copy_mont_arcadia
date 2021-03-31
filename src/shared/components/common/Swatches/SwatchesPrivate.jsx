import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SwatchList from '../SwatchList/SwatchList'
import { connect } from 'react-redux'
import { selectSwatch } from '../../../actions/common/swatchesActions'
import QubitReact from 'qubit-react/wrapper'

import { getColourSwatchesIndex } from '../../../lib/products-utils'

@connect(
  (state) => ({
    swatchProducts: state.swatches.products,
  }),
  { selectSwatch }
)
class SwatchesPrivate extends Component {
  static propTypes = {
    swatches: PropTypes.array,
    maxSwatches: PropTypes.number,
    productId: PropTypes.number,
    name: PropTypes.string,
    selectedId: PropTypes.number,
    onSelect: PropTypes.func,
    showAllColours: PropTypes.bool,
    swatchProducts: PropTypes.object,
    selectSwatch: PropTypes.func,
    pageClass: PropTypes.string,
    seoUrl: PropTypes.string,
    lineNumber: PropTypes.string,
  }

  static defaultProps = {
    lineNumber: '',
  }

  onSwatchSelect = (swatches, e, index) => {
    e.stopPropagation()
    const { onSelect, productId, selectSwatch } = this.props
    // someone overwrote the default onSelect behaviour
    if (onSelect) return onSelect(e, swatches[index])

    // Default behaviour fire the action
    selectSwatch(productId, index)
  }

  getSwatchList(productId, name, swatches, selected, maxSwatches, page) {
    const { pageClass, seoUrl } = this.props
    const props = {
      maxSwatches,
      swatches,
      name,
      productId,
      selected,
      page,
      pageClass,
      onSelect: this.onSwatchSelect.bind(this, swatches),
      seoUrl,
    }

    return (
      <QubitReact
        id="qubit-plp-color-swatches-replacement"
        swatches={swatches}
        pageClass={pageClass}
      >
        {<SwatchList {...props} />}
      </QubitReact>
    )
  }

  getSelectedIndexFromId = (swatches, selectedId) =>
    swatches.findIndex(({ productId }) => selectedId.toString() === productId)

  render() {
    const {
      maxSwatches,
      productId,
      name,
      showAllColours,
      selectedId,
      swatchProducts,
      swatches,
      lineNumber,
    } = this.props

    // No swatches to render - go away.
    if (!swatches || swatches.length < 2) return null

    if (showAllColours) {
      const selected = this.getSelectedIndexFromId(swatches, selectedId)
      return this.getSwatchList(
        productId,
        name,
        swatches,
        selected,
        swatches.length,
        0
      )
    }

    // Not showing all colours here, use SwatchList pagination from the store
    const swatchProduct = swatchProducts[productId] || {
      selected: getColourSwatchesIndex(lineNumber, swatches),
    }
    const { selected = 0, page = 0 } = swatchProduct
    return this.getSwatchList(
      productId,
      name,
      swatches,
      selected,
      maxSwatches,
      page
    )
  }
}

export default SwatchesPrivate
