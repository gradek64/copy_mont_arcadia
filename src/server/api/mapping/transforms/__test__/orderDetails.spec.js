import { path } from 'ramda'

import wcsOrderDetail from '../../../../../../test/apiResponses/orders/wcs-orderDetail.json'
import montyOrderById from '../../../../../../test/apiResponses/orders/hapiMonty-orderById.json'

import transform, * as fragments from '../orderDetails'
import { paymentDetailsFragment } from '../order'

describe('orderById transformer', () => {
  describe('addressFragment', () => {
    const { addressFragment } = fragments

    it('should convert an address from WCS into a format expected by Monty', () => {
      expect(addressFragment(wcsOrderDetail.billingAddress)).toEqual(
        montyOrderById.billingAddress
      )
    })

    it('should return a default address object if values cannot be found', () => {
      expect(addressFragment({})).toEqual({
        name: '',
        address1: '',
        address2: '',
        address3: '',
        address4: '',
        country: '',
      })
    })
  })

  describe('priceFragment', () => {
    const { priceFragment } = fragments

    it('should convert a numeric value of 20.00000 to a string "20.00"', () => {
      expect(priceFragment(20.0)).toBe('20.00')
    })

    it('should return an empty string if the price is 0 or falsy', () => {
      expect(priceFragment(0)).toBe('')
      expect(priceFragment()).toBe('')
    })
  })

  describe('deliveryPrice fragment', () => {
    const { deliveryPriceFragment } = fragments
    it('should convert a numeric value of 4 to a string of "4.00"', () => {
      expect(deliveryPriceFragment(4)).toBe('4.00')
    })

    it('should return a string "0.00" if the deliveryPrice is 0 or falsy', () => {
      expect(deliveryPriceFragment(0)).toBe('0.00')
      expect(deliveryPriceFragment()).toBe('0.00')
    })
  })

  describe('totalCostFragment', () => {
    const { totalCostFragment } = fragments
    it('should correctly format the total cost', () => {
      expect(totalCostFragment(20.0, '£')).toBe('£20.00')
    })

    it('should return a price of £0.00 if the price is 0 or falsy', () => {
      expect(totalCostFragment(0)).toBe('0.00')
      expect(totalCostFragment()).toBe('0.00')
    })
  })

  describe('discountFragment', () => {
    const { discountFragment } = fragments
    it('should return false if any parameters are missing', () => {
      expect(discountFragment()).toBeFalsy()
      expect(discountFragment(12)).toBeFalsy()
      expect(discountFragment(12, 1)).toBeFalsy()
    })

    it('should return "0.00" if any of the values are 0', () => {
      expect(discountFragment(0, 1, 10)).toBeFalsy()
      expect(discountFragment(10, 2, 0)).toBeFalsy()
      expect(discountFragment(10, 0, 20)).toBeFalsy()
    })

    it('should correctly calculate the discount given price and quantity parameters', () => {
      expect(discountFragment(20, 1, 15)).toBe('5.00')
      expect(discountFragment(10, 2, 18)).toBe('2.00')
    })
  })

  describe('orderLine fragment', () => {
    const { orderLineFragment } = fragments
    it('should transform an orderLine object from the WCS response to a format expected by Monty', () => {
      expect(
        orderLineFragment(path(['orderLines', 0], wcsOrderDetail))
      ).toEqual(path(['orderLines', 0], montyOrderById))
    })

    it('should return a default orderLine object if values cannot be found', () => {
      expect(orderLineFragment({})).toEqual({
        lineNo: '',
        name: '',
        size: '',
        colour: '',
        baseImageUrl: '',
        imageUrl: '',
        isDDPProduct: undefined,
        quantity: 0,
        retailStoreTrackingUrl: undefined,
        unitPrice: '',
        total: '',
        nonRefundable: false,
        discount: '',
      })
    })
  })

  describe('orderLines fragment', () => {
    const { orderLinesFragment } = fragments
    it('should return an empty array if it is not passed an array of orders', () => {
      expect(orderLinesFragment([])).toEqual([])
      expect(orderLinesFragment('foo')).toEqual([])
      expect(orderLinesFragment()).toEqual([])
    })
  })

  describe('paymentDetail fragment', () => {
    const creditCard = {
      CARD_BRAND_TEXT: 'Visa',
      cardNumberStar: 'XXXX XXXX XXXX 4444',
      cardText: ' card - ',
      grandTotalAmount: 13.95,
      orderTotalText: 'Order Total',
      paymentAmount: 13.95,
      paymentDetailsText: 'Payment Details',
      selectedPaymentMethod: 'VISA',
    }

    const giftCard = {
      CARD_BRAND_TEXT: 'Gift Card',
      grandTotalAmount: 13.95,
      orderTotalText: 'Order Total',
      paymentDetailsText: 'Payment Details',
      selectedPaymentMethod: 'GCARD',
    }

    it('should transform the paymentDetail object from WCS into a format expected by Monty', () => {
      expect(paymentDetailsFragment(creditCard, '£', giftCard)).toEqual(
        montyOrderById.paymentDetails
      )
    })

    it('should return a default paymentDetail object if no args are passed', () => {
      expect(paymentDetailsFragment()).toEqual([
        {
          paymentMethod: '',
          cardNumberStar: '',
          totalCost: '0.00',
          selectedPaymentMethod: '',
          totalCostAfterDiscount: '0.00',
        },
      ])
    })
  })

  describe('orderById transform', () => {
    it('should transform the response for a particular order from WCS into a format expected by Monty', () => {
      expect(transform(wcsOrderDetail, '£')).toEqual(montyOrderById)
    })

    it('should return a default order object if values cannot be found', () => {
      expect(transform({})).toEqual({
        orderId: '',
        subTotal: '',
        status: '',
        statusCode: '',
        isOrderFullyRefunded: false,
        returnPossible: false,
        returnRequested: false,
        deliveryMethod: '',
        deliveryType: '',
        deliveryDate: '',
        deliveryCost: '',
        deliveryCarrier: '',
        deliveryPrice: '0.00',
        totalOrderPrice: '',
        totalOrdersDiscountLabel: '',
        totalOrdersDiscount: '',
        billingAddress: {
          name: '',
          address1: '',
          address2: '',
          address3: '',
          address4: '',
          country: '',
        },
        deliveryAddress: {
          name: '',
          address1: '',
          address2: '',
          address3: '',
          address4: '',
          country: '',
        },
        orderLines: [],
        paymentDetails: [
          {
            cardNumberStar: '',
            paymentMethod: '',
            selectedPaymentMethod: '',
            totalCost: '0.00',
            totalCostAfterDiscount: '0.00',
          },
        ],
        discounts: [],
      })
    })
  })
})
