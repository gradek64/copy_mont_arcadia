import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import FeatureCheck from '../../common/FeatureCheck/FeatureCheck'
import { getRouteFromUrl } from '../../../lib/get-product-route'

export default class ProductsBreadCrumbs extends React.Component {
  static propTypes = {
    breadcrumbs: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        url: PropTypes.string,
      })
    ),
  }

  static defaultProps = {
    breadcrumbs: [],
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  render() {
    const { l } = this.context
    const { breadcrumbs } = this.props
    if (breadcrumbs.length === 0) {
      return null
    }
    return (
      <FeatureCheck flag="FEATURE_DESKTOP_DISPLAY_PRODUCTS_BREADCRUMB">
        <ol
          itemType="http://schema.org/BreadcrumbList"
          itemScope
          className="ProductsBreadCrumbs"
        >
          {breadcrumbs.map(({ label, category = '', url }, index) => {
            const breadcrumbLabel = label === 'Home' ? l`Home` : label
            return (
              <li
                itemType="http://schema.org/ListItem"
                itemProp="itemListElement"
                itemScope
                className="ProductsBreadCrumbs-item"
                key={`${label},${category}`}
              >
                {url ? (
                  <Link itemProp="item" to={getRouteFromUrl(url)}>
                    <span itemProp="name">{breadcrumbLabel}</span>
                    <meta itemProp="position" content={index + 1} />
                  </Link>
                ) : (
                  <span>
                    <span itemProp="name">{breadcrumbLabel}</span>
                    <meta itemProp="position" content={index + 1} />
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </FeatureCheck>
    )
  }
}
