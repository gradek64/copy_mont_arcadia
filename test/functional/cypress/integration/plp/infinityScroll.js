import ProductListingPage from '../../page-objects/Plp.page'
import NavigationPage from '../../page-objects/Navigation.page'
import plpRoutes from '../../../mock-server/routes/plp/filters/index'

import { isDesktopLayout, setUpMocksForRouteList } from '../../lib/helpers'

if (isDesktopLayout()) {
  describe('PLP - Infinity scroll', () => {
    const plp = new ProductListingPage()
    const nav = new NavigationPage()

    beforeEach(() => {
      setUpMocksForRouteList(plpRoutes)
      cy.visit('/')
    })

    describe('Scrolling in category navigation', () => {
      it('should display 24 products on category navigation', () => {
        plp
          .clickOnCategoryLink('Shoes')
          .wait('@category-shoes')
          .expectProductListLengthToBe(24)
      })

      it('should display 48 products when scrolling to page 2', () => {
        plp
          .clickOnCategoryLink('Shoes')
          .wait('@category-shoes')
          .scrollToPage(2)
          .wait('@category-shoes-page2')
          .expectProductListLengthToBe(48)
      })

      it('should display 72 products when scrolling to page 3', () => {
        plp
          .clickOnCategoryLink('Shoes')
          .wait('@category-shoes')
          .scrollToPage(2)
          .wait('@category-shoes-page2')
          .scrollToPage(3)
          .wait('@category-shoes-page3')
          .expectProductListLengthToBe(72)
      })
    })

    describe('Scrolling in search results', () => {
      it('should display 24 products on search results', () => {
        nav.searchFor('shirts')
        plp.wait('@search-shirts').expectProductListLengthToBe(24)
      })

      it('should display 48 products when scrolling to page 2', () => {
        nav.searchFor('shirts')
        plp.wait('@search-shirts').expectProductListLengthToBe(24)
        plp
          .scrollToPage(2)
          .wait('@search-shirts-page2')
          .expectProductListLengthToBe(48)
      })
    })
  })
}
