import ProductListingPage from '../../page-objects/Plp.page'
import NavigationPage from '../../page-objects/Navigation.page'
import filterRoutes from '../../../mock-server/routes/plp/filters/index'

import {
  isDesktopLayout,
  setUpMocksForRouteList,
  isMobileLayout,
} from '../../lib/helpers'

const plp = new ProductListingPage()

describe('Product List page ', () => {
  beforeEach(() => {
    cy.route(
      'GET',
      '/api/products/**',
      'fixture:pdp/firstProductShirtsSearch'
    ).as('pdp')
    setUpMocksForRouteList(filterRoutes)
  })
  if (isMobileLayout()) {
    describe('PLP and PDP Navigation', () => {
      const navigation = new NavigationPage()
      // ADP-691
      it('should navigate back to PLP after page refresh in PDP ', () => {
        cy.visit('/')
        navigation.searchFor('shirts').wait('@search-shirts')

        plp
          .clickPlpProduct('1')
          .wait('@pdp')
          .expectPdpReloadAndReturnSuccess()
      })
    })
  }
  if (isDesktopLayout()) {
    describe('When navigating on product list page', () => {
      it('Should always reset the list page when visiting another product list page', () => {
        const ItemProductLinkText = 'Orchid Floral Woven Set'

        cy.visit('/')
        plp
          .clickOnCategoryLink('Clothing')
          .wait('@category-clothing')
          .expectFilterSummaryValueToBe('Clothing')
          .expectProductListLinkItemTextToBe(1, ItemProductLinkText)

        cy.get('.HeaderBig .BrandLogo').click({
          force: true,
        })

        plp
          .clickOnCategoryLink('Shoes')
          .wait('@category-shoes')
          .expectFilterSummaryValueToBe('Shoes')

        plp.expectProductListLinkItemTextToBe(
          1,
          ItemProductLinkText,
          'not.contain'
        )
      })
    })
  }
})
