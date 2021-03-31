export const config = {
  currencyCode: 'GBP',
  lang: 'en',
  locale: 'gb',
  deliveryCountries: [
    { iso: 'DE', name: 'Germany' },
    { iso: 'GB', name: 'United Kingdom' },
  ],
}

export const orderSummary = {
  storeDetails: {
    adress1: 'blablabla',
  },
}

export const shoppingBag = {
  bag: {
    orderId: 12345678,
    total: '69.77',
    totalBeforeDiscount: '102.00',
    deliveryOptions: [
      {
        deliveryOptionId: 45020,
        label: 'Collect From Store Express £3.00',
        selected: false,
      },
      {
        deliveryOptionId: 26504,
        label: 'Standard Delivery £4.00',
        selected: true,
      },
    ],
    products: [
      {
        name: 'Phoenyx Black High Heel Sandal by Miss KG',
        quantity: 2,
        unitPrice: '49.00',
        totalPrice: '98.00',
        assets: [
          {
            assetType: 'IMAGE_SMALL',
            index: 1,
            url:
              'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS63K40JBLK_Thumb_F_1.jpg',
          },
        ],
      },
    ],
    discounts: [
      {
        label: 'Promotion Code',
        value: '12.23',
      },
      {
        label: 'Gift Card',
        value: '20.00',
      },
    ],
  },
}

export const yourAddress = {
  fields: {
    address1: { isDirty: true, value: 'delivery address1' },
    address2: { isDirty: true, value: 'delivery address2' },
    city: { isDirty: true, value: 'delivery city' },
    county: { isDirty: true, value: 'delivery county' },
    postcode: { isDirty: true, value: 'delivery postcode' },
    country: { isDirty: true, value: 'United Kingdom' },
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
    country: { isDirty: true, value: 'United Kingdom' },
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

export const user = {
  email: 'test@test.com',
}

export const klarnaForm = {
  fields: {
    email: {
      value: 'test@test.com',
    },
  },
}

const orderCompletePath = 'order-complete-v1'

export const props = {
  billingDetails,
  billingAddress,
  yourDetails,
  yourAddress,
  user,
  klarnaForm,
  config,
  shoppingBag,
  orderCompletePath,
}

export const expectedGetOrderInfo = {
  purchase_country: 'gb',
  purchase_currency: 'GBP',
  locale: `en-gb`,
  order_amount: 6977,
}

export const expectedDeliveryOptions = {
  name: 'Standard Delivery',
  quantity: 1,
  unit_price: 400,
  total_amount: 400,
}

export const expectedOrderLines = [
  {
    name: 'Phoenyx Black High Heel Sandal by Miss KG',
    quantity: 2,
    unit_price: 4900,
    total_amount: 9800,
    image_url:
      'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS63K40JBLK_Thumb_F_1.jpg',
  },
  {
    name: 'discount',
    quantity: 1,
    unit_price: -1223,
    total_amount: -1223,
  },
  {
    name: 'discount',
    quantity: 1,
    unit_price: -2000,
    total_amount: -2000,
  },
  {
    name: 'Standard Delivery',
    quantity: 1,
    unit_price: 400,
    total_amount: 400,
  },
]

export const expectedDeliveryAddressDetails = {
  given_name: 'delivery firstName',
  family_name: 'delivery lastName',
  title: 'delivery title',
  email: 'test@test.com',
  phone: '123-555-3456',
  street_address: 'delivery address1',
  street_address2: 'delivery address2',
  postal_code: 'delivery postcode',
  city: 'delivery city',
  region: 'delivery county',
  country: 'GB',
}

export const expectedBillingAddressDetails = {
  given_name: 'billing firstName',
  family_name: 'billing lastName',
  title: 'billing title',
  email: 'test@test.com',
  phone: '1235553456',
  street_address: 'billing address1',
  street_address2: 'billing address2',
  postal_code: 'billing postcode',
  city: 'billing city',
  region: 'billing county',
  country: 'GB',
}

export const expectedAddressDetails = {
  billing_address: expectedBillingAddressDetails,
  shipping_address: expectedDeliveryAddressDetails,
}

export const expectedSessionPayload = {
  ...expectedGetOrderInfo,
  order_lines: expectedOrderLines,
}

export const expectedFullPayloadAll = {
  ...expectedSessionPayload,
  ...expectedAddressDetails,
  merchant_urls: {
    confirmation:
      'https://www.topshop.com/order-complete-v1?klarnaOrderId=12345678',
  },
}

export const expectedFullPayloadNoLink = {
  ...expectedSessionPayload,
  ...expectedAddressDetails,
  merchant_urls: undefined,
}

export const expectedFullPayloadNoSession = {
  ...expectedAddressDetails,
  merchant_urls: undefined,
}

export const expectedSplitSelectedDelivery = ['Standard', 'Delivery', '£4.00']

export const parseDeliveryDetailsMocks = {
  a: {
    mock: ['Standard', 'Delivery', '£4.00'],
    expected: { deliveryName: 'Standard Delivery', priceString: '4.00' },
  },
  b: {
    mock: ['2', '-', '4', 'Day', 'Delivery', '16,00 $'],
    expected: { deliveryName: '2 - 4 Day Delivery', priceString: '16,00' },
  },
}

export const getDeliveryDetailsMocks = {
  a: {
    mock: [
      { selected: false },
      {
        deliveryOptionId: 45020,
        label: 'Standard Delivery £4.00',
        selected: true,
      },
    ],
    expected: { deliveryName: 'Standard Delivery', deliveryPrice: 4.0 },
  },
  b: {
    mock: [
      { selected: false },
      {
        deliveryOptionId: 45020,
        label: '2 - 4 Day Delivery 16,00 \u20AC',
        selected: true,
      },
    ],
    expected: { deliveryName: '2 - 4 Day Delivery', deliveryPrice: 16.0 },
  },
}

export const klarnaPayload = {
  billing_address: {
    city: 'billing city',
    country: 'GB',
    email: '',
    family_name: 'billing lastName',
    given_name: 'billing firstName',
    phone: '1235553456',
    postal_code: 'billing postcode',
    region: 'billing county',
    street_address: 'billing address1',
    street_address2: 'billing address2',
    title: 'billing title',
  },
  locale: 'en-gb',
  merchant_urls: undefined,
  order_amount: 6977,
  order_lines: [
    {
      image_url:
        'http://media.topshop.com/wcsstore/TopShop/images/catalog/TS63K40JBLK_Thumb_F_1.jpg',
      name: 'Phoenyx Black High Heel Sandal by Miss KG',
      quantity: 2,
      total_amount: 9800,
      unit_price: 4900,
    },
    { name: 'discount', quantity: 1, total_amount: -1223, unit_price: -1223 },
    {
      name: 'discount',
      quantity: 1,
      total_amount: -2000,
      unit_price: -2000,
    },
    {
      name: 'Standard Delivery',
      quantity: 1,
      total_amount: 400,
      unit_price: 400,
    },
  ],
  purchase_country: 'gb',
  purchase_currency: 'GBP',
  shipping_address: {
    city: 'delivery city',
    country: 'GB',
    email: '',
    family_name: 'delivery lastName',
    given_name: 'delivery firstName',
    phone: '123-555-3456',
    postal_code: 'delivery postcode',
    region: 'delivery county',
    street_address: 'delivery address1',
    street_address2: 'delivery address2',
    title: 'delivery title',
  },
}
