import PDP from '../../page-objects/Pdp.page'
import Navigation from '../../page-objects/Navigation.page'
import lowInStock from '../../fixtures/pdp/lowInStock.json'
import recommendsProd from '../../fixtures/pdp/peerius/peeriusRecommendsProduct.json'
import peeriusData from '../../fixtures/pdp/peerius/peeriusRecommends.json'
import Plp from '../../page-objects/Plp.page'
import QuickView from '../../page-objects/QuickView.page'
import filterRoutes from '../../../mock-server/routes/plp/filters/index'
import {
  setFeatureFlag,
  setUpMocksForRouteList,
  injectPeeriusRecommends,
  isDesktopLayout,
  isMobileLayout,
} from '../../lib/helpers'

const pdp = new PDP()
const nav = new Navigation()
const plp = new Plp()
const qv = new QuickView()

if (isMobileLayout()) {
  describe('Quantity Selector - PDP - Feature flag off', () => {
    beforeEach(() => {
      setUpMocksForRouteList(filterRoutes)
      cy.visit('/')
      setFeatureFlag('FEATURE_PDP_QUANTITY', false)
      const path = pdp.mocksForPdpProduct({ productByUrl: lowInStock })
      cy.visit(path)
    })

    it('should not display quantity selector', () => {
      pdp.expectQuantitySelectorNotBeVisible()
    })

    it('should be able to add 1 item to the basket', () => {
      pdp.selectFirstSizeFromTiles().addToBag()
      nav.hasNumberOfItems('1')
    })
  })
}

if (isDesktopLayout()) {
  describe('Quantity Selector - PLP - Quickview - Feature flag off', () => {
    beforeEach(() => {
      plp.mocksForProductList({
        productNavigation: 'fixture:plp/filters/category-shoes',
      })
      setFeatureFlag('FEATURE_PDP_QUANTITY', false)
      cy.visit('/')
      plp.selectShoesCatHeader()
      cy.get(plp.quickViewButton)
        .eq(1)
        .click()
    })

    it('should not display quantity selector', () => {
      plp.expectQuantitySelectorNotBeVisible()
    })

    it('should be able to add 1 item to the basket', () => {
      qv.selectTile(1).clickAddToBag()
      nav.hasNumberOfItems('1')
    })
  })

  describe('Quantity Selector - PDP - Quickview - Feature flag off', () => {
    beforeEach(() => {
      setUpMocksForRouteList(filterRoutes)
      cy.visit('/')
      setFeatureFlag('FEATURE_PDP_QUANTITY', false)
      setFeatureFlag('FEATURE_DRESSIPI_RECOMMENDATIONS', false)
      const path = pdp.mocksForPdpProduct({
        productByUrl: recommendsProd,
        productById: recommendsProd,
      })
      cy.visit(path)
    })

    it('should not display quantity selector', () => {
      qv.expectQuantitySelectorNotToBeVisible()
    })
  })
}
