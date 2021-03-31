export const ChangePwdSuccess = {
  exists: true,
  email: 'bob5@test.com',
  title: '',
  firstName: '',
  lastName: '',
  userTrackingId: 526805911,
  basketItemCount: 0,
  creditCard: {
    type: '',
    cardNumberHash: '',
    cardNumberStar: '',
    expiryMonth: 'Month',
    expiryYear: 'Year',
  },
  deliveryDetails: {
    addressDetailsId: -1,
    nameAndPhone: { title: '', firstName: '', lastName: '', telephone: '' },
    address: {
      address1: '',
      address2: '',
      city: '',
      state: '',
      country: 'United Kingdom',
      postcode: '',
    },
  },
  billingDetails: {
    addressDetailsId: -1,
    nameAndPhone: { title: '', firstName: '', lastName: '', telephone: '' },
    address: {
      address1: '',
      address2: '',
      city: '',
      state: '',
      country: 'United Kingdom',
      postcode: '',
    },
  },
  version: '1.2',
}

export const ChangePwdError = {
  success: false,
  statusCode: 422,
  message: 'Password needs to be changed',
  originalMessage: 'Password needs to be changed',
  validationErrors: [],
}
