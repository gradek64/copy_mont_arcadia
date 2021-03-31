import * as utils from '../../../__test__/utils'
import ForeignProductFromPartNumber from '../ForeignProductFromPartNumber'

const breadcrumbs = [
  {
    label: 'Home',
    url: '/',
  },
]

const execute = utils.buildExecutor(ForeignProductFromPartNumber, {
  endpoint: '/api/US/products/TS26K31NGRY',
  query: {},
  payload: {},
  method: 'get',
  headers: {
    'brand-code': 'tsuk',
  },
  params: {
    targetCountry: 'US',
    partNumber: 'TS26K31NGRY',
  },
})

describe('ForeignProductFromPartNumber', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    utils.setUserSession()
  })

  afterEach(() => {
    delete process.env.WCS_ENVIRONMENT
  })

  it('maps a request', async () => {
    process.env.WCS_ENVIRONMENT = 'prod'
    utils.setWCSResponse({ body: {} })

    await execute()

    utils.expectRequestMadeWith({
      hostname: 'us.topshop.com',
      endpoint: '/webapp/wcs/stores/servlet/ProductDisplay',
      query: {
        storeId: 13052,
        langId: '-1',
        catalogId: '33060',
        partNumber: 'TS26K31NGRY',
      },
      payload: {},
      method: 'get',
      headers: {
        'brand-code': 'tsus',
      },
    })
  })

  it('maps a flexible bundle', async () => {
    utils.setWCSResponse({
      body: {
        isBundle: true,
        BundleDetails: {
          isFlexible: true,
          nowPrice: 1.0,
        },
      },
    })

    const resp = await execute()

    expect(resp.body).toEqual({
      ageVerificationRequired: false,
      assets: [],
      attributes: {},
      bundleProducts: [],
      bundleSlots: [],
      bundleType: 'Flexible',
      colourSwatches: [],
      contentSlotContentHTML: undefined,
      deliveryMessage: undefined,
      description: '',
      grouping: undefined,
      isBundleOrOutfit: true,
      items: [],
      lineNumber: undefined,
      name: undefined,
      productId: NaN,
      seeMoreText: undefined,
      seeMoreValue: undefined,
      sourceUrl: undefined,
      stockEmail: false,
      stockThreshold: 10,
      storeDelivery: false,
      tpmLinks: [],
      unitPrice: '1.00',
      bnplPaymentOptions: {
        clearpay: {
          amount: '0.25',
          instalments: 4,
        },
        klarna: {
          amount: '0.33',
          instalments: 3,
        },
      },
      version: '',
      breadcrumbs,
      canonicalUrl: '',
      canonicalUrlSet: false,
    })
  })

  it('maps a fixed bundle', async () => {
    utils.setWCSResponse({
      body: {
        isBundle: true,
        BundleDetails: {
          isFlexible: false,
          nowPrice: 1.0,
        },
      },
    })

    const resp = await execute()

    expect(resp.body).toEqual({
      ageVerificationRequired: false,
      assets: [],
      attributes: {},
      bundleProducts: false,
      bundleSlots: [],
      bundleType: 'Fixed',
      colourSwatches: [],
      contentSlotContentHTML: undefined,
      deliveryMessage: undefined,
      description: '',
      grouping: undefined,
      isBundleOrOutfit: true,
      items: [],
      lineNumber: undefined,
      name: undefined,
      productId: undefined,
      seeMoreText: undefined,
      seeMoreValue: undefined,
      sourceUrl: undefined,
      stockEmail: false,
      stockThreshold: 10,
      storeDelivery: false,
      tpmLinks: [],
      unitPrice: '1.00',
      bnplPaymentOptions: {
        clearpay: {
          amount: '0.25',
          instalments: 4,
        },
        klarna: {
          amount: '0.33',
          instalments: 3,
        },
      },
      version: '',
      breadcrumbs,
      canonicalUrl: '',
      canonicalUrlSet: false,
    })
  })

  it('maps a non-bundle product', async () => {
    utils.setWCSResponse({
      body: {
        isBundle: false,
      },
    })

    const resp = await execute()

    expect(resp.body).toEqual({
      espots: {
        CEProductEspotCol1Pos1: 'mobilePDPESpotPos2',
      },
      colour: undefined,
      additionalAssets: [],
      ageVerificationRequired: undefined,
      assets: [],
      bundleProducts: [],
      bundleSlots: [],
      colourSwatches: [],
      productDataQuantity: {},
      contentSlotContentHTML: undefined,
      deliveryMessage: undefined,
      description: '',
      attributes: undefined,
      grouping: undefined,
      isBundleOrOutfit: false,
      items: [],
      lineNumber: undefined,
      name: undefined,
      notifyMe: false,
      productId: undefined,
      seeMoreText: undefined,
      seeMoreValue: undefined,
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
      shopTheLookProducts: false,
      bundleDisplayURL: '',
      breadcrumbs,
      canonicalUrl: '',
      canonicalUrlSet: false,
    })
  })

  it('handles missing product', () => {
    utils.setWCSResponse(Promise.reject({ body: { success: false } }))

    return utils.expectFailedWith(execute(), { statusCode: 404 })
  })

  it('handles successful request with failed response', () => {
    const errorMessage = 'Product not found'
    utils.setWCSResponse(
      Promise.resolve({
        body: {
          success: false,
          errorMessage,
        },
      })
    )

    return utils.expectFailedWith(execute(), {
      statusCode: 404,
      message: errorMessage,
    })
  })
})
