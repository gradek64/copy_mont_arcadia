export const postAddItemResponse = {
  orderId: 10696912,
  subTotal: '6.00',
  total: '9.95',
  totalBeforeDiscount: '6.00',
  deliveryOptions: [
    {
      selected: true,
      deliveryOptionId: 26506,
      deliveryOptionExternalId: 's',
      type: 'home_standard',
      label: 'Standard UK Delivery £3.95',
      enabled: true,
      plainLabel: 'Standard UK Delivery',
      shippingCost: 3.95,
    },
    {
      selected: false,
      deliveryOptionId: 47519,
      deliveryOptionExternalId: 'retail_store_collection',
      type: 'parcelshop',
      label: 'Collect from ParcelShop £3.95',
      enabled: true,
      plainLabel: 'Collect from ParcelShop',
      shippingCost: 3.95,
    },
    {
      selected: false,
      deliveryOptionId: 28024,
      deliveryOptionExternalId: 'n2',
      type: 'home_express',
      label: 'Next or Named Day Delivery £5.95',
      enabled: true,
      plainLabel: 'Next or Named Day Delivery',
      shippingCost: 5.95,
    },
  ],
  promotions: [],
  discounts: [],
  products: [
    {
      productId: 31914734,
      catEntryId: 31914436,
      orderItemId: 13509154,
      shipModeId: 26506,
      lineNumber: '56648460',
      size: '8',
      name: 'Coral Roll Sleeve T-Shirt',
      quantity: 1,
      inStock: true,
      unitPrice: '6.00',
      totalPrice: 6,
      assets: [
        {
          assetType: 'IMAGE_SMALL',
          index: 1,
          url:
            'https://images.dorothyperkins.com/i/DorothyPerkins/DP56648460_F_1.jpg?$Thumb$',
        },
        {
          assetType: 'IMAGE_THUMB',
          index: 1,
          url:
            'https://images.dorothyperkins.com/i/DorothyPerkins/DP56648460_F_1.jpg?$Small$',
        },
        {
          assetType: 'IMAGE_NORMAL',
          index: 1,
          url:
            'https://images.dorothyperkins.com/i/DorothyPerkins/DP56648460_F_1.jpg?$2col$',
        },
        {
          assetType: 'IMAGE_LARGE',
          index: 1,
          url:
            'https://images.dorothyperkins.com/i/DorothyPerkins/DP56648460_F_1.jpg?$Zoom$',
        },
      ],
      lowStock: false,
      items: [],
      bundleProducts: [],
      attributes: {
        ThresholdMessage: '',
        ECMC_PROD_SIZE_GUIDE_5: 'Clothing',
        IOBThumbnailSuffixes: '',
        SizeFit: '',
        ProductDefaultCopy: '',
        ecmcUpdatedTimestamp: '2018-06-01-15.12.32.000814',
        COLOUR_CODE: 'eb4747',
        ECMC_PROD_CE3_FIT_CLOTHING_5: 'Regular',
        IOThumbnailSuffixes: 'D_1.jpg|F_1.jpg|M_1.jpg|M_2.jpg|M_3.jpg',
        has360: 'N',
        REAL_COLOURS: 'fb6850|f9dbd5|49322f',
        RRP: '0.0',
        Department: '56',
        EmailBackInStock: 'N',
        STORE_DELIVERY: 'true',
        ecmcCreatedTimestamp: '2018-05-14-22.58.52.000177',
        ECMC_PROD_CE3_PRODUCT_TYPE_5: 'Tops',
        StyleCode: '0',
        thumbnailImageSuffixes: '_',
        ECMC_PROD_CE3_BRAND_5: 'Dorothy Perkins',
        b_hasVideo: 'N',
        b_thumbnailImageSuffixes: '',
        ECMC_PROD_PRODUCT_TYPE_5: 'Clothing',
        CE3BThumbnailSuffixes: '',
        hasVideo: 'N',
        countryExclusion: '',
        STYLE_CODE: 'NO_SWATCH_5416370',
        shopTheOutfitBundleCode: '',
        ECMC_PROD_CE3_OB_OR_CONC_5: 'Own Bought',
        IFSeason: 'AW18',
        SearchKeywords: '',
        b_hasImage: 'N',
        CE3ThumbnailSuffixes: 'D_1.jpg|F_1.jpg|M_1.jpg|M_2.jpg|M_3.jpg',
        b_has360: 'N',
        NotifyMe: 'N',
        ECMC_PROD_CE3_TOP_STYLE_5: 'T-shirt',
        ECMC_PROD_COLOUR_5: 'PINK',
      },
      colourSwatches: [],
      tpmLinks: [],
      bundleSlots: [],
      ageVerificationRequired: false,
      isBundleOrOutfit: false,
      discountText: '',
      restrictedDeliveryItem: false,
      baseImageUrl:
        'https://images.dorothyperkins.com/i/DorothyPerkins/DP56648460_F_1',
      iscmCategory: '023',
      freeItem: false,
      isDDPProduct: false,
      sourceUrl: '/en/dpuk/product/coral-roll-sleeve-t-shirt-7748459',
    },
  ],
  savedProducts: [],
  ageVerificationRequired: false,
  restrictedDeliveryItem: false,
  inventoryPositions: {
    item_1: {
      partNumber: '262018000981431',
      catentryId: '31914436',
      inventorys: [
        {
          cutofftime: '2100',
          quantity: 99999,
          ffmcenterId: 12552,
          expressdates: ['2021-02-26', '2021-02-27'],
        },
      ],
      invavls: null,
    },
  },
  isDDPOrder: false,
  isBasketResponse: true,
  isOrderCoveredByGiftCards: false,
  isGiftCardRedemptionEnabled: false,
  isGiftCardValueThresholdMet: false,
  giftCardRedemptionPercentage: 100,
  deliveryThresholdsJson:
    '%7B%22nudgeMessageThreshold%22%3A30.0%2C%22standardDeliveryThreshold%22%3A50.0%7D%0A',
  isClearPayAvailable: true,
}

