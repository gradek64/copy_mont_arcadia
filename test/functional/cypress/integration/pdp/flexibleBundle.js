import flexibleBundle from './../../fixtures/pdp/flexibleBundle.json'
import flexibleBundleAddToBag from './../../fixtures/pdp/flexibleBundleAddToBag.json'
import BundlePdp from '../../page-objects/BundlePdp.page'
import MiniBag from './../../page-objects/MiniBag.page'
import fetchItemSizes from '../../fixtures/pdp/fixedBundleFetchItemAndSizes.json'
import { isMobileLayout } from '../../lib/helpers'

const bundlePdp = new BundlePdp()
const miniBag = new MiniBag()

if (isMobileLayout()) {
  describe('PDP flexible bundle', () => {
    beforeEach(() => {
      cy.clearCookies()
      miniBag.mocksForShoppingBag({
        addToBag: flexibleBundleAddToBag,
        fetchItem: fetchItemSizes,
      })
      const path = bundlePdp.mocksForPdpProduct({
        productByUrl: flexibleBundle,
      })
      cy.visit(path)
    })

    describe('Add to bag validations', () => {
      it('should have 2 add to bag buttons', () => {
        bundlePdp.assertNumberOfProducts(2).assertNumberOfAddToBagButtons(2)
      })

      it('should contain the product in the mini bag', () => {
        bundlePdp
          .selectAvailableSizeForBundleItem(1, 'Size 12')
          .addToBag({ onlyFirstItem: true })
          .wait('@add-to-bag')
          .viewBagFromConfirmationModal()

        miniBag.expectNumberOfProductsToBe(1)
      })
    })
  })
}
