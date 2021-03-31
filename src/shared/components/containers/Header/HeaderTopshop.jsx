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
import MiniBagConfirm from '../../common/AddToBagConfirm/MiniBagConfirm'
import TopNavMenuBig from '../TopNavMenu/TopNavMenuBig'
import MegaNav from '../MegaNav/MegaNav'
import Espot from '../../containers/Espot/Espot'

import { getBrandHeaderEspotName } from '../../../../shared/selectors/espotSelectors'

@connect((state) => ({
  brandHeaderEspotName: getBrandHeaderEspotName(state),
}))
class HeaderTopshop extends Component {
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
    const { l } = this.context
    const { sticky, brandHeaderEspotName } = this.props
    return [
      !sticky && (
        <div key="shippingInfo" className="HeaderTopshop-shippingInfo">
          <Espot identifier={brandHeaderEspotName} />
        </div>
      ),
      <div key="search" className="HeaderTopshop-search">
        <SearchBar isDesktop />
      </div>,
      !sticky && (
        <div key="account" className="HeaderTopshop-account">
          <AccountIcon
            popoverMenu
            myAccountText={l`View profile`}
            signOutText={l`Sign out`}
          />
        </div>
      ),
      !sticky && (
        <div key="shipping" className="HeaderTopshop-shipping">
          <ShippingDestination />
        </div>
      ),
      <div key="wishlist" className="HeaderTopshop-wishlist">
        <WishlistHeaderLink />
      </div>,
      <div key="shoppingCart" className="HeaderTopshop-shoppingCart">
        <ShoppingCart />
        <MiniBagConfirm className="HeaderTopshop-right--el" />
      </div>,
    ]
  }

  render() {
    const { brandName, logoVersion, featureMegaNav, sticky } = this.props

    return (
      <div className={`HeaderTopshop${sticky ? ' is-sticky' : ''}`}>
        <div className="HeaderTopshop-brand">
          <Link className="HeaderTopshop-brandLink" to="/">
            <BrandLogo brandName={brandName} logoVersion={logoVersion} />
          </Link>
        </div>
        <div className="HeaderTopshop-content">
          {!sticky && this.renderHeaderIcons()}
        </div>
        {!sticky && <div className="HeaderTopshop-separator" />}
        <div className="HeaderTopshop-navigation">
          {featureMegaNav ? (
            <MegaNav className="HeaderTopshop-megaNav" />
          ) : (
            <TopNavMenuBig />
          )}
          {sticky && this.renderHeaderIcons()}
        </div>
      </div>
    )
  }
}

export default HeaderTopshop
