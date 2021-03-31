import reducer from '../QuickviewReducer'
import {
  setProductQuickview,
  setProductIdQuickview,
} from '../../../actions/common/quickviewActions'

describe('QuickviewReducer', () => {
  const initialState = {
    activeItem: {},
    product: {},
    showError: false,
  }

  it('should return the initial state', () => {
    const expectedState = initialState

    expect(reducer(undefined, {})).toEqual(expectedState)
  })

  it('should handle SET_PRODUCT_QUICKVIEW', () => {
    const expectedState = {
      ...initialState,
      product: {
        someFakeStuff: 'test',
      },
    }

    expect(
      reducer(undefined, setProductQuickview(expectedState.product))
    ).toEqual(expectedState)
  })

  it('should handle SET_PRODUCT_QUICKVIEW with items already set same productId', () => {
    const initialState = {
      productId: '12345',
      newItems: {
        productId: '12345',
        items: [{ b: 'c' }],
      },
    }

    const expectedState = {
      productId: '12345',
      newItems: undefined,
      product: {
        productId: '12345',
        items: [{ b: 'c' }],
      },
    }

    const newProduct = {
      productId: '12345',
      items: [{ a: 'b' }],
    }

    expect(reducer(initialState, setProductQuickview(newProduct))).toEqual(
      expectedState
    )
  })

  it('should handle SET_PRODUCT_QUICKVIEW with items already set', () => {
    const initialState = {
      productId: 'abcde',
      product: {
        productId: '12345',
        items: [{ b: 'c' }],
      },
    }

    const expectedState = {
      productId: 'abcde',
      product: {
        productId: 'abcde',
        items: [{ a: 'b' }],
      },
    }

    const newProduct = {
      productId: 'abcde',
      items: [{ a: 'b' }],
    }

    expect(reducer(initialState, setProductQuickview(newProduct))).toEqual(
      expectedState
    )
  })

  it('should handle SET_PRODUCT_ID_QUICKVIEW', () => {
    const expectedState = {
      ...initialState,
      productId: 'fakeId',
    }

    expect(
      reducer(undefined, setProductIdQuickview(expectedState.productId))
    ).toEqual(expectedState)
  })

  describe('UPDATE_PRODUCT_ITEMS', () => {
    it('should not updated items if its for the same product', () => {
      const old_items = [{ a: 'c', b: 'd' }]
      const items = [{ b: 'c', d: 'e' }]
      const initialState = {
        productId: '12345',
        product: {
          productId: '12345',
          items: old_items,
        },
      }

      const reducer1 = reducer(initialState, {
        type: 'UPDATE_PRODUCT_ITEMS',
        productId: '12345',
        items,
      })
      expect(reducer1).toEqual({
        productId: '12345',
        product: {
          productId: '12345',
          items,
        },
      })
    })

    it('should set newItems if its for the different product', () => {
      const old_items = [{ a: 'c', b: 'd' }]
      const items = [{ b: 'c', d: 'e' }]
      const initialState = {
        productId: '12345',
        product: {
          items: old_items,
        },
      }

      const reducer1 = reducer(initialState, {
        type: 'UPDATE_PRODUCT_ITEMS',
        productId: 'ABCDEF',
        items,
      })
      expect(reducer1).toEqual({
        productId: '12345',
        product: {
          items: old_items,
        },
        newItems: {
          productId: 'ABCDEF',
          items,
        },
      })
    })
  })

  describe('SET_PRODUCT_ID_QUICKVIEW', () => {
    it('should return state with updated productId', () => {
      const productId = '12345'
      const newState = reducer(initialState, {
        type: 'SET_PRODUCT_ID_QUICKVIEW',
        productId,
      })

      expect(newState).toEqual({
        ...initialState,
        productId,
      })
    })
  })

  describe('UPDATE_QUICK_VIEW_ACTIVE_ITEM', () => {
    it('should return state with updated active item', () => {
      const activeItem = {
        test: true,
      }
      const newState = reducer(initialState, {
        type: 'UPDATE_QUICK_VIEW_ACTIVE_ITEM',
        activeItem,
      })

      expect(newState).toEqual({
        ...initialState,
        activeItem,
        selectedQuantity: 1,
        showError: false,
      })
    })
  })

  describe('UPDATE_QUICK_VIEW_ACTIVE_ITEM_QUANTITY', () => {
    it('should return state with updated quantity', () => {
      const selectedQuantity = 4
      const newState = reducer(initialState, {
        type: 'UPDATE_QUICK_VIEW_ACTIVE_ITEM_QUANTITY',
        selectedQuantity,
      })

      expect(newState).toEqual({
        ...initialState,
        selectedQuantity,
      })
    })
  })

  describe('UPDATE_QUICK_VIEW_SHOW_ITEMS_ERROR', () => {
    it('should return state with updated show error', () => {
      const showError = true
      const newState = reducer(initialState, {
        type: 'UPDATE_QUICK_VIEW_SHOW_ITEMS_ERROR',
        showError,
      })

      expect(newState).toEqual({
        ...initialState,
        showError,
      })
    })

    it('should default showError to true', () => {
      const showError = undefined
      const newState = reducer(initialState, {
        type: 'UPDATE_QUICK_VIEW_SHOW_ITEMS_ERROR',
        showError,
      })

      expect(newState).toEqual({
        ...initialState,
        showError: true,
      })
    })
  })
})
