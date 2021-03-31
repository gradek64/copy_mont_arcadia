import ProductListingPage from '../../page-objects/Plp.page'
import filterRoutes from '../../../mock-server/routes/plp/filters/index'
import pdpData from '../../fixtures/pdp/firstProductSocksSearch.json'
import NavigationPage from '../../page-objects/Navigation.page'

import {
  isDesktopLayout,
  setFeature,
  setUpMocksForRouteList,
  isMobileLayout,
} from '../../lib/helpers'

const trendingProduct = 'fixture:plp/tally-trending-product'
const plp = new ProductListingPage()
const navigation = new NavigationPage()

describe('Verify social proof experience', () => {
  beforeEach(() => {
    setUpMocksForRouteList(filterRoutes)
    plp.mocksForTrending(trendingProduct)
    plp.mocksForPdpProduct({ productByUrl: pdpData })

    cy.visit('/')

    setFeature('FEATURE_SOCIAL_PROOF_PLP_META_LABEL')
    setFeature('FEATURE_SOCIAL_PROOF_CAROUSEL_OVERLAY')

    navigation.searchFor('socks')
    plp.wait('@search-socks')
  })

  if (isMobileLayout()) {
    describe('EXP-114 Verifying Trending product logo', () => {
      it('should display meta label trending logo on PLP ', () => {
        plp.verifyTrendingProductOnPLP(0, true)
      })

      it('I should see carousel overlay trending logo on PDP', () => {
        plp.clickOnTrendingProduct(0)
        plp.verifyTrendingProductOnPDP()
      })

      it('should not display trending product logo when feature flag is disabled ', () => {
        setFeature('FEATURE_SOCIAL_PROOF_PLP_META_LABEL', false)
        plp.verifyTrendingProductOnPLP(0, false)
      })
    })

    describe('EXP-175 Social proof product overlay', () => {
      it('should be visible on PLP', () => {
        setFeature('FEATURE_SOCIAL_PROOF_PLP_IMAGE_OVERLAY')
        plp.verifySocialProofOverlayOnPLP(0, true)
      })

      it('should be visible and hide product attribute banner on PLP', () => {
        plp.verifyProductAttributeBanner(1, true)
        setFeature('FEATURE_SOCIAL_PROOF_PLP_IMAGE_OVERLAY')
        plp.verifySocialProofOverlayOnPLP(1, true)
        plp.verifyProductAttributeBanner(1, false)
      })

      it('should not be visible on PLP when feature flag is disabled', () => {
        plp.verifySocialProofOverlayOnPLP(0, false)
      })
    })
  }

  if (isDesktopLayout()) {
    describe('on opening quick view of the product I should see carousel overlay trending logo', () => {
      it('test', () => {
        plp.selectQuickViewForItem(0)
        plp.verifyTrendingProductOnQuickView(true)
      })
    })
  }
})
