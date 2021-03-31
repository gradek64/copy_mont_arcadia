const checkoutYourAddressMock = {
  fields: {
    address1: {
      value: '2 Britten Close',
      isDirty: false,
      isTouched: false,
      isFocused: false,
    },
    address2: {
      value: null,
      isDirty: false,
      isTouched: false,
      isFocused: false,
    },
    city: {
      value: 'LONDON',
      isDirty: false,
      isTouched: false,
      isFocused: false,
    },
    country: {
      value: 'United Kingdom',
      isDirty: true,
      isTouched: false,
      isFocused: false,
    },
    postcode: {
      value: 'NW11 7HQ',
      isDirty: false,
      isTouched: false,
      isFocused: false,
    },
    state: {
      value: 'CO',
      isDirty: true,
      isTouched: false,
      isFocused: false,
    },
  },
  isLoading: false,
  errors: {
    postcode: 'Please enter a valid post code',
  },
  message: {},
}

export default checkoutYourAddressMock
