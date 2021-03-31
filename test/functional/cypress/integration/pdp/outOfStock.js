import outOfStock from '../../fixtures/pdp/outOfStock.json'
import PDP from '../../page-objects/Pdp.page'
import { isMobileLayout } from '../../lib/helpers'

const pdp = new PDP()

if (isMobileLayout()) {
  describe('Out of Stock', () => {
    it("Given I am on a 'Out of Stock' PDP page", () => {
      const path = pdp.mocksForPdpProduct({ productByUrl: outOfStock })
      cy.visit(path)
      cy.get(pdp.productSize)
        .first()
        .should('have.class', 'is-outOfStock')
    })
  })
}
