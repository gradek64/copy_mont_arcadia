import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { setCountry } from '../countryActions'

jest.mock('../../../lib/checkout-utilities/utils', () => ({
  getFormNames: () => ({
    address: 'billingAddress',
    details: 'billingDetails',
    findAddress: 'billingFindAddress',
  }),
}))
jest.mock('../modalActions', () => ({
  showModal: () => ({ type: 'MOCK_SHOW_MODAL' }),
}))
jest.mock('../shippingDestinationActions', () => ({
  updateShippingDestination: (country) => ({
    type: 'MOCK_UPDATE_SHIPPING_DESTINATION',
    country,
  }),
}))
jest.mock('../ddpActions', () => ({
  validateDDPForCountry: (country) => ({
    type: 'MOCK_VALIDATE_DDP_FOR_COUNTRY',
    country,
  }),
}))
jest.mock('../checkoutActions', () => ({
  selectDeliveryCountry: (country, isQubitExperience) => ({
    type: 'MOCK_SELECT_DELIVERY_COUNTRY',
    country,
    isQubitExperience,
  }),
}))
jest.mock('../checkoutActions', () => ({
  selectDeliveryCountry: (country, isQubitExperience) => ({
    type: 'MOCK_SELECT_DELIVERY_COUNTRY',
    country,
    isQubitExperience,
  }),
}))
jest.mock('../formActions', () => ({
  setFormField: (formName, field, value) => ({
    type: 'MOCK_SET_FORM_FIELD',
    formName,
    field,
    value,
  }),
}))

const initialState = {
  config: {
    siteDeliveryISOs: ['GB', 'AU', 'DK', 'SE', 'NZ', 'BG', 'CA', 'CN', 'PL'],
  },
}

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
const store = mockStore(initialState)

beforeEach(() => {
  jest.clearAllMocks()
  store.clearActions()
})

describe('setCountry', () => {
  describe('shows delivery country redirect modal', () => {
    const addressTypes = ['addressBook', 'deliveryMCD', 'deliveryCheckout']
    addressTypes.forEach((addressType) => {
      describe(`when address type is either ${addressType} and country is NOT part of siteDeliveryISOs`, () => {
        const country = 'Belgium'
        it(`should call show modal action for (Belgium-BE) selected when addressType is ${addressType}`, () => {
          store.dispatch(setCountry(addressType, country))
          const expectedActions = [{ type: 'MOCK_SHOW_MODAL' }]
          expect(store.getActions()).toEqual(expectedActions)
        })
      })
    })
  })

  describe('DOESN`T show delivery country redirect modal ', () => {
    describe('when country is part of siteDeliveryISOs', () => {
      describe('when addressType is NOT deliveryCheckout', () => {
        it('should dispatch default actions setFormField for state and country field', () => {
          const addressTypes = ['addressBook', 'deliveryMCD', 'anyFake']

          addressTypes.forEach((addressType) => {
            store.dispatch(setCountry(addressType, 'Poland'))
            const expectedActions = [
              {
                type: 'MOCK_SET_FORM_FIELD',
                formName: 'billingAddress',
                field: 'state',
                value: '',
              },
              {
                type: 'MOCK_SET_FORM_FIELD',
                formName: 'billingAddress',
                field: 'country',
                value: 'Poland',
              },
            ]
            expect(store.getActions()).toEqual(expectedActions)
            store.clearActions()
          })
        })
      })
      describe('when addressType is "deliveryCheckout"', () => {
        it('should dispatch addtional action as update shipping destination then validate DDP and selecta Delivery country', () => {
          const addressType = 'deliveryCheckout'
          store.dispatch(setCountry(addressType, 'China'))
          const expectedActions = [
            {
              type: 'MOCK_UPDATE_SHIPPING_DESTINATION',
              country: 'China',
            },
            {
              type: 'MOCK_VALIDATE_DDP_FOR_COUNTRY',
              country: 'China',
            },
            {
              type: 'MOCK_SELECT_DELIVERY_COUNTRY',
              country: 'China',
              isQubitExperience: false,
            },
            {
              type: 'MOCK_SET_FORM_FIELD',
              formName: 'billingAddress',
              field: 'state',
              value: '',
            },
            {
              type: 'MOCK_SET_FORM_FIELD',
              formName: 'billingAddress',
              field: 'country',
              value: 'China',
            },
          ]
          expect(store.getActions()).toEqual(expectedActions)
        })
      })
    })
  })
})
