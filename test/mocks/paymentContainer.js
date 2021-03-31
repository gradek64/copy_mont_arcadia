export const initialPaymentProps = {
  setFormField: jest.fn(),
  setFormMeta: jest.fn(),
  touchedFormField: jest.fn(),
  setManualAddressMode: jest.fn(),
  resetAddress: jest.fn(),
  resetForm: jest.fn(),
  findAddress: jest.fn(),
  touchedMultipleFormFields: jest.fn(),
  resetFormPartial: jest.fn(),
  getPaymentMethods: jest.fn(),
  addGiftCard: jest.fn(),
  hideGiftCardBanner: jest.fn(),
  removeGiftCard: jest.fn(),
  createOrder: jest.fn(),
  reAuthorize: jest.fn(),
  useDeliveryAsBilling: false,
  setDeliveryAsBillingFlag: jest.fn(),
  copyDeliveryValuesToBillingForms: jest.fn(),
  resetBillingForms: jest.fn(),
  homeDeliverySelected: false,
  orderSummary: {
    creditCard: {
      cardNumberStar: '************1111',
    },
    basket: {
      total: '40.00',
    },
    giftCards: [],
    deliveryLocations: [
      {
        deliveryLocationType: 'HOME',
        label:
          'Home Delivery Standard (UK up to 4 working days; worldwide varies)  Express (UK next or nominated day; worldwide varies)',
        selected: true,
        deliveryMethods: [],
      },
      {
        deliveryLocationType: 'STORE',
        label:
          'Collect from Store Standard (3-7 working days) Express (next day)',
        selected: false,
        deliveryMethods: [],
      },
      {
        deliveryLocationType: 'PARCEL',
        label: 'Collect from ParcelShop',
        selected: false,
        deliveryMethods: [],
      },
    ],
  },
  auth: {
    authentication: 'full',
  },
  billingDetails: {
    fields: {
      title: {
        value: 'Dr',
      },
      firstName: {
        value: 'John',
      },
      lastName: {
        value: 'Smith',
      },
      telephone: {
        value: '07123123123',
      },
    },
  },
  billingCardDetails: {
    fields: {
      paymentType: {
        value: 'VISA',
      },
      cardNumber: {
        value: '4444333322221111',
      },
      cvv: {
        value: '123',
      },
      expiryMonth: {
        value: '0810',
      },
    },
  },
  deliveryInstructions: {
    fields: {
      deliveryInstructions: {
        value: 'None',
      },
      smsMobileNumber: {
        value: '07979797979',
      },
    },
  },
  billingAddress: {
    fields: {
      country: {
        value: 'United Kingdom',
      },
    },
  },
  order: {
    fields: {
      isAcceptedTermsAndConditions: {
        value: false,
      },
    },
  },
  config: {
    checkoutAddressFormRules: {
      'United Kingdom': {},
    },
  },
  findAddressState: {
    isManual: true,
  },
  billingFindAddress: {
    fields: {
      postCode: {
        value: 'HP10 8HD',
      },
      houseNumber: {
        value: 'Sinclairs',
      },
    },
  },
  isMobile: true,
  yourDetails: {
    fields: {
      title: {
        value: 'Dr',
      },
      firstName: {
        value: 'John',
      },
      lastName: {
        value: 'Smith',
      },
      telephone: {
        value: '07123123123',
      },
    },
  },
  yourAddress: {
    fields: {
      address1: {
        value: 'Sinclairs, Sandpits Lane',
      },
      address2: {
        value: 'Penn',
      },
      city: {
        value: 'HIGH WYCOMBE',
      },
      country: {
        value: 'United Kingdom',
      },
      postcode: {
        value: 'HP10 8HD',
      },
    },
  },
  siteOptions: {
    titles: ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr'],
  },
  shoppingBag: {
    bag: {
      discounts: [
        {
          label: 'Topshop Card- £5 Welcome offer on a £50+ spend',
          value: '5.00',
        },
      ],
    },
  },
  paymentMethods: [],
  orderDetails: {
    amount: '20',
    billing: 'United Kingdom',
    delivery: 'United Kingdom',
  },
  user: {
    exists: true,
    email: 'winston@churchill.co.uk',
  },
  submitOrder: () => {},
  updateBillingForms: () => {},
}
