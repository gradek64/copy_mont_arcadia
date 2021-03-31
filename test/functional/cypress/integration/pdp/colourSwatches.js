import PDP from '../../page-objects/Pdp.page'
import pdpData1 from './../../fixtures/pdp/colourSwatches1st.json'
import pdpData2 from './../../fixtures/pdp/colourSwatches2nd.json'
import pdpData3 from './../../fixtures/pdp/colourSwatches3rd.json'
import { isMobileLayout } from '../../lib/helpers'

const pdp = new PDP()

if (isMobileLayout()) {
  describe('Colour swatches', () => {
    beforeEach(() => {
      const path = pdp.mocksForPdpProduct({ productByUrl: pdpData1 })
      cy.visit(path)
    })

    it('Should load correct information when first swatch is clicked', () => {
      pdp.mocksForPdpProduct({
        productByUrl: pdpData2,
      })
      pdp.expectSwatchClickToReturnNewData(pdpData1, 2)
    })
    it('Should load correct information when second swatch is clicked', () => {
      pdp.mocksForPdpProduct({
        productByUrl: pdpData3,
      })
      pdp.expectSwatchClickToReturnNewData(pdpData1, 3)
    })
  })
}
