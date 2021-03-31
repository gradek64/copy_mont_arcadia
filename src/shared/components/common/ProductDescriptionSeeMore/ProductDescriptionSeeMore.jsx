import PropTypes from 'prop-types'
import React, { Component } from 'react'
import FeatureCheck from '../FeatureCheck/FeatureCheck'

export default class ProductDescriptionSeeMore extends Component {
  static propTypes = {
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
    seeMoreValue: [],
  }

  render() {
    const { l } = this.context
    const { seeMoreValue } = this.props

    if (seeMoreValue.length === 0) {
      return null
    }

    const seeMoreLinks = seeMoreValue.filter(({ seeMoreUrl }) =>
      Boolean(seeMoreUrl)
    )

    return (
      <FeatureCheck flag="FEATURE_PRODUCT_DESCRIPTION_SEE_MORE">
        <div className="ProductDescription-seeMore">
          <h3 className="ProductDescription-title ProductDescription-title--seeMore">{l`See More`}</h3>
          <ul className="ProductDescription-list">
            {seeMoreLinks.map(({ seeMoreLabel, seeMoreUrl }) => (
              <li key={`see-more-${seeMoreLabel}`}>
                <a href={seeMoreUrl}>{seeMoreLabel}</a>
              </li>
            ))}
          </ul>
        </div>
      </FeatureCheck>
    )
  }
}
