import ProductListingPage from '../../page-objects/Plp.page'
import preSelectedSize14 from '../../fixtures/pdp/preSelectedSize14.json'
import preSelectedSizeXS from '../../fixtures/pdp/preSelectedSizeXS.json'
import preSelectedSizeML from '../../fixtures/pdp/preSelectedSizeML.json'

import filterRoutes from '../../../mock-server/routes/plp/filters/index'
import PDP from '../../page-objects/Pdp.page'
import {
  isDesktopLayout,
  setFeature,
  isMobileLayout,
  setUpMocksForRouteList,
} from '../../lib/helpers'

const plp = new ProductListingPage()
const pdp = new PDP()

describe('EXP-18: Size pre selection', () => {
  beforeEach(() => {
    setUpMocksForRouteList(filterRoutes)
    cy.visit('/')
    setFeature('FEATURE_PRE_SELECT_SIZE')
  })

  if (isDesktopLayout()) {
    describe('pre selection for size unit numeric', () => {
      it('Should preselect size on PDP when size filter for numeric size unit selected', () => {
        const size = '14'
        pdp.mocksForPdpProduct({ productByUrl: preSelectedSize14 })

        plp
          .clickOnCategoryLink('Clothing')
          .wait('@category-clothing')
          .clickOnFilterGroup(/^Size/)
          .clickOnFilter(size)
          .wait('@category-clothing-size14')
          .clickFirstProduct()

        pdp.verifyPreSelecteSize(size)
      })
    })

    describe('pre selection for size unit chracter', () => {
      it('Should preselect size on PDP when size filter for character size unit selected', () => {
        const size = 'XS'
        pdp.mocksForPdpProduct({ productByUrl: preSelectedSizeXS })

        plp
          .clickOnCategoryLink('Clothing')
          .wait('@category-clothing')
          .clickOnFilterGroup(/^Size/)
          .clickOnFilter(size)
          .wait('@category-clothing-sizeXS')
          .clickFirstProduct()

        pdp.verifyPreSelecteSize(size)
      })
    })

    describe('pre selection with multiple size filter', () => {
      it('Should pre select minimum size on PDP when multiple size are selected on filter', () => {
        const size1 = '14'
        const size2 = '16'
        pdp.mocksForPdpProduct({ productByUrl: preSelectedSize14 })

        plp
          .clickOnCategoryLink('Clothing')
          .wait('@category-clothing')
          .clickOnFilterGroup(/^Size/)
          .clickOnFilter(size1)
          .wait('@category-clothing-size14')
          .clickOnFilter(size2)
          .wait('@category-clothing-size14n16')
          .clickFirstProduct()

        pdp.verifyPreSelecteSize(size1)
      })
    })
  }

  if (isMobileLayout()) {
    describe('pre selection for mobile', () => {
      it('Should preselect size on PDP when size filter for size unit selected', () => {
        const size = 'M/L'
        pdp.mocksForPdpProduct({ productByUrl: preSelectedSizeML })

        plp
          .clickOnMenuButtonMobile()
          .clickOnCategoryLinkMobile('Clothing')
          .clickOnSubCategoryLinkMobile('Dresses')

          .clickOnFilterButton()
          .wait('@category-clothing-dresses-server-side')

          .clickOnFilterGroup('Size')
          .refinementsScrollTo('bottom')
          .clickOnFilter(size)
          .clickOnApplyFiltersButton()
          .wait('@category-clothing-dressesForMobile-sizeML')

          .clickFirstProduct()

        pdp.verifyPreSelecteSize(size)
      })
    })
  }
})
