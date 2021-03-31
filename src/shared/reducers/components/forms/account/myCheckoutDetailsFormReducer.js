import { combineReducers } from 'redux'
import createFormReducer from '../createFormReducer'
import { UPDATE_LOCATION } from 'react-router-redux'

export default combineReducers({
  billingAddressMCD: createFormReducer('billingAddressMCD', [
    'address1',
    'address2',
    'postcode',
    'city',
    'country',
    'county',
    'state',
    'isManual',
  ]),
  billingFindAddressMCD: createFormReducer('billingFindAddressMCD', [
    'houseNumber',
    'message',
    'findAddress',
    'selectAddress',
    'postcode',
  ]),
  billingDetailsAddressMCD: createFormReducer('billingDetailsAddressMCD', [
    'title',
    'firstName',
    'lastName',
    'telephone',
  ]),
  deliveryAddressMCD: createFormReducer('deliveryAddressMCD', [
    'address1',
    'address2',
    'postcode',
    'city',
    'country',
    'county',
    'state',
    'isManual',
  ]),
  deliveryFindAddressMCD: createFormReducer('deliveryFindAddressMCD', [
    'houseNumber',
    'message',
    'findAddress',
    'selectAddress',
    'postcode',
  ]),
  deliveryDetailsAddressMCD: createFormReducer('deliveryDetailsAddressMCD', [
    'title',
    'firstName',
    'lastName',
    'telephone',
  ]),
  paymentCardDetailsMCD: createFormReducer('paymentCardDetailsMCD', [
    'paymentType',
    'cardNumber',
    'expiryMonth',
    'expiryYear',
    'expiryDate',
    'startMonth',
    'startYear',
  ]),
  myCheckoutDetailsForm: createFormReducer(
    'myCheckoutDetailsForm',
    ['isDeliveryAndBillingAddressEqual'],
    {
      [UPDATE_LOCATION]: (state, { payload: { pathname = '' } }) => {
        return pathname === '/my-account/details'
          ? state
          : { ...state, message: '' }
      },
    }
  ),
})
