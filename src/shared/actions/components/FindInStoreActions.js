export function updateFindInStoreActiveItem(activeItem) {
  return {
    type: 'UPDATE_FIND_IN_STORE_ACTIVE_ITEM',
    activeItem,
  }
}

export function clearFindInStoreActiveItem() {
  return {
    type: 'CLEAR_FIND_IN_STORE_ACTIVE_ITEM',
  }
}

export function setStoreStockList(storeListOpen) {
  return {
    type: 'SET_STORE_STOCK_LIST',
    storeListOpen,
  }
}

export function setStoreStockListProps(storeLocatorProps) {
  return {
    type: 'SET_STORE_STOCK_LIST_PROPS',
    storeLocatorProps,
  }
}
