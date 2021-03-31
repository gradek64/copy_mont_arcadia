import ProductListingPage from '../../../../page-objects/Plp.page'
import { isDesktopLayout } from '../../../../lib/helpers'

if (isDesktopLayout()) {
  describe('Category Filters - price: infinity scroll', () => {
    const plp = new ProductListingPage()

    beforeEach(() => {
      plp.mocksForProductList({
        productNavigation: 'fixture:plp/filters/category-shoes',
        productFilter:
          'fixture:plp/filters/category-shoes__filter-price-min-26',
        filter: '/**CBTWN',
      })
      cy.visit('/')
      plp.clickOnCategoryLink('Shoes').wait('@prod-nav-results')
    })

    it('should display 24 products when first applying price filter ', () => {
      plp
        .slideToPrice('min', 20) // £26
        .wait('@prod-filtered')

        .expectFilterPriceToMatchSummaryPrice()
        .expectProductListLengthToBe(24)
    })

    it('scrolling to page 2 should display 48 filtered products', () => {
      plp
        .slideToPrice('min', 20) // £26
        .wait('@prod-filtered')

        .mocksForProductList({
          productFilter:
            'fixture:plp/filters/category-shoes__filter-price-min-26__page-2',
          filter: '/**|BTWN',
        })

      plp
        .scrollToPage(2)
        .wait('@prod-filtered')

        .expectProductListLengthToBe(48)
    })
  })
}