export const getPayments = [
  {
    value: 'VISA',
    type: 'CARD',
    label: 'Visa',
    description: 'Pay with VISA',
    icon: 'icon-visa.svg',
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
    icon: 'icon-mastercard.svg',
    validation: {
      cardNumber: { length: 16, message: 'A 16 digit card number is required' },
      cvv: { length: 3, message: '3 digits required' },
      expiryDate: 'MM/YY',
      startDate: null,
    },
  },
  {
    value: 'SWTCH',
    type: 'CARD',
    label: 'Switch/Maestro',
    description: 'Pay with Switch / Maestro',
    icon: 'icon-switch.svg',
    validation: {
      cardNumber: { length: 16, message: 'A 16 digit card number is required' },
      cvv: { length: 3, message: '3 digits required' },
      expiryDate: 'MM/YY',
      startDate: null,
    },
  },
  {
    value: 'APPLE',
    type: 'OTHER',
    label: 'Apple Pay',
    description: 'Pay with Apple Pay',
    icon: 'icon_applepay.svg',
  },
  {
    value: 'PYPAL',
    type: 'OTHER',
    label: 'PayPal',
    description: 'Check out with your PayPal account',
    icon: 'icon-paypal.svg',
  },
  {
    value: 'ALIPY',
    type: 'OTHER',
    label: 'AliPay',
    description: 'Check out with your AliPay account',
    icon: 'icon-alipay.svg',
    billingCountry: ['China'],
  },
  {
    value: 'CUPAY',
    type: 'OTHER',
    label: 'China Union Pay',
    description: 'Check out with your China Union Pay account',
    icon: 'icon-cupay.svg',
    billingCountry: ['China'],
  },
  {
    value: 'ACCNT',
    type: 'OTHER_CARD',
    label: 'Account Card',
    description: 'Pay with Account Card',
    icon: 'icon-account-card.svg',
    validation: {
      cardNumber: { length: 16, message: 'A 16 digit card number is required' },
      cvv: { length: 3, message: '3 digits required' },
      expiryDate: 'MM/YY',
      startDate: null,
    },
  },
  {
    value: 'CLRPY',
    type: 'OTHER',
    label: 'Clearpay',
    description: 'Pay in 4 fortnightly instalments, interest free',
    icon: 'clearpay.svg',
    billingCountry: ['United Kingdom'],
  },
]

export const deleteItemResponse = {
  orderId: 10696912,
  subTotal: '0.00',
  total: '0.00',
  totalBeforeDiscount: '0.00',
  deliveryOptions: [],
  promotions: [],
  discounts: [],
  products: [],
  savedProducts: [],
  ageVerificationRequired: false,
  restrictedDeliveryItem: false,
  inventoryPositions: {},
  isDDPOrder: false,
  isOrderCoveredByGiftCards: false,
  isGiftCardRedemptionEnabled: false,
  isGiftCardValueThresholdMet: false,
  giftCardRedemptionPercentage: 100,
  deliveryThresholdsJson: '%7B%7D',
  isClearPayAvailable: false,
}

