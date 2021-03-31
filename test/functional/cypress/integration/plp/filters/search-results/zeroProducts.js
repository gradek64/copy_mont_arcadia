import ProductListingPage from '../../../../page-objects/Plp.page'
import {
  isDesktopLayout,
  setUpMocksForRouteList,
} from '../../../../lib/helpers'
import filterRoutes from '../../../../../mock-server/routes/plp/filters/index'

const plp = new ProductListingPage()
const noResultsSearchLink = `en/tsuk/category/shoes-430/shop-all-shoes-6909322/N-8gyZdgl?&Nf=nowPrice%7CBTWN%2B93%2B93&Nrpp=24&siteId=%2F12556`

describe('Zero Results - Filters', () => {
  beforeEach(() => {
    setUpMocksForRouteList(filterRoutes)
    plp.mocksForProductList({
      productNavigation: 'fixture:plp/filters/category-shoes',
    })
    cy.visit('/')
    if (!isDesktopLayout()) {
      plp
        .clickOnMenuButtonMobile()
        .clickOnCategoryLink('Shoes')
        .clickOnSubCategoryLink('Shop All Shoes')
        .wait('@prod-nav-results')
        .clickOnFilterButton()
        .clickOnFilterGroup('Price')
    } else {
      plp.clickOnCategoryLink('Shoes').wait('@prod-nav-results')
    }
  })

  it('should display zero results on page when I apply a filter that returns no products', () => {
    plp
      .slideToPrice('min', 140)
      .slideToPrice('max', -160)
      .expectResultsToBe(0)
    if (!isDesktopLayout()) {
      plp.expectNoResultsMessageMobileFilterToBeDisplayed()
    }
  })
})

describe('Zero Results - Filter Search Link', () => {
  beforeEach(() => {
    setUpMocksForRouteList(filterRoutes)
  })

  it('should display zero results page when I goto a filter search link that returns no results.', () => {
    cy.visit(noResultsSearchLink, { failOnStatusCode: false })
    plp.expectResultsToBe(0)
  })
})
