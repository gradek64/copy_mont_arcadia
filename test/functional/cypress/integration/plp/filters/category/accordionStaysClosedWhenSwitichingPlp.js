import ProductListingPage from '../../../../page-objects/Plp.page'
import { isDesktopLayout } from '../../../../lib/helpers'

if (isDesktopLayout()) {
  describe('Category filters: Filter Accordions Are Closed When Opening PLP', () => {
    const plp = new ProductListingPage()
    beforeEach(() => {
      plp.mocksForProductList({
        productNavigation: 'fixture:plp/filters/category-clothing',
        productFilter: 'fixture:plp/filters/category-clothing__filter-dresses',
      })
    })

    it('Should show all filter accordions closed when on PLP except for price accordion', () => {
      cy.visit('/')
      plp
        .clickOnCategoryLink('Clothing')
        .wait('@prod-nav-results')
        .expectFilterSummaryValueToBe('Clothing')
        .clickOnFilterGroup('Colour')
        .expectFilterGroupToBeExpanded('Colour')
        .clickOnFilterGroup('Category')
        .clickOnFilter('Dresses')
        .wait('@prod-filtered')
        .expectFilterGroupNotToBeExpanded('Colour')
        .expectFilterGroupToBeExpanded('Price')
    })
  })
}
