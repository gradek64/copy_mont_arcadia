import { createStore } from 'redux'
import addressBookReducer from '../addressBookReducer'

describe('addressBookReducer', () => {
  let store
  beforeEach(() => {
    store = createStore(addressBookReducer)
  })

  afterEach(() => {
    store = null
  })

  describe('ADDRESS_BOOK_SHOW_NEW_ADDRESS_FORM', () => {
    it('sets isNewAddressFormVisible to true', () => {
      expect(store.getState().isNewAddressFormVisible).toBe(false)
      store.dispatch({ type: 'ADDRESS_BOOK_SHOW_NEW_ADDRESS_FORM' })
      expect(store.getState().isNewAddressFormVisible).toBe(true)
    })
  })
  describe('ADDRESS_BOOK_HIDE_NEW_ADDRESS_FORM', () => {
    it('sets isNewAddressFormVisible to false', () => {
      expect(store.getState().isNewAddressFormVisible).toBe(false)
      store.dispatch({ type: 'ADDRESS_BOOK_SHOW_NEW_ADDRESS_FORM' })
      expect(store.getState().isNewAddressFormVisible).toBe(true)
      store.dispatch({ type: 'ADDRESS_BOOK_HIDE_NEW_ADDRESS_FORM' })
      expect(store.getState().isNewAddressFormVisible).toBe(false)
    })
  })
})
