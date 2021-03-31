/* eslint-disable no-restricted-syntax,no-prototype-builtins */

require('@babel/register')

jest.unmock('superagent')
import {
  objectType,
  arrayType,
  stringType,
  stringTypeNumber,
  stringTypeEmpty,
  numberType,
  numberTypePattern,
  stringTypePattern,
  stringTypeCanBeEmpty,
  booleanType,
  booleanTypeAny,
} from '../../utilis'
import { getProducts } from '../../utilis/selectProducts'
import { createAccountResponse } from '../../utilis/userAccount'
import { addItemToShoppingBagResponse } from '../../utilis/shoppingBag'
import { getOrderSummary } from '../../utilis/orderSummary'
import { processClientCookies } from '../../utilis/cookies'
import { getResponseAndSessionCookies } from '../../utilis/redis'

describe('It should return Order Summary Json', () => {
  let cookies
  let mergeCookies
  let products
  let orderSummaryResponse

  beforeAll(async () => {
    ;({ mergeCookies } = processClientCookies())
    products = await getProducts()
    const newAccountResponse = await createAccountResponse()
    cookies = mergeCookies(newAccountResponse)
    const shoppingBagResponse = await addItemToShoppingBagResponse(
      cookies,
      products.productsSimpleId
    )
    cookies = mergeCookies(shoppingBagResponse)
    orderSummaryResponse = await getOrderSummary(cookies)
  }, 60000)

  // TODO: remove when redis is removed.
  it(
    'should keep cookies in client in sync with redis',
    async () => {
      const { responseCookies, session } = await getResponseAndSessionCookies(
        orderSummaryResponse
      )
      expect(responseCookies).toMatchSession(session)
    },
    30000
  )

  describe('It should return a New User Order Summary Json Schema', () => {
    it(
      'Get Order Summary',
      () => {
        const body = orderSummaryResponse.body
        const orderSummarySchema = {
          title: 'New User Order Summary',
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
        const body = orderSummaryResponse.body.basket
        const orderSummarySchemaBasket = {
          title: 'New User Order Summary => Basket',
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
  })

  describe('It should return an Existing User Order Summary Json Schema - Home Standard', () => {
    it(
      'Get Order Summary',
      () => {
        const body = orderSummaryResponse.body
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
      'Get Order Summary => Basket => Delivery Options (Standard Delivery 4.00)',
      () => {
        const body = orderSummaryResponse.body.basket.deliveryOptions
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
              selected: booleanType,
              deliveryOptionId: numberType,
              deliveryOptionExternalId: delOpts.label.includes(
                'Standard Delivery £'
              )
                ? stringTypePattern('s')
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
      'Get Order Summary => Basket => Products',
      () => {
        const body = orderSummaryResponse.body.basket.products
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
              lowStock: {
                type: 'boolean',
              },
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
        const body = orderSummaryResponse.body.basket.products
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
        const obj = orderSummaryResponse.body.basket.inventoryPositions
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
        const obj = orderSummaryResponse.body.basket.inventoryPositions
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
        const obj = orderSummaryResponse.body.basket.inventoryPositions
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
        orderSummaryResponse.body.deliveryLocations.forEach((deliveryLoc) => {
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
        orderSummaryResponse.body.deliveryLocations.forEach((deliveryLoc) => {
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
      'Get Order Summary => deliveryLocations => deliveryMethods => deliveryOptions Json Schema',
      () => {
        orderSummaryResponse.body.deliveryLocations.forEach((deliveryLoc) => {
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
                  selected: {
                    type: 'boolean',
                  },
                  shipModeId: numberType,
                  price: stringType,
                  enabled: {
                    type: 'boolean',
                  },
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
      const deliveryDetails = orderSummaryResponse.body.deliveryDetails
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
        orderSummaryResponse.body.deliveryDetails.nameAndPhone
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
        orderSummaryResponse.body.deliveryDetails.address
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

  describe('It should return an Existing User Order Summary Json Schema - Home Express Delivery', () => {
    it(
      'Get Order Summary',
      () => {
        const body = orderSummaryResponse.body
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
      'Get Order Summary => Basket => Delivery Options (Home Express Delivery)',
      () => {
        const body = orderSummaryResponse.body.basket.deliveryOptions
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
        const body = orderSummaryResponse.body.basket.products
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
              lowStock: {
                type: 'boolean',
              },
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
        const body = orderSummaryResponse.body.basket.products
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
        const obj = orderSummaryResponse.body.basket.inventoryPositions
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
                  partNumber: {
                    type: 'string',
                  },
                  catentryId: {
                    type: 'number',
                  },
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
        const obj = orderSummaryResponse.body.basket.inventoryPositions
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
                    'Shopping Bag Simple Product inventoryPositions => inventories && invavls Json Schema',
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
        const obj = orderSummaryResponse.body.basket.inventoryPositions
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
      'Get Order Summary => deliveryLocations Json Schema (Home Express)',
      () => {
        orderSummaryResponse.body.deliveryLocations.forEach((deliveryLoc) => {
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
      'Get Order Summary => deliveryLocations => deliveryMethods => deliveryOptions Json Schema',
      () => {
        orderSummaryResponse.body.deliveryLocations.forEach((deliveryLoc) => {
          deliveryLoc.deliveryMethods.forEach((deliveryMethod) => {
            deliveryMethod.deliveryOptions.forEach((deliveryOption) => {
              const deliveryOptionSchema = {
                title: 'Existing User Delivery Option Schema',
                type: 'object',
                required: [
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
      const deliveryDetails = orderSummaryResponse.body.deliveryDetails
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
        orderSummaryResponse.body.deliveryDetails.nameAndPhone
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
        orderSummaryResponse.body.deliveryDetails.address
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

  describe('It should return an Existing User Order Summary Json Schema - Store Express Delivery', () => {
    it(
      'Get Order Summary => Basket => Delivery Options (Store Express Delivery)',
      () => {
        const body = orderSummaryResponse.body.basket.deliveryOptions
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
      'Get Order Summary => Basket => Products',
      () => {
        const body = orderSummaryResponse.body.basket.products
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
              lowStock: {
                type: 'boolean',
              },
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
        const body = orderSummaryResponse.body.basket.products
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
        const obj = orderSummaryResponse.body.basket.inventoryPositions
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
        const obj = orderSummaryResponse.body.basket.inventoryPositions
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
                    'Shopping Bag Simple Product inventoryPositions => inventories && invavls Json Schema',
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
        const obj = orderSummaryResponse.body.basket.inventoryPositions
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
  })
})
