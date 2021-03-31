/* eslint-disable */

const selectedBrandFulfilmentStore = {
  storeId: 'BR0057',
  brandPrimaryEStoreId: 12551,
  brandName: 'Burton',
  name: 'Lakeside',
  distance: 0,
  latitude: 51.487505,
  longitude: 0.282531,
  address: {
    line1: 'Unit 242 Lakeside Centre',
    line2: '',
    city: 'West Thurrock',
    postcode: 'RM20 2ZQ',
  },
  openingHours: {
    monday: '10:00-22:00',
    tuesday: '10:00-22:00',
    wednesday: '10:00-22:00',
    thursday: '10:00-22:00',
    friday: '10:00-22:00',
    saturday: '09:00-21:00',
    sunday: '11:00-17:00',
  },
  telephoneNumber: '01708 890310',
  collectFromStore: {
    standard: {
      dates: [
        {
          availableUntil: '2017-09-28 11:30:00',
          collectFrom: '2017-10-03',
        },
        {
          availableUntil: '2017-10-01 05:30:00',
          collectFrom: '2017-10-05',
        },
        {
          availableUntil: '2017-10-02 11:30:00',
          collectFrom: '2017-10-06',
        },
      ],
      price: 0,
    },
    express: {
      dates: [
        {
          availableUntil: '2017-09-28 20:30:00',
          collectFrom: '2017-09-29',
        },
        {
          availableUntil: '2017-09-29 20:30:00',
          collectFrom: '2017-09-30',
        },
        {
          availableUntil: '2017-10-01 16:30:00',
          collectFrom: '2017-10-02',
        },
      ],
      price: 2.95,
    },
  },
  // If `cfsiAvailableOn` contains today's date and `cfsiPickCutOffTime` has not already passed,
  // then CFSi should not be disabled.
  // So we add today's date and set the cut off to be a second before midnight so that for this mock, CFSi is always enabled.
  cfsiAvailableOn:
    '2017-09-28,2017-09-29,2017-09-30,' +
    new Date().toISOString().split('T')[0],
  cfsiPickCutOffTime: '23:59:59',
  ffsAvailableOn: '',
  stockList: [
    {
      sku: '152017000340730',
      stock: 23,
      stockSymbol: 'I                           ',
    },
  ],
}

