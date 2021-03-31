/* eslint-disable func-names */
require('@babel/register')

jest.unmock('superagent')

import { path } from 'ramda'
import {
  stringType,
  stringTypeEmpty,
  stringTypeNumber,
  stringTypeCanBeEmpty,
  numberType,
  booleanType,
  objectType,
  arrayType,
  booleanTypeAny,
} from '../utilis'
import {
  loginAndGetOrderHistory,
  getOrderDetailsForAllOfOrderHistory,
} from '../utilis/orderDetails'

describe('Order History Tests', () => {
  const SECOND = 1000

  describe('Order History Schema', () => {
    let orderHistory = null

    beforeAll(async () => {
      try {
        orderHistory = await loginAndGetOrderHistory()
      } catch (error) {
        throw path(['response', 'error', 'text'], error)
          ? new Error(error.response.error.text)
          : error
      }
    }, 30 * SECOND)

    it('Order History - Main', (done) => {
      if (orderHistory) {
        const orderHistorySchema = {
          title: 'Order History Schema',
          type: 'object',
          required: ['orders', 'version'],
          properties: {
            orders: arrayType(1),
            version: stringTypeNumber,
          },
        }
        expect(orderHistory.body).toMatchSchema(orderHistorySchema)
        done()
      }
    })

    it('Order History - Orders', (done) => {
      if (orderHistory) {
        const orders = orderHistory.body.orders
        orders.forEach((obj) => {
          const orderHistoryObjSchema = {
            title: 'Order Schema',
            type: 'object',
            required: [
              'orderId',
              'date',
              'status',
              'statusCode',
              'total',
              'returnPossible',
              'returnRequested',
              'isOrderDDPOnly',
            ],
            properties: {
              orderId: numberType,
              date: stringType,
              status: stringType,
              statusCode: stringTypeCanBeEmpty,
              total: stringType,
              returnPossible: booleanType(false),
              returnRequested: booleanType(false),
              isOrderDDPOnly: booleanTypeAny,
            },
          }
          expect(obj).toMatchSchema(orderHistoryObjSchema)
        })
        done()
      }
    })
  })

  describe('Order History Details Schema', () => {
    let historyDetails = null

    beforeAll(async () => {
      try {
        ;({ historyDetails } = await getOrderDetailsForAllOfOrderHistory())
      } catch (error) {
        throw path(['response', 'error', 'text'], error)
          ? new Error(error.response.error.text)
          : error
      }
    }, 30 * SECOND)

    it('Order Details - Main', (done) => {
      if (historyDetails) {
        historyDetails.forEach((testSet) => {
          const orderDetailsSchema = {
            title: 'Order Details Schema',
            type: 'object',
            required: [
              'orderId',
              'subTotal',
              'statusCode',
              'status',
              'isOrderFullyRefunded',
              'returnPossible',
              'returnRequested',
              'deliveryMethod',
              'deliveryDate',
              'deliveryCost',
              'deliveryCarrier',
              'deliveryPrice',
              'totalOrderPrice',
              'totalOrdersDiscount',
              'totalOrdersDiscountLabel',
              'billingAddress',
              'deliveryAddress',
              'orderLines',
              'paymentDetails',
              'smsNumber',
              'isDDPOrder',
              'deliveryType',
              'discounts',
            ],
            properties: {
              orderId: numberType,
              subTotal: stringType,
              statusCode: stringType,
              status: stringType,
              isOrderFullyRefunded: booleanTypeAny,
              returnPossible: booleanType(false),
              returnRequested: booleanType(false),
              deliveryMethod: stringType,
              deliveryDate: stringType,
              deliveryCost: stringTypeCanBeEmpty,
              deliveryCarrier: stringType,
              deliveryPrice: stringType,
              totalOrderPrice: stringType,
              totalOrdersDiscountLabel: stringType,
              totalOrdersDiscount: stringTypeCanBeEmpty,
              billingAddress: objectType,
              deliveryAddress: objectType,
              orderLines: arrayType(1),
              paymentDetails: arrayType(1),
              smsNumber: stringTypeEmpty,
              isDDPOrder: booleanTypeAny,
              deliveryType: stringType,
              discounts: arrayType,
            },
          }
          expect(testSet.orderDetails).toMatchSchema(orderDetailsSchema)
        })
        done()
      }
    })

    it('Order Details - Billing Address Schema', (done) => {
      if (historyDetails) {
        historyDetails.forEach((testSet) => {
          const body = testSet.orderDetails.billingAddress
          const orderDetailsBillingSchema = {
            title: 'Order Details Billing Address Schema',
            type: 'object',
            required: [
              'name',
              'address1',
              'address2',
              'address3',
              'address4',
              'country',
            ],
            properties: {
              name: stringType,
              address1: stringType,
              address2: stringTypeEmpty,
              address3: stringType,
              address4: stringType,
              country: stringType,
            },
          }
          expect(body).toMatchSchema(orderDetailsBillingSchema)
        })
        done()
      }
    })

    it('Order Details - Delivery Address Schema', (done) => {
      if (historyDetails) {
        historyDetails.forEach((testSet) => {
          const body = testSet.orderDetails.deliveryAddress
          const orderDetailsDeliverySchema = {
            title: 'Order Details Delivery Address Schema',
            type: 'object',
            required: [
              'name',
              'address1',
              'address2',
              'address3',
              'address4',
              'country',
            ],
            properties: {
              name: stringType,
              address1: stringType,
              address2: stringTypeCanBeEmpty,
              address3: stringType,
              address4: stringType,
              country: stringType,
            },
          }
          expect(body).toMatchSchema(orderDetailsDeliverySchema)
        })
        done()
      }
    })

    it('Order Details - Order Lines Schema', (done) => {
      if (historyDetails) {
        historyDetails.forEach((testSet) => {
          const body = testSet.orderDetails.orderLines
          body.forEach((obj) => {
            const orderDetailsOrderLinesSchema = {
              title: 'Order Details Order Lines Schema',
              type: 'object',
              required: [
                'lineNo',
                'name',
                'size',
                'colour',
                'baseImageUrl',
                'imageUrl',
                'quantity',
                'unitPrice',
                'discount',
                'total',
                'nonRefundable',
                'isDDPProduct',
                'trackingAvailable',
              ],
              optional: [
                'wasPrice',
                'trackingNumber',
                'retailStoreTrackingUrl',
              ],
              properties: {
                lineNo: stringType,
                name: stringType,
                size: stringType,
                colour: stringType,
                baseImageUrl: stringType,
                imageUrl: stringType,
                quantity: numberType,
                unitPrice: stringTypeNumber,
                discount: stringTypeEmpty,
                total: stringType,
                nonRefundable: booleanType(false),
                wasPrice: stringTypeCanBeEmpty,
                trackingNumber: stringType,
                isDDPProduct: booleanTypeAny,
                trackingAvailable: booleanTypeAny,
                retailStoreTrackingUrl: stringTypeCanBeEmpty,
              },
            }

            expect(obj).toMatchSchema(orderDetailsOrderLinesSchema)
          })
        })
        done()
      }
    })

    it('Order Details - Payment Details Schema', (done) => {
      if (historyDetails) {
        historyDetails.forEach((testSet) => {
          const body = testSet.orderDetails.paymentDetails
          body.forEach((obj) => {
            const orderDetailsPaymentDetailsSchema = {
              title: 'Order Details Payment Details Schema',
              type: 'object',
              required: [
                'paymentMethod',
                'cardNumberStar',
                'totalCost',
                'totalCostAfterDiscount',
                'selectedPaymentMethod',
              ],
              properties: {
                paymentMethod: stringType,
                cardNumberStar: stringTypeCanBeEmpty,
                totalCost: stringType,
                totalCostAfterDiscount: stringType,
                selectedPaymentMethod: stringType,
              },
            }
            expect(obj).toMatchSchema(orderDetailsPaymentDetailsSchema)
          })
        })
        done()
      }
    })
  })
})
