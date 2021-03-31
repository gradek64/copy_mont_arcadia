// Imports
import React, { Component } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

// Actions
import * as TopNavActions from '../../../actions/components/TopNavMenuActions'
import * as SearchBarActions from '../../../actions/components/search-bar-actions'
import * as ShoppingBagActions from '../../../actions/common/shoppingBagActions'
import { clearOutOfStockError } from '../../../actions/common/checkoutActions'

// Analytics
import {
  sendAnalyticsClickEvent,
  sendAnalyticsDisplayEvent,
  GTM_CATEGORY,
  GTM_ACTION,
  GTM_EVENT,
  GTM_TRIGGER,
} from '../../../analytics'

// Selectors
import { getRoutePath, isInCheckout } from '../../../selectors/routingSelectors'
import { isHeaderSticky } from '../../../selectors/pageHeaderSelectors'
import { isMobile } from '../../../selectors/viewportSelectors'

// Components
import BrandLogo from '../../common/BrandLogo/BrandLogo'
import Image from '../../common/Image/Image'
import SearchBar from '../../containers/SearchBar/SearchBar'
import BurgerButton from '../../common/BurgerButton/BurgerButton'
import QuickLinks from '../../common/QuickLinks/QuickLinks'
import WishlistHeaderLink from './../../common/WishlistHeaderLink/WishlistHeaderLink'
import HeaderCheckout from './HeaderCheckout'

