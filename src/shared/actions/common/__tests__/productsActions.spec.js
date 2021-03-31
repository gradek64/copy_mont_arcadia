import { range } from 'ramda'
import {
  getMockStoreWithInitialReduxState,
  mockStoreCreator,
  getReduxContext,
} from 'test/unit/helpers/get-redux-mock-store'
import { analyticsPdpClickEvent } from '../../../analytics/tracking/site-interactions'
import { getItem } from '../../../../client/lib/cookie/utils'
import * as actions from '../productsActions'
import { browserHistory } from 'react-router'
import { getPageStatusCode } from '../../../selectors/routingSelectors'
import configureStore from '../../../lib/configure-store'
import { getContent } from '../sandBoxActions'
import * as featureSelectors from '../../../selectors/featureSelectors'
import * as espotActions from '../espotActions'
import { isModalOpen, modalMode } from '../../../selectors/modalSelectors'
import * as navigationSelectors from '../../../selectors/navigationSelectors'
import { get } from '../../../lib/api-service'
import {
  processRedirectUrl,
  removeParamClearAll,
  reviseNrppParam,
  getCategoryFromBreadcrumbs,
  isValidEcmcCategory,
} from '../../../lib/products-utils'
import { getRouteFromUrl } from '../../../lib/get-product-route'
import * as refinementsSelectors from '../../../selectors/refinementsSelectors'

jest.mock('../sandBoxActions', () => ({
  getContent: jest.fn(() => () => {}),
}))
jest.mock('../../../../client/lib/cookie/utils')

jest.mock('../../../analytics/tracking/site-interactions', () => ({
  analyticsPdpClickEvent: jest.fn(),
}))

jest.mock('../../../lib/api-service', () => ({
  get: jest.fn(),
  put: jest.fn(),
  post: jest.fn(),
  del: jest.fn(),
}))

jest.mock('../../../../server/lib/logger')

jest.mock('../../../lib/products-utils', () => ({
  processRedirectUrl: jest.fn(),

  parseCurrentPage: jest.fn((productsLength) =>
    productsLength ? Math.ceil(productsLength / 24) + 1 : 1
  ),

  addSearchParam: jest.fn(
    (pathname, search, nextPage) => `${search}&No=${nextPage * 24}`
  ),
  isSeoUrlSearchFilter: jest.fn(
    (seoUrl) => seoUrl && seoUrl.includes('seo=false')
  ),
  isSeoUrlCategoryFilter: jest.fn(
    (seoUrl) =>
      seoUrl && seoUrl.includes('/category/') && seoUrl.includes('siteId=')
  ),
  prepareSeoUrl: jest.fn((seoUrl) => seoUrl.replace('/filter', '')),
  cleanSeoUrl: jest.fn((seoUrl) =>
    seoUrl.replace('/filter', '').replace(/&No=(\d){2,}/, '')
  ),
  isSeoUrlFilterOnScroll: jest.fn(() => false),
  seoUrlIncludesProductsIndex: jest.fn(
    (seoUrl) => seoUrl.search(/&No=(\d){2,}/, '') > 0
  ),
  isSearchUrl: jest.fn((seoUrl) => seoUrl && seoUrl.includes('/search/')),
  hasQueryParameter: jest.fn((seoUrl) => /[?&]q=/.test(seoUrl)),
  parseSearchUrl: jest.fn((seoUrl) => {
    const isSearchUrl = (seoUrl) => seoUrl && seoUrl.includes('/search/')
    const hasQueryParameter = (seoUrl) => /[?&]q=/.test(seoUrl)

    if (!isSearchUrl(seoUrl) || !hasQueryParameter(seoUrl)) {
      return {}
    }

    return seoUrl
      .split('?')[1]
      .split('&')
      .reduce((acc, val) => {
        const key = val.split('=')
        acc[key[0]] = key[1]
        return acc
      }, {})
  }),
  isFiltered: jest.fn(
    (seoUrl) =>
      seoUrl.includes('seo=false') ||
      (seoUrl.includes('/category/') && seoUrl.includes('siteId='))
  ),
  hasSortOption: jest.fn((seoUrl) => seoUrl && seoUrl.search(/&Ns=(.{2,}?&)/)),
  isPriceFilter: jest.fn((pathname) => {
    const re = new RegExp(
      /&?Nf=nowPrice%7CBTWN%2B[0-9]{0,10}\.?\d*%2B[0-9]{0,10}\.?\d*/
    )
    return !!pathname.match(re)
  }),
  reviseNrppParam: jest.fn(),
  removeParamClearAll: jest.fn(),
  getCategoryFromBreadcrumbs: jest.fn(),
  replaceSpacesWithPlus: jest.fn((pathname) => pathname.replace(/ /g, '+')),
  isValidEcmcCategory: jest.fn(() => true),
}))

jest.mock('../../../lib/localisation', () => ({
  localise: jest.fn(() => {
    return 'error'
  }),
}))

jest.mock('../../../lib/get-product-route', () => ({
  getRouteFromUrl: jest.fn(),
}))

const snapshot = (action) => expect(action).toMatchSnapshot()

jest.mock('react-router')

jest.mock('../../../selectors/featureSelectors')
jest.mock('../../../selectors/navigationSelectors')
jest.mock('../../../selectors/modalSelectors')

jest.mock('../espotActions', () => ({
  analyticsPdpClickEvent: jest.fn(),
  setPDPEspots: jest.fn(),
  setProductListEspots: () => () => Promise.resolve(),
}))

const mockGetProductsResponse = (body) => {
  let resp
  if (!(body instanceof Promise)) {
    resp = Promise.resolve({ body })
  } else {
    resp = body
  }

  get.mockImplementation(() => () => resp)
}

