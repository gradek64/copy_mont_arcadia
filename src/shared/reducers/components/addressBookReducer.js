import createReducer from '../../lib/create-reducer'

const initialState = {
  isNewAddressFormVisible: false,
}

export default createReducer(initialState, {
  ADDRESS_BOOK_SHOW_NEW_ADDRESS_FORM: (state) => ({
    ...state,
    isNewAddressFormVisible: true,
  }),
  ADDRESS_BOOK_HIDE_NEW_ADDRESS_FORM: (state) => ({
    ...state,
    isNewAddressFormVisible: false,
  }),
})
