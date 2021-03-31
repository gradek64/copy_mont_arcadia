import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router'
import BrandLogo from './../../common/BrandLogo/BrandLogo'
import AccountIcon from './../../common/AccountIcon/AccountIcon'
import WishlistHeaderLink from './../../common/WishlistHeaderLink/WishlistHeaderLink'
import ShoppingCart from './../../common/ShoppingCart/ShoppingCart'
import SearchBar from './../../containers/SearchBar/SearchBar'
import ShippingDestination from './../../common/ShippingDestination/ShippingDestination'
import TopNavMenuBig from '../TopNavMenu/TopNavMenuBig'
import MegaNav from '../MegaNav/MegaNav'

export default class HeaderBurton extends Component {
  static propTypes = {
    brandName: PropTypes.string,
    logoVersion: PropTypes.string,
    featureMegaNav: PropTypes.bool,
    region: PropTypes.string,
    sticky: PropTypes.bool,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  renderHeaderIcons = () => {
    const { l } = this.context
    const { sticky } = this.props

    return [
      !sticky && (
        <div key="shippingInfo" className="HeaderBurton-shipping">
          <ShippingDestination
            modifier="burtonHeader"
            currencySymbolPosition="left"
            currencySymbolStyle="standard"
          />
        </div>
      ),
      !sticky && (
        <div key="accountIcon" className="HeaderBurton-account">
          <AccountIcon
            popoverMenu
            myAccountText={l`My account`}
            signOutText={l`Sign out`}
          />
        </div>
      ),
      <div key="wishlistHeaderLink" className="HeaderBurton-wishlist">
        <WishlistHeaderLink />
      </div>,
      <div key="shoppingCart" className="HeaderBurton-shoppingCart">
        <ShoppingCart modifier="burtonHeader" />
      </div>,
    ]
  }

  render() {
    const {
      brandName,
      logoVersion,
      featureMegaNav,
      region,
      sticky,
    } = this.props

    return (
      <div className={`HeaderBurton${sticky ? ' is-sticky' : ''}`}>
        <div className="HeaderBurton-brand">
          <Link className="HeaderBurton-brandLink" to="/">
            <BrandLogo
              brandName={brandName}
              logoVersion={logoVersion}
              isRegionSpecific
              region={region}
            />
          </Link>
        </div>
        <div className="HeaderBurton-content">
          {!sticky && this.renderHeaderIcons()}
        </div>
        <div className="HeaderBurton-navigation">
          {featureMegaNav ? (
            <MegaNav className="HeaderBurton-topNavMenu" />
          ) : (
            <TopNavMenuBig className="HeaderBurton-topNavMenu" />
          )}
          <div className="HeaderBurton-search">
            <SearchBar className="HeaderBurton-searchBar" isDesktop />
          </div>
          {sticky && this.renderHeaderIcons()}
        </div>
      </div>
    )
  }
}
