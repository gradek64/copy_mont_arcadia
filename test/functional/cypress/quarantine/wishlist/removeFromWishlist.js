import WishList from '../../page-objects/Wishlist.page'
import Login from '../../page-objects/login/Login.page'
import getLastGtmEventOfType from '../../lib/getLastGtmEventOfType'
import { isMobileLayout } from '../../lib/helpers'

const wl = new WishList()
const login = new Login()

if (isMobileLayout()) {
  describe('Wishlist - Remove Item from Wishlist', () => {
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

    it('Should remove Item from Wishlist', () => {
      cy.server({ enable: false })

      wl.mocksForWishlist({
        getWishlistById: 'fixture:wishlist/wishlist-noItem',
      })

      wl.removeFirstWishlistItem()
      cy.wait('@get-wl-id')

      // Assert GA event fired.
      getLastGtmEventOfType('wishlist').then((event) => {
        expect(event.wishlist.lineNumber).to.equal('TX456723U2')
        expect(event.wishlist.price).to.equal('20.00')
        expect(event.wishlist.productId).to.equal('31825257')
      })

      // Assert the item has been removed.
      cy.get(wl.firstWishlistItem).should('not.be.visible')
    })
  })
}
