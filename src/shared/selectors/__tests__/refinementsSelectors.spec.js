import {
  getActiveRefinements,
  getSelectedRefinements,
  getRefinementOptions,
  getRefinements,
  getAppliedOptions,
  getSeoUrlCache,
  getLowerCaseAppliedOptionsKeys,
  getRemoveAllFilters,
  isRefinementsSelected,
  isFilterSelected,
  getPreSelectedSize,
} from '../refinementsSelectors'

describe('Refinements Selectors', () => {
  describe('getRefinements', () => {
    it('should return empty array if refinements is not in state', () => {
      expect(getRefinements({})).toEqual([])
    })
    it('should return non falsy refinements from the state', () => {
      expect(
        getRefinements({
          products: {
            refinements: [null, 1, false, '2', undefined, [], {}],
          },
        })
      ).toEqual([1, '2'])
    })
  })
  describe('#getAppliedOptions', () => {
    it('should return empty object when no applied option in state', () => {
      const state = {}
      expect(getAppliedOptions(state)).toEqual({})
    })
    it('should return applied options when in state', () => {
      const appliedOptions = 'appliedOptions'
      const state = {
        refinements: {
          appliedOptions,
        },
      }
      expect(getAppliedOptions(state)).toBe(appliedOptions)
    })
  })
  describe('#getSeoUrlCache', () => {
    it('should return empty string when no cached seourl in state', () => {
      const state = {}
      expect(getSeoUrlCache(state)).toEqual('')
    })
    it('should return cached seourl when in state', () => {
      const seoUrlCache = 'seoUrlCache'
      const state = {
        refinementsV2: {
          seoUrlCache,
        },
      }
      expect(getSeoUrlCache(state)).toBe(seoUrlCache)
    })
  })
  describe('#getFilteredAppliedOptions', () => {
    it('should return empty array if no applied options in state', () => {
      const state = {}
      expect(getLowerCaseAppliedOptionsKeys(state)).toEqual([])
    })
    it('should return lower case applied options keys', () => {
      const state = {
        refinements: {
          appliedOptions: {
            A: '1',
            b: '2',
            C: '3',
          },
        },
      }
      expect(getLowerCaseAppliedOptionsKeys(state)).toEqual(['a', 'b', 'c'])
    })
  })
  describe('#getActiveRefinements', () => {
    it('should return empty array when no active refinements in state', () => {
      const state = {
        products: {
          activeRefinements: [],
        },
      }
      expect(getActiveRefinements(state)).toEqual([])
    })
    it('should return array of active refinements from state', () => {
      const state = {
        products: {
          activeRefinements: [
            {
              dimensionName: 'TopShop_uk_ce3_product_type',
              properties: {
                SourceId: 'ECMC_PROD_CE3_PRODUCT_TYPE_1_dresses',
                refinement_name: 'Product Type',
              },
              label: 'dresses',
              removeAction: {
                navigationState: 'XXXXX',
              },
            },
            {
              propertyName: 'nowPrice',
              upperBound: '32.0',
              lowerBound: '5.0',
            },
          ],
        },
      }
      expect(getActiveRefinements(state)).toEqual([
        {
          key: 'TOPSHOP_UK_CE3_PRODUCT_TYPE',
          title: 'Product Type',
          values: [
            {
              key: 'ECMC_PROD_CE3_PRODUCT_TYPE_1_DRESSES',
              label: 'dresses',
              seoUrl: 'XXXXX',
            },
          ],
        },
        {
          key: 'NOWPRICE',
          title: 'Price',
          values: [
            {
              key: 'NOWPRICE5.032.0',
              label: '',
              upperBound: '32.0',
              lowerBound: '5.0',
              seoUrl: undefined,
            },
          ],
        },
      ])
    })
  })

  describe('getSelectedRefinements()', () => {
    it('should return ordered refinements', () => {
      const state = {
        refinements: {
          selectedOptions: {
            colour: ['black'],
            size: [4, 6, 8],
          },
        },
      }
      expect(getSelectedRefinements(state)).toEqual([
        {
          key: 'colour',
          value: 'black',
        },
        {
          key: 'size',
          value: '4,6,8',
        },
      ])
    })
  })

  describe('isFilterSelected()', () => {
    const fakeState = {
      products: {
        activeRefinements: [
          {
            dimensionName: 'MissSelfridge_uk_category',
            properties: {
              seo_title: "Tops @@ Shop Women's Clothing @@ Miss Selfridge",
              SourceId: '208044',
              catNavigationState:
                '/en/msuk/category/clothing-299047/4/6/N-8hzZ7sdZ7seZ8vx',
              hiddenCategory: '0',
              seo_description:
                'Complete the look in must-have tops at Miss Selfridge. From cute cropped bralets to essential tees, we’ve a top to suit you. Collect free in store.',
              DisplayOrder: '-1',
              seoCategoryToken: 'tops-299061',
              hierarchical_level: 'Level - 2',
              catpath_name: 'Tops',
              refinement_name: 'Category',
            },
            label: 'Tops',
            multiSelect: false,
            removeAction: {
              siteState: {
                siteId: '/12554',
                properties: {},
                '@class': 'com.endeca.infront.site.model.SiteState',
                contentPath:
                  '/browse/en/msuk/category/clothing-299047/tops-299061/4/6/_/N-8m7Z7sdZ7seZ8vx',
              },
              navigationState:
                '/en/msuk/category/4/6/N-7sdZ7seZ8vx?Nrpp=40&siteId=%2F12554',
              siteRootPath: '/pages',
              contentPath: '/browse',
            },
            displayName: 'MissSelfridge_uk_category',
            count: 732,
          },
          {
            ancestors: [],
            dimensionName: 'MissSelfridge_uk_size',
            properties: {
              SourceId: 'ECMC_ITEM_SIZE_9_4',
              DisplayOrder: '-1',
              refinement_name: 'Size',
            },
            label: '4',
            multiSelect: true,
            removeAction: {
              siteState: {
                siteId: '/12554',
                properties: {},
                '@class': 'com.endeca.infront.site.model.SiteState',
                contentPath:
                  '/browse/en/msuk/category/clothing-299047/tops-299061/4/6/_/N-8m7Z7sdZ7seZ8vx',
              },
              navigationState:
                '/en/msuk/category/clothing-299047/tops-299061/6/N-8m7Z7seZ8vx?Nrpp=40&siteId=%2F12554',
              siteRootPath: '/pages',
              contentPath: '/browse',
            },
            displayName: 'MissSelfridge_uk_size',
            count: 732,
          },
          {
            ancestors: [],
            dimensionName: 'MissSelfridge_uk_size',
            properties: {
              SourceId: 'ECMC_ITEM_SIZE_9_6',
              DisplayOrder: '-1',
              refinement_name: 'Size',
            },
            label: '6',
            multiSelect: true,
            removeAction: {
              siteState: {
                siteId: '/12554',
                properties: {},
                '@class': 'com.endeca.infront.site.model.SiteState',
                contentPath:
                  '/browse/en/msuk/category/clothing-299047/tops-299061/4/6/_/N-8m7Z7sdZ7seZ8vx',
              },
              navigationState:
                '/en/msuk/category/clothing-299047/tops-299061/4/N-8m7Z7sdZ8vx?Nrpp=40&siteId=%2F12554',
              siteRootPath: '/pages',
              contentPath: '/browse',
            },
            displayName: 'MissSelfridge_uk_size',
            count: 732,
          },
        ],
      },
    }
    it('should return true if the filter is selected', () => {
      const isValueSelected = isFilterSelected(fakeState)
      expect(isValueSelected('size', '4')).toBe(true)
    })
    it('should return false if the filter is NOT selected', () => {
      const isValueSelected = isFilterSelected(fakeState)
      expect(isValueSelected('size', '8')).toBe(false)
    })
  })

  describe('#isRefinementsSelected', () => {
    const state = {
      products: {
        refinements: [
          {
            label: 'Filter',
            refinementOptions: [],
          },
          {
            label: 'Colour',
            refinementOptions: [
              {
                type: 'VALUE',
                label: 'black',
                value: 'black',
              },
              {
                type: 'VALUE',
                label: 'blue',
                value: 'blue',
              },
            ],
          },
        ],
      },
      refinementsV2: {
        seoUrlCache: '',
      },
      routing: {
        location: {
          search: '',
        },
      },
    }

    it('should return false if there are no selected refinements or price changes', () => {
      expect(isRefinementsSelected(state)).toBeFalsy()
    })

    it('should return true if the cached seourl is a price filter', () => {
      expect(
        isRefinementsSelected({
          ...state,
          refinementsV2: {
            seoUrlCache:
              '/en/tsuk/category/clothing-427/dresses-442/N-85cZdgl?Nrpp=24&siteId=%2F12556&Nf=nowPrice%7CBTWN%2B74%2B250',
          },
        })
      ).toBeTruthy()
    })

    it('should return true if the routing location search param is price filter', () => {
      expect(
        isRefinementsSelected({
          ...state,
          routing: {
            location: {
              search: '?Nrpp=24&siteId=%2F12556&?Nf=nowPrice%7CBTWN+58.0+125.0',
            },
          },
        })
      ).toBeTruthy()
    })

    it('should return true is there is a selected flag in one of the refinement options', () => {
      expect(
        isRefinementsSelected({
          ...state,
          products: {
            refinements: [
              {
                label: 'Filter',
                refinementOptions: [],
              },
              {
                label: 'Colour',
                refinementOptions: [
                  {
                    type: 'VALUE',
                    label: 'black',
                    value: 'black',
                  },
                  {
                    type: 'VALUE',
                    label: 'blue',
                    value: 'blue',
                    selectedFlag: true,
                  },
                ],
              },
              {
                label: 'Price',
                refinementOptions: [
                  {
                    type: 'RANGE',
                    label: 0,
                    value: 0,
                  },
                ],
              },
            ],
          },
        })
      ).toBeTruthy()
    })
  })

  describe('#getRefinementOptions', () => {
    it('should return selected and applied refinement options', () => {
      const selectedOptions = 'fake selected options'
      const appliedOptions = 'fake applied options'

      const state = {
        refinements: {
          selectedOptions,
          appliedOptions,
        },
      }
      expect(getRefinementOptions(state)).toEqual({
        selectedOptions,
        appliedOptions,
      })
    })
  })

  describe('getRemoveAllFilters', () => {
    const fakeState = {
      products: {
        sortOptions: {},
        products: [],
        removeAllRefinement: {
          navigationState:
            '/en/tsuk/category/shoes-430/N-8ewZdgl?Nrpp=24&siteId=%2F12556&categoryId=null',
          contentPath: '/browse',
          siteRootPath: '/pages',
        },
      },
    }
    it('should return the seoUrl from products', () => {
      expect(getRemoveAllFilters(fakeState)).toBe(
        '/en/tsuk/category/shoes-430/N-8ewZdgl?Nrpp=24&siteId=%2F12556&categoryId=null'
      )
    })
    it('should return empty string to go back on homepage if not seoUrl', () => {
      const brokenState = {
        sortOptions: {},
        products: [],
      }
      expect(getRemoveAllFilters(brokenState)).toBe('')
    })
  })

  describe('#getPreSelectedSize', () => {
    const mockState = {
      refinements: {
        preSelectedSize: null,
        appliedOptions: {},
      },
    }

    it('should return null if getPreSelectedSize is not found', () => {
      expect(getPreSelectedSize()).toBeNull()
      expect(getPreSelectedSize([])).toBeNull()
      expect(getPreSelectedSize({})).toBeNull()
    })
    it('should return preSelectedSize when found', () => {
      const mockedpreSelectedSize = {
        preSelectedSize: '16',
      }
      expect(
        getPreSelectedSize({
          ...mockState,
          refinements: mockedpreSelectedSize,
        })
      ).toBe(mockedpreSelectedSize.preSelectedSize)
    })
  })
})
