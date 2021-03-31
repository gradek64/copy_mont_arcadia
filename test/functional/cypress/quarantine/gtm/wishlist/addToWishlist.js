import singleSizeProduct from '../../../fixtures/pdp/singleSizeProduct/pdpInitialFetch.json'
import Login from '../../../page-objects/login/Login.page'
import MiniBag from '../../../page-objects/MiniBag.page'
import Navigation from '../../../page-objects/Navigation.page'
import WishList from '../../../page-objects/Wishlist.page'
import Pdp from '../../../page-objects/Pdp.page'
import getLastGtmEventOfType from '../../../lib/getLastGtmEventOfType'
import ProductListingPage from '../../../page-objects/Plp.page'
import { isMobileLayout } from '../../../lib/helpers'

const plp = new ProductListingPage()
const bag = new MiniBag()
const login = new Login()
const nav = new Navigation()
const wl = new WishList()
const pdp = new Pdp()

if (isMobileLayout()) {
  describe('GTM - Wishlist AddToWishLists Events PDP / PLP', () => {
    beforeEach(() => {
      login.mocksForAccountAndLogin({
        setAuthStateCookie: 'yes',
        getAccount: 'fixture:wishlist/wishlist-login.json',
      })
      wl.mocksForWishlist({
        addWishlistItem: 'fixture:wishlist/add_item--addItemToWishlist',
      })
    })

    it('Should contain "addToWishlist" event in datalayer - PDP', () => {
      const path = pdp.mocksForPdpProduct({
        productByUrl: singleSizeProduct,
      })
      cy.visit(path)

      pdp.clickWishlistButton().wait('@add-wl-item')

      getLastGtmEventOfType('wishlist').then((event) => {
        expect(event.wishlist.addedFrom).to.equal('pdp')
        expect(event.wishlist.lineNumber).to.equal('19H11NBLK')
        expect(event.wishlist.productId).to.equal('31824943')
      })
    })

    it('Should contain "addToWishlist" GTM events in datalayer - PLP', () => {
      plp.mocksForProductList({
        productNavigation: 'fixture:plp/filters/category-shoes',
      })
      cy.visit('/')

      plp
        .selectShoesCatHeader()
        .wait('@prod-nav-results')
        .addToWishlistFirstProduct()
        .wait('@add-wl-item')

      getLastGtmEventOfType('wishlist').then((event) => {
        expect(event.wishlist.addedFrom).to.equal('plp')
        expect(event.wishlist.lineNumber).to.equal('TS42H40NMUL')
        expect(event.wishlist.productId).to.equal('32041290')
      })
    })
  })

  describe('GTM - Minibag to Wishlist', () => {
    beforeEach(() => {
      login.mocksForAccountAndLogin({
        setAuthStateCookie: 'yes',
        login: 'fixture:wishlist/wishlist-login.json',
        getAccount: 'fixture:wishlist/wishlist-login.json',
        getItems: 'fixture:wishlist/getItems--OneItemInMinibag',
      })

      wl.mocksForWishlist({
        getWishlists: 'fixture:wishlist/wishlists',
        addWishlistItem: 'fixture:wishlist/add_item--addItemToWishlist',
      })

      bag.mocksForShoppingBag({
        removeFromBag: 'fixture:wishlist/delete_item--deleteItemFromMinibag',
      })
      cy.setCookie('bagCount', '1')
      cy.visit('/wishlist')
    })

    it('Should contain "addToWishlist" GTM event in datalayer - MINIBAG', () => {
      nav.selectWishlistIcon().openMiniBag()
      bag.selectMoveToWishList()
      wl.selectOKModalButton()
      getLastGtmEventOfType('wishlist').then((event) => {
        expect(event.wishlist.addedFrom).to.equal('minibag')
        expect(event.wishlist.lineNumber).to.equal('22Q07MGLD')
        expect(event.wishlist.productId).to.equal('31825257')
      })
    })
  })
}
