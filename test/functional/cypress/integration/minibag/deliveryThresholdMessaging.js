import ProductListingPage from './../../page-objects/Plp.page'
import PDP from './../../page-objects/Pdp.page'
import Navigation from './../../page-objects/Navigation.page'
import MiniBag from './../../page-objects/MiniBag.page'
import basketCostMoreThan50 from './../../fixtures/pdp/singleSizeProduct/basketCostMoreThan50.json'
import basketCostLessThan50 from './../../fixtures/pdp/colourSwatches1st.json'
import addtoBagLessThan50 from './../../fixtures/pdp/multiSizeProduct/addtoBagCostLessThan50.json'
import addtoBagmoreThan50 from './../../fixtures/pdp/multiSizeProduct/addToBagCostMoreThan50.json'
import {
  isDesktopLayout,
  setFeature,
  isMobileLayout,
} from './../../lib/helpers'

const minibag = new MiniBag()
const pdp = new PDP()
const navigation = new Navigation()
const plp = new ProductListingPage()
const productsGT50 = 'fixture:plp/delivery-threshold-above-50'

if (isMobileLayout()) {
  describe('EXP-114 Should display delivery threshold message when basket total is above £50', () => {
    beforeEach(() => {
      const path = pdp.mocksForPdpProduct({
        productByUrl: basketCostMoreThan50,
      })
      cy.visit(path)
      setFeature('FEATURE_DELIVERY_THRESHOLD_MESSAGE_DETAILS')
      setFeature('FEATURE_DELIVERY_THRESHOLD_MESSAGE_MINIBAG')
      minibag.mocksForShoppingBag({
        addToBag: addtoBagmoreThan50,
      })
      pdp.addToBag()
      cy.wait('@add-to-bag')
    })

    it('Should display delivery threshold message on mini bag', () => {
      pdp.closeAddConfirmationModal()
      navigation.openMiniBag()
      minibag.verifyDeliveryThresholdMessage()
    })

    it('Should display delivery threshold message on PDP', () => {
      pdp.closeAddConfirmationModal()
      minibag.verifyDeliveryThresholdMessage()
    })
  })

  describe('EXP-114 Should not display delivery threshold message when basket total is below £50', () => {
    beforeEach(() => {
      const path = pdp.mocksForPdpProduct({
        productByUrl: basketCostLessThan50,
      })
      cy.visit(path)
      setFeature('FEATURE_DELIVERY_THRESHOLD_MESSAGE_DETAILS')
      setFeature('FEATURE_DELIVERY_THRESHOLD_MESSAGE_MINIBAG')
      pdp.selectFirstSizeFromTiles()
      minibag.mocksForShoppingBag({
        addToBag: addtoBagLessThan50,
      })
      pdp.addToBag()
      cy.wait('@add-to-bag')
    })

    it('Should not display delivery threshold message on mini bag', () => {
      pdp.closeAddConfirmationModal()
      navigation.openMiniBag()
      minibag.verifyDeliveryThresholdMessage()
    })

    it('Should not display delivery threshold message on PDP', () => {
      pdp.closeAddConfirmationModal()
      minibag.verifyDeliveryThresholdMessage()
    })
  })
}

if (isDesktopLayout()) {
  describe('EXP-114 Should display delivery threshold message on Quick view when basket total is above £50', () => {
    beforeEach(() => {
      plp.mocksForProductList({
        productNavigation: productsGT50,
      })
      cy.visit('/')

      setFeature('FEATURE_DELIVERY_THRESHOLD_MESSAGE_DETAILS')
      setFeature('FEATURE_DELIVERY_THRESHOLD_MESSAGE_MINIBAG')
      plp.clickOnCategoryLink('Clothing')
      cy.wait('@prod-nav-results')
      plp.selectQuickViewForItem(1)
      pdp.selectFirstSizeFromTiles()
      minibag.mocksForShoppingBag({
        addToBag: addtoBagmoreThan50,
      })
      pdp.addToBag()
      cy.wait('@add-to-bag')
    })

    it('Should see delivery threshold message on Quickview for free delivery qualification', () => {
      minibag.verifyDeliveryThresholdMessage('quickView')
    })
  })
}
