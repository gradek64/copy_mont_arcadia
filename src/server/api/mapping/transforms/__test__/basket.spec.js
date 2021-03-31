import transform, * as fragments from '../basket'
import { wcsProductsFragment, hapiProductsFragment } from './fixtures'
import { path } from 'ramda'
import wcsOrderCalculate from '../../../../../../test/apiResponses/shopping-bag/wcs-orderCalculate.json'
import montyGetItems from '../../../../../../test/apiResponses/shopping-bag/hapiMonty-get_items.json'

const wcsDeliveryOption = {
  selected: false,
  deliveryOptionId: 28005,
  deliveryOptionPrice: 6.0,
  deliveryShipCode: 'N4',
  label: 'Express / Nominated Day Delivery ',
}

const montyDeliveryOption = {
  deliveryOptionExternalId: 'n4',
  deliveryOptionId: 28005,
  enabled: false,
  label: 'Express / Nominated Day Delivery £6.00',
  selected: false,
}

describe('basket transform functions', () => {
  describe('ageVerificationRequiredFragment', () => {
    const { ageVerificationRequiredFragment } = fragments
    it('should return true if a string "Y" is passed to it', () => {
      expect(ageVerificationRequiredFragment('Y')).toBe(true)
    })

    it('should return false if a string "N" or any other value is passed to it', () => {
      expect(ageVerificationRequiredFragment('N')).toBe(false)
      expect(ageVerificationRequiredFragment('foo')).toBe(false)
      expect(ageVerificationRequiredFragment()).toBe(false)
    })
  })

  describe('assetsFragment', () => {
    const { assetsFragment } = fragments
    it('should create an array of assets using the imageUrl from WCS', () => {
      expect(
        assetsFragment(
          path(
            ['Basket', 'products', 'Product', 0, 'imageUrl'],
            wcsOrderCalculate
          )
        )
      ).toEqual(path(['products', 0, 'assets'], montyGetItems))
    })

    it('should return an emtpy array if an imgUrl is not supplied, or is not a string', () => {
      expect(assetsFragment()).toEqual([])
      expect(assetsFragment([])).toEqual([])
    })
  })

  describe('deliveryOptionsFragment', () => {
    const { deliveryOptionsFragment } = fragments

    it('should return an empty array if the parameter passed to it is not an object', () => {
      expect(deliveryOptionsFragment('BasketDeliveryOption')).toEqual([])
      expect(deliveryOptionsFragment(['BasketDeliveryOption'])).toEqual([])
    })

    it('should return an empty array if the object passed to it has no "BasketDeliveryOption" property', () => {
      expect(deliveryOptionsFragment({ IncorrectKey: 'value' })).toEqual([])
    })

    it('should return an empty array if, in the object passed to it, the value for "BasketDeliveryOption" is not an array', () => {
      expect(
        deliveryOptionsFragment({ BasketDeliveryOption: 'I am not an array' })
      ).toEqual([])
    })

    it('should format a delivery option object from WCS into a format expected by Monty', () => {
      expect(
        deliveryOptionsFragment(
          path(['Basket', 'deliveryOptions'], wcsOrderCalculate),
          '£'
        )
      ).toEqual(montyGetItems.deliveryOptions)
    })

    describe('mapDeliveryType', () => {
      const { mapDeliveryType } = fragments
      it('should return an empty string if nothing is passed', () => {
        expect(mapDeliveryType()).toBe('')
      })
      it('should return "home_standard" if "s" is passed', () => {
        expect(mapDeliveryType('s')).toBe('home_standard')
      })
      it('should return "home_express" if any variation of "n1-7" is passed', () => {
        const nominatedDeliveryDays = ['n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7']
        nominatedDeliveryDays.forEach((day) => {
          expect(mapDeliveryType(day)).toBe('home_express')
        })
      })
      it('should return an empty string if it cannot match the passed string to a case or pattern', () => {
        const incorrectDeliveryCodes = [
          'nn1',
          'n2!',
          'standard_home',
          'internationalExpress',
          'international',
          'standard!',
          '!@£%',
        ]
        incorrectDeliveryCodes.forEach((code) => {
          expect(mapDeliveryType(code)).toBe('')
        })
      })
      it('should return "home_express" if "e" is passed', () => {
        expect(mapDeliveryType('e')).toBe('home_express')
      })
      it('should return "store_standard" if "retail_store_standard" is passed', () => {
        expect(mapDeliveryType('retail_store_standard')).toBe('store_standard')
      })
      it('should return "store_express" if "retail_store_express" is passed', () => {
        expect(mapDeliveryType('retail_store_express')).toBe('store_express')
      })
      it('should return "store_immediate" if "retail_store_immediate" is passed', () => {
        expect(mapDeliveryType('retail_store_immediate')).toBe(
          'store_immediate'
        )
      })
    })
  })

  describe('deliveryLabelFragment', () => {
    const { deliveryLabelFragment } = fragments
    it('should add a price to the delivery label if it is greater than 0', () => {
      expect(deliveryLabelFragment('this delivery costs ', 30, '£')).toBe(
        'this delivery costs £30.00'
      )
    })

    it('should not add the price to the label if the price is 0', () => {
      expect(deliveryLabelFragment('free delivery ', 0)).toBe(
        'free delivery £0.00'
      )
    })

    describe('deliveries with $ or £ currencies', () => {
      it('should render the symbol in front of the price', () => {
        expect(deliveryLabelFragment('London Delivery', 10, '£')).toBe(
          'London Delivery £10.00'
        )
        expect(deliveryLabelFragment('New York Delivery', 34, '$')).toBe(
          'New York Delivery $34.00'
        )
      })
    })

    describe('deliveries with currencies other than $ or £', () => {
      it('should render the symbol after the price', () => {
        expect(deliveryLabelFragment('Delivery du Paris', 5, '€')).toBe(
          'Delivery du Paris 5,00 €'
        )
      })
    })

    describe('deliveries where the price is given as a string', () => {
      it('should render the price', () => {
        expect(deliveryLabelFragment('Edge case delivery', '5.00', '£')).toBe(
          'Edge case delivery £5.00'
        )
      })
    })
  })

  describe('deliveryOptionFragment', () => {
    const { deliveryOptionFragment } = fragments

    it('should format at deliveryOption object into a format expected by Monty', () => {
      expect(deliveryOptionFragment(wcsDeliveryOption, '£')).toEqual(
        expect.objectContaining(montyDeliveryOption)
      )
    })

    it('should return a default deliveryOption object if values cannot be found', () => {
      expect(deliveryOptionFragment({})).toEqual(
        expect.objectContaining({
          deliveryOptionExternalId: '',
          deliveryOptionId: 0,
          label: '£0.00',
          enabled: false,
          selected: false,
        })
      )
    })
  })

  describe('discountsFragment', () => {
    const { discountsFragment } = fragments

    it('should return an empty array if discounts or giftcard params are not valid', () => {
      expect(discountsFragment(null, null)).toEqual([])
      expect(discountsFragment(['Discount'], undefined)).toEqual([])
      expect(discountsFragment('string', {})).toEqual([])
    })

    it('should return an empty array if the object passed to it has no "Discount" key', () => {
      expect(discountsFragment({ IncorrectKey: 'value' })).toEqual([])
    })

    it('should return an empty array if, in the object passed to it, the value for "Discount" is not an array', () => {
      expect(discountsFragment({ Discounts: 'not an array' })).toEqual([])
    })

    it('should convert a Discount object from WCS into a format expected by Monty', () => {
      expect(
        discountsFragment(path(['Basket', 'discounts'], wcsOrderCalculate))
      ).toEqual(montyGetItems.discounts)
    })

    it('should include added giftCards to the WCS discount array expected by Monty', () => {
      const discounts = wcsOrderCalculate.Basket.discounts
      const giftcards = [
        {
          amountUsed: 0,
          pin: '1216',
          giftCardId: 'gift_card_10740638',
          giftCardNumber: 'XXXX XXXX XXXX 8361',
          remainingBalance: 20.0,
        },
      ]

      expect(discountsFragment(discounts, giftcards)).toEqual([
        {
          label: 'Staff Card',
          value: '6.40',
        },
        {
          label: 'Gift Card - XXXX XXXX XXXX 8361',
          value: '0.00',
        },
      ])
    })
  })

  describe('discountFragment', () => {
    const { discountFragment } = fragments

    it('should correctly format negative discount numbers from WCS into positive strings for Monty', () => {
      expect(discountFragment({ value: -10, label: '£10 off' })).toEqual({
        value: '10.00',
        label: '£10 off',
      })
    })

    it('should return a default discount object if values cannot be found', () => {
      expect(discountFragment({})).toEqual({
        value: '0.00',
        label: '',
      })
    })
  })

  describe('discountTextFragment', () => {
    const { discountTextFragment } = fragments
    describe('given a valid Discount array from WCS ', () => {
      it('should return the discount string', () => {
        expect(
          discountTextFragment([
            {
              label: 'Here is a discount',
            },
          ])
        ).toBe('Here is a discount')
      })
    })

    describe('given an invalid Discount array', () => {
      it('should return an empty string', () => {
        expect(discountTextFragment([[]])).toBe('')
        expect(discountTextFragment(['uhoh'])).toBe('')
        expect(discountTextFragment()).toBe('')
      })
    })
  })

  // Commented out due to the fact that the function "inventoryPositionsFragment" has been removed in order
  // to avoid too expensive operations (navigate array of nested objects) in the WCS Layer.

  // describe('inventoryPositions fragment', () => {
  //   const { inventoryPositionsFragment } = fragments

  //   it('should deep clone the object passed to it, without any null values', () => {
  //     expect(inventoryPositionsFragment({})).toEqual({})
  //     expect(
  //       inventoryPositionsFragment({
  //         item_1: {
  //           partNumber: '602015000888708',
  //           inventorys: [
  //             {
  //               cutofftime: 'null',
  //               quantity: 3,
  //               ffmcenterId: 12556,
  //               expressdates: null
  //             }
  //           ],
  //           invavls: null
  //         }
  //       })
  //     ).toEqual({
  //       item_1: {
  //         partNumber: '602015000888708',
  //         inventorys: [
  //           {
  //             cutofftime: 'null',
  //             quantity: 3,
  //             ffmcenterId: 12556
  //           }
  //         ]
  //       }
  //     })
  //   })
  // })

  describe('priceFragment', () => {
    const { priceFragment } = fragments

    it('should convert a numeric value of 20.00000 to a string "20.00"', () => {
      expect(priceFragment(20.0)).toBe('20.00')
    })

    it('should return string "0.00" if the price is 0 or falsy', () => {
      expect(priceFragment(0)).toBe('0.00')
      expect(priceFragment()).toBe('0.00')
    })

    it('should return string "0.00" if the price is a string', () => {
      expect(priceFragment('2')).toBe('0.00')
    })
  })

  describe('productsFragment', () => {
    const { productsFragment } = fragments
    it('should return an empty array if the parameter passed to it is not an object', () => {
      expect(productsFragment('Product')).toEqual([])
      expect(productsFragment(['Products'])).toEqual([])
    })

    it('should return an empty array if the object passed to it has no "Product" key', () => {
      expect(productsFragment({ IncorrectKey: 'value' })).toEqual([])
    })

    it('should return an empty array if, in the object passed to it, the value for "Product" is not an array', () => {
      expect(productsFragment({ Product: 'not an array' })).toEqual([])
    })

    it('should format a Product object from WCS into a format expected by Monty', () => {
      expect(
        productsFragment(path(['Basket', 'products'], wcsOrderCalculate))
      ).toEqual(montyGetItems.products)
    })

    it('should map a product on sale', () => {
      expect(productsFragment(wcsProductsFragment)).toEqual(
        hapiProductsFragment
      )
    })

    it("should map 'freeItem' flag", () => {
      expect(
        productsFragment({
          Product: [{ ...wcsProductsFragment.Product[0], freeItem: true }],
        })
      ).toEqual([{ ...hapiProductsFragment[0], freeItem: true }])
    })

    it('should map `isDDPProduct` flag', () => {
      expect(
        productsFragment({
          Product: [{ ...wcsProductsFragment.Product[0], isDDPItem: true }],
        })
      ).toEqual([{ ...hapiProductsFragment[0], isDDPProduct: true }])
    })
  })

  describe('productFragment', () => {
    const { productFragment } = fragments

    const defaultProduct = {
      productId: false,
      catEntryId: false,
      orderItemId: false,
      shipModeId: false,
      lineNumber: '',
      size: '',
      name: '',
      quantity: 0,
      lowStock: false,
      inStock: true,
      unitPrice: '0.00',
      totalPrice: '',
      assets: [],
      items: [],
      bundleProducts: [],
      attributes: {},
      colourSwatches: [],
      tpmLinks: [],
      bundleSlots: [],
      ageVerificationRequired: false,
      isBundleOrOutfit: false,
      discountText: '',
      freeItem: false,
    }

    it('handles correctly "lowStock" possible values', () => {
      const lowStockProductBoolean = {
        productId: 123,
        lowStock: true,
      }

      expect(productFragment(lowStockProductBoolean).lowStock).toBe(true)

      const lowStockProductString = {
        productId: 123,
        lowStock: 'true',
      }

      expect(productFragment(lowStockProductString).lowStock).toBe(true)
    })

    it('handles correctly "exceedsAllowedQty" possible values', () => {
      const exceededAllowedQtyProduct = {
        productId: 123,
        exceedsAllowedQty: true,
      }

      expect(productFragment(exceededAllowedQtyProduct).exceedsAllowedQty).toBe(
        true
      )

      const notExceededAllowedQtyProductBoolean = {
        productId: 123,
        exceedsAllowedQty: false,
      }

      expect(
        productFragment(notExceededAllowedQtyProductBoolean).exceedsAllowedQty
      ).toBe(false)
    })

    it('should convert a product from WCS into a format expected from Monty', () => {
      expect(
        productFragment(
          path(['Basket', 'products', 'Product', 0], wcsOrderCalculate)
        )
      ).toEqual(path(['products', 0], montyGetItems))
    })

    it('should return a default product object if values cannot be found', () => {
      expect(productFragment({})).toEqual(defaultProduct)
    })

    describe('if the product has a wasPrice and a wasWasPrice', () => {
      it('should include these values in a format expected by Monty', () => {
        expect(
          productFragment({
            wasPrice: 20,
            wasWasPrice: 10,
          })
        ).toEqual({
          ...defaultProduct,
          wasPrice: '10.00',
          wasWasPrice: '20.00',
        })
      })
    })

    describe('if the product has an itemTotal', () => {
      it('should pass this as the totalPrice value ', () => {
        expect(
          productFragment({
            itemTotal: '8.00',
            unitPrice: 3.5,
            quantity: 3,
          })
        ).toEqual({
          ...defaultProduct,
          totalPrice: '8.00',
          quantity: 3,
          unitPrice: '3.50',
        })
      })
    })

    describe('if the product does not have an itemTotal', () => {
      it('should calculate the totalPrice from the unitPrice and quantity', () => {
        expect(
          productFragment({
            unitPrice: 3.5,
            quantity: 3,
          })
        ).toEqual({
          ...defaultProduct,
          totalPrice: '10.50',
          quantity: 3,
          unitPrice: '3.50',
        })
      })
    })

    describe('if the product has a PromotionDisplayURL', () => {
      it('should be transformed into promotionId, promotionLabel, and promotionText', () => {
        expect(
          productFragment({
            PromotionDisplayURL: 'http://foo.bar?promoId=123456&foo=bar',
            promoTitle: '3 for £8 ankle socks',
            unfulfilledPromotionLabel: 'Hurry! Act now!',
          })
        ).toEqual({
          ...defaultProduct,
          promoId: 123456,
          promoTitle: '3 for £8 ankle socks',
          discountText: 'Hurry! Act now!',
        })

        expect(
          productFragment({
            PromotionDisplayURL: 'http://foo.bar?&foo=bar&promoId=123456',
            promoTitle: '3 for £8 ankle socks',
            unfulfilledPromotionLabel: 'Hurry! Act now!',
          })
        ).toEqual({
          ...defaultProduct,
          promoId: 123456,
          promoTitle: '3 for £8 ankle socks',
          discountText: 'Hurry! Act now!',
        })
      })
    })

    describe('if the product has a PromotionDisplayURL without a valid promoId', () => {
      it('should not have a promoId in the response', () => {
        expect(
          productFragment({
            PromotionDisplayURL:
              'http://www.topshop.com.arcadiagroup.co.uk/webapp/wcs/stores/servlet/DisplayPromoLanding?storeId=12556&promoId=&urlRequestType=Base&promotionIdentifier=promo&langId=-1&catalogId=33057',
            promoTitle: '3 for £8 ankle socks',
            unfulfilledPromotionLabel: 'Hurry! Act now!',
          })
        ).toEqual({
          ...defaultProduct,
          promoTitle: '3 for £8 ankle socks',
          discountText: 'Hurry! Act now!',
        })
      })
    })

    describe('if the product has an invalid PromotionDisplayURL', () => {
      it('should not be transformed', () => {
        expect(
          productFragment({
            PromotionDisplayURL: 12345,
            promoTitle: '3 for £8 ankle socks',
            unfulfilledPromotionLabel: 'Hurry!',
          })
        ).toEqual(defaultProduct)
      })
    })

    describe('if the product does not have a promoTitle or unfulfilledPromotionLabel', () => {
      it('should not be transformed', () => {
        expect(
          productFragment({
            PromotionDisplayURL: 'http://foo.bar?promoId=123456&foo=bar',
            promoTitle: '',
            unfulfilledPromotionLabel: 'Hurry! Limited time offer!',
          })
        ).toEqual(defaultProduct)

        expect(
          productFragment({
            PromotionDisplayURL: 'http://foo.bar?promoId=123456&foo=bar',
            promoTitle: '2% off all socks',
            unfulfilledPromotionLabel: '',
          })
        ).toEqual(defaultProduct)
      })
    })

    describe('if the product has restricted delivery', () => {
      it('should include restrictedDeliveryItem is true', () => {
        expect(
          productFragment({
            hasExcludedProducts: true,
          })
        ).toEqual({
          ...defaultProduct,
          restrictedDeliveryItem: true,
        })
      })
    })

    describe('if the product has baseImageUrl', () => {
      it('should include baseImageUrl', () => {
        const baseImageUrl = 'foo'
        expect(productFragment({ baseImageUrl })).toEqual({
          ...defaultProduct,
          baseImageUrl,
        })
      })
    })

    describe('if the product has iscmCategory', () => {
      it('should include iscmCategory', () => {
        const iscmCategory = 'foo'
        expect(productFragment({ iscmCategory })).toEqual({
          ...defaultProduct,
          iscmCategory,
        })
      })
    })
  })

  describe('promotionsFragment', () => {
    const { promotionsFragment } = fragments

    it('should return an empty array if the parameter passed to it is not an object', () => {
      expect(promotionsFragment('Promotions')).toEqual([])
      expect(promotionsFragment(['Promotions'])).toEqual([])
    })

    it('should return an empty array if the value passed to it does not have a promotionDetails key', () => {
      expect(promotionsFragment('promotionDescription')).toEqual([])
      expect(promotionsFragment({ IncorrectKey: 'value' })).toEqual([])
    })

    it('should return an empty array if, in the object passed to it, the value for "promotionDetails" is not an array', () => {
      expect(promotionsFragment({ promotionDetails: 'not an array' })).toEqual(
        []
      )
    })

    it('should format a promotionDetails object from WCS into a format expected by Monty', () => {
      expect(
        promotionsFragment(
          path(['Basket', 'PromotionCodeManageForm'], wcsOrderCalculate)
        )
      ).toEqual(montyGetItems.promotions)
    })
  })

  describe('promotionFragment', () => {
    const { promotionFragment } = fragments
    it('should convert a promotion from WCS into a format expected from Monty', () => {
      expect(
        promotionFragment(
          path(
            ['Basket', 'PromotionCodeManageForm', 'promotionDetails', 0],
            wcsOrderCalculate
          )
        )
      ).toEqual(path(['promotions', 0], montyGetItems))
    })

    it('should return default promotion object if values cannot be found', () => {
      expect(promotionFragment({})).toEqual({
        promotionCode: '',
        label: '',
      })
    })
  })

  describe('totalPrice fragment', () => {
    const { totalPriceFragment } = fragments
    it('should calulate a total price and format it correctly', () => {
      expect(totalPriceFragment(2, 30)).toBe('60.00')
    })

    it('should return an empty string if either value is missing', () => {
      expect(totalPriceFragment(null, 30)).toBe('')
      expect(totalPriceFragment(1)).toBe('')
    })

    it('should return an empty string if the arguments would result in a negative number', () => {
      expect(totalPriceFragment(2, -60)).toBe('')
    })
  })

  describe('prepareInventoryPositions', () => {
    const { prepareInventoryPositions } = fragments
    describe('when the productDataQuantity objects have numeric catentryIds', () => {
      it('should convert them to strings', () => {
        const productDataQuantity = {
          item_1: {
            catentryId: 123456,
            partNumber: '000000000000000',
            inventorys: [
              {
                cutoffTime: '2100',
                quantity: 5,
                ffmcenterId: 12556,
                expressdates: ['2017-10-17', '2017-10-18'],
              },
            ],
            invavls: null,
          },
        }
        const inventoryPositions = {
          item_1: {
            catentryId: '123456',
            partNumber: '000000000000000',
            inventorys: [
              {
                cutoffTime: '2100',
                quantity: 5,
                ffmcenterId: 12556,
                expressdates: ['2017-10-17', '2017-10-18'],
              },
            ],
            invavls: null,
          },
        }
        expect(prepareInventoryPositions(productDataQuantity)).toEqual(
          inventoryPositions
        )
      })
    })

    describe('when the productDataQuantity objects have string values', () => {
      it('should do nothing', () => {
        const productDataQuantity = {
          item_1: {
            catentryId: '23456789',
            partNumber: '000000000000000',
            inventorys: [
              {
                cutoffTime: '2100',
                quantity: 5,
                ffmcenterId: 12556,
                expressdates: ['2017-10-17', '2017-10-18'],
              },
            ],
            invavls: null,
          },
        }
        const inventoryPositions = { ...productDataQuantity }
        expect(prepareInventoryPositions(productDataQuantity)).toEqual(
          inventoryPositions
        )
      })
    })

    describe('when the objects in the inventorys array have null values', () => {
      it('should replace them with empty arrays', () => {
        const productDataQuantity = {
          item_1: {
            partNumber: '602018001194415',
            catentryId: 30871573,
            inventorys: [
              {
                cutofftime: null,
                quantity: 10,
                ffmcenterId: 13052,
                expressdates: null,
              },
            ],
            invavls: null,
          },
          item_2: {
            partNumber: '602017001167891',
            catentryId: 30154928,
            inventorys: [
              {
                cutofftime: null,
                quantity: 10,
                ffmcenterId: 13052,
                expressdates: null,
              },
            ],
            invavls: null,
          },
        }

        const inventoryPositions = {
          item_1: {
            partNumber: '602018001194415',
            catentryId: '30871573',
            inventorys: [
              {
                cutofftime: null,
                quantity: 10,
                ffmcenterId: 13052,
                expressdates: [],
              },
            ],
            invavls: null,
          },
          item_2: {
            partNumber: '602017001167891',
            catentryId: '30154928',
            inventorys: [
              {
                cutofftime: null,
                quantity: 10,
                ffmcenterId: 13052,
                expressdates: [],
              },
            ],
            invavls: null,
          },
        }
        expect(prepareInventoryPositions(productDataQuantity)).toEqual(
          inventoryPositions
        )
      })
    })
  })

  describe('restrictedDeliveryItemFragment', () => {
    const { restrictedDeliveryItemFragment } = fragments
    describe('when a basket contains products with restricted delivery', () => {
      it('should return true', () => {
        const products = {
          Product: [
            {
              hasExcludedProducts: true,
            },
            {
              hasExcludedProducts: false,
            },
            {
              hasExcludedProducts: true,
            },
          ],
        }
        expect(restrictedDeliveryItemFragment(products)).toBeTruthy()
      })
    })
    describe('when a basket contains products that do not have the property', () => {
      it('should return false', () => {
        const products = {
          Product: [
            {
              catEntryId: '2342324242',
            },
            {
              catEntryId: '2342342324',
            },
            {
              catEntryId: '2342342842',
            },
          ],
        }
        expect(restrictedDeliveryItemFragment(products)).toBeFalsy()
      })
    })
  })

  describe('deliveryThresholdsJsonFragment', () => {
    const { deliveryThresholdsJsonFragment } = fragments

    // shoppingBagProductRecommendations is the espot where we store the delivery thresholds.
    const espots = {
      shoppingBagProductRecommendations: {
        contentText:
          '%7B%22nudgeMessageThreshold%22%3A%2230.0%22%2C%22standardDeliveryThreshold%22%3A%2250.0%22%7D',
      },
    }

    describe('shoppingBagProductRecommendations is not available', () => {
      it('returns an empty object encoded', () => {
        expect(deliveryThresholdsJsonFragment({ anotherEspot: {} })).toEqual(
          '%7B%7D'
        )
      })
    })

    describe('shoppingBagProductRecommendations is available', () => {
      it('returns the delivery thresholds values', () => {
        expect(deliveryThresholdsJsonFragment(espots)).toEqual(
          '%7B%22nudgeMessageThreshold%22%3A%2230.0%22%2C%22standardDeliveryThreshold%22%3A%2250.0%22%7D'
        )
      })

      describe('shoppingBagProductRecommendations is an empty object', () => {
        it('returns the delivery thresholds values', () => {
          expect(
            deliveryThresholdsJsonFragment({
              shoppingBagProductRecommendations: {},
            })
          ).toEqual('%7B%7D')
        })
      })
    })
  })

  describe('basket transform', () => {
    const defaultBasket = {
      orderId: 0,
      subTotal: '0.00',
      total: '0.00',
      totalBeforeDiscount: '0.00',
      deliveryOptions: [],
      promotions: [],
      discounts: [],
      products: [],
      savedProducts: [],
      ageVerificationRequired: false,
      inventoryPositions: {},
      deliveryThresholdsJson: '%7B%7D',
    }

    it('should convert a basket object from WCS into a format expected by Monty', () => {
      expect(transform(wcsOrderCalculate.Basket, '£')).toEqual(montyGetItems)
    })

    it('should return a default basket object if values cannot be found', () => {
      expect(transform({})).toEqual(defaultBasket)
    })

    it('should return a default basket object with `isDDPOrder` value if found', () => {
      expect(
        transform({
          isDDPOrder: false,
        })
      ).toEqual({
        ...defaultBasket,
        isDDPOrder: false,
      })
    })

    it('should return a default basket object with `isBasketResponse` value if found', () => {
      expect(
        transform({
          isBasketResponse: false,
        })
      ).toEqual({
        ...defaultBasket,
        isBasketResponse: false,
      })
    })

    it('should return a default basket object with `isOrderCoveredByGiftCards` value if found', () => {
      expect(
        transform({
          isOrderCoveredByGiftCards: false,
        })
      ).toEqual({
        ...defaultBasket,
        isOrderCoveredByGiftCards: false,
      })
    })

    it('should return isClearPayAvailable if available', () => {
      expect(
        transform({
          isClearPayAvailable: false,
        })
      ).toEqual({
        ...defaultBasket,
        isClearPayAvailable: false,
      })
    })

    it('passes through saved basket', () => {
      const savedBasketFragment = {
        savedProducts: {
          Product: [
            {
              imageUrl:
                'https://ts.pplive.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/62Z39IGRY_small.jpg',
              sourceUrl:
                'http://ts.pplive.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/ProductDisplay?langId=-1&storeId=12556&catalogId=33057&productId=21919934&categoryId=208519&parent_category_rn=277012',
              colour: 'GREY',
              catEntryId: 21919934,
              lineNumber: '62Z39IGRY',
              name: '**Suedette Tuxedo Dress by Love',
              shipModeId: 26504,
              removeSavedItemURL:
                'http://ts.pplive.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/InterestItemDelete?updatePrices=1&calculationUsageId=-1&langId=-1&storeId=12556&catalogId=33057&productId=21919934&catEntryId=21919940&orderId=700289104&calculateOrder=1&quantity=1.0&URL=InterestItemsRemoveItemAjaxView',
              size: 'XS',
              instock: false,
              quantity: 0,
              updateURL:
                'http://ts.pplive.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/ChangeDetailsDisplayAjaxView?orderId=700289104&langId=-1&storeId=12556&catalogId=33057&productId=21919934&catEntryId=21919940&offerPrice=36.00&size=XS&quantity=1.0&pageName=interestItem',
              displayDiscountedPrice: null,
              unitPrice: 36,
              totalLabel: 'Total',
              Total: 0,
            },
          ],
        },
      }
      expect(transform(savedBasketFragment).savedProducts).toEqual(
        savedBasketFragment.savedProducts
      )
    })
  })
})
