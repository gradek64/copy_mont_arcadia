import returnHistoryReducer from '../ReturnHistoryReducer'

describe('returnHistoryReducer', () => {
  const returnDetailItem = {
    rmaId: 88506,
    orderId: 1303603,
    subTotal: '0.50',
    deliveryPrice: '0.00',
    totalOrderPrice: '0.50',
    totalOrdersDiscountLabel: '',
    totalOrdersDiscount: '£0.00',
    orderLines: [
      {
        lineNo: '19M43JRED',
        name: 'Pizza Princess Padded Sticker',
        size: 'ONE',
        colour: 'RED',
        imageUrl:
          'http://ts.stage.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/TS19M43JRED_Small_F_1.jpg',
        returnQuantity: 1,
        returnReason: 'Colour not as description',
        unitPrice: '',
        discount: '',
        total: '0.50',
        nonRefundable: false,
      },
    ],
    paymentDetails: [
      {
        paymentMethod: 'GiftCard',
        cardNumberStar: '************4258',
        totalCost: '£0.50',
      },
    ],
  }

  const initialState = {
    returns: [],
    returnDetails: {},
  }

  describe('returnDetails', () => {
    it('sets returnDetails when called with SET_RETURN_HISTORY_DETAILS', () => {
      const returned = returnHistoryReducer(initialState, {
        type: 'SET_RETURN_HISTORY_DETAILS',
        returnDetails: returnDetailItem,
      })

      expect(returned).toEqual({
        returns: [],
        returnDetails: returnDetailItem,
      })
    })
  })

  describe('returns', () => {
    const returnsList = [1, 2, 3]

    it('sets returns when called with SET_RETURN_HISTORY_RETURNS', () => {
      const returned = returnHistoryReducer(initialState, {
        type: 'SET_RETURN_HISTORY_RETURNS',
        returns: returnsList,
      })

      expect(returned).toEqual({
        returns: returnsList,
        returnDetails: {},
      })
    })
  })
})
