import ProductListingPage from '../../../page-objects/Plp.page'
import { eventTypeFilter, isMobileLayout } from '../../../lib/helpers'

const plp = new ProductListingPage()

if (isMobileLayout()) {
  describe('PLP to PDP GTM page events', () => {
    beforeEach(() => {
      plp.mocksForProductList({
        productNavigation: 'fixture:plp/filters/category-clothing',
      })
      cy.visit('/')
    })
    it('dataLayer impressions should have list and category same as plp page category', () => {
      plp.selectShoesCatHeader()

      cy.filterGtmEvents(
        eventTypeFilter('impression', ['ecommerce', 'impressions'])
      ).then((event) => {
        const { list, category } = event.ecommerce.impressions[0]

        expect(category).to.equal('Clothing')
        expect(list).to.equal('Clothing')
      })
    })
  })
}
