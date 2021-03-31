/* eslint-disable no-restricted-syntax,no-prototype-builtins */
import { createAccount } from '../utilis/userAccount'

require('@babel/register')

jest.unmock('superagent')
import superagent from 'superagent'

import eps from '../routes_tests'
import {
  arrayType,
  booleanType,
  booleanTypeAny,
  headers,
  numberType,
  numberTypePattern,
  objectType,
  stringType,
  stringTypeCanBeEmpty,
  stringTypeEmpty,
  stringTypeNumber,
} from '../utilis'
import { storeExpressPayload } from './order-summary-data'
import { addItemToShoppingBag2 } from '../utilis/shoppingBag'
import { getProducts } from '../utilis/selectProducts'

describe('Order Summary -> New User Scenarios', () => {
  let products
  let newAccount
  let jsessionId
  let orderId
  let orderSummaryResp

  beforeAll(async () => {
    products = await getProducts()
    newAccount = await createAccount()
    jsessionId = newAccount.jsessionid
    await addItemToShoppingBag2(jsessionId, products.productsSimpleId)
    orderSummaryResp = await superagent
      .get(eps.checkout.orderSummary.path)
      .set(headers)
      .set({ Cookie: jsessionId })
      .send(storeExpressPayload(orderId))
    orderId = orderSummaryResp.body.basket.orderId
  }, 60000)

  describe('It should return a New User User Order Summary Json', () => {
    it(
      'Get Order Summary New User',
      () => {
        const body = orderSummaryResp.body
        const orderSummarySchema = {
          title: 'Order Summary New User',
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
            'checkoutDiscountIntroEspot',
            'deliveryDetails',
          ],
          optional: ['checkoutDiscountIntroEspot', 'isGuestOrder'],
          properties: {
            isGuestOrder: booleanType(false),
            basket: objectType,
            deliveryLocations: arrayType(),
            giftCards: arrayType(),
            deliveryInstructions: stringTypeEmpty,
            smsMobileNumber: stringTypeEmpty,
            shippingCountry: stringType,
            savedAddresses: arrayType(),
            ageVerificationDeliveryConfirmationRequired: booleanType(false),
            estimatedDelivery: arrayType(1, true, 'string'),
            checkoutDiscountIntroEspot: objectType,
            deliveryDetails: objectType,
          },
        }
        expect(body).toMatchSchema(orderSummarySchema)
      },
      30000
    )

    it(
      'Get Order Summary New User => Basket',
      () => {
        const body = orderSummaryResp.body.basket
        const orderSummarySchemaBasket = {
          title: 'Order Summary New User => Basket',
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
      'Get Order Summary New User => Basket => Delivery Options (Standard Delivery 4.00)',
      () => {
        const body = orderSummaryResp.body.basket.deliveryOptions
        body.forEach((delOpts) => {
          const orderSummarySchemaBasketDelOpts = {
            title: 'Order Summary New User => Basket => Delivery Options',
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
              selected: booleanType,
              deliveryOptionId: numberType,
              type: stringType,
              deliveryOptionExternalId: stringType,
              label: stringType,
              enabled: delOpts.label.includes('Today')
                ? booleanType(false)
                : booleanType(true),
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
      'Get Order Summary New User => Basket => Products',
      () => {
        const body = orderSummaryResp.body.basket.products
        body.forEach((product) => {
          const orderSummarySchemaBasketDelOpts = {
            title: 'Order Summary New User => Basket => Products',
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
      'Get Order Summary New User => Basket => Products => assets',
      () => {
        const body = orderSummaryResp.body.basket.products
        body.forEach((prod) => {
          prod.assets.forEach((asset) => {
            const shoppingBagProductsSchema = {
              title:
                'Shopping Bag New User GET Product products assets Json Schema',
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
      'Get Order Summary New User => Basket => inventoryPositions Json Schema',
      () => {
        const obj = orderSummaryResp.body.basket.inventoryPositions
        let inv
        for (const props in obj) {
          if (obj.hasOwnProperty(props)) {
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
                  'Shopping Bag New User Simple Product inventoryPositions Json Schema',
                type: 'object',
                required: ['partNumber', 'catentryId', 'inv'],
                properties: {
                  partNumber: stringTypeNumber,
                  catentryId: stringTypeNumber,
                  inv: {
                    type: 'array',
                    minItems: 1,
                    uniqueItems: true,
                    items: objectType,
                  },
                },
              }
            } else {
              shoppingBagInventoryPositionsSchema = {
                title:
                  'Shopping Bag New User Simple Product inventoryPositions Json Schema',
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
          }
        }
      },
      30000
    )

    it(
      'Get Order Summary New User => Basket => inventoryPositions => inventories && invavls Json Schema',
      () => {
        const obj = orderSummaryResp.body.basket.inventoryPositions
        for (const props in obj) {
          if (obj.hasOwnProperty(props)) {
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
                    'Shopping Bag New User Simple Product inventoryPositions => inventories && invavls Json Schema',
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
                      items: stringType,
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
                    'Shopping Bag New User Simple Product inventoryPositions => inventories && invavls Json Schema',
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
          }
        }
      },
      30000
    )

    it(
      'Get Order Summary New User => Basket => inventoryPositions => inventories && invavls => ExpressDates Properties Values',
      () => {
        const obj = orderSummaryResp.body.basket.inventoryPositions
        for (const props in obj) {
          if (obj.hasOwnProperty(props)) {
            if (obj[props].invavls) {
              obj[props].invavls.forEach((prop) => {
                const expressdateSchema = {
                  title: 'New User Express date in inventory item',
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
                  title: 'New User Express date in inventory item',
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
          }
        }
      },
      30000
    )

    it(
      'Get Order Summary New User => deliveryLocations Json Schema',
      () => {
        orderSummaryResp.body.deliveryLocations.forEach((deliveryLoc) => {
          const deliveryLocSchema = {
            title: 'New User Delivery Location Schema',
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
              enabled: { type: 'boolean' },
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
      'Get Order Summary New User => deliveryLocations => deliveryMethods Json Schema',
      () => {
        orderSummaryResp.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            const deliveryLocSchema = {
              title: 'New User Delivery Method Schema',
              type: 'object',
              required: [
                'deliveryType',
                'label',
                'additionalDescription',
                'selected',
                'deliveryOptions',
                'enabled',
                'cost',
                'shipCode',
              ],
              optional: ['shipModeId'],
              properties: {
                shipModeId: numberType,
                deliveryType: stringType,
                label: stringType,
                additionalDescription:
                  deliveryMethod.deliveryType === 'HOME_STANDARD'
                    ? stringType
                    : stringTypeEmpty,
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
                estimatedDeliveryDate: stringTypeCanBeEmpty,
                shipCode:
                  deliveryMethod.deliveryType === 'HOME_STANDARD'
                    ? stringType
                    : stringTypeEmpty,
              },
            }
            expect(deliveryMethod).toMatchSchema(deliveryLocSchema)
          })
        })
      },
      30000
    )

    it(
      'Get Order Summary New User => deliveryLocations => deliveryMethods => deliveryOptions Json Schema',
      () => {
        orderSummaryResp.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            deliveryMethod.deliveryOptions.forEach((deliveryOption) => {
              const deliveryOptionSchema = {
                title: 'New User Delivery Option Schema',
                type: 'object',
                required: [
                  'dayText',
                  'dateText',
                  'nominatedDate',
                  'selected',
                  'shipModeId',
                  'price',
                  'enabled',
                ],
                properties: {
                  dayText: stringType,
                  dateText: stringType,
                  nominatedDate: stringType,
                  selected: { type: 'boolean' },
                  shipModeId: numberType,
                  price: stringType,
                  enabled: { type: 'boolean' },
                },
              }
              expect(deliveryOption).toMatchSchema(deliveryOptionSchema)
            })
          })
        })
      },
      30000
    )

    it('Get Order Summary => deliveryDetails', () => {
      const deliveryDetails = orderSummaryResp.body.deliveryDetails
      const deliveryDetailsSchema = {
        title: 'Delivery Details Schema',
        type: 'object',
        required: ['addressDetailsId', 'nameAndPhone', 'address'],
        properties: {
          addressDetailsId: numberType,
          nameAndPhone: objectType,
          address: objectType,
        },
      }
      expect(deliveryDetails).toMatchSchema(deliveryDetailsSchema)
    })

    it('Get Order Summary => deliveryDetails => nameAndPhone', () => {
      const deliveryDetailsNameAndPhone =
        orderSummaryResp.body.deliveryDetails.nameAndPhone
      const deliveryDetailsNameAndPhoneSchema = {
        title: 'Delivery Details nameAndPhone Schema',
        type: 'object',
        required: ['lastName', 'telephone', 'title', 'firstName'],
        properties: {
          lastName: stringTypeEmpty,
          telephone: stringTypeEmpty,
          title: stringTypeEmpty,
          firstName: stringTypeEmpty,
        },
      }
      expect(deliveryDetailsNameAndPhone).toMatchSchema(
        deliveryDetailsNameAndPhoneSchema
      )
    })

    it('Get Order Summary => deliveryDetails => address', () => {
      const deliveryDetailsAddress =
        orderSummaryResp.body.deliveryDetails.address
      const deliveryDetailsAddressSchema = {
        title: 'Delivery Details address Schema',
        type: 'object',
        required: [
          'address1',
          'address2',
          'city',
          'state',
          'country',
          'postcode',
        ],
        properties: {
          address1: stringTypeEmpty,
          address2: stringTypeEmpty,
          city: stringTypeEmpty,
          state: stringTypeEmpty,
          country: stringType,
          postcode: stringTypeEmpty,
        },
      }
      expect(deliveryDetailsAddress).toMatchSchema(deliveryDetailsAddressSchema)
    })
  })
})
