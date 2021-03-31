import ProductListingPage from '../../../page-objects/Plp.page'

import { isDesktopLayout } from '../../../lib/helpers'

if (isDesktopLayout()) {
  describe('Filter actions - remove via summary buttons', () => {
    const plp = new ProductListingPage()
    beforeEach(() => {
      plp.mocksForProductList({
        productNavigation: 'fixture:plp/filters/category-shoes',
      })
    })

    describe('Can remove filters by group', () => {
      it('should not contain summary labels "white" and "price" after removal', () => {
        plp.mocksForProductList({
          productFilter:
            'fixture:plp/filters/category-shoes__filter-colour-white',
          filter: '/white/',
        })
        cy.visit('/')
        // select and assert "white has been applied
        plp
          .clickOnCategoryLink('Shoes')

          .wait('@prod-nav-results')
          .clickOnFilterGroup('Colour')
          .clickOnFilter('white')
          .wait('@prod-filtered')
        plp.expectSummaryTitleToExist('white')

        // select and assert "price min" has been applied
        plp.mocksForProductList({
          productFilter:
            'fixture:plp/filters/category-shoes__filters-colour-white-price-min-15',
          filter: '/white/**/**CBTWN',
        })
        plp
          .slideToPrice('min', 20) // £15
          .wait('@prod-filtered')
          .expectSummaryTitleToExist('£15.00')
          .expectFilterPriceToMatchSummaryPrice()

        // assert filter "white" has been successfully removed
        plp.mocksForProductList({
          productFilter:
            'fixture:plp/filters/category-shoes__filter-price-min-15',
          filter: '/**CBTWN',
        })
        plp
          .clickToRemoveFilterFromSummary('white')
          .wait('@prod-filtered')
          .expectFilterNotToBeChecked('Colour', 'white')
          .expectResultsToBe('815')

        plp.mocksForProductList({
          productFilter: 'fixture:plp/filters/category-shoes',
          filter: '/**shoes-430/N-8ewZdgl',
        })
        plp
          .clickToRemoveFilterFromSummary('Price')
          .wait('@prod-filtered')
          .expectSummaryTitleNotToExist('£15.00')
          .expectResultsToBe('850')
      })
    })

    describe('Can remove entire price min & max filter selection ', () => {
      it('should not contain "min & max" summary price value after removal', () => {
        plp.mocksForProductList({
          productFilter:
            'fixture:plp/filters/category-shoes__filter-price-min-26.json',
          filter: '/**CBTWN',
        })
        cy.visit('/')
        // select and assert "price min" has been applied
        plp
          .clickOnCategoryLink('Shoes')
          .wait('@prod-nav-results')
          .slideToPrice('min', 20) // £26
          .wait('@prod-filtered')
          .expectFilterPriceToMatchSummaryPrice()

        plp
          .slideToPrice('max', -20) // £142
          .wait('@prod-filtered')
          .expectFilterPriceToMatchSummaryPrice()

        // assert filter "price min & max" has been successfully removed
        plp.mocksForProductList({
          productFilter: 'fixture:plp/filters/category-shoes',
          filter: '/**shoes-430/N-8ewZdgl',
        })
        plp
          .clickToRemoveFilterFromSummary('Price')
          .wait('@prod-filtered')
          .expectSummaryFilterGroupNotToExist('Price')
          .expectResultsToBe('850')
      })
    })
  })
}
