export const initialYourAddressProps = {
  yourAddressFormName: 'yourAddress',
  shippingDestination: 'United Kingdom',
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
      'United States': {
        stateFieldType: 'other',
      },
      'Trinidad & Tobago': {
        stateFieldType: 'input',
      },
    },
    qasCountries: {
      'United Kingdom': 'GBR',
    },
  },
  findAddressState: {
    isManual: true,
    monikers: [],
  },
  siteOptions: {
    USStates: ['AL', 'AK', 'AZ', 'AR'],
  },
  setManualAddressMode: jest.fn(),
  resetAddress: jest.fn(),
  resetForm: jest.fn(),
  setFormField: jest.fn(),
  touchedFormField: jest.fn(),
}

export const initialYourAddressFormProps = {
  yourAddressForm: {
    address1: null,
    address2: null,
    city: null,
    state: null,
    country: null,
    postcode: null,
    county: null,
  },
}

export const populatedYourAddressFormProps = {
  yourAddressForm: {
    address1: 'Sesame St',
    address2: null,
    city: 'Wonderland',
    state: 'Nowhere',
    country: 'United Kingdom',
    postcode: null,
    county: null,
  },
}