const checkout = {
  orderCompleted: {},
  orderSummary: {
    basket: {
      orderId: 1859778,
      subTotal: '8.40',
      total: '8.40',
      totalBeforeDiscount: '.00',
      deliveryOptions: [
        {
          deliveryOptionId: 50522,
          label: 'Collect From Store Today £3.00',
          plainLabel: 'Collect From Store Today',
          selected: false,
        },
        {
          deliveryOptionId: 47526,
          label: 'Collect from ParcelShop £3.95',
          plainLabel: 'Collect from ParcelShop',
          type: 'parcelshop',
          selected: false,
        },
        {
          deliveryOptionExternalId: 's',
          deliveryOptionId: 26503,
          label: 'Standard Delivery £3.95',
          plainLabel: 'Standard Delivery',
          type: 'home_standard',
          selected: false,
        },
        {
          deliveryOptionExternalId: 'retail_store_express',
          deliveryOptionId: 45022,
          label: 'Collect In Store Exp Next Day(Excl Sun) £2.95',
          plainLabel: 'Collect In Store Exp Next Day(Excl Sun)',
          type: 'store_express',
          selected: false,
        },
        {
          deliveryOptionExternalId: 'retail_store_standard',
          deliveryOptionId: 45021,
          label: 'Free Collect In Store Std 2-7 Days £0.00',
          plainLabel: 'Free Collect In Store Std 2-7 Days',
          type: 'store_standard',
          selected: true,
        },
        {
          deliveryOptionExternalId: 'n4',
          deliveryOptionId: 28020,
          label: 'Express / Nominated Day Delivery £5.95',
          plainLabel: 'Express / Nominated Day Delivery',
          type: 'home_express',
          selected: false,
        },
      ],
      promotions: [],
      discounts: [],
      products: [
        {
          productId: 28823974,
          catEntryId: 28823975,
          orderItemId: 8296631,
          shipModeId: 45021,
          lineNumber: '19K05LGRY',
          size: '000',
          name: 'Grey Polka Dot Print Tie And Pocket Square Set',
          quantity: 1,
          lowStock: false,
          inStock: true,
          wasWasPrice: '12.00',
          unitPrice: '8.40',
          totalPrice: '8.40',
          assets: [
            {
              assetType: 'IMAGE_SMALL',
              index: 1,
              url:
                'http://media.burton.co.uk/wcsstore/Burton/images/catalog/BR19K05LGRY_Thumb_F_1.jpg',
            },
            {
              assetType: 'IMAGE_THUMB',
              index: 1,
              url:
                'http://media.burton.co.uk/wcsstore/Burton/images/catalog/BR19K05LGRY_Small_F_1.jpg',
            },
            {
              assetType: 'IMAGE_NORMAL',
              index: 1,
              url:
                'http://media.burton.co.uk/wcsstore/Burton/images/catalog/BR19K05LGRY_2col_F_1.jpg',
            },
            {
              assetType: 'IMAGE_LARGE',
              index: 1,
              url:
                'http://media.burton.co.uk/wcsstore/Burton/images/catalog/BR19K05LGRY_Zoom_F_1.jpg',
            },
          ],
          items: [],
          bundleProducts: [],
          attributes: {},
          colourSwatches: [],
          tpmLinks: [],
          bundleSlots: [],
          ageVerificationRequired: false,
          isBundleOrOutfit: false,
          inventorys: [
            {
              cutofftime: '2100',
              quantity: 10,
              ffmcenterId: 12551,
              expressdates: ['2017-09-29', '2017-09-30'],
            },
          ],
          invavls: [
            {
              stlocIdentifier: 'STANDARD',
              cutofftime: '2259',
              quantity: 10,
              expressdates: ['2017-09-29', '2017-09-30'],
            },
          ],
          sku: '152017000340730',
        },
      ],
      savedProducts: [],
      ageVerificationRequired: false,
      restrictedDeliveryItem: false,
      inventoryPositions: {
        item_1: {
          partNumber: '152017000340730',
          catentryId: '28823975',
          inventorys: [
            {
              cutofftime: '2100',
              quantity: 10,
              ffmcenterId: 12551,
              expressdates: ['2017-09-29', '2017-09-30'],
            },
          ],
          invavls: [
            {
              stlocIdentifier: 'STANDARD',
              cutofftime: '2259',
              quantity: 10,
              expressdates: ['2017-09-29', '2017-09-30'],
            },
          ],
        },
      },
    },
    deliveryLocations: [
      {
        deliveryLocationType: 'HOME',
        label:
          'Home Delivery Standard Delivery (up to 4 days) Next Day or Named Day Delivery (UK) Worldwide Delivery (times and prices vary)',
        selected: false,
        deliveryMethods: [],
      },
      {
        deliveryLocationType: 'STORE',
        label:
          'Collect from Store Standard Delivery (2 to 7 working days) Next Day Delivery',
        selected: true,
        deliveryMethods: [
          {
            shipModeId: 45022,
            deliveryType: 'STORE_EXPRESS',
            label: 'Collect In Store Exp Next Day(Excl Sun)',
            additionalDescription: 'Collection date Friday 29 September 2017',
            cost: '2.95',
            selected: false,
            enabled: false,
            deliveryOptions: [],
          },
          {
            shipModeId: 50522,
            deliveryType: 'STORE_IMMEDIATE',
            label: 'Collect From Store Today',
            additionalDescription: 'Collection date Friday 29 September 2017',
            cost: '3.00',
            selected: false,
            enabled: true,
            deliveryOptions: [],
          },
          {
            shipModeId: 45021,
            shipCode: 'Retail Store Standard',
            deliveryType: 'STORE_STANDARD',
            label: 'Collect In Store Std 2-7 Days',
            additionalDescription: 'Collection date Thursday 5 October 2017',
            selected: true,
            enabled: true,
            deliveryOptions: [],
          },
        ],
      },
      {
        deliveryLocationType: 'PARCELSHOP',
        label:
          'Collect from ParcelShop - UK only Thousands of local shops open early and late Next Day Delivery',
        selected: false,
        deliveryMethods: [],
      },
    ],
    deliveryStoreCode: 'BR0057',
    giftCards: [],
    deliveryInstructions: '',
    smsMobileNumber: '',
    shippingCountry: 'United Kingdom',
    storeDetails: {
      address1: 'Unit 242 Lakeside Centre',
      address2: '',
      city: 'West Thurrock',
      country: 'United Kingdom',
      postcode: 'RM20 2ZQ',
    },
    savedAddresses: [],
    ageVerificationDeliveryConfirmationRequired: false,
    estimatedDelivery: ['No later than Thursday 5 October 2017'],
    version: '1.7',
  },
  orderSummaryError: {},
  orderError: false,
  isDeliverySameAsBilling: true,
  useDeliveryAsBilling: true,
  verifyPayment: false,
  showExpressDeliveryOptionsOnSummary: false,
  editingDetails: false,
  storeUpdating: false,
  deliveryAndPayment: {
    deliveryEditingEnabled: false,
  },
  deliveryStore: {
    deliveryStoreCode: 'BR0057',
    storeAddress1: 'Unit 242 Lakeside Centre',
    storeAddress2: '',
    storeCity: 'West Thurrock',
    storePostcode: 'RM20 2ZQ',
  },
}

