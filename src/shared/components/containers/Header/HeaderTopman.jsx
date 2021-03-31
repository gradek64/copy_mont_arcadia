/*
 * This is a dedicated component that we are going to use for all the widths bigger than 992.
 * We have chosen to create a brand new header component to make as less likely as possible the possibility to
 * break the mobile header.
 */

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import BrandLogo from './../../common/BrandLogo/BrandLogo'
import AccountIcon from './../../common/AccountIcon/AccountIcon'
import WishlistHeaderLink from './../../common/WishlistHeaderLink/WishlistHeaderLink'
import ShoppingCart from './../../common/ShoppingCart/ShoppingCart'
import ShippingDestination from './../../common/ShippingDestination/ShippingDestination'
import SearchBar from './../../containers/SearchBar/SearchBar'
import TopNavMenuBig from '../TopNavMenu/TopNavMenuBig'
import MegaNav from '../MegaNav/MegaNav'
import Espot from '../../containers/Espot/Espot'

import { getBrandHeaderEspotName } from '../../../../shared/selectors/espotSelectors'

@connect((state) => ({
  brandHeaderEspotName: getBrandHeaderEspotName(state),
}))
class HeaderTopman extends Component {
  static propTypes = {
    brandName: PropTypes.string,
    logoVersion: PropTypes.string,
    featureMegaNav: PropTypes.bool,
    brandHeaderEspotName: PropTypes.string.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  renderHeaderIcons = () => {
    const { sticky, brandHeaderEspotName } = this.props
    const { l } = this.context
    return [
      !sticky && (
        <div key="shippingInfo" className="HeaderTopman-shippingInfo">
          <Espot identifier={brandHeaderEspotName} />
        </div>
      ),
      <div key="search" className="HeaderTopman-search">
        <SearchBar isDesktop />
      </div>,
      !sticky && (
        <div key="account" className="HeaderTopman-account">
          <AccountIcon
            popoverMenu
            myAccountText={l`View profile`}
            signOutText={l`Sign out`}
          />
        </div>
      ),
      !sticky && (
        <div key="shipping" className="HeaderTopman-shipping">
          <ShippingDestination />
        </div>
      ),
      <div key="wishlist" className="HeaderTopman-wishlist">
        <WishlistHeaderLink />
      </div>,
      <div key="shoppingCart" className="HeaderTopman-shoppingCart">
        <ShoppingCart />
      </div>,
    ]
  }

  render() {
    const { brandName, logoVersion, featureMegaNav, sticky } = this.props

    return (
      <div className={`HeaderTopman${sticky ? ' is-sticky' : ''}`}>
        <div className="HeaderTopman-brand">
          <Link className="HeaderTopman-brandLink" to="/">
            <BrandLogo brandName={brandName} logoVersion={logoVersion} />
          </Link>
        </div>
        <div className="HeaderTopman-content">
          {!sticky && this.renderHeaderIcons()}
        </div>
        {!sticky && <div className="HeaderTopman-separator" />}
        <div className="HeaderTopman-navigation">
          {featureMegaNav ? (
            <MegaNav className="HeaderTopman-megaNav" />
          ) : (
            <TopNavMenuBig />
          )}
          {sticky && this.renderHeaderIcons()}
        </div>
      </div>
    )
  }
}

export default HeaderTopman
