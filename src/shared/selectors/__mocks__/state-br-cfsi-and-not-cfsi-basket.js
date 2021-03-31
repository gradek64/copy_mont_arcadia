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
          availableUntil: '2017-10-02 11:30:00',
          collectFrom: '2017-10-06',
        },
        {
          availableUntil: '2017-10-04 11:30:00',
          collectFrom: '2017-10-08',
        },
        {
          availableUntil: '2017-10-05 11:30:00',
          collectFrom: '2017-10-10',
        },
      ],
      price: 0,
    },
    express: {
      dates: [
        {
          availableUntil: '2017-10-02 20:30:00',
          collectFrom: '2017-10-03',
        },
        {
          availableUntil: '2017-10-03 20:30:00',
          collectFrom: '2017-10-04',
        },
        {
          availableUntil: '2017-10-04 20:30:00',
          collectFrom: '2017-10-05',
        },
      ],
      price: 2.95,
    },
  },
  cfsiAvailableOn: '2017-10-02,2017-10-03,2017-10-04',
  ffsAvailableOn: '',
  cfsiPickCutOffTime: '15:00:00',
  stockList: [
    {
      sku: '152017000340730',
      stock: 23,
      stockSymbol: 'I                           ',
    },
    {
      sku: '152017000343146',
      stock: 0,
      stockSymbol: 'O                            ',
    },
  ],
}

const checkout = {
  orderCompleted: {},
  orderSummary: {
    basket: {
      orderId: 1867827,
      subTotal: '32.90',
      total: '32.90',
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
          deliveryOptionExternalId: 'retail_store_express',
          deliveryOptionId: 45022,
          label: 'Collect In Store Exp Next Day(Excl Sun) £2.95',
          plainLabel: 'Collect In Store Exp Next Day(Excl Sun)',
          type: 'store_express',
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
          deliveryOptionExternalId: 'retail_store_standard',
          deliveryOptionId: 45021,
          label: 'Free Collect In Store Std 2-7 Days £0.00',
          plainLabel: 'Free Collect In Store Std 2-7 Days',
          type: 'store_standard',
          selected: true,
        },
        {
          deliveryOptionExternalId: 'n4',
          deliveryOptionId: 28017,
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
          orderItemId: 8315534,
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
              expressdates: ['2017-10-03', '2017-10-04'],
            },
          ],
          invavls: [
            {
              stlocIdentifier: 'STANDARD',
              cutofftime: '2259',
              quantity: 9,
              expressdates: ['2017-10-03', '2017-10-04'],
            },
          ],
          sku: '152017000340730',
        },
        {
          productId: 29081029,
          catEntryId: 29081047,
          orderItemId: 8315641,
          shipModeId: 45021,
          lineNumber: '12S16KBLU',
          size: '30R',
          name: 'Blue Vintage Tyler Skinny Fit Ripped Jeans',
          quantity: 1,
          lowStock: true,
          inStock: true,
          wasWasPrice: '35.00',
          unitPrice: '24.50',
          totalPrice: '24.50',
          assets: [
            {
              assetType: 'IMAGE_SMALL',
              index: 1,
              url:
                'http://media.burton.co.uk/wcsstore/Burton/images/catalog/BR12S16KBLU_Thumb_F_1.jpg',
            },
            {
              assetType: 'IMAGE_THUMB',
              index: 1,
              url:
                'http://media.burton.co.uk/wcsstore/Burton/images/catalog/BR12S16KBLU_Small_F_1.jpg',
            },
            {
              assetType: 'IMAGE_NORMAL',
              index: 1,
              url:
                'http://media.burton.co.uk/wcsstore/Burton/images/catalog/BR12S16KBLU_2col_F_1.jpg',
            },
            {
              assetType: 'IMAGE_LARGE',
              index: 1,
              url:
                'http://media.burton.co.uk/wcsstore/Burton/images/catalog/BR12S16KBLU_Zoom_F_1.jpg',
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
              expressdates: ['2017-10-03', '2017-10-04'],
            },
          ],
          sku: '152017000343146',
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
              expressdates: [
                new Date(Date.now() + 86400000).toISOString().split('T')[0],
                new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
              ],
            },
          ],
          invavls: [
            {
              stlocIdentifier: 'STANDARD',
              cutofftime: '2259',
              quantity: 9,
              expressdates: ['2017-10-03', '2017-10-04'],
            },
          ],
        },
        item_2: {
          partNumber: '152017000343146',
          catentryId: '29081047',
          inventorys: [
            {
              cutofftime: '2100',
              quantity: 10,
              ffmcenterId: 12551,
              expressdates: ['2017-10-03', '2017-10-04'],
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
            additionalDescription: 'Collection date Tuesday 3 October 2017',
            cost: '2.95',
            selected: false,
            enabled: false,
            deliveryOptions: [],
          },
          {
            shipModeId: 50522,
            deliveryType: 'STORE_IMMEDIATE',
            label: 'Collect From Store Today',
            additionalDescription: 'Collection date Monday 2 October 2017',
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
            additionalDescription: 'Collection date Friday 6 October 2017',
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
    estimatedDelivery: ['No later than Friday 6 October 2017'],
    version: '1.7',
  },
  orderSummaryError: {},
  orderError: false,
  isDeliverySameAsBilling: true,
  useDeliveryAsBilling: false,
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
  checkoutAddressFormRules: {},
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
  assets: {},
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
