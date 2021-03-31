import WishList from '../../page-objects/Wishlist.page'
import AccountPage from '../../page-objects/my-account/MyAccount.Page'
import account from '../../fixtures/wishlist/wishlist-login.json'
import { isMobileLayout } from '../../lib/helpers'

const wishlist = new WishList()
const acountPage = new AccountPage()

if (isMobileLayout()) {
  describe('WishList - size selected by default for products with only one size', () => {
    beforeEach(() => {
      acountPage.mocksForAccountAndLogin({
        setAuthStateCookie: 'yes',
        getAccount: account,
      })
      wishlist.mocksForWishlist({
        getWishlistItemIds: 'fixture:wishlist/wishlist-itemIds',
        getWishlists: 'fixture:wishlist/wishlists-multiple',
        getWishlistById: 'fixture:wishlist/wishlist-default',
      })
      cy.visit('/wishlist')
    })
    it('Should have a class `.is-selected` on the size selector when product has only one size', () => {
      cy.get(wishlist.wishListItemSizeSelectorSelected).should('have.length', 1)
    })
  })
}