export const getOrderSummary = {
  isGuestOrder: true,
  basket: {
    orderId: 10696912,
    subTotal: '16.00',
    total: '19.95',
    totalBeforeDiscount: '16.00',
    deliveryOptions: [
      {
        selected: true,
        deliveryOptionId: 26506,
        deliveryOptionExternalId: 's',
        type: 'home_standard',
        label: 'Standard UK Delivery £3.95',
        enabled: true,
        plainLabel: 'Standard UK Delivery',
        shippingCost: 3.95,
      },
      {
        selected: false,
        deliveryOptionId: 47519,
        deliveryOptionExternalId: 'retail_store_collection',
        type: 'parcelshop',
        label: 'Collect from ParcelShop £3.95',
        enabled: true,
        plainLabel: 'Collect from ParcelShop',
        shippingCost: 3.95,
      },
      {
        selected: false,
        deliveryOptionId: 28025,
        deliveryOptionExternalId: 'n3',
        type: 'home_express',
        label: 'Next or Named Day Delivery £5.95',
        enabled: true,
        plainLabel: 'Next or Named Day Delivery',
        shippingCost: 5.95,
      },
    ],
    promotions: [],
    discounts: [],
    products: [
      {
        productId: 31845427,
        catEntryId: 31845430,
        orderItemId: 13509155,
        shipModeId: 26506,
        lineNumber: '79131723',
        size: '4',
        name: 'Petite Red Embroidered Stripe Print T-Shirt',
        quantity: 1,
        inStock: true,
        unitPrice: '16.00',
        totalPrice: 16,
        assets: [
          {
            assetType: 'IMAGE_SMALL',
            index: 1,
            url:
              'https://images.dorothyperkins.com/i/DorothyPerkins/DP79131723_F_1.jpg?$Thumb$',
          },
          {
            assetType: 'IMAGE_THUMB',
            index: 1,
            url:
              'https://images.dorothyperkins.com/i/DorothyPerkins/DP79131723_F_1.jpg?$Small$',
          },
          {
            assetType: 'IMAGE_NORMAL',
            index: 1,
            url:
              'https://images.dorothyperkins.com/i/DorothyPerkins/DP79131723_F_1.jpg?$2col$',
          },
          {
            assetType: 'IMAGE_LARGE',
            index: 1,
            url:
              'https://images.dorothyperkins.com/i/DorothyPerkins/DP79131723_F_1.jpg?$Zoom$',
          },
        ],
        lowStock: true,
        items: [],
        bundleProducts: [],
        attributes: {
          ecmcCreatedTimestamp: '2018-05-04-14.46.08.000098',
          StyleCode: '0',
          thumbnailImageSuffixes: '_',
          b_has360: 'N',
          b_hasImage: 'N',
          b_hasVideo: 'N',
          b_thumbnailImageSuffixes: '',
          Department: '79',
          has360: 'N',
          hasVideo: 'N',
          IFSeason: 'SS18',
          ProductDefaultCopy: '',
          shopTheOutfitBundleCode: '',
          countryExclusion: '',
          CE3ThumbnailSuffixes: 'F_1.jpg',
          CE3BThumbnailSuffixes: '',
          IOThumbnailSuffixes: 'F_1.jpg',
          IOBThumbnailSuffixes: '',
          ThresholdMessage: '',
          SizeFit: '',
          SearchKeywords: '',
          RRP: '0.0',
          NotifyMe: 'N',
          ecmcUpdatedTimestamp: '2018-06-01-15.02.57.000421',
          EmailBackInStock: 'N',
          STORE_DELIVERY: 'true',
          STYLE_CODE: 'NO_SWATCH_5406788',
          COLOUR_CODE: 'a32952',
          REAL_COLOURS: 'b43e3c|dfd9d4|443531',
          ECMC_PROD_SIZE_GUIDE_5: 'Petite',
          ECMC_PROD_PRODUCT_TYPE_5: 'Clothing',
          ECMC_PROD_COLOUR_5: 'BLUE',
          ECMC_PROD_CE3_OB_OR_CONC_5: 'Own Bought',
          ECMC_PROD_CE3_FIT_CLOTHING_5: 'Petite',
          ECMC_PROD_CE3_PRODUCT_TYPE_5: 'Tops',
          ECMC_PROD_CE3_BRAND_5: 'Dorothy Perkins',
          ECMC_PROD_CE3_TOP_STYLE_5: 'T-shirt',
        },
        colourSwatches: [],
        tpmLinks: [],
        bundleSlots: [],
        ageVerificationRequired: false,
        isBundleOrOutfit: false,
        discountText: '',
        restrictedDeliveryItem: false,
        baseImageUrl:
          'https://images.dorothyperkins.com/i/DorothyPerkins/DP79131723_F_1',
        iscmCategory: '061',
        freeItem: false,
        isDDPProduct: false,
        sourceUrl:
          '/en/dpuk/product/petite-red-embroidered-stripe-print-t-shirt-7748371',
      },
    ],
    savedProducts: [],
    ageVerificationRequired: false,
    restrictedDeliveryItem: false,
    inventoryPositions: {
      item_1: {
        partNumber: '262018000978634',
        catentryId: '31845430',
        inventorys: [
          {
            cutofftime: '2100',
            quantity: 9,
            ffmcenterId: 16001,
            expressdates: ['2021-02-26', '2021-02-27'],
          },
        ],
        invavls: null,
      },
    },
    isDDPOrder: false,
    isBasketResponse: true,
    isOrderCoveredByGiftCards: false,
    isGiftCardRedemptionEnabled: false,
    isGiftCardValueThresholdMet: false,
    giftCardRedemptionPercentage: 50,
    deliveryThresholdsJson: '%7B%7D',
    isClearPayAvailable: true,
  },
  deliveryLocations: [
    {
      deliveryLocationType: 'HOME',
      selected: true,
      enabled: true,
      label: 'undefined ',
      deliveryMethods: [
        {
          shipModeId: 26506,
          deliveryType: 'HOME_STANDARD',
          label: 'Standard UK Delivery',
          additionalDescription: 'Up to 4 days',
          selected: true,
          deliveryOptions: [],
          enabled: true,
          cost: '3.95',
          estimatedDeliveryDate: 'Monday 8 March 2021',
          shipCode: 'S',
        },
        {
          label: 'Next or Named Day Delivery',
          additionalDescription: '',
          selected: false,
          deliveryType: 'HOME_EXPRESS',
          deliveryOptions: [
            {
              dayText: 'Wed',
              dateText: '03 Mar',
              nominatedDate: '2021-03-03',
              selected: true,
              shipModeId: 28025,
              price: '5.95',
              enabled: true,
            },
            {
              dayText: 'Thu',
              dateText: '04 Mar',
              nominatedDate: '2021-03-04',
              selected: false,
              shipModeId: 28026,
              price: '5.95',
              enabled: true,
            },
            {
              dayText: 'Fri',
              dateText: '05 Mar',
              nominatedDate: '2021-03-05',
              selected: false,
              shipModeId: 28027,
              price: '5.95',
              enabled: true,
            },
            {
              dayText: 'Sat',
              dateText: '06 Mar',
              nominatedDate: '2021-03-06',
              selected: false,
              shipModeId: 28028,
              price: '5.95',
              enabled: true,
            },
            {
              dayText: 'Sun',
              dateText: '07 Mar',
              nominatedDate: '2021-03-07',
              selected: false,
              shipModeId: 28029,
              price: '6.50',
              enabled: true,
            },
            {
              dayText: 'Mon',
              dateText: '08 Mar',
              nominatedDate: '2021-03-08',
              selected: false,
              shipModeId: 28023,
              price: '5.95',
              enabled: true,
            },
          ],
          enabled: true,
          cost: '5.95',
          shipCode: '',
        },
      ],
    },
    {
      deliveryLocationType: 'STORE',
      selected: false,
      enabled: false,
      label: 'undefined ',
      deliveryMethods: [],
    },
    {
      deliveryLocationType: 'PARCELSHOP',
      selected: false,
      enabled: true,
      label: 'undefined ',
      deliveryMethods: [],
    },
  ],
  giftCards: [],
  deliveryInstructions: '',
  smsMobileNumber: '',
  shippingCountry: 'United Kingdom',
  savedAddresses: [],
  ageVerificationDeliveryConfirmationRequired: false,
  estimatedDelivery: ['No later than Monday 8 March 2021'],
  checkoutDiscountIntroEspot: {
    EspotContents: {
      cmsMobileContent: {
        pageId: 55535,
        pageName: 'static-0000055535',
        breadcrumb: '',
        baseline: '35',
        revision: '0',
        lastPublished: '2018-04-27 14:29:56.31073',
        contentPath:
          'cms/pages/static/static-0000055535/static-0000055535.html',
        seoUrl: '',
        mobileCMSUrl: '',
        responsiveCMSUrl: '',
      },
      encodedcmsMobileContent:
        '%3C%21--+CMS+Page+Version%3A+static-0000055535+baseline%3A+35+revision%3A+0+published%3A+2018-04-27+14%3A29%3A56.31073%3AMaria+Kallipoliti+--%3E+%3C%21--+CMS+Page+Data+Start+--%3E+%3Cscript+type%3D%22text%2Fjavascript%22%3E+%2F%2F%3C%21%5BCDATA%5B+var+cmsPage55535+%3D+%7B+%22pageId%22%3A+55535%2C+%22pageName%22%3A+%22static-0000055535%22%2C+%22breadcrumb%22%3A+%22%22%2C+%22baseline%22%3A+%2235%22%2C+%22revision%22%3A+%220%22%2C+%22lastPublished%22%3A+%222018-04-27+14%3A29%3A56.31073%22%2C+%22contentPath%22%3A+%22cms%2Fpages%2Fstatic%2Fstatic-0000055535%2Fstatic-0000055535.html%22%2C+%22seoUrl%22%3A+%22%22%2C+%22mobileCMSUrl%22%3A+%22%22%2C+%22responsiveCMSUrl%22%3A+%22%22+%7D+%2F%2F%5D%5D%3E+%3C%2Fscript%3E+%3C%21--+CMS+Page+Data+End+--%3E+%3C%21--+CMS+Temp+Version%3A+template-0000003101+baseline%3A+4+revision%3A+0+description%3A+Basic+Espot+-+Secure+%28MASTER%29+%28REF+0000003100%29+published%3A+2010-11-22+11%3A27%3A55.28767+--%3E+%3Clink+rel%3D%22stylesheet%22+type%3D%22text%2Fcss%22+href%3D%22%2Fwcsstore%2FConsumerDirectStorefrontAssetStore%2Fimages%2Fcolors%2Fcolor3%2Fcms%2Ftemplates%2Fstatic%2Ftemplate-0000003101%2Fcss%2Fdefault.css%22+%2F%3E+%3C%21--Using+Master+Template%3A+%2Fstatic%2Ftemplate-0000003100+--%3E+',
    },
  },
  deliveryDetails: {
    addressDetailsId: 7109111,
    nameAndPhone: {
      lastName: '',
      telephone: '',
      title: '',
      firstName: '',
    },
    address: {
      address1: '',
      address2: '',
      city: '',
      state: '',
      country: 'United Kingdom',
      postcode: '',
    },
  },
}

