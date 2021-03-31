require('@babel/register')

import chai from 'chai'

chai.use(require('chai-json-schema'))

import {
  stringType,
  numberType,
  booleanType,
  objectType,
  arrayType,
  stringTypeEmpty,
  booleanTypeAny,
  stringTypeCanBeEmpty,
  stringTypeNumber,
  numberTypePattern,
} from '../utilis'
import { addItemToShoppingBag } from '../utilis/shoppingBag'
import { createAccount } from '../utilis/userAccount'
import { getProducts } from '../utilis/selectProducts'

describe('AssItem for appa should return the Shopping Bag Json Schema', () => {
  let products
  let newAccount
  let shoppingBag

  beforeAll(async () => {
    products = await getProducts()
    newAccount = await createAccount()

    await addItemToShoppingBag(newAccount.jsessionid, products.productsSimpleId)

    shoppingBag = await addItemToShoppingBag(
      newAccount.jsessionid,
      products.productsWasPriceId
    )
  }, 60000)

  describe('POST Shopping Bag', () => {
    it('Shopping Bag: Product Json Schema', () => {
      const shoppingBagSchema = {
        title: 'Shopping Bag Product Json Schema',
        type: 'object',
        required: [
          'ageVerificationRequired',
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
          'espots',
          'isClearPayAvailable',
          'isGiftCardRedemptionEnabled',
          'isGiftCardValueThresholdMet',
          'giftCardRedemptionPercentage',
        ],
        properties: {
          ageVerificationRequired: booleanType(false),
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

    it('Shopping Bag: Product deliveryOptions Json Schema', () => {
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

    it('Shopping Bag: Product products Json Schema', () => {
      shoppingBag.products.forEach((product) => {
        if (product.productId === products.productsSimpleId.productId) {
          const shoppingBagSimpleProductsSchema = {
            title: 'Shopping Bag GET Product products Json Schema',
            type: 'object',
            required: [
              'ageVerificationRequired',
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
            properties: {
              ageVerificationRequired: booleanType(false),
              assets: arrayType(4),
              attributes: objectType,
              bundleProducts: arrayType(),
              bundleSlots: arrayType(),
              catEntryId: numberType,
              colourSwatches: arrayType(),
              discountText: stringTypeEmpty,
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
              'ageVerificationRequired',
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
            properties: {
              ageVerificationRequired: booleanType(false),
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
            },
          }
          expect(product).toMatchSchema(shoppingBagProductsWasPriceSchema)
        }
      })
    })

    it('Shopping Bag: Product products assets Json Schema', () => {
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

    it('Shopping Bag: Simple Product inventoryPositions Json Schema', () => {
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

    it('Shopping Bag: Simple Product inventoryPositions => inventories && invavls Json Schema', () => {
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

    it('Shopping Bag: Simple Product inventoryPositions => inventories && invavls => ExpressDates Properties Values', () => {
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
})
