import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Swatch from '../Swatch/Swatch'
import * as swatchesActions from '../../../actions/common/swatchesActions'
import { getRouteFromUrl } from '../../../lib/get-product-route'

@connect(
  (state) => ({
    location: state.routing.location,
  }),
  swatchesActions
)
class SwatchList extends Component {
  static propTypes = {
    productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    swatches: PropTypes.array,
    selected: PropTypes.number,
    maxSwatches: PropTypes.number,
    page: PropTypes.number,
    nextSwatches: PropTypes.func,
    prevSwatches: PropTypes.func,
    pageClass: PropTypes.string,
    onSelect: PropTypes.func,
    seoUrl: PropTypes.string,
    resetSwatchesPage: PropTypes.func,
    onSwatchClick: PropTypes.func,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  getPrevButton = (productId) => {
    const { l } = this.context
    const { seoUrl } = this.props
    return (
      <Link
        key={`prev-${productId}`}
        className="SwatchList-button SwatchList-button--prev"
        onClick={this.prevSwatches.bind(this, productId)} // eslint-disable-line react/jsx-no-bind
        to={getRouteFromUrl(seoUrl)}
      >
        {l`See Prev`}
      </Link>
    )
  }

  getNextButton = (productId) => {
    const { l } = this.context
    const { seoUrl } = this.props
    return (
      <Link
        key={`next-${productId}`}
        className="SwatchList-button SwatchList-button--next"
        onClick={this.nextSwatches.bind(this, productId)} // eslint-disable-line react/jsx-no-bind
        to={getRouteFromUrl(seoUrl)}
      >
        {l`See More`}
      </Link>
    )
  }

  getSwatch(swatch, index) {
    const {
      onSelect,
      pageClass,
      selected: selectedIndex,
      onSwatchClick,
    } = this.props
    const props = {
      key: index,
      index,
      selected: selectedIndex === index,
      onSelect,
      onSwatchClick,
    }
    return (
      <Swatch
        className={pageClass ? `Swatch--${pageClass}` : ''}
        {...props}
        {...swatch}
      />
    )
  }

  getSwatchesInRows(swatches) {
    return (
      <div className="SwatchList-row">
        {swatches.map((swatch, index) => this.getSwatchInCell(swatch, index))}
      </div>
    )
  }

  getSwatchInCell(swatch, selected) {
    return (
      <div className="SwatchList-cell" key={selected}>
        {swatch && this.getSwatch(swatch, selected)}
      </div>
    )
  }

  prevSwatches(productId, e) {
    e.preventDefault()
    e.stopPropagation()
    this.props.prevSwatches(productId)
  }

  nextSwatches(productId, e) {
    e.preventDefault()
    e.stopPropagation()
    this.props.nextSwatches(productId)
  }

  getMaxOffset = (numSwatches, maxSwatches) =>
    numSwatches > maxSwatches ? numSwatches - maxSwatches : 0

  createSwatchList = ({
    swatches,
    offset,
    beginSliceIndex,
    endSliceIndex,
    addPrevBtn,
    addNextBtn,
    productId,
    maxOffset,
  }) => {
    // Create a new list with or without a previous button
    const list = addPrevBtn ? [this.getPrevButton(productId)] : []
    // Add a next button if required
    const nextBtn = addNextBtn && maxOffset ? this.getNextButton(productId) : []
    // If swatches length is more than "maxOffset" slice swatches
    const slice = maxOffset ? [beginSliceIndex, endSliceIndex] : []
    // Apply "swatchOffset" if add previous button is true
    const swatchOffset = addPrevBtn ? offset + 1 : offset

    return list
      .concat(
        swatches
          .slice(...slice)
          .map((swatch, i) => this.getSwatch(swatch, swatchOffset + i))
      )
      .concat(nextBtn)
  }

  renderSwatches(
    swatches,
    maxSwatches,
    productId,
    offset,
    pageClass,
    resetSwatchesPage
  ) {
    // If component is loaded on PDP, no carousel.
    const noPaging = swatches.length === maxSwatches
    if (pageClass === 'pdp' && noPaging) {
      return this.getSwatchesInRows(swatches)
    }

    // The width of the parent container can not fit the number of swatches a
    // carousel is implemented starting from here.
    const { length: numSwatches } = swatches
    const maxOffset = this.getMaxOffset(numSwatches, maxSwatches)
    const args = {
      swatches,
      offset,
      beginSliceIndex: 0,
      endSliceIndex: 0,
      addPrevBtn: false,
      addNextBtn: false,
      productId,
      maxOffset,
    }

    // PATCH -
    // Changing the grid layout and resizing the browser will break the carousel.
    // Reset the swatches page back to zero will fix this issue
    if (maxSwatches + offset > numSwatches && maxSwatches < numSwatches) {
      resetSwatchesPage()
    }

    // Start of the swatch list, add next button
    if (offset === 0) {
      args.endSliceIndex = maxSwatches - 1
      args.addNextBtn = true
    }

    // Add previous button
    if (offset > 0) {
      args.beginSliceIndex = offset + 1
      args.endSliceIndex = args.beginSliceIndex + maxSwatches - 2
      args.addPrevBtn = true
      args.addNextBtn = true

      // End of the swatch list, remove next button.
      if (offset === maxOffset) {
        args.beginSliceIndex = offset + 1
        args.endSliceIndex = offset + maxSwatches
        args.addNextBtn = false
      }
    }

    return this.createSwatchList(args)
  }

  render() {
    const {
      swatches,
      maxSwatches,
      productId,
      page: offset,
      pageClass,
      resetSwatchesPage,
    } = this.props
    return (
      <div
        className={`SwatchList${pageClass ? ` SwatchList--${pageClass}` : ''}`}
      >
        {swatches &&
          swatches.length > 0 &&
          this.renderSwatches(
            swatches,
            maxSwatches,
            productId,
            offset,
            pageClass,
            resetSwatchesPage
          )}
      </div>
    )
  }
}

export default SwatchList
