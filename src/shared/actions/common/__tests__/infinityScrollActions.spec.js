import * as actions from '../infinityScrollActions'
import { mockStoreCreator } from '../../../../../test/unit/helpers/get-redux-mock-store'

jest.mock('react-router', () => ({
  browserHistory: {
    replace: jest.fn(),
  },
}))
import { browserHistory } from 'react-router'

jest.mock('../productsActions.js', () => ({
  addToProducts: jest.fn(),
}))

jest.mock('../../../../server/api/mapping/constants/plp', () => ({
  productListPageSize: 2,
}))

import { addToProducts } from '../productsActions'

const productsMock = {
  products: [
    { productId: 123 },
    { productId: 321 },
    { productId: 221 },
    { productId: 333 },
    { productId: 129 },
  ],
}

const initialHiddenPagesState = {
  hiddenPagesAbove: [],
  numberOfPagesHiddenAtEnd: 0,
}

const getBoundingClientRectFirstMock = {
  getBoundingClientRect: () => ({
    top: 10,
    bottom: 200,
  }),
}

const getBoundingClientRectSecondMock = {
  getBoundingClientRect: () => ({
    top: 12,
    bottom: 800,
  }),
}

describe('Infinity Scroll Actions', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  it('setInfinityActive()', () => {
    expect(actions.setInfinityActive()).toEqual({
      type: 'SET_INFINITY_ACTIVE',
    })
  })
  it('setInfinityInactive()', () => {
    expect(actions.setInfinityInactive()).toEqual({
      type: 'SET_INFINITY_INACTIVE',
    })
  })
  it('nextPageInfinity()', () => {
    expect(actions.nextPageInfinity()).toEqual({
      type: 'NEXT_PAGE_INFINITY',
    })
  })
  it('setInfinityPage(page)', () => {
    expect(actions.setInfinityPage(13)).toEqual({
      type: 'SET_INFINITY_PAGE',
      page: 13,
      shouldResetHiddenPageState: false,
    })
  })
  it('preserveScroll(preservedScroll)', () => {
    expect(actions.preserveScroll(1300)).toEqual({
      type: 'PRESERVE_SCROLL',
      preservedScroll: 1300,
    })
  })
  describe('clearInfinityPage', () => {
    const initialState = {
      infinityScroll: {
        currentPage: 3,
        isActive: true,
      },
      routing: {
        location: {
          pathname: 'some/pathname',
          query: {
            currentPage: 2,
            q: 'search',
          },
        },
      },
      features: {
        status: {
          FEATURE_NEW_FILTERS: false,
        },
      },
    }
    const onPage1Props = {
      infinityScroll: {
        isActive: true,
      },
      routing: {
        location: {
          pathname: 'some/pathname',
          query: {
            q: 'search',
          },
        },
      },
      features: {
        status: {
          FEATURE_NEW_FILTERS: false,
        },
      },
    }

    it('should call `setInfinityPage`', () => {
      const store = mockStoreCreator(initialState)
      store.dispatch(actions.clearInfinityPage())
      const actionsCalled = store.getActions()
      expect(actionsCalled[0]).toEqual({
        page: 1,
        type: 'SET_INFINITY_PAGE',
        shouldResetHiddenPageState: true,
      })
      expect(browserHistory.replace).toHaveBeenCalledTimes(1)
      expect(browserHistory.replace).toHaveBeenCalledWith({
        pathname: 'some/pathname',
        query: {
          q: 'search',
        },
      })
    })
    it('should not call if currentPage does not exist', () => {
      const store = mockStoreCreator(onPage1Props)
      store.dispatch(actions.clearInfinityPage())
      const actionsCalled = store.getActions()
      expect(actionsCalled[0]).toEqual({
        page: 1,
        type: 'SET_INFINITY_PAGE',
        shouldResetHiddenPageState: true,
      })
      expect(browserHistory.replace).toHaveBeenCalledTimes(0)
    })
  })

  describe('hitWaypointBottom', () => {
    it('should call `addToProducts` if `isActive`', () => {
      addToProducts.mockReturnValue({ type: 'IGNORE' })

      const initialState = {
        infinityScroll: {
          isActive: true,
          hiddenPages: {
            hiddenPagesAbove: [],
            numberOfPagesHiddenAtEnd: 0,
          },
        },
      }

      const store = mockStoreCreator(initialState)
      store.dispatch(actions.hitWaypointBottom())
      const actionsCalled = store.getActions()
      expect(actionsCalled).toEqual([
        { type: 'SET_INFINITY_INACTIVE' },
        { type: 'IGNORE' },
      ])
    })

    it('should not call `addToProducts` if not `isActive`', () => {
      const initialState = {
        infinityScroll: {
          isActive: false,
        },
      }
      const store = mockStoreCreator(initialState)
      store.dispatch(actions.hitWaypointBottom())
      const actionsCalled = store.getActions()
      expect(actionsCalled).toEqual([{ type: 'SET_INFINITY_INACTIVE' }])
    })

    it('should dispatch HIDE_PRODUCTS_ABOVE if it is IOS mobile', () => {
      addToProducts.mockReturnValue({ type: 'IGNORE' })

      document.querySelector = jest
        .fn()
        .mockReturnValueOnce(getBoundingClientRectFirstMock)
        .mockReturnValueOnce(getBoundingClientRectSecondMock)

      const initialState = {
        infinityScroll: {
          isActive: true,
          hiddenPages: {
            hiddenPagesAbove: [],
            numberOfPagesHiddenAtEnd: 0,
          },
        },
        viewport: {
          media: 'mobile',
          iosAgent: true,
        },
        products: productsMock,
      }

      const store = mockStoreCreator(initialState)

      store.dispatch(actions.hitWaypointBottom())

      const actionsCalled = store.getActions()
      expect(actionsCalled).toEqual([
        { type: 'SET_INFINITY_INACTIVE' },
        {
          type: 'HIDE_PRODUCTS_ABOVE',
          height: 790,
        },
        { type: 'IGNORE' },
      ])
    })
  })

  describe('hideProductsAbove', () => {
    const initialState = {
      infinityScroll: {
        currentPage: 3,
        isActive: true,
        hiddenPages: initialHiddenPagesState,
      },
      viewport: {
        media: 'desktop',
        iosAgent: false,
      },
      routing: {
        location: {
          pathname: 'some/pathname',
          query: {
            currentPage: 2,
            q: 'search',
          },
        },
      },
      features: {
        status: {
          FEATURE_NEW_FILTERS: false,
        },
      },
      products: productsMock,
    }

    it('does not dispatch any actions if device is desktop', () => {
      const store = mockStoreCreator(initialState)
      store.dispatch(actions.hideProductsAbove())
      const actionsCalled = store.getActions()

      expect(actionsCalled).toEqual([])
    })

    it('does not dispatch any actions if device is tablet', () => {
      const store = mockStoreCreator({
        ...initialState,
        viewport: { ...initialState.viewport, media: 'tablet' },
      })
      store.dispatch(actions.hideProductsAbove())
      const actionsCalled = store.getActions()

      expect(actionsCalled).toEqual([])
    })

    it('does not dispatch any actions if device is mobile and it is not IOS', () => {
      const store = mockStoreCreator({
        ...initialState,
        viewport: {
          ...initialState.viewport,
          media: 'mobile',
        },
      })
      store.dispatch(actions.hideProductsAbove())
      const actionsCalled = store.getActions()

      expect(actionsCalled).toEqual([])
    })

    it('does not dispatch any actions if there are not enough products', () => {
      const store = mockStoreCreator({
        ...initialState,
        viewport: {
          ...initialState.viewport,
          media: 'mobile',
        },
        products: {
          products: [{ productId: 123 }],
        },
      })
      store.dispatch(actions.hideProductsAbove())
      const actionsCalled = store.getActions()

      expect(actionsCalled).toEqual([])
    })

    it('dispatches HIDE_PRODUCTS_ABOVE if device is mobile and it is IOS', () => {
      const store = mockStoreCreator({
        ...initialState,
        viewport: {
          ...initialState.viewport,
          media: 'mobile',
          iosAgent: true,
        },
      })

      document.querySelector = jest
        .fn()
        .mockReturnValueOnce(getBoundingClientRectFirstMock)
        .mockReturnValueOnce(getBoundingClientRectSecondMock)

      store.dispatch(actions.hideProductsAbove())

      const actionsCalled = store.getActions()

      expect(actionsCalled).toEqual([
        { height: 790, type: 'HIDE_PRODUCTS_ABOVE' },
      ])
    })

    it('does not dispatch any actions if first and last products are not there', () => {
      const store = mockStoreCreator({
        ...initialState,
        viewport: {
          ...initialState.viewport,
          media: 'mobile',
          iosAgent: true,
        },
        products: productsMock,
      })

      document.querySelector = jest.fn().mockReturnValue(undefined)

      store.dispatch(actions.hideProductsAbove())

      const actionsCalled = store.getActions()

      expect(actionsCalled).toEqual([])
    })
  })

  describe('showMoreProducts', () => {
    it('calls addToProducts if numberOfPagesHiddenAtEnd is 0', () => {
      const initialState = {
        infinityScroll: {
          currentPage: 3,
          isActive: true,
          hiddenPages: initialHiddenPagesState,
        },
      }

      addToProducts.mockReturnValue({ type: 'ADD_TO_PRODUCT' })

      const store = mockStoreCreator(initialState)

      store.dispatch(actions.showMoreProducts())

      const actionsCalled = store.getActions()

      expect(actionsCalled).toEqual([{ type: 'ADD_TO_PRODUCT' }])
    })

    it('dispatches UNHIDE_PRODUCTS_BELOW if there are pages hidden below', () => {
      const initialState = {
        infinityScroll: {
          currentPage: 3,
          isActive: true,
          hiddenPages: {
            ...initialHiddenPagesState,
            numberOfPagesHiddenAtEnd: 2,
          },
        },
      }

      const store = mockStoreCreator(initialState)

      store.dispatch(actions.showMoreProducts())

      const actionsCalled = store.getActions()

      expect(actionsCalled).toEqual([{ type: 'UNHIDE_PRODUCTS_BELOW' }])
    })
  })

  describe('hitWaypointTop', () => {
    it('dispatches UNHIDE_PRODUCTS_ABOVE_AND_HIDE_BELOW', () => {
      const store = mockStoreCreator({})

      store.dispatch(actions.hitWaypointTop(1))

      const actionsCalled = store.getActions()

      expect(actionsCalled).toEqual([
        {
          type: 'UNHIDE_PRODUCTS_ABOVE_AND_HIDE_BELOW',
          pageNoToUnhideAbove: 1,
        },
      ])
    })
  })

  describe('removeHiddenPages', () => {
    const createStateWithNProducts = (n) => ({
      products: {
        products: new Array(n),
      },
    })

    describe('User is in PLP and there are hidden pages above ', () => {
      it('should handle the case where there are more than two pages of products fetched', () => {
        const state = {
          ...createStateWithNProducts(9),
          infinityScroll: {
            hiddenPages: {
              hiddenPagesAbove: [{ height: 300 }],
            },
          },
        }
        const store = mockStoreCreator(state)
        store.dispatch(actions.removeHiddenPages(true))
        expect(store.getActions()).toEqual([
          {
            type: 'PLP_RETURNED_TOP',
            numberOfPagesHiddenAtEnd: 3,
          },
        ])
      })
    })

    describe('User is in PLP and there are not hidden pages above', () => {
      it('does not dispatch PLP_RETURNED_TOP', () => {
        const store = mockStoreCreator(createStateWithNProducts(9))
        store.dispatch(actions.removeHiddenPages(true))
        expect(store.getActions()).toEqual([])
      })
    })

    describe('User is not in PLP and there are not hidden pages above', () => {
      it('does not dispatch PLP_RETURNED_TOP', () => {
        const store = mockStoreCreator(createStateWithNProducts(9))
        store.dispatch(actions.removeHiddenPages(false))
        expect(store.getActions()).toEqual([])
      })
    })

    describe('User has hidden pages but is not on PLP', () => {
      it('does not dispatch PLP_RETURNED_TOP', () => {
        const store = mockStoreCreator({
          ...createStateWithNProducts(9),
          infinityScroll: {
            hiddenPages: {
              hiddenPagesAbove: [{ height: 300 }],
            },
          },
        })

        store.dispatch(actions.removeHiddenPages(false))
        expect(store.getActions()).toEqual([])
      })
    })
  })
})
