import WishList from '../../page-objects/Wishlist.page'
import AccountPage from '../../page-objects/my-account/MyAccount.Page'
import account from '../../fixtures/wishlist/wishlist-login.json'
import { isMobileLayout } from '../../lib/helpers'

const wishlist = new WishList()
const accountPage = new AccountPage()

if (isMobileLayout()) {
  describe('WishList - lazy load', () => {
    beforeEach(() => {
      accountPage.mocksForAccountAndLogin({
        setAuthStateCookie: 'yes',
        getAccount: account,
      })
      wishlist.mocksForWishlist({
        getWishlistItemIds: 'fixture:wishlist/wishlist-itemIds',
        getWishlists: 'fixture:wishlist/wishlists-multiple',
        getWishlistById: 'fixture:wishlist/wishlist-default',
        byIdUrlFilter: 'pageNo=1',
      })
      cy.visit('/wishlist')
    })
    it('Should take 3 seconds or less to load the page. Should paginate correctly', () => {
      cy.wait('@get-wl-id')
        .get(wishlist.allWishlistItems, { timeout: 3000 })
        .should('have.length', 20)
      cy.server({ enable: false })
      wishlist.mocksForWishlist({
        getWishlistById: 'fixture:wishlist/wishlist-default-page-2',
        byIdUrlFilter: 'pageNo=2',
      })
      cy.get(wishlist.allWishlistItems)
        .eq(19)
        .scrollIntoView({ duration: 2000 })
        .wait('@get-wl-id')
        .get(wishlist.allWishlistItems, { timeout: 3000 })
        .should('have.length', 40)
    })
  })
}
