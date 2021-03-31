import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {
  productSchema,
  breadcrumbListSchema,
  storeSchema,
} from '../../../lib/seo-schemas'

@connect((state) => ({
  brandUrl: state.routing.location.hostname,
  brandName: state.config.brandName,
  currencyCode: state.siteOptions.currencyCode,
}))
class SeoSchema extends Component {
  static propTypes = {
    type: PropTypes.string,
    data: PropTypes.object,
    brandUrl: PropTypes.string,
    brandName: PropTypes.string,
    location: PropTypes.object,
    currencyCode: PropTypes.string,
    productSchema: PropTypes.func,
    breadcrumbListSchema: PropTypes.func,
    storeSchema: PropTypes.func,
  }

  static defaultProps = {
    productSchema,
    breadcrumbListSchema,
    storeSchema,
  }

  getJSONLD() {
    const {
      type,
      data,
      brandUrl,
      brandName,
      location,
      currencyCode,
      productSchema,
      breadcrumbListSchema,
      storeSchema,
    } = this.props

    switch (type) {
      case 'Product':
        return productSchema(
          data,
          brandName,
          brandUrl + location.pathname,
          currencyCode
        )

      case 'BreadcrumbList':
        return breadcrumbListSchema(data)

      case 'Store':
        return storeSchema(data)

      default:
        return null
    }
  }

  render() {
    const data = this.getJSONLD()

    if (!data) return null

    return (
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
    )
  }
}

export default SeoSchema
