export const orderCompleted = {
  orderId: 887526,
  subTotal: '',
  returnPossible: false,
  returnRequested: false,
  deliveryMethod: 'Standard Delivery',
  deliveryDate: 'Wednesday 28 September 2016',
  deliveryCost: '4.00',
  deliveryCarrier: 'Parcelnet',
  deliveryPrice: '4.00',
  totalOrderPrice: '49.00',
  totalOrdersDiscountLabel: '',
  totalOrdersDiscount: '',
  billingAddress: {
    name: 'Ms willy wonka',
    address1: '2 Hockley Avenue',
    address2: 'LONDON',
    address3: 'E6 3AN',
    country: 'United Kingdom',
  },
  deliveryAddress: {
    name: 'Ms willy wonka',
    address1: '2 Hockley Avenue',
    address2: 'LONDON',
    address3: 'E6 3AN',
    country: 'United Kingdom',
  },
  orderLines: [
    {
      lineNo: '02Y16KBLC',
      name: 'MOTO Bleach Super Rip Jamie Jeans',
      size: 'W2430',
      colour: 'BLEACH STONE',
      imageUrl:
        '//media.topshop.com/wcsstore/TopShop/images/catalog/TS02Y16KBLC_Small_F_1.jpg',
      quantity: 1,
      unitPrice: '45.00',
      discount: '',
      total: '45.00',
      nonRefundable: false,
    },
  ],
  paymentDetails: [
    {
      paymentMethod: 'PayPal',
      cardNumberStar: '',
      totalCost: '£49.00',
    },
  ],
  currencyConversion: { currencyRate: 'GBP' },
  version: '1.6',
}

export const orderError = {
  statusCode: 404,
  error: 'Not Found',
  message: 'Remote 404',
  originalMessage: 'Remote 404',
}
