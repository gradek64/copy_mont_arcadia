import { createAccountResponse } from '../utilis/userAccount'
import { getProducts } from '../utilis/selectProducts'
import { payOrder } from '../utilis/payOrder'
import {
  addItemToShoppingBagResponse,
  promotionCodeResponse,
} from '../utilis/shoppingBag'
import completedOrderSchema from './order-complete.schema'
import { processClientCookies } from '../utilis/cookies'
import { getResponseAndSessionCookies } from '../utilis/redis'

const TIMEOUT = 60000

describe('It should return the Order Complete Json schema for a New User', () => {
  let products

  beforeAll(async () => {
    products = await getProducts()
  }, 60000)

  const payOrderWith = async (cardType, withPromo) => {
    let cookies
    const { mergeCookies } = processClientCookies()
    const newAccountResponse = await createAccountResponse()
    cookies = mergeCookies(newAccountResponse)
    const shoppingBagResponse = await addItemToShoppingBagResponse(
      cookies,
      products.productsSimpleId
    )
    cookies = mergeCookies(shoppingBagResponse)
    if (withPromo) {
      const promoResponse = await promotionCodeResponse(cookies)
      cookies = mergeCookies(promoResponse)
    }
    const orderCompleted = await payOrder(
      cookies,
      shoppingBagResponse.body.orderId,
      cardType
    )
    return orderCompleted
  }

  describe('can pay with VISA card', () => {
    let orderCompleted

    beforeAll(async () => {
      orderCompleted = await payOrderWith('VISA')
    }, TIMEOUT)

    // TODO: remove when redis is removed
    it('should keep redis cookies in sync with client', async () => {
      const { responseCookies, session } = await getResponseAndSessionCookies(
        orderCompleted
      )
      expect(responseCookies).toMatchSession(session)
    })

    it('should return the completePayment Json schema for the VISA card', () => {
      const visaPaymentSchema = {
        title: 'VISA payment',
        type: 'object',
        required: completedOrderSchema.requiredPropertiesHighLevel,
        optional: ['guestUserEmail'],
        properties: completedOrderSchema.completedOrderHighLevelSchema,
      }
      expect(orderCompleted.body.completedOrder).toMatchSchema(
        visaPaymentSchema
      )
    })

    it('should return billing address object schema', () => {
      const visaPaymentBillingAddressObjectSchema = {
        title: 'VISA payment object billing address',
        type: 'object',
        required: completedOrderSchema.requiredPropertiesAddresses,
        properties: completedOrderSchema.completedOrderBillingAddressSchema,
      }
      expect(orderCompleted.body.completedOrder.billingAddress).toMatchSchema(
        visaPaymentBillingAddressObjectSchema
      )
    })

    it('should return delivery address object schema', () => {
      const visaPaymentDeliveryAddressObjectSchema = {
        title: 'VISA payment object delivery address',
        type: 'object',
        required: completedOrderSchema.requiredPropertiesAddresses,
        properties: completedOrderSchema.completedOrderDeliveryAddressSchema,
      }
      expect(orderCompleted.body.completedOrder.billingAddress).toMatchSchema(
        visaPaymentDeliveryAddressObjectSchema
      )
    })

    it('should return order lines schema', () => {
      orderCompleted.body.completedOrder.orderLines.forEach((obj) => {
        const visaPaymentOrderLinesSchema = {
          title: 'VISA payment object order lines',
          type: 'object',
          required: completedOrderSchema.requiredPropertiesOrderLines,
          properties: completedOrderSchema.completedOrderOrderLinesSchema,
        }
        expect(obj).toMatchSchema(visaPaymentOrderLinesSchema)
      })
    })

    it('should return payment details schema', () => {
      orderCompleted.body.completedOrder.paymentDetails.forEach((obj) => {
        const visaPaymentPaymentDetailsSchema = {
          title: 'VISA payment object payment details',
          type: 'object',
          required: [
            'paymentMethod',
            'cardNumberStar',
            'totalCost',
            'selectedPaymentMethod',
          ],
          properties: completedOrderSchema.completedOrderPaymentDetailsSchema(
            'Visa'
          ),
        }
        expect(obj).toMatchSchema(visaPaymentPaymentDetailsSchema)
      })
    })

    it('should return currency conversion schema', () => {
      const visaPaymentCurrencyConversionSchema = {
        title: 'VISA payment object currency conversion',
        type: 'object',
        required: ['currencyRate'],
        properties: completedOrderSchema.completedOrderCurrencyConversionSchema(
          'GBP'
        ),
      }
      expect(
        orderCompleted.body.completedOrder.currencyConversion
      ).toMatchSchema(visaPaymentCurrencyConversionSchema)
    })
  })

  describe('can pay with MASTERCARD card', () => {
    let orderCompleted

    beforeAll(async () => {
      orderCompleted = await payOrderWith('MCARD')
    }, TIMEOUT)

    // TODO: remove when redis is removed
    it('should keep redis cookies in sync with client', async () => {
      const { responseCookies, session } = await getResponseAndSessionCookies(
        orderCompleted
      )
      expect(responseCookies).toMatchSession(session)
    })

    it('should return the completePayment Json schema for the MASTERCARD card', () => {
      const visaPaymentSchema = {
        title: 'MASTERCARD payment',
        type: 'object',
        required: completedOrderSchema.requiredPropertiesHighLevel,
        properties: completedOrderSchema.completedOrderHighLevelSchema,
      }
      expect(orderCompleted.body.completedOrder).toMatchSchema(
        visaPaymentSchema
      )
    })

    it('should return billing address object schema', () => {
      const visaPaymentBillingAddressObjectSchema = {
        title: 'MASTERCARD payment object billing address',
        type: 'object',
        required: completedOrderSchema.requiredPropertiesAddresses,
        properties: completedOrderSchema.completedOrderBillingAddressSchema,
      }
      expect(orderCompleted.body.completedOrder.billingAddress).toMatchSchema(
        visaPaymentBillingAddressObjectSchema
      )
    })

    it('should return delivery address object schema', () => {
      const visaPaymentDeliveryAddressObjectSchema = {
        title: 'MASTERCARD payment object delivery address',
        type: 'object',
        required: completedOrderSchema.requiredPropertiesAddresses,
        properties: completedOrderSchema.completedOrderDeliveryAddressSchema,
      }
      expect(orderCompleted.body.completedOrder.billingAddress).toMatchSchema(
        visaPaymentDeliveryAddressObjectSchema
      )
    })

    it('should return order lines schema', () => {
      orderCompleted.body.completedOrder.orderLines.forEach((obj) => {
        const visaPaymentOrderLinesSchema = {
          title: 'MASTERCARD payment object order lines',
          type: 'object',
          required: completedOrderSchema.requiredPropertiesOrderLines,
          properties: completedOrderSchema.completedOrderOrderLinesSchema,
        }
        expect(obj).toMatchSchema(visaPaymentOrderLinesSchema)
      })
    })

    it('should return payment details schema', () => {
      orderCompleted.body.completedOrder.paymentDetails.forEach((obj) => {
        const visaPaymentPaymentDetailsSchema = {
          title: 'MASTERCARD payment object payment details',
          type: 'object',
          required: ['paymentMethod', 'cardNumberStar', 'totalCost'],
          properties: completedOrderSchema.completedOrderPaymentDetailsSchema(
            'Mastercard'
          ),
        }
        expect(obj).toMatchSchema(visaPaymentPaymentDetailsSchema)
      })
    })

    it('should return currency conversion schema', () => {
      const visaPaymentCurrencyConversionSchema = {
        title: 'MASTERCARD payment object currency conversion',
        type: 'object',
        required: ['currencyRate'],
        properties: completedOrderSchema.completedOrderCurrencyConversionSchema(
          'GBP'
        ),
      }
      expect(
        orderCompleted.body.completedOrder.currencyConversion
      ).toMatchSchema(visaPaymentCurrencyConversionSchema)
    })
  })

  describe('can pay with AMERICA EXPRESS card', () => {
    let orderCompleted

    beforeAll(async () => {
      orderCompleted = await payOrderWith('AMEX')
    }, TIMEOUT)

    // TODO: remove when redis is removed
    it('should keep redis cookies in sync with client', async () => {
      const { responseCookies, session } = await getResponseAndSessionCookies(
        orderCompleted
      )
      expect(responseCookies).toMatchSession(session)
    })

    it('should return the completePayment Json schema for the AMERICA EXPRESS card', () => {
      const visaPaymentSchema = {
        title: 'AMERICA EXPRESS payment',
        type: 'object',
        required: completedOrderSchema.requiredPropertiesHighLevel,
        properties: completedOrderSchema.completedOrderHighLevelSchema,
      }
      expect(orderCompleted.body.completedOrder).toMatchSchema(
        visaPaymentSchema
      )
    })

    it('should return billing address object schema', () => {
      const visaPaymentBillingAddressObjectSchema = {
        title: 'AMERICA EXPRESS payment object billing address',
        type: 'object',
        required: completedOrderSchema.requiredPropertiesAddresses,
        properties: completedOrderSchema.completedOrderBillingAddressSchema,
      }
      expect(orderCompleted.body.completedOrder.billingAddress).toMatchSchema(
        visaPaymentBillingAddressObjectSchema
      )
    })

    it('should return delivery address object schema', () => {
      const visaPaymentDeliveryAddressObjectSchema = {
        title: 'AMERICA EXPRESS payment object delivery address',
        type: 'object',
        required: completedOrderSchema.requiredPropertiesAddresses,
        properties: completedOrderSchema.completedOrderDeliveryAddressSchema,
      }
      expect(orderCompleted.body.completedOrder.billingAddress).toMatchSchema(
        visaPaymentDeliveryAddressObjectSchema
      )
    })

    it('should return order lines schema', () => {
      orderCompleted.body.completedOrder.orderLines.forEach((obj) => {
        const visaPaymentOrderLinesSchema = {
          title: 'AMERICA EXPRESS payment object order lines',
          type: 'object',
          required: completedOrderSchema.requiredPropertiesOrderLines,
          properties: completedOrderSchema.completedOrderOrderLinesSchema,
        }
        expect(obj).toMatchSchema(visaPaymentOrderLinesSchema)
      })
    })

    it('should return payment details schema', () => {
      orderCompleted.body.completedOrder.paymentDetails.forEach((obj) => {
        const visaPaymentPaymentDetailsSchema = {
          title: 'AMERICA EXPRESS payment object payment details',
          type: 'object',
          required: ['paymentMethod', 'cardNumberStar', 'totalCost'],
          properties: completedOrderSchema.completedOrderPaymentDetailsSchema(
            'American Express'
          ),
        }
        expect(obj).toMatchSchema(visaPaymentPaymentDetailsSchema)
      })
    })

    it('should return currency conversion schema', () => {
      const visaPaymentCurrencyConversionSchema = {
        title: 'AMERICA EXPRESS payment object currency conversion',
        type: 'object',
        required: ['currencyRate'],
        properties: completedOrderSchema.completedOrderCurrencyConversionSchema(
          'GBP'
        ),
      }
      expect(
        orderCompleted.body.completedOrder.currencyConversion
      ).toMatchSchema(visaPaymentCurrencyConversionSchema)
    })
  })

  describe('can pay with ACCOUNT CARD', () => {
    let orderCompleted

    beforeAll(async () => {
      orderCompleted = await payOrderWith('ACCNT')
    }, TIMEOUT)

    // TODO: remove when redis is removed
    it('should keep redis cookies in sync with client', async () => {
      const { responseCookies, session } = await getResponseAndSessionCookies(
        orderCompleted
      )
      expect(responseCookies).toMatchSession(session)
    })

    it('should return the completePayment Json schema for the ACCOUNT CARD', () => {
      const visaPaymentSchema = {
        title: 'ACCOUNT CARD payment',
        type: 'object',
        required: completedOrderSchema.requiredPropertiesHighLevel,
        properties: completedOrderSchema.completedOrderHighLevelSchema,
      }
      expect(orderCompleted.body.completedOrder).toMatchSchema(
        visaPaymentSchema
      )
    })

    it('should return billing address object schema', () => {
      const visaPaymentBillingAddressObjectSchema = {
        title: 'ACCOUNT CARD payment object billing address',
        type: 'object',
        required: completedOrderSchema.requiredPropertiesAddresses,
        properties: completedOrderSchema.completedOrderBillingAddressSchema,
      }
      expect(orderCompleted.body.completedOrder.billingAddress).toMatchSchema(
        visaPaymentBillingAddressObjectSchema
      )
    })

    it('should return delivery address object schema', () => {
      const visaPaymentDeliveryAddressObjectSchema = {
        title: 'ACCOUNT CARD payment object delivery address',
        type: 'object',
        required: completedOrderSchema.requiredPropertiesAddresses,
        properties: completedOrderSchema.completedOrderDeliveryAddressSchema,
      }
      expect(orderCompleted.body.completedOrder.billingAddress).toMatchSchema(
        visaPaymentDeliveryAddressObjectSchema
      )
    })

    it('should return order lines schema', () => {
      orderCompleted.body.completedOrder.orderLines.forEach((obj) => {
        const visaPaymentOrderLinesSchema = {
          title: 'ACCOUNT CARD payment object order lines',
          type: 'object',
          required: completedOrderSchema.requiredPropertiesOrderLines,
          properties: completedOrderSchema.completedOrderOrderLinesSchema,
        }
        expect(obj).toMatchSchema(visaPaymentOrderLinesSchema)
      })
    })

    it('should return payment details schema', () => {
      orderCompleted.body.completedOrder.paymentDetails.forEach((obj) => {
        const visaPaymentPaymentDetailsSchema = {
          title: 'ACCOUNT CARD payment object payment details',
          type: 'object',
          required: ['paymentMethod', 'cardNumberStar', 'totalCost'],
          properties: completedOrderSchema.completedOrderPaymentDetailsSchema(
            'Account Card'
          ),
        }
        expect(obj).toMatchSchema(visaPaymentPaymentDetailsSchema)
      })
    })

    it('should return currency conversion schema', () => {
      const visaPaymentCurrencyConversionSchema = {
        title: 'ACCOUNT CARD payment object currency conversion',
        type: 'object',
        required: ['currencyRate'],
        properties: completedOrderSchema.completedOrderCurrencyConversionSchema(
          'GBP'
        ),
      }
      expect(
        orderCompleted.body.completedOrder.currencyConversion
      ).toMatchSchema(visaPaymentCurrencyConversionSchema)
    })
  })

  describe('can pay with PAYPAL', () => {
    let orderCompleted

    beforeAll(async () => {
      orderCompleted = await payOrderWith('PYPAL')
    }, TIMEOUT)

    // TODO: remove when redis is removed
    it('should keep redis cookies in sync with client', async () => {
      const { responseCookies, session } = await getResponseAndSessionCookies(
        orderCompleted
      )
      expect(responseCookies).toMatchSession(session)
    })

    it('should return a successful server response 200 for PAYPAL', () => {
      expect(orderCompleted.statusCode).toBe(200)
    })
  })

  describe('when orders contain promotions', () => {
    let orderCompleted

    beforeAll(async () => {
      orderCompleted = await payOrderWith('VISA', true)
    }, TIMEOUT)

    // TODO: remove when redis is removed
    it('should keep redis cookies in sync with client', async () => {
      const { responseCookies, session } = await getResponseAndSessionCookies(
        orderCompleted
      )
      expect(responseCookies).toMatchSession(session)
    })

    it('should map the promotions and match schema', () => {
      orderCompleted.body.completedOrder.promoCodes.forEach((promo) => {
        expect(promo).toMatchSchema({
          properties: completedOrderSchema.completedOrderPromoCodeSchema,
        })
      })
    })

    it('should map the discount and match schema', () => {
      orderCompleted.body.completedOrder.discounts.forEach((discountCode) => {
        expect(discountCode).toMatchSchema({
          properties: completedOrderSchema.completedOrderDiscountsSchema,
        })
      })
    })

    it('should return the completePayment JSON schema with an order level discount', () => {
      const orderDiscountSchema = {
        title: 'Order discount',
        type: 'object',
        required: completedOrderSchema.requiredPropertiesHighLevel,
        properties: completedOrderSchema.completedOrderHighLevelSchema,
      }
      expect(orderCompleted.body.completedOrder).toMatchSchema(
        orderDiscountSchema
      )
    })
  })
})
