import ProductListingPage from '../../page-objects/Plp.page'
import filterRoutes from '../../../mock-server/routes/plp/filters/index'

import { isDesktopLayout, setUpMocksForRouteList } from '../../lib/helpers'

if (isDesktopLayout()) {
  describe('Category Filters - Sorting', () => {
    const plp = new ProductListingPage()

    beforeEach(() => {
      setUpMocksForRouteList(filterRoutes)
    })

    // TODO add filters & sort tests. Add other sorts perhaps? Newest?

    describe('Can sort by price', () => {
      beforeEach(() => {
        cy.visit('/')
        plp.clickOnCategoryLink('Shoes').wait('@category-shoes')
      })

      it('should display correct product order when sorting "High To Low"', () => {
        plp
          .sortBy('Price - High To Low')
          .wait('@category-shoes-orderByHighToLow')
          .expectProductListToBeOrderedBy('Price - High To Low')
      })

      it('should display correct product order when sorting "Low To High"', () => {
        plp
          .sortBy('Price - Low To High')
          .wait('@category-shoes-orderByLowToHigh')
          .expectProductListToBeOrderedBy('Price - Low To High')
      })
    })
  })
}
