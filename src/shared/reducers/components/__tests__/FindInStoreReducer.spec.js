import reducer from '../FindInStoreReducer'
import * as actions from '../../../actions/components/FindInStoreActions'

describe('FindInStoreReducer', () => {
  const initialState = {
    activeItem: {},
    storeListOpen: false,
    storeLocatorProps: {},
  }

  it('should return the initial state', () => {
    const expectedState = initialState

    expect(reducer(undefined, {})).toEqual(expectedState)
  })

  it('should handle UPDATE_FIND_IN_STORE_ACTIVE_ITEM', () => {
    const activeItem = 'test-value'
    const expectedState = {
      ...initialState,
      activeItem,
    }
    const action = {
      type: 'UPDATE_FIND_IN_STORE_ACTIVE_ITEM',
      activeItem,
    }

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle CLEAR_FIND_IN_STORE_ACTIVE_ITEM', () => {
    const action = {
      type: 'CLEAR_FIND_IN_STORE_ACTIVE_ITEM',
    }
    expect(reducer(initialState, action)).toEqual(initialState)
  })

  it('should handle SET_STORE_STOCK_LIST', () => {
    const storeListOpen = 'test-value'
    const expectedState = {
      ...initialState,
      storeListOpen,
    }
    const action = actions.setStoreStockList(storeListOpen)

    expect(reducer(initialState, action)).toEqual(expectedState)
  })

  it('should handle SET_STORE_STOCK_LIST_PROPS', () => {
    const storeLocatorProps = 'test-value'
    const expectedState = {
      ...initialState,
      storeLocatorProps,
    }
    const action = actions.setStoreStockListProps(storeLocatorProps)

    expect(reducer(initialState, action)).toEqual(expectedState)
  })
})
