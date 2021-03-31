require('@babel/register')

import chai from 'chai'

chai.use(require('chai-json-schema'))

const assert = chai.assert

import {
  stringType,
  stringTypeEmpty,
  stringTypeNumber,
  stringTypePattern,
  stringTypeCanBeEmpty,
  numberType,
  numberTypePattern,
  booleanType,
  booleanTypeAny,
  booleanOrString,
  objectType,
  arrayType,
} from '../utilis'
import {
  deliveryOptions,
  addItemToShoppingBag2,
  fetchSizeQtyResponse,
  updateShoppingBagDelivery,
  promotionCode,
  PROMOTION_CODE,
  transferShoppingBagResponse,
  updateShoppingBagItemResponse,
  addItemToShoppingBagResponse,
  removeItemFromShoppingBagResponse,
  updateShoppingBagDeliveryResponse,
  promotionCodeResponse,
  deletePromotionCodeResponse,
} from '../utilis/shoppingBag'
import {
  CODE_ALREADY_APPLIED,
  CODE_INVALID,
  CODE_ALREADY_REDEEMED,
} from '../message-data'
import { createAccountResponse } from '../utilis/userAccount'
import { getProducts } from '../utilis/selectProducts'
import { payOrder } from '../utilis/payOrder'
import { processClientCookies } from '../utilis/cookies'