const sanitiseRoutePath = (path) =>
  path ? path.replace(/\/checkout\//, '') : ''

@connect(
  (state) => ({
    productsSearchOpen: state.productsSearch.open,
    shoppingBagTotalItems: state.shoppingBag.totalItems,
    isOutOfStockInCheckout: state.checkout.isOutOfStockInCheckout,
    modalOpen: state.modal.open,
    brandName: state.config.brandName,
    logoVersion: state.config.logoVersion,
    region: state.config.region,
    sticky: isHeaderSticky(state),
    routePath: getRoutePath(state),
    pageType: state.pageType,
    refinementsOpen: state.refinements.isShown,
    isInCheckout: isInCheckout(state),
    isMobile: isMobile(state),
  }),
  {
    ...TopNavActions,
    ...SearchBarActions,
    ...ShoppingBagActions,
    sendAnalyticsClickEvent,
    sendAnalyticsDisplayEvent,
    clearOutOfStockError,
  }
)
class HeaderComp extends Component {
  static propTypes = {
    toggleTopNavMenu: PropTypes.func,
    toggleProductsSearchBar: PropTypes.func,
    productsSearchOpen: PropTypes.bool,
    shoppingBagTotalItems: PropTypes.number,
    toggleMiniBag: PropTypes.func,
    clearOutOfStockError: PropTypes.func,
    openMiniBag: PropTypes.func,
    hasCartIcon: PropTypes.bool,
    hasSearchBar: PropTypes.bool,
    hasMenuButton: PropTypes.bool,
    brandName: PropTypes.string,
    isCheckoutBig: PropTypes.bool,
    logoVersion: PropTypes.string,
    region: PropTypes.string,
    forceDisplay: PropTypes.bool,
    sticky: PropTypes.bool,
    routePath: PropTypes.string,
    sendAnalyticsClickEvent: PropTypes.func.isRequired,
    sendAnalyticsDisplayEvent: PropTypes.func.isRequired,
    isOutOfStockInCheckout: PropTypes.bool,
    isStickyMobile: PropTypes.bool,
    pageType: PropTypes.string,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  componentDidUpdate(prevProps) {
    const {
      searchInput,
      props: {
        productsSearchOpen,
        hasSearchBar,
        isOutOfStockInCheckout,
        openMiniBag,
        clearOutOfStockError,
      },
    } = this

    if (searchInput && hasSearchBar) {
      if (!prevProps.productsSearchOpen && productsSearchOpen)
        searchInput.focus()
      if (prevProps.productsSearchOpen && !productsSearchOpen)
        searchInput.blur()
    }
    if (!prevProps.isOutOfStockInCheckout && isOutOfStockInCheckout) {
      openMiniBag()
      if (process.browser) clearOutOfStockError()
    }
  }

  toggleSearchBar = (evt) => {
    evt.preventDefault()
    this.props.toggleProductsSearchBar()
  }

  clickOnBurgerIcon = (evt) => {
    if (evt) evt.stopPropagation()
    this.props.toggleTopNavMenu()
  }

  clickOnShoppingCartIcon = (evt) => {
    if (evt) evt.stopPropagation()
    const { toggleMiniBag, sendAnalyticsDisplayEvent, pageType } = this.props
    toggleMiniBag()
    sendAnalyticsDisplayEvent(
      {
        bagDrawerTrigger: GTM_TRIGGER.BAG_ICON_CLICKED,
        openFrom: pageType,
      },
      GTM_EVENT.BAG_DRAWER_DISPLAYED
    )
  }

  goToHomePage = (ev) => {
    const { sendAnalyticsClickEvent, routePath } = this.props
    if (ev) ev.stopPropagation()
    sendAnalyticsClickEvent({
      category: GTM_CATEGORY.CHECKOUT,
      action: GTM_ACTION.CONTINUE_SHOPPING,
      label: sanitiseRoutePath(routePath),
      value: '',
    })
    browserHistory.push('/')
  }

  renderHeaderRight = () => {
    const { hasCartIcon, shoppingBagTotalItems } = this.props
    const { l } = this.context
    if (hasCartIcon) {
      return (
        <div className="Header-right">
          <WishlistHeaderLink />
          <button
            aria-label={l`View shopping cart`}
            title={l`View shopping cart`}
            className="Header-shoppingCartIconbutton"
            onClick={this.clickOnShoppingCartIcon}
          >
            <div
              role="img"
              aria-label={l`View shopping cart`}
              className={`Header-shoppingCartIcon${
                shoppingBagTotalItems === 0 ? ' is-empty' : ''
              }`}
            />
            <span className="Header-shoppingCartBadgeIcon">
              {shoppingBagTotalItems}
            </span>
          </button>
        </div>
      )
    }

    return null
  }

  render() {
    const {
      productsSearchOpen,
      hasMenuButton,
      hasSearchBar,
      brandName,
      isCheckoutBig,
      logoVersion,
      region,
      forceDisplay,
      sticky,
      isStickyMobile,
      forwardedRef,
      refinementsOpen,
      routePath,
      isInCheckout,
      isMobile,
    } = this.props
    const { l } = this.context
    const isRegionSpecific = brandName === 'burton'
    const imageFileName =
      brandName === 'missselfridge' ? 'search-icon-dropdown.svg' : undefined

    const displayCheckoutHeader =
      isInCheckout && !routePath.includes('/checkout/login')

    const headerContainerClasses = classNames('Header-container', 'hideinapp', {
      'Header-container--searchOpen': productsSearchOpen,
      'is-sticky': sticky,
      'is-stickyMobile': isStickyMobile,
      'is-refinements-open': refinementsOpen,
    })
    const headerClasses = classNames('Header', {
      'is-checkoutBig': isCheckoutBig,
      'is-forceDisplay': forceDisplay,
      'is-sticky': sticky,
    })
    return (
      <div className={headerContainerClasses} ref={forwardedRef}>
        {displayCheckoutHeader ? (
          <HeaderCheckout
            isMobile={isMobile}
            goToHomePage={this.goToHomePage}
            brandName={brandName}
            className="Header-brandLogo"
            logoVersion={logoVersion}
            region={region}
            isRegionSpecific={isRegionSpecific}
            l={l}
          />
        ) : (
          <div className={headerClasses}>
            <div className="Header-center">
              <button title={l`Home`} onClick={() => browserHistory.push('/')}>
                <BrandLogo
                  brandName={brandName}
                  className="Header-brandLogo"
                  logoVersion={logoVersion}
                  imageAlt={`${brandName} ${l`homepage`}`}
                  region={region}
                  isRegionSpecific={isRegionSpecific}
                />
              </button>
            </div>
            <QuickLinks />
            {hasMenuButton && (
              <div // eslint-disable-line jsx-a11y/no-static-element-interactions
                className="Header-left Header-burgerButtonContainer"
                onClick={this.clickOnBurgerIcon}
              >
                <BurgerButton />
              </div>
            )}
            {hasSearchBar && (
              <button
                aria-label={l`Open search bar to search for products`}
                title={l`Open search bar to search for products`}
                className="Header-left Header-searchButton"
                onClick={this.toggleSearchBar}
              >
                {productsSearchOpen ? (
                  <Image
                    className="Header-searchIcon"
                    alt="Close"
                    src={`/assets/{brandName}/images/close-icon.svg?version=${logoVersion}`}
                  />
                ) : (
                  <Image
                    className="Header-searchIcon"
                    alt="Search"
                    src={`/assets/{brandName}/images/search-icon.svg?version=${logoVersion}`}
                  />
                )}
              </button>
            )}
            {this.renderHeaderRight()}
          </div>
        )}

        {hasSearchBar && (
          <SearchBar
            imageFileName={imageFileName}
            searchInputRef={(searchInput) => {
              this.searchInput = searchInput
            }}
          />
        )}
      </div>
    )
  }
}

export { HeaderComp }

const Header = React.forwardRef((props, ref) => (
  <HeaderComp {...props} forwardedRef={ref} />
))
Header.displayName = 'Header'

export default Header
