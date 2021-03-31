import itemNotAvailable from '../../fixtures/pdp/itemNotAvailable.json'
import pdpData1 from '../../fixtures/pdp/colourSwatches1st.json'
import productCountryExclusion from '../../fixtures/pdp/product-country-exclusion.json'
import PDP from '../../page-objects/Pdp.page'
import { isMobileLayout } from '../../lib/helpers'

const pdp = new PDP()

if (isMobileLayout()) {
  describe("ADP-2956 'Item not available' PDP page", () => {
    before(() => {
      let path
      path = pdp.mocksForPdpProduct({ productByUrl: pdpData1 })
      cy.visit(path)
      path = pdp.mocksForPdpProduct({ productByUrl: itemNotAvailable })
      cy.visit(path)
    })

    it(' should display item not available header', () => {
      pdp.assertItemNotAvailableHeading()
    })

    it(" should not display size tiles, size guide, 'add to bag' and 'find in store' button", () => {
      pdp.assertItemNotAvailablePage()
    })

    it(' the product details should be displayed under a chevron which will expand when clicked on the arrow', () => {
      pdp.assertOOSProductDetails()
    })

    it(' should display recently viewed products', () => {
      pdp.assertRecentlyViewedProduct()
    })
  })

  describe('ADP-3711 product excluded from country', () => {
    before(() => {
      const path = pdp.mocksForPdpProduct({
        productByUrl: productCountryExclusion,
      })
      cy.visit(path, {
        headers: {
          'x-user-geo': 'GB',
        },
      })
    })

    it('should disable the add to bag button for country exclusion', () => {
      // This assertion fails when running the tests locally but it does work when running on Jenkins
      cy.get('.AddToBag .Button').should('be.disabled')
    })
  })
}
