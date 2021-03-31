import filterRoutes from '../../../mock-server/routes/plp/filters/index'
import PDP from '../../page-objects/Pdp.page'
import singleSizeProduct from '../../fixtures/pdp/singleSizeProduct/pdpInitialFetch.json'
import {
  setFeatureFlag,
  setUpMocksForRouteList,
  isMobileLayout,
} from '../../lib/helpers'

if (isMobileLayout()) {
  describe('Dressipi Recommendations Carousel', () => {
    const ddp = new PDP()
    let path

    beforeEach(() => {
      setUpMocksForRouteList(filterRoutes)
      path = ddp.mocksForPdpProduct({
        productByUrl: singleSizeProduct,
      })
    })

    describe('When `FEATURE_DRESSIPI_RECOMMENDATIONS` is enabled', () => {
      before(() => {
        setFeatureFlag('FEATURE_DRESSIPI_RECOMMENDATIONS', true)
      })

      it.skip('Should render the dressipi related recommendations carousel', () => {
        ddp.mocksForDressipiRecommendations()
        cy.visit(path)
        cy.wait('@dressipi-recommendtations-request').then(() => {
          ddp.assertDressipiRecommendationsCarousel(true)
        })
      })
    })

    describe('When `FEATURE_DRESSIPI_RECOMMENDATIONS` is disabled', () => {
      before(() => {
        setFeatureFlag('FEATURE_DRESSIPI_RECOMMENDATIONS', false)
      })

      it('Should not render the dressipi related recommendations carousel', () => {
        cy.visit(path)
        ddp.assertDressipiRecommendationsCarousel(false)
      })
    })
  })
}