describe('It should return the Shopping Bag Json Schema', () => {
  let mergeCookies
  let products
  let newAccount
  let shoppingBag
  let productSizeQty
  let shoppingBagCookiestwo
  let productSizeQtyCookies

  beforeAll(async () => {
    products = await getProducts()
  }, 60000)

  beforeEach(async () => {
    ;({ mergeCookies } = processClientCookies())
    const newAccountResponse = await createAccountResponse()
    const newAccountCookies = mergeCookies(newAccountResponse)
    const shoppingBagResponseOne = await addItemToShoppingBagResponse(
      newAccountCookies,
      products.productsSimpleId
    )
    const shoppingBagCookiesOne = mergeCookies(shoppingBagResponseOne)
    const shoppingBagResponseTwo = await addItemToShoppingBagResponse(
      shoppingBagCookiesOne,
      products.productsWasPriceId
    )
    shoppingBag = shoppingBagResponseTwo.body
    shoppingBagCookiestwo = mergeCookies(shoppingBagResponseTwo)
    const productSizeQtyResponse = await fetchSizeQtyResponse(
      shoppingBagCookiestwo,
      products.productsSimpleId.catEntry
    )
    productSizeQty = productSizeQtyResponse.body
    productSizeQtyCookies = mergeCookies(productSizeQtyResponse)
  }, 60000)

  describe('Shopping Bag GET Products', () => {
    it('Shopping Bag GET Product Json Schema', () => {
      const shoppingBagSchema = {
        title: 'Shopping Bag GET Product Json Schema',
        type: 'object',
        required: [
          'deliveryOptions',
          'discounts',
          'inventoryPositions',
          'orderId',
          'products',
          'promotions',
          'restrictedDeliveryItem',
          'savedProducts',
          'subTotal',
          'total',
          'totalBeforeDiscount',
          'isDDPOrder',
          'isBasketResponse',
          'isOrderCoveredByGiftCards',
          'deliveryThresholdsJson',
        ],
        optional: [
          'ageVerificationRequired',
          'isDDPUser',
          'isDDPProduct',
          'espots',
          'isClearPayAvailable',
          'isGiftCardRedemptionEnabled',
          'isGiftCardValueThresholdMet',
          'giftCardRedemptionPercentage',
        ],
        properties: {
          ageVerificationRequired: booleanOrString,
          deliveryOptions: arrayType(),
          discounts: arrayType(),
          inventoryPositions: objectType,
          orderId: numberType,
          products: arrayType(1),
          promotions: arrayType(),
          restrictedDeliveryItem: booleanType(false),
          savedProducts: arrayType(),
          subTotal: stringType,
          total: stringType,
          totalBeforeDiscount: stringType,
          isDDPUser: booleanType(false),
          isDDPProduct: booleanType(false),
          isDDPOrder: booleanType(false),
          isBasketResponse: booleanType(true),
          espots: objectType,
          isOrderCoveredByGiftCards: booleanType(false),
          deliveryThresholdsJson: stringType,
          isClearPayAvailable: booleanTypeAny,
          isGiftCardRedemptionEnabled: booleanTypeAny,
          isGiftCardValueThresholdMet: booleanTypeAny,
          giftCardRedemptionPercentage: numberType,
        },
      }
      expect(shoppingBag).toMatchSchema(shoppingBagSchema)
    })

    it('Shopping Bag GET Product deliveryOptions Json Schema', () => {
      shoppingBag.deliveryOptions.forEach((deliveryOption) => {
        const shoppingBagDeliveryOptionsSchema = {
          title: 'Shopping Bag GET Product deliveryOptions Json Schema',
          type: 'object',
          required: [
            'deliveryOptionExternalId',
            'deliveryOptionId',
            'enabled',
            'label',
            'type',
            'selected',
            'plainLabel',
            'shippingCost',
          ],
          properties: {
            deliveryOptionId: numberType,
            label: stringType,
            type: stringType,
            selected: {
              type: 'boolean',
              enum: deliveryOption.label.includes('UK Standard')
                ? [true]
                : [false],
            },
            deliveryOptionExternalId: stringType,
            enabled: {
              type: 'boolean',
              enum: deliveryOption.label.includes('Collect From Store Today')
                ? [false]
                : [true],
            },
            plainLabel: stringType,
            shippingCost: numberType,
          },
        }
        expect(deliveryOption).toMatchSchema(shoppingBagDeliveryOptionsSchema)
      })
    })

    it('Shopping Bag GET Product products Json Schema', () => {
      shoppingBag.products.forEach((product) => {
        if (product.productId === products.productsSimpleId.productId) {
          const shoppingBagSimpleProductsSchema = {
            title: 'Shopping Bag GET Product products Json Schema',
            type: 'object',
            required: [
              'assets',
              'attributes',
              'bundleProducts',
              'bundleSlots',
              'catEntryId',
              'colourSwatches',
              'discountText',
              'freeItem',
              'inStock',
              'isBundleOrOutfit',
              'items',
              'lineNumber',
              'lowStock',
              'name',
              'orderItemId',
              'productId',
              'quantity',
              'shipModeId',
              'size',
              'totalPrice',
              'tpmLinks',
              'unitPrice',
              'restrictedDeliveryItem',
              'baseImageUrl',
              'iscmCategory',
              'isDDPProduct',
              'sourceUrl',
            ],
            optional: ['ageVerificationRequired', 'wasPrice'],
            properties: {
              ageVerificationRequired: booleanOrString,
              assets: arrayType(4),
              attributes: objectType,
              bundleProducts: arrayType(),
              bundleSlots: arrayType(),
              catEntryId: numberType,
              colourSwatches: arrayType(),
              discountText: stringTypeCanBeEmpty,
              freeItem: booleanTypeAny,
              inStock: booleanType(true),
              isBundleOrOutfit: booleanType(false),
              items: arrayType(),
              lineNumber: stringType,
              lowStock: booleanTypeAny,
              name: stringType,
              orderItemId: numberType,
              productId: numberType,
              quantity: numberType,
              shipModeId: numberType,
              size: stringType,
              totalPrice: numberType,
              tpmLinks: arrayType(),
              unitPrice: stringType,
              restrictedDeliveryItem: booleanTypeAny,
              baseImageUrl: stringType,
              iscmCategory: stringType,
              isDDPProduct: booleanType(false),
              sourceUrl: stringType,
              wasPrice: stringTypeNumber,
            },
          }
          expect(product).toMatchSchema(shoppingBagSimpleProductsSchema)
        } else if (
          product.productId === products.productsWasPriceId.productId
        ) {
          const shoppingBagProductsWasPriceSchema = {
            title: 'Shopping Bag Product products Json Schema',
            type: 'object',
            required: [
              'assets',
              'attributes',
              'bundleProducts',
              'bundleSlots',
              'catEntryId',
              'colourSwatches',
              'freeItem',
              'inStock',
              'isBundleOrOutfit',
              'items',
              'lineNumber',
              'lowStock',
              'name',
              'orderItemId',
              'productId',
              'quantity',
              'shipModeId',
              'size',
              'totalPrice',
              'tpmLinks',
              'unitPrice',
              'wasPrice',
              'discountText',
              'restrictedDeliveryItem',
              'baseImageUrl',
              'iscmCategory',
              'isDDPProduct',
              'sourceUrl',
            ],
            optional: ['ageVerificationRequired', 'isClearPayAvailable'],
            properties: {
              ageVerificationRequired: booleanOrString,
              assets: arrayType(4),
              attributes: objectType,
              bundleProducts: arrayType(),
              bundleSlots: arrayType(),
              catEntryId: numberType,
              colourSwatches: arrayType(),
              freeItem: booleanTypeAny,
              inStock: booleanType(true),
              isBundleOrOutfit: booleanType(false),
              items: arrayType(),
              lineNumber: stringType,
              lowStock: booleanTypeAny,
              name: stringType,
              orderItemId: numberType,
              productId: numberType,
              quantity: numberType,
              shipModeId: numberType,
              size: stringType,
              totalPrice: numberType,
              tpmLinks: arrayType(),
              unitPrice: stringType,
              wasPrice: stringType,
              discountText: stringTypeCanBeEmpty,
              restrictedDeliveryItem: booleanType(false),
              baseImageUrl: stringType,
              iscmCategory: stringType,
              isDDPProduct: booleanType(false),
              sourceUrl: stringType,
              isClearPayAvailable: booleanTypeAny,
            },
          }
          expect(product).toMatchSchema(shoppingBagProductsWasPriceSchema)
        }
      })
    })

    it('Shopping Bag GET Product products assets Json Schema', () => {
      shoppingBag.products.forEach((prod) => {
        prod.assets.forEach((asset) => {
          const shoppingBagProductsSchema = {
            title: 'Shopping Bag GET Product products assets Json Schema',
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
    })

    it('Shopping Bag Simple Product inventoryPositions Json Schema', () => {
      const obj = shoppingBag.inventoryPositions
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
            title: 'Shopping Bag Simple Product inventoryPositions Json Schema',
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
            title: 'Shopping Bag Simple Product inventoryPositions Json Schema',
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
    })

    it('Shopping Bag Simple Product inventoryPositions => inventories && invavls Json Schema', () => {
      const obj = shoppingBag.inventoryPositions
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
                'Shopping Bag Simple Product inventoryPositions => inventories && invavls Json Schema',
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
      })
    })

    it('Shopping Bag Simple Product inventoryPositions => inventories && invavls => ExpressDates Properties Values', () => {
      const obj = shoppingBag.inventoryPositions
      Object.keys(obj).forEach((props) => {
        if (obj[props].invavls) {
          obj[props].invavls.forEach((prop) => {
            const expressdateSchema = {
              title: 'Express date in inventory item',
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
              title: 'Express date in inventory item',
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
    })
  })

  describe('Shopping Bag POST Product with wasPrice', () => {
    it('Shopping Bag POST Product Json Schema', () => {
      const shoppingBagSchema = {
        title: 'Shopping Bag Product Json Schema',
        type: 'object',
        required: [
          'deliveryOptions',
          'discounts',
          'inventoryPositions',
          'orderId',
          'products',
          'promotions',
          'restrictedDeliveryItem',
          'savedProducts',
          'subTotal',
          'total',
          'totalBeforeDiscount',
          'isDDPOrder',
          'isBasketResponse',
          'isOrderCoveredByGiftCards',
          'deliveryThresholdsJson',
        ],
        optional: [
          'isDDPUser',
          'isDDPProduct',
          'ageVerificationRequired',
          'espots',
          'isClearPayAvailable',
          'isGiftCardRedemptionEnabled',
          'isGiftCardValueThresholdMet',
          'giftCardRedemptionPercentage',
        ],
        properties: {
          ageVerificationRequired: booleanOrString,
          deliveryOptions: arrayType(),
          discounts: arrayType(),
          inventoryPositions: objectType,
          orderId: numberType,
          products: arrayType(1),
          promotions: arrayType(),
          restrictedDeliveryItem: booleanType(false),
          savedProducts: arrayType(),
          subTotal: stringType,
          total: stringType,
          totalBeforeDiscount: stringType,
          isDDPProduct: booleanType(false),
          isDDPOrder: booleanType(false),
          isDDPUser: booleanType(false),
          isBasketResponse: booleanType(true),
          espots: objectType,
          isOrderCoveredByGiftCards: booleanType(false),
          deliveryThresholdsJson: stringType,
          isClearPayAvailable: booleanTypeAny,
          isGiftCardRedemptionEnabled: booleanTypeAny,
          isGiftCardValueThresholdMet: booleanTypeAny,
          giftCardRedemptionPercentage: numberType,
        },
      }
      expect(shoppingBag).toMatchSchema(shoppingBagSchema)
    })

    it('Shopping Bag POST Product deliveryOptions Json Schema', () => {
      shoppingBag.deliveryOptions.forEach((deliveryOptions) => {
        const shoppingBagDeliveryOptionsSchema = {
          title: 'Shopping Bag POST Product deliveryOptions Json Schema',
          type: 'object',
          required: [
            'deliveryOptionId',
            'label',
            'deliveryOptionExternalId',
            'type',
            'selected',
            'enabled',
            'plainLabel',
            'shippingCost',
          ],
          properties: {
            deliveryOptionId: numberType,
            label: stringType,
            type: stringType,
            deliveryOptionExternalId: stringType,
            selected: {
              type: 'boolean',
              enum: deliveryOptions.label.includes('UK Standard ')
                ? [true]
                : [false],
            },
            enabled: {
              type: 'boolean',
              enum: deliveryOptions.label.includes('Collect From Store Today')
                ? [false]
                : [true],
            },
            plainLabel: stringType,
            shippingCost: numberType,
          },
        }
        expect(deliveryOptions).toMatchSchema(shoppingBagDeliveryOptionsSchema)
      })
    })

    it('Shopping Bag POST Product products Json Schema', () => {
      const shoppingBagProductsSchema = {
        title: 'Shopping Bag POST Product products Json Schema',
        type: 'object',
        required: [
          'assets',
          'attributes',
          'bundleProducts',
          'bundleSlots',
          'catEntryId',
          'colourSwatches',
          'discountText',
          'inStock',
          'isBundleOrOutfit',
          'items',
          'lineNumber',
          'lowStock',
          'name',
          'orderItemId',
          'productId',
          'quantity',
          'shipModeId',
          'size',
          'totalPrice',
          'tpmLinks',
          'unitPrice',
          'wasPrice',
          'restrictedDeliveryItem',
          'baseImageUrl',
          'iscmCategory',
          'freeItem',
          'sourceUrl',
        ],
        optional: ['isDDPOrder', 'isDDPProduct', 'ageVerificationRequired'],
        properties: {
          ageVerificationRequired: booleanOrString,
          assets: arrayType(4),
          attributes: objectType,
          bundleProducts: arrayType(),
          bundleSlots: arrayType(),
          catEntryId: numberType,
          colourSwatches: arrayType(),
          discountText: stringTypeCanBeEmpty,
          inStock: booleanType(true),
          isBundleOrOutfit: booleanType(false),
          isDDPProduct: booleanTypeAny,
          isDDPOrder: booleanTypeAny,
          items: arrayType(),
          lineNumber: stringType,
          lowStock: booleanTypeAny,
          name: stringType,
          orderItemId: numberType,
          productId: numberType,
          quantity: numberType,
          shipModeId: numberType,
          size: stringType,
          totalPrice: numberType,
          tpmLinks: arrayType(),
          unitPrice: stringType,
          wasPrice: stringType,
          restrictedDeliveryItem: booleanTypeAny,
          baseImageUrl: stringType,
          iscmCategory: stringType,
          freeItem: booleanType(false),
          sourceUrl: stringType,
        },
      }
      expect(shoppingBag.products[1]).toMatchSchema(shoppingBagProductsSchema)
    })

    it('Shopping Bag POST Product products assets Json Schema', () => {
      shoppingBag.products.forEach((prod) => {
        prod.assets.forEach((asset) => {
          const shoppingBagProductsSchema = {
            title: 'Shopping Bag POST Product products assets Json Schema',
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
    })

    it('Shopping Bag Simple Product inventoryPositions Json Schema', () => {
      const obj = shoppingBag.inventoryPositions
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
            title: 'Shopping Bag Simple Product inventoryPositions Json Schema',
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
            title: 'Shopping Bag Simple Product inventoryPositions Json Schema',
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
    })

    it('Shopping Bag Simple Product inventoryPositions => inventories && invavls Json Schema', () => {
      const obj = shoppingBag.inventoryPositions
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
                'Shopping Bag Simple Product inventoryPositions => inventories && invavls Json Schema',
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
      })
    })

    it('Shopping Bag Simple Product inventoryPositions => inventories && invavls => ExpressDates Properties Values', () => {
      const obj = shoppingBag.inventoryPositions
      Object.keys(obj).forEach((props) => {
        if (obj[props].invavls) {
          obj[props].invavls.forEach((prop) => {
            const expressdateSchema = {
              title: 'Express date in inventory item',
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
              title: 'Express date in inventory item',
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
    })
  })

  describe('Shopping Bag POST Product Simple', () => {
    it('Shopping Bag POST Product Json Schema', () => {
      const shoppingBagSchema = {
        title: 'Shopping Bag Product Json Schema',
        type: 'object',
        required: [
          'deliveryOptions',
          'discounts',
          'inventoryPositions',
          'orderId',
          'products',
          'promotions',
          'restrictedDeliveryItem',
          'savedProducts',
          'subTotal',
          'total',
          'totalBeforeDiscount',
          'isDDPOrder',
          'isBasketResponse',
          'isOrderCoveredByGiftCards',
          'deliveryThresholdsJson',
        ],
        optional: [
          'isDDPUser',
          'isDDPProduct',
          'ageVerificationRequired',
          'espots',
          'isClearPayAvailable',
          'isGiftCardRedemptionEnabled',
          'isGiftCardValueThresholdMet',
          'giftCardRedemptionPercentage',
        ],
        properties: {
          ageVerificationRequired: booleanOrString,
          deliveryOptions: arrayType(),
          discounts: arrayType(),
          inventoryPositions: objectType,
          orderId: numberType,
          products: arrayType(1),
          promotions: arrayType(),
          restrictedDeliveryItem: booleanType(false),
          savedProducts: arrayType(),
          subTotal: stringType,
          total: stringType,
          totalBeforeDiscount: stringType,
          isDDPUser: booleanType(false),
          isDDPProduct: booleanType(false),
          isDDPOrder: booleanType(false),
          isBasketResponse: booleanType(true),
          espots: objectType,
          isOrderCoveredByGiftCards: booleanType(false),
          deliveryThresholdsJson: stringType,
          isClearPayAvailable: booleanTypeAny,
          isGiftCardRedemptionEnabled: booleanTypeAny,
          isGiftCardValueThresholdMet: booleanTypeAny,
          giftCardRedemptionPercentage: numberType,
        },
      }
      expect(shoppingBag).toMatchSchema(shoppingBagSchema)
    })

    it('Shopping Bag POST Product deliveryOptions Json Schema', () => {
      shoppingBag.deliveryOptions.forEach((deliveryOptions) => {
        const shoppingBagDeliveryOptionsSchema = {
          title: 'Shopping Bag POST Product deliveryOptions Json Schema',
          type: 'object',
          required: [
            'deliveryOptionExternalId',
            'deliveryOptionId',
            'enabled',
            'label',
            'type',
            'selected',
            'plainLabel',
            'shippingCost',
          ],
          properties: {
            deliveryOptionId: numberType,
            label: stringType,
            deliveryOptionExternalId: stringType,
            type: stringType,
            selected: {
              type: 'boolean',
              enum: deliveryOptions.label.includes('UK Standard')
                ? [true]
                : [false],
            },
            enabled: {
              type: 'boolean',
              enum: deliveryOptions.label.includes('Collect From Store Today')
                ? [false]
                : [true],
            },
            plainLabel: stringType,
            shippingCost: numberType,
          },
        }
        expect(deliveryOptions).toMatchSchema(shoppingBagDeliveryOptionsSchema)
      })
    })

    it('Shopping Bag POST Product products Json Schema', () => {
      shoppingBag.products.forEach((product) => {
        const shoppingBagProductsSchema = {
          title: 'Shopping Bag POST Product products Json Schema',
          type: 'object',
          required: [
            'assets',
            'attributes',
            'bundleProducts',
            'bundleSlots',
            'catEntryId',
            'colourSwatches',
            'discountText',
            'inStock',
            'isBundleOrOutfit',
            'items',
            'lineNumber',
            'lowStock',
            'name',
            'orderItemId',
            'productId',
            'quantity',
            'shipModeId',
            'size',
            'totalPrice',
            'tpmLinks',
            'unitPrice',
            'restrictedDeliveryItem',
            'baseImageUrl',
            'iscmCategory',
            'isDDPProduct',
            'freeItem',
            'sourceUrl',
          ],
          optional: [
            'isDDPOrder',
            'isDDPProduct',
            'wasPrice',
            'ageVerificationRequired',
          ],
          properties: {
            ageVerificationRequired: booleanOrString,
            assets: arrayType(4),
            attributes: objectType,
            bundleProducts: arrayType(),
            bundleSlots: arrayType(),
            catEntryId: numberType,
            colourSwatches: arrayType(),
            discountText: stringTypeCanBeEmpty,
            inStock: booleanType(true),
            isBundleOrOutfit: booleanType(false),
            isDDPOrder: booleanTypeAny,
            items: arrayType(),
            lineNumber: stringType,
            lowStock: booleanTypeAny,
            name: stringType,
            orderItemId: numberType,
            productId: numberType,
            quantity: numberType,
            shipModeId: numberType,
            size: stringType,
            totalPrice: numberType,
            tpmLinks: arrayType(),
            unitPrice: stringType,
            restrictedDeliveryItem: booleanTypeAny,
            baseImageUrl: stringType,
            iscmCategory: stringType,
            isDDPProduct: booleanType(false),
            freeItem: booleanType(false),
            sourceUrl: stringType,
            wasPrice: stringType,
          },
        }
        expect(product).toMatchSchema(shoppingBagProductsSchema)
      })
    })

    it('Shopping Bag POST Product products assets Json Schema', () => {
      shoppingBag.products.forEach((prod) => {
        prod.assets.forEach((asset) => {
          const shoppingBagProductsSchema = {
            title: 'Shopping Bag POST Product products assets Json Schema',
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
    })

    it('Shopping Bag Simple Product inventoryPositions Json Schema', () => {
      const obj = shoppingBag.inventoryPositions
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
            title: 'Shopping Bag Simple Product inventoryPositions Json Schema',
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
            title: 'Shopping Bag Simple Product inventoryPositions Json Schema',
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
    })

    it('Shopping Bag Simple Product inventoryPositions => inventories && invavls Json Schema', () => {
      const obj = shoppingBag.inventoryPositions
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
                'Shopping Bag Simple Product inventoryPositions => inventories && invavls Json Schema',
              type: 'object',
              required: [
                'cutofftime',
                'quantity',
                'stlocIdentifier',
                'expressdates',
              ],
              properties: {
                cutofftime: stringType,
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
                cutofftime: stringType,
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
    })

    it('Shopping Bag Simple Product inventoryPositions => inventories && invavls => ExpressDates Properties Values', () => {
      const obj = shoppingBag.inventoryPositions
      Object.keys(obj).forEach((props) => {
        if (obj[props].invavls) {
          obj[props].invavls.forEach((prop) => {
            const expressdateSchema = {
              title: 'Express date in inventory item',
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
              title: 'Express date in inventory item',
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
    })
  })

  describe('Shopping Bag DELETE Product', () => {
    it('Shopping Bag DELETE Product Json Schema', async () => {
      const removeItemResponse = await removeItemFromShoppingBagResponse(
        productSizeQtyCookies,
        shoppingBag.orderId,
        shoppingBag.products[0].orderItemId
      )
      const shoppingBagSchema = {
        title: 'Shopping Bag Product Json Schema',
        type: 'object',
        required: [
          'deliveryOptions',
          'discounts',
          'inventoryPositions',
          'orderId',
          'products',
          'promotions',
          'restrictedDeliveryItem',
          'savedProducts',
          'subTotal',
          'total',
          'totalBeforeDiscount',
          'isDDPOrder',
          'isOrderCoveredByGiftCards',
          'deliveryThresholdsJson',
        ],
        optional: [
          'isBasketResponse',
          'isDDPUser',
          'isDDPProduct',
          'ageVerificationRequired',
          'espots',
          'isClearPayAvailable',
          'isGiftCardRedemptionEnabled',
          'isGiftCardValueThresholdMet',
          'giftCardRedemptionPercentage',
        ],
        properties: {
          ageVerificationRequired: booleanOrString,
          deliveryOptions: arrayType(),
          discounts: arrayType(),
          inventoryPositions: objectType,
          orderId: numberType,
          products: arrayType(1),
          promotions: arrayType(),
          restrictedDeliveryItem: booleanType(false),
          savedProducts: arrayType(),
          subTotal: stringType,
          total: stringType,
          totalBeforeDiscount: stringType,
          isDDPProduct: booleanType(false),
          isDDPOrder: booleanType(false),
          isDDPUser: booleanType(false),
          isBasketResponse: booleanType(true),
          espots: objectType,
          isOrderCoveredByGiftCards: booleanType(false),
          deliveryThresholdsJson: stringType,
          isClearPayAvailable: booleanTypeAny,
          isGiftCardRedemptionEnabled: booleanTypeAny,
          isGiftCardValueThresholdMet: booleanTypeAny,
          giftCardRedemptionPercentage: numberType,
        },
      }
      expect(removeItemResponse.body).toMatchSchema(shoppingBagSchema)
    })

    it(
      'Shopping Bag DELETE Product should return statusCode 200 if orderItemId is invalid',
      async () => {
        const deleteItemWithInvalidOrderItemId = await removeItemFromShoppingBagResponse(
          productSizeQtyCookies,
          shoppingBag.orderId,
          ''
        )
        expect(deleteItemWithInvalidOrderItemId.statusCode).toEqual(200)
      },
      30000
    )
  })

  describe('Shopping GET Fetch Size and Quantity Json Schema', () => {
    it('Shopping Bag GET Size & Qty Json Schema', () => {
      productSizeQty.items.forEach((item) => {
        const shoppingBagSchema = {
          title: 'Shopping Bag PUT Fetch Size and Quantity Product Json Schema',
          type: 'object',
          required: [
            'catEntryId',
            'quantity',
            'selected',
            'size',
            'unitPrice',
            'wasPrice',
            'wasWasPrice',
          ],
          properties: {
            catEntryId: numberType,
            quantity: numberType,
            selected: { type: 'boolean' },
            size: stringType,
            unitPrice: stringType,
            wasPrice: stringTypePattern(),
            wasWasPrice: stringTypeEmpty,
          },
        }
        expect(item).toMatchSchema(shoppingBagSchema)
      })
    })
  })

  describe('Shopping PUT Update Qty Product Json Schema', () => {
    let productUpdate
    beforeAll(async () => {
      const productUpdateResponse = await updateShoppingBagItemResponse(
        productSizeQtyCookies,
        productSizeQty.items[0].catEntryId,
        productSizeQty.items[0].catEntryId,
        2
      )
      productUpdate = productUpdateResponse.body
    }, 60000)

    it('Shopping Bag PUT Product Json Schema', () => {
      const shoppingBagSchema = {
        title: 'Shopping Bag PUT Product Json Schema',
        type: 'object',
        required: [
          'deliveryOptions',
          'discounts',
          'inventoryPositions',
          'orderId',
          'products',
          'promotions',
          'restrictedDeliveryItem',
          'savedProducts',
          'subTotal',
          'total',
          'totalBeforeDiscount',
          'isDDPOrder',
          'isBasketResponse',
          'isOrderCoveredByGiftCards',
          'deliveryThresholdsJson',
        ],
        optional: [
          'isDDPUser',
          'isDDPProduct',
          'ageVerificationRequired',
          'espots',
          'isClearPayAvailable',
          'isGiftCardRedemptionEnabled',
          'isGiftCardValueThresholdMet',
          'giftCardRedemptionPercentage',
        ],
        properties: {
          ageVerificationRequired: booleanOrString,
          deliveryOptions: arrayType(),
          discounts: arrayType(),
          inventoryPositions: objectType,
          orderId: numberType,
          products: arrayType(1),
          promotions: arrayType(),
          restrictedDeliveryItem: booleanType(false),
          savedProducts: arrayType(),
          subTotal: stringType,
          total: stringType,
          totalBeforeDiscount: stringType,
          isDDPProduct: booleanType(false),
          isDDPOrder: booleanType(false),
          isBasketResponse: booleanType(true),
          espots: objectType,
          isOrderCoveredByGiftCards: booleanType(false),
          deliveryThresholdsJson: stringType,
          isClearPayAvailable: booleanTypeAny,
          isGiftCardRedemptionEnabled: booleanTypeAny,
          isGiftCardValueThresholdMet: booleanTypeAny,
          giftCardRedemptionPercentage: numberType,
        },
      }
      expect(shoppingBag).toMatchSchema(shoppingBagSchema)
    })

    it('Shopping Bag PUT Product deliveryOptions Json Schema', () => {
      const body = productUpdate.deliveryOptions
      body.forEach((deliveryOptions) => {
        const shoppingBagDeliveryOptionsSchema = {
          title: 'Shopping Bag PUT Product deliveryOptions Json Schema',
          type: 'object',
          required: [
            'deliveryOptionId',
            'label',
            'type',
            'deliveryOptionExternalId',
            'selected',
            'enabled',
            'plainLabel',
            'shippingCost',
          ],
          properties: {
            deliveryOptionId: numberType,
            label: stringType,
            deliveryOptionExternalId: stringType,
            type: stringType,
            selected: {
              type: 'boolean',
              enum: deliveryOptions.label.includes('UK Standard ')
                ? [true]
                : [false],
            },
            enabled: {
              type: 'boolean',
              enum: deliveryOptions.label.includes('Collect From Store Today')
                ? [false]
                : [true],
            },
            plainLabel: stringType,
            shippingCost: numberType,
          },
        }
        expect(deliveryOptions).toMatchSchema(shoppingBagDeliveryOptionsSchema)
      })
    })

    it('Shopping Bag PUT Product products Json Schema', () => {
      const body = productUpdate.products
      body.forEach((product) => {
        const shoppingBagProductsSchema = {
          title: 'Shopping Bag GET Product products Json Schema',
          type: 'object',
          required: [
            'assets',
            'attributes',
            'bundleProducts',
            'bundleSlots',
            'catEntryId',
            'colourSwatches',
            'discountText',
            'inStock',
            'isBundleOrOutfit',
            'items',
            'lineNumber',
            'lowStock',
            'name',
            'orderItemId',
            'productId',
            'quantity',
            'shipModeId',
            'size',
            'totalPrice',
            'tpmLinks',
            'unitPrice',
            'restrictedDeliveryItem',
            'baseImageUrl',
            'iscmCategory',
            'freeItem',
            'sourceUrl',
          ],
          optional: [
            'isDDPOrder',
            'isDDPProduct',
            'wasPrice',
            'ageVerificationRequired',
          ],
          properties: {
            ageVerificationRequired: booleanOrString,
            assets: arrayType(4),
            attributes: objectType,
            bundleProducts: arrayType(),
            bundleSlots: arrayType(),
            catEntryId: numberType,
            colourSwatches: arrayType(),
            discountText: stringTypeCanBeEmpty,
            inStock: booleanType(true),
            isBundleOrOutfit: booleanType(false),
            isDDPProduct: booleanTypeAny,
            isDDPOrder: booleanTypeAny,
            items: arrayType(),
            lineNumber: stringType,
            lowStock: booleanTypeAny,
            name: stringType,
            orderItemId: numberType,
            productId: numberType,
            quantity: numberTypePattern(1, 2),
            shipModeId: numberType,
            size: stringType,
            totalPrice: numberType,
            tpmLinks: arrayType(),
            unitPrice: stringType,
            wasPrice: stringType,
            restrictedDeliveryItem: booleanTypeAny,
            baseImageUrl: stringType,
            iscmCategory: stringType,
            freeItem: booleanType(false),
            sourceUrl: stringType,
          },
        }
        expect(product).toMatchSchema(shoppingBagProductsSchema)
      })
    })

    it('Shopping Bag PUT Product products assets Json Schema', () => {
      const body = productUpdate.products
      body.forEach((prod) => {
        prod.assets.forEach((asset) => {
          const shoppingBagProductsSchema = {
            title: 'Shopping Bag PUT Product products assets Json Schema',
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
    })

    it('Shopping Bag Simple Product inventoryPositions Json Schema', () => {
      const obj = productUpdate.inventoryPositions
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
            title: 'Shopping Bag Simple Product inventoryPositions Json Schema',
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
            title: 'Shopping Bag Simple Product inventoryPositions Json Schema',
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
    })

    it('Shopping Bag Simple Product inventoryPositions => inventories && invavls Json Schema', () => {
      const obj = productUpdate.inventoryPositions
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
                'Shopping Bag Simple Product inventoryPositions => inventories && invavls Json Schema',
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
      })
    })

    it('Shopping Bag Simple Product inventoryPositions => inventories && invavls => ExpressDates Properties Values', () => {
      const obj = productUpdate.inventoryPositions
      Object.keys(obj).forEach((props) => {
        if (obj[props].invavls) {
          obj[props].invavls.forEach((prop) => {
            const expressdateSchema = {
              title: 'Express date in inventory item',
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
              title: 'Express date in inventory item',
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
    })
  })

  describe('Shopping PUT Update Size Product Json Schema', () => {
    let productUpdate
    beforeAll(async () => {
      const productUpdateResponse = await updateShoppingBagItemResponse(
        productSizeQtyCookies,
        productSizeQty.items[1].catEntryId,
        productSizeQty.items[0].catEntryId,
        1
      )
      productUpdate = productUpdateResponse.body
    }, 60000)

    it('Shopping Bag PUT Product Json Schema', () => {
      const shoppingBagSchema = {
        title: 'Shopping Bag PUT Product Json Schema',
        type: 'object',
        required: [
          'deliveryOptions',
          'discounts',
          'inventoryPositions',
          'orderId',
          'products',
          'promotions',
          'restrictedDeliveryItem',
          'savedProducts',
          'subTotal',
          'total',
          'totalBeforeDiscount',
          'isDDPOrder',
          'isBasketResponse',
          'isOrderCoveredByGiftCards',
          'deliveryThresholdsJson',
        ],
        optional: [
          'isDDPUser',
          'isDDPProduct',
          'ageVerificationRequired',
          'espots',
          'isClearPayAvailable',
          'isGiftCardRedemptionEnabled',
          'isGiftCardValueThresholdMet',
          'giftCardRedemptionPercentage',
        ],
        properties: {
          ageVerificationRequired: booleanOrString,
          deliveryOptions: arrayType(),
          discounts: arrayType(),
          inventoryPositions: objectType,
          orderId: numberType,
          products: arrayType(1),
          promotions: arrayType(),
          restrictedDeliveryItem: booleanType(false),
          savedProducts: arrayType(),
          subTotal: stringType,
          total: stringType,
          totalBeforeDiscount: stringType,
          isDDPProduct: booleanTypeAny,
          isDDPOrder: booleanType(false),
          isDDPUser: booleanType(false),
          isBasketResponse: booleanType(true),
          espots: objectType,
          isOrderCoveredByGiftCards: booleanType(false),
          deliveryThresholdsJson: stringType,
          isClearPayAvailable: booleanTypeAny,
          isGiftCardRedemptionEnabled: booleanTypeAny,
          isGiftCardValueThresholdMet: booleanTypeAny,
          giftCardRedemptionPercentage: numberType,
        },
      }
      expect(shoppingBag).toMatchSchema(shoppingBagSchema)
    })

    it('Shopping Bag PUT Product deliveryOptions Json Schema', () => {
      const body = productUpdate.deliveryOptions
      body.forEach((deliveryOptions) => {
        const shoppingBagDeliveryOptionsSchema = {
          title: 'Shopping Bag PUT Product deliveryOptions Json Schema',
          type: 'object',
          required: [
            'deliveryOptionId',
            'label',
            'deliveryOptionExternalId',
            'type',
            'selected',
            'enabled',
            'shippingCost',
          ],
          properties: {
            deliveryOptionId: numberType,
            label: stringType,
            deliveryOptionExternalId: stringType,
            type: stringType,
            selected: {
              type: 'boolean',
              enum: deliveryOptions.label.includes('UK Standard ')
                ? [true]
                : [false],
            },
            enabled: {
              type: 'boolean',
              enum: deliveryOptions.label.includes('Collect From Store Today')
                ? [false]
                : [true],
            },
            plainLabel: stringType,
            shippingCost: numberType,
          },
        }
        expect(deliveryOptions).toMatchSchema(shoppingBagDeliveryOptionsSchema)
      })
    })

    it('Shopping Bag PUT Product products Json Schema', () => {
      const body = productUpdate.products
      body.forEach((product) => {
        const shoppingBagProductsSchema = {
          title: 'Shopping Bag GET Product products Json Schema',
          type: 'object',
          required: [
            'assets',
            'attributes',
            'bundleProducts',
            'bundleSlots',
            'catEntryId',
            'colourSwatches',
            'discountText',
            'inStock',
            'isBundleOrOutfit',
            'items',
            'lineNumber',
            'lowStock',
            'name',
            'orderItemId',
            'productId',
            'quantity',
            'shipModeId',
            'size',
            'totalPrice',
            'tpmLinks',
            'unitPrice',
            'restrictedDeliveryItem',
            'baseImageUrl',
            'iscmCategory',
            'freeItem',
            'sourceUrl',
          ],
          optional: [
            'isDDPOrder',
            'isDDPProduct',
            'wasPrice',
            'ageVerificationRequired',
          ],
          properties: {
            ageVerificationRequired: booleanOrString,
            assets: arrayType(4),
            attributes: objectType,
            bundleProducts: arrayType(),
            bundleSlots: arrayType(),
            catEntryId: numberType,
            colourSwatches: arrayType(),
            discountText: stringTypeCanBeEmpty,
            inStock: booleanType(true),
            isBundleOrOutfit: booleanType(false),
            isDDPProduct: booleanTypeAny,
            isDDPOrder: booleanTypeAny,
            items: arrayType(),
            lineNumber: stringType,
            lowStock: booleanTypeAny,
            name: stringType,
            orderItemId: numberType,
            productId: numberType,
            quantity: numberTypePattern(1),
            shipModeId: numberType,
            size: stringType,
            totalPrice: numberType,
            tpmLinks: arrayType(),
            unitPrice: stringType,
            wasPrice: stringType,
            restrictedDeliveryItem: booleanTypeAny,
            baseImageUrl: stringType,
            iscmCategory: stringType,
            freeItem: booleanType(false),
            sourceUrl: stringType,
          },
        }
        expect(product).toMatchSchema(shoppingBagProductsSchema)
      })
    })

    it('Shopping Bag PUT Product products assets Json Schema', () => {
      const body = productUpdate.products
      body.forEach((prod) => {
        prod.assets.forEach((asset) => {
          const shoppingBagProductsSchema = {
            title: 'Shopping Bag PUT Product products assets Json Schema',
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
    })

    it('Shopping Bag Simple Product inventoryPositions Json Schema', () => {
      const obj = productUpdate.inventoryPositions
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
            title: 'Shopping Bag Simple Product inventoryPositions Json Schema',
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
            title: 'Shopping Bag Simple Product inventoryPositions Json Schema',
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
    })

    it('Shopping Bag Simple Product inventoryPositions => inventories && invavls Json Schema', () => {
      const obj = productUpdate.inventoryPositions
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
                'Shopping Bag Simple Product inventoryPositions => inventories && invavls Json Schema',
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
      })
    })

    it('Shopping Bag Simple Product inventoryPositions => inventories && invavls => ExpressDates Properties Values', () => {
      const obj = productUpdate.inventoryPositions
      Object.keys(obj).forEach((props) => {
        if (obj[props].invavls) {
          obj[props].invavls.forEach((prop) => {
            const expressdateSchema = {
              title: 'Express date in inventory item',
              type: 'array',
              required: ['0', '1'],
              properties: {
                0: stringType,
                1: stringType,
              },
            }
            assert.jsonSchema(prop.expressdates, expressdateSchema)
          })
        } else if (obj[props].inventorys) {
          obj[props].inventorys.forEach((prop) => {
            const expressdateSchema = {
              title: 'Express date in inventory item',
              type: 'array',
              required: ['0', '1'],
              properties: {
                0: stringType,
                1: stringType,
              },
            }
            assert.jsonSchema(prop.expressdates, expressdateSchema)
          })
        }
      })
    })
  })

  describe('Shopping Bag POST Update Delivery', () => {
    let selectDeliveryOptions

    /*  Due to the covid related changes to the delivery options this test is skipped in ADP-3115
    PLEASE unskip once the WCS changes are reverted.
    The ticket to unskip this test is a placeholder ticket in the backlog: ADP-3116
  */
    it.skip(
      'Shopping Bag Update Delivery to Collect From ParcelShop',
      async () => {
        selectDeliveryOptions = await updateShoppingBagDelivery(
          newAccount.jsessionid,
          deliveryOptions.collectFromParcelShop
        )
        selectDeliveryOptions.deliveryOptions.forEach((deliveryOptions) => {
          if (deliveryOptions.selected) {
            const shoppingBagChangeDeliveryOptionsSchema = {
              title:
                'Shopping Bag Update deliveryOptions to Collect From ParcelShop',
              type: 'object',
              required: [
                'deliveryOptionId',
                'label',
                'selected',
                'deliveryOptionExternalId',
                'type',
                'enabled',
                'plainLabel',
                'shippingCost',
              ],
              properties: {
                selected: booleanType(true),
                deliveryOptionId: numberType,
                deliveryOptionExternalId: stringTypePattern(
                  'retail_store_collection'
                ),
                label: stringTypePattern('Collect from ParcelShop'),
                enabled: booleanType(true),
                type: stringTypePattern('parcelshop'),
                plainLabel: stringTypePattern('Collect from ParcelShop'),
                shippingCost: numberType,
              },
            }
            expect(deliveryOptions).toMatchSchema(
              shoppingBagChangeDeliveryOptionsSchema
            )
          }
        })
      },
      60000
    )

    it.skip(
      'Shopping Bag Update Delivery to Free Collect From Store Standard',
      async () => {
        selectDeliveryOptions = await updateShoppingBagDelivery(
          newAccount.jsessionid,
          deliveryOptions.freeCollectFromStoreStandard
        )
        selectDeliveryOptions.deliveryOptions.forEach((deliveryOptions) => {
          if (deliveryOptions.selected) {
            const shoppingBagChangeDeliveryOptionsSchema = {
              title:
                'Shopping Bag Update deliveryOptions to Free Collect From Store Standard £0.00',
              type: 'object',
              required: [
                'deliveryOptionId',
                'label',
                'selected',
                'deliveryOptionExternalId',
                'type',
                'enabled',
                'plainLabel',
                'shippingCost',
              ],
              properties: {
                selected: booleanType(true),
                deliveryOptionId: numberType,
                deliveryOptionExternalId: stringTypePattern(
                  'retail_store_standard'
                ),
                label: stringTypePattern('Collect From Store St'),
                type: stringTypePattern('store_standard'),
                enabled: booleanType(true),
                plainLabel: stringTypePattern('Collect From Store St'),
                shippingCost: numberType,
              },
            }
            expect(deliveryOptions).toMatchSchema(
              shoppingBagChangeDeliveryOptionsSchema
            )
          }
        })
      },
      60000
    )

    /*  Due to the covid related changes to the delivery options this test is skipped in ADP-3115
    PLEASE unskip once the WCS changes are reverted.
    The ticket to unskip this test is a placeholder ticket in the backlog: ADP-3116
  */

    it.skip(
      'Shopping Bag Update Delivery to Express / Nominated Day Delivery',
      async () => {
        selectDeliveryOptions = await updateShoppingBagDelivery(
          newAccount.jsessionid,
          deliveryOptions.expressNominatedDayDelivery
        )
        selectDeliveryOptions.deliveryOptions.forEach((deliveryOptions) => {
          if (deliveryOptions.selected) {
            const shoppingBagChangeDeliveryOptionsSchema = {
              title:
                'Shopping Bag Update deliveryOptions to Express / Nominated Day Delivery £6.00',
              type: 'object',
              required: [
                'deliveryOptionId',
                'label',
                'selected',
                'deliveryOptionExternalId',
                'type',
                'enabled',
                'plainLabel',
                'shippingCost',
              ],
              properties: {
                selected: booleanType(true),
                deliveryOptionId: numberType,
                deliveryOptionExternalId: stringTypePattern('n3'),
                label: stringTypePattern('Free Next or Named Day Delivery'),
                enabled: booleanType(true),
                type: stringTypePattern('home_express'),
                plainLabel: stringTypePattern(
                  'Free Next or Named Day Delivery'
                ),
                shippingCost: numberType,
              },
            }
            expect(deliveryOptions).toMatchSchema(
              shoppingBagChangeDeliveryOptionsSchema
            )
          }
        })
      },
      60000
    )

    it(
      'Shopping Bag Update Delivery to Standard Delivery',
      async () => {
        const selectDeliveryOptions = await updateShoppingBagDeliveryResponse(
          productSizeQtyCookies,
          deliveryOptions.standardDelivery
        )
        selectDeliveryOptions.body.deliveryOptions.forEach(
          (deliveryOptions) => {
            if (deliveryOptions.selected) {
              const shoppingBagChangeDeliveryOptionsSchema = {
                title:
                  'Shopping Bag Update deliveryOptions to Standard Delivery £4.00',
                type: 'object',
                required: [
                  'deliveryOptionId',
                  'label',
                  'selected',
                  'type',
                  'deliveryOptionExternalId',
                  'enabled',
                  'plainLabel',
                  'shippingCost',
                ],
                properties: {
                  selected: booleanType(true),
                  deliveryOptionId: numberType,
                  deliveryOptionExternalId: stringTypePattern('s'),
                  label: stringTypePattern('UK Standard up to'),
                  enabled: booleanType(true),
                  type: stringTypePattern('home_standard'),
                  plainLabel: stringTypePattern('UK Standard up to'),
                  shippingCost: numberType,
                },
              }
              expect(deliveryOptions).toMatchSchema(
                shoppingBagChangeDeliveryOptionsSchema
              )
            }
          }
        )
      },
      60000
    )

    it.skip(
      'Shopping Bag Update Delivery to Collect From Store Express',
      async () => {
        selectDeliveryOptions = await updateShoppingBagDelivery(
          newAccount.jsessionid,
          deliveryOptions.collectFromStoreExpress
        )
        selectDeliveryOptions.deliveryOptions.forEach((deliveryOptions) => {
          if (deliveryOptions.selected) {
            const shoppingBagChangeDeliveryOptionsSchema = {
              title:
                'Shopping Bag Update deliveryOptions to Collect From Store Express £3.00',
              type: 'object',
              required: [
                'deliveryOptionExternalId',
                'deliveryOptionId',
                'enabled',
                'label',
                'type',
                'selected',
                'plainLabel',
                'shippingCost',
              ],
              properties: {
                selected: booleanType(true),
                deliveryOptionId: numberType,
                deliveryOptionExternalId: stringTypePattern(
                  'retail_store_express'
                ),
                label: stringTypePattern('Collect From Store Express'),
                enabled: booleanType(true),
                type: stringTypePattern('store_express'),
                plainLabel: stringTypePattern('Collect From Store Express'),
                shippingCost: numberType,
              },
            }
            expect(deliveryOptions).toMatchSchema(
              shoppingBagChangeDeliveryOptionsSchema
            )
          }
        })
      },
      60000
    )

    // it('Shopping Bag Update => All delivery options are enabled', () => {
    //   selectDeliveryOptions.deliveryOptions.forEach((deliveryOptions) => {
    //     expect(deliveryOptions.enabled).toBe(true)
    //   })
    // })
  })

  describe('Shopping Bag POST Add Promotion Code', () => {
    it(
      'Shopping Bag Add Promotion Code Schema',
      async () => {
        const addPromotionCodeResponse = await promotionCodeResponse(
          productSizeQtyCookies
        )
        const shoppingBagSchema = {
          title: 'Shopping Bag with Promotion Schema',
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
            'restrictedDeliveryItem',
            'inventoryPositions',
            'isBasketResponse',
            'isOrderCoveredByGiftCards',
            'deliveryThresholdsJson',
          ],
          optional: [
            'isDDPOrder',
            'isDDPProduct',
            'ageVerificationRequired',
            'espots',
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
            promotions: {
              type: 'array',
              minItems: 1,
              maxItems: 1,
              items: { type: 'object' },
            },
            discounts: arrayType(),
            products: arrayType(1),
            savedProducts: arrayType(),
            ageVerificationRequired: booleanOrString,
            restrictedDeliveryItem: booleanType(false),
            inventoryPositions: objectType,
            isDDPProduct: booleanTypeAny,
            isDDPOrder: booleanTypeAny,
            isBasketResponse: booleanType(true),
            espots: objectType,
            isOrderCoveredByGiftCards: booleanType(false),
            deliveryThresholdsJson: stringType,
            isClearPayAvailable: booleanTypeAny,
            isGiftCardRedemptionEnabled: booleanTypeAny,
            isGiftCardValueThresholdMet: booleanTypeAny,
            giftCardRedemptionPercentage: numberType,
          },
        } // ADP-3044
        expect(addPromotionCodeResponse.body).toMatchSchema(shoppingBagSchema)
      },
      30000
    )

    it('Shopping Bag Promotion Code => Promotions schema', async () => {
      const addPromotionCodeResponse = await promotionCodeResponse(
        productSizeQtyCookies
      )
      const addPromotionCode = addPromotionCodeResponse.body
      const body = addPromotionCode.promotions[0]
      const shoppingBagSchema = {
        title: 'Shopping Bag => Promotions Schema',
        type: 'object',
        required: ['promotionCode', 'label'],
        properties: {
          promotionCode: stringTypePattern(PROMOTION_CODE),
          label: stringType,
        },
      }
      expect(body).toMatchSchema(shoppingBagSchema)
    })

    it(
      'Shopping Bag Promotion Code Error Schema => Code Already Applied',
      async () => {
        const codeAppliedResponse = await promotionCodeResponse(
          productSizeQtyCookies
        )
        const codeAppliedCookies = mergeCookies(codeAppliedResponse)
        let validPromotionCode
        try {
          validPromotionCode = await promotionCodeResponse(codeAppliedCookies)
        } catch (e) {
          validPromotionCode = e.response.body
        }
        expect(validPromotionCode).toMatchSchema(CODE_ALREADY_APPLIED)
      },
      30000
    )

    it(
      'Shopping Bag Promotion Code Error Schema => Code Does Not Exist',
      async () => {
        let addInvalidPromotionCode
        try {
          addInvalidPromotionCode = await promotionCodeResponse(
            productSizeQtyCookies,
            'orderSummary',
            'NO_CODE'
          )
        } catch (e) {
          addInvalidPromotionCode = e.response.body
        }
        expect(addInvalidPromotionCode).toMatchSchema(CODE_INVALID)
      },
      30000
    )
  })

  describe('Shopping Bag DELETE Promotion Code', () => {
    let removePromotionCode
    beforeAll(async () => {
      const removePromotionCodeResponse = await deletePromotionCodeResponse(
        productSizeQtyCookies
      )
      removePromotionCode = removePromotionCodeResponse.body
    }, 60000)

    it('Shopping Bag Delete Promotion Code Schema', () => {
      const shoppingBagSchema = {
        title: 'Shopping Bag with Promotion Schema',
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
          'restrictedDeliveryItem',
          'inventoryPositions',
          'isOrderCoveredByGiftCards',
          'deliveryThresholdsJson',
        ],
        optional: [
          'isDDPOrder',
          'isDDPProduct',
          'ageVerificationRequired',
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
          promotions: {
            type: 'array',
            minItems: 0,
            maxItems: 0,
            items: { type: 'object' },
          },
          discounts: arrayType(),
          products: arrayType(1),
          savedProducts: arrayType(),
          ageVerificationRequired: booleanOrString,
          restrictedDeliveryItem: booleanType(false),
          inventoryPositions: objectType,
          isDDPProduct: booleanTypeAny,
          isDDPOrder: booleanTypeAny,
          isOrderCoveredByGiftCards: booleanType(false),
          deliveryThresholdsJson: stringType,
          isClearPayAvailable: booleanTypeAny,
          isGiftCardRedemptionEnabled: booleanTypeAny,
          isGiftCardValueThresholdMet: booleanTypeAny,
          giftCardRedemptionPercentage: numberType,
        },
      }
      expect(removePromotionCode).toMatchSchema(shoppingBagSchema)
    })
  })

  describe('Shopping Bag POST Promotion Code Already Redeemed', () => {
    it(
      'Shopping Bag Promotion Code Error Schema => Code One Use Per Customer',
      async () => {
        const { mergeCookies: mergeCookiesRedeemed } = processClientCookies()
        const newAccountResponse = await createAccountResponse()
        const newAccountCookies = mergeCookiesRedeemed(newAccountResponse)
        const shoppingBagResponseOne = await addItemToShoppingBagResponse(
          newAccountCookies,
          products.productsSimpleId
        )
        const shoppingBagCookiesOne = mergeCookiesRedeemed(
          shoppingBagResponseOne
        )
        const shoppingBag = shoppingBagResponseOne.body
        const limitedUsePromoCodeResponse = await promotionCodeResponse(
          shoppingBagCookiesOne,
          'orderSummary',
          'M39INS72M9'
        )
        const limitedUseCookies = mergeCookiesRedeemed(
          limitedUsePromoCodeResponse
        )
        const paidOrderResponse = await payOrder(
          limitedUseCookies,
          shoppingBag.orderId,
          'VISA'
        )
        const paidOrderCookies = mergeCookiesRedeemed(paidOrderResponse)
        const shoppingBagResponseTwo = await addItemToShoppingBagResponse(
          paidOrderCookies,
          products.productsSimpleId
        )
        const shoppingBagCookiesTwo = mergeCookiesRedeemed(
          shoppingBagResponseTwo
        )
        let limitedUsePromoCode
        try {
          limitedUsePromoCode = await promotionCode(
            shoppingBagCookiesTwo,
            'orderSummary',
            'M39INS72M9'
          )
        } catch (e) {
          limitedUsePromoCode = e.response.body
        }
        expect(limitedUsePromoCode).toMatchSchema(CODE_ALREADY_REDEEMED)
      },
      30000
    )
  })

  describe('Shopping Bag POST add single item, "AddItem2" with default parameters', () => {
    let newAccount
    let shoppingBag
    const extraparams = false

    beforeAll(async () => {
      newAccount = await createAccountResponse()
      shoppingBag = await addItemToShoppingBag2(
        newAccount.jsessionid,
        products.productsWasPriceId,
        extraparams
      )
    }, 60000)

    describe('Shopping Bag POST item to shopping bag, "addItem2"', () => {
      it('Shopping Bag Add Item Json Schema', () => {
        const shoppingBagSchema = {
          title: 'Shopping Bag GET Product Json Schema',
          type: 'object',
          required: [
            'deliveryOptions',
            'discounts',
            'inventoryPositions',
            'orderId',
            'products',
            'promotions',
            'restrictedDeliveryItem',
            'savedProducts',
            'subTotal',
            'total',
            'totalBeforeDiscount',
            'isDDPOrder',
            'isBasketResponse',
            'isOrderCoveredByGiftCards',
            'deliveryThresholdsJson',
          ],
          optional: [
            'isDDPUser',
            'isDDPProduct',
            'ageVerificationRequired',
            'espots',
            'isClearPayAvailable',
            'isGiftCardRedemptionEnabled',
            'isGiftCardValueThresholdMet',
            'giftCardRedemptionPercentage',
          ],
          properties: {
            ageVerificationRequired: booleanOrString,
            deliveryOptions: arrayType(),
            discounts: arrayType(),
            inventoryPositions: objectType,
            orderId: numberType,
            products: arrayType(1),
            promotions: arrayType(),
            restrictedDeliveryItem: booleanType(false),
            savedProducts: arrayType(),
            subTotal: stringType,
            total: stringType,
            totalBeforeDiscount: stringType,
            isDDPUser: booleanType(false),
            isDDPProduct: booleanType(false),
            isDDPOrder: booleanType(false),
            isBasketResponse: booleanType(true),
            espots: objectType,
            isOrderCoveredByGiftCards: booleanType(false),
            deliveryThresholdsJson: stringType,
            isClearPayAvailable: booleanTypeAny,
            isGiftCardRedemptionEnabled: booleanTypeAny,
            isGiftCardValueThresholdMet: booleanTypeAny,
            giftCardRedemptionPercentage: numberType,
          },
        }
        expect(shoppingBag).toMatchSchema(shoppingBagSchema)
      })
    })
  })

  describe('Shopping Bag POST add single item, "AddItem2" with additional parameters', () => {
    let shoppingBag
    const extraparams = true

    beforeAll(async () => {
      const { mergeCookies: mergeCookiesSingle } = processClientCookies()
      const newAccountResponse = await createAccountResponse()
      const newAccountCookies = mergeCookiesSingle(newAccountResponse)
      const shoppingBagResponse = await addItemToShoppingBagResponse(
        newAccountCookies,
        products.productsWasPriceId,
        extraparams
      )
      shoppingBag = shoppingBagResponse.body
    }, 60000)

    describe('POST single item to shopping bag, "addItem2"', () => {
      it('Shopping Bag Add Item Json Schema', () => {
        const ShoppingBagSchema = {
          title: 'Shopping Bag Product Json Schema',
          type: 'object',
          endpoint: 'ADDITEM2',
          required: [
            'deliveryOptions',
            'discounts',
            'inventoryPositions',
            'orderId',
            'products',
            'promotions',
            'restrictedDeliveryItem',
            'savedProducts',
            'subTotal',
            'total',
            'totalBeforeDiscount',
            'isDDPOrder',
            'isBasketResponse',
            'isOrderCoveredByGiftCards',
            'deliveryThresholdsJson',
          ],
          optional: [
            'isDDPUser',
            'isDDPProduct',
            'ageVerificationRequired',
            'espots',
            'isClearPayAvailable',
            'isGiftCardRedemptionEnabled',
            'isGiftCardValueThresholdMet',
            'giftCardRedemptionPercentage',
          ],
          properties: {
            ageVerificationRequired: booleanOrString,
            deliveryOptions: arrayType(),
            discounts: arrayType(),
            inventoryPositions: objectType,
            orderId: numberType,
            products: arrayType(1),
            promotions: arrayType(),
            restrictedDeliveryItem: booleanType(false),
            savedProducts: arrayType(),
            subTotal: stringType,
            total: stringType,
            totalBeforeDiscount: stringType,
            isDDPUser: booleanType(false),
            isDDPProduct: booleanType(false),
            isDDPOrder: booleanType(false),
            isBasketResponse: booleanType(true),
            espots: objectType,
            isOrderCoveredByGiftCards: booleanType(false),
            deliveryThresholdsJson: stringType,
            isClearPayAvailable: booleanTypeAny,
            isGiftCardRedemptionEnabled: booleanTypeAny,
            isGiftCardValueThresholdMet: booleanTypeAny,
            giftCardRedemptionPercentage: numberType,
          },
        }
        expect(shoppingBag).toMatchSchema(ShoppingBagSchema)
      })
    })
  })

  describe('Shopping Bag POST add bundle item, "AddItem2" with additional parameters', () => {
    describe('POST bundle item to shopping bag, "addItem2"', () => {
      it('Shopping Bag Add Item Json Schema', async () => {
        const extraparams = true
        const { mergeCookies: mergeCookiesBundle } = processClientCookies()
        const newAccountResponse = await createAccountResponse()
        const newAccountCookies = mergeCookiesBundle(newAccountResponse)
        const shoppingBagResponse = await addItemToShoppingBagResponse(
          newAccountCookies,
          products.productsFlexibleId,
          extraparams
        )
        const shoppingBag = shoppingBagResponse.body
        const ShoppingBagSchema = {
          title: 'Shopping Bag Product Json Schema',
          type: 'object',
          endpoint: 'ADDITEM2',
          required: [
            'deliveryOptions',
            'discounts',
            'inventoryPositions',
            'orderId',
            'products',
            'promotions',
            'restrictedDeliveryItem',
            'savedProducts',
            'subTotal',
            'total',
            'totalBeforeDiscount',
            'isDDPOrder',
            'isBasketResponse',
            'isOrderCoveredByGiftCards',
            'deliveryThresholdsJson',
          ],
          optional: [
            'isDDPUser',
            'isDDPProduct',
            'ageVerificationRequired',
            'espots',
            'isClearPayAvailable',
            'isGiftCardRedemptionEnabled',
            'isGiftCardValueThresholdMet',
            'giftCardRedemptionPercentage',
          ],
          properties: {
            ageVerificationRequired: booleanOrString,
            deliveryOptions: arrayType(),
            discounts: arrayType(),
            inventoryPositions: objectType,
            orderId: numberType,
            products: arrayType(1),
            promotions: arrayType(),
            restrictedDeliveryItem: booleanType(false),
            savedProducts: arrayType(),
            subTotal: stringType,
            total: stringType,
            totalBeforeDiscount: stringType,
            isDDPUser: booleanType(false),
            isDDPProduct: booleanType(false),
            isDDPOrder: booleanType(false),
            isBasketResponse: booleanType(true),
            espots: objectType,
            isOrderCoveredByGiftCards: booleanType(false),
            deliveryThresholdsJson: stringType,
            isClearPayAvailable: booleanTypeAny,
            isGiftCardRedemptionEnabled: booleanTypeAny,
            isGiftCardValueThresholdMet: booleanTypeAny,
            giftCardRedemptionPercentage: numberType,
          },
        }
        expect(shoppingBag).toMatchSchema(ShoppingBagSchema)
      })
    })
  })

  describe('Shopping Bag Transfer POST Request', () => {
    it(
      'Shopping Bag Transfer Response',
      async () => {
        const { mergeCookies: mergeCookiesTransfer } = processClientCookies()
        const newAccountResponse = await createAccountResponse()
        const accountCookies = mergeCookiesTransfer(newAccountResponse)
        const transferBagResponse = await transferShoppingBagResponse(
          accountCookies
        )
        const shoppingBagTransferSchema = {
          title: 'Shopping Bag Transfer',
          type: 'object',
          required: ['success', 'message', 'espot'],
          optional: ['items', 'total', 'orderId', 'productDetails'],
          properties: {
            success: booleanType,
            message: stringType,
            items: numberType,
            total: numberType,
            orderId: numberType,
            productDetails: arrayType,
            espot: stringTypeCanBeEmpty,
          },
        }
        expect(transferBagResponse.body).toMatchSchema(
          shoppingBagTransferSchema
        )
      },
      60000
    )
  })
})
