/*
 * This is a dedicated component that we are going to use for all the widths bigger than 992.
 * We have chosen to create a brand new header component to make as less likely as possible the possibility to
 * break the mobile header.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as headers from './'

@connect((state) => ({
  brandName: state.config.brandName,
  shoppingBagTotalItems: state.shoppingBag.totalItems,
  logoVersion: state.config.logoVersion,
  featureMegaNav: state.features.status.FEATURE_MEGA_NAV,
  region: state.config.region,
  sticky: state.pageHeader.sticky,
}))
class HeaderBig extends Component {
  static propTypes = {
    shoppingBagTotalItems: PropTypes.number.isRequired,
    brandName: PropTypes.string,
    logoVersion: PropTypes.string,
    featureMegaNav: PropTypes.bool,
    region: PropTypes.string,
    sticky: PropTypes.bool,
  }

  render() {
    const {
      region,
      brandName,
      shoppingBagTotalItems,
      logoVersion,
      featureMegaNav,
      sticky,
    } = this.props
    const HeaderComponent = headers[brandName]
    return (
      <div className="HeaderBig">
        <HeaderComponent
          sticky={sticky}
          brandName={brandName}
          contentWrapper="HeaderBig-content"
          leftCol="HeaderBig-left"
          rightCol="HeaderBig-right"
          centreCol="HeaderBig-centre"
          logoVersion={logoVersion}
          shoppingBagTotalItems={shoppingBagTotalItems}
          featureMegaNav={featureMegaNav}
          region={region}
        />
      </div>
    )
  }
}

export default HeaderBig