export const getItems = {
  orderId: 10696912,
  subTotal: '16.00',
  total: '19.95',
  totalBeforeDiscount: '16.00',
  deliveryOptions: [
    {
      selected: false,
      deliveryOptionId: 28025,
      deliveryOptionExternalId: 'n3',
      type: 'home_express',
      label: 'Next or Named Day Delivery £5.95',
      enabled: true,
      plainLabel: 'Next or Named Day Delivery',
      shippingCost: 5.95,
    },
    {
      selected: false,
      deliveryOptionId: 47519,
      deliveryOptionExternalId: 'retail_store_collection',
      type: 'parcelshop',
      label: 'Collect from ParcelShop £3.95',
      enabled: true,
      plainLabel: 'Collect from ParcelShop',
      shippingCost: 3.95,
    },
    {
      selected: true,
      deliveryOptionId: 26506,
      deliveryOptionExternalId: 's',
      type: 'home_standard',
      label: 'Standard UK Delivery £3.95',
      enabled: true,
      plainLabel: 'Standard UK Delivery',
      shippingCost: 3.95,
    },
  ],
  promotions: [],
  discounts: [],
  products: [
    {
      productId: 31845427,
      catEntryId: 31845430,
      orderItemId: 13509155,
      shipModeId: 26506,
      lineNumber: '79131723',
      size: '4',
      name: 'Petite Red Embroidered Stripe Print T-Shirt',
      quantity: 1,
      inStock: true,
      unitPrice: '16.00',
      totalPrice: 16,
      assets: [
        {
          assetType: 'IMAGE_SMALL',
          index: 1,
          url:
            'https://images.dorothyperkins.com/i/DorothyPerkins/DP79131723_F_1.jpg?$Thumb$',
        },
        {
          assetType: 'IMAGE_THUMB',
          index: 1,
          url:
            'https://images.dorothyperkins.com/i/DorothyPerkins/DP79131723_F_1.jpg?$Small$',
        },
        {
          assetType: 'IMAGE_NORMAL',
          index: 1,
          url:
            'https://images.dorothyperkins.com/i/DorothyPerkins/DP79131723_F_1.jpg?$2col$',
        },
        {
          assetType: 'IMAGE_LARGE',
          index: 1,
          url:
            'https://images.dorothyperkins.com/i/DorothyPerkins/DP79131723_F_1.jpg?$Zoom$',
        },
      ],
      lowStock: true,
      items: [],
      bundleProducts: [],
      attributes: {
        ThresholdMessage: '',
        ECMC_PROD_SIZE_GUIDE_5: 'Petite',
        IOBThumbnailSuffixes: '',
        SizeFit: '',
        ProductDefaultCopy: '',
        ecmcUpdatedTimestamp: '2018-06-01-15.02.57.000421',
        COLOUR_CODE: 'a32952',
        ECMC_PROD_CE3_FIT_CLOTHING_5: 'Petite',
        IOThumbnailSuffixes: 'F_1.jpg',
        has360: 'N',
        REAL_COLOURS: 'b43e3c|dfd9d4|443531',
        RRP: '0.0',
        Department: '79',
        EmailBackInStock: 'N',
        STORE_DELIVERY: 'true',
        ecmcCreatedTimestamp: '2018-05-04-14.46.08.000098',
        ECMC_PROD_CE3_PRODUCT_TYPE_5: 'Tops',
        StyleCode: '0',
        thumbnailImageSuffixes: '_',
        ECMC_PROD_CE3_BRAND_5: 'Dorothy Perkins',
        b_hasVideo: 'N',
        b_thumbnailImageSuffixes: '',
        ECMC_PROD_PRODUCT_TYPE_5: 'Clothing',
        CE3BThumbnailSuffixes: '',
        hasVideo: 'N',
        countryExclusion: '',
        STYLE_CODE: 'NO_SWATCH_5406788',
        shopTheOutfitBundleCode: '',
        ECMC_PROD_CE3_OB_OR_CONC_5: 'Own Bought',
        IFSeason: 'SS18',
        SearchKeywords: '',
        b_hasImage: 'N',
        CE3ThumbnailSuffixes: 'F_1.jpg',
        b_has360: 'N',
        NotifyMe: 'N',
        ECMC_PROD_CE3_TOP_STYLE_5: 'T-shirt',
        ECMC_PROD_COLOUR_5: 'BLUE',
      },
      colourSwatches: [],
      tpmLinks: [],
      bundleSlots: [],
      ageVerificationRequired: false,
      isBundleOrOutfit: false,
      discountText: '',
      restrictedDeliveryItem: false,
      baseImageUrl:
        'https://images.dorothyperkins.com/i/DorothyPerkins/DP79131723_F_1',
      iscmCategory: '061',
      freeItem: false,
      isDDPProduct: false,
      sourceUrl:
        '/en/dpuk/product/petite-red-embroidered-stripe-print-t-shirt-7748371',
    },
  ],
  savedProducts: [],
  ageVerificationRequired: false,
  restrictedDeliveryItem: false,
  inventoryPositions: {
    item_1: {
      partNumber: '262018000978634',
      catentryId: '31845430',
      inventorys: [
        {
          cutofftime: '2100',
          quantity: 9,
          ffmcenterId: 16001,
          expressdates: ['2021-02-26', '2021-02-27'],
        },
      ],
      invavls: null,
    },
  },
  isDDPOrder: false,
  isBasketResponse: true,
  isOrderCoveredByGiftCards: false,
  isGiftCardRedemptionEnabled: false,
  isGiftCardValueThresholdMet: false,
  giftCardRedemptionPercentage: 100,
  deliveryThresholdsJson:
    '%7B%22nudgeMessageThreshold%22%3A30.0%2C%22standardDeliveryThreshold%22%3A50.0%7D%0A',
  isClearPayAvailable: true,
}
