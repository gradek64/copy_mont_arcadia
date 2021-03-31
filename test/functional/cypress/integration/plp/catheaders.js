import { isDesktopLayout } from '../../lib/helpers'
import Plp from '../../page-objects/Plp.page'

const plp = new Plp()

if (isDesktopLayout()) {
  /*
   * The cat header doesn't render because the MCR
   * script is not served due to our mock server
   *
   * Should this test live in the monty functional tests as we are testing MCR
   * here.
   */
  describe.skip('When load a plp page', () => {
    it('should display category header if category header url is passed', () => {
      plp.mocksForProductList({
        productNavigation: 'fixture:plp/filters/category-clothing',
      })
      cy.visit('/')
      plp.clickOnCategoryLink('Clothing')
      cy.get('.CategoryHeader-title').should('exist')
    })
  })
}
