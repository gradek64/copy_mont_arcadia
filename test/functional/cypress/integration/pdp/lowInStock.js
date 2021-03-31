import lowInStock from '../../fixtures/pdp/lowInStock.json'
import PDP from '../../page-objects/Pdp.page'
import { isMobileLayout } from '../../lib/helpers'

const pdp = new PDP()

if (isMobileLayout()) {
  describe('Low In Stock', () => {
    it("Given I am on a 'Low In Stock' PDP page", () => {
      const path = pdp.mocksForPdpProduct({ productByUrl: lowInStock })
      cy.visit(path)
      pdp.selectFirstSizeFromTiles()
      cy.contains('This size is low in stock!')
    })
  })
}
