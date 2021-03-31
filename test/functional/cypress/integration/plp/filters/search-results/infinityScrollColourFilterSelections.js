import ProductListingPage from '../../../../page-objects/Plp.page'
import NavigationPage from '../../../../page-objects/Navigation.page'
import filterRoutes from '../../../../../mock-server/routes/plp/filters/index'

import {
  isDesktopLayout,
  setUpMocksForRouteList,
} from '../../../../lib/helpers'

if (isDesktopLayout()) {
  describe('Search results filters: colour - infinity scroll', () => {
    const plp = new ProductListingPage()
    const navigation = new NavigationPage()

    beforeEach(() => {
      setUpMocksForRouteList(filterRoutes)
      cy.visit('/')
      navigation.searchFor('shirts')
      plp.wait('@search-shirts')
    })

    it('should display 24 products when first applying colour filter ', () => {
      plp
        .clickOnFilterGroup('Colour')
        .clickOnFilter('blue')
        .wait('@search-shirts-blue')

        .expectProductListLengthToBe(24)
    })

    it('scrolling to page 2 should display 48 filtered products', () => {
      plp
        .clickOnFilterGroup('Colour')
        .clickOnFilter('blue')
        .wait('@search-shirts-blue')

        .scrollToPage(2)
        .wait('@search-shirts-blue-page2')

        .expectProductListLengthToBe(48)
    })
  })
}
