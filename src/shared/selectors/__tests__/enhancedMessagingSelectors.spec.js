import { getExpressDeliveryAvailableForProducts } from '../enhancedMessagingSelectors'

describe('Ehanced Messaging Selectors selectors', () => {
  describe('getExpressDeliveryAvailableForProducts', () => {
    it('should return false if inventory position quantity is less than the quantity selected', () => {
      expect(
        getExpressDeliveryAvailableForProducts({
          shoppingBag: {
            bag: {
              products: [
                {
                  catEntryId: 27126578,
                  quantity: 8,
                },
              ],
              inventoryPositions: {
                item_1: {
                  inventorys: {
                    catEntryId: 27126578,
                    inventorys: [{ quantity: 4 }],
                  },
                },
              },
            },
          },
        })
      ).toEqual([
        {
          catEntryId: 27126578,
          available: false,
        },
      ])
    })
    it('should return false if inventory position quantity is null', () => {
      expect(
        getExpressDeliveryAvailableForProducts({
          shoppingBag: {
            bag: {
              products: [
                {
                  catEntryId: 27126578,
                  quantity: 8,
                },
              ],
              inventoryPositions: {
                item_1: {
                  catEntryId: 27126578,
                  inventorys: null,
                },
              },
            },
          },
        })
      ).toEqual([
        {
          catEntryId: 27126578,
          available: false,
        },
      ])
    })
  })
})
