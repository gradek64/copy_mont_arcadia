import { isDesktopLayout } from './../../lib/helpers'
import ProductListingPage from './../../page-objects/Plp.page'
import QuickView from './../../page-objects/QuickView.page'
import productList from '../../fixtures/plp/initialPageLoad.json'

const plp = new ProductListingPage()
const quickview = new QuickView()

if (isDesktopLayout()) {
  describe('PLP quickview', () => {
    beforeEach(() => {
      const path = plp.mocksForProductList({
        productSearchTerm: 'Jeans',
        productSearchResults: productList,
      })

      cy.visit(path)

      plp.selectQuickViewForItem(7)
    })

    it('should allow switching between swatches', () => {
      quickview.selectSwatch(1).expectToNotBeLoading()
    })

    it('body tag should have class `not-scrollable`', () => {
      cy.get('body').should('have.class', 'not-scrollable')
    })

    it('body tag should not have class `not-scrollable` after closing', () => {
      quickview.selectClosingButton(1)
      cy.get('body').should('not.have.class', 'not-scrollable')
    })
  })
}