const config = {
  paymentSchema: ['type', 'cardNumber', 'expiryMonth', 'expiryYear'],
  customerDetailsSchema: [
    'title',
    'firstName',
    'lastName',
    'telephone',
    'country',
    'postcode',
    'address1',
    'address2',
    'city',
    'state',
    'type',
    'cardNumber',
    'expiryMonth',
    'expiryYear',
  ],
  checkoutAddressFormRules: {
    Albania: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Andorra: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Anguilla: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Argentina: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Armenia: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Australia: {
      pattern: '^[0-9]{4}$',
      stateFieldType: 'input',
      postcodeRequired: true,
      postcodeLabel: 'Postcode',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Austria: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Azerbaijan: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Bangladesh: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Barbados: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Belgium: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Bermuda: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Bolivia: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    'Bosnia and Herzegovina': {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Brazil: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Brunei: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Bulgaria: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Cambodia: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Canada: {
      pattern: '^[\\w ]+$',
      stateFieldType: 'input',
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    'Cayman Islands': {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Chile: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    China: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Colombia: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Croatia: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    'Czech Republic': {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Denmark: {
      pattern: '^[^\\s]*[0-9]{3,4}$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Estonia: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    'Falkland Islands': {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    'Faroe Islands': {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Finland: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    France: {
      pattern: '^[0-9]{5}$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postcode',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    'French Guiana': {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Germany: {
      pattern: '^[0-9]{5}$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postcode',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Greece: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Greenland: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Guadeloupe: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Guernsey: {
      pattern: '^[Gg][Yy]([0-9]|10)[ ]?[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postcode',
      premisesRequired: false,
      premisesLabel: 'House name or number',
    },
    'Holy See': {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Hungary: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    India: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Index Number',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Indonesia: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Ireland: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: false,
      postcodeLabel: 'Town or Locality',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Italy: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Japan: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Jersey: {
      pattern: '^[Jj][Ee]{1,2}[0-5][ ]?[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postcode',
      premisesRequired: false,
      premisesLabel: 'House name or number',
    },
    Kazakhstan: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    'Korea South': {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Kyrgyzstan: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Latvia: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Libya: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Liechtenstein: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Lithuania: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Luxembourg: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Madagascar: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Malaysia: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postcode',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Maldives: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    'Marshall Islands': {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Mexico: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Moldova: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Monaco: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Montenegro: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Morocco: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Nepal: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Netherlands: {
      pattern: '^[0-9]{4}[\\s][a-zA-Z]{2}$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    'New Caledonia': {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    'New Zealand': {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Niger: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Norway: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Oman: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Pakistan: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Palau: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Philippines: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Zip Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Poland: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Portugal: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    'Puerto Rico': {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Romania: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    'S Georgia & S Sandwich Islands': {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    'Saint Pierre and Miquelon': {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Samoa: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    'San Marino': {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Serbia: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Singapore: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Slovakia: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    'South Africa': {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Spain: {
      pattern: '^([a-zA-Z]{2}|[0-9]{2})[0-9]{3}$',
      stateFieldType: 'input',
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    'Sri Lanka': {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    'St Vincent and the Grenadines': {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    'Svalbard and Jan Mayen': {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Sweden: {
      pattern: '^[1-9][0-9]{2}[\\s][0-9]{2}$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Switzerland: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Taiwan: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Thailand: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Togo: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Tunisia: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Turkey: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postcode',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Turkmenistan: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Ukraine: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
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
      pattern: '^[0-9]{5}(-[0-9]{4}){0,1}$',
      stateFieldType: 'SELECT',
      postcodeRequired: true,
      postcodeLabel: 'Zip Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Uruguay: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    Vietnam: {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    'Virgin Islands British': {
      pattern: '^[\\w ]+$',
      stateFieldType: false,
      postcodeRequired: true,
      postcodeLabel: 'Postal Code',
      premisesRequired: true,
      premisesLabel: 'Street Address',
    },
    'Hong Kong S.A.R. of China': {
      pattern: '.',
      stateFieldType: false,
      postcodeRequired: false,
      postcodeLabel: 'Town or Locality',
      premisesRequired: false,
      premisesLabel: 'Street Address',
    },
  },
  qasCountries: {
    Canada: 'CAN',
    Denmark: 'DNK',
    Guernsey: 'GGY',
    India: 'IND',
    Indonesia: 'IDN',
    Jersey: 'JEY',
    Malaysia: 'MYS',
    Philippines: 'PHL ',
    Spain: 'ESP ',
    Sweden: 'SWE',
    Turkey: 'TUR',
    'United Kingdom': 'GBR',
  },
  analyticsId: 'arcadiabmmobile',
  googleTagManagerId: 'GTM-W6VVN27',
  stagingReportSuiteId: 'arcadiaburtonstage',
  prodReportSuiteId: 'arcadiaburtonrollup-prod',
  brandName: 'burton',
  siteId: 12551,
  storeCode: 'bruk',
  brandCode: 'br',
  region: 'uk',
  brandId: 6,
  name: 'Burton UK',
  lang: 'en',
  locale: 'gb',
  currencyCode: 'GBP',
  currencySymbol: '£',
  country: 'United Kingdom',
  defaultLanguage: 'English',
  bazaarVoiceId: '6028-en_gb',
  hostnames: ['m.burton.co.uk'],
  mediaHostname: 'media.burton.co.uk',
  language: 'en-gb',
  googleSiteVerification: '1Idtd6Vfos79ZnwmGEJYIg0-ec3F-jzuulQ06Qe_fuI',
  langHostnames: {
    'United Kingdom': {
      hostname: 'm.burton.co.uk',
      defaultLanguage: 'English',
    },
    default: {
      hostname: 'm.eu.burton-menswear.com',
      defaultLanguage: 'English',
    },
    nonEU: {
      hostname: 'm.burton.co.uk',
      defaultLanguage: 'English',
    },
  },
  isDaylightSavingTime: true,
  assets: {
    css: {
      'dorothyperkins/styles.css': '/assets/dorothyperkins/styles.css',
      'topshop/styles.css': '/assets/topshop/styles.css',
      'burton/styles.css': '/assets/burton/styles.css',
      'wallis/styles.css': '/assets/wallis/styles.css',
      'topman/styles.css': '/assets/topman/styles.css',
      'evans/styles.css': '/assets/evans/styles.css',
      'missselfridge/styles.css': '/assets/missselfridge/styles.css',
      'dorothyperkins/styles-tablet.css':
        '/assets/dorothyperkins/styles-tablet.css',
      'dorothyperkins/styles-laptop.css':
        '/assets/dorothyperkins/styles-laptop.css',
      'dorothyperkins/styles-desktop.css':
        '/assets/dorothyperkins/styles-desktop.css',
      'topshop/styles-tablet.css': '/assets/topshop/styles-tablet.css',
      'topshop/styles-laptop.css': '/assets/topshop/styles-laptop.css',
      'topshop/styles-desktop.css': '/assets/topshop/styles-desktop.css',
      'burton/styles-tablet.css': '/assets/burton/styles-tablet.css',
      'burton/styles-laptop.css': '/assets/burton/styles-laptop.css',
      'burton/styles-desktop.css': '/assets/burton/styles-desktop.css',
      'wallis/styles-tablet.css': '/assets/wallis/styles-tablet.css',
      'wallis/styles-laptop.css': '/assets/wallis/styles-laptop.css',
      'wallis/styles-desktop.css': '/assets/wallis/styles-desktop.css',
      'topman/styles-tablet.css': '/assets/topman/styles-tablet.css',
      'topman/styles-laptop.css': '/assets/topman/styles-laptop.css',
      'topman/styles-desktop.css': '/assets/topman/styles-desktop.css',
      'evans/styles-tablet.css': '/assets/evans/styles-tablet.css',
      'evans/styles-laptop.css': '/assets/evans/styles-laptop.css',
      'evans/styles-desktop.css': '/assets/evans/styles-desktop.css',
      'missselfridge/styles-tablet.css':
        '/assets/missselfridge/styles-tablet.css',
      'missselfridge/styles-laptop.css':
        '/assets/missselfridge/styles-laptop.css',
      'missselfridge/styles-desktop.css':
        '/assets/missselfridge/styles-desktop.css',
    },
    js: {
      'common/0.js': '/assets/common/0.js',
      'common/1.js': '/assets/common/1.js',
      'common/bundle.js': '/assets/common/bundle.js',
      'common/service-desk.js': '/assets/common/service-desk.js',
      'common/vendor.js': '/assets/common/vendor.js',
    },
    chunks: {
      '0': 'common/0.js',
      '1': 'common/1.js',
      '2': 'common/2.js',
      '3': 'common/3.js',
      '4': 'common/4.js',
      '5': 'common/5.js',
      '6': 'common/6.js',
      '7': 'common/7.js',
      '8': 'common/8.js',
      '9': 'common/9.js',
      '10': 'common/10.js',
      '11': 'common/11.js',
    },
  },
}

const features = {
  status: {
    FEATURE_SWATCHES: true,
    PASSWORD_SHOW_TOGGLE: false,
    FEATURE_CFS: true,
    FEATURE_PUDO: true,
    FEATURE_ORDER_HISTORY_MSG: false,
    FEATURE_HEADER_BIG: true,
    FEATURE_PDP_QUANTITY: false,
    FEATURE_RESPONSIVE: false,
    FEATURE_NEW_CHECKOUT: false,
    FEATURE_STORE_FINDER_HEADER_WITH_COUNTRY_SELECTOR: false,
    FEATURE_CVV_HELP: false,
    FEATURE_CFSI: true,
  },
  overrides: {
    FEATURE_CFSI: true,
  },
}

export { checkout, config, features, selectedBrandFulfilmentStore }
