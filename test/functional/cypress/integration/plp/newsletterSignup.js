import { isDesktopLayout, setFeature } from './../../lib/helpers'
import singleSizeProduct from './../../fixtures/pdp/singleSizeProduct/pdpInitialFetch.json'
import addToBagItem from '../../fixtures/pdp/singleSizeProduct/addToBag.json'
import ProductDetailPage from './../../page-objects/Pdp.page'
import ProductListingPage from './../../page-objects/Plp.page'
import MiniBag from './../../page-objects/MiniBag.page'

const minibag = new MiniBag()
const pdp = new ProductDetailPage()
const plp = new ProductListingPage()

if (isDesktopLayout()) {
  describe('EXP-83 Newsletter signup pop up', () => {
    beforeEach(() => {
      minibag.mocksForShoppingBag({
        authState: 'false',
        addToBag: addToBagItem,
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
      plp.clickOnCategoryLink('Clothing')
    })

    it(' should display on plp page', () => {
      pdp.assertNewsletterSignup()
    })
  })
}
