jest.mock('../../../../client/lib/storage', () => ({
  loadRecentlyViewedState: jest.fn(() => []),
  saveRecentlyViewedState: jest.fn(),
}))

import testReducer from '../recentlyViewedReducer'
import {
  saveRecentlyViewedState,
  loadRecentlyViewedState,
} from '../../../../client/lib/storage'
import { extractRecentlyDataFromProduct } from '../../../actions/common/recentlyViewedActions'
import configureStore from '../../../lib/configure-store'
// TODO replace mockProduct with minim required for unit test
import mockProduct from '../../../../../test/mocks/product-detail'
import { getRouteFromUrl } from '../../../lib/get-product-route'

const amplienceUrl = 'amplience url'

mockProduct.amplienceAssets = { images: [amplienceUrl] }

const mockRecentProduct = {
  productId: mockProduct.productId,
  lineNumber: mockProduct.lineNumber,
  name: mockProduct.name,
  imageUrl: mockProduct.assets[1].url,
  amplienceUrl,
  unitPrice: mockProduct.unitPrice,
  iscmCategory: mockProduct.iscmCategory,
  url: getRouteFromUrl(mockProduct.canonicalUrl),
}

const multipleMockProducts = (max) =>
  new Array(max).fill().map((_, productId) => ({
    productId,
    lineNumber: 'Mock',
  }))

describe('recentlyViewed Reducer', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const fireActionAndGetState = (action, initialState = {}) => {
    const store = configureStore(initialState)
    store.dispatch(action)
    return store.getState().recentlyViewed
  }

  it('loads initial state from localStorage', () => {
    const store = configureStore()
    expect(store.getState().recentlyViewed).toEqual([])
    expect(loadRecentlyViewedState).toHaveBeenCalled()
  })

  it('when recentlyViewedProducts is an identical array to the state, state is returned thus not forcing a new render', () => {
    const originalState = [mockRecentProduct]
    const newState = fireActionAndGetState(
      extractRecentlyDataFromProduct(mockProduct),
      { recentlyViewed: originalState }
    )

    expect(newState).toBe(originalState)
  })

  it('adds a product to empty list', () => {
    const newState = fireActionAndGetState(
      extractRecentlyDataFromProduct(mockProduct),
      { recentlyViewed: [] }
    )

    expect(newState.length).toBe(1)
    expect(newState).toEqual([mockRecentProduct])
    expect(saveRecentlyViewedState.mock.calls.length).toBe(1)
  })

  it('should add exatly 10 items', () => {
    const mockProducts = multipleMockProducts(9)
    expect(mockProducts.length).toBe(9)

    const newState = fireActionAndGetState(
      extractRecentlyDataFromProduct(mockProduct),
      { recentlyViewed: mockProducts }
    )

    expect(newState.length).toBe(10)
    expect(newState).toEqual([mockRecentProduct, ...mockProducts])
  })

  it('should not add more than 10 items', () => {
    const mockProducts = multipleMockProducts(12)
    expect(mockProducts.length).toBe(12)

    const newState = fireActionAndGetState(
      extractRecentlyDataFromProduct(mockProduct),
      { recentlyViewed: mockProducts }
    )

    expect(newState.length).toBe(10)
    expect(newState).toEqual([mockRecentProduct, ...mockProducts.slice(0, 9)])
  })

  it('should not add an existing product', () => {
    const newState = fireActionAndGetState(
      extractRecentlyDataFromProduct(mockProduct),
      { recentlyViewed: [mockRecentProduct] }
    )

    expect(newState).toEqual([mockRecentProduct])
  })

  it('should replace existing products if shape has changed', () => {
    const oldShapeProduct = { productId: 123 }
    const newShapeProduct = {
      productId: 123,
      additionalProp: 'something extra',
    }
    const newState = fireActionAndGetState(
      {
        type: 'ADD_RECENTLY_VIEWED_PRODUCT',
        product: newShapeProduct,
      },
      { recentlyViewed: [oldShapeProduct] }
    )
    expect(newState).toEqual([newShapeProduct])
  })

  it('deletes a product from the list', () => {
    const newState = testReducer(
      [
        {
          productId: 2342342,
        },
      ],
      {
        type: 'DELETE_RECENTLY_VIEWED_PRODUCT',
        productId: 2342342,
      }
    )

    expect(newState).toEqual([])
  })
})
