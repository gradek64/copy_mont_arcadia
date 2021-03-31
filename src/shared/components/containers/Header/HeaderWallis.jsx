import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
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
class HeaderWallis extends Component {
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

  render() {
    const {
      brandName,
      logoVersion,
      featureMegaNav,
      sticky,
      brandHeaderEspotName,
    } = this.props
    const { l } = this.context

    return (
      <div className={`HeaderWallis${sticky ? ' is-sticky' : ''}`}>
        <div className="HeaderWallis-wrapper">
          <div className="HeaderWallis-brand">
            <Link className="HeaderWallis-brandLink" to="/">
              <BrandLogo brandName={brandName} logoVersion={logoVersion} />
            </Link>
          </div>
          <div className="HeaderWallis-content">
            <div className="HeaderWallis-shipping">
              <ShippingDestination />
              <Espot identifier={brandHeaderEspotName} />
            </div>
            <div className="HeaderWallis-search">
              <SearchBar isDesktop />
            </div>
            <div className="HeaderWallis-account">
              <AccountIcon
                popoverMenu
                myAccountText={l`My account`}
                signInText={l`Sign In`}
                signOutText={l`Sign out`}
              />
            </div>
            <div className="HeaderWallis-wishlist">
              <WishlistHeaderLink label={l`Wishlist`} />
            </div>
            <div className="HeaderWallis-shoppingCart">
              <ShoppingCart label={l`My Bag`} />
            </div>
          </div>
          <div className="HeaderWallis-navigation">
            {featureMegaNav ? <MegaNav /> : <TopNavMenuBig />}
          </div>
        </div>
      </div>
    )
  }
}

export default HeaderWallis
