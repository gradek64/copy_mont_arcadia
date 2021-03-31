import restrictedActionResponse from '../../../../fixtures/rememberMe/rememberMe--resticted_action_reponse.json'
import addWlItem from '../../../../fixtures/wishlist/add_item--addItemToWishlist.json'
import Plp from '../../../../page-objects/Plp.page'
import WishlistLoginModal from '../../../../page-objects/WishlistLoginModal.page'
import Checkout from '../../../../page-objects/checkout/Checkout.page'
import WishlistPage from '../../../../page-objects/Wishlist.page'
import { setFeatureFlag, isMobileLayout } from '../../../../lib/helpers'
import productList from '../../../../fixtures/plp/initialPageLoad.json'

const plp = new Plp()
const wl = new WishlistPage()
const loginModal = new WishlistLoginModal()
const checkout = new Checkout()

if (isMobileLayout()) {
  describe('Wishlist while partially authenticated', () => {
    beforeEach(() => {
      setFeatureFlag('FEATURE_REMEMBER_ME')
      cy.setCookie('bagCount', '1')
      cy.setCookie('authenticated', 'yes')
      checkout.mocksForCheckout({
        getAccount401: restrictedActionResponse,
        setAuthStateCookie: 'partial',
      })
      wl.mocksForWishlist({
        addWishlistItem: addWlItem,
      })

      cy.visit('/')
    })

    it('should not show the login modal when adding to wishlist', () => {
      const path = plp.mocksForProductList({
        productSearchTerm: 'Jeans',
        productSearchResults: productList,
      })
      cy.visit(path)
      plp.addItemToWishlist(0)
      loginModal.assertIsVisible(false)
      plp.expectWishlistButtonToBeFilled(0)
    })
  })
}
