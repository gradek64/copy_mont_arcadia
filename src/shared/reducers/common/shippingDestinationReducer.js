import createReducer from '../../lib/create-reducer'
import withStorage from '../decorators/withStorage'
import storageHandlers from '../../../client/lib/state-sync/handlers'

const initialState = { destination: '', language: '' }

export const reducer = createReducer(initialState, {
  SET_SHIPPING_DESTINATION: (state, { destination }) => ({
    ...state,
    destination,
  }),
  SET_LANGUAGE: (state, { language }) => ({ ...state, language }),
})

export default withStorage(storageHandlers.shippingDestination)(reducer)
