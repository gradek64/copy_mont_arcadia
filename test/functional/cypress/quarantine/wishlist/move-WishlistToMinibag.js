import { isMobileLayout, isDesktopLayout } from '../../lib/helpers'

import WishList from '../../page-objects/Wishlist.page'
import Navigation from '../../page-objects/Navigation.page'
import MiniBag from '../../page-objects/MiniBag.page'
import Login from '../../page-objects/login/Login.page'
import getLastGtmEventOfType from '../../lib/getLastGtmEventOfType'
import QuickView from '../../page-objects/QuickView.page'

const wl = new WishList()
const nav = new Navigation()
const minibag = new MiniBag()
const login = new Login()
const quickview = new QuickView()

describe('Wishlist - Add to bag', () => {
  beforeEach(() => {
    login.mocksForAccountAndLogin({
      setAuthStateCookie: 'yes',
      getAccount: 'fixture:login/fullCheckoutProfile',
    })
    wl.mocksForWishlist({
      getWishlists: 'fixture:wishlist/wishlists-multiple',
      addWishlistItemToBag: 'fixture:wishlist/wishlist-add_to_bag',
      removeWishlistItem: 'fixture:wishlist/wishlist-remove_item',
      getWishlistById: 'fixture:wishlist/wishlist-oneproduct-itemid',
      getWishlistItemIds: 'fixture:wishlist/wishlist-itemIds2',
    })
    cy.visit('/wishlist')
    cy.wait('@get-wl-id')
  })

  it('Should move product to minibag and remove product from wishlist when I select "add to bag"', () => {
    cy.get(wl.firstWishListItemSizeSelector).select('Size ONE')

    wl.mocksForWishlist({
      getWishlistById: 'fixture:wishlist/wishlist-noItem',
    })
    cy.get(wl.firstWishListItemAddToBagButton).click()
    cy.wait('@get-wl-id')

    getLastGtmEventOfType('wishlist', 'addToBagFromWishlist').then((event) => {
      expect(event.wishlist.productId).to.equal(31825257)
      expect(event.wishlist.price).to.equal('20.00')
      expect(event.wishlist.lineNumber).to.equal('TX456723U2')
      expect(event.wishlist.pageType).to.equal('wishlist')
      expect(event.wishlist.wlUrl).to.equal('/wishlist')
    })

    if (isMobileLayout()) {
      nav.selectMobileViewBag()
    }

    cy.get(minibag.firstItemInMinibag).should('be.visible')
    minibag.miniBagClose()
    cy.get(wl.firstWishlistItem).should('not.be.visible')
    cy.get(wl.wishlistCount).should('not.be.visible')
  })
  it('should trigger gtm addToBagFromWishlist event from product quickview modal', () => {
    if (isDesktopLayout()) {
      wl.mocksForWishlist({
        quickViewProduct: 'fixture:wishlist/quickview-product-info',
        productId: 31825257,
      })
      wl.clickQuickViewModal()
      cy.wait('@get-qv-item')
      quickview.clickAddToBag().inlineConfirmIsVisible()

      getLastGtmEventOfType('wishlist', 'addToBagFromWishlist').then(
        (event) => {
          expect(event.wishlist.productId).to.equal(31825257)
          expect(event.wishlist.price).to.equal('5.00')
          expect(event.wishlist.lineNumber).to.equal('22Q07MGLD')
          expect(event.wishlist.pageType).to.equal('wishlist-quickview')
          expect(event.wishlist.wlUrl).to.equal('/wishlist')
        }
      )
    }
  })
})
