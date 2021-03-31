import {
  setFeatureFlag,
  setUpMocksForRouteList,
  isMobileLayout,
} from '../../lib/helpers'
import filterRoutes from '../../../mock-server/routes/plp/filters'
import ProductListingPage from '../../page-objects/Plp.page'
import NavigationPage from '../../page-objects/Navigation.page'
import PDP from '../../page-objects/Pdp.page'
import singleSizeProduct from '../../fixtures/pdp/singleSizeProduct/pdpInitialFetch.json'
import productList from '../../fixtures/plp/initialPageLoad.json'

const plp = new ProductListingPage()
const navigation = new NavigationPage()
const pdp = new PDP()

if (isMobileLayout()) {
  describe('Marketing Slider', () => {
    beforeEach(() => {
      cy.window().then((win) => {
        win.sessionStorage.clear()
      })
      setUpMocksForRouteList(filterRoutes)
      setFeatureFlag('FEATURE_MARKETING_SLIDER', true)
    })

    describe('When the feature flag is enabled', () => {
      before(() => {
        cy.setCookie(
          'featuresOverride',
          JSON.stringify({
            FEATURE_MARKETING_SLIDER: true,
          })
        )
      })

      it('EXP-226 should display marketing slider on homepage', () => {
        cy.visit('/')
        navigation.completeThreeClicks()
        plp.assertMarkettingSlider(true)
      })

      it('EXP-226 should display marketing slider on plp', () => {
        const path = plp.mocksForProductList({
          productSearchTerm: 'Jeans',
          productSearchResults: productList,
        })
        cy.visit(path)
        navigation.completeThreeClicks()
        plp.assertMarkettingSlider(true)
      })

      it('EXP-226 should display marketing slider on pdp', () => {
        const path = pdp.mocksForPdpProduct({
          productByUrl: singleSizeProduct,
        })
        cy.visit(path)
        navigation.completeThreeClicks()
        plp.assertMarkettingSlider(true)
      })

      it('EXP-226 should display marketing slider only once in a session', () => {
        cy.visit('/')
        navigation.completeThreeClicks()
        plp.closeMarkettingSlider()
        navigation.completeThreeClicks()
        plp.assertMarkettingSlider(false)
      })
    })
  })

  describe('When the feature flag is disabled', () => {
    before(() => {
      setFeatureFlag('FEATURE_MARKETING_SLIDER', false)
    })
    it('EXP-226 should not display marketing slider', () => {
      const path = pdp.mocksForPdpProduct({
        productByUrl: singleSizeProduct,
      })
      cy.visit(path)
      navigation.completeThreeClicks()
      plp.assertMarkettingSlider(false)
    })
  })
}
