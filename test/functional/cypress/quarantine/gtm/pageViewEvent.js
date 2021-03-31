import '../../lib/tcombSchemaExtensions'
import * as Schemas from '../../lib/schemas'
import breakpoints from './../../constants/breakpoints'
import getLastGtmEventOfType from '../../lib/getLastGtmEventOfType'
import ProductListingPage from './../../page-objects/Plp.page'
import productList from '../../fixtures/plp/initialPageLoad.json'
import productItem from '../../fixtures/pdp/multiSizeProduct/pdpInitialFetch.json'
import { isMobileLayout } from '../../lib/helpers'

const Plp = new ProductListingPage()

if (isMobileLayout()) {
  describe('GTM analytics for pageView', () => {
    it('GTM analytics of home page', () => {
      cy.visit('/')

      getLastGtmEventOfType('user').then((event) => {
        expect(event.user.loggedIn).to.equal('False')
      })

      getLastGtmEventOfType('pageType').then((event) => {
        expect(event.pageCategory).to.equal('TS:Home Page')
        expect(event.pageType).to.equal('TS:Home Page')
      })
    })

    it('GTM analytics of plp page', () => {
      const path = Plp.mocksForProductList({
        productSearchTerm: 'Jeans',
        productSearchResults: productList,
      })
      cy.visit(path)

      getLastGtmEventOfType('user').then((event) => {
        expect(event.user.loggedIn).to.equal('False')
      })

      getLastGtmEventOfType('pageType').then((event) => {
        expect(event.pageCategory).to.equal('TS:Search')
        expect(event.pageType).to.equal('TS:Category Display')
      })
    })

    it('GTM analytics of Quick View modal', () => {
      cy.viewport(breakpoints.desktop.width, breakpoints.desktop.height)
      const path = Plp.mocksForProductList({
        productSearchTerm: 'Jeans',
        productSearchResults: productList,
      })
      Plp.mocksForPdpProduct({
        productById: productItem,
      })
      cy.visit(path)

      Plp.selectQuickViewForItem(1)
      getLastGtmEventOfType('ecommerce', 'detail').then((event) => {
        expect(event).to.be.tcombSchema(Schemas.QuickViewEventDetail)
      })
    })
  })
}
