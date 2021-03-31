import { combineReducers } from 'redux'
import createFormReducer from './createFormReducer'

export default combineReducers({
  account: createFormReducer('account', [
    'email',
    'password',
    'passwordConfirm',
    'subscribe',
  ]),
  billingAddress: createFormReducer('billingAddress', [
    'address1',
    'address2',
    'postcode',
    'city',
    'country',
    'county',
    'state',
    'isManual',
  ]),
  billingCardDetails: createFormReducer('billingCardDetails', [
    'paymentType',
    'cardNumber',
    'expiryMonth',
    'expiryYear',
    'expiryDate',
    'startMonth',
    'startYear',
    'cvv',
  ]),
  billingDetails: createFormReducer('billingDetails', [
    'title',
    'firstName',
    'lastName',
    'telephone',
  ]),
  billingFindAddress: createFormReducer('billingFindAddress', [
    'houseNumber',
    'message',
    'findAddress',
    'selectAddress',
    'postcode',
  ]),
  deliveryInstructions: createFormReducer('deliveryInstructions', [
    'deliveryInstructions',
    'smsMobileNumber',
  ]),
  findAddress: createFormReducer('findAddress', [
    'houseNumber',
    'message',
    'findAddress',
    'selectAddress',
    'postcode',
  ]),
  guestUser: createFormReducer('guestUser', ['email', 'signUpGuest']),
  order: createFormReducer('order', ['isAcceptedTermsAndConditions']),
  yourAddress: createFormReducer('yourAddress', [
    'address1',
    'address2',
    'postcode',
    'city',
    'country',
    'county',
    'state',
    'isManual',
  ]),
  yourDetails: createFormReducer('yourDetails', [
    'title',
    'firstName',
    'lastName',
    'telephone',
  ]),
})
