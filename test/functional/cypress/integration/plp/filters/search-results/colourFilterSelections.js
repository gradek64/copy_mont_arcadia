import ProductListingPage from '../../../../page-objects/Plp.page'
import NavigationPage from '../../../../page-objects/Navigation.page'
import filterRoutes from '../../../../../mock-server/routes/plp/filters/index'

import {
  isDesktopLayout,
  setUpMocksForRouteList,
} from '../../../../lib/helpers'

if (isDesktopLayout()) {
  describe('Search results Filters: colour filter selections', () => {
    const plp = new ProductListingPage()
    const navigation = new NavigationPage()

    beforeEach(() => {
      setUpMocksForRouteList(filterRoutes)
      cy.visit('/')
      navigation.searchFor('shirts')
      plp.wait('@search-shirts')
    })

    it('should expand "Colour" filter group when selected', () => {
      plp.expectFilterSummaryValueToBe('shirts').expectResultsToBe('409')
    })

    it('should display "blue" filter as selected and update results', () => {
      plp
        .clickOnFilterGroup('Colour')
        .clickOnFilter('blue')
        .wait('@search-shirts-blue')

        .expectSummaryFilterGroupToExist('Colour')
        .expectSummaryTitleToExist('blue')
        .expectResultsToBe('96')
    })

    it('should add "brown" as selected and update results', () => {
      plp
        .clickOnFilterGroup('Colour')
        .clickOnFilter('blue')
        .wait('@search-shirts-blue')

        .clickOnFilterGroup('brown')
        .clickOnFilter('brown')
        .wait('@search-shirts-blue-brown')

        .expectSummaryTitleToExist('brown')
        .expectResultsToBe('100')
    })

    it('should remove "brown" from selection and update results', () => {
      plp
        .clickOnFilterGroup('Colour')
        .clickOnFilter('blue')
        .wait('@search-shirts-blue')

        .clickOnFilterGroup('brown')
        .clickOnFilter('brown')
        .wait('@search-shirts-blue-brown')

        .clickOnFilter('brown')
        .wait('@search-shirts-blue')

        .expectSummaryTitleNotToExist('brown')
        .expectResultsToBe('96')
    })

    it('should collapse filter group and update results when removing last filter', () => {
      plp
        .clickOnFilterGroup('Colour')
        .clickOnFilter('blue')
        .wait('@search-shirts-blue')

        .clickOnFilterGroup('brown')
        .clickOnFilter('brown')
        .wait('@search-shirts-blue-brown')

        .clickOnFilter('brown')
        .wait('@search-shirts-blue')

        .clickOnFilter('blue')
        .wait('@search-shirts')

        .expectSummaryTitleNotToExist('blue')
        .expectSummaryFilterGroupNotToExist('Colour')
        .expectFilterGroupNotToBeExpanded('Colour')
        .expectResultsToBe('409')
    })
  })
}
