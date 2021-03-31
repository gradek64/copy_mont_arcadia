import {
  paymentDetailsFragment,
  orderLineFragment,
  returnDetails,
} from '../returnDetails'
import wcs from '../../../../../../test/apiResponses/return-details/wcs.json'
import monty from '../../../../../../test/apiResponses/return-details/hapiMonty.json'

const emptyPaymentDetails = [
  {
    paymentMethod: '',
    cardNumberStar: '',
    totalCost: '£0.00',
  },
]

const emptyOrderLineFragment = {
  lineNo: '',
  name: '',
  size: '',
  colour: '',
  imageUrl: '',
  returnQuantity: 0,
  returnReason: '',
  unitPrice: '0.00',
  discount: '',
  total: '0.00',
  nonRefundable: false,
}

const emptyreturnDetails = {
  rmaId: '',
  orderId: '',
  subTotal: '0.00',
  deliveryPrice: '0.00',
  totalOrderPrice: '0.00',
  totalOrdersDiscountLabel: '',
  totalOrdersDiscount: '',
  orderLines: [],
  paymentDetails: emptyPaymentDetails,
}

describe('transforms return details', () => {
  describe('paymentDetailsFragment', () => {
    it('transforms wcs return details to monty payment details', () => {
      expect(paymentDetailsFragment(wcs)).toEqual(monty.paymentDetails, '£')
    })
    it('returns a default monty payment details if nothing is passed in', () => {
      expect(paymentDetailsFragment()).toEqual(emptyPaymentDetails)
      expect(paymentDetailsFragment({})).toEqual(emptyPaymentDetails)
      expect(paymentDetailsFragment([])).toEqual(emptyPaymentDetails)
    })
  })
  describe('orderLineFragment', () => {
    it('transforms wcs orderItem to a monty orderLine', () => {
      expect(orderLineFragment(wcs.returnItemsCheckout.orderItem[0])).toEqual(
        monty.orderLines[0]
      )
    })
    it('returns a default monty orderLine if nothing is passed in', () => {
      expect(orderLineFragment()).toEqual(emptyOrderLineFragment)
      expect(orderLineFragment({})).toEqual(emptyOrderLineFragment)
      expect(orderLineFragment([])).toEqual(emptyOrderLineFragment)
    })
  })
  describe('returnDetails', () => {
    it('transforms wcs returnDetails to monty returnDetails', () => {
      expect(returnDetails(wcs)).toEqual(monty)
    })
    it('returns a default monty returnDetails if nothing is passed in', () => {
      expect(returnDetails()).toEqual(emptyreturnDetails)
      expect(returnDetails({})).toEqual(emptyreturnDetails)
      expect(returnDetails([])).toEqual(emptyreturnDetails)
    })
  })
})
