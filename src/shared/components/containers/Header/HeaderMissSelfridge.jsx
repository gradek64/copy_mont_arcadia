import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import BrandLogo from './../../common/BrandLogo/BrandLogo'

import Espot from '../../containers/Espot/Espot'
import AccountIcon from './../../common/AccountIcon/AccountIcon'
import WishlistHeaderLink from './../../common/WishlistHeaderLink/WishlistHeaderLink'
import ShoppingCart from './../../common/ShoppingCart/ShoppingCart'
import ShippingDestination from './../../common/ShippingDestination/ShippingDestination'
import SearchBar from './../../containers/SearchBar/SearchBar'
import TopNavMenuBig from '../TopNavMenu/TopNavMenuBig'
import MegaNav from '../MegaNav/MegaNav'

import { getBrandHeaderEspotName } from '../../../../shared/selectors/espotSelectors'

@connect((state) => ({
  brandHeaderEspotName: getBrandHeaderEspotName(state),
}))
class HeaderMissSelfridge extends Component {
  static propTypes = {
    brandName: PropTypes.string,
    logoVersion: PropTypes.string,
    featureMegaNav: PropTypes.bool,
    sticky: PropTypes.bool,
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
        <div key="shippingInfo" className="HeaderMissSelfridge-shippingInfo">
          <Espot identifier={brandHeaderEspotName} />
        </div>
      ),
      <div key="search" className="HeaderMissSelfridge-search">
        <SearchBar isDesktop />
      </div>,
      !sticky && (
        <div key="account" className="HeaderMissSelfridge-account">
          <AccountIcon
            popoverMenu
            myAccountText={l`My account`}
            signOutText={l`Sign out`}
          />
        </div>
      ),
      !sticky && (
        <div key="shipping" className="HeaderMissSelfridge-shipping">
          <ShippingDestination />
        </div>
      ),
      <div key="wishlist" className="HeaderMissSelfridge-wishlist">
        <WishlistHeaderLink />
      </div>,
      <div key="shoppingCart" className="HeaderMissSelfridge-shoppingCart">
        <ShoppingCart />
      </div>,
    ]
  }

  render() {
    const { brandName, logoVersion, featureMegaNav, sticky } = this.props

    return (
      <div className={`HeaderMissSelfridge${sticky ? ' is-sticky' : ''}`}>
        <div className="HeaderMissSelfridge-brand">
          <Link className="HeaderMissSelfridge-brandLink" to="/">
            <BrandLogo brandName={brandName} logoVersion={logoVersion} />
          </Link>
        </div>
        <div className="HeaderMissSelfridge-content">
          {!sticky && this.renderHeaderIcons()}
        </div>
        {!sticky && <div className="HeaderMissSelfridge-separator" />}
        <div className="HeaderMissSelfridge-navigation">
          {featureMegaNav ? (
            <MegaNav className="HeaderMissSelfridge-megaNav" />
          ) : (
            <TopNavMenuBig />
          )}
          {sticky && this.renderHeaderIcons()}
        </div>
      </div>
    )
  }
}

export default HeaderMissSelfridge
