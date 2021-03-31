import ProductListingPage from '../../../../page-objects/Plp.page'
import filterRoutes from '../../../../../mock-server/routes/plp/filters/index'

import {
  isDesktopLayout,
  setUpMocksForRouteList,
} from '../../../../lib/helpers'

if (isDesktopLayout()) {
  describe('Category filters: colour & size selections', () => {
    const plp = new ProductListingPage()

    beforeEach(() => {
      setUpMocksForRouteList(filterRoutes)
      cy.visit('/')
      plp.clickOnCategoryLink('Clothing').wait('@category-clothing')
    })

    it('should expand "Colour" & "Size" groups and show filter selections', () => {
      plp
        .clickOnFilterGroup('Colour')
        .clickOnFilter('blue')
        .wait('@category-clothing-blue')

        .clickOnFilterGroup(/^Size/)
        .clickOnFilter('12')
        .wait('@category-clothing-blue-size12')

        .expectFilterGroupToBeExpanded('Colour')
        .expectFilterGroupToBeExpanded(/^Size/)
    })

    it('should only collapse "Size" filter group when unselected', () => {
      plp
        .clickOnFilterGroup('Colour')
        .clickOnFilter('blue')
        .wait('@category-clothing-blue')

        .clickOnFilterGroup(/^Size/)
        .clickOnFilter('12')
        .wait('@category-clothing-blue-size12')

        .clickOnFilter('12')
        .wait('@category-clothing-blue')

        .expectSummaryTitleNotToExist('12')
        .expectSummaryFilterGroupNotToExist(/^Size/)
        .expectFilterGroupNotToBeExpanded(/^Size/)
        .expectSummaryFilterGroupToExist('Colour')
        .expectSummaryTitleToExist('blue')
    })

    it('should collapse "Colour" filter group when unselected', () => {
      plp
        .clickOnFilterGroup('Colour')
        .clickOnFilter('blue')
        .wait('@category-clothing-blue')

        .clickOnFilterGroup(/^Size/)
        .clickOnFilter('12')
        .wait('@category-clothing-blue-size12')

        .clickOnFilter('12')
        .wait('@category-clothing-blue')

        .clickOnFilter('blue')
        .wait('@category-clothing')

        .expectSummaryTitleNotToExist('blue')
        .expectSummaryFilterGroupNotToExist('Colour')
        .expectFilterGroupNotToBeExpanded('Colour')
    })
  })
}
