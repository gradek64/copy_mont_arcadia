const productMock = {
  productId: 24283410,
  lineNumber: 'TS13N21JNUD',
  name: 'Strappy Metallic Cami',
  unitPrice: '26.00',
  assets: [
    {
      assetType: 'IMAGE_SMALL',
      index: 1,
      url:
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS13N21JNUD_Thumb_F_1.jpg',
    },
    {
      assetType: 'IMAGE_THUMB',
      index: 1,
      url:
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS13N21JNUD_Small_F_1.jpg',
    },
    {
      assetType: 'IMAGE_NORMAL',
      index: 1,
      url:
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS13N21JNUD_2col_F_1.jpg',
    },
    {
      assetType: 'IMAGE_LARGE',
      index: 1,
      url:
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS13N21JNUD_Zoom_F_1.jpg',
    },
    {
      assetType: 'IMAGE_PROMO_GRAPHIC',
      index: 1,
      url:
        'http://media.topshop.com/wcsstore/TopShop/images/category_icons/promo_code_473094_mobile.png',
    },
  ],
  additionalAssets: [
    {
      assetType: 'IMAGE_ZOOM',
      index: 1,
      url:
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS13N21JNUD_Zoom_F_1.jpg',
    },
    {
      assetType: 'IMAGE_2COL',
      index: 1,
      url:
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS13N21JNUD_2col_F_1.jpg',
    },
    {
      assetType: 'IMAGE_3COL',
      index: 1,
      url:
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS13N21JNUD_3col_F_1.jpg',
    },
    {
      assetType: 'IMAGE_4COL',
      index: 1,
      url:
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS13N21JNUD_4col_F_1.jpg',
    },
    {
      assetType: 'IMAGE_OUTFIT_SMALL',
      index: 2,
      url:
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS13N21JNUD_Thumb_M_1.jpg',
    },
    {
      assetType: 'IMAGE_OUTFIT_THUMB',
      index: 2,
      url:
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS13N21JNUD_Small_M_1.jpg',
    },
    {
      assetType: 'IMAGE_OUTFIT_NORMAL',
      index: 2,
      url:
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS13N21JNUD_2col_M_1.jpg',
    },
    {
      assetType: 'IMAGE_OUTFIT_LARGE',
      index: 2,
      url:
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS13N21JNUD_Large_M_1.jpg',
    },
    {
      assetType: 'IMAGE_OUTFIT_ZOOM',
      index: 2,
      url:
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS13N21JNUD_Zoom_M_1.jpg',
    },
    {
      assetType: 'IMAGE_OUTFIT_2COL',
      index: 2,
      url:
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS13N21JNUD_2col_M_1.jpg',
    },
    {
      assetType: 'IMAGE_OUTFIT_3COL',
      index: 2,
      url:
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS13N21JNUD_3col_M_1.jpg',
    },
    {
      assetType: 'IMAGE_OUTFIT_4COL',
      index: 2,
      url:
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS13N21JNUD_4col_M_1.jpg',
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
}

export const initialMiniBagProps = {
  brandCode: 'ts',
  bagProducts: [productMock],
  bagDiscounts: null,
  bagDeliveryOptions: [
    {
      label: 'Free Collect From Store Standard £0.00',
      selected: true,
    },
  ],
  bagCount: 1,
  bagTotal: '26.00',
  currencyCode: 'GBP',
  miniBagOpen: true,
  autoClose: false,
  orderSummary: {
    basket: {
      subTotal: '26.00',
      total: '26.00',
    },
    deliveryLocations: [
      {
        deliveryLocationType: 'HOME',
        label: 'Home Delivery Standard',
        selected: true,
        deliveryMethods: [
          {
            deliveryType: 'HOME_STANDARD',
            selected: true,
            shipModeId: 26504,
            deliveryOptions: [],
          },
          {
            deliveryType: 'HOME_EXPRESS',
            selected: false,
            deliveryOptions: [
              {
                shipModeId: 28005,
                price: '6.00',
                selected: true,
              },
            ],
          },
        ],
      },
      {
        deliveryLocationType: 'STORE',
        label: 'Collect from Store',
        selected: false,
      },
    ],
    estimatedDelivery: 'No later than tomorrow',
  },
  isCFSIEnabled: false,
  isPUDOEnabled: false,
  isLockImageEnabled: false,
  closeMiniBag: jest.fn(),
  changeDeliveryType: jest.fn(),
  sendAnalyticsClickEvent: jest.fn(),
  getTrendingProducts: jest.fn(),
  getSocialProofBanners: jest.fn(),
}

export const initialMiniBagFormProps = {
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
