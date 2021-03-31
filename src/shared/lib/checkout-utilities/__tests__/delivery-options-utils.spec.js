import {
  findSelected,
  findParcelShopOption,
  isStoreDeliveryLocation,
  isParcelShopDeliveryLocation,
  isStoreOrParcelDeliveryLocation,
  getDeliveryText,
  getDeliveryPriceText,
} from '../delivery-options-utils'

const context = {
  l: (...x) => x.flat().join(''),
  p: (x) => `£${x}`,
}

const homeStandardDeliveryProps = {
  deliveryCountry: 'United Kingdom',
  deliveryType: 'HOME_STANDARD',
  deliveryOptions: [],
  estimatedDeliveryDate: 'Wednesday 22 April 2020',
}

const homeExpressDeliveryProps = {
  deliveryType: 'HOME_EXPRESS',
  deliveryCountry: 'United Kingdom',
  deliveryOptions: [
    {
      shipModeId: 28005,
      dayText: 'Mon',
      dateText: '07 Sep',
      price: '6.00',
      enabled: true,
      selected: true,
      nominatedDate: '2020-09-07',
    },
    {
      shipModeId: 28006,
      dayText: 'Tue',
      dateText: '08 Sep',
      price: '6.00',
      enabled: false,
      selected: false,
      nominatedDate: '2020-09-08',
    },
  ],
}

describe('Delivery options utils', () => {
  describe('findSelected', () => {
    it('returns undefined if selected element can not be found', () => {
      const array = []
      expect(findSelected(array)).toBeUndefined()
    })
    it('returns the selected object from array', () => {
      const array = [{}, { selected: true }, {}]
      expect(findSelected(array)).toBe(array[1])
    })
  })

  describe('findParcelShopOption', () => {
    it('returns undefined if selected element can not be found', () => {
      const array = []
      expect(findParcelShopOption(array)).toBeUndefined()
    })
    it('returns the selected object from array', () => {
      const array = [
        {},
        { deliveryOptionExternalId: 'retail_store_collection' },
        {},
      ]
      expect(findParcelShopOption(array)).toBe(array[1])
    })
  })

  describe('isStoreDeliveryLocation(location)', () => {
    it('returns true if the location type is `STORE`', () => {
      const location = { deliveryLocationType: 'STORE' }
      expect(isStoreDeliveryLocation(location)).toBe(true)
    })

    it('returns false if the location type is not `STORE`', () => {
      const location = { deliveryLocationType: 'HOME' }
      expect(isStoreDeliveryLocation(location)).toBe(false)
    })
  })

  describe('isParcelShopDeliveryLocation(location)', () => {
    it('returns true if the location type is `PARCELSHOP`', () => {
      const location = { deliveryLocationType: 'PARCELSHOP' }
      expect(isParcelShopDeliveryLocation(location)).toBe(true)
    })

    it('returns false if the location type is not `PARCELSHOP`', () => {
      const location = { deliveryLocationType: 'HOME' }
      expect(isParcelShopDeliveryLocation(location)).toBe(false)
    })
  })

  describe('isStoreOrParcelDeliveryLocation(location)', () => {
    it('returns true if the location type is `STORE`', () => {
      const location = { deliveryLocationType: 'STORE' }
      expect(isStoreOrParcelDeliveryLocation(location)).toBe(true)
    })

    it('returns true if the location type is `PARCELSHOP`', () => {
      const location = { deliveryLocationType: 'PARCELSHOP' }
      expect(isStoreOrParcelDeliveryLocation(location)).toBe(true)
    })

    it('returns false if the location type is not `HOME`', () => {
      const location = { deliveryLocationType: 'HOME' }
      expect(isStoreOrParcelDeliveryLocation(location)).toBe(false)
    })
  })

  describe('getDeliveryPriceText', () => {
    it('formats the delivery price if amount is greater than 0', () => {
      const priceText = getDeliveryPriceText({ cost: '12.00' }, context)

      expect(priceText).toBe('£12.00')
    })

    it('returns `free` if amount is greater is equal 0', () => {
      const priceText = getDeliveryPriceText({ cost: '0.00' }, context)

      expect(priceText).toBe('Free')
    })
  })

  describe('getDeliveryText', () => {
    it('returns undefined if the delivery country is not UK', () => {
      const deliveryText = getDeliveryText(
        {
          deliveryCountry: 'Italy',
        },
        context
      )

      expect(deliveryText).toBe(undefined)
    })

    describe('delivery type is HOME_EXPRESS', () => {
      it('returns `Get it on` with the formated date', () => {
        const deliveryText = getDeliveryText(homeExpressDeliveryProps, context)

        expect(deliveryText).toBe('Get it on Monday 7 September')
      })

      it('returns undefined if nominatedDate is not defined', () => {
        const deliveryText = getDeliveryText(
          {
            ...homeExpressDeliveryProps,
            deliveryOptions: [
              {
                ...homeExpressDeliveryProps.deliveryOptions[0],
                nominatedDate: undefined,
              },

              {
                ...homeExpressDeliveryProps.deliveryOptions[1],
                nominatedDate: undefined,
              },
            ],
          },
          context
        )

        expect(deliveryText).toBe(undefined)
      })
    })

    describe('delivery type is HOME_STANDARD', () => {
      it('returns `Get it by` with the formated date', () => {
        const deliveryText = getDeliveryText(homeStandardDeliveryProps, context)

        expect(deliveryText).toBe('Get it by Wednesday 22 April')
      })

      it('returns undefined if estimatedDeliveryDate is not defined', () => {
        const deliveryText = getDeliveryText(
          {
            ...homeStandardDeliveryProps,
            estimatedDeliveryDate: undefined,
          },
          context
        )

        expect(deliveryText).toBe(undefined)
      })
    })
  })
})
