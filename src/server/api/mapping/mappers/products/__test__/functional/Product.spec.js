import ProductFromIdentifier from '../../ProductFromIdentifier'

import wcsProduct from 'test/apiResponses/pdp/wcs.json'
import hapiProduct from 'test/apiResponses/pdp/hapiMonty.json'

import wcsProductWithShopTheLook from 'test/apiResponses/pdp/wcs-shop-the-look.json'
import hapiProductWithShopTheLook from 'test/apiResponses/pdp/hapi-shop-the-look.json'

import wcsProductWithPromo from 'test/apiResponses/pdp/wcs-promo.json'
import hapiProductWithPromo from 'test/apiResponses/pdp/hapi-promo.json'

import wcsSwatchesPdpResponse from 'test/apiResponses/pdp/swatches/wcs_swatches.json'
import hapiSwatchesPdpResponse from 'test/apiResponses/pdp/swatches/hapiMonty_swatches.json'

import wcsPpliveFixeBundle from 'test/apiResponses/pdp/bundles/fixed/pplive-wcs_fixed_bundle.json'
import hapiMontResponsePpliveFixedBundle from 'test/apiResponses/pdp/bundles/fixed/pplive-hapiMonty_fixed_bundle.json'

import wcsPdpResponseFlexibleBundleExample from 'test/apiResponses/pdp/bundles/flexible/wcs_flexible_bundle.json'
import hapiMontyResponseFlexibleBundleExample from 'test/apiResponses/pdp/bundles/flexible/hapiMonty_flexible_bundle.json'

import wcsPdpResponseFixedBundleExample from 'test/apiResponses/pdp/bundles/fixed/wcs_fixed_bundle.json'
import hapiMontyResponseFixedBundleExample from 'test/apiResponses/pdp/bundles/fixed/hapiMonty_fixed_bundle.json'

import wcsPdpResponseWithEspot from 'test/apiResponses/pdp/wcs-espots.json'
import hapiMontyPdpResponseWithEspot from 'test/apiResponses/pdp/hapi-espots.json'

import wcsBundleResponseWithEspot from 'test/apiResponses/pdp/bundles/fixed/wcs_fixed_bundle_espot.json'
import hapiMontyBundleResponseWithEspot from 'test/apiResponses/pdp/bundles/fixed/hapiMonty_fixed_bundle_espot.json'

describe('Functional: Products', () => {
  describe('mapResponseBody', () => {
    describe('response for a non-bundle product', () => {
      it('should be mapped correctly', () => {
        const product = new ProductFromIdentifier()
        expect(product.mapResponseBody(wcsProduct)).toEqual(hapiProduct)
      })
    })

    describe('response for a product with shopTheLook products', () => {
      it('should be mapped correctly', () => {
        const product = new ProductFromIdentifier()
        expect(product.mapResponseBody(wcsProductWithShopTheLook)).toEqual(
          hapiProductWithShopTheLook
        )
      })
    })

    describe('response for a product with a promotion', () => {
      it('should be mapped correctly', () => {
        const product = new ProductFromIdentifier()
        expect(product.mapResponseBody(wcsProductWithPromo)).toEqual(
          hapiProductWithPromo
        )
      })
    })

    describe('response for a product with swatches', () => {
      it('should be mapped correctly', () => {
        const productFromIdentifier = new ProductFromIdentifier()
        expect(
          productFromIdentifier.mapResponseBody(wcsSwatchesPdpResponse)
        ).toEqual(hapiSwatchesPdpResponse)
      })
    })

    describe('response for a flexible bundle product', () => {
      it('should be mapped correctly', () => {
        const productFromIdentifier = new ProductFromIdentifier()
        expect(
          productFromIdentifier.mapResponseBody(
            wcsPdpResponseFlexibleBundleExample
          )
        ).toEqual(hapiMontyResponseFlexibleBundleExample)
      })
    })

    describe('response for a fixed bundle product', () => {
      it('should be mapped correctly', () => {
        const productFromIdentifier = new ProductFromIdentifier()
        expect(
          productFromIdentifier.mapResponseBody(
            wcsPdpResponseFixedBundleExample
          )
        ).toEqual(hapiMontyResponseFixedBundleExample)
      })
    })

    describe('response for a fixed bundle (pplive environment)', () => {
      it('should be mapped correctly', () => {
        const productFromIdentifier = new ProductFromIdentifier()
        expect(
          productFromIdentifier.mapResponseBody(wcsPpliveFixeBundle)
        ).toEqual(hapiMontResponsePpliveFixedBundle)
      })
    })

    describe('response for a product with espot data', () => {
      it('should be mapped correctly', () => {
        const productFromIdentifier = new ProductFromIdentifier()
        expect(
          productFromIdentifier.mapResponseBody(wcsPdpResponseWithEspot)
        ).toEqual(hapiMontyPdpResponseWithEspot)
      })
    })

    describe('response for a bundle product with espot data', () => {
      it('should be mapped correctly', () => {
        const productFromIdentifier = new ProductFromIdentifier()
        expect(
          productFromIdentifier.mapResponseBody(wcsBundleResponseWithEspot)
        ).toEqual(hapiMontyBundleResponseWithEspot)
      })
    })
  })
})
