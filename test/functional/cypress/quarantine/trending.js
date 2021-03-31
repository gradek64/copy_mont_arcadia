import ProductListingPage from '../page-objects/Plp.page'
import filterRoutes from '../../mock-server/routes/plp/filters/index'
// import pdpData from '../fixtures/pdp/firstProductShirtsSearch.json'
import NavigationPage from '../page-objects/Navigation.page'

import {
  isDesktopLayout,
  setupMocksForRefinements,
  // setupMocksForInitialRenderOnPdp,
  isMobileLayout,
  setFeature,
} from '../lib/helpers'

if (isDesktopLayout()) {
  describe('EXP-114 Verify Trending product logo for desktop', () => {
    const plp = new ProductListingPage()

    beforeEach(() => {
      setupMocksForRefinements(filterRoutes)
      cy.visit('/')
      setFeature('FEATURE_SOCIAL_PROOF_PLP_META_LABEL')
      setFeature('FEATURE_SOCIAL_PROOF_CAROUSEL_OVERLAY')
      plp.clickOnCategoryLink('Clothing').wait('@category-clothing')
    })

    it('should display meta lable trending logo on PLP ', () => {
      plp.verifyTrendingProductOnPLP(3, true)
    })

    it('on opening quick view of the product I should see carousel overlay trending logo ', () => {
      plp.selectQuickViewForItem(3)
      plp.verifyTrendingProductOnQuickView(true)
    })

    it('Then I should see carousel overlay trending logo on PDP', () => {
      plp.clickOnTrendingProduct(3)
      plp.verifyTrendingProductOnPDP(true)
    })
  })
}

if (isMobileLayout()) {
  const plp = new ProductListingPage()

  describe('EXP-114 Verify trending product logo for mobile', () => {
    beforeEach(() => {
      const navigation = new NavigationPage()
      //    setupMocksForInitialRenderOnPdp(pdpData)
      setupMocksForRefinements(filterRoutes)
      cy.visit('/')
      setFeature('FEATURE_SOCIAL_PROOF_PLP_META_LABEL')
      setFeature('FEATURE_SOCIAL_PROOF_CAROUSEL_OVERLAY')
      navigation.searchFor('socks')
      plp.wait('@search-socks')
    })

    describe('Verify trending product logo on PLP', () => {
      it('Should navigate to PLP and see meta label trending logo ', () => {
        cy.route(
          'GET',
          '/api/products/**',
          'fixture:pdp/firstProductSocksSearch'
        ).as('pdp')
        plp.verifyTrendingProductOnPLP(0, true)
      })
    })
    describe('Verify trending product logo on PDP', () => {
      it('Should navigate to PDP and see carousel overlay trending logo ', () => {
        cy.route(
          'GET',
          '/api/products/**',
          'fixture:pdp/firstProductSocksSearch'
        ).as('pdp')
        plp.clickPlpProduct('1').wait('@pdp')
        //     plp.verifyTrendingProductOnPDPMobile(true)
      })
    })
  })
}
