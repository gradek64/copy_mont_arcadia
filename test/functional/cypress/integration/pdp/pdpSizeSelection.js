import PDP from './../../page-objects/Pdp.page'
import TileSizePDP from './../../fixtures/pdp/tileSizePDP.json'
import DropdownPDP from './../../fixtures/pdp/dropdownSizeSelectionPDP.json'
import { isMobileLayout } from '../../lib/helpers'

const pdp = new PDP()

if (isMobileLayout()) {
  describe('PDP size selection', () => {
    beforeEach(() => {
      cy.clearCookies()
    })

    describe('PDP size selection options', () => {
      it('sizes should be displayed like tiles when less than 8', () => {
        const path = pdp.mocksForPdpProduct({ productByUrl: TileSizePDP })
        cy.visit(path)
        pdp.verifySizeOptionsLessThan(8)
        cy.get(pdp.tileSizes).should('be.visible')
      })

      it('sizes should be displayed like a dropdown when more than 8', () => {
        const path = pdp.mocksForPdpProduct({ productByUrl: DropdownPDP })
        cy.visit(path)
        pdp.verifySizeOptionsMoreThan(8)
        cy.get(pdp.sizeSelectionDropdown).should('be.visible')
      })

      it('addToBag with no size selected shows an error message', () => {
        pdp.addToBag()
        cy.get(pdp.errorMessage).should('be.visible')
      })
    })
  })
}
