import testReducer from '../infinityScrollReducer'
import { getMockStoreWithInitialReduxState } from '../../../../../test/unit/helpers/get-redux-mock-store'

const initialHiddenPagesState = {
  hiddenPagesAbove: [],
  numberOfPagesHiddenAtEnd: 0,
}

describe('Infinity Scroll Reducer', () => {
  it('Default values', () => {
    const state = getMockStoreWithInitialReduxState().getState()
    expect(state.infinityScroll.currentPage).toBe(1)
    expect(state.infinityScroll.isActive).toBe(true)
  })
  describe('NEXT_PAGE_INFINITY', () => {
    it('should increase `currentPage` by 1', () => {
      expect(
        testReducer(
          { currentPage: 1 },
          {
            type: 'NEXT_PAGE_INFINITY',
          }
        )
      ).toEqual({
        currentPage: 2,
      })
    })
  })
  describe('SET_INFINITY_PAGE', () => {
    it('should set `currentPage`', () => {
      expect(
        testReducer(
          { currentPage: 1 },
          {
            type: 'SET_INFINITY_PAGE',
            page: 13,
          }
        )
      ).toEqual({
        currentPage: 13,
      })
    })

    it('should set `currentPage` and `hiddenPages` if shouldResetHiddenPageState is true ', () => {
      expect(
        testReducer(
          { currentPage: 1 },
          {
            type: 'SET_INFINITY_PAGE',
            page: 13,
            shouldResetHiddenPageState: true,
          }
        )
      ).toEqual({
        currentPage: 13,
        hiddenPages: initialHiddenPagesState,
      })
    })
  })
  describe('SET_INFINITY_ACTIVE', () => {
    it('should set `isActive` to true', () => {
      expect(
        testReducer(
          { isActive: false },
          {
            type: 'SET_INFINITY_ACTIVE',
          }
        )
      ).toEqual({
        isActive: true,
      })
    })
  })
  describe('SET_INFINITY_INACTIVE', () => {
    it('should set `isActive` to false', () => {
      expect(
        testReducer(
          { isActive: true },
          {
            type: 'SET_INFINITY_INACTIVE',
          }
        )
      ).toEqual({
        isActive: false,
      })
    })
  })
  describe('PRESERVE_SCROLL', () => {
    it('should set `preservedScroll` to value', () => {
      const preservedScroll = 156
      expect(
        testReducer(
          {},
          {
            type: 'PRESERVE_SCROLL',
            preservedScroll,
          }
        )
      ).toEqual({
        preservedScroll,
      })
    })
  })
  describe('CLEAR_PRESERVE_SCROLL', () => {
    it('should set `preservedScroll` to 0', () => {
      expect(
        testReducer(
          {},
          {
            type: 'CLEAR_PRESERVE_SCROLL',
          }
        )
      ).toEqual({
        preservedScroll: 0,
      })
    })
  })
  describe('SET_PRODUCTS', () => {
    it('should set `preservedScroll` to 0 and `isActive` to true', () => {
      const preservedScroll = 156
      expect(
        testReducer(
          { isActive: false, preservedScroll },
          {
            type: 'SET_PRODUCTS',
          }
        )
      ).toEqual({
        preservedScroll: 0,
        isActive: true,
      })
    })
  })

  describe('HIDE_PRODUCTS_ABOVE', () => {
    it('should add a new page to `hiddenPagesAbove`', () => {
      expect(
        testReducer(
          {
            hiddenPages: { hiddenPagesAbove: [{ height: 2 }] },
          },
          {
            type: 'HIDE_PRODUCTS_ABOVE',
            height: 100,
          }
        )
      ).toEqual({
        hiddenPages: { hiddenPagesAbove: [{ height: 2 }, { height: 100 }] },
      })
    })
  })

  describe('UNHIDE_PRODUCTS_ABOVE_AND_HIDE_BELOW', () => {
    it('should remove a page form `hiddenPagesAbove`', () => {
      expect(
        testReducer(
          {
            hiddenPages: {
              hiddenPagesAbove: [{ height: 1 }, { height: 2 }, { height: 3 }],
              numberOfPagesHiddenAtEnd: 0,
            },
          },
          {
            type: 'UNHIDE_PRODUCTS_ABOVE_AND_HIDE_BELOW',
            pageNoToUnhideAbove: 3,
          }
        )
      ).toEqual({
        hiddenPages: {
          hiddenPagesAbove: [{ height: 1 }, { height: 2 }],
          numberOfPagesHiddenAtEnd: 1,
        },
      })
    })

    it('returns the state if pageNoToUnhideAbove is not valid', () => {
      const stateMock = {
        hiddenPages: {
          hiddenPagesAbove: [{ height: 1 }, { height: 2 }, { height: 3 }],
          numberOfPagesHiddenAtEnd: 0,
        },
      }

      expect(
        testReducer(stateMock, {
          type: 'UNHIDE_PRODUCTS_ABOVE_AND_HIDE_BELOW',
          pageNoToUnhideAbove: 0,
        })
      ).toEqual(stateMock)
    })
  })

  describe('UNHIDE_PRODUCTS_BELOW', () => {
    it('decrements numberOfPagesHiddenAtEnd', () => {
      expect(
        testReducer(
          {
            hiddenPages: {
              hiddenPagesAbove: [{ height: 2 }],
              numberOfPagesHiddenAtEnd: 2,
            },
          },
          {
            type: 'UNHIDE_PRODUCTS_BELOW',
            height: 100,
          }
        )
      ).toEqual({
        isActive: true,
        hiddenPages: {
          hiddenPagesAbove: [{ height: 2 }],
          numberOfPagesHiddenAtEnd: 1,
        },
      })
    })

    it('doesnt change anything if numberOfPagesHiddenAtEnd is equal to 0', () => {
      expect(
        testReducer(
          {
            hiddenPages: {
              hiddenPagesAbove: [{ height: 2 }],
              numberOfPagesHiddenAtEnd: 0,
            },
          },
          {
            type: 'UNHIDE_PRODUCTS_BELOW',
            height: 100,
          }
        )
      ).toEqual({
        hiddenPages: {
          hiddenPagesAbove: [{ height: 2 }],
          numberOfPagesHiddenAtEnd: 0,
        },
      })
    })
  })
  describe('PLP_RETURNED_TOP', () => {
    it('should set hiddenPagesAbove to empty and numberOfPagesHiddenAtEnd', () => {
      expect(
        testReducer(
          { numberOfPagesHiddenAtEnd: 13 },
          {
            type: 'PLP_RETURNED_TOP',
            numberOfPagesHiddenAtEnd: 13,
          }
        )
      ).toEqual({
        hiddenPages: { hiddenPagesAbove: [], numberOfPagesHiddenAtEnd: 13 },
        numberOfPagesHiddenAtEnd: 13,
      })
    })
  })
})
