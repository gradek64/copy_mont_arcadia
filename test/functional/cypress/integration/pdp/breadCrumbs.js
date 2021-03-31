import PDP from '../../page-objects/Pdp.page'
import pdpData from './../../fixtures/pdp/breadCrumbsPDP.json'
import { isDesktopLayout } from '../../lib/helpers'

const pdp = new PDP()

if (isDesktopLayout()) {
  describe('PDP Breadcrumbs', () => {
    it('should navigate back to relevant location when clicked', () => {
      const path = pdp.mocksForPdpProduct({ productByUrl: pdpData })
      cy.visit(path)

      // No url on this one so page should not change
      pdp.clickOnBreadCrumb(1)
      cy.location('pathname').should('eq', path)

      // Has a url pointing to the home page
      pdp.clickOnBreadCrumb(0)
      cy.location('pathname').should('eq', '/')
    })
  })
}
