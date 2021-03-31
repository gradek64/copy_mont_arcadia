import ProductListingPage from '../../../../page-objects/Plp.page'
import NavigationPage from '../../../../page-objects/Navigation.page'

import { isDesktopLayout } from '../../../../lib/helpers'

if (isDesktopLayout()) {
  describe('Search results filters: price - infinity scroll', () => {
    const plp = new ProductListingPage()
    const navigation = new NavigationPage()

    beforeEach(() => {
      plp.mocksForProductList({
        productSearchTerm: 'shirts',
        productSearchResults: 'fixture:plp/filters/search-shirts',
        productFilter: 'fixture:plp/filters/search-shirts__filter-price-min-35',
        filter: '/**CBTWN',
      })
      cy.visit('/')
      navigation.searchFor('shirts')
      plp.wait('@prod-search-results')
    })

    it('should display 24 products when first applying price filter ', () => {
      plp.mocksForProductList({
        productFilter: 'fixture:plp/filters/search-shirts__filter-price-min-35',
      })
      plp
        .slideToPrice('min', 20)
        .wait('@prod-filtered')

        .expectProductListLengthToBe(24)
        .expectFilterPriceToMatchSummaryPrice()
    })

    it('scrolling to page 2 should display 48 filtered products', () => {
      plp
        .slideToPrice('min', 20)
        .wait('@prod-filtered')
        .mocksForProductList({
          productFilter:
            'fixture:plp/filters/search-shirts__filter-price-min-35__page-2',
          filter: '/**|BTWN',
        })

      plp
        .scrollToPage(2)
        .wait('@prod-filtered')

        .expectProductListLengthToBe(48)
        .expectFilterPriceToMatchSummaryPrice()
    })
  })
}
