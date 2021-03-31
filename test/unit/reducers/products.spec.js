import configureMockStore from '../lib/configure-mock-store'
import { browserHistory } from 'react-router'
import * as actions from '../../../src/shared/actions/common/productsActions'
import nock from 'nock'
import { isEmpty } from 'ramda'
import mockResponse from '../../mocks/seo-response'
import productsReducer from '../../../src/shared/reducers/common/productsReducer'
import assert from 'assert'

jest.spyOn(browserHistory, 'replace').mockImplementation(() => {})

const startingState = {
  routing: {
    location: {
      query: {
        currentPage: '/foo',
      },
    },
  },
  config: {
    brandCode: 'tsuk',
  },
}

test('getProducts using seo url', async () => {
  const store = configureMockStore(startingState)
  const seoUrl = {
    pathname: '/en/tsuk/category/clothing-427/dresses-442',
    search: '',
    query: {},
  }

  nock('http://localhost:3000')
    .get(/en/)
    .reply(200, mockResponse)

  await store.dispatch(actions.getProducts(seoUrl))

  const data = store.getState().products
  assert(Array.isArray(data.sortOptions))
  assert(data.products.length === 24)
  assert(data.refinements.length === 5)
  assert(data.totalProducts === 1061)
  assert(data.categoryTitle === 'Tops')
  assert(
    data.categoryDescription ===
      'Discover the latest range of tops at Topshop. From crop tops and camis to kimonos and hoodies. Order online for free collection at Topshop.'
  )
  assert(data.breadcrumbs.length === 3)
})

test('getProducts using search query action', async () => {
  const store = configureMockStore(startingState)
  const url = {
    pathname: '',
    search: '?q=shir',
    query: {
      q: 'shir',
    },
  }

  nock('http://localhost:3000')
    .get('/api/products?q=shir')
    .reply(200, mockResponse)

  await store.dispatch(actions.getProducts(url))

  const data = store.getState().products
  assert(Array.isArray(data.sortOptions))
  assert(data.products.length === 24)
})

test('fetchProducts with a category should returns an array of products', (done) => {
  const pathname = '/en/tsuk/category/clothing-427/dresses-442'
  const params = { category: 'myCategory', currentPage: 0, pageSize: 24 }
  const store = configureMockStore()

  nock('http://localhost:3000')
    .get('/api/products?pageSize=24&category=myCategory')
    .reply(200, mockResponse)

  store.dispatch(actions.fetchProducts(pathname, params)).then((resp) => {
    expect(resp.body.products.length).toBe(mockResponse.products.length)
    done()
  })
})

test('fetchProducts without category id and query', (done) => {
  const store = configureMockStore()
  const pathname = 'stubPath'
  const params = {
    category: undefined,
    q: undefined,
    currentPage: 0,
    pageSize: 24,
  }

  store.dispatch(actions.fetchProducts(pathname, params)).catch((error) => {
    expect(error).toEqual({
      error: 'URL Validation Error',
      message: 'The ECMC category is not valid',
      status: 410,
    })
    done()
  })
})

test('addToProducts should update products', async () => {
  const store = configureMockStore({
    ...startingState,
    infinityScroll: {
      currentPage: 1,
    },
  })
  const seoUrl = {
    pathname: '/en/tsuk/category/clothing-427/dresses-442',
    search: '',
    query: {},
  }

  nock('http://localhost:3000')
    .get(
      '/api/products/seo?seoUrl=/en/tsuk/category/clothing-427/dresses-442&pageSize=24'
    )
    .reply(200, mockResponse)

  nock('http://localhost:3000')
    .get('/api/products?currentPage=2&category=203984,208524')
    .reply(200, mockResponse)

  await store.dispatch(actions.getProducts(seoUrl)).then(() => {
    store.dispatch(actions.addToProducts())
  })

  const data = store.getState().products
  assert(Array.isArray(data.sortOptions))
  assert(data.products.length === 24)
})

test('updateProductsLocation with an invalid route', () => {
  const store = configureMockStore()
  const expectedLocation = { pathname: 'stubPath' }

  store.dispatch(actions.updateProductsLocation({}, expectedLocation))

  const location = store.getState().products.location
  expect(location).toEqual(expectedLocation)
})

test('updateProductsLocation with a valid route and empty query', () => {
  const store = configureMockStore()
  const expectedLocation = {
    pathname: 'stubPath',
  }

  store.dispatch(
    actions.updateProductsLocation(
      { refinements: undefined, canonicalUrl: 'myCanonicalUrl' },
      { pathname: expectedLocation.pathname }
    )
  )

  const location = store.getState().products.location
  expect(location).toEqual(expectedLocation)
})

test('updateProductsLocation with a valid route and a query', () => {
  const store = configureMockStore()
  const expectedLocation = {
    pathname: 'stubPathName',
    query: 'stubQuery',
  }

  store.dispatch(
    actions.updateProductsLocation(
      { refinements: undefined, canonicalUrl: 'myCanonicalUrl' },
      { pathname: expectedLocation.pathname, query: 'stubQuery' }
    )
  )

  const location = store.getState().products.location
  expect(location).toEqual(expectedLocation)
})

