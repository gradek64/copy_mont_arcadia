import MiniBag from './../../page-objects/MiniBag.page'
import BundlePdp from './../../page-objects/BundlePdp.page'
import fixedBundlePDP from './../../fixtures/pdp/fixedBundle.json'
import fixedBundleAddToBag from './../../fixtures/pdp/fixedBundleAddToBag.json'
import fixedBundleUpdateBag from './../../fixtures/pdp/fixedBundleUpdateSizeOfProductOne.json'
import fetchItemSizes from './../../fixtures/pdp/fixedBundleFetchItemAndSizes.json'
import getLastGtmEventOfType from '../../lib/getLastGtmEventOfType'
import GeneralUI from '../../page-objects/GeneralUI.page'
import { isMobileLayout } from '../../lib/helpers'

const bundlePdp = new BundlePdp()
const miniBag = new MiniBag()
const generalUi = new GeneralUI()

if (isMobileLayout()) {
  describe('PDP fixed bundle', () => {
    beforeEach(() => {
      cy.clearCookies()
      miniBag.mocksForShoppingBag({
        addToBag: fixedBundleAddToBag,
        updateItem: fixedBundleUpdateBag,
        fetchItem: fetchItemSizes,
      })
      const path = bundlePdp.mocksForPdpProduct({
        productByUrl: fixedBundlePDP,
      })
      cy.visit(path)
    })

    describe('Add to bag validations', () => {
      it('Should have only one add to bag button', () => {
        bundlePdp.assertNumberOfProducts(2).assertNumberOfAddToBagButtons(1)
      })

      it('Add to bag should only be available when both products are selected', () => {
        bundlePdp.addToBag().expectErrorToAlsoSelectProduct(2)
      })

      it('Should contain both products in the mini-bag', () => {
        bundlePdp
          .selectAvailableSizeForBundleItem(1, 'Size 12')
          .selectAvailableSizeForBundleItem(2, 'Size 12')
          .addToBag()
          .wait('@add-to-bag')
          .viewBagFromConfirmationModal()

        miniBag
          .expectNumberOfProductsToBe(2)
          .assertItemWasNowPrices(
            '**MATERNITY Plait Tankini',
            '£20.00',
            '£10.00'
          )
          .assertItemWasNowPrices(
            '**MATERNITY Swim Bikini Bottoms',
            '£12.00',
            '£5.00'
          )
      })
    })

    describe('Product prices and sizes', () => {
      it('Should display correct product pricing', () => {
        bundlePdp
          .assertBundleTotalPrice('£15.00')
          .assertBundleItemWasNowPrices(
            '**MATERNITY Plait Tankini',
            '£20.00',
            '£10.00'
          )
          .assertBundleItemWasNowPrices(
            '**MATERNITY Swim Bikini Bottoms',
            '£12.00',
            '£5.00'
          )
      })

      it('Should be able to edit product size in mini-bag', () => {
        bundlePdp
          .selectAvailableSizeForBundleItem(1, 'Size 12')
          .selectAvailableSizeForBundleItem(2, 'Size 12')
          .addToBag()
          .wait('@add-to-bag')
          .viewBagFromConfirmationModal()

        generalUi.closeTrustArcCookieBanner()

        miniBag
          .editAndChangeSizeForProductNumberTo(1, '10')
          .saveChanges()
          .wait('@update-bag')
          .expectSizeOfProductNumberToNotEqual(1, 2)
          .expectProductAToHaveDifferentSizeThanProductB(1, 2)
      })
    })

    describe('GTM event validation', () => {
      it('Selecting size should generate GA event', () => {
        bundlePdp.selectAvailableSizeForBundleItem(1, 'Size 12')
        getLastGtmEventOfType('ea').then((event) => {
          expect(event.event).to.equal('clickevent')
          expect(event.ea).to.equal('clicked')
          expect(event.ec).to.equal('bundle')
          expect(event.el).to.equal('selected size Size 12')
        })
      })
    })
  })
}
