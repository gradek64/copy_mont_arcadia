import {
  extractParametersFromProduct,
  extractBundleProductParameters,
  extractParametersFromBundle,
} from './index'

import wcsPdpResponse from '../../../../../../../test/apiResponses/pdp/wcs.json'
import wcsPdpResponseFixedBundle from '../../../../../../../test/apiResponses/pdp/bundles/fixed/wcs_fixed_bundle.json'

const parametersFromProduct = {
  attrValue: ['KHAKI', '8'],
  attrName: ['134315349', '134315353'],
}

const parametersFromBundleProduct = {
  slot_1: '1',
  catEntryId_1: 28361263,
  attrName_1: ['156889348', '156889350'],
  attrValue_1: ['PEACH', '10'],
  quantity_1: 1,
}

const parametersFromBundle = {
  slot_1: '1',
  catEntryId_1: 28361263,
  attrName_1: ['156889348', '156889350'],
  attrValue_1: ['PEACH', '10'],
  quantity_1: 1,
  slot_2: '2',
  catEntryId_2: 28359754,
  attrName_2: ['156872440', '156872441'],
  attrValue_2: ['PEACH', '4'],
  quantity_2: 1,
}

const payloadFromMontyBundle = {
  productId: 28402147,
  bundleItems: [
    { productId: 28361263, sku: '602017001099935' },
    { productId: 28359754, sku: '602017001099797' },
  ],
}

describe('shopping bag utils', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('utils used in  AddToBasketV1', () => {
    describe('extractParametersFromProduct', () => {
      it('returns the parameters needed to call addToBag from a wcs product response', () => {
        expect(
          extractParametersFromProduct(wcsPdpResponse, '602016000997332')
        ).toEqual(parametersFromProduct)
      })
      it('returns a default values if properties needed are not in the wcs product response', () => {
        expect(extractParametersFromProduct({}, '602016000997332')).toEqual({
          attrValue: ['', ''],
          attrName: ['', ''],
        })
        expect(extractParametersFromProduct()).toEqual({
          attrValue: ['', ''],
          attrName: ['', ''],
        })
      })
    })
    describe('extractBundleProductParameters', () => {
      it('returns the parameters needed to call addToBag from a wcs bundle product', () => {
        expect(
          extractBundleProductParameters(
            wcsPdpResponseFixedBundle.BundleDetails.bundleDetailsForm
              .bundleSlots[0].product[0],
            1,
            payloadFromMontyBundle.bundleItems[0].sku
          )
        ).toEqual(parametersFromBundleProduct)
      })
      it('returns a default values if properties needed are not in the wcs bundle product', () => {
        expect(extractBundleProductParameters()).toEqual({
          slot_0: '0',
          catEntryId_0: '',
          attrName_0: ['', ''],
          attrValue_0: ['', ''],
          quantity_0: 1,
        })
      })
    })
    describe('extractParametersFromBundle', () => {
      it('returns the parameters needed to call addToBag from a wcs bundle response', () => {
        expect(
          extractParametersFromBundle(
            wcsPdpResponseFixedBundle,
            payloadFromMontyBundle.bundleItems
          )
        ).toEqual(parametersFromBundle)
      })
      it('returns a default values if properties needed are not in the wcs bundle response', () => {
        expect(extractParametersFromBundle()).toEqual({})
      })
    })
  })
})
