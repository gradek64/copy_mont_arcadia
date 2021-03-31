import { createStore } from 'redux'
import { omit } from 'ramda'
import deepFreeze from 'deep-freeze'
import productsReducer, { INITIAL_STATE } from '../productsReducer'

describe('productsReducer', () => {
  describe('INITIAL_STATE', () => {
    it('should have correct values', () => {
      const store = createStore(productsReducer)
      expect(store.getState()).toEqual({
        activeRefinements: [],
        refinements: [],
        sortOptions: [],
        breadcrumbs: [],
        products: undefined,
        totalProducts: 0,
        categoryTitle: undefined,
        categoryDescription: undefined,
        isLoadingAll: undefined,
        isLoadingMore: undefined,
        title: '',
        selectedProductSwatches: {},
      })
    })
  })
  describe('SET_PRODUCTS', () => {
    const mockBody = deepFreeze({
      AAA: 'AAAA',
      BBB: 'BBBB',
      searchTerm: 'AAAA',
      totalProducts: 8,
      breadcrumbs: 'AAA > BBBB > CCCCC',
      categoryTitle: 'SEARCH',
      title: 'Some Title',
    })

    it('should set Products with products', () => {
      const store = createStore(productsReducer)
      store.dispatch({
        type: 'SET_PRODUCTS',
        body: {
          ...mockBody,
          products: ['AAAA', 'BBB', 'CCCC'],
        },
      })
      expect(store.getState().products).toEqual(['AAAA', 'BBB', 'CCCC'])
    })
    it('should set Products without products', () => {
      const store = createStore(productsReducer)
      store.dispatch({
        type: 'SET_PRODUCTS',
        body: mockBody,
      })
      expect(store.getState().products).toBeUndefined()
    })
    it('should handle no totalProducts', () => {
      const store = createStore(productsReducer)
      store.dispatch({
        type: 'SET_PRODUCTS',
        body: omit('totalProducts', mockBody),
      })
      expect(store.getState().products).toBeUndefined()
      expect(store.getState().totalProducts).toBe(0)
    })
    it('should remove the brand name from the title', () => {
      const store = createStore(productsReducer)
      store.dispatch({
        type: 'SET_PRODUCTS',
        body: {
          ...mockBody,
          title: 'Some Title | Some Where | TopShop',
        },
      })
      expect(store.getState().title).toBe('Some Title | Some Where')
    })
  })
  describe('SET_PRODUCTS_LOCATION', () => {
    it('should set Products location', () => {
      const store = createStore(productsReducer)
      expect(store.getState().products).toBe(undefined)
      store.dispatch({
        type: 'SET_PRODUCTS_LOCATION',
        location: { a: 'A', b: 'B' },
      })
      expect(store.getState().location).toEqual({ a: 'A', b: 'B' })
    })
  })
  describe('REMOVE_PRODUCTS_LOCATION', () => {
    it('should remove Products location', () => {
      const store = createStore(productsReducer)
      expect(store.getState().products).toBe(undefined)
      store.dispatch({
        type: 'SET_PRODUCTS_LOCATION',
        location: { a: 'A', b: 'B' },
      })
      expect(store.getState().location).toEqual({ a: 'A', b: 'B' })
      store.dispatch({
        type: 'REMOVE_PRODUCTS_LOCATION',
      })
      expect(store.getState().location).toEqual({})
    })
  })
  describe('REMOVE_PRODUCTS', () => {
    it('should remove Products', () => {
      const store = createStore(productsReducer)
      expect(store.getState().products).toBe(undefined)
      store.dispatch({
        type: 'ADD_TO_PRODUCTS',
        products: ['A', 'B', 'C'],
      })
      store.getState().products = ['A', 'B', 'C']
      store.dispatch({
        type: 'REMOVE_PRODUCTS',
      })
      expect(store.getState().totalProducts).toBe(0)
      expect(store.getState().products).toEqual(undefined)
    })
  })
  describe('ADD_TO_PRODUCTS', () => {
    it('should handle no products', () => {
      const store = createStore(productsReducer)
      expect(store.getState().products).toBe(undefined)
      store.dispatch({
        type: 'ADD_TO_PRODUCTS',
        products: ['A', 'B', 'C'],
      })
      expect(store.getState().products).toEqual(['A', 'B', 'C'])
    })
    it('should handle existing products', () => {
      const store = createStore(productsReducer)
      expect(store.getState().products).toBe(undefined)
      store.dispatch({
        type: 'ADD_TO_PRODUCTS',
        products: ['D', 'E'],
      })
      store.getState().products = ['D', 'E']
      store.dispatch({
        type: 'ADD_TO_PRODUCTS',
        products: ['A', 'B', 'C'],
      })
      expect(store.getState().products).toEqual(['D', 'E', 'A', 'B', 'C'])
    })
  })
  describe('LOADING_PRODUCTS', () => {
    it('should handle loading value', () => {
      const store = createStore(productsReducer)
      expect(store.getState().isLoadingAll).toBe(undefined)
      expect(store.getState().categoryTitle).toBe(undefined)
      store.dispatch({
        type: 'LOADING_PRODUCTS',
        loading: 'LOADING_TITLE',
      })
      expect(store.getState().isLoadingAll).toBe(true)
      expect(store.getState().categoryTitle).toBe('LOADING_TITLE')
    })
    it('should handle no loading value', () => {
      const store = createStore(productsReducer)
      expect(store.getState().isLoadingAll).toBe(undefined)
      expect(store.getState().categoryTitle).toBe(undefined)
      store.getState().categoryTitle = 'CATEGORY_LOADING_TITLE'
      store.dispatch({
        type: 'LOADING_PRODUCTS',
      })
      expect(store.getState().isLoadingAll).toBe(true)
      expect(store.getState().categoryTitle).toBe('CATEGORY_LOADING_TITLE')
    })
  })
  describe('LOADING_MORE_PRODUCTS', () => {
    it('should handle false', () => {
      const store = createStore(productsReducer)
      expect(store.getState().isLoadingMore).toBe(undefined)
      store.dispatch({
        type: 'LOADING_MORE_PRODUCTS',
        isLoadingMore: false,
      })
      expect(store.getState().isLoadingMore).toBe(false)
    })
    it('should handle true', () => {
      const store = createStore(productsReducer)
      expect(store.getState().isLoadingMore).toBe(undefined)
      store.dispatch({
        type: 'LOADING_MORE_PRODUCTS',
        isLoadingMore: true,
      })
      expect(store.getState().isLoadingMore).toBe(true)
    })
  })

  describe('SELECT_SWATCH', () => {
    it('should add swatch id to swatches when a swatch is selected', () => {
      const productId = 'product id 1'
      const swatchId = 'product swatch id 1'
      const product = {
        productId,
        colourSwatches: [
          { swatchProduct: { productId: 'product swatch id 0' } },
          { swatchProduct: { productId: swatchId } },
        ],
      }
      const store = createStore(productsReducer, {
        products: [{ product: 'another product' }, product],
        selectedProductSwatches: { 'product old stuff': 'swatch old stuff' },
      })

      store.dispatch({
        type: 'SELECT_SWATCH',
        productId,
        swatchIndex: 1,
      })

      expect(store.getState().selectedProductSwatches).toEqual({
        [productId]: swatchId,
        'product old stuff': 'swatch old stuff',
      })
    })

    it('should override swatch id to swatches when a swatch is selected', () => {
      const productId = 'product id 1'
      const swatchId = 'product swatch id 1'
      const product = {
        productId,
        colourSwatches: [
          { swatchProduct: { productId: 'product swatch id 0' } },
          { swatchProduct: { productId: swatchId } },
        ],
      }
      const store = createStore(productsReducer, {
        products: [{ product: 'another product' }, product],
        selectedProductSwatches: {
          [productId]: 'swatch old stuff',
        },
      })

      store.dispatch({ type: 'SELECT_SWATCH', productId, swatchIndex: 1 })

      expect(store.getState().selectedProductSwatches).toEqual({
        [productId]: swatchId,
      })
    })

    it('should not add selected swatch when product is not found', () => {
      const store = createStore(productsReducer, {
        products: [],
        selectedProductSwatches: {},
      })

      store.dispatch({
        type: 'SELECT_SWATCH',
        productId: 'not found',
        swatchIndex: 1,
      })

      expect(store.getState().selectedProductSwatches).toEqual({})
    })

    it('should not add selected swatch when swatch index is not found', () => {
      const productId = 'product id 1'
      const product = {
        productId,
        colourSwatches: [],
      }
      const store = createStore(productsReducer, {
        products: [{ product: 'another product' }, product],
        selectedProductSwatches: {},
      })

      store.dispatch({ type: 'SELECT_SWATCH', productId, swatchIndex: 4 })

      expect(store.getState().selectedProductSwatches).toEqual({})
    })

    it('should return same instance of state if selected swatch was already selected', () => {
      const productId = 'product id 1'
      const swatchId = 'swatch id 0'
      const product = {
        productId,
        colourSwatches: [{ swatchProduct: { productId: swatchId } }],
      }
      const selectedProductSwatches = {
        [productId]: swatchId,
      }
      const initialState = Object.freeze({
        products: [product],
        selectedProductSwatches,
      })
      const store = createStore(productsReducer, initialState)

      store.dispatch({ type: 'SELECT_SWATCH', productId, swatchIndex: 0 })

      expect(store.getState()).toBe(initialState)
    })
  })

  describe('RESET_PRODUCTS_STATE', () => {
    it('should reset the products state back to initial state', () => {
      const store = createStore(productsReducer)
      store.dispatch({
        type: 'ADD_TO_PRODUCTS',
        products: ['D', 'E'],
      })

      expect(store.getState()).not.toEqual(INITIAL_STATE)

      store.dispatch({
        type: 'RESET_PRODUCTS_STATE',
      })

      expect(store.getState()).toEqual(INITIAL_STATE)
    })
  })
})
