/* eslint quote-props: "off", quotes: "off", object-curly-spacing: "off" */
export const orderSummaryCollectFromParcelShop = {
  basket: {
    orderId: 345682957,
    subTotal: '49.00',
    total: '53.00',
    totalBeforeDiscount: '49.00',
    deliveryOptions: [
      {
        deliveryOptionId: 28007,
        label: 'Express / Nominated Day Delivery £6.00',
        type: 'home_express',
        selected: false,
      },
      {
        deliveryOptionId: 45020,
        label: 'Collect From Store Express £3.00',
        type: 'store_express',
        selected: false,
      },
      {
        deliveryOptionId: 47524,
        label: 'Collect from ParcelShop £4.00',
        type: 'parcelshop',
        selected: true,
      },
      {
        deliveryOptionId: 26504,
        label: 'UK Standard up to 4 working days £4.00',
        type: 'home_standard',
        selected: false,
      },
      {
        deliveryOptionId: 45019,
        label: 'Free Collect From Store Standard £0.00',
        type: 'store_standard',
        selected: false,
      },
    ],
    promotions: [],
    discounts: [],
    products: [
      {
        productId: 29127396,
        catEntryId: 29127435,
        orderItemId: 911612200,
        shipModeId: 47524,
        lineNumber: '32G33MPNK',
        size: '35',
        name: 'GIGGLE GHILLIE Pointed Tie-Up Heel Court Shoes',
        quantity: 1,
        lowStock: true,
        inStock: true,
        wasPrice: '',
        unitPrice: '49.00',
        totalPrice: '49.00',
        assets: [
          {
            assetType: 'IMAGE_SMALL',
            index: 1,
            url:
              'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS32G33MPNK_Thumb_F_1.jpg',
          },
          {
            assetType: 'IMAGE_THUMB',
            index: 1,
            url:
              'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS32G33MPNK_Small_F_1.jpg',
          },
          {
            assetType: 'IMAGE_NORMAL',
            index: 1,
            url:
              'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS32G33MPNK_2col_F_1.jpg',
          },
          {
            assetType: 'IMAGE_LARGE',
            index: 1,
            url:
              'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS32G33MPNK_Zoom_F_1.jpg',
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
      },
    ],
    savedProducts: [],
    ageVerificationRequired: false,
    restrictedDeliveryItem: false,
  },
  deliveryLocations: [
    {
      deliveryLocationType: 'HOME',
      label:
        'Home Delivery Standard (UK up to 4 working days; worldwide varies)  Express (UK next or nominated day; worldwide varies)',
      selected: false,
      deliveryMethods: [],
    },
    {
      deliveryLocationType: 'PARCELSHOP',
      label:
        'Collect from Store Standard (3-7 working days) Express (next day)',
      selected: true,
      deliveryMethods: [],
    },
  ],
  giftCards: [],
  deliveryInstructions: '',
  smsMobileNumber: '',
  shippingCountry: 'United Kingdom',
  savedAddresses: [],
  ageVerificationDeliveryConfirmationRequired: false,
  estimatedDelivery: ['No later than Saturday 5 August 2017'],
  version: '1.6',
}
