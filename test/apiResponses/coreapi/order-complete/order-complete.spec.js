import { createAccount } from '../utilis/userAccount'
import { getProducts } from '../utilis/selectProducts'
import { payOrder } from '../utilis/payOrder'
import { addItemToShoppingBag2, promotionCode } from '../utilis/shoppingBag'
import completedOrderSchema from './order-complete.schema'

describe('It should return the Order Complete Json schema for a New User', () => {
  let products

  beforeAll(async () => {
    products = await getProducts()
  }, 60000)

  describe('can pay with VISA card', () => {
    let newAccount
    let shoppingBag
    let orderCompleted

    beforeAll(async () => {
      try {
        newAccount = await createAccount()
        shoppingBag = await addItemToShoppingBag2(
          newAccount.jsessionid,
          products.productsSimpleId
        )

        orderCompleted = await payOrder(
          newAccount.jsessionid,
          shoppingBag.orderId,
          'VISA'
        )
      } catch (e) {
        orderCompleted = e.response.message
      }
    }, 60000)

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
    let newAccount
    let shoppingBag
    let orderCompleted

    beforeAll(async () => {
      try {
        newAccount = await createAccount()
        shoppingBag = await addItemToShoppingBag2(
          newAccount.jsessionid,
          products.productsSimpleId
        )

        orderCompleted = await payOrder(
          newAccount.jsessionid,
          shoppingBag.orderId,
          'MCARD'
        )
      } catch (e) {
        orderCompleted = e.response.message
      }
    }, 60000)

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
    let newAccount
    let shoppingBag
    let orderCompleted

    beforeAll(async () => {
      newAccount = await createAccount()
      shoppingBag = await addItemToShoppingBag2(
        newAccount.jsessionid,
        products.productsSimpleId
      )

      orderCompleted = await payOrder(
        newAccount.jsessionid,
        shoppingBag.orderId,
        'AMEX'
      )
    }, 60000)

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
    let newAccount
    let shoppingBag
    let orderCompleted

    beforeAll(async () => {
      newAccount = await createAccount()
      shoppingBag = await addItemToShoppingBag2(
        newAccount.jsessionid,
        products.productsSimpleId
      )

      orderCompleted = await payOrder(
        newAccount.jsessionid,
        shoppingBag.orderId,
        'ACCNT'
      )
    }, 60000)

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
    let newAccount
    let shoppingBag
    let orderCompleted

    beforeAll(async () => {
      newAccount = await createAccount()
      shoppingBag = await addItemToShoppingBag2(
        newAccount.jsessionid,
        products.productsSimpleId
      )
      orderCompleted = await payOrder(
        newAccount.jsessionid,
        shoppingBag.orderId,
        'PYPAL'
      )
    }, 60000)

    it('should return a successful server response 200 for PAYPAL', () => {
      expect(orderCompleted.statusCode).toBe(200)
    })
  })

  describe('when orders contain promotions', () => {
    let newAccount
    let shoppingBag
    let orderCompleted

    beforeAll(async () => {
      newAccount = await createAccount()
      shoppingBag = await addItemToShoppingBag2(
        newAccount.jsessionid,
        products.productsSimpleId
      )
      await promotionCode(newAccount.jsessionid)

      orderCompleted = await payOrder(
        newAccount.jsessionid,
        shoppingBag.orderId,
        'VISA'
      )
    }, 60000)

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
