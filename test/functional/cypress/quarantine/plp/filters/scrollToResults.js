import ProductListingPage from '../../../page-objects/Plp.page'
import plpRoutes from '../../../../mock-server/routes/plp/filters/index'

import { isDesktopLayout, setupMocksForRefinements } from '../../../lib/helpers'

if (isDesktopLayout()) {
  describe('PLP - Scrolling', () => {
    const plp = new ProductListingPage()

    beforeEach(() => {
      setupMocksForRefinements(plpRoutes)
      cy.visit('/')
    })

    it.skip('category navigation should scroll to the top', async () => {
      plp
        .clickOnCategoryLink('Shoes')
        .wait('@category-shoes')
        .scrollToPage(2)
        .wait('@category-shoes-page2')
        .clickOnCategoryLink('Clothing')
        .wait('@category-clothing')

      cy.wait(3000)
      cy.window()
        .its('scrollY')
        .should('equal', 0)
    })

    it('Filter should scroll to the results section', async () => {
      plp
        .clickOnCategoryLink('Shoes')
        .wait('@category-shoes')
        .scrollToPage(2)
        .clickOnFilterGroup('Colour')
        .clickOnFilter('white')

      cy.wait(3000)
      cy.window()
        .its('scrollY')
        .should('equal', 10)
    })
  })
}
