import getLastGtmEventOfType from '../../../lib/getLastGtmEventOfType'
import { isMobileLayout } from './../../../lib/helpers'
import Navigation from '../../../page-objects/Navigation.page'
import ProductListingPage from '../../../page-objects/Plp.page'
import noResults from '../../../fixtures/plp/no-results.json'

const navigation = new Navigation()
const plp = new ProductListingPage()
const searchTerm = 'lookforthis'

if (isMobileLayout()) {
  describe('GA events for search bar', () => {
    beforeEach(() => {
      plp.mocksForProductList({
        productSearchTerm: searchTerm,
        productSearchResults: noResults,
      })
      cy.visit('/')
      cy.clearCookie('authenticated')
    })

    it('should generate clickevent when search bar selected', () => {
      navigation.clickSearchIcon()
      getLastGtmEventOfType('ea', 'clickevent').then((event) => {
        expect(event.ea).to.equal('searchbar')
        expect(event.ec).to.equal('searchSelected')
        Cypress.config('baseUrl')
        expect(event.el).to.equal(`${Cypress.config('baseUrl')}/`)
      })
    })

    it('should capture the search term when no results "search again" selected', () => {
      navigation.clickSearchIcon()
      getLastGtmEventOfType('ea', 'clickevent').then((event) => {
        expect(event.ea).to.equal('searchbar')
        expect(event.ec).to.equal('searchSelected')
        Cypress.config('baseUrl')
        expect(event.el).to.equal(`${Cypress.config('baseUrl')}/`)
      })
    })
  })
}
