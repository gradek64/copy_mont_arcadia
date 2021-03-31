import ProductListingPage from '../../../../page-objects/Plp.page'
import filterRoutes from '../../../../../mock-server/routes/plp/filters/index'

import {
  isMobileLayout,
  isDesktopLayout,
  setUpMocksForRouteList,
  setFeatureFlag,
} from '../../../../lib/helpers'

describe('Category filters: colour - infinity scroll', () => {
  const plp = new ProductListingPage()

  beforeEach(() => {
    setUpMocksForRouteList(filterRoutes)
    cy.visit('/')
    setFeatureFlag('FEATURE_QUBIT_HIDDEN')
  })

  it('should initially display 24 products then 48 when scrolling', () => {
    if (isDesktopLayout()) {
      plp
        .clickOnCategoryLink('Shoes')
        .wait('@category-shoes')
        .clickOnFilterGroup('Colour')
        .clickOnFilter('white')
    }

    if (isMobileLayout()) {
      plp
        .clickOnMenuButtonMobile()
        .clickOnCategoryLink('Shoes')
        .clickOnSubCategoryLink('Shop All Shoes')
        .wait('@category-shoes')
        .clickOnFilterButton()
        .clickOnFilterGroup('Colour')
        .refinementsScrollTo('bottom')
        .clickOnFilter('white')
        .wait('@category-shoes-white')
        .clickOnApplyFiltersButton()
    }

    plp
      .wait('@category-shoes-white')
      .expectProductListLengthToBe(24)
      .scrollToPage(2)
      .wait('@category-shoes-white-page2')
      .expectProductListLengthToBe(48)
  })

  it('should reset product count when applying a filter after scrolling', () => {
    if (isDesktopLayout()) {
      plp.clickOnCategoryLink('Shoes')
    }

    if (isMobileLayout()) {
      plp
        .clickOnMenuButtonMobile()
        .clickOnCategoryLink('Shoes')
        .clickOnSubCategoryLink('Shop All Shoes')
    }

    plp
      .wait('@category-shoes')
      .scrollToPage(2)
      .wait('@category-shoes-page2')
      .expectProductListLengthToBe(48)

    if (isDesktopLayout()) {
      plp.clickOnFilterGroup('Colour').clickOnFilter('white')
    }

    if (isMobileLayout()) {
      plp
        .clickOnFilterButton()
        .clickOnFilterGroup('Colour')
        .refinementsScrollTo('bottom')
        .clickOnFilter('white')
        .wait('@category-shoes-white')
        .clickOnApplyFiltersButton()
    }

    plp.wait('@category-shoes-white').expectProductListLengthToBe(24)
  })
})
