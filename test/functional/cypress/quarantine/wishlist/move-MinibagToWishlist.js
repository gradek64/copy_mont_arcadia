import { setFeatureFlag, isMobileLayout } from '../../lib/helpers'
import Login from '../../page-objects/login/Login.page'
import Navigation from '../../page-objects/Navigation.page'
import MiniBag from '../../page-objects/MiniBag.page'
import WishList from '../../page-objects/Wishlist.page'

const login = new Login()
const nav = new Navigation()
const bag = new MiniBag()
const wl = new WishList()

if (isMobileLayout()) {
  describe('WishList - Move to wishlist from minibag', () => {
    beforeEach(() => {
      cy.clearCookie('authenticated')
      cy.clearCookie('bagCount')
      setFeatureFlag('FEATURE_WISHLIST')
      login.mocksForAccountAndLogin({
        login: 'fixture:login/fullCheckoutProfile',
      })
      bag.mocksForShoppingBag({
        getItems: 'fixture:wishlist/getItems--OneItemInMinibag',
        removeFromBag: 'fixture:wishlist/delete_item--deleteItemFromMinibag',
      })
      wl.mocksForWishlist({
        getWishlists: '{}',
        addWishlistItem: 'fixture:wishlist/add_item--addItemToWishlist',
        getWishlistById: 'fixture:wishlist/wishlist-oneproduct-itemid',
        byIdUrlFilter: 'pageNo=1',
      })

      cy.visit('/login')
      login.loginAsExistingUser()
    })

    it('Should update wishlist with new product when I select "add to wishlist" from minibag', () => {
      bag.miniBagClose()
      nav.selectWishlistIcon()
      nav.openMiniBag()
      bag.selectMoveToWishList()
      cy.wait('@get-wl-id')
      cy.get(wl.alertModalText).should(
        'have.text',
        'Angular Aviators has been moved to your Wishlist'
      )
      wl.selectOKModalButton()
      bag.miniBagClose()
      cy.get(wl.firstWishListItemTitle).should('have.text', 'Angular Aviators')
    })
  })
}
