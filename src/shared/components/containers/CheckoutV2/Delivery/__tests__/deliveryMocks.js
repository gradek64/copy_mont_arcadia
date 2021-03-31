export const initialHomeDeliveryProps = {
  bagContainsOnlyDDPProduct: false,
  ddpDefaultName: 'Topshop Unlimited',
  ddpDefaultSku: {
    name: 'DDP Unlimited',
  },
  config: {
    checkoutAddressFormRules: {
      'United Kingdom': {
        pattern:
          '^(([gG][iI][rR] {0,}0[aA]{2})|(([aA][sS][cC][nN]|[sS][tT][hH][lL]|[tT][dD][cC][uU]|[bB][bB][nN][dD]|[bB][iI][qQ][qQ]|[fF][iI][qQ][qQ]|[pP][cC][rR][nN]|[sS][iI][qQ][qQ]|[iT][kK][cC][aA]) {0,}1[zZ]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yxA-HK-XY]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$',
        stateFieldType: false,
        postcodeRequired: true,
        postcodeLabel: 'Postcode',
        premisesRequired: false,
        premisesLabel: 'House number',
      },
    },
    country: 'United Kingdom',
    qasCountries: {
      'United Kingdom': 'GBR',
    },
  },
  findAddressState: {
    address: {
      address1: null,
      address2: null,
      city: null,
      state: null,
      country: null,
      postcode: null,
    },
    monikers: [],
  },
  orderSummary: {},
  useDeliveryAsBilling: true,
  user: {},
  shippingDestination: 'United Kingdom',
  siteOptions: {
    titles: ['Mr', 'Mrs'],
  },
  findAddress: jest.fn(),
  getAddressByMoniker: jest.fn(),
  manualAddress: jest.fn(),
  putOrderSummary: jest.fn(),
  resetAddress: jest.fn(),
  showModal: jest.fn(),
  resetForm: jest.fn(),
  selectDeliveryCountry: jest.fn(),
  selectDeliveryType: jest.fn(),
  setDeliveryAsBilling: jest.fn(),
  setDeliveryAsBillingFlag: jest.fn(),
  setFormField: jest.fn(),
  touchedFormField: jest.fn(),
  touchedMultipleFormFields: jest.fn(),
  isMobile: true,
}

export const initialHomeDeliveryFormProps = {
  yourAddress: {
    address1: null,
    address2: null,
    city: null,
    state: null,
    country: 'United Kingdom',
    postcode: null,
    county: null,
  },
  yourDetails: {
    title: 'Ms',
    firstName: null,
    lastName: null,
    telephone: null,
  },
  findAddressForm: {
    postCode: '',
    houseNumber: '',
    address: '',
    message: '',
    country: 'default',
    findAddress: '',
  },
  deliveryInstructions: {
    deliveryInstructions: '',
    smsMobileNumber: '',
  },
}

export const populatedHomeDeliveryFormProps = {
  yourDetails: {
    firstName: 'John',
    lastName: 'Doe',
    telephone: '07777777789',
  },
  yourAddress: {
    address1: '216 Sesame St',
    postcode: 'W1D 1LA',
    city: 'London',
  },
}
