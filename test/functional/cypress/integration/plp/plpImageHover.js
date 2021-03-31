import { isDesktopLayout } from './../../lib/helpers'
import ProductListingPage from './../../page-objects/Plp.page'
import productList from '../../fixtures/plp/initialPageLoad.json'

const plp = new ProductListingPage()

if (isDesktopLayout()) {
  describe('PLP image', () => {
    beforeEach(() => {
      const path = plp.mocksForProductList({
        productSearchTerm: 'Jeans',
        productSearchResults: productList,
      })
      cy.visit(path)
    })

    it('should display the secondary image when I hover over', () => {
      plp.hoverOnFirstProduct()
      cy.get(plp.firstImageAttribute)
        .should('have.attr', 'src')
        .then((src) => {
          expect(src).to.contain('_F_1')
        })
    })
  })
}
