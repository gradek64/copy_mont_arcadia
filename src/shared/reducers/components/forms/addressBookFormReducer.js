import { combineReducers } from 'redux'
import createFormReducer from './createFormReducer'

export default combineReducers({
  newAddress: createFormReducer('newAddress', [
    'address1',
    'address2',
    'postcode',
    'city',
    'country',
    'county',
    'state',
    'isManual',
  ]),
  newFindAddress: createFormReducer('newFindAddress', [
    'houseNumber',
    'message',
    'findAddress',
    'selectAddress',
    'postcode',
  ]),
  newDetails: createFormReducer('newDetails', [
    'title',
    'firstName',
    'lastName',
    'telephone',
  ]),
  newDeliverToAddress: createFormReducer('newDeliverToAddress', [
    'deliverToAddress',
  ]),
})
