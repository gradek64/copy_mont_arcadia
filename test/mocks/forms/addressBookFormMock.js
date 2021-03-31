export const addressBookFormMock = {
  newAddress: {
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
        value: 'United States',
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
  },
  newFindAddress: {
    fields: {
      postcode: {
        value: '',
        isDirty: false,
        isTouched: false,
        isFocused: false,
      },
      houseNumber: {
        value: '',
        isDirty: false,
        isTouched: false,
        isFocused: false,
      },
      findAddress: {
        value: '',
        isDirty: false,
        isTouched: false,
        isFocused: false,
      },
    },
    isLoading: false,
    errors: {},
    message: {},
  },
  newDetails: {
    fields: {
      title: {
        value: 'Mr',
        isDirty: false,
        isTouched: false,
        isFocused: false,
      },
      firstName: {
        value: 'Jose',
        isDirty: false,
        isTouched: false,
        isFocused: false,
      },
      lastName: {
        value: 'Quinto',
        isDirty: false,
        isTouched: false,
        isFocused: false,
      },
      telephone: {
        value: '01234567890',
        isDirty: false,
        isTouched: false,
        isFocused: false,
      },
    },
    isLoading: false,
    errors: {},
    message: {},
  },
}
