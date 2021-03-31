import ProductListingPage from '../../../../page-objects/Plp.page'
import NavigationPage from '../../../../page-objects/Navigation.page'
import filterRoutes from '../../../../../mock-server/routes/plp/filters/index'

import {
  isDesktopLayout,
  setUpMocksForRouteList,
} from '../../../../lib/helpers'

if (isDesktopLayout()) {
  describe('Search results filters: colour & size selections', () => {
    const plp = new ProductListingPage()
    const navigation = new NavigationPage()

    beforeEach(() => {
      setUpMocksForRouteList(filterRoutes)
      cy.visit('/')
      navigation.searchFor('shirts')
      plp.wait('@search-shirts')
    })

    it('should expand "Colour" & "Size" groups and show filter selections', () => {
      plp
        .clickOnFilterGroup('Colour')
        .clickOnFilter('blue')
        .wait('@search-shirts-blue')

        .clickOnFilterGroup(/^Size/)
        .clickOnFilter('6')
        .wait('@search-shirts-blue-size6')

        .expectFilterGroupToBeExpanded('Colour')
        .expectFilterGroupToBeExpanded(/^Size/)
    })

    it('should only collapse "Size" filter group when unselected', () => {
      plp
        .clickOnFilterGroup('Colour')
        .clickOnFilter('blue')
        .wait('@search-shirts-blue')

        .clickOnFilterGroup(/^Size/)
        .clickOnFilter('6')
        .wait('@search-shirts-blue-size6')

        .clickOnFilter('6')
        .wait('@search-shirts-blue')

        .expectSummaryTitleNotToExist('6')
        .expectSummaryFilterGroupNotToExist(/^Size/)
        .expectFilterGroupNotToBeExpanded(/^Size/)
        .expectSummaryFilterGroupToExist('Colour')
        .expectSummaryTitleToExist('blue')
    })

    it('should collapse "Colour" filter group when unselected', () => {
      plp
        .clickOnFilterGroup('Colour')
        .clickOnFilter('blue')
        .wait('@search-shirts-blue')

        .clickOnFilterGroup(/^Size/)
        .clickOnFilter('6')
        .wait('@search-shirts-blue-size6')

        .clickOnFilter('6')
        .wait('@search-shirts-blue')

        .clickOnFilter('blue')
        .wait('@search-shirts')

        .expectFilterSummaryValueToBe('shirts')
        .expectSummaryTitleNotToExist('blue')
        .expectSummaryFilterGroupNotToExist('Colour')
        .expectFilterGroupNotToBeExpanded('Colour')
    })
  })
}
