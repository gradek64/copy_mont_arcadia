require('@babel/register')

jest.unmock('superagent')
import superagent from 'superagent'

import eps from '../routes_tests'
import {
  headers,
  objectType,
  arrayType,
  stringType,
  stringTypeEmpty,
  stringTypeNumber,
  numberType,
  numberTypePattern,
  stringTypePattern,
  booleanType,
  stringTypeCanBeEmpty,
  booleanTypeAny,
} from '../utilis'
import { sriLankaOrderSummaryUser } from './order-summary-data'

describe('International order summary Schema', () => {
  let jsessionId
  let orderSummaryResp
  beforeAll(async () => {
    const resHeader = await superagent
      .post(eps.myAccount.login.path)
      .set(headers)
      .send(sriLankaOrderSummaryUser)
    const sessionId = resHeader.headers['set-cookie'].toString().split(',')
    jsessionId = sessionId[0]
    orderSummaryResp = await superagent
      .get(eps.checkout.orderSummary.path)
      .set(headers)
      .set({ Cookie: jsessionId })
  }, 60000)

  describe('It should return an Order Summary Json Schema - Home Standard International 8', () => {
    it(
      'Get Order Summary',
      () => {
        const body = orderSummaryResp.body
        const orderSummarySchema = {
          title: 'Existing User Order Summary',
          type: 'object',
          required: [
            'basket',
            'deliveryLocations',
            'giftCards',
            'deliveryInstructions',
            'smsMobileNumber',
            'shippingCountry',
            'savedAddresses',
            'ageVerificationDeliveryConfirmationRequired',
            'estimatedDelivery',
            'billingDetails',
            'deliveryDetails',
          ],
          optional: ['checkoutDiscountIntroEspot', 'isGuestOrder'],
          properties: {
            isGuestOrder: booleanType(false),
            basket: objectType,
            deliveryLocations: arrayType(1),
            giftCards: arrayType(),
            deliveryInstructions: stringTypeEmpty,
            smsMobileNumber: stringTypeEmpty,
            shippingCountry: stringTypePattern('Sri Lanka'),
            savedAddresses: arrayType(),
            ageVerificationDeliveryConfirmationRequired: booleanType(false),
            estimatedDelivery: arrayType(0, true, 'string'),
            checkoutDiscountIntroEspot: objectType,
            billingDetails: objectType,
            deliveryDetails: objectType,
          },
        }
        expect(body).toMatchSchema(orderSummarySchema)
      },
      30000
    )

    it(
      'Get Order Summary => Basket',
      () => {
        const body = orderSummaryResp.body.basket
        const orderSummarySchemaBasket = {
          title: 'Existing User Order Summary => Basket',
          type: 'object',
          required: [
            'orderId',
            'subTotal',
            'total',
            'totalBeforeDiscount',
            'deliveryOptions',
            'promotions',
            'discounts',
            'products',
            'savedProducts',
            'ageVerificationRequired',
            'restrictedDeliveryItem',
            'inventoryPositions',
            'isDDPOrder',
            'isBasketResponse',
            'isOrderCoveredByGiftCards',
            'deliveryThresholdsJson',
          ],
          optional: [
            'isClearPayAvailable',
            'isGiftCardRedemptionEnabled',
            'isGiftCardValueThresholdMet',
            'giftCardRedemptionPercentage',
          ],
          properties: {
            orderId: numberType,
            subTotal: stringType,
            total: stringType,
            totalBeforeDiscount: stringType,
            deliveryOptions: arrayType(1),
            promotions: arrayType(),
            discounts: arrayType(),
            products: arrayType(1),
            savedProducts: arrayType(),
            ageVerificationRequired: booleanType(false),
            restrictedDeliveryItem: booleanType(false),
            inventoryPositions: objectType,
            isDDPOrder: booleanType(false),
            isBasketResponse: booleanType(true),
            isOrderCoveredByGiftCards: booleanType(false),
            deliveryThresholdsJson: stringType,
            isClearPayAvailable: booleanTypeAny,
            isGiftCardRedemptionEnabled: booleanTypeAny,
            isGiftCardValueThresholdMet: booleanTypeAny,
            giftCardRedemptionPercentage: numberType,
          },
        }
        expect(body).toMatchSchema(orderSummarySchemaBasket)
      },
      30000
    )

    it(
      'Get Order Summary => Basket => Delivery Options (Free Standard International 8 £0.00)',
      () => {
        const body = orderSummaryResp.body.basket.deliveryOptions
        body.forEach((delOpts) => {
          const orderSummarySchemaBasketDelOpts = {
            title: 'Existing User Order Summary => Basket => Delivery Options',
            type: 'object',
            required: [
              'selected',
              'deliveryOptionId',
              'deliveryOptionExternalId',
              'label',
              'type',
              'enabled',
              'plainLabel',
              'shippingCost',
            ],
            properties: {
              selected: booleanType,
              type: stringType,
              deliveryOptionId: numberType,
              deliveryOptionExternalId: delOpts.label.includes(
                'Standard International 8'
              )
                ? stringTypePattern('s')
                : stringType,
              label: delOpts.selected
                ? stringTypePattern('Standard International 8')
                : stringType,
              enabled: booleanType(true),
              plainLabel: stringType,
              shippingCost: numberType,
            },
          }
          expect(delOpts).toMatchSchema(orderSummarySchemaBasketDelOpts)
        })
      },
      30000
    )

    it(
      'Get Order Summary => Basket => Products',
      () => {
        const body = orderSummaryResp.body.basket.products
        body.forEach((product) => {
          const orderSummarySchemaBasketDelOpts = {
            title: 'Existing User Order Summary => Basket => Products',
            type: 'object',
            required: [
              'productId',
              'catEntryId',
              'orderItemId',
              'shipModeId',
              'lineNumber',
              'size',
              'name',
              'quantity',
              'inStock',
              'unitPrice',
              'totalPrice',
              'assets',
              'lowStock',
              'items',
              'bundleProducts',
              'attributes',
              'colourSwatches',
              'tpmLinks',
              'bundleSlots',
              'ageVerificationRequired',
              'isBundleOrOutfit',
              'discountText',
              'restrictedDeliveryItem',
              'baseImageUrl',
              'iscmCategory',
              'freeItem',
              'isDDPProduct',
              'sourceUrl',
            ],
            properties: {
              productId: numberType,
              catEntryId: numberType,
              orderItemId: numberType,
              shipModeId: numberType,
              lineNumber: stringType,
              size: stringType,
              name: stringType,
              quantity: numberType,
              inStock: booleanType(true),
              unitPrice: stringType,
              totalPrice: numberType,
              assets: arrayType(4),
              lowStock: { type: 'boolean' },
              items: arrayType(),
              bundleProducts: arrayType(),
              attributes: objectType,
              colourSwatches: arrayType(),
              tpmLinks: arrayType(),
              bundleSlots: arrayType(),
              ageVerificationRequired: booleanType(false),
              isBundleOrOutfit: booleanType(false),
              discountText: stringTypeCanBeEmpty,
              restrictedDeliveryItem: booleanType(false),
              baseImageUrl: stringType,
              iscmCategory: stringType,
              freeItem: booleanType(false),
              isDDPProduct: booleanType(false),
              sourceUrl: stringType,
            },
          }
          expect(product).toMatchSchema(orderSummarySchemaBasketDelOpts)
        })
      },
      30000
    )

    it(
      'Get Order Summary => Basket => Products => assets',
      () => {
        const body = orderSummaryResp.body.basket.products
        body.forEach((prod) => {
          prod.assets.forEach((asset) => {
            const shoppingBagProductsSchema = {
              title:
                'Existing User Shopping Bag GET Product products assets Json Schema',
              type: 'object',
              required: ['assetType', 'index', 'url'],
              properties: {
                assetType: stringType,
                index: numberType,
                url: stringType,
              },
            }
            expect(asset).toMatchSchema(shoppingBagProductsSchema)
          })
        })
      },
      30000
    )

    it(
      'Get Order Summary => Basket => inventoryPositions Json Schema',
      () => {
        const obj = orderSummaryResp.body.basket.inventoryPositions
        let inv
        Object.keys(obj).forEach((props) => {
          if (obj[props].invavls) {
            inv = obj[props].invavls
          } else {
            inv = obj[props].inventorys
          }
          const shoppingBagInventoryPositionsProps = {
            partNumber: obj[props].partNumber,
            catentryId: obj[props].catentryId,
            inv,
          }
          let shoppingBagInventoryPositionsSchema
          if (inv !== null) {
            shoppingBagInventoryPositionsSchema = {
              title:
                'Existing User Shopping Bag Simple Product inventoryPositions Json Schema',
              type: 'object',
              required: ['partNumber', 'catentryId', 'inv'],
              properties: {
                partNumber: stringTypeNumber,
                catentryId: stringTypeNumber,
                inv: {
                  type: 'array',
                  minItems: numberTypePattern(1, 1),
                  uniqueItems: booleanType(true),
                  items: objectType,
                },
              },
            }
          } else {
            shoppingBagInventoryPositionsSchema = {
              title:
                'Existing User Shopping Bag Simple Product inventoryPositions Json Schema',
              type: 'object',
              required: ['partNumber', 'catentryId', 'inv'],
              properties: {
                partNumber: stringTypeNumber,
                catentryId: stringTypeNumber,
              },
            }
          }
          expect(shoppingBagInventoryPositionsProps).toMatchSchema(
            shoppingBagInventoryPositionsSchema
          )
        })
      },
      30000
    )

    it(
      'Get Order Summary => Basket => inventoryPositions => inventories && invavls Json Schema',
      () => {
        const obj = orderSummaryResp.body.basket.inventoryPositions
        Object.keys(obj).forEach((props) => {
          if (obj[props].invavls) {
            obj[props].invavls.forEach((prop) => {
              const shoppingBagInvAvlsPositionsProps = {
                cutofftime: prop.cutofftime,
                quantity: prop.quantity,
                stlocIdentifier: prop.stlocIdentifier,
                expressdates: prop.expressdates,
              }
              const shoppingBagInvAvlsPositionsSchema = {
                title:
                  'Existing User Shopping Bag Simple Product inventoryPositions => inventories && invavls Json Schema',
                type: 'object',
                required: [
                  'cutofftime',
                  'quantity',
                  'stlocIdentifier',
                  'expressdates',
                ],
                properties: {
                  cutofftime: stringTypeNumber,
                  quantity: numberType,
                  stlocIdentifier: stringType,
                  expressdates: {
                    type: 'array',
                    minItems: numberTypePattern(2, 2),
                    uniqueItems: booleanType(true),
                    items: objectType,
                  },
                },
              }
              expect(shoppingBagInvAvlsPositionsProps).toMatchSchema(
                shoppingBagInvAvlsPositionsSchema
              )
            })
          } else if (obj[props].inventorys) {
            obj[props].inventorys.forEach((prop) => {
              const shoppingBagInventorysPositionsProps = {
                cutofftime: prop.cutofftime,
                quantity: prop.quantity,
                ffmcenterId: prop.ffmcenterId,
                expressdates: prop.expressdates,
              }
              const shoppingBagInventorysPositionsSchema = {
                title:
                  'Existing User Shopping Bag Simple Product inventoryPositions => inventories && invavls Json Schema',
                type: 'object',
                required: [
                  'cutofftime',
                  'quantity',
                  'ffmcenterId',
                  'expressdates',
                ],
                properties: {
                  cutofftime: stringTypeNumber,
                  quantity: numberType,
                  ffmcenterId: numberType,
                  expressdates: {
                    type: 'array',
                    minItems: numberTypePattern(2, 2),
                    uniqueItems: booleanType(true),
                    items: stringType,
                  },
                },
              }
              expect(shoppingBagInventorysPositionsProps).toMatchSchema(
                shoppingBagInventorysPositionsSchema
              )
            })
          }
        })
      },
      30000
    )

    it(
      'Get Order Summary => Basket => inventoryPositions => inventories && invavls => ExpressDates Properties Values',
      () => {
        const obj = orderSummaryResp.body.basket.inventoryPositions
        Object.keys(obj).forEach((props) => {
          if (obj[props].invavls) {
            obj[props].invavls.forEach((prop) => {
              const expressdateSchema = {
                title: 'Existing User Express date in inventory item',
                type: 'array',
                required: ['0', '1'],
                properties: {
                  0: stringType,
                  1: stringType,
                },
              }
              expect(prop.expressdates).toMatchSchema(expressdateSchema)
            })
          } else if (obj[props].inventorys) {
            obj[props].inventorys.forEach((prop) => {
              const expressdateSchema = {
                title: 'Existing User Express date in inventory item',
                type: 'array',
                required: ['0', '1'],
                properties: {
                  0: stringType,
                  1: stringType,
                },
              }
              expect(prop.expressdates).toMatchSchema(expressdateSchema)
            })
          }
        })
      },
      30000
    )

    it(
      'Get Order Summary => deliveryLocations Json Schema',
      () => {
        orderSummaryResp.body.deliveryLocations.forEach((deliveryLoc) => {
          const deliveryLocSchema = {
            title: 'Existing User Delivery Location Schema',
            type: 'object',
            required: [
              'deliveryLocationType',
              'selected',
              'enabled',
              'label',
              'deliveryMethods',
            ],
            properties: {
              deliveryLocationType: stringType,
              selected: {
                type: 'boolean',
                enum:
                  deliveryLoc.deliveryLocationType === 'HOME'
                    ? [true]
                    : [false],
              },
              enabled: booleanType,
              label: stringType,
              deliveryMethods: arrayType(),
            },
          }
          expect(deliveryLoc).toMatchSchema(deliveryLocSchema)
        })
      },
      30000
    )

    it(
      'Get Order Summary => deliveryLocations => deliveryMethods Json Schema',
      () => {
        orderSummaryResp.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            const deliveryLocSchema = {
              title: 'Existing User Delivery Method Schema',
              type: 'object',
              required: [
                'shipModeId',
                'deliveryType',
                'label',
                'additionalDescription',
                'selected',
                'deliveryOptions',
                'enabled',
                'cost',
              ],
              optional: ['shipCode'],
              properties: {
                shipModeId: numberType,
                deliveryType:
                  deliveryMethod.label === 'Standard International 8'
                    ? stringTypePattern('HOME_STANDARD')
                    : stringTypePattern('HOME_EXPRESS'),
                label:
                  deliveryMethod.deliveryType === 'HOME_STANDARD'
                    ? stringTypePattern('Standard International 8')
                    : stringTypePattern('Tracked and Faster 4'),
                additionalDescription: stringType,
                selected: {
                  type: 'boolean',
                  enum:
                    deliveryMethod.deliveryType === 'HOME_STANDARD'
                      ? [true]
                      : [false],
                },
                optional: ['shipCode'],
                deliveryOptions: arrayType(),
                enabled: booleanType(true),
                cost: { type: ['number', 'string'] },
                shipCode:
                  deliveryMethod.deliveryType === 'HOME_STANDARD'
                    ? stringType
                    : stringTypeEmpty,
                estimatedDeliveryDate: stringTypeCanBeEmpty,
              },
            }
            expect(deliveryMethod).toMatchSchema(deliveryLocSchema)
          })
        })
      },
      30000
    )
  })

  describe('It should return an Order Summary Json Schema - Tracked and Faster 4', () => {
    let response
    beforeAll(async () => {
      response = await superagent
        .get(eps.checkout.orderSummary.path)
        .set(headers)
        .set({ Cookie: jsessionId })
    }, 30000)

    it(
      'GET Order Summary Existing User Tracked and Faster 4',
      () => {
        const body = response.body
        const orderSummarySchema = {
          title: 'Order Summary Existing User',
          type: 'object',
          required: [
            'isGuestOrder',
            'basket',
            'deliveryLocations',
            'giftCards',
            'deliveryInstructions',
            'smsMobileNumber',
            'shippingCountry',
            'savedAddresses',
            'ageVerificationDeliveryConfirmationRequired',
            'estimatedDelivery',
            'billingDetails',
            'deliveryDetails',
          ],
          optional: ['checkoutDiscountIntroEspot'],
          properties: {
            isGuestOrder: booleanType,
            basket: objectType,
            deliveryLocations: arrayType(1),
            giftCards: arrayType(),
            deliveryInstructions: stringTypeEmpty,
            smsMobileNumber: stringTypeEmpty,
            shippingCountry: stringTypePattern('Sri Lanka'),
            savedAddresses: arrayType(),
            ageVerificationDeliveryConfirmationRequired: booleanType(false),
            estimatedDelivery: arrayType(1, true, 'string'),
            checkoutDiscountIntroEspot: objectType,
            billingDetails: objectType,
            deliveryDetails: objectType,
          },
        }
        expect(body).toMatchSchema(orderSummarySchema)
      },
      30000
    )

    it(
      'GET Order Summary Existing User Tracked and Faster 4 => Basket',
      () => {
        const body = response.body.basket
        const orderSummarySchemaBasket = {
          title: 'Order Summary Existing User => Basket',
          type: 'object',
          required: [
            'orderId',
            'subTotal',
            'total',
            'totalBeforeDiscount',
            'deliveryOptions',
            'promotions',
            'discounts',
            'products',
            'savedProducts',
            'ageVerificationRequired',
            'restrictedDeliveryItem',
            'inventoryPositions',
            'isDDPOrder',
            'isBasketResponse',
            'isOrderCoveredByGiftCards',
            'deliveryThresholdsJson',
          ],
          optional: [
            'isClearPayAvailable',
            'isGiftCardRedemptionEnabled',
            'isGiftCardValueThresholdMet',
            'giftCardRedemptionPercentage',
          ],
          properties: {
            orderId: numberType,
            subTotal: stringType,
            total: stringType,
            totalBeforeDiscount: stringType,
            deliveryOptions: arrayType(),
            promotions: arrayType(),
            discounts: arrayType(),
            products: arrayType(1),
            savedProducts: arrayType(),
            ageVerificationRequired: booleanType(false),
            restrictedDeliveryItem: booleanType(false),
            inventoryPositions: objectType,
            isDDPOrder: booleanType(false),
            isBasketResponse: booleanType(true),
            isOrderCoveredByGiftCards: booleanType(false),
            deliveryThresholdsJson: stringType,
            isClearPayAvailable: booleanTypeAny,
            isGiftCardRedemptionEnabled: booleanTypeAny,
            isGiftCardValueThresholdMet: booleanTypeAny,
            giftCardRedemptionPercentage: numberType,
          },
        }
        expect(body).toMatchSchema(orderSummarySchemaBasket)
      },
      30000
    )

    it(
      'GET Order Summary Existing User Tracked and Faster 4 => Basket => Products',
      () => {
        const body = response.body.basket.products
        body.forEach((product) => {
          const orderSummarySchemaBasketDelOpts = {
            title: 'Order Summary Existing User => Basket => Products',
            type: 'object',
            required: [
              'productId',
              'catEntryId',
              'orderItemId',
              'shipModeId',
              'lineNumber',
              'size',
              'name',
              'quantity',
              'inStock',
              'unitPrice',
              'totalPrice',
              'assets',
              'lowStock',
              'items',
              'bundleProducts',
              'attributes',
              'colourSwatches',
              'tpmLinks',
              'bundleSlots',
              'ageVerificationRequired',
              'isBundleOrOutfit',
              'discountText',
              'restrictedDeliveryItem',
              'baseImageUrl',
              'iscmCategory',
              'freeItem',
              'isDDPProduct',
              'sourceUrl',
            ],
            optional: ['wasWasPrice', 'wasPrice'],
            properties: {
              productId: numberType,
              catEntryId: numberType,
              orderItemId: numberType,
              shipModeId: numberType,
              lineNumber: stringType,
              size: stringType,
              name: stringType,
              quantity: numberType,
              inStock: booleanType(true),
              unitPrice: stringType,
              totalPrice: numberType,
              assets: arrayType(4),
              lowStock: { type: 'boolean' },
              items: arrayType(),
              bundleProducts: arrayType(),
              attributes: objectType,
              colourSwatches: arrayType(),
              tpmLinks: arrayType(),
              bundleSlots: arrayType(),
              ageVerificationRequired: booleanType(false),
              isBundleOrOutfit: booleanType(false),
              discountText: stringTypeCanBeEmpty,
              wasWasPrice: stringType,
              wasPrice: stringType,
              restrictedDeliveryItem: booleanType(false),
              baseImageUrl: stringType,
              iscmCategory: stringType,
              freeItem: booleanType(false),
              isDDPProduct: booleanType(false),
              sourceUrl: stringType,
            },
          }
          expect(product).toMatchSchema(orderSummarySchemaBasketDelOpts)
        })
      },
      30000
    )

    it(
      'GET Order Summary Existing User Tracked and Faster 4 => Basket => Products => assets',
      () => {
        const body = response.body.basket.products
        body.forEach((prod) => {
          prod.assets.forEach((asset) => {
            const shoppingBagProductsSchema = {
              title:
                'Shopping Bag Existing User GET Product products assets Json Schema',
              type: 'object',
              required: ['assetType', 'index', 'url'],
              properties: {
                assetType: stringType,
                index: numberType,
                url: stringType,
              },
            }
            expect(asset).toMatchSchema(shoppingBagProductsSchema)
          })
        })
      },
      30000
    )

    it(
      'GET Order Summary Existing User Tracked and Faster 4 => Basket => inventoryPositions Json Schema',
      () => {
        const obj = response.body.basket.inventoryPositions
        let inv
        Object.keys(obj).forEach((props) => {
          if (obj[props].invavls) {
            inv = obj[props].invavls
          } else {
            inv = obj[props].inventorys
          }
          const shoppingBagInventoryPositionsProps = {
            partNumber: obj[props].partNumber,
            catentryId: obj[props].catentryId,
            inv,
          }
          let shoppingBagInventoryPositionsSchema
          if (inv !== null) {
            shoppingBagInventoryPositionsSchema = {
              title:
                'Shopping Bag Existing User Simple Product inventoryPositions Json Schema',
              type: 'object',
              required: ['partNumber', 'catentryId', 'inv'],
              properties: {
                partNumber: stringTypeNumber,
                catentryId: stringTypeNumber,
                inv: {
                  type: 'array',
                  minItems: numberTypePattern(1, 1),
                  uniqueItems: booleanType(true),
                  items: objectType,
                },
              },
            }
          } else {
            shoppingBagInventoryPositionsSchema = {
              title:
                'Shopping Bag Existing User Simple Product inventoryPositions Json Schema',
              type: 'object',
              required: ['partNumber', 'catentryId', 'inv'],
              properties: {
                partNumber: stringTypeNumber,
                catentryId: stringTypeNumber,
              },
            }
          }
          expect(shoppingBagInventoryPositionsProps).toMatchSchema(
            shoppingBagInventoryPositionsSchema
          )
        })
      },
      30000
    )

    it(
      'GET Order Summary Existing User Tracked and Faster 4 => Basket => inventoryPositions => inventories && invavls Json Schema',
      () => {
        const obj = response.body.basket.inventoryPositions
        Object.keys(obj).forEach((props) => {
          if (obj[props].invavls)
            if (obj[props].invavls) {
              obj[props].invavls.forEach((prop) => {
                const shoppingBagInvAvlsPositionsProps = {
                  cutofftime: prop.cutofftime,
                  quantity: prop.quantity,
                  stlocIdentifier: prop.stlocIdentifier,
                  expressdates: prop.expressdates,
                }
                const shoppingBagInvAvlsPositionsSchema = {
                  title:
                    'Shopping Bag Existing User Simple Product inventoryPositions => inventories && invavls Json Schema',
                  type: 'object',
                  required: [
                    'cutofftime',
                    'quantity',
                    'stlocIdentifier',
                    'expressdates',
                  ],
                  properties: {
                    cutofftime: stringTypeNumber,
                    quantity: numberType,
                    stlocIdentifier: stringType,
                    expressdates: {
                      type: 'array',
                      minItems: numberTypePattern(2, 2),
                      uniqueItems: booleanType(true),
                      items: objectType,
                    },
                  },
                }
                expect(shoppingBagInvAvlsPositionsProps).toMatchSchema(
                  shoppingBagInvAvlsPositionsSchema
                )
              })
            } else if (obj[props].inventorys) {
              obj[props].inventorys.forEach((prop) => {
                const shoppingBagInventorysPositionsProps = {
                  cutofftime: prop.cutofftime,
                  quantity: prop.quantity,
                  ffmcenterId: prop.ffmcenterId,
                  expressdates: prop.expressdates,
                }
                const shoppingBagInventorysPositionsSchema = {
                  title:
                    'Shopping Bag Existing User Simple Product inventoryPositions => inventories && invavls Json Schema',
                  type: 'object',
                  required: [
                    'cutofftime',
                    'quantity',
                    'ffmcenterId',
                    'expressdates',
                  ],
                  properties: {
                    cutofftime: stringTypeNumber,
                    quantity: numberType,
                    ffmcenterId: numberType,
                    expressdates: {
                      type: 'array',
                      minItems: numberTypePattern(2, 2),
                      uniqueItems: booleanType(true),
                      items: stringType,
                    },
                  },
                }
                expect(shoppingBagInventorysPositionsProps).toMatchSchema(
                  shoppingBagInventorysPositionsSchema
                )
              })
            }
        })
      },
      30000
    )

    it(
      'GET Order Summary Existing User Tracked and Faster 4 => Basket => inventoryPositions => inventories && invavls => ExpressDates Properties Values',
      () => {
        const obj = response.body.basket.inventoryPositions
        Object.keys(obj).forEach((props) => {
          if (obj[props].invavls) {
            obj[props].invavls.forEach((prop) => {
              const expressdateSchema = {
                title: 'Existing User Express date in inventory item',
                type: 'array',
                required: ['0', '1'],
                properties: {
                  0: stringType,
                  1: stringType,
                },
              }
              expect(prop.expressdates).toMatchSchema(expressdateSchema)
            })
          } else if (obj[props].inventorys) {
            obj[props].inventorys.forEach((prop) => {
              const expressdateSchema = {
                title: 'Existing User Express date in inventory item',
                type: 'array',
                required: ['0', '1'],
                properties: {
                  0: stringType,
                  1: stringType,
                },
              }
              expect(prop.expressdates).toMatchSchema(expressdateSchema)
            })
          }
        })
      },
      30000
    )

    it(
      'GET Order Summary Existing User Tracked and Faster 4 => deliveryLocations Json Schema',
      () => {
        response.body.deliveryLocations.forEach((deliveryLoc) => {
          const deliveryLocSchema = {
            title: 'Existing User Delivery Location Schema',
            type: 'object',
            required: [
              'deliveryLocationType',
              'selected',
              'enabled',
              'label',
              'deliveryMethods',
            ],
            properties: {
              deliveryLocationType: stringType,
              selected: {
                type: 'boolean',
                enum:
                  deliveryLoc.deliveryLocationType === 'HOME'
                    ? [true]
                    : [false],
              },
              enabled: booleanType,
              label: stringType,
              deliveryMethods: arrayType(),
            },
          }
          expect(deliveryLoc).toMatchSchema(deliveryLocSchema)
        })
      },
      30000
    )
  })

  describe('It should return an Order Summary Json Schema - International 8 Canada', () => {
    let response
    beforeAll(async () => {
      response = await superagent
        .get(eps.checkout.orderSummary.path)
        .set(headers)
        .set({ Cookie: jsessionId })
    }, 30000)

    it(
      'GET Order Summary Existing User International 8 => Basket',
      () => {
        const body = response.body.basket
        const orderSummarySchemaBasket = {
          title: 'Order Summary Existing User => Basket',
          type: 'object',
          required: [
            'orderId',
            'subTotal',
            'total',
            'totalBeforeDiscount',
            'deliveryOptions',
            'promotions',
            'discounts',
            'products',
            'savedProducts',
            'ageVerificationRequired',
            'restrictedDeliveryItem',
            'inventoryPositions',
            'isDDPOrder',
            'isBasketResponse',
            'isOrderCoveredByGiftCards',
            'deliveryThresholdsJson',
          ],
          optional: [
            'isClearPayAvailable',
            'isGiftCardRedemptionEnabled',
            'isGiftCardValueThresholdMet',
            'giftCardRedemptionPercentage',
          ],
          properties: {
            orderId: numberType,
            subTotal: stringType,
            total: stringType,
            totalBeforeDiscount: stringType,
            deliveryOptions: arrayType(),
            promotions: arrayType(),
            discounts: arrayType(),
            products: arrayType(1),
            savedProducts: arrayType(),
            ageVerificationRequired: booleanType(false),
            restrictedDeliveryItem: booleanType(false),
            inventoryPositions: objectType,
            isDDPOrder: booleanType(false),
            isBasketResponse: booleanType(true),
            isOrderCoveredByGiftCards: booleanType(false),
            deliveryThresholdsJson: stringType,
            isClearPayAvailable: booleanTypeAny,
            isGiftCardRedemptionEnabled: booleanTypeAny,
            isGiftCardValueThresholdMet: booleanTypeAny,
            giftCardRedemptionPercentage: numberType,
          },
        }
        expect(body).toMatchSchema(orderSummarySchemaBasket)
      },
      30000
    )

    it(
      'GET Order Summary Existing User International 8 => Basket => Products',
      () => {
        const body = response.body.basket.products
        body.forEach((product) => {
          const orderSummarySchemaBasketDelOpts = {
            title: 'Order Summary Existing User => Basket => Products',
            type: 'object',
            required: [
              'productId',
              'catEntryId',
              'orderItemId',
              'shipModeId',
              'lineNumber',
              'size',
              'name',
              'quantity',
              'inStock',
              'unitPrice',
              'totalPrice',
              'assets',
              'lowStock',
              'items',
              'bundleProducts',
              'attributes',
              'colourSwatches',
              'tpmLinks',
              'bundleSlots',
              'ageVerificationRequired',
              'isBundleOrOutfit',
              'discountText',
              'restrictedDeliveryItem',
              'baseImageUrl',
              'iscmCategory',
              'freeItem',
              'isDDPProduct',
              'sourceUrl',
            ],
            optional: ['wasWasPrice', 'wasPrice'],
            properties: {
              productId: numberType,
              catEntryId: numberType,
              orderItemId: numberType,
              shipModeId: numberType,
              lineNumber: stringType,
              size: stringType,
              name: stringType,
              quantity: numberType,
              inStock: booleanType(true),
              unitPrice: stringType,
              totalPrice: numberType,
              assets: arrayType(4),
              lowStock: { type: 'boolean' },
              items: arrayType(),
              bundleProducts: arrayType(),
              attributes: objectType,
              colourSwatches: arrayType(),
              tpmLinks: arrayType(),
              bundleSlots: arrayType(),
              ageVerificationRequired: booleanType(false),
              isBundleOrOutfit: booleanType(false),
              discountText: stringTypeCanBeEmpty,
              wasWasPrice: stringType,
              wasPrice: stringType,
              restrictedDeliveryItem: booleanType(false),
              baseImageUrl: stringType,
              iscmCategory: stringType,
              freeItem: booleanType(false),
              isDDPProduct: booleanType(false),
              sourceUrl: stringType,
            },
          }
          expect(product).toMatchSchema(orderSummarySchemaBasketDelOpts)
        })
      },
      30000
    )

    it(
      'GET Order Summary Existing User International 8 => Basket => Products => assets',
      () => {
        const body = response.body.basket.products
        body.forEach((prod) => {
          prod.assets.forEach((asset) => {
            const shoppingBagProductsSchema = {
              title:
                'Shopping Bag Existing User GET Product products assets Json Schema',
              type: 'object',
              required: ['assetType', 'index', 'url'],
              properties: {
                assetType: stringType,
                index: numberType,
                url: stringType,
              },
            }
            expect(asset).toMatchSchema(shoppingBagProductsSchema)
          })
        })
      },
      30000
    )

    it(
      'GET Order Summary Existing User International 8 => Basket => inventoryPositions Json Schema',
      () => {
        const obj = response.body.basket.inventoryPositions
        let inv
        Object.keys(obj).forEach((props) => {
          if (obj[props].invavls) {
            inv = obj[props].invavls
          } else {
            inv = obj[props].inventorys
          }
          const shoppingBagInventoryPositionsProps = {
            partNumber: obj[props].partNumber,
            catentryId: obj[props].catentryId,
            inv,
          }
          let shoppingBagInventoryPositionsSchema
          if (inv !== null) {
            shoppingBagInventoryPositionsSchema = {
              title:
                'Shopping Bag Existing User Simple Product inventoryPositions Json Schema',
              type: 'object',
              required: ['partNumber', 'catentryId', 'inv'],
              properties: {
                partNumber: stringTypeNumber,
                catentryId: stringTypeNumber,
                inv: {
                  type: 'array',
                  minItems: numberTypePattern(1, 1),
                  uniqueItems: booleanType(true),
                  items: objectType,
                },
              },
            }
          } else {
            shoppingBagInventoryPositionsSchema = {
              title:
                'Shopping Bag Existing User Simple Product inventoryPositions Json Schema',
              type: 'object',
              required: ['partNumber', 'catentryId', 'inv'],
              properties: {
                partNumber: stringTypeNumber,
                catentryId: stringTypeNumber,
              },
            }
          }
          expect(shoppingBagInventoryPositionsProps).toMatchSchema(
            shoppingBagInventoryPositionsSchema
          )
        })
      },
      30000
    )

    it(
      'GET Order Summary Existing User International 8 => Basket => inventoryPositions => inventories && invavls Json Schema',
      () => {
        const obj = response.body.basket.inventoryPositions
        Object.keys(obj).forEach((props) => {
          if (obj[props].invavls) {
            obj[props].invavls.forEach((prop) => {
              const shoppingBagInvAvlsPositionsProps = {
                cutofftime: prop.cutofftime,
                quantity: prop.quantity,
                stlocIdentifier: prop.stlocIdentifier,
                expressdates: prop.expressdates,
              }
              const shoppingBagInvAvlsPositionsSchema = {
                title:
                  'Shopping Bag Existing User Simple Product inventoryPositions => inventories && invavls Json Schema',
                type: 'object',
                required: [
                  'cutofftime',
                  'quantity',
                  'stlocIdentifier',
                  'expressdates',
                ],
                properties: {
                  cutofftime: stringTypeNumber,
                  quantity: numberType,
                  stlocIdentifier: stringType,
                  expressdates: {
                    type: 'array',
                    minItems: numberTypePattern(2, 2),
                    uniqueItems: booleanType(true),
                    items: objectType,
                  },
                },
              }
              expect(shoppingBagInvAvlsPositionsProps).toMatchSchema(
                shoppingBagInvAvlsPositionsSchema
              )
            })
          } else if (obj[props].inventorys) {
            obj[props].inventorys.forEach((prop) => {
              const shoppingBagInventorysPositionsProps = {
                cutofftime: prop.cutofftime,
                quantity: prop.quantity,
                ffmcenterId: prop.ffmcenterId,
                expressdates: prop.expressdates,
              }
              const shoppingBagInventorysPositionsSchema = {
                title:
                  'Shopping Bag Existing User Simple Product inventoryPositions => inventories && invavls Json Schema',
                type: 'object',
                required: [
                  'cutofftime',
                  'quantity',
                  'ffmcenterId',
                  'expressdates',
                ],
                properties: {
                  cutofftime: stringTypeNumber,
                  quantity: numberType,
                  ffmcenterId: numberType,
                  expressdates: {
                    type: 'array',
                    minItems: numberTypePattern(2, 2),
                    uniqueItems: booleanType(true),
                    items: stringType,
                  },
                },
              }
              expect(shoppingBagInventorysPositionsProps).toMatchSchema(
                shoppingBagInventorysPositionsSchema
              )
            })
          }
        })
      },
      30000
    )

    it(
      'GET Order Summary Existing User International 8 => Basket => inventoryPositions => inventories && invavls => ExpressDates Properties Values',
      () => {
        const obj = response.body.basket.inventoryPositions
        Object.keys(obj).forEach((props) => {
          if (obj[props].invavls) {
            obj[props].invavls.forEach((prop) => {
              const expressdateSchema = {
                title: 'Existing User Express date in inventory item',
                type: 'array',
                required: ['0', '1'],
                properties: {
                  0: stringType,
                  1: stringType,
                },
              }
              expect(prop.expressdates).toMatchSchema(expressdateSchema)
            })
          } else if (obj[props].inventorys) {
            obj[props].inventorys.forEach((prop) => {
              const expressdateSchema = {
                title: 'Existing User Express date in inventory item',
                type: 'array',
                required: ['0', '1'],
                properties: {
                  0: stringType,
                  1: stringType,
                },
              }
              expect(prop.expressdates).toMatchSchema(expressdateSchema)
            })
          }
        })
      },
      30000
    )

    it(
      'GET Order Summary Existing User International 8 => deliveryLocations Json Schema',
      () => {
        response.body.deliveryLocations.forEach((deliveryLoc) => {
          const deliveryLocSchema = {
            title: 'Existing User Delivery Location Schema',
            type: 'object',
            required: [
              'deliveryLocationType',
              'selected',
              'enabled',
              'label',
              'deliveryMethods',
            ],
            properties: {
              deliveryLocationType: stringType,
              selected: {
                type: 'boolean',
                enum:
                  deliveryLoc.deliveryLocationType === 'HOME'
                    ? [true]
                    : [false],
              },
              enabled: booleanType,
              label: stringType,
              deliveryMethods: arrayType(),
            },
          }
          expect(deliveryLoc).toMatchSchema(deliveryLocSchema)
        })
      },
      30000
    )
  })

  describe('It should return an Order Summary Json Schema - Tracked and Faster 4 to Sri Lanka', () => {
    let response
    beforeAll(async () => {
      response = await superagent
        .get(eps.checkout.orderSummary.path)
        .set(headers)
        .set({ Cookie: jsessionId })
    }, 30000)

    it(
      'GET Order Summary Existing User Tracked and Faster 4 => Basket',
      () => {
        const body = response.body.basket
        const orderSummarySchemaBasket = {
          title: 'Order Summary Existing User => Basket',
          type: 'object',
          required: [
            'orderId',
            'subTotal',
            'total',
            'totalBeforeDiscount',
            'deliveryOptions',
            'promotions',
            'discounts',
            'products',
            'savedProducts',
            'ageVerificationRequired',
            'restrictedDeliveryItem',
            'inventoryPositions',
            'isDDPOrder',
            'isBasketResponse',
            'isOrderCoveredByGiftCards',
            'deliveryThresholdsJson',
          ],
          optional: [
            'isClearPayAvailable',
            'isGiftCardRedemptionEnabled',
            'isGiftCardValueThresholdMet',
            'giftCardRedemptionPercentage',
          ],
          properties: {
            orderId: numberType,
            subTotal: stringType,
            total: stringType,
            totalBeforeDiscount: stringType,
            deliveryOptions: arrayType(),
            promotions: arrayType(),
            discounts: arrayType(),
            products: arrayType(1),
            savedProducts: arrayType(),
            ageVerificationRequired: booleanType(false),
            restrictedDeliveryItem: booleanType(false),
            inventoryPositions: objectType,
            isDDPOrder: booleanType(false),
            isBasketResponse: booleanType(true),
            isOrderCoveredByGiftCards: booleanType(false),
            deliveryThresholdsJson: stringType,
            isClearPayAvailable: booleanTypeAny,
            isGiftCardRedemptionEnabled: booleanTypeAny,
            isGiftCardValueThresholdMet: booleanTypeAny,
            giftCardRedemptionPercentage: numberType,
          },
        }
        expect(body).toMatchSchema(orderSummarySchemaBasket)
      },
      30000
    )

    it(
      'GET Order Summary => Basket => Delivery Options (Free Standard International 8 £0.00)',
      () => {
        const body = response.body.basket.deliveryOptions
        body.forEach((delOpts) => {
          const orderSummarySchemaBasketDelOpts = {
            title: 'Existing User Order Summary => Basket => Delivery Options',
            type: 'object',
            required: [
              'selected',
              'deliveryOptionId',
              'deliveryOptionExternalId',
              'type',
              'label',
              'enabled',
              'plainLabel',
              'shippingCost',
            ],
            properties: {
              selected: delOpts.label.includes('Standard International 8')
                ? booleanType(true)
                : booleanType(false),
              deliveryOptionId: numberType,
              type: stringType,
              deliveryOptionExternalId: delOpts.label.includes(
                'Standard International 8'
              )
                ? stringTypePattern('s')
                : stringType,
              label: delOpts.selected
                ? stringTypePattern('Standard International 8')
                : stringType,
              enabled: booleanType(true),
              plainLabel: stringType,
              shippingCost: numberType,
            },
          }
          expect(delOpts).toMatchSchema(orderSummarySchemaBasketDelOpts)
        })
      },
      30000
    )

    it(
      'GET Order Summary Existing User Tracked and Faster 4 => Basket => Products',
      () => {
        const body = response.body.basket.products
        body.forEach((product) => {
          const orderSummarySchemaBasketDelOpts = {
            title: 'Order Summary Existing User => Basket => Products',
            type: 'object',
            required: [
              'productId',
              'catEntryId',
              'orderItemId',
              'shipModeId',
              'lineNumber',
              'size',
              'name',
              'quantity',
              'inStock',
              'unitPrice',
              'totalPrice',
              'assets',
              'lowStock',
              'items',
              'bundleProducts',
              'attributes',
              'colourSwatches',
              'tpmLinks',
              'bundleSlots',
              'ageVerificationRequired',
              'isBundleOrOutfit',
              'discountText',
              'restrictedDeliveryItem',
              'baseImageUrl',
              'iscmCategory',
              'freeItem',
              'isDDPProduct',
              'sourceUrl',
            ],
            optional: ['wasWasPrice', 'wasPrice'],
            properties: {
              productId: numberType,
              catEntryId: numberType,
              orderItemId: numberType,
              shipModeId: numberType,
              lineNumber: stringType,
              size: stringType,
              name: stringType,
              quantity: numberType,
              inStock: booleanType(true),
              unitPrice: stringType,
              totalPrice: numberType,
              assets: arrayType(4),
              lowStock: { type: 'boolean' },
              items: arrayType(),
              bundleProducts: arrayType(),
              attributes: objectType,
              colourSwatches: arrayType(),
              tpmLinks: arrayType(),
              bundleSlots: arrayType(),
              ageVerificationRequired: booleanType(false),
              isBundleOrOutfit: booleanType(false),
              discountText: stringTypeCanBeEmpty,
              wasWasPrice: stringType,
              wasPrice: stringType,
              restrictedDeliveryItem: booleanType(false),
              baseImageUrl: stringType,
              iscmCategory: stringType,
              freeItem: booleanType(false),
              isDDPProduct: booleanType(false),
              sourceUrl: stringType,
            },
          }
          expect(product).toMatchSchema(orderSummarySchemaBasketDelOpts)
        })
      },
      30000
    )

    it(
      'GET Order Summary Existing User Tracked and Faster 4 => Basket => Products => assets',
      () => {
        const body = response.body.basket.products
        body.forEach((prod) => {
          prod.assets.forEach((asset) => {
            const shoppingBagProductsSchema = {
              title:
                'Shopping Bag Existing User GET Product products assets Json Schema',
              type: 'object',
              required: ['assetType', 'index', 'url'],
              properties: {
                assetType: stringType,
                index: numberType,
                url: stringType,
              },
            }
            expect(asset).toMatchSchema(shoppingBagProductsSchema)
          })
        })
      },
      30000
    )

    it(
      'GET Order Summary Existing User Tracked and Faster 4 => Basket => inventoryPositions Json Schema',
      () => {
        const obj = response.body.basket.inventoryPositions
        let inv
        Object.keys(obj).forEach((props) => {
          if (obj[props].invavls) {
            inv = obj[props].invavls
          } else {
            inv = obj[props].inventorys
          }
          const shoppingBagInventoryPositionsProps = {
            partNumber: obj[props].partNumber,
            catentryId: obj[props].catentryId,
            inv,
          }
          let shoppingBagInventoryPositionsSchema
          if (inv !== null) {
            shoppingBagInventoryPositionsSchema = {
              title:
                'Shopping Bag Existing User Simple Product inventoryPositions Json Schema',
              type: 'object',
              required: ['partNumber', 'catentryId', 'inv'],
              properties: {
                partNumber: stringTypeNumber,
                catentryId: stringTypeNumber,
                inv: {
                  type: 'array',
                  minItems: numberTypePattern(1, 1),
                  uniqueItems: booleanType(true),
                  items: objectType,
                },
              },
            }
          } else {
            shoppingBagInventoryPositionsSchema = {
              title:
                'Shopping Bag Existing User Simple Product inventoryPositions Json Schema',
              type: 'object',
              required: ['partNumber', 'catentryId', 'inv'],
              properties: {
                partNumber: stringTypeNumber,
                catentryId: stringTypeNumber,
              },
            }
          }
          expect(shoppingBagInventoryPositionsProps).toMatchSchema(
            shoppingBagInventoryPositionsSchema
          )
        })
      },
      30000
    )

    it(
      'GET Order Summary Existing User Tracked and Faster 4 => Basket => inventoryPositions => inventories && invavls Json Schema',
      () => {
        const obj = response.body.basket.inventoryPositions
        Object.keys(obj).forEach((props) => {
          if (obj[props].invavls) {
            obj[props].invavls.forEach((prop) => {
              const shoppingBagInvAvlsPositionsProps = {
                cutofftime: prop.cutofftime,
                quantity: prop.quantity,
                stlocIdentifier: prop.stlocIdentifier,
                expressdates: prop.expressdates,
              }
              const shoppingBagInvAvlsPositionsSchema = {
                title:
                  'Shopping Bag Existing User Simple Product inventoryPositions => inventories && invavls Json Schema',
                type: 'object',
                required: [
                  'cutofftime',
                  'quantity',
                  'stlocIdentifier',
                  'expressdates',
                ],
                properties: {
                  cutofftime: stringTypeNumber,
                  quantity: numberType,
                  stlocIdentifier: stringType,
                  expressdates: {
                    type: 'array',
                    minItems: numberTypePattern(2, 2),
                    uniqueItems: booleanType(true),
                    items: objectType,
                  },
                },
              }
              expect(shoppingBagInvAvlsPositionsProps).toMatchSchema(
                shoppingBagInvAvlsPositionsSchema
              )
            })
          } else if (obj[props].inventorys) {
            obj[props].inventorys.forEach((prop) => {
              const shoppingBagInventorysPositionsProps = {
                cutofftime: prop.cutofftime,
                quantity: prop.quantity,
                ffmcenterId: prop.ffmcenterId,
                expressdates: prop.expressdates,
              }
              const shoppingBagInventorysPositionsSchema = {
                title:
                  'Shopping Bag Existing User Simple Product inventoryPositions => inventories && invavls Json Schema',
                type: 'object',
                required: [
                  'cutofftime',
                  'quantity',
                  'ffmcenterId',
                  'expressdates',
                ],
                properties: {
                  cutofftime: stringTypeNumber,
                  quantity: numberType,
                  ffmcenterId: numberType,
                  expressdates: {
                    type: 'array',
                    minItems: numberTypePattern(2, 2),
                    uniqueItems: booleanType(true),
                    items: stringType,
                  },
                },
              }
              expect(shoppingBagInventorysPositionsProps).toMatchSchema(
                shoppingBagInventorysPositionsSchema
              )
            })
          }
        })
      },
      30000
    )

    it(
      'GET Order Summary Existing User Tracked and Faster 4 => Basket => inventoryPositions => inventories && invavls => ExpressDates Properties Values',
      () => {
        const obj = response.body.basket.inventoryPositions
        Object.keys(obj).forEach((props) => {
          if (obj[props].invavls) {
            obj[props].invavls.forEach((prop) => {
              const expressdateSchema = {
                title: 'Existing User Express date in inventory item',
                type: 'array',
                required: ['0', '1'],
                properties: {
                  0: stringType,
                  1: stringType,
                },
              }
              expect(prop.expressdates).toMatchSchema(expressdateSchema)
            })
          } else if (obj[props].inventorys) {
            obj[props].inventorys.forEach((prop) => {
              const expressdateSchema = {
                title: 'Existing User Express date in inventory item',
                type: 'array',
                required: ['0', '1'],
                properties: {
                  0: stringType,
                  1: stringType,
                },
              }
              expect(prop.expressdates).toMatchSchema(expressdateSchema)
            })
          }
        })
      },
      30000
    )

    it(
      'GET Order Summary Existing User Tracked and Faster 4 => deliveryLocations Json Schema',
      () => {
        response.body.deliveryLocations.forEach((deliveryLoc) => {
          const deliveryLocSchema = {
            title: 'Existing User Delivery Location Schema',
            type: 'object',
            required: [
              'deliveryLocationType',
              'selected',
              'enabled',
              'label',
              'deliveryMethods',
            ],
            properties: {
              deliveryLocationType: stringType,
              selected: {
                type: 'boolean',
                enum:
                  deliveryLoc.deliveryLocationType === 'HOME'
                    ? [true]
                    : [false],
              },
              enabled: booleanType,
              label: stringType,
              deliveryMethods: arrayType(),
            },
          }
          expect(deliveryLoc).toMatchSchema(deliveryLocSchema)
        })
      },
      30000
    )

    it(
      'GET Order Summary => deliveryLocations => deliveryMethods Json Schema',
      () => {
        response.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            const deliveryLocSchema = {
              title: 'Existing User Delivery Method Schema',
              type: 'object',
              required: [
                'shipModeId',
                'deliveryType',
                'label',
                'additionalDescription',
                'selected',
                'deliveryOptions',
                'enabled',
                'cost',
              ],
              optional: ['shipCode'],
              properties: {
                shipModeId: numberType,
                deliveryType:
                  deliveryMethod.label === 'Standard International 8'
                    ? stringTypePattern('HOME_STANDARD')
                    : stringTypePattern('HOME_EXPRESS'),
                label:
                  deliveryMethod.deliveryType === 'HOME_STANDARD'
                    ? stringTypePattern('Standard International 8')
                    : stringTypePattern('Tracked and Faster 4'),
                additionalDescription: stringType,
                selected: {
                  type: 'boolean',
                  enum:
                    deliveryMethod.deliveryType === 'HOME_STANDARD'
                      ? [true]
                      : [false],
                },
                deliveryOptions: arrayType(),
                enabled: booleanType(true),
                cost: stringType,
                shipCode:
                  deliveryMethod.deliveryType === 'HOME_STANDARD'
                    ? stringType
                    : stringTypeEmpty,
                estimatedDeliveryDate: stringTypeCanBeEmpty,
              },
            }
            expect(deliveryMethod).toMatchSchema(deliveryLocSchema)
          })
        })
      },
      30000
    )
  })
})