test('getServerProducts server side render infinity', async () => {
  const store = configureMockStore({
    config: {
      brandCode: 'tsuk',
    },
  })
  const url = {
    pathname: 'en/tsuk/category/clothing-427/tops-443/',
    search: '?category=203984%2C208524&currentPage=32',
  }

  for (let i = 0; i < 5; i += 1) {
    nock('http://localhost:3000')
      .get(`/api/products?currentPage=${i}&pageSize=24&category=203984,208524`)
      .reply(200, mockResponse)
  }

  await store.dispatch(actions.getServerProducts(url))

  store.subscribeUntilPasses(() => {
    const data = store.getState().products
    assert(Array.isArray(data.sortOptions))
    // Mock products only have 24 products, so 96 would mean it did 4 requests.
    // UPDATE :: We put a limit of 72 to avoid flood requests to WCS
    assert(data.products.length === 72)
  })
})

it('getServerProducts server side render with pagination', (done) => {
  const store = configureMockStore({
    config: {
      brandCode: 'tsuk',
    },
  })
  const url = {
    pathname: '/en/tsuk/category/clothing-427/tops-443/',
    search: '?currentPage=3&pagination=1',
  }

  nock('http://localhost:3000')
    .get(
      '/api/products/seo?seoUrl=/en/tsuk/category/clothing-427/tops-443/?currentPage=3&pagination=1&pageSize=24'
    )
    .reply(200, mockResponse)
  nock('http://localhost:3000')
    .get('/api/products?currentPage=3&category=203984,208524')
    .reply(200, mockResponse)

  store.dispatch(actions.getServerProducts(url))

  store.subscribeUntilPasses(() => {
    const data = store.getState().products
    // should replace each page of products, and so only return 24
    assert(data.products.length === 24)
    done()
  })
})

test('loadingProducts, without a query', () => {
  const state = {
    refinements: [],
    sortOptions: [],
    breadcrumbs: [],
    products: null,
    totalProducts: '...',
    categoryTitle: 'testing',
    categoryDescription: null,
    isLoadingAll: false,
  }

  const expected = {
    ...state,
    isLoadingAll: true,
  }

  expect(productsReducer(state, actions.loadingProducts())).toEqual(expected)
})

test('loadingProducts sets isLoadingAll to true', () => {
  const store = configureMockStore({
    products: {
      refinements: [],
      sortOptions: [],
      breadcrumbs: [],
      products: null,
      totalProducts: '...',
      categoryTitle: 'testing',
      categoryDescription: null,
    },
  })

  store.dispatch(actions.loadingProducts())
  expect(store.getState().products.isLoadingAll).toBe(true)
})

test('loadingProducts, with a query', () => {
  const state = {
    refinements: [],
    sortOptions: [],
    breadcrumbs: [],
    products: null,
    totalProducts: '...',
    categoryTitle: 'testing',
    categoryDescription: null,
    isLoadingAll: false,
  }

  const expected = {
    ...state,
    isLoadingAll: true,
    categoryTitle: 'new',
  }

  expect(productsReducer(state, actions.loadingProducts('new'))).toEqual(
    expected
  )
})

it('loadingProducts sets categoryTitle', () => {
  const store = configureMockStore({
    products: {
      refinements: [],
      sortOptions: [],
      breadcrumbs: [],
      products: null,
      totalProducts: '...',
      categoryTitle: 'testing',
      categoryDescription: null,
    },
  })

  store.dispatch(actions.loadingProducts('new'))
  expect(store.getState().products.categoryTitle).toBe('new')
})

test('removeProductsLocation to remove the product location', () => {
  const store = configureMockStore({
    products: {
      location: {
        pathname: '/en/tsuk/category/clothing-427/tops-443/',
        search: '?currentPage=3&pagination=1',
        query: {
          pagination: 1,
          currentPage: 3,
        },
      },
    },
  })

  store.dispatch(actions.removeProductsLocation())
  expect(store.getState().products.location).toEqual({})
})

test('when getProducts is called with cmspage seoUrl ', async () => {
  const store = configureMockStore({
    ...startingState,
    routing: {
      location: {
        pathname: '/en/tsuk/category/clothing-427/tops-443/',
        search: '?currentPage=3&pagination=1',
        query: {
          pagination: 1,
          currentPage: 3,
        },
      },
    },
  })
  const location = {
    pathname: '/search/',
    search: '?q=Jason+Donovan',
    query: {
      q: 'Jason Donovan',
    },
  }
  const response = {
    cmsPage: {
      seoUrl: '/en/evuk/category/from-evans-with-love-1-6225876/home',
    },
  }
  nock('http://localhost:3000')
    .get('/api/products?q=Jason%20Donovan')
    .reply(200, response)

  await store.dispatch(actions.getProducts(location))

  assert(isEmpty(store.getState().products.location))
})
