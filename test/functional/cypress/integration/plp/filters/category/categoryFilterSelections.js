import ProductListingPage from '../../../../page-objects/Plp.page'
import { isDesktopLayout } from '../../../../lib/helpers'

if (isDesktopLayout()) {
  describe('Category filters: category filter selections', () => {
    const plp = new ProductListingPage()

    beforeEach(() => {
      plp.mocksForProductList({
        productNavigation: 'fixture:plp/filters/category-clothing',
        productFilter: 'fixture:plp/filters/category-clothing__filter-dresses',
      })
    })

    it('should not display a category filter group if a category filter is selected', () => {
      cy.visit('/')
      plp
        .clickOnCategoryLink('Clothing')
        .wait('@prod-nav-results')
        .expectFilterSummaryValueToBe('Clothing')

      plp
        .clickOnFilterGroup('Category')
        .clickOnFilter('Dresses')
        .wait('@prod-filtered')
        .expectFilterGroupNotToExist('Category')
        .expectFilterSummaryValueToBe('Dresses')
    })
  })
}
