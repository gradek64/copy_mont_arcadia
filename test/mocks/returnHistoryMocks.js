export const returnHistoryDetailsMockBase = {
  rmaId: 96506,
  orderId: 1644456,
  subTotal: 38.5,
  deliveryPrice: 0.0,
  totalOrderPrice: 31.0,
  totalOrdersDiscountLabel: '',
  totalOrdersDiscount: '£-7.50',
  orderLines: [
    {
      lineNo: '05J07MWBL',
      name: 'MOTO Corset Denim Jacket',
      size: 6,
      colour: 'Washed Black',
      imageUrl:
        'http://ts.stage.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/TS05J07MWBL_Small_F_1.jpg',
      returnQuantity: 1,
      returnReason: 'Colour not as description',
      unitPrice: '',
      discount: '',
      total: '24.11',
      nonRefundable: false,
    },
    {
      lineNo: '08L02MGRY',
      name: 'Sporty Tube Ankle Socks',
      size: 'ONE',
      colour: 'GREY',
      imageUrl:
        'http://ts.stage.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/TS08L02MGRY_Small_F_1.jpg',
      returnQuantity: 3,
      returnReason: 'Colour not as description',
      unitPrice: '',
      discount: '',
      total: 6.89,
      nonRefundable: false,
    },
  ],
}

export const returnHistoryDetailsMock = {
  ...returnHistoryDetailsMockBase,
  paymentDetails: [
    {
      paymentMethod: 'Visa',
      cardNumberStar: '************1111',
      totalCost: '£31.00',
    },
    {
      paymentMethod: 'PayPal',
      totalCost: '£12.00',
    },
  ],
}
