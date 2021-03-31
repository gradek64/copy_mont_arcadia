import { isDesktopLayout, setFeature } from './../../lib/helpers'
import singleSizeProduct from './../../fixtures/pdp/singleSizeProduct/pdpInitialFetch.json'
import PDP from '../../page-objects/Pdp.page'
import MiniBag from './../../page-objects/MiniBag.page'

const minibag = new MiniBag()
const pdp = new PDP()

if (isDesktopLayout()) {
  describe('EXP-83 Newsletter signup pop up', () => {
    beforeEach(() => {
      minibag.mocksForShoppingBag({
        addToBag: 'fixture:pdp/singleSizeProduct/addToBag',
      })
      const path = pdp.mocksForPdpProduct({
        productByUrl: singleSizeProduct,
      })
      cy.visit(path)
      setFeature('FEATURE_ABANDONMENT_MODAL')
      pdp.addToBag()
      cy.scrollTo('top')
        .get(minibag.miniBagCloseButton)
        .click()
    })

    it(' should display on pdp page', () => {
      pdp.assertNewsletterSignup()
    })
  })
}
