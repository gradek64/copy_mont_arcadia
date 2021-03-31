export const yourAddress = {
  fields: {
    address1: { isDirty: true, value: 'delivery address1' },
    address2: { isDirty: true, value: 'delivery address2' },
    city: { isDirty: true, value: 'delivery city' },
    county: { isDirty: true, value: 'delivery county' },
    postcode: { isDirty: true, value: 'delivery postcode' },
    country: { isDirty: true, value: 'delivery country' },
  },
}

export const yourDetails = {
  fields: {
    title: { isDirty: true, value: 'delivery title' },
    firstName: { isDirty: true, value: 'delivery firstName' },
    lastName: { isDirty: true, value: 'delivery lastName' },
    telephone: { isDirty: true, value: '123-555-3456' },
  },
}

export const billingAddress = {
  fields: {
    address1: { isDirty: true, value: 'billing address1' },
    address2: { isDirty: true, value: 'billing address2' },
    city: { isDirty: true, value: 'billing city' },
    county: { isDirty: true, value: 'billing county' },
    postcode: { isDirty: true, value: 'billing postcode' },
    country: { isDirty: true, value: 'billing country' },
  },
}

export const billingDetails = {
  fields: {
    title: { isDirty: true, value: 'billing title' },
    firstName: { isDirty: true, value: 'billing firstName' },
    lastName: { isDirty: true, value: 'billing lastName' },
    telephone: { isDirty: true, value: '1235553456' },
  },
}

export const orderSummary = {
  shippingCountry: 'shipping country',
  basket: {
    orderId: 'order id',
    total: '12.50',
  },
  deliveryInstructions: 'delivery instructions',
  smsMobileNumber: '07777777777',
  cardNumberHash: 'card number hash',
  deliveryLocations: [
    {
      selected: false,
    },
    {
      selected: true,
      deliveryMethods: [
        {
          selected: false,
        },
        {
          selected: true,
          shipCode: 'ship code',
          deliveryType: 'delivery type',
        },
      ],
    },
  ],
  giftCards: [],
}

export const credentials = {
  fields: {
    passwordConfirm: { isDirty: true, value: 'password confirm' },
    subscribe: { isDirty: true, value: false },
    password: { isDirty: true, value: 'password' },
    email: { isDirty: true, value: 'email' },
  },
}

export const user = {
  exists: true,
  email: 'atestemail@test.com',
}

export const billingCardDetails = {
  fields: {
    cardNumber: { isDirty: true, value: '4444333322221111' },
    expiryMonth: { isDirty: true, value: '07' },
    expiryYear: { isDirty: true, value: '2018' },
    paymentType: { isDirty: true, value: 'VISA' },
    cvv: { isDirty: true, value: '123' },
  },
}

export const deliveryInstructions = {
  fields: {
    smsMobileNumber: { isDirty: true, value: '07777777777' },
    deliveryInstructions: { isDirty: true, value: 'delivery instructions' },
  },
}

const nominatedDate = undefined
const shipModeId = undefined
export const auth = { authentication: 'full' }
const baseOrder = {
  smsMobileNumber: '07777777777',
  remoteIpAddress: '127.0.0.1',
  deliveryInstructions: 'delivery instructions',
  returnUrl: `${window.location.protocol}//${
    window.location.host
  }/order-complete?orderId=order%20id&paymentMethod=VISA`,
  punchoutReturnUrl: `${window.location.protocol}//${
    window.location.host
  }/psd2-order-punchout?orderId=order%20id&paymentMethod=VISA`,
  cardCvv: '123',
  orderDeliveryOption: {
    shippingCountry: yourAddress.fields.country.value,
    shipCode: 'ship code',
    orderId: 'order id',
    deliveryType: 'delivery type',
    shipModeId,
    nominatedDate,
  },
  paymentType: 'VISA',
  isGuestOrder: false,
  email: '',
}
export const shortOrder = {
  ...baseOrder,
  cardNumberHash: 'card number hash',
}

export const fullOrder = {
  ...baseOrder,
  deliveryAddress: {
    state: 'delivery county',
    country: 'delivery country',
    city: 'delivery city',
    postcode: 'delivery postcode',
    address1: 'delivery address1',
    address2: 'delivery address2',
  },
  deliveryNameAndPhone: {
    lastName: 'delivery lastName',
    telephone: '1235553456',
    firstName: 'delivery firstName',
  },
  billingDetails: {
    address: {
      state: 'billing county',
      country: 'billing country',
      city: 'billing city',
      postcode: 'billing postcode',
      address1: 'billing address1',
      address2: 'billing address2',
    },
    nameAndPhone: {
      lastName: 'billing lastName',
      telephone: '1235553456',
      firstName: 'billing firstName',
    },
  },
  creditCard: {
    cardNumber: '4444333322221111',
    expiryMonth: '07',
    expiryYear: '2018',
    type: 'VISA',
  },
}

export const guestOrder = {
  ...fullOrder,
  accountCreate: {
    passwordConfirm: 'password confirm',
    subscribe: false,
    password: 'password',
    email: 'email',
  },
}

export const guestCheckoutOrder = {
  ...fullOrder,
}

export const paymentMethods = [
  {
    value: 'VISA',
    type: 'CARD',
    label: 'Visa',
    description: 'Pay with VISA',
  },
  {
    value: 'MCARD',
    type: 'CARD',
    label: 'MasterCard',
    description: 'Pay with MasterCard',
  },
  {
    value: 'AMEX',
    type: 'CARD',
    label: 'American Express',
    description: 'Pay with American Express',
  },
  {
    value: 'SWTCH',
    type: 'CARD',
    label: 'Switch/Maestro',
    description: 'Pay with Switch / Maestro',
  },
  {
    value: 'PYPAL',
    type: 'OTHER',
    label: 'Paypal',
    description: 'Check out with your PayPal account',
  },
  {
    value: 'KLRNA',
    type: 'OTHER',
    threshold: 40,
    label: 'Try before you buy',
    description: 'Get your goods today and pay 3 months later',
    deliveryCountry: ['United Kingdom'],
    billingCountry: ['United Kingdom'],
  },
]
