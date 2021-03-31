export const loginSuccess = {
  exists: true,
  email: 'myaccount1@test.com',
  title: 'Mr',
  firstName: 'Faisal',
  lastName: 'Khaliquee',
  userTrackingId: 381801726,
  basketItemCount: 15,
  creditCard: {
    type: 'VISA',
    cardNumberHash: 'tjOBl4zzS+ueTZQWartO5l968iOmCOix',
    cardNumberStar: '************1111',
    expiryMonth: '03',
    expiryYear: '2019',
  },
  deliveryDetails: {
    addressDetailsId: 275941955,
    nameAndPhone: {
      title: 'Mr',
      firstName: 'Faisal',
      lastName: 'Khaliquee',
      telephone: '7448879528',
    },
    address: {
      address1: '60 Hockley Avenue',
      address2: '',
      city: 'LONDON',
      state: '',
      country: 'United Kingdom',
      postcode: 'E6 3AN',
    },
  },
  billingDetails: {
    addressDetailsId: 231930306,
    nameAndPhone: {
      title: 'Mr',
      firstName: 'Faisal',
      lastName: 'Khaliquee',
      telephone: '07831541669',
    },
    address: {
      address1: '60 Hockley Avenue',
      address2: '',
      city: 'LONDON',
      state: '',
      country: 'United Kingdom',
      postcode: 'E6 3AN',
    },
  },
  version: '1.4',
  bvToken:
    '0105ab34812f3d56159c74a1f4dddfec646174653d3230313630343231267573657269643d333831383031373236266d61786167653d3630',
  'Arcadia-Session-Key': 'b916fca4-97e5-4507-8212-5c68616538e3',
}

export const loginFail = {
  statusCode: 401,
  error: 'Unauthorized',
  message:
    'Due to unsuccessful password attempts, you will be unable to logon. ' +
    'Please contact Customer Services to unlock your account.',
}
