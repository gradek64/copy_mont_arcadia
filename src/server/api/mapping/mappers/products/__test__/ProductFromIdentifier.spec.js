import ProductFromIdentifier from '../ProductFromIdentifier'
import * as utils from '../../../__test__/utils'

import wcs from '../../../../../../../test/apiResponses/pdp/wcs.json'
import monty from '../../../../../../../test/apiResponses/pdp/hapiMonty.json'

const execute = utils.buildExecutor(ProductFromIdentifier, {
  originEndpoint: 'originEndpointMock',
  query: {},
  payload: {},
  method: 'get',
  headers: { 'brand-code': 'tsuk' },
  params: {},
})

describe('#ProductFromIdentifier', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  describe('#mapEndpoint', () => {
    it('sets as expected "destinationEndpoint" property for an identifier', () => {
      const productFromIdentifier = new ProductFromIdentifier()
      productFromIdentifier.params = { identifier: '123' }
      productFromIdentifier.mapEndpoint()
      expect(productFromIdentifier.destinationEndpoint).toBe(
        '/webapp/wcs/stores/servlet/ProductDisplay'
      )
    })
    it('sets as expected "destinationEndpoint" property for an seoUrl', () => {
      const productFromIdentifier = new ProductFromIdentifier()
      productFromIdentifier.params = {
        identifier: '/en/tsuk/product/marrakech-block-heel-sandals-6599892',
      }
      productFromIdentifier.mapEndpoint()
      expect(productFromIdentifier.destinationEndpoint).toBe(
        '/en/tsuk/product/marrakech-block-heel-sandals-6599892'
      )
    })
  })

  describe('#mapRequestParameters', () => {
    it('sets as expected "query" property', () => {
      const productFromIdentifier = new ProductFromIdentifier()

      // no "params" property
      productFromIdentifier.mapRequestParameters()
      expect(productFromIdentifier.query).toEqual({
        catalogId: '33057',
        langId: '-1',
        storeId: 12556,
        productId: undefined,
      })

      // "params" property is not an object
      productFromIdentifier.params = 'params'
      productFromIdentifier.mapRequestParameters()
      expect(productFromIdentifier.query).toEqual({
        catalogId: '33057',
        langId: '-1',
        storeId: 12556,
        productId: undefined,
      })

      // "params" property is an object that does not contain "identifier" property
      productFromIdentifier.params = {}
      productFromIdentifier.mapRequestParameters()
      expect(productFromIdentifier.query).toEqual({
        catalogId: '33057',
        langId: '-1',
        storeId: 12556,
        productId: undefined,
      })

      // "params" property object contains "identifier" property
      productFromIdentifier.params = { identifier: '123' }
      productFromIdentifier.mapRequestParameters()
      expect(productFromIdentifier.query).toEqual({
        catalogId: '33057',
        langId: '-1',
        storeId: 12556,
        productId: '123',
      })

      // "params" property object contains "partNumber" property, for a product
      productFromIdentifier.params = { identifier: 'TS02G02PNAV' }
      productFromIdentifier.mapRequestParameters()
      expect(productFromIdentifier.query).toEqual({
        catalogId: '33057',
        langId: '-1',
        storeId: 12556,
        partNumber: 'TS02G02PNAV',
      })

      // "params" property object contains "partNumber" property, for a sku
      productFromIdentifier.params = { identifier: '602018001263585' }
      productFromIdentifier.mapRequestParameters()
      expect(productFromIdentifier.query).toEqual({
        catalogId: '33057',
        langId: '-1',
        storeId: 12556,
        partNumber: '602018001263585',
      })

      // "params" property object contains "partNumber" property, for a bundle
      productFromIdentifier.params = { identifier: 'BUNDLE_17X01NMUS36X02NMUS' }
      productFromIdentifier.mapRequestParameters()
      expect(productFromIdentifier.query).toEqual({
        catalogId: '33057',
        langId: '-1',
        storeId: 12556,
        partNumber: 'BUNDLE_17X01NMUS36X02NMUS',
      })

      // query is undefined if the "identifier" property is not a number
      productFromIdentifier.params = { identifier: 'qwerty' }
      productFromIdentifier.query = undefined
      productFromIdentifier.mapRequestParameters()
      expect(productFromIdentifier.query).toBeUndefined()
    })
  })

  describe('#mapResponseBody', () => {
    it('returns expected object for empty argument', () => {
      const productFromIdentifier = new ProductFromIdentifier()
      expect(productFromIdentifier.mapResponseBody()).toEqual({
        additionalAssets: [],
        ageVerificationRequired: undefined,
        assets: [],
        attributes: undefined,
        bundleProducts: [],
        bundleSlots: [],
        colour: undefined,
        colourSwatches: [],
        contentSlotContentHTML: undefined,
        description: '',
        grouping: undefined,
        isBundleOrOutfit: false,
        items: [],
        lineNumber: undefined,
        name: undefined,
        notifyMe: false,
        productDataQuantity: {},
        productId: undefined,
        sourceUrl: '',
        stockEmail: false,
        stockThreshold: undefined,
        storeDelivery: undefined,
        tpmLinks: [],
        unitPrice: '',
        version: '1.7',
        wcsColourADValueId: undefined,
        wcsColourKey: undefined,
        wcsSizeKey: undefined,
        espots: {
          CEProductEspotCol1Pos1: 'mobilePDPESpotPos2',
        },
        deliveryMessage: undefined,
        shopTheLookProducts: false,
        bundleDisplayURL: '',
        breadcrumbs: [
          {
            label: 'Home',
            url: '/',
          },
        ],
        canonicalUrl: '',
        canonicalUrlSet: false,
      })
    })

    it('maps the response correctly', () => {
      const productFromIdentifier = new ProductFromIdentifier()
      expect(productFromIdentifier.mapResponseBody(wcs)).toEqual(monty)
    })

    describe('When WCS returns "_ERR_PRODUCT_NOT_PUBLISHED" as error code', () => {
      it('throws an error message', () => {
        utils.setWCSResponse({
          body: {
            success: false,
            errorMessage:
              'Unfortunately this product is no longer available for purchase.',
            errorCode: '_ERR_PRODUCT_NOT_PUBLISHED',
          },
        })

        return utils.expectFailedWith(execute(), {
          message:
            'Unfortunately this product is no longer available for purchase.',
          statusCode: 404,
        })
      })
    })

    describe('permanentRedirectUrl is present in the WCS response', () => {
      it('returns the permanentRedirectUrl', () => {
        const productFromIdentifier = new ProductFromIdentifier()
        const wcs = {
          permanentRedirectUrl: 'permanentRedirectUrlMock',
        }

        expect(productFromIdentifier.mapResponseBody(wcs)).toEqual(wcs)
      })
    })
  })

  describe('mapResponseError', () => {
    describe('when the WCS response contains an error message', () => {
      it('should throw an error message', () => {
        const productFromIdentifier = new ProductFromIdentifier()
        expect(() =>
          productFromIdentifier.mapResponseError({
            success: false,
            message: 'There was an error',
          })
        ).toThrow('There was an error')
      })

      it('should throw for session timeout', () => {
        const productFromIdentifier = new ProductFromIdentifier()
        expect(() =>
          productFromIdentifier.mapResponseError({
            message: 'wcsSessionTimeout',
          })
        ).toThrow({
          message: 'wcsSessionTimeout',
        })
      })
    })

    describe('when the WCS response does not contain an error message', () => {
      it('should throw the body', () => {
        const productFromIdentifier = new ProductFromIdentifier()
        expect(() => productFromIdentifier.mapResponseError('Error')).toThrow(
          'Error'
        )
      })
    })
  })
})
