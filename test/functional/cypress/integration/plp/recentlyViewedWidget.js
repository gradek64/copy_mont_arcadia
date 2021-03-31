import {
  isDesktopLayout,
  setFeature,
  setUpMocksForRouteList,
} from './../../lib/helpers'
import filterRoutes from '../../../mock-server/routes/plp/filters/index'
import ProductListingPage from './../../page-objects/Plp.page'

const plp = new ProductListingPage()

if (isDesktopLayout()) {
  describe('EXP-44 Recently viewed widget when feature flag is disabled', () => {
    let productsHistory = []

    beforeEach(() => {
      cy.window().then((win) => {
        win.sessionStorage.clear()
      })
      setUpMocksForRouteList(filterRoutes)
      cy.visit('/')
      setFeature('FEATURE_PLP_RECENTLY_VIEWED_WIDGET', false)
      plp
        .clickOnCategoryLink('Clothing')
        .wait('@category-clothing')
        .clickOnFilterGroup(/^Size/)
        .clickOnFilter(14)
        .wait('@category-clothing-size14')
    })

    it('should not display when 2 products are selected', () => {
      plp.selectProducts(2, productsHistory)
      plp.assertRecentlyViewedWidget(false)
    })

    afterEach(() => {
      productsHistory = []
    })
  })

  describe('EXP-44 Recently viewed widget', () => {
    let productsHistory = []

    beforeEach(() => {
      cy.window().then((win) => {
        win.sessionStorage.clear()
      })
      setUpMocksForRouteList(filterRoutes)
      cy.visit('/')
      setFeature('FEATURE_PLP_RECENTLY_VIEWED_WIDGET')
      plp
        .clickOnCategoryLink('Clothing')
        .wait('@category-clothing')
        .clickOnFilterGroup(/^Size/)
        .clickOnFilter(14)
        .wait('@category-clothing-size14')
    })

    it('should not display if no product is viewed', () => {
      plp.assertRecentlyViewedWidget(false)
    })

    it('should not display if 1 product is viewed', () => {
      plp.selectProducts(1, productsHistory)
      plp.assertRecentlyViewedWidget(false)
    })

    it('should display if 2 products are selected', () => {
      plp.selectProducts(2, productsHistory)
      plp.assertRecentlyViewedWidget(true)
      plp.verifyProductsInWidget(productsHistory)
      plp.viewProductFromWidget()
    })

    it('should display 10 products if 11 products are selected', () => {
      plp.selectProducts(11, productsHistory)
      plp.assertRecentlyViewedWidget(true)
      plp.verifyProductsInWidget(productsHistory)
    })

    afterEach(() => {
      productsHistory = []
    })
  })
}
