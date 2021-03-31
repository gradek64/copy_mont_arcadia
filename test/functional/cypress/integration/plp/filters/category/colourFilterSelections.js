import ProductListingPage from '../../../../page-objects/Plp.page'
import filterRoutes from '../../../../../mock-server/routes/plp/filters/index'

import {
  isDesktopLayout,
  isMobileLayout,
  setUpMocksForRouteList,
} from '../../../../lib/helpers'

if (isDesktopLayout()) {
  describe('Category filters: colour selections', () => {
    const plp = new ProductListingPage()

    beforeEach(() => {
      setUpMocksForRouteList(filterRoutes)
      cy.visit('/')
      plp.clickOnCategoryLink('Shoes').wait('@category-shoes')
    })

    it('should expand "Colour" filter group when selected', () => {
      plp
        .expectResultsToBe('850')
        .expectFilterSummaryValueToBe('Shoes')
        .expectFilterGroupNotToBeExpanded('Colour')
        .clickOnFilterGroup('Colour')
        .expectFilterGroupToBeExpanded('Colour')
    })

    it('should display "white" filter as selected and update results', () => {
      plp
        .clickOnFilterGroup('Colour')
        .clickOnFilter('white')
        .wait('@category-shoes-white')

        .expectSummaryFilterGroupToExist('Colour')
        .expectSummaryTitleToExist('white')
        .expectResultsToBe('86')
    })

    it('should add "black" as selected and update results', () => {
      plp
        .clickOnFilterGroup('Colour')
        .clickOnFilter('white')
        .wait('@category-shoes-white')

        .clickOnFilter('black')
        .wait('@category-shoes-white-black')

        .expectSummaryTitleToExist('black')
        .expectResultsToBe('373')
    })

    it('should remove "black" from selection and update results', () => {
      plp
        .clickOnFilterGroup('Colour')
        .clickOnFilter('white')
        .wait('@category-shoes-white')

        .clickOnFilter('black')
        .wait('@category-shoes-white-black')

        .clickOnFilter('black')
        .wait('@category-shoes-white')

        .expectSummaryTitleNotToExist('black')
        .expectResultsToBe('86')
    })

    it('should collapse filter group and update results when removing last filter', () => {
      plp
        .clickOnFilterGroup('Colour')
        .clickOnFilter('white')
        .wait('@category-shoes-white')

        .clickOnFilter('black')
        .wait('@category-shoes-white-black')

        .clickOnFilter('black')
        .wait('@category-shoes-white')

        .clickOnFilter('white')
        .wait('@category-shoes')

        .expectSummaryTitleNotToExist('white')
        .expectSummaryFilterGroupNotToExist('Colour')
        .expectFilterGroupNotToBeExpanded('Colour')
        .expectResultsToBe('850')
    })
  })
}

if (isMobileLayout()) {
  describe('Category filters: colour selections', () => {
    const plp = new ProductListingPage()

    beforeEach(() => {
      setUpMocksForRouteList(filterRoutes)
      cy.visit('/')
      plp
        .clickOnMenuButtonMobile()
        .clickOnCategoryLink('Shoes')
        .clickOnSubCategoryLink('Shop All Shoes')
        .wait('@category-shoes')
    })

    it('should expand "Colour" filter group when selected', () => {
      plp
        .expectCategoryTitleToBe('Shoes')
        .clickOnFilterButton()
        .expectFilterMenuVisible()
        .wait(1000)

        .expectFilterGroupNotToBeExpanded('Colour')
        .clickOnFilterGroup('Colour')
        .expectFilterGroupToBeExpanded('Colour')
    })

    it('should display "white" filter as selected', () => {
      plp
        .clickOnFilterButton()
        .wait(1000)

        .clickOnFilterGroup('Colour')
        .refinementsScrollTo('bottom')
        .clickOnFilter('white')
        .wait('@category-shoes-white')

        .refinementsScrollTo('top')
        .expectAccordionHeaderToContain('White')
    })

    it('should add "black" as selected', () => {
      plp
        .clickOnFilterButton()
        .wait(1000)

        .clickOnFilterGroup('Colour')
        .refinementsScrollTo('bottom')
        .clickOnFilter('white')
        .wait('@category-shoes-white')

        .refinementsScrollTo('top')
        .clickOnFilter('black')
        .wait('@category-shoes-white-black')

        .expectAccordionHeaderToContain('Black')
    })

    it('should remove "black" from selection', () => {
      plp
        .clickOnFilterButton()
        .wait(1000)

        .clickOnFilterGroup('Colour')
        .refinementsScrollTo('bottom')
        .clickOnFilter('white')
        .wait('@category-shoes-white')

        .refinementsScrollTo('top')
        .clickOnFilter('black')
        .wait('@category-shoes-white-black')

        .clickOnFilter('black')
        .wait('@category-shoes-white')

        .expectAccordionHeaderNotToContain('Black')
    })

    it('should remove "white" from selection', () => {
      plp
        .clickOnFilterButton()
        .wait(1000)

        .clickOnFilterGroup('Colour')
        .refinementsScrollTo('bottom')
        .clickOnFilter('white')
        .wait('@category-shoes-white')

        .refinementsScrollTo('top')
        .clickOnFilter('black')
        .wait('@category-shoes-white-black')

        .clickOnFilter('black')
        .wait('@category-shoes-white')

        .clickOnFilter('white')
        .wait('@category-shoes')

        .expectAccordionHeaderNotToContain('White')
    })
  })
}
