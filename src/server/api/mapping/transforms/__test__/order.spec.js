import { clone } from 'ramda'
import deepFreeze from 'deep-freeze'
import orderTransform, {
  billingAddressFragment,
  deliveryAddressFragment,
  orderLineFragment,
  orderLinesFragment,
  paymentDetailsFragment,
  promoCodesFragment,
} from '../order'
import {
  completedOrder,
  completedGiftCardOrder,
} from './completedGiftCardOrder'
import wcs from '../../../../../../test/apiResponses/create-order/wcs.json'
import wcsGuestOrder from '../../../../../../test/apiResponses/create-order/wcsGuestOrder.json'
import hapiGuestOrder from '../../../../../../test/apiResponses/create-order/hapiGuestOrder.json'
import monty from '../../../../../../test/apiResponses/create-order/hapi.json'
import wcsOrderDiscount from '../../../../../../test/apiResponses/create-order/wcs-orderDiscount.json'
import montyOrderDiscount from '../../../../../../test/apiResponses/create-order/hapi-orderDiscount.json'

describe('order transformer', () => {
  describe('billingAddressFragment', () => {
    it('returns an address object setting properties to empty strings by default', () => {
      expect(billingAddressFragment()).toEqual({
        name: '',
        address1: '',
        address2: '',
        address3: '',
        country: '',
      })
    })

    describe('WCS provides address2 response parameter', () => {
      it('returns an address object from the billingDetails object', () => {
        expect(
          billingAddressFragment(wcs.OrderConfirmation.billingDetails)
        ).toEqual(monty.completedOrder.billingAddress)
      })
    })

    describe('WCS does not provide address2 response parameter', () => {
      it('returns the expected billing address', () => {
        const wcs = deepFreeze({
          title: 'Mr',
          lastName: 'AUTHORISED',
          firstName: '3D.',
          city: 'LONDON',
          country: 'United Kingdom',
          address1: 'Flat 6, 22 Crescent Road',
          address2: '',
          zipCode: 'N8 8AX',
        })

        const hapi = deepFreeze({
          name: 'Mr 3D. AUTHORISED',
          address1: 'Flat 6, 22 Crescent Road',
          address2: 'LONDON',
          address3: 'N8 8AX',
          country: 'United Kingdom',
        })

        expect(billingAddressFragment(wcs)).toEqual(hapi)
      })
    })
  })

  describe('deliveryAddressFragment', () => {
    it('returns an address object setting properties to empty strings by default', () => {
      expect(deliveryAddressFragment()).toEqual({
        name: '',
        address1: '',
        address2: '',
        address3: '',
        country: '',
      })
    })

    it('returns an address object from the deliveryDetails object', () => {
      expect(
        deliveryAddressFragment(wcs.OrderConfirmation.deliveryDetails)
      ).toEqual(monty.completedOrder.deliveryAddress)
    })
  })

  describe('orderLineFragment', () => {
    const defaultResponse = deepFreeze({
      lineNo: '',
      productId: '',
      name: '',
      size: '',
      colour: '',
      imageUrl: '',
      quantity: 0,
      unitPrice: '',
      discount: '',
      discountPrice: '0.00',
      total: '0.00',
      nonRefundable: false,
      brand: '',
      category: '',
      department: '',
      reviewRating: '',
      ecmcCategory: '',
      isDDPProduct: false,
      skuId: '',
      wasPrice: '',
    })

    it('returns an empty object setting properties to defaults', () => {
      expect(orderLineFragment()).toEqual(defaultResponse)
    })

    it('returns an orderLine object from the Product object', () => {
      expect(orderLineFragment(wcs.ShowMyOrderForm.Products[0])).toEqual(
        monty.completedOrder.orderLines[0]
      )
    })

    it('should forward the baseImageUrl property if provided by wcs', () => {
      const baseImageUrl =
        'https://images.topshop.com/i/TopShop/TS32G13PMUL_F_1'
      const wcsWithBaseImageUrl = clone(wcs)
      wcsWithBaseImageUrl.ShowMyOrderForm.Products[0].baseImageUrl = baseImageUrl
      expect(
        orderLineFragment(wcsWithBaseImageUrl.ShowMyOrderForm.Products[0])
      ).toEqual({
        ...monty.completedOrder.orderLines[0],
        baseImageUrl,
      })
    })

    it('should not add a baseImageUrl property if not provided by wcs', () => {
      const wcsWithoutBaseImageUrl = clone(wcs)
      wcsWithoutBaseImageUrl.ShowMyOrderForm.Products[0].baseImageUrl = undefined
      expect(
        orderLineFragment(wcsWithoutBaseImageUrl.ShowMyOrderForm.Products[0])
      ).not.toHaveProperty('baseImageUrl')
    })

    it('should map `isDDPProduct` flag', () => {
      expect(orderLineFragment({ isDDPProduct: false })).toEqual({
        ...defaultResponse,
        isDDPProduct: false,
      })
    })

    it('should map `wasPrice` property when specified', () => {
      expect(orderLineFragment({ wasPrice: 25 })).toEqual({
        ...defaultResponse,
        wasPrice: '25.00',
      })
    })

    describe('product promotions', () => {
      const productWcs = deepFreeze({
        catCode: '',
        name: '',
        size: '',
        productColor: '',
        productImgURL: '',
        quantity: '0',
        totalPrice: 0,
        unitPrice: '',
      })

      const productMonty = deepFreeze({
        lineNo: '',
        productId: '',
        name: '',
        size: '',
        colour: '',
        imageUrl: '',
        quantity: 0,
        unitPrice: '',
        total: '0.00',
        nonRefundable: false,
        brand: '',
        category: '',
        department: '',
        ecmcCategory: '',
        isDDPProduct: false,
        reviewRating: '',
        skuId: '',
        wasPrice: '',
      })

      it('maps correctly empty promotions', () => {
        expect(
          orderLineFragment({
            ...productWcs,
            promotions: [],
          })
        ).toEqual({
          ...productMonty,
          discount: '',
          discountPrice: '0.00',
        })
      })

      it('maps correctly multiple promotions', () => {
        expect(
          orderLineFragment({
            ...productWcs,
            promotions: [
              { discount: 'discount name', totalDiscountedAmt: '-0.60000' },
              { discount: 'whatever', totalDiscountedAmt: '-1.40000' },
            ],
          })
        ).toEqual({
          ...productMonty,
          discount: 'discount name',
          discountPrice: '2.00',
        })
      })

      it('maps correctly invalid "promotions"', () => {
        expect(
          orderLineFragment({
            ...productWcs,
            promotions: 'abc',
          })
        ).toEqual({
          ...productMonty,
          discount: '',
          discountPrice: '0.00',
        })
      })

      it('maps correctly invalid promotion in "promotions"', () => {
        expect(
          orderLineFragment({
            ...productWcs,
            promotions: 'abc',
          })
        ).toEqual({
          ...productMonty,
          discount: '',
          discountPrice: '0.00',
        })

        expect(
          orderLineFragment({
            ...productWcs,
            promotions: [
              { discount: 'discount name', totalDiscountedAmt: 'b' },
              { discount: 'whatever', totalDiscountedAmt: 'a' },
            ],
          })
        ).toEqual({
          ...productMonty,
          discount: 'discount name',
          discountPrice: '0.00',
        })
      })
    })
  })

  describe('orderLinesFragment', () => {
    it('returns an empty array by default', () => {
      expect(orderLinesFragment()).toEqual([])
    })
    it('returns an orderLines array from the Products array', () => {
      expect(orderLinesFragment(wcs.ShowMyOrderForm.Products)).toEqual(
        monty.completedOrder.orderLines
      )
    })
  })

  describe('paymentDetailsFragment', () => {
    it('returns an array with a default object in by default', () => {
      expect(paymentDetailsFragment()).toEqual([
        {
          paymentMethod: '',
          cardNumberStar: '',
          totalCost: '0.00',
          totalCostAfterDiscount: '0.00',
          selectedPaymentMethod: '',
        },
      ])
      expect(paymentDetailsFragment('junk', '', [])).toEqual([
        {
          paymentMethod: '',
          cardNumberStar: '',
          totalCost: '0.00',
          totalCostAfterDiscount: '0.00',
          selectedPaymentMethod: '',
        },
      ])
      expect(paymentDetailsFragment([], '', {})).toEqual([
        {
          paymentMethod: '',
          cardNumberStar: '',
          totalCost: '0.00',
          totalCostAfterDiscount: '0.00',
          selectedPaymentMethod: '',
        },
      ])
    })

    it('returns an paymentDetails array from the creditCard object', () => {
      expect(
        paymentDetailsFragment(wcs.OrderConfirmation.creditCard, '£')
      ).toEqual(monty.completedOrder.paymentDetails)
    })

    it('returns a paymentDetails array from creditCard Object and giftCard Array', () => {
      expect(
        paymentDetailsFragment(
          wcs.OrderConfirmation.creditCard,
          '£',
          completedOrder.OrderConfirmation.giftCards
        )
      ).toEqual([
        ...monty.completedOrder.paymentDetails,
        {
          balance: '34.65',
          paymentMethod: 'Gift Card',
          cardNumberStar: '************6399',
          remainingBalance: '0.00',
          totalCost: '£34.65',
          selectedPaymentMethod: 'GCARD',
        },
      ])
    })

    it('returns a paymentDetails array with just one gift card object if the payment method is gift card', () => {
      expect(
        paymentDetailsFragment(
          completedGiftCardOrder.OrderConfirmation.creditCard,
          '£',
          completedGiftCardOrder.OrderConfirmation.giftCards
        )
      ).toEqual([
        {
          balance: '52.30',
          cardNumberStar: '************8361',
          paymentMethod: 'Gift Card',
          remainingBalance: '43.35',
          totalCost: '£8.95',
          selectedPaymentMethod: 'GCARD',
        },
      ])
    })
  })

  describe('promoCodesFragment', () => {
    it('returns an empty array if promoCodes property is undefined', () => {
      expect(promoCodesFragment()).toEqual([])
    })
    it('returns an empty array if promoCodes property is an empty array', () => {
      expect(promoCodesFragment([])).toEqual([])
    })
    it('returns an array with mapped promotionCodes', () => {
      expect(
        promoCodesFragment([
          {
            promotionDescription: 'Monty Test 1% off',
            voucherCodes: 'F84MB92NV9',
          },
          {
            promotionDescription: 'Monty Test 5p off',
            voucherCodes: 'K50VS52ML7',
          },
        ])
      ).toEqual([
        {
          label: 'Monty Test 1% off',
          promotionCode: 'F84MB92NV9',
        },
        {
          label: 'Monty Test 5p off',
          promotionCode: 'K50VS52ML7',
        },
      ])
    })
  })

  describe('orderTransform', () => {
    it('returns an address object setting properties to empty strings by default', () => {
      expect(orderTransform()).toEqual({
        completedOrder: {
          orderId: '',
          subTotal: '0.00',
          returnPossible: false,
          returnRequested: false,
          deliveryMethod: '',
          deliveryDate: '',
          deliveryCost: '0.00',
          deliveryCarrier: '',
          deliveryPrice: '0.00',
          totalOrderPrice: '',
          totalOrdersDiscountLabel: '',
          totalOrdersDiscount: '',
          discounts: [],
          billingAddress: {
            name: '',
            address1: '',
            address2: '',
            address3: '',
            country: '',
          },
          deliveryAddress: {
            name: '',
            address1: '',
            address2: '',
            address3: '',
            country: '',
          },
          orderLines: [],
          paymentDetails: [
            {
              paymentMethod: '',
              cardNumberStar: '',
              totalCost: '0.00',
              totalCostAfterDiscount: '0.00',
              selectedPaymentMethod: '',
            },
          ],
          currencyConversion: { currencyRate: '' },
          returning_buyer: false,
          productRevenue: '0.00',
          promoCodes: [],
          userId: '',
          isDDPOrder: false,
          ddpPromotion: {},
          guestUserEmail: '',
          userType: '',
        },
      })
    })

    it('returns an order object from the order response', () => {
      expect(orderTransform(wcs, '£', 'GBP')).toEqual(monty)
    })

    it('handles order level discount', () => {
      expect(orderTransform(wcsOrderDiscount, '£', 'GBP')).toEqual(
        montyOrderDiscount
      )
    })

    it('should map the accountExists property if it is a guest checkout order', () => {
      expect(orderTransform(wcsGuestOrder, '£', 'GBP')).toEqual(hapiGuestOrder)
    })
  })
})
