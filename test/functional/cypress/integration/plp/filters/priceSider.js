import ProductListingPage from '../../../page-objects/Plp.page'
import NavigationPage from '../../../page-objects/Navigation.page'
import { isMobileLayout } from '../../../lib/helpers'

const plp = new ProductListingPage()
const navigation = new NavigationPage()

if (isMobileLayout()) {
  beforeEach(() => {
    plp.mocksForProductList({
      productSearchResults: 'fixture:plp/filters/search-knee-high-socks',
      productSearchTerm: 'socks',
    })
  })

  describe('Price Slider', () => {
    it('should hide price slider if all products are the same price', () => {
      cy.visit('/')
      navigation.searchFor('socks')
      plp
        .wait('@prod-search-results')
        .clickOnFilterButton()
        .expectFilterGroupNotToExist('Price')
    })
  })
}
