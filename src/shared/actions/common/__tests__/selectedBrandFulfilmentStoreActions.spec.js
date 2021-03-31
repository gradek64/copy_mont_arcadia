import * as actions from '../selectedBrandFulfilmentStoreActions'

describe('setSelectedBrandFulfilmentStore', () => {
  it('calling the SET_BRAND_FULFILMENT_STORE action should set the selectedBrandFulfilmentStore', () => {
    const store = { storeId: 'fake-store-420' }
    expect(actions.setSelectedBrandFulfilmentStore(store)).toEqual({
      type: 'SET_BRAND_FULFILMENT_STORE',
      store,
    })
  })
})
