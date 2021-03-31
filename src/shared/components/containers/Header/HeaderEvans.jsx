import React, { Component } from 'react'
import PropTypes from 'prop-types'
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
import Espot from '../Espot/Espot'

import { getBrandHeaderEspotName } from '../../../../shared/selectors/espotSelectors'

@connect((state) => ({
  brandHeaderEspotName: getBrandHeaderEspotName(state),
}))
class HeaderEvans extends Component {
  static propTypes = {
    brandName: PropTypes.string,
    logoVersion: PropTypes.string,
    featureMegaNav: PropTypes.bool,
    brandHeaderEspotName: PropTypes.string.isRequired,
    sticky: PropTypes.bool,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  render() {
    const {
      brandName,
      logoVersion,
      featureMegaNav,
      brandHeaderEspotName,
      sticky,
    } = this.props
    const { l } = this.context
    return (
      <div className={`HeaderEvans${sticky ? ' is-sticky' : ''}`}>
        <div className="HeaderEvans-wrapper">
          <div className="HeaderEvans-brand">
            <Link className="HeaderEvans-brandLink" to="/">
              <BrandLogo brandName={brandName} logoVersion={logoVersion} />
            </Link>
          </div>
          <div className="HeaderEvans-content">
            <div className="HeaderEvans-shipping">
              <ShippingDestination />
              <Espot identifier={brandHeaderEspotName} />
            </div>
            <div className="HeaderEvans-search">
              <SearchBar isDesktop />
            </div>
            <div className="HeaderEvans-account">
              <AccountIcon
                popoverMenu
                myAccountText={l`My account`}
                signInText={l`Sign In`}
                signOutText={l`Sign out`}
              />
            </div>
            <div className="HeaderEvans-wishlist">
              <WishlistHeaderLink label={l`Wishlist`} />
            </div>
            <div className="HeaderEvans-shoppingCart">
              <ShoppingCart label={l`My Bag`} />
            </div>
          </div>
          <div className="HeaderEvans-navigation">
            {featureMegaNav ? <MegaNav /> : <TopNavMenuBig />}
          </div>
        </div>
      </div>
    )
  }
}

export default HeaderEvans