describe('productsActions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getProducts', () => {
    const initialState = {}
    const store = getMockStoreWithInitialReduxState(initialState)

    beforeEach(() => {
      store.clearActions()
      get.mockImplementation((url) => () => {
        switch (url) {
          case '/products?q=redirect':
            return Promise.resolve({
              // that's been called with dispatch as well
              type: 'MOCK_products',
              body: {
                products: [],
                invetoryPositions: {},
                redirectUrl: 'https://www.tsn.ca',
                total: '5',
                subTotal: '5',
              },
            })
          case '/products?q=ivyPark':
            return Promise.resolve({
              type: 'Mock Products',
              body: {
                product: [],
                invetoryPositions: {},
                permanentRedirectUrl: 'https://www.topshop.com/ivyPark',
                total: '5',
                subTotal: '5',
              },
            })
          case '/products/seo?seoUrl=/en/tsuk/category/undefined&pageSize=24':
            return Promise.reject({})
          default:
            return Promise.resolve({})
        }
      })
    })

    it('makes call to actions', (done) => {
      const location = {
        search: '?q=redirect',
        pathname: '/plp',
        query: {
          q: 'redirect',
        },
      }
      const secondDispatch = store
        .dispatch(actions.getProducts(location))
        .then(() => {
          secondDispatch.then(() => {
            expect(processRedirectUrl).toHaveBeenCalledWith(
              'https://www.tsn.ca'
            )
            done()
          })
          const expectedAction = [
            {
              page: 1,
              type: 'SET_INFINITY_PAGE',
              shouldResetHiddenPageState: true,
            },
            {
              location: {
                pathname: '/plp',
                query: { q: 'redirect' },
                search: '?q=redirect',
              },
              type: 'SET_PRODUCTS_LOCATION',
            },
            { type: 'REMOVE_PRODUCTS' },
            { loading: 'redirect', type: 'LOADING_PRODUCTS' },
          ]
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedAction)
          )
          done()
        })
    })

    it('should return null if the url is NOT changed AND we are client side (back button from pdp)', () => {
      const fakeinitialState = {
        products: {
          location: {
            pathname: '/n-some',
            query: {
              seoUrl: 'ciaoMamma',
            },
          },
        },
        routing: {
          visited: ['/pippo', 'pluto'],
        },
      }
      const fakestore = getMockStoreWithInitialReduxState(fakeinitialState)
      const location = {
        pathname: '/n-some',
        query: {
          seoUrl: 'ciaoMamma',
        },
      }
      fakestore.dispatch(actions.getProducts(location))
      expect(fakestore.getActions().length).toBe(0) // Return null, no actions dispatched
    })

    describe('when permanentRedirectUrl is on body response (WCS redirect update)', () => {
      it('should clear the cached products location and call redirect', (done) => {
        const location = {
          search: '?q=ivyPark',
          pathname: '/plp',
          query: {
            q: 'ivyPark',
          },
        }
        const secondDispatch = store
          .dispatch(actions.getProducts(location))
          .then(() => {
            secondDispatch.then(() => {
              expect(store.getActions()).toEqual(
                expect.arrayContaining([actions.removeProductsLocation()])
              )
              expect(processRedirectUrl).toHaveBeenCalledWith(
                'https://www.topshop.com/ivyPark'
              )
              done()
            })
          })
      })
    })

    it('404 response shows error content', async () => {
      const store = configureStore()

      await store.dispatch(
        actions.getProducts({
          pathname: '/en/tsuk/category/undefined',
          query: {},
        })
      )

      expect(getPageStatusCode(store.getState())).toBe(404)
      expect(store.getState().products.isLoadingAll).toBe(false)
      expect(getContent).toHaveBeenCalledWith({}, 'error404')
    })

    describe('pathname is not a valid ecmc category', () => {
      it('should return 410 and show not found content', async () => {
        const store = configureStore()
        const pathname =
          '/en/tsuk/category/N-2bbaZ2bbnZdgl?Nrpp=24&siteId=%2F1255'
        isValidEcmcCategory.mockReturnValueOnce(false)
        await store.dispatch(
          actions.getProducts({
            pathname,
            query: {},
          })
        )

        expect(getPageStatusCode(store.getState())).toBe(410)
        expect(store.getState().products.isLoadingAll).toBe(false)
        expect(getContent).toHaveBeenCalledWith({}, 'error404')
      })
    })

    describe('when session times out (440 response)', () => {
      const fakeProducts = ["big 'ol hat"]
      const fakeGetBody = {
        products: fakeProducts,
        refinements: [],
      }
      beforeEach(() => {
        let nthGet = 1
        get.mockImplementation(() => {
          if (nthGet === 1) {
            nthGet += 1
            return () =>
              Promise.reject({
                error: 'Session timeout',
                message: '',
                status: 440,
              })
          }
          return () =>
            Promise.resolve({
              body: fakeGetBody,
            })
        })
      })

      it('should not show error content', async () => {
        const store = getMockStoreWithInitialReduxState({})

        const location = {
          pathname: '/en/tsuk/category/clothing-427/dresses-442',
          query: '',
          search: '',
        }

        await store.dispatch(actions.getProducts(location))
        expect(getContent).not.toHaveBeenCalledWith({}, 'error404')
      })

      it('should retry fetching products', async () => {
        const store = getMockStoreWithInitialReduxState({})

        const location = {
          pathname: '/en/tsuk/category/clothing-427/dresses-442',
          query: '',
          search: '',
        }

        const secondDispatch = await store.dispatch(
          actions.getProducts(location)
        )
        await secondDispatch

        const expectMockToHaveBeenCalledNthWith = (mock, n, ...args) =>
          expect(mock.mock.calls[n - 1]).toEqual(args)

        expect(get).toHaveBeenCalledTimes(2)
        const expectedFetchURL =
          '/products/seo?seoUrl=/en/tsuk/category/clothing-427/dresses-442&pageSize=24'
        expectMockToHaveBeenCalledNthWith(get, 1, expectedFetchURL)
        expectMockToHaveBeenCalledNthWith(get, 2, expectedFetchURL)

        expect(store.getActions()).toEqual(
          expect.arrayContaining([
            {
              type: 'SET_PRODUCTS',
              body: fakeGetBody,
            },
          ])
        )
      })
    })
  })

  describe('resetProductState', () => {
    it('should return an action to reset product state', () => {
      expect(actions.resetProductState()).toMatchSnapshot()
    })
  })

  it('setProductDetail', () => {
    snapshot(actions.setProductDetail({ productId: '123' }))
  })
  it('updateActiveItem', () => {
    snapshot(actions.updateActiveItem({ sku: '123' }))
  })
  it('updateActiveItemQuantity', () => {
    const selectedQuantity = 3
    snapshot(actions.updateActiveItemQuantity(selectedQuantity))
    expect(analyticsPdpClickEvent).toHaveBeenCalledWith(
      `productquantity-${selectedQuantity}`
    )
  })
  it('updateSelectedOosItem', () => {
    snapshot(actions.updateSelectedOosItem({ productId: '123' }))
  })
  it('updateShowItemsError', () => {
    snapshot(actions.updateShowItemsError({ error: '123' }))
  })
  it('setSizeGuide(sizeGuideType)', () => {
    const sizeGuideType = 'tops'
    expect(actions.setSizeGuide(sizeGuideType)).toEqual({
      type: 'SET_SIZE_GUIDE',
      sizeGuideType,
    })
  })
  it('showSizeGuide', () => {
    snapshot(actions.showSizeGuide())
  })
  it('hideSizeGuide', () => {
    snapshot(actions.hideSizeGuide())
  })
  it('clearProduct', () => {
    snapshot(actions.clearProduct())
  })
  it('loadingProducts', () => {
    snapshot(actions.loadingProducts('url'))
  })
  it('removeProductsLocation', () => {
    snapshot(actions.removeProductsLocation())
  })
  it('loadingMoreProducts', () => {
    snapshot(actions.loadingMoreProducts(false))
  })
  it('setProductsLocation', () => {
    snapshot(actions.setProductsLocation('location name'))
  })
  it('removeProducts', () => {
    snapshot(actions.removeProducts())
  })
  it('removeProductsLocation', () => {
    snapshot(actions.removeProductsLocation())
  })
  it('updateProductSizesAndQuantities', () => {
    const productId = '12345'
    const items = { aaa: 'bb' }
    expect(actions.updateProductSizesAndQuantities(productId, items)).toEqual({
      type: 'UPDATE_PRODUCT_ITEMS',
      productId,
      items,
    })
  })

  describe('getProductStock', () => {
    const initialState = {
      routing: {
        location: {
          pathname: '/path/to/product',
          query: { this: 'is', a: 'query' },
        },
      },
    }
    const store = getMockStoreWithInitialReduxState(initialState)

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should call actions', async () => {
      const items = [{ a: 'b', c: 'd' }]
      get.mockImplementation(() => () =>
        Promise.resolve({
          type: 'MOCK_GET',
          body: items,
        })
      )

      const expectedAction = [
        { type: 'UPDATE_PRODUCT_ITEMS', productId: '12345', items },
      ]

      await store.dispatch(actions.getProductStock('12345'))
      expect(get).toHaveBeenCalledTimes(1)
      expect(get).toHaveBeenCalledWith('/products/stock?productId=12345', false)
      expect(store.getActions()).toEqual(expect.arrayContaining(expectedAction))
    })

    it('should handle errored', async () => {
      get.mockImplementation(() => () => Promise.reject())

      try {
        await store.dispatch(actions.getProductStock('12345'))
        expect(get).toHaveBeenCalledTimes(1)
        expect(get).toHaveBeenCalledWith(
          '/products/stock?productId=12345',
          false
        )
      } catch (err) {
        throw new Error('should not throw error')
      }
    })
  })

  describe('getProductRequest', () => {
    const responses = {
      '/products/23423': {
        message: 'this is a body',
      },
      '/products/23424': {
        message: 'this is a body',
        sourceUrl: 'url-hash',
      },
      '/products/23425': {
        items: [{ quantity: 3 }, { quantity: 4 }],
      },
      '/products/23426': {
        items: [{ quantity: 0 }, { quantity: 0 }],
      },
      '/products/23427': {
        items: [{ quantity: 4 }],
      },
      '/products/23428': {
        items: [{ quantity: 0 }],
      },
      '/products/30263823': {
        productId: '30263823',
        canonicalUrl:
          'www.topman.com/en/tmuk/product/black-acid-wash-biker-spray-on-ripped-jeans-7170990',
        seeMoreValue: [
          {
            seeMoreLabel: 'Jeans',
            seeMoreLink: '/_/N-2bswZ1xjf',
          },
          {
            seeMoreLabel: 'Spray On Jeans',
            seeMoreLink: '/_/N-2bu3Z1xjf',
          },
        ],
      },
      '/products/TS02G02PNAV': {
        productId: '12113313',
        seeMoreValue: [
          {
            seeMoreLabel: 'Jeans',
            seeMoreLink: '/_/N-2bswZ1xjf',
          },
          {
            seeMoreLabel: 'Spray On Jeans',
            seeMoreLink: '/_/N-2bu3Z1xjf',
          },
        ],
      },
      '/products/BUNDLE_17X01NMUS36X02NMUS': {
        productId: '2432434234',
        isBundleOrOutfit: true,
        seeMoreValue: [
          {
            seeMoreLabel: 'Jeans',
            seeMoreLink: '/_/N-2bswZ1xjf',
          },
          {
            seeMoreLabel: 'Spray On Jeans',
            seeMoreLink: '/_/N-2bu3Z1xjf',
          },
        ],
      },
      '/products?endecaSeoValue=N-2bswZ1xjf': {
        canonicalUrl: 'www.topman.com.arcadiagroup.co.uk/Jeans/_/N-2bswZ1xjf',
      },
      '/products?endecaSeoValue=N-2bu3Z1xjf': {
        canonicalUrl:
          'www.topman.com.arcadiagroup.co.uk/Spray-On-Jeans/_/N-2bu3Z1xjf',
      },
    }
    const initialState = {
      routing: {
        location: {
          pathname: '/path/to/product',
          query: { this: 'is', a: 'query' },
        },
      },
      features: {
        status: {
          FEATURE_REAL_TIME_STOCK: true,
        },
      },
    }
    const store = getMockStoreWithInitialReduxState(initialState)

    beforeEach(() => {
      store.clearActions()
      get.mockImplementation((url) => () => {
        if (responses[url]) {
          return Promise.resolve({
            type: 'MOCK_GET',
            body: responses[url],
          })
        }
        return Promise.reject({})
      })
    })

    it('should get product', async () => {
      const testProduct = {
        testProduct: true,
      }
      mockGetProductsResponse(testProduct)

      try {
        const product = await store.dispatch(
          actions.getProductRequest({ identifier: 999 })
        )

        expect(product).toEqual(testProduct)
      } catch (error) {
        global.fail(`Unexpected error thrown: ${error}`)
      }
    })

    it('should get product identifier from route path if not passed', async () => {
      const testProduct = {
        testProduct: true,
      }
      mockGetProductsResponse(testProduct)

      try {
        await store.dispatch(actions.getProductRequest())

        expect(get).toHaveBeenCalledWith('/products/%2Fpath%2Fto%2Fproduct')
      } catch (error) {
        global.fail(`Unexpected error thrown: ${error}`)
      }
    })

    it('should return an error 440 and not redirect', async () => {
      mockGetProductsResponse(
        Promise.reject({
          error: 'Session timeout',
          message: '',
          status: 440,
        })
      )
      const { setRedirect } = getReduxContext()
      const store = getMockStoreWithInitialReduxState({})

      try {
        await store.dispatch(actions.getProductRequest({ identifier: 999 }))
      } catch (error) {
        // expected
      }

      expect(setRedirect).not.toHaveBeenCalled()
    })

    it('should set api error for other failed responses', async () => {
      mockGetProductsResponse(
        Promise.reject({
          error: 'BANG',
          message: 'BANG',
          status: 500,
        })
      )

      const expectedActions = [{ type: 'SET_ERROR', error: expect.any(Object) }]

      const store = getMockStoreWithInitialReduxState({})

      try {
        await store.dispatch(actions.getProductRequest({ identifier: 999 }))
      } catch (error) {
        // expected
      }
      expect(store.getActions()).toEqual(
        expect.arrayContaining(expectedActions)
      )
    })

    describe('real time stock', () => {
      it('should call getProductStock is RealTime is True and Authenticated', async () => {
        const store = mockStoreCreator({
          routing: {
            location: {
              pathname:
                '/en/tmuk/product/black-acid-wash-biker-spray-on-ripped-jeans-7170990',
            },
          },
        })

        featureSelectors.isFeatureRealTimeStockEnabled.mockReturnValueOnce(true)
        getItem.mockReturnValueOnce('yes')
        await store.dispatch(
          actions.getProductRequest({ identifier: 30263823 })
        )
        expect(get).toHaveBeenCalledTimes(2)
        expect(get.mock.calls[0][0]).toEqual('/products/30263823')
        expect(get.mock.calls[1][0]).toEqual(
          '/products/stock?productId=30263823'
        )
      })

      it('should call not getProductStock is RealTime and NOT authenticated', async () => {
        const store = mockStoreCreator({
          routing: {
            location: {
              pathname:
                '/en/tmuk/product/black-acid-wash-biker-spray-on-ripped-jeans-7170990',
            },
          },
        })
        getRouteFromUrl.mockImplementation(
          () =>
            '/en/tmuk/product/black-acid-wash-biker-spray-on-ripped-jeans-7170990'
        )
        getItem.mockReturnValueOnce('no')
        await store.dispatch(actions.getProductDetail({ identifier: 30263823 }))
        expect(get).toHaveBeenCalledTimes(3)
        expect(get.mock.calls[0][0]).toEqual('/products/30263823')
        expect(get.mock.calls[1][0]).toEqual(
          '/products?endecaSeoValue=N-2bswZ1xjf'
        )
        expect(get.mock.calls[2][0]).toEqual(
          '/products?endecaSeoValue=N-2bu3Z1xjf'
        )
      })

      it('should call not getProductStock is NOT Real and is Authenticated', async () => {
        const store = mockStoreCreator({
          routing: {
            location: {
              pathname:
                '/en/tmuk/product/black-acid-wash-biker-spray-on-ripped-jeans-7170990',
            },
          },
        })
        getItem.mockReturnValueOnce('yes')
        await store.dispatch(actions.getProductDetail({ identifier: 30263823 }))
        expect(get).toHaveBeenCalledTimes(3)
        expect(get.mock.calls[0][0]).toEqual('/products/30263823')
        expect(get.mock.calls[1][0]).toEqual(
          '/products?endecaSeoValue=N-2bswZ1xjf'
        )
        expect(get.mock.calls[2][0]).toEqual(
          '/products?endecaSeoValue=N-2bu3Z1xjf'
        )
      })

      it('should call getProductStock  is NOT Real and NOT Authenticated', async () => {
        const store = mockStoreCreator({
          routing: {
            location: {
              pathname:
                '/en/tmuk/product/black-acid-wash-biker-spray-on-ripped-jeans-7170990',
            },
          },
        })
        getItem.mockReturnValueOnce('no')
        await store.dispatch(actions.getProductDetail({ identifier: 30263823 }))
        expect(get).toHaveBeenCalledTimes(3)
        expect(get.mock.calls[0][0]).toEqual('/products/30263823')
        expect(get.mock.calls[1][0]).toEqual(
          '/products?endecaSeoValue=N-2bswZ1xjf'
        )
        expect(get.mock.calls[2][0]).toEqual(
          '/products?endecaSeoValue=N-2bu3Z1xjf'
        )
      })
    })
  })

  describe('findSingleSizeItem', () => {
    it('should return { } response if items quantity is 0', () => {
      const item = { quantity: 0 }
      expect(actions.findSingleSizeItem(item)).toEqual({})
    })
    it('should return { quantity: 0 } response if items quantity < 0', () => {
      const item = { quantity: -3 }
      expect(actions.findSingleSizeItem(item)).toEqual({})
    })
    it('should return the item quantity is > 0', () => {
      const item = { quantity: 3 }
      expect(actions.findSingleSizeItem(item)).toEqual(item)
    })
  })

  describe('findPreSelectedSizeItem', () => {
    const product = {
      items: [
        { sizeMapping: 9, size: 9, quantity: 2 },
        { sizeMapping: 10, size: 10, quantity: 2 },
        { sizeMapping: 11, size: 11, quantity: 0 },
        { sizeMapping: 'M', size: 'MED', quantity: 4 },
      ],
    }

    it('should return the item that matches the preSelectedSize, when quantity > 0', () => {
      const preSelectedSize = 10
      const item = actions.findPreSelectedSizeItem(product, preSelectedSize)
      expect(item.size).toEqual(preSelectedSize)
    })
    it('should return the item that matches the correct size mapping', () => {
      const preSelectedSize = 'm'
      const expectedSize = 'MED'
      const item = actions.findPreSelectedSizeItem(product, preSelectedSize)
      expect(item.size).toEqual(expectedSize)
    })
    it('should return the item that matches the preSelectedSize, when quantity > 0', () => {
      const preSelectedSize = 10
      const item = actions.findPreSelectedSizeItem(product, preSelectedSize)
      expect(item.size).toEqual(preSelectedSize)
    })
    it('should return the {} when the item matches the preSelectedSize but quantity <= 0', () => {
      const preSelectedSize = 11
      const item = actions.findPreSelectedSizeItem(product, preSelectedSize)
      expect(item).toEqual({})
    })
    it('should return the {} when the item does not match the preSelectedSize', () => {
      const preSelectedSize = 15
      const item = actions.findPreSelectedSizeItem(product, preSelectedSize)
      expect(item).toEqual({})
    })
  })

  describe('preSelectActiveItem', () => {
    describe('when there is only one size/item available', () => {
      const product = { items: [{ sizeMapping: 9, size: 9, quantity: 2 }] }
      const noQuantityProduct = {
        items: [{ sizeMapping: 9, size: 9, quantity: 0 }],
      }
      const undefinedItemsProduct = { items: undefined }
      let store = {}

      beforeEach(() => {
        store = mockStoreCreator()
      })

      it('should return if items is not an array', () => {
        const expectedActions = []

        store.dispatch(actions.preSelectActiveItem(undefinedItemsProduct))

        expect(store.getActions()).toEqual(expectedActions)
      })

      it('should call updateActiveItem with the item when quantity is > 0', () => {
        const expectedActions = [
          {
            activeItem: {
              quantity: 2,
              size: 9,
              sizeMapping: 9,
            },
            type: 'UPDATE_ACTIVE_ITEM',
          },
        ]

        store.dispatch(actions.preSelectActiveItem(product))

        expect(store.getActions()).toEqual(expectedActions)
      })

      it('should call updateActiveItem with empty object when quantity is <= 0', () => {
        const expectedActions = [
          {
            activeItem: {},
            type: 'UPDATE_ACTIVE_ITEM',
          },
        ]

        store.dispatch(actions.preSelectActiveItem(noQuantityProduct))

        expect(store.getActions()).toEqual(expectedActions)
      })

      it('should call updateQuickViewActiveItem with item when quantity is > 0 and quickview modal is open', () => {
        const expectedActions = [
          {
            activeItem: {
              quantity: 2,
              size: 9,
              sizeMapping: 9,
            },
            type: 'UPDATE_QUICK_VIEW_ACTIVE_ITEM',
          },
        ]

        modalMode.mockReturnValue('plpQuickview')
        isModalOpen.mockReturnValue(true)

        store.dispatch(actions.preSelectActiveItem(product))

        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    describe('when the FEATURE_PRE_SELECT_SIZE flag is TRUE and store has preSelectedSize', () => {
      const item1 = { sizeMapping: 9, size: 9, quantity: 2 }
      const item2 = { sizeMapping: 10, size: 10, quantity: 4 }
      const item3 = { sizeMapping: 11, size: 11, quantity: 0 }
      const product = { items: [item1, item2, item3] }

      const singleItem = { items: [{ sizeMapping: 9, size: 9, quantity: 2 }] }

      const store = mockStoreCreator()

      beforeAll(() => {
        modalMode.mockReturnValue('')
        isModalOpen.mockReturnValue(false)
      })
      beforeEach(() => {
        jest.clearAllMocks()
        store.clearActions()
        refinementsSelectors.getPreSelectedSize = jest.fn()
        featureSelectors.isFeatureEnabled.mockReturnValue(true)
      })

      it('should call updateActiveItem with the item matching the pre selected size', () => {
        refinementsSelectors.getPreSelectedSize.mockReturnValue(10)

        const expectedActions = [
          {
            activeItem: item2,
            type: 'UPDATE_ACTIVE_ITEM',
          },
        ]

        store.dispatch(actions.preSelectActiveItem(product))

        expect(store.getActions()).toEqual(expectedActions)
      })
      it('should call updateActiveItem with empty object when matches pre selected size but quantity <= 0', () => {
        refinementsSelectors.getPreSelectedSize.mockReturnValue(11)

        const expectedActions = [
          {
            activeItem: {},
            type: 'UPDATE_ACTIVE_ITEM',
          },
        ]

        store.dispatch(actions.preSelectActiveItem(product))

        expect(store.getActions()).toEqual(expectedActions)
      })
      it('should call updateActiveItem with empty object when product sizes do not match pre selected size', () => {
        refinementsSelectors.getPreSelectedSize.mockReturnValue(10)

        const expectedActions = [
          {
            activeItem: item1,
            type: 'UPDATE_ACTIVE_ITEM',
          },
        ]

        store.dispatch(actions.preSelectActiveItem(singleItem))

        expect(store.getActions()).toEqual(expectedActions)
      })
      it('should call updateActiveItem with the item when product has a single item', () => {
        refinementsSelectors.getPreSelectedSize.mockReturnValue(8)

        const expectedActions = [
          {
            activeItem: {},
            type: 'UPDATE_ACTIVE_ITEM',
          },
        ]

        store.dispatch(actions.preSelectActiveItem(product))

        expect(store.getActions()).toEqual(expectedActions)
      })
      it('should call updateQuickViewActiveItem when quickview modal is open', () => {
        modalMode.mockReturnValue('plpQuickview')
        isModalOpen.mockReturnValue(true)

        refinementsSelectors.getPreSelectedSize.mockReturnValue(10)

        const expectedActions = [
          {
            activeItem: item2,
            type: 'UPDATE_QUICK_VIEW_ACTIVE_ITEM',
          },
        ]

        store.dispatch(actions.preSelectActiveItem(product))
        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    describe('when FEATURE_PRE_SELECT_SIZE flag is FALSE and store has preSelectedSize', () => {
      const item1 = { size: 9, quantity: 2 }
      const item2 = { size: 10, quantity: 4 }
      const item3 = { size: 11, quantity: 0 }
      const product = { items: [item1, item2, item3] }
      const store = mockStoreCreator()

      beforeAll(() => {
        modalMode.mockReturnValue('')
        isModalOpen.mockReturnValue(false)
      })

      beforeEach(() => {
        featureSelectors.isFeatureEnabled.mockReturnValue(false)
        store.clearActions()
        refinementsSelectors.getPreSelectedSize = jest.fn()
      })

      it('should call updateActiveItem with empty object', () => {
        refinementsSelectors.getPreSelectedSize.mockReturnValue(10)

        const expectedActions = [
          {
            activeItem: {},
            type: 'UPDATE_ACTIVE_ITEM',
          },
        ]

        store.dispatch(actions.preSelectActiveItem(product))

        expect(store.getActions()).toEqual(expectedActions)
      })
      it('should call updateQuickViewActiveItem with empty object when quickview modal is open', () => {
        modalMode.mockReturnValue('plpQuickview')
        isModalOpen.mockReturnValue(true)

        refinementsSelectors.getPreSelectedSize.mockReturnValue(10)

        const expectedActions = [
          {
            activeItem: {},
            type: 'UPDATE_QUICK_VIEW_ACTIVE_ITEM',
          },
        ]

        store.dispatch(actions.preSelectActiveItem(product))
        expect(store.getActions()).toEqual(expectedActions)
      })
    })

    describe('when FEATURE_PRE_SELECT_SIZE flag is FALSE, preSelectedSize is null, and has multiple size (emulating normal)', () => {
      const item1 = { size: 9, quantity: 2 }
      const item2 = { size: 10, quantity: 4 }
      const item3 = { size: 11, quantity: 0 }
      const product = { items: [item1, item2, item3] }
      let store = {}

      beforeAll(() => {
        modalMode.mockReturnValue('')
        isModalOpen.mockReturnValue(false)
      })

      beforeEach(() => {
        featureSelectors.isFeatureEnabled.mockReturnValue(false)
        store = mockStoreCreator()
      })

      it('should call updateActiveItem with empty object ', () => {
        const expectedActions = [
          {
            activeItem: {},
            type: 'UPDATE_ACTIVE_ITEM',
          },
        ]

        store.dispatch(actions.preSelectActiveItem(product))

        expect(store.getActions()).toEqual(expectedActions)
      })
      it('should call updateQuickViewActiveItem with empty object when quickview modal is open', () => {
        modalMode.mockReturnValue('plpQuickview')
        isModalOpen.mockReturnValue(true)

        const expectedActions = [
          {
            activeItem: {},
            type: 'UPDATE_QUICK_VIEW_ACTIVE_ITEM',
          },
        ]

        store.dispatch(actions.preSelectActiveItem(product))

        expect(store.getActions()).toEqual(expectedActions)
      })
    })
  })

  describe('getProductDetail', () => {
    const responses = {
      '/products/23423': {
        message: 'this is a body',
        canonicalUrl: 'www.topman.com.arcadiagroup.co.uk/path/to/product',
      },
      '/products/23424': {
        message: 'this is a body',
        sourceUrl: 'url-hash',
        canonicalUrl: 'www.topman.com.arcadiagroup.co.uk/path/to/product',
        canonicalUrlSet: true,
      },
      '/products/23425': {
        items: [{ quantity: 3 }, { quantity: 4 }],
        canonicalUrl: 'www.topman.com.arcadiagroup.co.uk/path/to/product',
      },
      '/products/23426': {
        items: [{ quantity: 0 }, { quantity: 0 }],
        canonicalUrl: 'www.topman.com.arcadiagroup.co.uk/path/to/product',
      },
      '/products/23427': {
        items: [{ quantity: 4 }],
        canonicalUrl: 'www.topman.com.arcadiagroup.co.uk/path/to/product',
      },
      '/products/23428': {
        items: [{ quantity: 0 }],
        canonicalUrl: 'www.topman.com.arcadiagroup.co.uk/path/to/product',
      },
      '/products/123456': {
        permanentRedirectUrl: '/anotherProductMock',
        canonicalUrl: 'www.topman.com.arcadiagroup.co.uk/path/to/product',
      },
      '/products/123457': {
        permanentRedirectUrl: '/another/éßü/ProdúctMock/withSpêcial/chærater',
      },
      '/products/30263823': {
        productId: '30263823',
        canonicalUrl: 'www.topman.com.arcadiagroup.co.uk/path/to/product',
        seeMoreValue: [
          {
            seeMoreLabel: 'Jeans',
            seeMoreLink: '/_/N-2bswZ1xjf',
          },
          {
            seeMoreLabel: 'Spray On Jeans',
            seeMoreLink: '/_/N-2bu3Z1xjf',
          },
        ],
      },
      '/products/TS02G02PNAV': {
        canonicalUrl: 'www.topman.com.arcadiagroup.co.uk/path/to/product',
        productId: '12113313',
        seeMoreValue: [
          {
            seeMoreLabel: 'Jeans',
            seeMoreLink: '/_/N-2bswZ1xjf',
          },
          {
            seeMoreLabel: 'Spray On Jeans',
            seeMoreLink: '/_/N-2bu3Z1xjf',
          },
        ],
      },
      '/products/BUNDLE_17X01NMUS36X02NMUS': {
        productId: '2432434234',
        isBundleOrOutfit: true,
        canonicalUrl: 'www.topman.com.arcadiagroup.co.uk/path/to/product',
        seeMoreValue: [
          {
            seeMoreLabel: 'Jeans',
            seeMoreLink: '/_/N-2bswZ1xjf',
          },
          {
            seeMoreLabel: 'Spray On Jeans',
            seeMoreLink: '/_/N-2bu3Z1xjf',
          },
        ],
      },
      '/products?endecaSeoValue=N-2bswZ1xjf': {
        canonicalUrl: 'www.topman.com.arcadiagroup.co.uk/Jeans/_/N-2bswZ1xjf',
      },
      '/products?endecaSeoValue=N-2bu3Z1xjf': {
        canonicalUrl:
          'www.topman.com.arcadiagroup.co.uk/Spray-On-Jeans/_/N-2bu3Z1xjf',
      },
    }
    const initialState = {
      routing: {
        location: {
          pathname: '/path/to/product',
          query: { this: 'is', a: 'query' },
        },
      },
      features: {
        status: {
          FEATURE_REAL_TIME_STOCK: true,
        },
      },
    }
    const store = getMockStoreWithInitialReduxState(initialState)

    beforeAll(() => {
      modalMode.mockReturnValue('')
      isModalOpen.mockReturnValue(false)
    })

    beforeEach(() => {
      store.clearActions()
      get.mockImplementation((url) => () => {
        if (responses[url]) {
          return Promise.resolve({
            type: 'MOCK_GET',
            body: responses[url],
          })
        }
        return Promise.reject({})
      })
      jest.clearAllMocks()
    })

    it('should call setProductDetail, getRouteFromUrl, browserHistory.replace', () => {
      getRouteFromUrl.mockImplementation(() => '/path/to/product')
      return store
        .dispatch(actions.getProductDetail({ identifier: 23424 }))
        .then(() => {
          const expectedAction = [
            {
              product: {
                message: 'this is a body',
                sourceUrl: 'url-hash',
                canonicalUrl:
                  'www.topman.com.arcadiagroup.co.uk/path/to/product',
                canonicalUrlSet: true,
              },
              type: 'SET_PRODUCT',
            },
          ]
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedAction)
          )
          expect(getRouteFromUrl).toHaveBeenCalledTimes(2)
          expect(getRouteFromUrl).toHaveBeenLastCalledWith('url-hash')
          expect(browserHistory.replace).toHaveBeenCalledTimes(1)
          expect(browserHistory.replace).toHaveBeenLastCalledWith({
            pathname: '/path/to/product',
            query: initialState.routing.location.query,
          })
        })
    })

    it('if get throws an error', () => {
      return store
        .dispatch(actions.getProductDetail({ identifier: 999 }))
        .then(() => {
          const expectedAction = [
            { product: { success: false }, type: 'SET_PRODUCT' },
            { statusCode: 404, type: 'SET_PAGE_STATUS_CODE' },
          ]
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedAction)
          )
        })
    })

    describe('if the product path is not equal to the product canonical URL', () => {
      it('should call redirect func and set page status to 301 if canonicalUrlSet is true', () => {
        getRouteFromUrl.mockImplementation(() => '/canonical/path/to/product')
        return store
          .dispatch(actions.getProductDetail({ identifier: 23424 }))
          .then(() => {
            const expectedAction = [
              {
                redirect: {
                  permanent: true,
                  url: '/canonical/path/to/product?this=is&a=query',
                },
                type: 'URL_REDIRECT_SERVER',
              },
            ]
            expect(store.getActions()).toEqual(
              expect.arrayContaining(expectedAction)
            )
          })
      })
    })

    describe('permanentRedirectUrl is present', () => {
      describe('and it is server-side rendering', () => {
        it('send a redirect', () => {
          process.browser = false
          return store
            .dispatch(actions.getProductDetail({ identifier: 123456 }))
            .then(() => {
              const expectedAction = [
                {
                  redirect: {
                    permanent: true,
                    url: '/anotherProductMock?this=is&a=query',
                  },
                  type: 'URL_REDIRECT_SERVER',
                },
              ]
              expect(store.getActions()).toEqual(
                expect.arrayContaining(expectedAction)
              )
            })
        })
        it('will convert special character and send a redirect', () => {
          return store
            .dispatch(actions.getProductDetail({ identifier: 123457 }))
            .then(() => {
              const expectedAction = [
                {
                  redirect: {
                    permanent: true,
                    url:
                      '/another/%C3%A9%C3%9F%C3%BC/Prod%C3%BActMock/withSp%C3%AAcial/ch%C3%A6rater?this=is&a=query',
                  },
                  type: 'URL_REDIRECT_SERVER',
                },
              ]
              expect(store.getActions()).toEqual(
                expect.arrayContaining(expectedAction)
              )
            })
        })
      })

      describe('and it is client-side rendering', () => {
        const originalProcessBrowser = global.process.browser
        beforeEach(() => {
          global.process.browser = true
        })
        afterEach(() => {
          global.process.browser = originalProcessBrowser
        })

        it('changes the browser history with processRedirectUrl', () => {
          return store
            .dispatch(actions.getProductDetail({ identifier: 123456 }))
            .then(() => {
              expect(processRedirectUrl).toHaveBeenCalledWith(
                '/anotherProductMock?this=is&a=query'
              )
            })
        })
      })
    })
    describe('preloadProductDetail', () => {
      const defaultProduct = {
        name: 'Name Mock 1',
        productId: 666,
        lineNumber: 'lineNumber Mock 1',
        attributes: 'attributes Mock 1',
        seoUrl: 'seoUrl Mock 1',
        productUrl: 'productUrl Mock 1',
        unitPrice: 'unitPrice Mock 1',
        wasPrice: 'wasPrice Mock 1',
        items: 'items Mock 1',
        assets: 'assets Mock 1',
        additionalAssets: 'additionalAssets Mock 1',
        outfitBaseImageUrl: 'outfitBaseImageUrl Mock 1',
        productBaseImageUrl: 'productBaseImageUrl Mock 1',
      }
      const props = {
        categoryTitle: 'categoryTitle prop',
        location: {
          pathname: 'location pathname prop',
        },
        brandCode: 'ts',
      }
      const preloadedProduct = {
        ...defaultProduct,
        isPreloaded: true,
        outfitBaseImageUrl: undefined,
        productBaseImageUrl: undefined,
        amplienceAssets: {
          images: [defaultProduct.outfitBaseImageUrl],
        },
        breadcrumbs: [
          { label: 'Home', url: '/' },
          { label: props.categoryTitle, url: props.location.pathname },
          { label: defaultProduct.name },
        ],
      }

      it('should return null if was initialised via the wishlist button', async () => {
        await store.dispatch(
          actions.preloadProductDetail(defaultProduct, props, true)
        )
        expect(store.getActions()).toEqual([])
      })

      it('should dispatch setProductDetail with a preloaded product', () => {
        getRouteFromUrl.mockImplementation(() => '/path/to/product')
        return store
          .dispatch(actions.preloadProductDetail(defaultProduct, props, false))
          .then(() => {
            const expectedAction = [
              {
                product: preloadedProduct,
                type: 'SET_PRODUCT',
              },
            ]
            expect(store.getActions()).toEqual(
              expect.arrayContaining(expectedAction)
            )
          })
      })

      describe('specific brands with product view loaded first on PDP', () => {
        it('should preload outfit view by default', () => {
          const propsWithDefaultOutfitView = {
            ...props,
            brandCode: 'ts',
          }

          return store
            .dispatch(
              actions.preloadProductDetail(
                defaultProduct,
                propsWithDefaultOutfitView,
                false
              )
            )
            .then(() => {
              const expectedAction = [
                {
                  product: preloadedProduct,
                  type: 'SET_PRODUCT',
                },
              ]
              expect(store.getActions()).toEqual(
                expect.arrayContaining(expectedAction)
              )
            })
        })

        const brandsShowingProductViewFirst = ['wl', 'ev', 'dp', 'br']
        brandsShowingProductViewFirst.map((brandCode) =>
          it(`should preload product image first for brandCode ${brandCode}`, () => {
            const propsWithProductView = {
              ...props,
              brandCode,
            }
            const preloadedProductWithProductView = {
              ...preloadedProduct,
              amplienceAssets: {
                images: [defaultProduct.productBaseImageUrl],
              },
            }
            return store
              .dispatch(
                actions.preloadProductDetail(
                  defaultProduct,
                  propsWithProductView,
                  false
                )
              )
              .then(() => {
                const expectedAction = [
                  {
                    product: preloadedProductWithProductView,
                    type: 'SET_PRODUCT',
                  },
                ]
                expect(store.getActions()).toEqual(
                  expect.arrayContaining(expectedAction)
                )
              })
          })
        )
      })
    })

    it('should call preSelectActiveItem if items are available', () => {
      getRouteFromUrl.mockImplementation(() => '/path/to/product')
      const response = responses['/products/23425']

      const expectedActions = [
        {
          product: response,
          type: 'SET_PRODUCT',
        },
      ]

      return store
        .dispatch(actions.getProductDetail({ identifier: 23425 }))
        .then(() => {
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedActions)
          )
        })
    })

    it('should clear activeItem, if a product is a bundle', () => {
      getRouteFromUrl.mockImplementation(() => '/path/to/product')
      const response = responses['/products/BUNDLE_17X01NMUS36X02NMUS']

      const expectedActions = [
        {
          product: response,
          type: 'SET_PRODUCT',
        },
        {
          activeItem: {},
          type: 'UPDATE_ACTIVE_ITEM',
        },
      ]

      return store
        .dispatch(
          actions.getProductDetail({ identifier: 'BUNDLE_17X01NMUS36X02NMUS' })
        )
        .then(() => {
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedActions)
          )
        })
    })

    it('if get returns a multi size item with quantity > 0 then it should call updateActiveItem with empty object', () => {
      getRouteFromUrl.mockImplementation(() => '/path/to/product')
      return store
        .dispatch(actions.getProductDetail({ identifier: 23425 }))
        .then(() => {
          const expectedAction = [
            { activeItem: {}, type: 'UPDATE_ACTIVE_ITEM' },
          ]
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedAction)
          )
        })
    })
    it('if get returns a multi size item with quantity = 0 then it should call updateActiveItem with empty object', () => {
      getRouteFromUrl.mockImplementation(() => '/path/to/product')
      return store
        .dispatch(actions.getProductDetail({ identifier: 23426 }))
        .then(() => {
          const expectedAction = [
            { activeItem: {}, type: 'UPDATE_ACTIVE_ITEM' },
          ]
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedAction)
          )
        })
    })
    it('if get returns a single size item with quantity > 0 then it should call updateActiveItem with first item', () => {
      getRouteFromUrl.mockImplementation(() => '/path/to/product')
      return store
        .dispatch(actions.getProductDetail({ identifier: 23427 }))
        .then(() => {
          const expectedAction = [
            {
              type: 'SET_PRODUCT',
              product: {
                canonicalUrl:
                  'www.topman.com.arcadiagroup.co.uk/path/to/product',
                items: [{ quantity: 4 }],
              },
            },
            { activeItem: { quantity: 4 }, type: 'UPDATE_ACTIVE_ITEM' },
          ]
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedAction)
          )
        })
    })
    it('if get returns a single size item with quantity = 0 then it should call updateActiveItem with activeItem', () => {
      getRouteFromUrl.mockImplementation(() => '/path/to/product')
      return store
        .dispatch(actions.getProductDetail({ identifier: 23428 }))
        .then(() => {
          const expectedActions = [
            {
              product: {
                canonicalUrl:
                  'www.topman.com.arcadiagroup.co.uk/path/to/product',
                items: [
                  {
                    quantity: 0,
                  },
                ],
              },
              type: 'SET_PRODUCT',
            },
            {
              activeItem: {},
              type: 'UPDATE_ACTIVE_ITEM',
            },
          ]
          expect(store.getActions()).toEqual(
            expect.arrayContaining(expectedActions)
          )
        })
    })

    it('should dispatch `SET_PRODUCT` action with retrieved product', () => {
      const store = mockStoreCreator({
        routing: {
          location: {
            pathname:
              '/en/tmuk/product/black-acid-wash-biker-spray-on-ripped-jeans-7170990',
          },
        },
      })

      getRouteFromUrl.mockImplementation(
        () =>
          '/en/tmuk/product/black-acid-wash-biker-spray-on-ripped-jeans-7170990'
      )

      return store
        .dispatch(actions.getProductDetail({ identifier: 30263823 }))
        .then(() => {
          expect(store.getActions()).toEqual(
            expect.arrayContaining([
              {
                type: 'SET_PRODUCT',
                product: {
                  canonicalUrl:
                    'www.topman.com.arcadiagroup.co.uk/path/to/product',
                  productId: '30263823',
                  seeMoreValue: [
                    {
                      seeMoreLabel: 'Jeans',
                      seeMoreLink: '/_/N-2bswZ1xjf',
                    },
                    {
                      seeMoreLabel: 'Spray On Jeans',
                      seeMoreLink: '/_/N-2bu3Z1xjf',
                    },
                  ],
                },
              },
            ])
          )
        })
    })

    it('handles the scenario where "query.productId" is received as argument instead of "identifier"', () => {
      const store = mockStoreCreator({
        routing: {
          location: {
            pathname: '/path/to/product',
            query: { productId: 30263823 },
          },
        },
      })
      getRouteFromUrl.mockImplementation(() => '/path/to/product')

      return store.dispatch(actions.getProductDetail({})).then(() => {
        expect(store.getActions()).toEqual(
          expect.arrayContaining([
            {
              type: 'SET_PRODUCT',
              product: {
                canonicalUrl:
                  'www.topman.com.arcadiagroup.co.uk/path/to/product',
                productId: '30263823',
                seeMoreValue: [
                  {
                    seeMoreLabel: 'Jeans',
                    seeMoreLink: '/_/N-2bswZ1xjf',
                  },
                  {
                    seeMoreLabel: 'Spray On Jeans',
                    seeMoreLink: '/_/N-2bu3Z1xjf',
                  },
                ],
              },
            },
          ])
        )
      })
    })

    it('handles the scenario where "query.partNumber" (Product) is received as argument instead of "identifier"', () => {
      const store = mockStoreCreator({
        routing: {
          location: {
            pathname: '/path/to/product',
            query: { partNumber: 'TS02G02PNAV' },
          },
        },
      })

      getRouteFromUrl.mockImplementation(() => '/path/to/product')

      return store.dispatch(actions.getProductDetail({})).then(() => {
        expect(store.getActions()).toEqual(
          expect.arrayContaining([
            {
              type: 'SET_PRODUCT',
              product: {
                canonicalUrl:
                  'www.topman.com.arcadiagroup.co.uk/path/to/product',
                productId: '12113313',
                seeMoreValue: [
                  {
                    seeMoreLabel: 'Jeans',
                    seeMoreLink: '/_/N-2bswZ1xjf',
                  },
                  {
                    seeMoreLabel: 'Spray On Jeans',
                    seeMoreLink: '/_/N-2bu3Z1xjf',
                  },
                ],
              },
            },
          ])
        )
      })
    })

    it('handles the scenario where "query.partNumber" (Bundle) is received as argument instead of "identifier"', () => {
      const store = mockStoreCreator({
        routing: {
          location: {
            pathname: '/path/to/product',
            query: { partNumber: 'BUNDLE_17X01NMUS36X02NMUS' },
          },
        },
      })

      getRouteFromUrl.mockImplementation(() => '/path/to/product')

      return store.dispatch(actions.getProductDetail({})).then(() => {
        expect(store.getActions()).toEqual(
          expect.arrayContaining([
            {
              type: 'SET_PRODUCT',
              product: {
                productId: '2432434234',
                canonicalUrl:
                  'www.topman.com.arcadiagroup.co.uk/path/to/product',
                isBundleOrOutfit: true,
                seeMoreValue: [
                  {
                    seeMoreLabel: 'Jeans',
                    seeMoreLink: '/_/N-2bswZ1xjf',
                  },
                  {
                    seeMoreLabel: 'Spray On Jeans',
                    seeMoreLink: '/_/N-2bu3Z1xjf',
                  },
                ],
              },
            },
          ])
        )
      })
    })

    it('should dispatch `UPDATE_SEE_MORE_URL` action with retrieved see more URL', () => {
      const store = mockStoreCreator({
        routing: {
          location: {
            pathname:
              '/en/tmuk/product/black-acid-wash-biker-spray-on-ripped-jeans-7170990',
          },
        },
      })

      getRouteFromUrl.mockImplementation(
        () =>
          '/en/tmuk/product/black-acid-wash-biker-spray-on-ripped-jeans-7170990'
      )

      return store
        .dispatch(actions.getProductDetail({ identifier: 30263823 }))
        .then(() => {
          expect(store.getActions()).toEqual(
            expect.arrayContaining([
              {
                type: 'UPDATE_SEE_MORE_URL',
                seeMoreLink: '/_/N-2bswZ1xjf',
                seeMoreUrl:
                  'www.topman.com.arcadiagroup.co.uk/Jeans/_/N-2bswZ1xjf',
              },
              {
                type: 'UPDATE_SEE_MORE_URL',
                seeMoreLink: '/_/N-2bu3Z1xjf',
                seeMoreUrl:
                  'www.topman.com.arcadiagroup.co.uk/Spray-On-Jeans/_/N-2bu3Z1xjf',
              },
            ])
          )
        })
    })

    it('should call `setPDPEspots` if personalised espots are not enabled', () => {
      getRouteFromUrl.mockImplementation(() => '/path/to/product')

      featureSelectors.isPersonalisedEspotsEnabled.mockReturnValue(false)
      expect(espotActions.setPDPEspots).not.toHaveBeenCalled()
      return store
        .dispatch(actions.getProductDetail({ identifier: 30263823 }))
        .then(() => {
          expect(espotActions.setPDPEspots).toHaveBeenCalled()
        })
    })

    it('should not call `setPDPEspots` if personalised espots are enabled', () => {
      getRouteFromUrl.mockImplementation(() => '/path/to/product')
      featureSelectors.isPersonalisedEspotsEnabled.mockReturnValue(true)
      return store
        .dispatch(actions.getProductDetail({ identifier: 30263823 }))
        .then(() => {
          expect(espotActions.setPDPEspots).not.toHaveBeenCalled()
        })
    })

    describe('On failure', () => {
      it('should not trigger api error on products?endecaSeoValue failure', () => {
        get
          .mockImplementationOnce((url) => () =>
            Promise.resolve({
              type: 'MOCK_GET',
              body: responses[url],
            })
          )
          .mockImplementation(() => () => {
            return Promise.reject({
              error: 'Bad Gateway',
              message: 'Error parsing upstream data',
              statusCode: 502,
            })
          })

        const store = mockStoreCreator({
          routing: {
            location: {
              pathname: '/path/to/product',
            },
          },
        })
        return store
          .dispatch(actions.getProductDetail({ identifier: 30263823 }))
          .then(() => {
            expect(store.getActions()).toEqual([
              {
                type: 'SET_PRODUCT',
                product: {
                  canonicalUrl:
                    'www.topman.com.arcadiagroup.co.uk/path/to/product',
                  productId: '30263823',
                  seeMoreValue: [
                    {
                      seeMoreLabel: 'Jeans',
                      seeMoreLink: '/_/N-2bswZ1xjf',
                    },
                    {
                      seeMoreLabel: 'Spray On Jeans',
                      seeMoreLink: '/_/N-2bu3Z1xjf',
                    },
                  ],
                },
              },
            ])
          })
      })
    })
  })

  describe('setPredecessorPage', () => {
    const initialState = {
      config: {
        currentProduct: {
          list: '',
        },
      },
    }

    const expectedAction = [{ list: 'pdp', type: 'SET_PREDECESSOR_PAGE' }]

    const store = getMockStoreWithInitialReduxState(initialState)

    it('sets predecessor page', () => {
      store.dispatch(actions.setPredecessorPage('pdp'))
      expect(store.getActions()).toEqual(expect.arrayContaining(expectedAction))
    })
  })

  describe('addToProducts', () => {
    const initState = {
      products: {
        products: range(25, 49),
        refinements: [],
      },
    }

    const url = {
      search: '/products?currentPage=2&q=red&pageSize=24',
      category: '/products?currentPage=2&pageSize=24&category=203984,208523',
      categoryFilter:
        '/en/tsuk/category/clothing-427/dresses-442/black/N-85cZdeoZdgl?Nrpp=24&siteId=%2F12556&No=48&pageSize=24&categoryId=208523',
    }

    const getMockResponses = {
      [url.search]: {
        products: [
          {
            productId: '30263823',
          },
        ],
      },
      [url.category]: {
        products: [],
      },
      [`/products/filter?seoUrl=${url.categoryFilter}`]: {
        products: [],
      },
    }

    it('should get more products using a search query url and calling the products endpoint', (done) => {
      get.mockImplementation((url) => () =>
        Promise.resolve({
          type: 'MOCK_GET_PRODUCTS',
          body: getMockResponses[url],
        })
      )

      const routing = {
        location: {
          pathname: url.search,
          search: '',
          query: { q: 'red', currentPage: '1', pageSize: '24' },
        },
      }
      const store = getMockStoreWithInitialReduxState({
        ...initState,
        routing,
      })
      const location = {
        pathname: routing.location.pathname,
        query: { currentPage: '2', pageSize: '24', q: 'red' },
        search: '?q=red&currentPage=2&pageSize=24',
      }

      const secondDispatch = store
        .dispatch(actions.addToProducts())
        .then(() => {
          secondDispatch.then(() => {
            expect(get).toHaveBeenCalledTimes(1)
            expect(get).toHaveBeenCalledWith(
              '/products?currentPage=2&q=red&pageSize=24'
            )
            expect(browserHistory.replace).toHaveBeenCalledTimes(1)
            expect(browserHistory.replace).toHaveBeenLastCalledWith(location)

            expect(store.getActions()).toEqual(
              expect.arrayContaining([
                {
                  type: 'SET_PRODUCTS_LOCATION',
                  location,
                },
              ])
            )
            done()
          })
        })
    })

    it('should get more products using a category url and calling the products endpoint', (done) => {
      get.mockImplementation((url) => () =>
        Promise.resolve({
          type: 'MOCK_GET_PRODUCTS',
          body: getMockResponses[url],
        })
      )
      getCategoryFromBreadcrumbs.mockImplementationOnce(() => '203984,208523')

      const store = getMockStoreWithInitialReduxState({
        ...initState,
        products: {
          breadcrumbs: [
            { label: 'Home', url: '/' },
            {
              label: 'Clothing',
              url:
                '/en/tsuk/category/clothing-427/_/N-82zZdgl?Nrpp=24&siteId=%2F12556',
              category: '203984',
            },
            { label: 'Dresses', category: '203984,208523' },
          ],
          products: range(25, 49),
          refinements: [],
        },
        routing: {
          location: {
            pathname: 'en/tsuk/category/clothing-427/dresses-442',
            search: '',
            query: {},
          },
        },
      })
      const secondDispatch = store
        .dispatch(actions.addToProducts())
        .then(() => {
          secondDispatch.then(() => {
            expect(get).toHaveBeenCalledTimes(1)
            expect(get).toHaveBeenCalledWith(url.category)
            done()
          })
        })
    })

    it('should get more products using a category filter url and calling the filter endpoint', (done) => {
      process.browser = true
      get.mockImplementation((url) => () =>
        Promise.resolve({
          type: 'MOCK_GET_PRODUCTS',
          body: getMockResponses[url],
        })
      )
      reviseNrppParam.mockReturnValue(
        '/en/tsuk/category/clothing-427/dresses-442/black/N-85cZdeoZdgl?Nrpp=24&siteId=%2F12556&No=48'
      )
      removeParamClearAll.mockReturnValueOnce(
        '/en/tsuk/category/clothing-427/dresses-442/black/N-85cZdeoZdgl?Nrpp=24&siteId=%2F12556&No=48'
      )
      navigationSelectors.getCategoryId.mockReturnValue('208523')
      const store = getMockStoreWithInitialReduxState({
        ...initState,
        routing: {
          location: {
            pathname:
              '/en/tsuk/category/clothing-427/dresses-442/black/N-85cZdeoZdgl',
            search: '?Nrpp=24&siteId=%2F12556&categoryId=208523',
            query: {},
          },
        },
      })

      const secondDispatch = store
        .dispatch(actions.addToProducts())
        .then(() => {
          secondDispatch.then(() => {
            expect(get).toHaveBeenCalledTimes(1)
            expect(get).toHaveBeenCalledWith(
              `/products/filter?seoUrl=${encodeURIComponent(
                url.categoryFilter
              )}`
            )
            done()
          })
        })
    })
  })

  describe('getSeeMoreUrls()', () => {
    const getMockResponses = {
      '/products?endecaSeoValue=N-2bswZ1xjf': {
        canonicalUrl: 'www.topman.com.arcadiagroup.co.uk/Jeans/_/N-2bswZ1xjf',
      },
      '/products?endecaSeoValue=N-2bu3Z1xjf': {
        canonicalUrl:
          'www.topman.com.arcadiagroup.co.uk/Spray-On-Jeans/_/N-2bu3Z1xjf',
      },
    }
    const store = mockStoreCreator()
    beforeEach(() => {
      get.mockImplementation((url) => () =>
        Promise.resolve({
          type: 'MOCK_GET',
          body: getMockResponses[url],
        })
      )
      store.clearActions()
    })

    describe('On incorrect input format', () => {
      it('should return `[]` when `seeMoreValue` has no elements', () => {
        return store.dispatch(actions.getSeeMoreUrls()).then(() => {
          expect(store.getActions()).toEqual([])
        })
      })
      it('should return `[]` and should not break the app when `seeMoreValue` items undefined, null, empty ot with incorrect format', () => {
        return store
          .dispatch(
            actions.getSeeMoreUrls([null, {}, undefined, { prop1: 'prop1' }])
          )
          .then(() => {
            expect(store.getActions()).toEqual([])
          })
      })
      it('should return `[]` and should not break the app when `seeMoreLink` accidentally empty', () => {
        const seeMoreValue = [
          {
            seeMoreLabel: '',
            seeMoreLink: '',
          },
        ]
        return store.dispatch(actions.getSeeMoreUrls(seeMoreValue)).then(() => {
          expect(store.getActions()).toEqual([])
        })
      })
    })

    it('should dispatch `UPDATE_SEE_MORE_URL` action creator with the returned see more url', () => {
      const seeMoreValue = [
        {
          seeMoreLabel: 'Jeans',
          seeMoreLink: '/_/N-2bswZ1xjf',
        },
      ]
      return store.dispatch(actions.getSeeMoreUrls(seeMoreValue)).then(() => {
        expect(store.getActions()).toEqual(
          expect.arrayContaining([
            {
              type: 'UPDATE_SEE_MORE_URL',
              seeMoreLink: '/_/N-2bswZ1xjf',
              seeMoreUrl:
                'www.topman.com.arcadiagroup.co.uk/Jeans/_/N-2bswZ1xjf',
            },
          ])
        )
      })
    })
    it('should dispatch more than one `UPDATE_SEE_MORE_URL` action creator with the returned see more url', () => {
      const seeMoreValue = [
        {
          seeMoreLabel: 'Jeans',
          seeMoreLink: '/_/N-2bswZ1xjf',
        },
        {
          seeMoreLabel: 'Spray On Jeans',
          seeMoreLink: '/_/N-2bu3Z1xjf',
        },
      ]
      return store.dispatch(actions.getSeeMoreUrls(seeMoreValue)).then(() => {
        expect(store.getActions()).toEqual([
          {
            type: 'UPDATE_SEE_MORE_URL',
            seeMoreLink: '/_/N-2bswZ1xjf',
            seeMoreUrl: 'www.topman.com.arcadiagroup.co.uk/Jeans/_/N-2bswZ1xjf',
          },
          {
            type: 'UPDATE_SEE_MORE_URL',
            seeMoreLink: '/_/N-2bu3Z1xjf',
            seeMoreUrl:
              'www.topman.com.arcadiagroup.co.uk/Spray-On-Jeans/_/N-2bu3Z1xjf',
          },
        ])
      })
    })
  })

  describe('fetchCombinedProducts() is called on server side when current page is greater than 1', () => {
    const store = getMockStoreWithInitialReduxState({})

    const getMockResponses = {
      '/products?currentPage=1&q=red&pageSize=24': {
        products: range(1, 25),
      },
      '/products?currentPage=2&q=red&pageSize=24': {
        products: range(25, 49),
      },
      '/products?currentPage=1&q=blue&pageSize=24': {
        products: range(1, 25),
      },
      '/products?currentPage=2&q=blue&pageSize=24': {
        products: range(25, 49),
      },
      '/products?currentPage=3&q=blue&pageSize=24': {
        products: range(49, 73),
      },
      '/products?currentPage=1&pageSize=24&category=203984,208523': {
        products: range(1, 25),
      },
      '/products?currentPage=2&pageSize=24&category=203984,208523': {
        products: range(25, 49),
      },
    }

    beforeEach(() => {
      get.mockImplementation((url) => () =>
        Promise.resolve({
          type: 'MOCK_GET_PRODUCTS',
          body: getMockResponses[url],
        })
      )
      store.clearActions()
    })

    it('should return 48 products with a search query and currentPage is 2', (done) => {
      const pathname = '/search/'
      const query = { q: 'red', currentPage: 2, pageSize: 24 }
      const secondDispatch = store
        .dispatch(actions.fetchCombinedProducts(pathname, query))
        .then(({ products }) => {
          secondDispatch.then(() => {
            expect(get).toHaveBeenCalledTimes(2)
            expect(get).toHaveBeenCalledWith(
              '/products?currentPage=1&q=red&pageSize=24'
            )
            expect(get).toHaveBeenCalledWith(
              '/products?currentPage=2&q=red&pageSize=24'
            )
            expect(products).toHaveLength(48)
            done()
          })
        })
    })

    it('should return 48 products with a category selected and currentPage is 2', (done) => {
      const pathname = '/en/tsuk/category/clothing-427/dresses-442'
      const query = {
        currentPage: '2',
        q: undefined,
        category: '203984,208523',
      }
      const secondDispatch = store
        .dispatch(actions.fetchCombinedProducts(pathname, query))
        .then(({ products }) => {
          secondDispatch.then(() => {
            expect(get).toHaveBeenCalledTimes(2)
            expect(get).toHaveBeenCalledWith(
              '/products?currentPage=1&pageSize=24&category=203984,208523'
            )
            expect(get).toHaveBeenCalledWith(
              '/products?currentPage=2&pageSize=24&category=203984,208523'
            )
            expect(products).toHaveLength(48)
            done()
          })
        })
    })

    it('should return max limit of 72 products (3 pages). If currentPage is greater than 3', (done) => {
      process.browser = false
      const pathname = '/search/'
      const query = { q: 'blue', currentPage: 10, pageSize: 24 }
      const secondDispatch = store
        .dispatch(actions.fetchCombinedProducts(pathname, query))
        .then(({ products }) => {
          expect(products.length).toEqual(72)
          secondDispatch.then(() => {
            expect(get).toHaveBeenCalledTimes(3)
            expect(get).toHaveBeenCalledWith(
              '/products?currentPage=1&q=blue&pageSize=24'
            )
            expect(get).toHaveBeenCalledWith(
              '/products?currentPage=2&q=blue&pageSize=24'
            )
            expect(get).toHaveBeenCalledWith(
              '/products?currentPage=3&q=blue&pageSize=24'
            )
            done()
          })
        })
    })
  })

  describe('getServerProducts', () => {
    const findAction = (store, type) => {
      return store.getActions().find((action) => action.type === type)
    }

    it('return false if the filter pathname', () => {
      mockGetProductsResponse({})
      const store = getMockStoreWithInitialReduxState({})
      const replace = true
      const result = store.dispatch(
        actions.getServerProducts({ search: '', pathname: '/filter' }, replace)
      )
      expect(result).toBe(false)
      expect(store.getActions().length).toBe(0)
    })

    it('return false if the search pathname', () => {
      mockGetProductsResponse({})
      const store = getMockStoreWithInitialReduxState({})
      const result = store.dispatch(
        actions.getServerProducts({ search: '', pathname: '/search' }, false)
      )
      expect(result).toBe(false)
      expect(store.getActions().length).toBe(0)
    })

    it('does not dispatch redirect when permanent redirect URL is not present', () => {
      mockGetProductsResponse({})
      const store = getMockStoreWithInitialReduxState({})
      return store
        .dispatch(actions.getServerProducts({ search: '', pathname: '/path' }))
        .then(() => {
          expect(findAction(store, 'URL_REDIRECT_SERVER')).toBeUndefined()
          expect(findAction(store, 'SET_ERROR')).toBeUndefined()
        })
    })

    it('does dispatch redirect when permanent redirect URL is present', () => {
      const store = getMockStoreWithInitialReduxState({})
      const pathname = '/canonical-path-name'
      const permanentRedirectUrl = `http://some-host.com${pathname}`
      mockGetProductsResponse({ permanentRedirectUrl })

      return store
        .dispatch(
          actions.getServerProducts({ search: '', pathname: '/something-else' })
        )
        .then(() => {
          const redirectToUrlAction = findAction(store, 'URL_REDIRECT_SERVER')
          expect(redirectToUrlAction.redirect).toEqual({
            url: pathname,
            permanent: true,
          })
          expect(findAction(store, 'SET_ERROR')).toBeUndefined()
        })
    })

    it('will get products when seoUrl is a category filter link with sorting', () => {
      const products = {
        products: [1, 2, 3],
        refinements: [1, 2, 3],
      }

      mockGetProductsResponse({ products })
      const store = getMockStoreWithInitialReduxState({})
      const pathname =
        '/en/tsuk/category/clothing-427/dresses-442/black/N-85cZdeoZdgl'
      const search = '?Nrpp=24&Ns=promoPrice%7C1&currentPage=2&siteId=%2F12556'

      return store
        .dispatch(actions.getServerProducts({ search, pathname }))
        .then(() => {
          store.getActions().forEach((action) => {
            if (action.type === 'SET_PRODUCTS') {
              expect(action.body.products).toEqual(products)
            }
          })
        })
    })

    it('returns 404 if products is an empty array', async () => {
      const products = []

      mockGetProductsResponse({ products })
      const store = getMockStoreWithInitialReduxState({})
      const pathname =
        '/en/tsuk/category/clothing-427/dresses-442/black/N-85cZdeoZdgl'
      const search = '?Nrpp=24&Ns=promoPrice%7C1&currentPage=2&siteId=%2F12556'

      await store.dispatch(actions.getServerProducts({ search, pathname }))

      const expectedAction = [{ type: 'SET_PAGE_STATUS_CODE', statusCode: 404 }]

      expect(store.getActions()).toEqual(expect.arrayContaining(expectedAction))
    })

    it('will get products when seoUrl is a category link with more than one page', () => {
      const products = {
        products: [1, 2, 3],
        refinements: [1, 2, 3],
      }

      mockGetProductsResponse({ products })
      const store = getMockStoreWithInitialReduxState({})
      const pathname = '/search/'
      const search = '?currentPage=3&q=blue'

      return store
        .dispatch(actions.getServerProducts({ search, pathname }, true))
        .then(() => {
          const SET_INFINITY_PAGE = store
            .getActions()
            .filter(({ type }) => type === 'SET_INFINITY_PAGE')
          expect(SET_INFINITY_PAGE.length).toEqual(3)

          const SET_PRODUCTS = store
            .getActions()
            .find(({ type }) => type === 'SET_PRODUCTS')
          expect(SET_PRODUCTS.body.products.length).toEqual(4)
        })
    })

    describe('when trying to set up content for category banner', () => {
      const body = {
        products: [1, 2, 3],
      }

      const pathname = ''
      const search = ''

      describe('the viewport is mobile and category banner is provided', () => {
        const newBody = {
          ...body,
          categoryBanner: {
            cmsMobileContent: {
              responsiveCMSUrl: '/categoryBannerUrl.json',
            },
          },
        }
        it('will set up category banner content', () => {
          mockGetProductsResponse(newBody)
          const store = getMockStoreWithInitialReduxState({
            viewport: { media: 'desktop' },
          })
          expect(getContent).not.toHaveBeenCalled()

          return store
            .dispatch(actions.getServerProducts({ pathname, search }))
            .then(() => {
              expect(getContent).toHaveBeenCalledWith(
                {
                  pathname:
                    newBody.categoryBanner.cmsMobileContent.responsiveCMSUrl,
                },
                'catHeader'
              )
            })
        })
      })

      describe('the categorybanner is not provided', () => {
        const newerBody = {
          ...body,
          categoryBanner: {},
        }

        it('will not set up category banner content', () => {
          mockGetProductsResponse(newerBody)
          const store = getMockStoreWithInitialReduxState({})
          return store
            .dispatch(actions.getServerProducts({ pathname, search }))
            .then(() => {
              expect(getContent).not.toHaveBeenCalled()
            })
        })
      })
    })

    it('error response returns to 404 response and not found content', async () => {
      mockGetProductsResponse(Promise.reject({}))
      const store = configureStore()

      await store.dispatch(
        actions.getServerProducts(
          { pathname: '/en/tsuk/category/undefined' },
          true
        )
      )

      expect(getPageStatusCode(store.getState())).toBe(404)
      expect(store.getState().products.isLoadingAll).toBe(false)
      expect(getContent).toHaveBeenCalledWith({}, 'error404')
    })

    it('returns null response in case of no products for category URL', async () => {
      mockGetProductsResponse({})
      const store = configureStore()
      const pathname = '/search/'

      await store.dispatch(
        actions.getServerProducts({ search: false, pathname }, true)
      )

      expect(getPageStatusCode(store.getState())).toBe(null)
      expect(store.getState().products.isLoadingAll).toBe(false)
    })
  })

  describe('isRefinementOptionSelected', () => {
    const refinements = [
      {
        label: 'Colour',
        refinementOptions: [
          {
            type: 'VALUE',
            label: 'black',
            value: 'black',
            count: 82,
            seoUrl: '/en/tsuk/category/clothing-427/dresses-442/N-85cZdeoZdgl',
          },
        ],
      },
    ]
    const mobile = { media: 'mobile' }
    const desktop = { media: 'desktop' }
    const sortOptions = [
      {
        label: 'Best Match',
        value: 'Relevance',
        navigationState:
          'filter/N-qn9Zdgl?Nrpp=24&Ntt=blue&seo=false&siteId=%2F12556',
      },
      {
        label: 'Newest',
        value: 'Newness',
        navigationState: '/en/tsuk/category/someFake?Ns=somesort',
      },
      {
        label: 'Price - Low To High',
        value: 'Price Ascending',
        navigationState: '/en/tsuk/category/someFake?Ns=anothersort',
      },
      {
        label: 'Price - High To Low',
        value: 'Price Descending',
        navigationState: '/en/tsuk/category/someFake',
      },
    ]

    describe('desktop route', () => {
      it('should return true if pathname is found in refinements', () => {
        const pathname =
          '/en/tsuk/category/clothing-427/dresses-442/N-85cZdeoZdgl'
        expect(
          actions.isRefinementOptionSelected(
            refinements,
            pathname,
            desktop,
            undefined
          )
        ).toBeTruthy()
      })
      it('should return false if pathname is not found in refinements', () => {
        const pathname = ''
        expect(
          actions.isRefinementOptionSelected(
            refinements,
            pathname,
            desktop,
            undefined
          )
        ).toBeFalsy()
      })
      it('should return false if pathname is not a search filter url', () => {
        const pathname = ''
        expect(
          actions.isRefinementOptionSelected([], pathname, desktop, undefined)
        ).toBeFalsy()
      })
      it('should return true if pathname is a search filter url', () => {
        const pathname =
          'filter/N-qn9Zdgl?Nrpp=24&Ntt=blue&seo=false&siteId=%2F12556'
        expect(
          actions.isRefinementOptionSelected([], pathname, desktop, undefined)
        ).toBeTruthy()
      })
      it('should return true if is a filter sortOptions pathname', () => {
        const pathname =
          'filter/N-qn9Zdgl?Nrpp=24&Ntt=blue&seo=false&siteId=%2F12556'
        expect(
          actions.isRefinementOptionSelected(
            refinements,
            pathname,
            desktop,
            sortOptions
          )
        ).toBeTruthy()
      })
      it('should return true if search filter pathname has a product start index param "&No=48"', () => {
        const pathname =
          'filter/N-qn9Zdgl?Nrpp=24&Ntt=blue&seo=false&siteId=%2F12556&Ns=sortString&No=48'
        expect(
          actions.isRefinementOptionSelected(
            refinements,
            pathname,
            desktop,
            sortOptions
          )
        ).toBeTruthy()
      })
    })

    describe('mobile route', () => {
      it('should return false if pathname is not found in refinements', () => {
        const pathname = ''
        expect(
          actions.isRefinementOptionSelected(
            refinements,
            pathname,
            mobile,
            undefined
          )
        ).toBeFalsy()
      })
      it('should return false if pathname is not a search filter url', () => {
        const pathname = ''
        expect(
          actions.isRefinementOptionSelected([], pathname, mobile, undefined)
        ).toBeFalsy()
      })
      it('should return true if pathname is a search filter url', () => {
        const pathname =
          'filter/N-qn9Zdgl?Nrpp=24&Ntt=blue&seo=false&siteId=%2F12556'
        expect(
          actions.isRefinementOptionSelected([], pathname, mobile, undefined)
        ).toBeTruthy()
      })
      it('should return true if is a filter sortOptions pathname', () => {
        const pathname =
          'filter/N-qn9Zdgl?Nrpp=24&Ntt=blue&seo=false&siteId=%2F12556&Ns=sortString'
        expect(
          actions.isRefinementOptionSelected(
            refinements,
            pathname,
            mobile,
            sortOptions
          )
        ).toBeTruthy()
      })
      it('should return true if search filter pathname has a product start index param "&No=48"', () => {
        const pathname =
          'filter/N-qn9Zdgl?Nrpp=24&Ntt=blue&seo=false&siteId=%2F12556&Ns=sortString&No=48'
        expect(
          actions.isRefinementOptionSelected(
            refinements,
            pathname,
            mobile,
            sortOptions
          )
        ).toBeTruthy()
      })
      it('should return true if is PriceFilter selected/active', () => {
        const pathname =
          '/en/tsuk/category/clothing-427/jeans-446/N-877Zdgl?Nrpp=24&siteId=%2F12556&Nf=nowPrice%7CBTWN%2B29%2B60'
        expect(
          actions.isRefinementOptionSelected(
            refinements,
            pathname,
            desktop,
            sortOptions
          )
        ).toBeTruthy()
      })
    })
  })

  describe('fetchProductsBy', () => {
    const store = getMockStoreWithInitialReduxState({})

    const getMockResponses = {
      '/products/seo?seoUrl=/en/tsuk/category/clothing-427/dresses-442/N-85cZdeoZdgl': {
        products: [],
        refinements: [],
        breadcrumbs: [],
      },
      '/products/filter?seoUrl=%2Fen%2Ftsuk%2Fcategory%2Fclothing-427%2Fdresses-442%2Fblack%2FN-85cZdeoZdgl%3FNrpp%3D24%26siteId%3D%252F12556%26pageSize%3D24': {
        products: [],
        refinements: [],
        breadcrumbs: [],
      },
    }

    beforeEach(() => {
      get.mockImplementation((url) => () =>
        Promise.resolve({
          type: 'MOCK_GET_PRODUCTS',
          body: getMockResponses[url],
        })
      )
      store.clearActions()
    })

    const refinements = [
      {
        label: 'Colour',
        refinementOptions: [
          {
            type: 'VALUE',
            label: 'black',
            value: 'black',
            count: 82,
            seoUrl:
              '/en/tsuk/category/clothing-427/dresses-442/black/N-85cZdeoZdgl?Nrpp=24&siteId=%2F12556',
          },
        ],
      },
    ]

    it('should call the category coreAPI', (done) => {
      const pathname = '/en/tsuk/category/clothing-427/dresses-442'
      const secondDispatch = store
        .dispatch(actions.fetchProductsBy(refinements, pathname, undefined))
        .then(() => {
          secondDispatch.then(() => {
            expect(get).toHaveBeenCalledTimes(1)
            expect(get).toHaveBeenCalledWith(
              '/products/seo?seoUrl=/en/tsuk/category/clothing-427/dresses-442&pageSize=24'
            )
            done()
          })
        })
    })

    it('should call the filter coreAPI', (done) => {
      process.browser = true
      const pathname =
        '/en/tsuk/category/clothing-427/dresses-442/black/N-85cZdeoZdgl?Nrpp=24&siteId=%2F12556'
      reviseNrppParam.mockReturnValue(pathname)
      navigationSelectors.getCategoryId.mockReturnValue('208523')
      const secondDispatch = store
        .dispatch(actions.fetchProductsBy(refinements, pathname, undefined))
        .then(() => {
          secondDispatch.then(() => {
            navigationSelectors.getCategoryId.mockReturnValueOnce('208523')
            expect(get).toHaveBeenCalledTimes(1)
            expect(get).toHaveBeenCalledWith(
              '/products/filter?seoUrl=%2Fen%2Ftsuk%2Fcategory%2Fclothing-427%2Fdresses-442%2Fblack%2FN-85cZdeoZdgl%3FNrpp%3D24%26siteId%3D%252F12556%26pageSize%3D24%26categoryId%3D208523'
            )
            done()
          })
        })
    })

    it('should call the SEO coreAPI on SSR', (done) => {
      process.browser = false
      const pathname =
        '/en/tsuk/category/clothing-427/dresses-442/black/N-85cZdeoZdgl?Nrpp=24&siteId=%2F12556'
      reviseNrppParam.mockReturnValue(pathname)
      navigationSelectors.getCategoryId.mockReturnValue('208523')
      const secondDispatch = store
        .dispatch(actions.fetchProductsBy(refinements, pathname, undefined))
        .then(() => {
          secondDispatch.then(() => {
            navigationSelectors.getCategoryId.mockReturnValueOnce('208523')
            expect(get).toHaveBeenCalledTimes(1)
            expect(get).toHaveBeenCalledWith(
              '/products/seo?seoUrl=/en/tsuk/category/clothing-427/dresses-442/black/N-85cZdeoZdgl?Nrpp=24&siteId=%2F12556&pageSize=24'
            )
            done()
          })
        })
    })

    describe('pathname is not a valid ecmc category and it is not the search page', () => {
      it('should not call CoreApi', (done) => {
        const pathname =
          '/en/tsuk/category/multi/one-size/N-dewZdfvZdgl?Nrpp=24&siteId=/12556'
        const store = getMockStoreWithInitialReduxState({
          routing: {
            location: {
              pathname,
              query: '',
            },
          },
          products: {
            refinements: [],
          },
        })
        isValidEcmcCategory.mockReturnValueOnce(false)

        const query = {}
        store
          .dispatch(actions.fetchProducts(pathname, query, ''))
          .catch((error) => {
            expect(error).toEqual({
              error: 'URL Validation Error',
              message: 'The ECMC category is not valid',
              status: 410,
            })
            done()
          })
      })
    })

    describe('pathname does not contain a valid ecmc category and pathname is filter', () => {
      it('should call filter CoreApi from the client ', (done) => {
        process.browser = true
        const pathname =
          '/filter/N-qn9Zdgl?Nrpp=24&Ntt=blue&seo=false&siteId=%2F12556'
        reviseNrppParam.mockReturnValue(pathname)
        navigationSelectors.getCategoryId.mockReturnValue('208523')
        const secondDispatch = store
          .dispatch(actions.fetchProductsBy(refinements, pathname, undefined))
          .then(() => {
            secondDispatch.then(() => {
              navigationSelectors.getCategoryId.mockReturnValueOnce('208523')
              expect(get).toHaveBeenCalledTimes(1)
              expect(get).toHaveBeenCalledWith(
                '/products/filter?seoUrl=%2Ffilter%2FN-qn9Zdgl%3FNrpp%3D24%26Ntt%3Dblue%26seo%3Dfalse%26siteId%3D%252F12556%26pageSize%3D24%26categoryId%3D208523'
              )
              done()
            })
          })
      })

      it('should call seo CoreApi from on SSR', (done) => {
        process.browser = false
        const pathname =
          '/filter/N-qn9Zdgl?Nrpp=24&Ntt=blue&seo=false&siteId=%2F12556'
        reviseNrppParam.mockReturnValue(pathname)
        navigationSelectors.getCategoryId.mockReturnValue('208523')
        const secondDispatch = store
          .dispatch(actions.fetchProductsBy(refinements, pathname, undefined))
          .then(() => {
            secondDispatch.then(() => {
              navigationSelectors.getCategoryId.mockReturnValueOnce('208523')
              expect(get).toHaveBeenCalledTimes(1)
              expect(get).toHaveBeenCalledWith(
                '/products/seo?seoUrl=/filter/N-qn9Zdgl?Nrpp=24&Ntt=blue&seo=false&siteId=%2F12556&pageSize=24'
              )
              done()
            })
          })
      })
    })

    describe('pathname does contain a seoUrl', () => {
      it('should call CoreApi', (done) => {
        process.browser = true
        const pathname =
          '/N-dymZdeoZdosZdgl?Nrpp=24&Ntt=shirts&seo=false&siteId=%2F12556'
        reviseNrppParam.mockReturnValue(pathname)
        navigationSelectors.getCategoryId.mockReturnValue('208523')
        const secondDispatch = store
          .dispatch(
            actions.fetchProductsBy(refinements, pathname, { media: 'mobile' })
          )
          .then(() => {
            secondDispatch.then(() => {
              navigationSelectors.getCategoryId.mockReturnValueOnce('208523')
              expect(get).toHaveBeenCalledTimes(1)
              expect(get).toHaveBeenCalledWith(
                '/products/filter?seoUrl=%2FN-dymZdeoZdosZdgl%3FNrpp%3D24%26Ntt%3Dshirts%26seo%3Dfalse%26siteId%3D%252F12556%26pageSize%3D24%26categoryId%3D208523'
              )
              done()
            })
          })
      })
    })
  })

  describe('fetchProducts', () => {
    const getMockResponses = {
      '/products/seo?seoUrl=/en/tsuk/category/clothing-427/dresses-442&pageSize=24': {
        canonicalUrl: 'www.topman.com.arcadiagroup.co.uk/Jeans/_/N-2bswZ1xjf',
        refinements: [
          {
            label: 'Colour',
            refinementOptions: [
              {
                type: 'VALUE',
                label: 'black',
                value: 'black',
                count: 82,
                seoUrl:
                  '/en/tsuk/category/clothing-427/dresses-442/N-85cZdeoZdgl',
              },
            ],
          },
        ],
        breadcrumbs: [
          {
            label: 'Home',
            url: '/',
          },
          {
            label: 'Clothing',
            category: '203984',
            url:
              '/en/tsuk/category/clothing-427/_/N-82zZdgl?Nrpp=24&siteId=%2F12556',
          },
          {
            label: 'Dresses',
            category: '203984,208523',
          },
        ],
      },
      '/products/seo?seoUrl=/products&pageSize=24': {
        canonicalUrl: 'www.topman.com.arcadiagroup.co.uk/Jeans/_/N-2bswZ1xjf',
        refinements: [],
        breadcrumbs: [
          {
            category: 'AAAAA',
          },
        ],
      },
      '/products/filter?seoUrl=%2Fen%2Ftsuk%2Fcategory%2Fclothing-427%2Fdresses-442%2Fblack%2FN-85cZdeoZdgl%26pageSize%3D24%26categoryId%3D208523': {
        canonicalUrl:
          'http://www.topshop.com/en/tsuk/category/clothing-427/dresses-442/black/N-85cZdeoZdgl',
        refinements: [
          {
            label: 'Colour',
            refinementOptions: [
              {
                type: 'VALUE',
                label: 'black',
                value: 'black',
                count: 82,
                seoUrl:
                  '/en/tsuk/category/clothing-427/dresses-442/N-85cZdeoZdgl',
              },
            ],
          },
        ],
      },
      '/products/seo?seoUrl=/en/bruk/category/clothing-281559/mens-clothing-view-all-1865858/shirts/sweatshirts/pattern/stripe/plain/5xl/2xl/brown/N-8a3Za5bZa5gZa2fZa2iZa2gZ1yoxZ1ybnZ7suZ7w1&pageSize=24': {
        refinements: [
          {
            label: 'valid refinement',
            refinementOptions: [
              {
                type: 'VALUE',
                label: 'plain',
                value: 'plain',
                count: 0,
                seoUrl: '/...',
              },
            ],
          },
          {},
        ],
      },
    }
    const initialState = {
      refinements: {
        selectedOptions: {
          price: [10, 40],
          size: [4, 6, 8],
        },
      },
      sorting: {
        currentSortOption: 'BBBB',
      },
      products: {
        refinements: [],
      },
      viewport: {
        media: 'desktop',
      },
    }

    beforeEach(() => {
      get.mockImplementation((url) => () =>
        Promise.resolve({
          type: 'MOCK_GET',
          body: getMockResponses[url],
        })
      )
    })
    it('should handle request with category on desktop', (done) => {
      const store = getMockStoreWithInitialReduxState(initialState)
      const pathname = '/en/tsuk/category/clothing-427/dresses-442'
      const query = {}
      const secondDispatch = store
        .dispatch(actions.fetchProducts(pathname, query))
        .then(() => {
          secondDispatch.then(() => {
            expect(get).toHaveBeenCalledTimes(1)
            expect(get).toHaveBeenCalledWith(
              '/products/seo?seoUrl=/en/tsuk/category/clothing-427/dresses-442&pageSize=24'
            )
            done()
          })
        })
    })
    it('should handle request with q', (done) => {
      const store = getMockStoreWithInitialReduxState(initialState)
      const pathname = '/products'
      const query = { q: 'shoes', currentPage: 3, pageSize: 24 }
      const secondDispatch = store
        .dispatch(actions.fetchProducts(pathname, query))
        .then(() => {
          secondDispatch.then(() => {
            expect(get).toHaveBeenCalledTimes(1)
            expect(get).toHaveBeenCalledWith(
              '/products?currentPage=3&q=shoes&pageSize=24&sort=BBBB'
            )
            done()
          })
        })
    })

    describe('when FEATURE_ENDECA_AB_TEST is enabled and action is run on client', () => {
      const originalProcessBrowser = global.process.browser
      beforeEach(() => {
        global.process.browser = true
      })
      afterEach(() => {
        global.process.browser = originalProcessBrowser
      })

      describe('if the user has the qubitSearchABTestKey cookie set', () => {
        beforeEach(() => {
          getItem.mockReset()
        })

        it('should append the search term with special characters', (done) => {
          getItem.mockReturnValue('test')
          const store = getMockStoreWithInitialReduxState({
            features: {
              status: {
                FEATURE_ENDECA_AB_TEST: true,
              },
            },
          })
          const pathname = '/products'
          const query = { q: 'shoes', currentPage: 3, pageSize: 24 }
          const secondDispatch = store
            .dispatch(actions.fetchProducts(pathname, query))
            .then(() => {
              secondDispatch.then(() => {
                expect(get).toHaveBeenCalledTimes(1)
                expect(get).toHaveBeenCalledWith(
                  '/products?currentPage=3&q=shoes%7C%7C%7Ctest&pageSize=24'
                )
                done()
              })
            })
        })
      })

      describe('if the user does not have the qubitSearchABTestKey cookie set', () => {
        it('should not append anything to the search term', (done) => {
          getItem.mockReturnValue(undefined)
          const store = getMockStoreWithInitialReduxState({
            features: {
              status: {
                FEATURE_ENDECA_AB_TEST: true,
              },
            },
          })
          const pathname = '/products'
          const query = { q: 'shoes', currentPage: 3, pageSize: 24 }
          const secondDispatch = store
            .dispatch(actions.fetchProducts(pathname, query))
            .then(() => {
              secondDispatch.then(() => {
                expect(get).toHaveBeenCalledTimes(1)
                expect(get).toHaveBeenCalledWith(
                  '/products?currentPage=3&q=shoes&pageSize=24'
                )
                done()
              })
            })
        })
      })
    })

    it('should handle request with category on mobile', (done) => {
      const store = getMockStoreWithInitialReduxState({
        ...initialState,
        viewport: {
          media: 'mobile',
        },
      })
      const pathname = '/en/tsuk/category/clothing-427/dresses-442'
      const query = {}
      const secondDispatch = store
        .dispatch(actions.fetchProducts(pathname, query))
        .then(() => {
          secondDispatch.then(() => {
            expect(get).toHaveBeenCalledTimes(1)
            expect(get).toHaveBeenCalledWith(
              '/products/seo?seoUrl=/en/tsuk/category/clothing-427/dresses-442&pageSize=24'
            )
            done()
          })
        })
    })
    it('should be called a second time with products endpoint if query has pagination parameter', (done) => {
      const store = getMockStoreWithInitialReduxState(initialState)
      const pathname = '/en/tsuk/category/clothing-427/dresses-442'
      getCategoryFromBreadcrumbs.mockImplementationOnce(() => '203984,208523')
      const query = {
        pagination: '1',
        currentPage: '2',
      }

      /* NOTE:
       * To get the correct page of products (pagination) two calls are required. The first call to
       * fetchProductsBySeo() does not support pagination. This call is required to get
       * breadcrumbs data which is required for the second call to fetchProductsByQuery().
       * */

      const expected = {
        ToHaveBeenCalledTimes: 2,
        // fetchProductsBySeo()
        ToBeCalledWithUrl:
          '/products/seo?seoUrl=/en/tsuk/category/clothing-427/dresses-442&pageSize=24',
        // fetchProductsByQuery()
        ToHaveBeenLastCalledWith:
          '/products?currentPage=2&sort=BBBB&category=203984,208523',
      }

      const secondDispatch = store
        .dispatch(actions.fetchProducts(pathname, query))
        .then(() => {
          secondDispatch.then(() => {
            expect(get).toHaveBeenCalledTimes(expected.ToHaveBeenCalledTimes)
            expect(get).toHaveBeenCalledWith(expected.ToBeCalledWithUrl)
            expect(get).toHaveBeenLastCalledWith(
              expected.ToHaveBeenLastCalledWith
            )
            done()
          })
        })
    })

    it('should remove invalid refinements', async () => {
      const store = getMockStoreWithInitialReduxState(initialState)
      const pathname =
        '/en/bruk/category/clothing-281559/mens-clothing-view-all-1865858/shirts/sweatshirts/pattern/stripe/plain/5xl/2xl/brown/N-8a3Za5bZa5gZa2fZa2iZa2gZ1yoxZ1ybnZ7suZ7w1'

      const { body } = await store.dispatch(actions.fetchProducts(pathname, {}))

      expect(body.refinements).toEqual([
        {
          label: 'valid refinement',
          refinementOptions: [
            {
              type: 'VALUE',
              label: 'plain',
              value: 'plain',
              count: 0,
              seoUrl: '/...',
            },
          ],
        },
      ])
    })

    describe('fetchProductsByFilter', () => {
      const store = getMockStoreWithInitialReduxState({
        ...initialState,
        products: {
          refinements: [
            {
              label: 'Colour',
              refinementOptions: [
                {
                  type: 'VALUE',
                  label: 'black',
                  value: 'black',
                  count: 82,
                  seoUrl:
                    '/en/tsuk/category/clothing-427/dresses-442/black/N-85cZdeoZdgl',
                },
              ],
            },
          ],
        },
      })

      beforeEach(() => {
        get.mockImplementation((url) => () => {
          return Promise.resolve({
            type: 'MOCK_GET',
            body: getMockResponses[url],
          })
        })
        store.clearActions()
      })

      it('should call fetchProductsByFilter if a refinement option has been selected', (done) => {
        process.browser = true
        const pathname =
          '/en/tsuk/category/clothing-427/dresses-442/black/N-85cZdeoZdgl'
        reviseNrppParam.mockReturnValueOnce(pathname)
        navigationSelectors.getCategoryId.mockReturnValue('20583')
        const query = {}
        const secondDispatch = store
          .dispatch(actions.fetchProducts(pathname, query, ''))
          .then(() => {
            secondDispatch.then(() => {
              expect(get).toHaveBeenCalledTimes(1)
              expect(get).toHaveBeenCalledWith(
                '/products/filter?seoUrl=%2Fen%2Ftsuk%2Fcategory%2Fclothing-427%2Fdresses-442%2Fblack%2FN-85cZdeoZdgl%26pageSize%3D24%26categoryId%3D208523'
              )
              expect(store.getActions()).toEqual([
                {
                  type: 'SET_SEO_REFINEMENTS',
                  activeRefinements: [],
                  refinements: [
                    {
                      label: 'Colour',
                      refinementOptions: [
                        {
                          type: 'VALUE',
                          label: 'black',
                          value: 'black',
                          count: 82,
                          seoUrl:
                            '/en/tsuk/category/clothing-427/dresses-442/N-85cZdeoZdgl',
                        },
                      ],
                    },
                  ],
                },
              ])
              done()
            })
          })
      })
    })

    describe('fetchProductsBySeo', () => {
      const store = getMockStoreWithInitialReduxState(initialState)
      const expectedUrl = '/products/seo?seoUrl=/products&pageSize=24'
      beforeEach(() => {
        store.clearActions()
      })
      it('should set seo refinements from body', (done) => {
        const pathname = '/products'
        const query = {}
        const secondDispatch = store
          .dispatch(actions.fetchProducts(pathname, query))
          .then(() => {
            secondDispatch.then(() => {
              expect(get).toHaveBeenCalledTimes(1)
              expect(get).toHaveBeenCalledWith(expectedUrl)
              expect(store.getActions()).toEqual([
                {
                  type: 'SET_SEO_REFINEMENTS',
                  refinements: [],
                  activeRefinements: [],
                },
              ])
              done()
            })
          })
      })

      it('should call fetchProducts if with have refinementsQuery', (done) => {
        const pathname = '/products'
        const query = { refinements: 'AAAA' }
        const secondDispatch = store
          .dispatch(actions.fetchProducts(pathname, query))
          .then(() => {
            secondDispatch.then(() => {
              expect(get).toHaveBeenCalledTimes(1)
              expect(get).toHaveBeenCalledWith(expectedUrl)
              expect(store.getActions()).toEqual([
                {
                  type: 'SET_SEO_REFINEMENTS',
                  refinements: [],
                  activeRefinements: [],
                },
              ])
              done()
            })
          })
      })

      it('should call fetchProducts if currentPage > 1', (done) => {
        const pathname = '/products'
        const query = { currentPage: 3 }
        const secondDispatch = store
          .dispatch(actions.fetchProducts(pathname, query))
          .then(() => {
            secondDispatch.then(() => {
              expect(get).toHaveBeenCalledTimes(1)
              expect(get).toHaveBeenCalledWith(expectedUrl)
              expect(store.getActions()).toEqual([
                {
                  type: 'SET_SEO_REFINEMENTS',
                  refinements: [],
                  activeRefinements: [],
                },
              ])
              done()
            })
          })
      })

      it('should call fetchProducts if sorted', (done) => {
        const pathname = '/products'
        const query = { sort: 'true' }
        const secondDispatch = store
          .dispatch(actions.fetchProducts(pathname, query))
          .then(() => {
            secondDispatch.then(() => {
              expect(get).toHaveBeenCalledTimes(1)
              expect(get).toHaveBeenCalledWith(expectedUrl)
              expect(store.getActions()).toEqual([
                {
                  type: 'SET_SEO_REFINEMENTS',
                  refinements: [],
                  activeRefinements: [],
                },
              ])
              done()
            })
          })
      })
    })
  })

  describe('updateProductsRefinements', () => {
    const seoUrl =
      '/en/tsuk/category/shoes-430/shop-all-shoes-6909322/black/blue/N-8gyZdeoZdepZdgl'
    const searchUrl = '/search/?q=red'
    const products = [
      { productId: 100001 },
      { productId: 100008 },
      { productId: 100002 },
    ]
    const newProducts = [
      { productId: 100010 },
      { productId: 100007 },
      { productId: 100000 },
      { productId: 100100 },
    ]
    const refinements = [
      {
        label: 'Colour',
        refinementOptions: [{ value: 'black' }, { value: 'red' }],
      },
      {
        label: 'Size',
        refinementOptions: [{ value: 1 }, { value: 2 }],
      },
    ]
    const newRefinements = [
      {
        label: 'Class',
        refinementOptions: [{ value: 'Constitution' }, { value: 'Galaxy' }],
      },
      {
        label: 'Registry',
        refinementOptions: [{ value: 1701 }, { value: 182 }],
      },
    ]

    it('should dispatch action to set products with same products but new refinements', (done) => {
      const store = getMockStoreWithInitialReduxState({
        products: {
          products,
          refinements,
          totalProducts: 4,
        },
      })
      get.mockImplementationOnce(() => () =>
        Promise.resolve({
          type: 'MOCK_PRODUCTS',
          body: {
            products: newProducts,
            refinements: newRefinements,
            sortOptions: store.getState().products.sortOptions,
            totalProducts: 4,
          },
        })
      )
      const secondDispatch = store
        .dispatch(actions.updateProductsRefinements(seoUrl))
        .then(() => {
          secondDispatch.then(() => {
            const expectedActions = [
              {
                type: 'SET_PRODUCTS',
                body: {
                  ...store.getState().products,
                  products,
                  refinements: newRefinements,
                },
              },
            ]
            expect(store.getActions()).toEqual(
              expect.arrayContaining(expectedActions)
            )
            done()
          })
        })
    })

    it('should dispatch fetchProducts with seoUrl and query object if search url is provided', (done) => {
      const store = getMockStoreWithInitialReduxState({
        products: {
          products,
          refinements,
        },
      })
      get.mockImplementationOnce(() => () =>
        Promise.resolve({
          type: 'MOCK_PRODUCTS',
          body: {
            products: newProducts,
            refinements: newRefinements,
            sortOptions: store.getState().products.sortOptions,
            totalProducts: 4,
          },
        })
      )
      const secondDispatch = store
        .dispatch(actions.updateProductsRefinements(searchUrl))
        .then(() => {
          secondDispatch.then(() => {
            const expectedActions = [
              {
                type: 'SET_PRODUCTS',
                body: {
                  ...store.getState().products,
                  products,
                  refinements: newRefinements,
                  totalProducts: 4,
                },
              },
            ]
            expect(store.getActions()).toEqual(
              expect.arrayContaining(expectedActions)
            )
            done()
          })
        })
    })

    it('Should set `isLoading` to false in case of error', (done) => {
      const store = getMockStoreWithInitialReduxState({
        products: {
          products,
          refinements,
        },
      })
      const message = 'nuh uhhhhh'
      const errorResponse = {
        response: {
          body: {
            message,
          },
        },
      }
      get.mockImplementationOnce(() => () => Promise.reject(errorResponse))
      const secondDispatch = store
        .dispatch(actions.updateProductsRefinements(searchUrl))
        .then(() => {
          secondDispatch.then(() => {
            const expectedActions = [
              {
                type: 'LOADING_REFINEMENTS',
                isLoading: false,
              },
              {
                type: 'SET_ERROR',
                error: { message, isOverlay: true },
              },
            ]
            expect(store.getActions()).toEqual(
              expect.arrayContaining(expectedActions)
            )
            done()
          })
        })
    })
  })
})
