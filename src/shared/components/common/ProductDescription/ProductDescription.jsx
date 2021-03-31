import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { heDecode } from '../../../lib/html-entities'

// components
import ProductDescriptionSeeMore from '../ProductDescriptionSeeMore/ProductDescriptionSeeMore'

export default class ProductDescription extends Component {
  static propTypes = {
    description: PropTypes.string.isRequired,
    className: PropTypes.string,
    seeMoreValue: PropTypes.arrayOf(
      PropTypes.shape({
        seeMoreLabel: PropTypes.string,
        seeMoreUrl: PropTypes.string,
      })
    ),
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    seeMoreValue: [],
  }

  render() {
    const { l } = this.context
    const { children, description, className, seeMoreValue } = this.props

    return (
      <div className={`ProductDescription ${className}`}>
        <div className="ProductDescription-productDetails">
          <h3 className="ProductDescription-title">{l`Product details`}</h3>
          <div className="ProductDescription-productDetailText">
            <div
              className="ProductDescription-content"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: heDecode(description) }}
            />
            {children}
          </div>
        </div>
        <ProductDescriptionSeeMore seeMoreValue={seeMoreValue} />
      </div>
    )
  }
}
