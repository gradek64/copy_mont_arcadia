export const mockedReq = {
  delivery: 'foo',
  billing: 'bar',
}

export const mockedState = {
  account: {},
  forms: {},
  config: {
    country: 'Antigua & Barbuda',
  },
}

export const mockedForm = {
  forms: {
    checkout: {
      yourAddress: {
        fields: {
          country: {
            value: 'United Kingdom',
          },
        },
      },
      billingAddress: {
        fields: {
          country: {
            value: 'Turkmenistan',
          },
        },
      },
    },
  },
}

export const mockedAccount = {
  account: {
    user: {
      deliveryDetails: {
        address: {
          country: 'China',
        },
      },
      billingDetails: {
        address: {
          country: 'Germany',
        },
      },
    },
  },
}

export const mockedCheckout = {
  checkout: {
    orderSummary: {
      basket: {
        total: 1000,
      },
    },
  },
}

export const paymentMethodsList = [
  {
    value: 'VISA',
    type: 'CARD',
    label: 'Visa',
    description: 'Pay with VISA',
    icon: 'icon_visa.gif',
    validation: {
      cardNumber: { length: 16, message: 'A 16 digit card number is required' },
      cvv: { length: 3, message: '3 digits required' },
      expiryDate: 'MM/YY',
      startDate: null,
    },
  },
  {
    value: 'MCARD',
    type: 'CARD',
    label: 'MasterCard',
    description: 'Pay with MasterCard',
    icon: 'icon_mastercard.gif',
    validation: {
      cardNumber: { length: 16, message: 'A 16 digit card number is required' },
      cvv: { length: 3, message: '3 digits required' },
      expiryDate: 'MM/YY',
      startDate: null,
    },
  },
  {
    value: 'AMEX',
    type: 'CARD',
    label: 'American Express',
    description: 'Pay with American Express',
    icon: 'icon_amex.gif',
    validation: {
      cardNumber: { length: 15, message: 'A 15 digit card number is required' },
      cvv: { length: 4, message: '4 digits required' },
      expiryDate: 'MM/YY',
      startDate: null,
    },
  },
  {
    value: 'SWTCH',
    type: 'CARD',
    label: 'Switch/Maestro',
    description: 'Pay with Switch / Maestro',
    icon: 'icon_switch.gif',
    validation: {
      cardNumber: { length: 16, message: 'A 16 digit card number is required' },
      cvv: { length: 3, message: '3 digits required' },
      expiryDate: 'MM/YY',
      startDate: null,
    },
  },
  {
    value: 'ACCNT',
    type: 'OTHER_CARD',
    label: 'Account Card',
    description: 'Pay with Account Card',
    icon: 'icon_account-card.gif',
    validation: {
      cardNumber: { length: 16, message: 'A 16 digit card number is required' },
      cvv: { length: 3, message: '3 digits required' },
      expiryDate: 'MM/YY',
      startDate: null,
    },
  },
  {
    value: 'PYPAL',
    type: 'OTHER',
    label: 'Paypal',
    description: 'Check out with your PayPal account',
    icon: 'icon_paypal.gif',
  },
  {
    value: 'MPASS',
    type: 'OTHER',
    label: 'Masterpass',
    description: 'Check out with your Masterpass account',
    icon: 'icon_masterpass.gif',
  },
  {
    value: 'KLRNA',
    type: 'OTHER',
    threshold: 0,
    label: 'Klarna',
    description: 'Shop now, Pay later',
    icon: 'icon_klarna-uk.gif',
    deliveryCountry: ['United Kingdom'],
    billingCountry: ['United Kingdom'],
  },
  {
    value: 'ALIPY',
    type: 'OTHER',
    label: 'AliPay',
    description: 'Check out with your AliPay account',
    icon: 'icon_alipay.svg',
    billingCountry: ['China'],
  },
  {
    value: 'CUPAY',
    type: 'OTHER',
    label: 'China Union Pay',
    description: 'Check out with your China Union Pay account',
    icon: 'icon_cupay.svg',
    billingCountry: ['China'],
  },
  {
    value: 'SOFRT',
    type: 'OTHER',
    label: 'Sofort',
    description: 'Check out with your SOFORT account',
    icon: 'icon_sofort.svg',
    billingCountry: ['Austria', 'Belgium', 'France', 'Germany'],
  },
  {
    value: 'CLRPY',
    type: 'OTHER',
    label: 'ClearPay',
    description: 'Check out with your ClearPay account',
    icon: 'icon_clearpay.svg',
    billingCountry: ['United Kingdom'],
  },
  {
    value: 'APPLE',
    type: 'OTHER',
    label: 'Apple',
    description: 'Check out with your Apple Pay account',
    icon: 'icon_applepay.svg',
    billingCountry: ['United Kingdom'],
  },
]

export const savedCards = {
  INVALID: {
    account: {
      user: {
        creditCard: {
          type: 'VISA',
          cardNumberHash: '****************************HPaM',
          cardNumberStar: '************1111',
          expiryMonth: '*^&',
          expiryYear: new Date().getFullYear() + 5,
        },
      },
    },
    paymentMethods: paymentMethodsList,
  },
  VALID: {
    account: {
      user: {
        creditCard: {
          type: 'VISA',
          cardNumberHash: '****************************HPaM',
          cardNumberStar: '************1111',
          expiryMonth: '06',
          expiryYear: new Date().getFullYear() + 5,
        },
      },
    },
    paymentMethods: paymentMethodsList,
  },
  EXPIRED: {
    account: {
      user: {
        creditCard: {
          type: 'VISA',
          cardNumberHash: '****************************HPaM',
          cardNumberStar: '************1111',
          expiryMonth: '06',
          expiryYear: '2019',
        },
      },
    },
    paymentMethods: paymentMethodsList,
  },
  OTHER: {
    account: {
      user: {
        creditCard: {
          type: 'KLRNA',
          cardNumberHash: '',
          cardNumberStar: '',
          expiryMonth: '',
          expiryYear: '',
        },
      },
    },
    paymentMethods: paymentMethodsList,
  },
}
