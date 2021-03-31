export const orderMock = {
  smsMobileNumber: '',
  remoteIpAddress: '127.0.0.1',
  cardCvv: '0',
  orderDeliveryOption: {
    orderId: 887162,
    shippingCountry: 'United Kingdom',
    shipCode: 'S',
    deliveryType: 'HOME_STANDARD',
    shipModeId: 26504,
  },
  deliveryInstructions: '',
  returnUrl: 'http://local.m.topshop.com:8080/order-complete?',
  deliveryAddress: {
    address1: 'Flat 43, Littleton House, Lupus Street',
    address2: null,
    city: 'LONDON',
    state: null,
    country: 'United Kingdom',
    postcode: 'SW1V 3EP',
  },
  deliveryNameAndPhone: {
    firstName: 'Will',
    lastName: 'Smith',
    telephone: '0123456789',
    title: 'Ms',
  },
  billingDetails: {
    address: {
      address1: 'Flat 43, Littleton House, Lupus Street',
      address2: null,
      city: 'LONDON',
      state: null,
      country: 'United Kingdom',
      postcode: 'SW1V 3EP',
    },
    nameAndPhone: {
      firstName: 'Will',
      lastName: 'Smith',
      telephone: '0123456789',
      title: 'Ms',
    },
  },
  creditCard: {
    expiryYear: '2017',
    expiryMonth: '09',
    cardNumber: '0',
    type: 'PYPAL',
  },
  accountCreate: {
    email: 'paypal5.test@test.com',
    password: 'password1',
    passwordConfirm: 'password1',
    subscribe: '',
  },
}