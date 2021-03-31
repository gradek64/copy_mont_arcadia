import ProductListingPage from './../../page-objects/Plp.page'
import productList from '../../fixtures/plp/initialPageLoad.json'
import { isMobileLayout } from '../../lib/helpers'

const plp = new ProductListingPage()

if (isMobileLayout()) {
  describe('PLP malformed url query strings', () => {
    it('Given I visit a PLP with a malformed query string, products should still be shown', () => {
      const path = plp.mocksForProductList({
        productSearchTerm: 'Jeans',
        productSearchResults: productList,
      })
      const badPath = `${path}?param=true&param2=false?param=true&param2=false`

      cy.visit(badPath)
      plp.expectResults()
    })
  })
}
