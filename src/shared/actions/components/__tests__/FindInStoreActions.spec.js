import {
  updateFindInStoreActiveItem,
  setStoreStockList,
  setStoreStockListProps,
  clearFindInStoreActiveItem,
} from '../FindInStoreActions'

describe('Find in Store actions', () => {
  describe(updateFindInStoreActiveItem.name, () => {
    it('returns updateFindInStoreActiveItem action creator', () => {
      expect(updateFindInStoreActiveItem({})).toEqual({
        type: 'UPDATE_FIND_IN_STORE_ACTIVE_ITEM',
        activeItem: {},
      })
    })
  })

  describe(clearFindInStoreActiveItem.name, () => {
    it('returns clearFindInStoreActiveItem action creator', () => {
      expect(clearFindInStoreActiveItem({})).toEqual({
        type: 'CLEAR_FIND_IN_STORE_ACTIVE_ITEM',
      })
    })
  })

  describe(setStoreStockList.name, () => {
    it('returns setStoreStockList action creator', () => {
      expect(setStoreStockList(true)).toEqual({
        type: 'SET_STORE_STOCK_LIST',
        storeListOpen: true,
      })
    })
  })

  describe(setStoreStockListProps.name, () => {
    it('returns setStoreStockListProps action creator', () => {
      expect(setStoreStockListProps({})).toEqual({
        type: 'SET_STORE_STOCK_LIST_PROPS',
        storeLocatorProps: {},
      })
    })
  })
})
