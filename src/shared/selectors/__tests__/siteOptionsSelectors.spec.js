import {
  getBillingCountries,
  selectSiteOptions,
  getDDPSkuItem,
  getDDPSkus,
  getDDPDefaultSku,
  getDDPProduct,
  getPageTitle,
  getMetaDescription,
  getBillingCountriesISO,
} from '../siteOptionsSelectors'

describe('Site Options Selector', () => {
  const state = {
    siteOptions: {
      billingCountries: ['South Africa', 'United Kingdom'],
      ddp: {
        ddpProduct: {
          name: 'DDP VIP Subscription',
          ddpSkus: [
            {
              sku: '100000001',
              default: true,
              catentryId: '32077179',
              name: 'DDP VIP 1 Month',
              description: 'DDP VIP 1 Month',
              timePeriod: '1',
            },
          ],
        },
      },
      title: 'mock-title-meta',
      description: 'mock-description',
    },
  }

  describe(getBillingCountries.name, () => {
    it('returns billingCountries', () => {
      expect(getBillingCountries(state)).toBe(
        state.siteOptions.billingCountries
      )
    })
  })

  describe(selectSiteOptions.name, () => {
    it('returns siteOptions state', () => {
      expect(selectSiteOptions(state)).toBe(state.siteOptions)
    })
  })

  describe(getDDPSkus, () => {
    it('returns an empty array if there is no ddp object in the state', () => {
      expect(getDDPSkus({ siteOptions: { ddp: { ddpProduct: {} } } })).toEqual(
        []
      )
    })
    it('returns ddp sku', () => {
      expect(getDDPSkus(state)).toBe(state.siteOptions.ddp.ddpProduct.ddpSkus)
    })
  })

  describe(getDDPSkuItem.name, () => {
    const sku = '100000001'
    const ddpSku = { sku, catEntryId: '32077179' }
    const siteOptions = { ddp: { ddpProduct: { ddpSkus: [ddpSku] } } }

    it('returns undefined if item is not found', () => {
      expect(getDDPSkuItem({ siteOptions }, '007')).toBeUndefined()
    })

    it('returns undefined if siteOptions does not contain ddp or the sku is undefined', () => {
      expect(getDDPSkuItem({ siteOptions: {} })).toBeUndefined()
    })

    it('returns DDP sku Item', () => {
      expect(getDDPSkuItem({ siteOptions }, sku)).toEqual(ddpSku)
    })
  })

  describe('getDDPDefaultSku', () => {
    const siteOptions = {
      ddp: {
        ddpProduct: {
          name: 'DDP VIP Subscription',
          ddpSkus: [
            {
              sku: '100000001',
              default: true,
              catentryId: '32077179',
              name: 'DDP VIP 1 Month',
              description: 'DDP VIP 1 Month',
              timePeriod: '1',
            },
            {
              sku: '100000002',
              default: false,
              catentryId: '32077180',
              name: 'DDP VIP 2 Months',
              description: 'DDP VIP 2 Months',
              timePeriod: '2',
            },
            {
              sku: '100000003',
              default: false,
              catentryId: '32077181',
              name: 'DDP VIP 3 Months',
              description: 'DDP VIP 3 Months',
              timePeriod: '3',
            },
          ],
        },
      },
    }

    it('returns the ddpSku Product', () => {
      expect(getDDPDefaultSku({ siteOptions })).toEqual(
        siteOptions.ddp.ddpProduct.ddpSkus[0]
      )
    })

    it('returns undefined if item is not found', () => {
      const siteOptions = {
        ddp: {
          ddpProduct: {
            ddpSkus: [
              {
                sku: '100000001',
                default: false,
                catentryId: '32077179',
                name: 'DDP VIP 1 Month',
                description: 'DDP VIP 1 Month',
                timePeriod: '1',
              },
              {
                sku: '100000002',
                default: false,
                catentryId: '32077180',
                name: 'DDP VIP 2 Months',
                description: 'DDP VIP 2 Months',
                timePeriod: '2',
              },
              {
                sku: '100000003',
                default: false,
                catentryId: '32077181',
                name: 'DDP VIP 3 Months',
                description: 'DDP VIP 3 Months',
                timePeriod: '3',
              },
            ],
          },
        },
      }

      expect(getDDPDefaultSku({ siteOptions })).toEqual({})
    })
  })

  describe('getDDPProduct', () => {
    it('returns the DDP Product', () => {
      expect(getDDPProduct(state)).toEqual(state.siteOptions.ddp.ddpProduct)
    })
    it('returns undefined if ddpProduct is not found', () => {
      const testState = {
        ...state,
        siteOptions: {
          ...state.siteOptions,
          ddp: {
            ...state.siteOptions.ddp,
            ddpProduct: undefined,
          },
        },
      }
      expect(getDDPProduct(testState)).toBeUndefined()
    })
  })

  describe('Meta data selectors', () => {
    it('should return meta description', () => {
      expect(getMetaDescription(state)).toBe(state.siteOptions.description)
    })

    it('should return page title', () => {
      expect(getPageTitle(state)).toBe(state.siteOptions.title)
    })
  })

  describe('getBillingCountriesISO', () => {
    it('returns an array of ISO countries', () => {
      const state = {
        siteOptions: {
          billingCountryIso: {
            Singapore: 'SG',
            Slovakia: 'SV',
            'United Kingdom': 'GB',
            'United States': 'US',
          },
        },
      }

      expect(getBillingCountriesISO(state)).toEqual(['SG', 'SV', 'GB', 'US'])
    })
  })
})
