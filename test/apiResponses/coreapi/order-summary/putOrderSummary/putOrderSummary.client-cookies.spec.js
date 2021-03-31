/* eslint-disable no-restricted-syntax,no-prototype-builtins */
require('@babel/register')

jest.unmock('superagent')

import {
  objectType,
  arrayType,
  stringType,
  stringTypeCanBeEmpty,
  stringTypeNumber,
  stringTypeEmpty,
  numberType,
  numberTypePattern,
  stringTypePattern,
  booleanType,
  booleanTypeAny,
} from '../../utilis'
import {
  homeExpressPayload,
  storeCFSNotSupportedPayload,
  storeStandardPayload,
  storeExpressPayload,
  parcelshopPayload,
  homeStandardPayload,
} from '../order-summary-data'
import { getProducts } from '../../utilis/selectProducts'
import { getOrderSummary, updateOrderSummary } from '../../utilis/orderSummary'
import { STORE_NO_LONGER_SUPPORTS_CFS } from '../../message-data'
import { createAccountResponse } from '../../utilis/userAccount'
import { addItemToShoppingBagResponse } from '../../utilis/shoppingBag'
import { getResponseAndSessionCookies } from '../../utilis/redis'
import { processClientCookies } from '../../utilis/cookies'

describe('Modifying order delivery methods existing user', () => {
  let cookies
  let products
  let orderId
  let orderSummaryResp

  beforeAll(async () => {
    products = await getProducts()
  }, 60000)

  beforeEach(async () => {
    const { mergeCookies } = processClientCookies()
    const newAccountResponse = await createAccountResponse()
    cookies = mergeCookies(newAccountResponse)
    const shoppingBagResponse = await addItemToShoppingBagResponse(
      cookies,
      products.productsSimpleId
    )
    cookies = mergeCookies(shoppingBagResponse)
    orderSummaryResp = await getOrderSummary(cookies)
    cookies = mergeCookies(orderSummaryResp)
    orderId = orderSummaryResp.body.basket.orderId
  }, 60000)

  describe('It should return an Existing User Order Summary Json Schema - Home Standard', () => {
    // TODO: remove when redis is removed
    it(
      'should client and redis cookies in sync',
      async () => {
        const { responseCookies, session } = await getResponseAndSessionCookies(
          orderSummaryResp
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )

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
            shippingCountry: stringType,
            savedAddresses: arrayType(),
            ageVerificationDeliveryConfirmationRequired: booleanType(false),
            estimatedDelivery: arrayType(0, true, 'string'),
            checkoutDiscountIntroEspot: objectType,
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
            'isBasketResponse',
            'isDDPOrder',
            'isBasketResponse',
            'isOrderCoveredByGiftCards',
            'deliveryThresholdsJson',
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
          },
        }
        expect(body).toMatchSchema(orderSummarySchemaBasket)
      },
      30000
    )

    it(
      'Get Order Summary => Basket => Delivery Options (Standard Delivery 4.00)',
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
              'type',
              'label',
              'enabled',
              'plainLabel',
              'shippingCost',
            ],
            optional: ['label'],
            properties: {
              selected: booleanType,
              deliveryOptionId: numberType,
              deliveryOptionExternalId: stringType,
              type: stringType,
              label: stringType,
              enabled: booleanType,
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
              'freeItem',
              'restrictedDeliveryItem',
              'baseImageUrl',
              'iscmCategory',
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
          }
        }
      },
      30000
    )

    it(
      'Get Order Summary => Basket => inventoryPositions => inventories && invavls Json Schema',
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
          }
        }
      },
      30000
    )

    it(
      'Get Order Summary => Basket => inventoryPositions => inventories && invavls => ExpressDates Properties Values',
      () => {
        const obj = orderSummaryResp.body.basket.inventoryPositions
        for (const props in obj) {
          if (obj.hasOwnProperty(props)) {
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
          }
        }
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
                enabled: booleanType,
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

    it(
      'Get Order Summary => deliveryLocations => deliveryMethods => deliveryOptions Json Schema',
      () => {
        orderSummaryResp.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            deliveryMethod.deliveryOptions.forEach((deliveryOption) => {
              const deliveryOptionSchema = {
                title: 'Existing User Delivery Option Schema',
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
                  selected: booleanTypeAny,
                  shipModeId: numberType,
                  price: stringType,
                  enabled: booleanTypeAny,
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

  describe.skip('Existing User Order Summary => Store selected does not support CFS', () => {
    let returnedResponse
    beforeAll(async () => {
      try {
        returnedResponse = await updateOrderSummary(
          storeCFSNotSupportedPayload(orderId),
          cookies
        )
      } catch (e) {
        returnedResponse = e
      }
    }, 60000)

    it(
      'PUT Order Summary returns an error',
      () => {
        const {
          response: { body },
        } = returnedResponse
        expect(body).toMatchSchema(STORE_NO_LONGER_SUPPORTS_CFS)
      },
      30000
    )

    // TODO: remove when redis is removed.
    it(
      'should keep cookies in client in sync with redis',
      async () => {
        const { responseCookies, session } = await getResponseAndSessionCookies(
          returnedResponse
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )
  })

  describe.skip('Existing User Order Summary => Modifying Delivery Option To Store Standard', () => {
    let response
    beforeAll(async () => {
      response = await updateOrderSummary(
        storeStandardPayload(orderId),
        cookies
      )
    }, 60000)

    // TODO: remove when redis is removed.
    it(
      'should keep cookies in client in sync with redis',
      async () => {
        const { responseCookies, session } = await getResponseAndSessionCookies(
          response
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Store Standard => Basket',
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
          },
        }
        expect(body).toMatchSchema(orderSummarySchemaBasket)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Store Standard => Basket => Delivery Options (Free Collect From Store Standard £0.00)',
      () => {
        const body = response.body.basket.deliveryOptions
        body.forEach((delOpts) => {
          const orderSummarySchemaBasketDelOpts = {
            title: 'Order Summary Existing User => Basket => Delivery Options',
            type: 'object',
            required: [
              'selected',
              'deliveryOptionId',
              'deliveryOptionExternalId',
              'type',
              'enabled',
              'plainLabel',
              'shippingCost',
            ],
            optional: ['label'],
            properties: {
              selected: booleanType,
              deliveryOptionId: numberType,
              deliveryOptionExternalId: stringType,
              type: stringType,
              label: stringType,
              enabled: booleanType,
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
      'PUT Order Summary Existing User Store Standard => deliveryLocations Json Schema',
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
              selected: booleanType,
              enabled: booleanType(true),
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
      'PUT Order Summary Existing User Store Standard => deliveryLocations => deliveryMethods Json Schema',
      () => {
        response.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            const deliveryLocSchema = {
              title: 'Existing User Delivery Method Schema',
              type: 'object',
              required: [
                'deliveryType',
                'label',
                'additionalDescription',
                'selected',
                'deliveryOptions',
                'enabled',
                'cost',
              ],
              optional: ['shipCode', 'shipModeId'],
              properties: {
                shipModeId: numberType,
                deliveryType: stringType,
                label: stringType,
                additionalDescription: stringTypeCanBeEmpty,
                selected: booleanType,
                deliveryOptions: arrayType(),
                enabled: {
                  type: 'boolean',
                  enum:
                    deliveryMethod.deliveryType === 'STORE_IMMEDIATE'
                      ? [false]
                      : [true],
                },
                cost: stringType,
                shipCode: stringTypeCanBeEmpty,
                estimatedDeliveryDate: stringTypeCanBeEmpty,
              },
            }
            expect(deliveryMethod).toMatchSchema(deliveryLocSchema)
          })
        })
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Store Standard => deliveryLocations => deliveryMethods => deliveryOptions Json Schema',
      () => {
        response.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            deliveryMethod.deliveryOptions.forEach((deliveryOption) => {
              const deliveryOptionSchema = {
                title: 'Existing User Delivery Option Schema',
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
                  selected: booleanTypeAny,
                  shipModeId: numberType,
                  price: stringType,
                  enabled: booleanTypeAny,
                },
              }
              expect(deliveryOption).toMatchSchema(deliveryOptionSchema)
            })
          })
        })
      },
      30000
    )
  })

  describe('Existing user Order Summary => Modifying Delivery Option To Home Express', () => {
    let response
    beforeAll(async () => {
      response = await updateOrderSummary(homeExpressPayload(orderId), cookies)
    }, 60000)

    // TODO: remove when redis is removed.
    it(
      'should keep cookies in client in sync with redis',
      async () => {
        const { responseCookies, session } = await getResponseAndSessionCookies(
          response
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Home Express => Basket',
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
          },
        }
        expect(body).toMatchSchema(orderSummarySchemaBasket)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Home Express => Basket => Delivery Options (Express / Nominated Day Delivery £6.00)',
      () => {
        const body = response.body.basket.deliveryOptions
        body.forEach((delOpts) => {
          const orderSummarySchemaBasketDelOpts = {
            title: 'Order Summary Existing User => Basket => Delivery Options',
            type: 'object',
            required: [
              'selected',
              'deliveryOptionId',
              'deliveryOptionExternalId',
              'type',
              'enabled',
              'plainLabel',
              'shippingCost',
            ],
            optional: ['label'],
            properties: {
              selected: booleanType,
              deliveryOptionId: numberType,
              type: stringType,
              deliveryOptionExternalId: stringType,
              label: stringType,
              enabled: booleanType,
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
      'PUT Order Summary Existing User Home Express => deliveryLocations Json Schema',
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
      'PUT Order Summary Existing User Home Express => deliveryLocations => deliveryMethods Json Schema',
      () => {
        response.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            const deliveryLocSchema = {
              title: 'Existing User Delivery Method Schema',
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
                additionalDescription: stringTypeCanBeEmpty,
                selected: { type: 'boolean' },
                deliveryOptions: arrayType(),
                enabled: booleanType(true),
                cost: stringType,
                shipCode: stringTypeCanBeEmpty,
                estimatedDeliveryDate: stringTypeCanBeEmpty,
              },
            }
            expect(deliveryMethod).toMatchSchema(deliveryLocSchema)
          })
        })
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Home Express => deliveryLocations => deliveryMethods => deliveryOptions Json Schema',
      () => {
        response.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            deliveryMethod.deliveryOptions.forEach((deliveryOption) => {
              const deliveryOptionSchema = {
                title: 'Existing User Delivery Option Schema',
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
                  selected: booleanTypeAny,
                  shipModeId: numberType,
                  price: stringType,
                  enabled: booleanTypeAny,
                },
              }
              expect(deliveryOption).toMatchSchema(deliveryOptionSchema)
            })
          })
        })
      },
      30000
    )
  })

  describe.skip('Existing User Order Summary => Modifying Delivery Option To Parcelshop', () => {
    let response
    beforeAll(async () => {
      response = await updateOrderSummary(parcelshopPayload(orderId), cookies)
    }, 60000)

    // TODO: remove when redis is removed.
    it(
      'should keep cookies in client in sync with redis',
      async () => {
        const { responseCookies, session } = await getResponseAndSessionCookies(
          response
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Parcelshop => Basket',
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
          },
        }
        expect(body).toMatchSchema(orderSummarySchemaBasket)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Parcelshop => Basket => Delivery Options (Collect from ParcelShop £4.00)',
      () => {
        const body = response.body.basket.deliveryOptions
        body.forEach((delOpts) => {
          const orderSummarySchemaBasketDelOpts = {
            title: 'Order Summary Existing User => Basket => Delivery Options',
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
              optional: ['label'],
              selected: booleanType,
              deliveryOptionId: numberType,
              deliveryOptionExternalId: stringType,
              type: stringType,
              label: stringType,
              enabled: booleanType,
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
      'PUT Order Summary Existing User Parcelshop => deliveryLocations Json Schema',
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
              optional: ['label'],
              selected: booleanType,
              label: stringType,
              enabled: booleanType,
              deliveryMethods: arrayType(),
            },
          }
          expect(deliveryLoc).toMatchSchema(deliveryLocSchema)
        })
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Parcelshop => deliveryLocations => deliveryMethods Json Schema',
      () => {
        response.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            const deliveryLocSchema = {
              title: 'Existing User Delivery Method Schema',
              type: 'object',
              required: [
                'deliveryType',
                'label',
                'additionalDescription',
                'selected',
                'deliveryOptions',
                'enabled',
                'cost',
                'shipModeId',
              ],
              properties: {
                shipModeId: numberType,
                deliveryType: stringType,
                label: stringType,
                additionalDescription: stringTypeCanBeEmpty,
                selected: booleanType,
                deliveryOptions: arrayType(),
                enabled: booleanType(true),
                cost: stringType,
                shipCode: stringTypeCanBeEmpty,
                estimatedDeliveryDate: stringTypeCanBeEmpty,
              },
            }
            expect(deliveryMethod).toMatchSchema(deliveryLocSchema)
          })
        })
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Parcelshop => deliveryLocations => deliveryMethods => deliveryOptions Json Schema',
      () => {
        response.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            deliveryMethod.deliveryOptions.forEach((deliveryOption) => {
              const deliveryOptionSchema = {
                title: 'Existing User Delivery Option Schema',
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
                  enabled: booleanType,
                },
              }
              expect(deliveryOption).toMatchSchema(deliveryOptionSchema)
            })
          })
        })
      },
      30000
    )
  })

  describe.skip('Existing User Order Summary => Modifying Delivery Option To Store Express', () => {
    let response
    beforeAll(async () => {
      response = await updateOrderSummary(storeExpressPayload(orderId), cookies)
    }, 60000)

    // TODO: remove when redis is removed.
    it(
      'should keep cookies in client in sync with redis',
      async () => {
        const { responseCookies, session } = await getResponseAndSessionCookies(
          response
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Store Express => Basket',
      () => {
        const body = orderSummaryResp.body.basket
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
          },
        }
        expect(body).toMatchSchema(orderSummarySchemaBasket)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Store Express => Basket => Delivery Options (Collect From Store Express £3.00)',
      () => {
        const body = orderSummaryResp.body.basket.deliveryOptions
        body.forEach((delOpts) => {
          const orderSummarySchemaBasketDelOpts = {
            title: 'Order Summary Existing User => Basket => Delivery Options',
            type: 'object',
            required: [
              'selected',
              'deliveryOptionId',
              'deliveryOptionExternalId',
              'type',
              'enabled',
              'plainLabel',
              'shippingCost',
            ],
            optional: ['label'],
            properties: {
              selected: booleanType,
              deliveryOptionId: numberType,
              deliveryOptionExternalId: stringType,
              type: stringType,
              label: stringType,
              enabled: booleanType,
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
      'PUT Order Summary Existing User Store Express => deliveryLocations Json Schema',
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
              selected: booleanType,
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
      'PUT Order Summary Existing User Store Express => deliveryLocations => deliveryMethods Json Schema',
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
                'cost',
                'label',
              ],
              optional: ['shipCode'],
              properties: {
                shipModeId: numberType,
                deliveryType: stringType,
                label: stringType,
                additionalDescription: stringType,
                selected: booleanType,
                deliveryOptions: arrayType(),
                enabled: booleanType,
                cost: stringType,
                shipCode: stringType,
                estimatedDeliveryDate: stringTypeCanBeEmpty,
              },
            }
            expect(deliveryMethod).toMatchSchema(deliveryLocSchema)
          })
        })
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Store Express => deliveryLocations => deliveryMethods => deliveryOptions Json Schema',
      () => {
        response.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            deliveryMethod.deliveryOptions.forEach((deliveryOption) => {
              const deliveryOptionSchema = {
                title: 'Existing User Delivery Option Schema',
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
                  selected: booleanTypeAny,
                  shipModeId: numberType,
                  price: stringType,
                  enabled: booleanTypeAny,
                },
              }
              expect(deliveryOption).toMatchSchema(deliveryOptionSchema)
            })
          })
        })
      },
      30000
    )
  })

  describe('Existing User Order Summary => Modifying Delivery Option To Home Standard', () => {
    let response
    beforeAll(async () => {
      response = await updateOrderSummary(homeStandardPayload(orderId), cookies)
    }, 30000)

    // TODO: remove when redis is removed.
    it(
      'should keep cookies in client in sync with redis',
      async () => {
        const { responseCookies, session } = await getResponseAndSessionCookies(
          response
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Home Standard => Basket',
      () => {
        const body = orderSummaryResp.body.basket
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
          },
        }
        expect(body).toMatchSchema(orderSummarySchemaBasket)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Home Standard => Basket => Delivery Options (Standard Delivery 4.00)',
      () => {
        const body = orderSummaryResp.body.basket.deliveryOptions
        body.forEach((delOpts) => {
          const orderSummarySchemaBasketDelOpts = {
            title: 'Order Summary Existing User => Basket => Delivery Options',
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
              optional: ['label'],
              selected: booleanType,
              type: stringType,
              deliveryOptionId: numberType,
              deliveryOptionExternalId: stringType,
              label: stringType,
              enabled: booleanType,
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
      'PUT Order Summary Existing User Home Standard => deliveryLocations Json Schema',
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
              selected: booleanType,
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
      'PUT Order Summary Existing User Home Standard => deliveryLocations => deliveryMethods Json Schema',
      () => {
        response.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            const deliveryLocSchema = {
              title: 'Existing User Delivery Method Schema',
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

    it(
      'PUT Order Summary Existing User Home Standard => deliveryLocations => deliveryMethods => deliveryOptions Json Schema',
      () => {
        response.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            deliveryMethod.deliveryOptions.forEach((deliveryOption) => {
              const deliveryOptionSchema = {
                title: 'Existing User Delivery Option Schema',
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
                  selected: booleanTypeAny,
                  shipModeId: numberType,
                  price: stringType,
                  enabled: booleanTypeAny,
                },
              }
              expect(deliveryOption).toMatchSchema(deliveryOptionSchema)
            })
          })
        })
      },
      30000
    )
  })

  describe.skip('Existing User Order Summary => Modifying Delivery Option To Parcelshop', () => {
    let response
    beforeAll(async () => {
      response = await updateOrderSummary(parcelshopPayload(orderId), cookies)
    }, 30000)

    // TODO: remove when redis is removed.
    it(
      'should keep cookies in client in sync with redis',
      async () => {
        const { responseCookies, session } = await getResponseAndSessionCookies(
          response
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Parcelshop => Basket',
      () => {
        const body = orderSummaryResp.body.basket
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
          },
        }
        expect(body).toMatchSchema(orderSummarySchemaBasket)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Parcelshop => Basket => Delivery Options (Collect from ParcelShop £4.00)',
      () => {
        const body = orderSummaryResp.body.basket.deliveryOptions
        body.forEach((delOpts) => {
          const orderSummarySchemaBasketDelOpts = {
            title: 'Order Summary Existing User => Basket => Delivery Options',
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
              deliveryOptionExternalId: stringType,
              type: stringType,
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
      'PUT Order Summary Existing User Parcelshop => deliveryLocations Json Schema',
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
                  deliveryLoc.deliveryLocationType === 'PARCELSHOP'
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
      'PUT Order Summary Existing User Parcelshop => deliveryLocations => deliveryMethods Json Schema',
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
                deliveryType: stringTypePattern('PARCELSHOP_COLLECTION'),
                label: stringTypePattern('Collect from ParcelShop'),
                additionalDescription: stringType,
                selected: booleanType(true),
                deliveryOptions: arrayType(),
                enabled: booleanType(true),
                cost: stringType,
                shipCode: stringType,
                estimatedDeliveryDate: stringTypeCanBeEmpty,
              },
            }
            expect(deliveryMethod).toMatchSchema(deliveryLocSchema)
          })
        })
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Parcelshop => deliveryLocations => deliveryMethods => deliveryOptions Json Schema',
      () => {
        response.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            deliveryMethod.deliveryOptions.forEach((deliveryOption) => {
              const deliveryOptionSchema = {
                title: 'Existing User Delivery Option Schema',
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
                  selected: booleanTypeAny,
                  shipModeId: numberType,
                  price: stringType,
                  enabled: booleanTypeAny,
                },
              }
              expect(deliveryOption).toMatchSchema(deliveryOptionSchema)
            })
          })
        })
      },
      30000
    )
  })

  describe('Existing user Order Summary => Modifying Delivery Option To Home Express', () => {
    let response
    beforeAll(async () => {
      response = await updateOrderSummary(homeExpressPayload(orderId), cookies)
    }, 30000)

    // TODO: remove when redis is removed.
    it(
      'should keep cookies in client in sync with redis',
      async () => {
        const { responseCookies, session } = await getResponseAndSessionCookies(
          response
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Home Express => Basket',
      () => {
        const body = orderSummaryResp.body.basket
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
          },
        }
        expect(body).toMatchSchema(orderSummarySchemaBasket)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Home Express => Basket => Delivery Options (Express / Nominated Day Delivery £6.00)',
      () => {
        const body = orderSummaryResp.body.basket.deliveryOptions
        body.forEach((delOpts) => {
          const orderSummarySchemaBasketDelOpts = {
            title: 'Order Summary Existing User => Basket => Delivery Options',
            type: 'object',
            required: [
              'selected',
              'deliveryOptionId',
              'deliveryOptionExternalId',
              'type',
              'enabled',
              'plainLabel',
              'shippingCost',
            ],
            optional: ['label'],
            properties: {
              selected: booleanType,
              deliveryOptionId: numberType,
              deliveryOptionExternalId: stringType,
              type: stringType,
              label: stringType,
              enabled: booleanType,
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
      'PUT Order Summary Existing User Home Express => deliveryLocations Json Schema',
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
      'PUT Order Summary Existing User Home Express => deliveryLocations => deliveryMethods Json Schema',
      () => {
        response.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            const deliveryLocSchema = {
              title: 'Existing User Delivery Method Schema',
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
                    deliveryMethod.deliveryType === 'HOME_EXPRESS'
                      ? [true]
                      : [false],
                },
                deliveryOptions: arrayType(),
                enabled: booleanType(true),
                cost: stringType,
                shipCode: stringType,
                estimatedDeliveryDate: stringTypeCanBeEmpty,
              },
            }
            expect(deliveryMethod).toMatchSchema(deliveryLocSchema)
          })
        })
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Home Express => deliveryLocations => deliveryMethods => deliveryOptions Json Schema',
      () => {
        response.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            deliveryMethod.deliveryOptions.forEach((deliveryOption) => {
              const deliveryOptionSchema = {
                title: 'Existing User Delivery Option Schema',
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
                  selected: booleanTypeAny,
                  shipModeId: numberType,
                  price: stringType,
                  enabled: booleanTypeAny,
                },
              }
              expect(deliveryOption).toMatchSchema(deliveryOptionSchema)
            })
          })
        })
      },
      30000
    )
  })

  describe.skip('Existing User Order Summary => Modifying Delivery Option To Store Express', () => {
    let response
    beforeAll(async () => {
      response = await updateOrderSummary(storeExpressPayload(orderId), cookies)
    }, 30000)

    // TODO: remove when redis is removed.
    it(
      'should keep cookies in client in sync with redis',
      async () => {
        const { responseCookies, session } = await getResponseAndSessionCookies(
          response
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Store Express => Basket',
      () => {
        const body = orderSummaryResp.body.basket
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
          },
        }
        expect(body).toMatchSchema(orderSummarySchemaBasket)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Store Express => Basket => Delivery Options (Collect From Store Express £3.00)',
      () => {
        const body = orderSummaryResp.body.basket.deliveryOptions
        body.forEach((delOpts) => {
          const orderSummarySchemaBasketDelOpts = {
            title: 'Order Summary Existing User => Basket => Delivery Options',
            type: 'object',
            required: [
              'selected',
              'deliveryOptionId',
              'deliveryOptionExternalId',
              'type',
              'enabled',
              'plainLabel',
              'shippingCost',
            ],
            optional: ['label'],
            properties: {
              selected: booleanType,
              deliveryOptionId: numberType,
              deliveryOptionExternalId: stringType,
              type: stringType,
              label: stringType,
              enabled: booleanType,
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
      'PUT Order Summary Existing User Store Express => deliveryLocations Json Schema',
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
                  deliveryLoc.deliveryLocationType === 'STORE'
                    ? [true]
                    : [false],
              },
              enabled: booleanType(true),
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
      'PUT Order Summary Existing User Store Express => deliveryLocations => deliveryMethods Json Schema',
      () => {
        response.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            const deliveryLocSchema = {
              title: 'Existing User Delivery Method Schema',
              type: 'object',
              required: [
                'shipModeId',
                'deliveryType',
                'additionalDescription',
                'selected',
                'deliveryOptions',
                'cost',
                'label',
              ],
              optional: ['shipCode'],
              properties: {
                shipModeId: numberType,
                deliveryType: stringType,
                label: stringType,
                additionalDescription: stringType,
                selected: booleanType,
                deliveryOptions: arrayType(),
                enabled: booleanType,
                cost: stringType,
                shipCode: stringType,
                estimatedDeliveryDate: stringTypeCanBeEmpty,
              },
            }
            expect(deliveryMethod).toMatchSchema(deliveryLocSchema)
          })
        })
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Store Express => deliveryLocations => deliveryMethods => deliveryOptions Json Schema',
      () => {
        response.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            deliveryMethod.deliveryOptions.forEach((deliveryOption) => {
              const deliveryOptionSchema = {
                title: 'Existing User Delivery Option Schema',
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
                  selected: booleanTypeAny,
                  shipModeId: numberType,
                  price: stringType,
                  enabled: booleanTypeAny,
                },
              }
              expect(deliveryOption).toMatchSchema(deliveryOptionSchema)
            })
          })
        })
      },
      30000
    )
  })

  describe.skip('Existing User Order Summary => Modifying Delivery Option To Store Standard', () => {
    let response
    beforeAll(async () => {
      response = await updateOrderSummary(
        storeStandardPayload(orderId),
        cookies
      )
    }, 30000)

    // TODO: remove when redis is removed.
    it(
      'should keep cookies in client in sync with redis',
      async () => {
        const { responseCookies, session } = await getResponseAndSessionCookies(
          response
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Store Standard => Basket',
      () => {
        const body = orderSummaryResp.body.basket
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
          },
        }
        expect(body).toMatchSchema(orderSummarySchemaBasket)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Store Standard => Basket => Delivery Options (Free Collect From Store Standard £0.00)',
      () => {
        const body = orderSummaryResp.body.basket.deliveryOptions
        body.forEach((delOpts) => {
          const orderSummarySchemaBasketDelOpts = {
            title: 'Order Summary Existing User => Basket => Delivery Options',
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
              deliveryOptionExternalId: delOpts.label.includes(
                'Collect From Store Standard £'
              )
                ? stringTypePattern('retail_store_standard')
                : stringType,
              label: stringType,
              type: stringType,
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
      'PUT Order Summary Existing User Store Standard => deliveryLocations Json Schema',
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
                  deliveryLoc.deliveryLocationType === 'STORE'
                    ? [true]
                    : [false],
              },
              enabled: booleanType(true),
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
      'PUT Order Summary Existing User Store Standard => deliveryLocations => deliveryMethods Json Schema',
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
                deliveryType: stringType,
                label: stringType,
                additionalDescription: stringType,
                selected: {
                  type: 'boolean',
                  enum:
                    deliveryMethod.deliveryType === 'STORE_STANDARD'
                      ? [true]
                      : [false],
                },
                deliveryOptions: arrayType(),
                enabled: {
                  type: 'boolean',
                  enum:
                    deliveryMethod.deliveryType === 'STORE_IMMEDIATE'
                      ? [false]
                      : [true],
                },
                cost: stringType,
                shipCode: stringType,
                estimatedDeliveryDate: stringTypeCanBeEmpty,
              },
            }
            expect(deliveryMethod).toMatchSchema(deliveryLocSchema)
          })
        })
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Store Standard => deliveryLocations => deliveryMethods => deliveryOptions Json Schema',
      () => {
        response.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            deliveryMethod.deliveryOptions.forEach((deliveryOption) => {
              const deliveryOptionSchema = {
                title: 'Existing User Delivery Option Schema',
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
                  selected: booleanTypeAny,
                  shipModeId: numberType,
                  price: stringType,
                  enabled: booleanTypeAny,
                },
              }
              expect(deliveryOption).toMatchSchema(deliveryOptionSchema)
            })
          })
        })
      },
      30000
    )
  })

  describe.skip('Existing User Order Summary => Modifying Delivery Option To Parcelshop', () => {
    let response
    beforeAll(async () => {
      response = await updateOrderSummary(parcelshopPayload(orderId), cookies)
    }, 30000)

    // TODO: remove when redis is removed.
    it(
      'should keep cookies in client in sync with redis',
      async () => {
        const { responseCookies, session } = await getResponseAndSessionCookies(
          response
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Parcelshop => Basket',
      () => {
        const body = orderSummaryResp.body.basket
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
          },
        }
        expect(body).toMatchSchema(orderSummarySchemaBasket)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Parcelshop => Basket => Delivery Options (Collect from ParcelShop £4.00)',
      () => {
        const body = orderSummaryResp.body.basket.deliveryOptions
        body.forEach((delOpts) => {
          const orderSummarySchemaBasketDelOpts = {
            title: 'Order Summary Existing User => Basket => Delivery Options',
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
              deliveryOptionExternalId: delOpts.label.includes(
                'Collect from ParcelShop £'
              )
                ? stringTypePattern('retail_store_collection')
                : stringType,
              label: stringType,
              type: stringType,
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
      'PUT Order Summary Existing User Parcelshop => deliveryLocations Json Schema',
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
                  deliveryLoc.deliveryLocationType === 'PARCELSHOP'
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
      'PUT Order Summary Existing User Parcelshop => deliveryLocations => deliveryMethods Json Schema',
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
                deliveryType: stringTypePattern('PARCELSHOP_COLLECTION'),
                label: stringTypePattern('Collect from ParcelShop'),
                additionalDescription: stringType,
                selected: booleanType(true),
                deliveryOptions: arrayType(),
                enabled: booleanType(true),
                cost: stringType,
                shipCode: stringType,
                estimatedDeliveryDate: stringTypeCanBeEmpty,
              },
            }
            expect(deliveryMethod).toMatchSchema(deliveryLocSchema)
          })
        })
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Parcelshop => deliveryLocations => deliveryMethods => deliveryOptions Json Schema',
      () => {
        response.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            deliveryMethod.deliveryOptions.forEach((deliveryOption) => {
              const deliveryOptionSchema = {
                title: 'Existing User Delivery Option Schema',
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
                  selected: booleanTypeAny,
                  shipModeId: numberType,
                  price: stringType,
                  enabled: booleanTypeAny,
                },
              }
              expect(deliveryOption).toMatchSchema(deliveryOptionSchema)
            })
          })
        })
      },
      30000
    )
  })

  describe.skip('Existing User Order Summary => Modifying Delivery Option To Store Standard', () => {
    let response
    beforeAll(async () => {
      response = await updateOrderSummary(
        storeStandardPayload(orderId),
        cookies
      )
    }, 30000)

    // TODO: remove when redis is removed.
    it(
      'should keep cookies in client in sync with redis',
      async () => {
        const { responseCookies, session } = await getResponseAndSessionCookies(
          response
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Store Standard => Basket',
      () => {
        const body = orderSummaryResp.body.basket
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
          },
        }
        expect(body).toMatchSchema(orderSummarySchemaBasket)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Store Standard => Basket => Delivery Options (Free Collect From Store Standard £0.00)',
      () => {
        const body = orderSummaryResp.body.basket.deliveryOptions
        body.forEach((delOpts) => {
          const orderSummarySchemaBasketDelOpts = {
            title: 'Order Summary Existing User => Basket => Delivery Options',
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
              deliveryOptionExternalId: delOpts.label.includes(
                'Collect From Store Standard £'
              )
                ? stringTypePattern('retail_store_standard')
                : stringType,
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
      'PUT Order Summary Existing User Store Standard => deliveryLocations Json Schema',
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
                  deliveryLoc.deliveryLocationType === 'STORE'
                    ? [true]
                    : [false],
              },
              enabled: booleanType(true),
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
      'PUT Order Summary Existing User Store Standard => deliveryLocations => deliveryMethods Json Schema',
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
                deliveryType: stringType,
                label: stringType,
                additionalDescription: stringType,
                selected: {
                  type: 'boolean',
                  enum:
                    deliveryMethod.deliveryType === 'STORE_STANDARD'
                      ? [true]
                      : [false],
                },
                deliveryOptions: arrayType(),
                enabled: {
                  type: 'boolean',
                  enum:
                    deliveryMethod.deliveryType === 'STORE_IMMEDIATE'
                      ? [false]
                      : [true],
                },
                cost: stringType,
                shipCode: stringType,
                estimatedDeliveryDate: stringTypeCanBeEmpty,
              },
            }
            expect(deliveryMethod).toMatchSchema(deliveryLocSchema)
          })
        })
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Store Standard => deliveryLocations => deliveryMethods => deliveryOptions Json Schema',
      () => {
        response.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            deliveryMethod.deliveryOptions.forEach((deliveryOption) => {
              const deliveryOptionSchema = {
                title: 'Existing User Delivery Option Schema',
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
                  selected: booleanTypeAny,
                  shipModeId: numberType,
                  price: stringType,
                  enabled: booleanTypeAny,
                },
              }
              expect(deliveryOption).toMatchSchema(deliveryOptionSchema)
            })
          })
        })
      },
      30000
    )
  })

  describe('Existing User Order Summary => Modifying Delivery Option To Home Standard', () => {
    let response
    beforeAll(async () => {
      response = await updateOrderSummary(homeStandardPayload(orderId), cookies)
    }, 30000)

    // TODO: remove when redis is removed.
    it(
      'should keep cookies in client in sync with redis',
      async () => {
        const { responseCookies, session } = await getResponseAndSessionCookies(
          response
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Home Standard => Basket',
      () => {
        const body = orderSummaryResp.body.basket
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
          },
        }
        expect(body).toMatchSchema(orderSummarySchemaBasket)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Home Standard => Basket => Delivery Options (Standard Delivery 4.00)',
      () => {
        const body = orderSummaryResp.body.basket.deliveryOptions
        body.forEach((delOpts) => {
          const orderSummarySchemaBasketDelOpts = {
            title: 'Order Summary Existing User => Basket => Delivery Options',
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
              optional: ['label'],
              selected: booleanType,
              deliveryOptionId: numberType,
              deliveryOptionExternalId: stringType,
              type: stringType,
              label: stringType,
              enabled: booleanType,
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
      'PUT Order Summary Existing User Home Standard => deliveryLocations Json Schema',
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
      'PUT Order Summary Existing User Home Standard => deliveryLocations => deliveryMethods Json Schema',
      () => {
        response.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            const deliveryLocSchema = {
              title: 'Existing User Delivery Method Schema',
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

    it(
      'PUT Order Summary Existing User Home Standard => deliveryLocations => deliveryMethods => deliveryOptions Json Schema',
      () => {
        response.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            deliveryMethod.deliveryOptions.forEach((deliveryOption) => {
              const deliveryOptionSchema = {
                title: 'Existing User Delivery Option Schema',
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
                  selected: booleanTypeAny,
                  shipModeId: numberType,
                  price: stringType,
                  enabled: booleanTypeAny,
                },
              }
              expect(deliveryOption).toMatchSchema(deliveryOptionSchema)
            })
          })
        })
      },
      30000
    )
  })

  describe('Existing User Order Summary => Modifying Delivery Option To Store Express', () => {
    it(
      'PUT Order Summary Existing User Store Express => Basket',
      () => {
        const body = orderSummaryResp.body.basket
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
          },
        }
        expect(body).toMatchSchema(orderSummarySchemaBasket)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Store Express => Basket => Delivery Options (Collect From Store Express £3.00)',
      () => {
        const body = orderSummaryResp.body.basket.deliveryOptions
        body.forEach((delOpts) => {
          const orderSummarySchemaBasketDelOpts = {
            title: 'Order Summary Existing User => Basket => Delivery Options',
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
              deliveryOptionExternalId: stringType,
              label: stringType,
              type: stringType,
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
      'PUT Order Summary Existing User Store Express => deliveryLocations Json Schema',
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
              selected: booleanType,
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
      'PUT Order Summary Existing User Store Express => deliveryLocations => deliveryMethods Json Schema',
      () => {
        orderSummaryResp.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            const deliveryLocSchema = {
              title: 'Existing User Delivery Method Schema',
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
                deliveryType: stringType,
                label: stringType,
                additionalDescription: stringTypeCanBeEmpty,
                selected: booleanType,
                deliveryOptions: arrayType(),
                enabled: booleanType,
                cost: stringType,
                shipCode: stringTypeCanBeEmpty,
                shipModeId: numberType,
                estimatedDeliveryDate: stringTypeCanBeEmpty,
              },
            }
            expect(deliveryMethod).toMatchSchema(deliveryLocSchema)
          })
        })
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Store Express => deliveryLocations => deliveryMethods => deliveryOptions Json Schema',
      () => {
        orderSummaryResp.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            deliveryMethod.deliveryOptions.forEach((deliveryOption) => {
              const deliveryOptionSchema = {
                title: 'Existing User Delivery Option Schema',
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
                  selected: booleanTypeAny,
                  shipModeId: numberType,
                  price: stringType,
                  enabled: booleanTypeAny,
                },
              }
              expect(deliveryOption).toMatchSchema(deliveryOptionSchema)
            })
          })
        })
      },
      30000
    )
  })

  describe('Existing user Order Summary => Modifying Delivery Option To Home Express', () => {
    let response
    beforeAll(async () => {
      response = await updateOrderSummary(homeExpressPayload(orderId), cookies)
    }, 30000)

    // TODO: remove when redis is removed.
    it(
      'should keep cookies in client in sync with redis',
      async () => {
        const { responseCookies, session } = await getResponseAndSessionCookies(
          response
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Home Express => Basket',
      () => {
        const body = orderSummaryResp.body.basket
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
          },
        }
        expect(body).toMatchSchema(orderSummarySchemaBasket)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Home Express => Basket => Delivery Options (Express / Nominated Day Delivery £6.00)',
      () => {
        const body = orderSummaryResp.body.basket.deliveryOptions
        body.forEach((delOpts) => {
          const orderSummarySchemaBasketDelOpts = {
            title: 'Order Summary Existing User => Basket => Delivery Options',
            type: 'object',
            required: [
              'selected',
              'deliveryOptionId',
              'type',
              'deliveryOptionExternalId',
              'enabled',
              'plainLabel',
              'shippingCost',
            ],
            optional: ['label'],
            properties: {
              selected: booleanType,
              deliveryOptionId: numberType,
              type: stringType,
              deliveryOptionExternalId: stringType,
              label: stringType,
              enabled: booleanType,
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
      'PUT Order Summary Existing User Home Express => deliveryLocations Json Schema',
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
      'PUT Order Summary Existing User Home Express => deliveryLocations => deliveryMethods Json Schema',
      () => {
        response.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            const deliveryLocSchema = {
              title: 'Existing User Delivery Method Schema',
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
                    deliveryMethod.deliveryType === 'HOME_EXPRESS'
                      ? [true]
                      : [false],
                },
                deliveryOptions: arrayType(),
                enabled: booleanType(true),
                cost: stringType,
                shipCode: stringType,
                estimatedDeliveryDate: stringTypeCanBeEmpty,
              },
            }
            expect(deliveryMethod).toMatchSchema(deliveryLocSchema)
          })
        })
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Home Express => deliveryLocations => deliveryMethods => deliveryOptions Json Schema',
      () => {
        response.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            deliveryMethod.deliveryOptions.forEach((deliveryOption) => {
              const deliveryOptionSchema = {
                title: 'Existing User Delivery Option Schema',
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
                  selected: booleanTypeAny,
                  shipModeId: numberType,
                  price: stringType,
                  enabled: booleanTypeAny,
                },
              }
              expect(deliveryOption).toMatchSchema(deliveryOptionSchema)
            })
          })
        })
      },
      30000
    )
  })

  describe('Existing User Order Summary => Modifying Delivery Option To Home Standard', () => {
    let response
    beforeAll(async () => {
      response = await updateOrderSummary(homeStandardPayload(orderId), cookies)
    }, 30000)

    // TODO: remove when redis is removed.
    it(
      'should keep cookies in client in sync with redis',
      async () => {
        const { responseCookies, session } = await getResponseAndSessionCookies(
          response
        )
        expect(responseCookies).toMatchSession(session)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Home Standard => Basket',
      () => {
        const body = orderSummaryResp.body.basket
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
          },
        }
        expect(body).toMatchSchema(orderSummarySchemaBasket)
      },
      30000
    )

    it(
      'PUT Order Summary Existing User Home Standard => Basket => Delivery Options (Standard Delivery 4.00)',
      () => {
        const body = orderSummaryResp.body.basket.deliveryOptions
        body.forEach((delOpts) => {
          const orderSummarySchemaBasketDelOpts = {
            title: 'Order Summary Existing User => Basket => Delivery Options',
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
              optional: ['label'],
              selected: booleanType,
              deliveryOptionId: numberType,
              type: stringType,
              deliveryOptionExternalId: stringType,
              label: stringType,
              enabled: booleanType,
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
      'PUT Order Summary Existing User Home Standard => deliveryLocations Json Schema',
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
      'PUT Order Summary Existing User Home Standard => deliveryLocations => deliveryMethods Json Schema',
      () => {
        response.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            const deliveryLocSchema = {
              title: 'Existing User Delivery Method Schema',
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

    it(
      'PUT Order Summary Existing User Home Standard => deliveryLocations => deliveryMethods => deliveryOptions Json Schema',
      () => {
        response.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            deliveryMethod.deliveryOptions.forEach((deliveryOption) => {
              const deliveryOptionSchema = {
                title: 'Existing User Delivery Option Schema',
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
                  enabled: booleanType,
                },
              }
              expect(deliveryOption).toMatchSchema(deliveryOptionSchema)
            })
          })
        })
      },
      30000
    )
  })
})
