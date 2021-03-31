import ProductListingPage from '../../../../page-objects/Plp.page'
import filterRoutes from '../../../../../mock-server/routes/plp/filters/index'

import {
  isMobileLayout,
  setUpMocksForRouteList,
} from './../../../../lib/helpers'

describe('Filters: "Clear All" actions', () => {
  const plp = new ProductListingPage()

  beforeEach(() => {
    setUpMocksForRouteList(filterRoutes)
    cy.visit('/')
    if (isMobileLayout()) {
      plp
        .clickOnMenuButtonMobile()
        .clickOnCategoryLink('Clothing')
        .clickOnSubCategoryLinkMobile('Dresses')
        .wait('@category-clothing-dresses-mobile')
        .clickOnFilterButton()
    } else {
      plp.clickOnCategoryLink('Clothing').wait('@category-clothing')
    }
  })

  it('should allow "Clear All" filters after plp has loaded', () => {
    plp.expectClearAllToBeDisabled()
  })

  it('should allow "Clear All" after making filter selections', () => {
    const filterAlias = isMobileLayout()
      ? '@category-clothing-dresses-blue'
      : '@category-clothing-blue'

    plp
      .clickOnFilterGroup('Colour')
      .clickOnFilter('blue')
      .wait(filterAlias)
      .expectClearAllToBeEnabled()
  })

  it('should remove filters and disable when "Clear All" is clicked', () => {
    const filterAlias = isMobileLayout()
      ? '@category-clothing-dresses-blue'
      : '@category-clothing-blue'
    const clearAllAlias = isMobileLayout()
      ? '@category-clothing-dresses-clear-all'
      : '@category-clothing-clear-all'

    plp
      .clickOnFilterGroup('Colour')
      .clickOnFilter('blue')
      .wait(filterAlias)
      .clickClearAll()
      .wait(clearAllAlias)
      .expectSummaryTitleNotToExist('blue')
      .expectSummaryFilterGroupNotToExist('Colour')
      .expectFilterGroupNotToBeExpanded('Colour')
      .expectClearAllToBeDisabled()
  })
})
