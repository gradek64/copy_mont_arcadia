import PropTypes from 'prop-types'
import React from 'react'

const ProductQuickViewButton = ({ onClick }) => (
  <button className="ProductQuickViewButton" onClick={onClick}>
    <span className="screen-reader-text">Open quick view</span>
  </button>
)

ProductQuickViewButton.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default ProductQuickViewButton
