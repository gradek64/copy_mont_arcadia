// *** Mocks *** //
export const initialFormProps = {
  findAddressForm: {
    address: '',
    country: '',
    findAddress: '',
    houseNumber: '',
    message: '',
    postCode: '',
  },
  yourAddressForm: {
    address: '',
    country: 'United Kingdom',
    findAddress: '',
    houseNumber: '',
    message: '',
    postCode: '',
  },
  yourDetailsFormName: {
    address: '',
    country: '',
    findAddress: '',
    houseNumber: '',
    message: '',
    postCode: '',
  },
  yourDetailsForm: {
    address: {
      address1: null,
      address2: null,
      city: null,
      state: null,
      country: 'United Kingdom',
      postcode: null,
    },
    monikers: [],
  },
}
export const config = {
  paymentShema: ['type', 'cardNumber', 'expiryMonth', 'expiryYear'],
  checkoutAddressFormRules: {
    'United Kingdom': {
      pattern: {},
      stateFieldType: false,
      postcodeRequired: true,
      premisesRequired: false,
      premisesLabel: 'House number',
      postcodeLabel: 'XX345XX',
    },
    'United States': {
      pattern: {},
      stateFieldType: 'SELECT',
      postcodeRequired: true,
      premisesRequired: true,
      premisesLabel: 'Street Addess',
    },
  },
  qasCountries: {
    Turkey: 'TUR',
    'United Kingdom': 'GBR',
    'United States': 'US',
  },
}

export const errors = {}
export const billing = false
export const yourDetailsFormName = 'yourDetails'
export const yourDetailsErrors = {
  firstName: 'This field is required',
  lastName: 'This field is required',
  telephone: 'This field is required',
}
export const routing = {
  visited: 'some/checkout/summary',
}
export const shippingDestination = 'United Kingdom'
