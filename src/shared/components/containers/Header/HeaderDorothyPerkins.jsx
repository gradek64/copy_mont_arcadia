import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router'
import BrandLogo from './../../common/BrandLogo/BrandLogo'
import WishlistHeaderLink from './../../common/WishlistHeaderLink/WishlistHeaderLink'
import ShoppingCart from './../../common/ShoppingCart/ShoppingCart'
import SearchBar from './../../containers/SearchBar/SearchBar'
import AccountIcon from './../../common/AccountIcon/AccountIcon'
import ShippingDestination from './../../common/ShippingDestination/ShippingDestination'
import TopNavMenuBig from '../TopNavMenu/TopNavMenuBig'
import MegaNav from '../MegaNav/MegaNav'

export default class HeaderDorothyPerkins extends Component {
  static propTypes = {
    brandName: PropTypes.string,
    logoVersion: PropTypes.string,
    featureMegaNav: PropTypes.bool,
    sticky: PropTypes.bool,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  renderHeaderIcons = () => {
    const { sticky } = this.props
    const { l } = this.context
    return [
      !sticky && (
        <div key="shipping" className="HeaderDorothyPerkins-shipping">
          <ShippingDestination
            modifier="dorothyPerkinsHeader"
            currencySymbolPosition="right"
            currencySymbolStyle="bracketed"
          />
        </div>
      ),
      <div key="search" className="HeaderDorothyPerkins-search">
        <SearchBar isDesktop />
      </div>,
      !sticky && (
        <div key="account" className="HeaderDorothyPerkins-account">
          <AccountIcon
            popoverMenu
            myAccountText={l`My account`}
            signOutText={l`Sign out`}
          />
        </div>
      ),
      <div key="wishlist" className="HeaderDorothyPerkins-wishlist">
        <WishlistHeaderLink />
      </div>,
      <div key="shoppingCart" className="HeaderDorothyPerkins-shoppingCart">
        <ShoppingCart />
      </div>,
    ]
  }

  render() {
    const { brandName, logoVersion, featureMegaNav, sticky } = this.props
    return (
      <div className={`HeaderDorothyPerkins${sticky ? ' is-sticky' : ''}`}>
        <div className="HeaderDorothyPerkins-brand">
          <Link className="HeaderDorothyPerkins-brandLink" to="/">
            <BrandLogo
              brandName={brandName}
              logoVersion={logoVersion}
              hasResponsive
            />
          </Link>
        </div>
        <div className="HeaderDorothyPerkins-content">
          {!sticky && this.renderHeaderIcons()}
        </div>
        <div className="HeaderDorothyPerkins-navigation">
          {featureMegaNav ? (
            <MegaNav className="HeaderDorothyPerkins-megaNav" />
          ) : (
            <TopNavMenuBig />
          )}
          {sticky && this.renderHeaderIcons()}
        </div>
      </div>
    )
  }
}
