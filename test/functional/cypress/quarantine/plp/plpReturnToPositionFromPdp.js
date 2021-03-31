import ProductListingPage from '../../page-objects/Plp.page'
import NavigationPage from '../../page-objects/Navigation.page'
import filterRoutes from '../../../mock-server/routes/plp/filters'

// TODO qaurantied because the scroll to range became too flaky
// implement an asseertion where the previously scrolld to product is asserted.

import { isMobileLayout, setUpMocksForRouteList } from '../../lib/helpers'

const plp = new ProductListingPage()
const nav = new NavigationPage()

describe('Product List page ', () => {
  beforeEach(() => {
    cy.route(
      'GET',
      '/api/products/**',
      'fixture:pdp/firstProductShirtsSearch'
    ).as('pdp')
    setUpMocksForRouteList(filterRoutes)
  })

  describe('Returns user to correct page position on PLP after selecting browser back button from PDP page', () => {
    it('Should return user to correct position on search PLP', () => {
      let pagePosition
      cy.visit('/')
      nav.searchFor('shirts').wait('@search-shirts')

      cy.get(plp.productList9thProduct)
        .scrollIntoView()
        .window()
        .then(($window) => {
          pagePosition = $window.scrollY
        })

      plp.clickPlpProduct(9).wait('@pdp')
      cy.go('back')
        .window()
        .then(($window) => {
          expect($window.scrollY).to.be.closeTo(pagePosition, 10)
        })
    })

    it('Should return user to correct position on cat header PLP', () => {
      let pagePosition
      cy.visit('/')
      if (isMobileLayout()) {
        plp
          .clickOnMenuButtonMobile()
          .clickOnCategoryLinkMobile('Clothing')
          .clickOnSubCategoryLinkMobile('Dresses')
      } else {
        cy.visit('/')
        plp.clickOnCategoryLink('Clothing').wait('@category-clothing')
      }
      cy.get(plp.productList9thProduct)
        .scrollIntoView()
        .window()
        .then(($window) => {
          pagePosition = $window.scrollY
        })

      plp.clickPlpProduct(9).wait('@pdp')
      cy.go('back')
        .window()
        .then(($window) => {
          expect($window.scrollY).to.be.closeTo(pagePosition, 10)
        })
    })
  })
})
