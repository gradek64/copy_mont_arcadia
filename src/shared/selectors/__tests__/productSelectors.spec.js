import {
  getSelectedSKU,
  getSelectedSKUs,
  getCurrentProduct,
  getCurrentProductId,
  getProductDetail,
  getSizeGuideType,
  getProducts,
  getProductById,
  getPdpBreadcrumbs,
  getPlpBreadcrumbs,
  getShouldIndex,
  getProductsSearchResultsTotal,
  getSelectedProductSwatches,
  getCurrentSortOption,
  getProductDetailSelectedQuantity,
  getProductsLocation,
  getProductsLength,
  isCountryExcluded,
} from '../productSelectors'

import { clone } from 'ramda'

describe('Product Selectors', () => {
  const mockState = {
    forms: {
      bundlesAddToBag: {
        29750936: {
          fields: {
            size: {
              value: '602017001154355',
            },
          },
        },
        29752415: {
          fields: {
            size: {
              value: '602017001154368',
            },
          },
        },
      },
    },
    products: {
      products: [{ productId: 123 }, { productId: 321 }],
      location: { pathname: '/en/tsuk/category/shoes-430' },
    },
  }

  describe('#getProductsSearchResultsTotal', () => {
    it('should return total products', () => {
      const result = getProductsSearchResultsTotal({
        products: { totalProducts: 10 },
      })
      expect(result).toBe(10)
    })
    it('should return default total products when not available', () => {
      expect(getProductsSearchResultsTotal({ products: {} })).toBe(0)
    })
  })

  describe('#getShouldIndex', () => {
    it('should return true', () => {
      expect(getShouldIndex({ products: { shouldIndex: true } })).toBe(true)
    })
    it('should return false', () => {
      expect(getShouldIndex({ products: { shouldIndex: false } })).toBe(false)
    })
  })

  describe('#getSelectedSKU', () => {
    it('should get SKU from `bundlesAddToBag` form state', () => {
      expect(getSelectedSKU(29750936, mockState)).toBe('602017001154355')
    })

    it('should return undefined if can‘t find product', () => {
      expect(getSelectedSKU(29750122, mockState)).toBeUndefined()
    })
  })

  describe('#getSelectedSKUs', () => {
    it('should get SKUs from `bundlesAddToBag` form state', () => {
      expect(getSelectedSKUs(mockState)).toEqual({
        29750936: '602017001154355',
        29752415: '602017001154368',
      })
    })

    it('should filter out empty values', () => {
      const mockState = {
        forms: {
          bundlesAddToBag: {
            29750936: {
              fields: {
                size: {
                  value: '602017001154355',
                },
              },
            },
            29752415: {
              fields: {
                size: {
                  value: '',
                },
              },
            },
          },
        },
      }
      expect(getSelectedSKUs(mockState)).toEqual({
        29750936: '602017001154355',
      })
    })

    it('should return an empty object if nothing in state', () => {
      const mockState = {
        forms: {
          bundlesAddToBag: {},
        },
      }
      expect(getSelectedSKUs(mockState)).toEqual({})
    })
  })

  describe('#getCurrentProduct', () => {
    it('should return undefined if currentProduct is not found', () => {
      expect(getCurrentProduct()).toBeUndefined()
      expect(getCurrentProduct([])).toBeUndefined()
      expect(getCurrentProduct({})).toBeUndefined()
    })
    it('should return currentProduct when found', () => {
      const mockedCurrentProduct = {
        name: 'Red Flower Ruffle Mini Skirt',
      }
      expect(
        getCurrentProduct({
          ...mockState,
          currentProduct: mockedCurrentProduct,
        })
      ).toBe(mockedCurrentProduct)
    })
  })

  describe('#getPdpBreadcrumbs', () => {
    it('should return empty array when currentProduct is not found', () => {
      expect(getPdpBreadcrumbs()).toEqual([])
    })

    it('should return empty array currentProduct is found but breadcrumb is not found', () => {
      expect(getPdpBreadcrumbs({ currentProduct: {} })).toEqual([])
    })

    it('should return breadcrumb array when currentProduct is found but breadcrumb is found', () => {
      const label = 'Home'
      const breadcrumbs = [{ label }]
      const result = getPdpBreadcrumbs({
        currentProduct: {
          breadcrumbs,
        },
      })
      expect(result).toEqual(breadcrumbs)
      expect(result[0].label).toEqual(label)
    })
  })

  describe('#getPlpBreadcrumbs', () => {
    it('should return PLP breadcrumbs when they exist', () => {
      const mockBreadcrumbs = 'fake breadcrumbs'
      expect(
        getPlpBreadcrumbs({ products: { breadcrumbs: mockBreadcrumbs } })
      ).toBe(mockBreadcrumbs)
    })

    it('should return empty array when there are no PLP products', () => {
      expect(getPlpBreadcrumbs({ foo: 'bar' })).toEqual([])
    })

    it('should return empty array when there are no PLP product breadcrumbs', () => {
      expect(getPlpBreadcrumbs({ products: { foo: 'bar' } })).toEqual([])
    })
  })

  describe('#getCurrentProductId', () => {
    it('should return empty string if there is no productId', () => {
      expect(getCurrentProductId()).toBe('')
      expect(getCurrentProductId([])).toBe('')
      expect(getCurrentProductId({})).toBe('')
    })
    it('should return currentProduct when found', () => {
      expect(
        getCurrentProductId({
          currentProduct: {
            name: 'Red Flower Ruffle Mini Skirt',
            productId: 1007,
          },
        })
      ).toBe('1007')
    })
  })

  describe('#getProductDetail', () => {
    it('should return undefined if productDetail is not found', () => {
      expect(getProductDetail()).toBeUndefined()
      expect(getProductDetail([])).toBeUndefined()
      expect(getProductDetail({})).toBeUndefined()
    })
    it('should return productDetail when found', () => {
      const mockedProductDetail = {
        activeItem: { sku: '007' },
      }
      expect(
        getProductDetail({
          ...mockState,
          productDetail: mockedProductDetail,
        })
      ).toBe(mockedProductDetail)
    })
  })

  describe('#getProductDetailSelectedQuantity', () => {
    it('should get the selected quantity from state', () => {
      const selectedQuantity = 4
      const state = {
        productDetail: {
          selectedQuantity,
        },
      }

      expect(getProductDetailSelectedQuantity(state)).toBe(4)
    })

    it('should default to 1', () => {
      expect(getProductDetailSelectedQuantity({})).toBe(1)
    })
  })

  describe('#getSizeGuideType', () => {
    it('should return undefined if sizeGuideType is not found', () => {
      expect(getSizeGuideType()).toBeUndefined()
    })
    it('should return sizeGuideType when found', () => {
      const mockedSizeGuideType = 'Dresses'
      expect(
        getSizeGuideType({
          ...mockState,
          productDetail: {
            sizeGuideType: mockedSizeGuideType,
          },
        })
      ).toBe(mockedSizeGuideType)
    })
  })

  describe('#getProducts', () => {
    it('should return the list of all products', () => {
      expect(getProducts(mockState)).toEqual(mockState.products.products)
    })

    it('should return an empty array when no products can be found', () => {
      expect(getProducts({})).toEqual([])
    })
  })

  describe('#getProductsLength', () => {
    it('should return the list of all products', () => {
      expect(getProductsLength(mockState)).toEqual(2)
    })
  })

  describe('#getProductById', () => {
    it('should return a product with matching productId', () => {
      const product = mockState.products.products[0]

      expect(getProductById(product.productId, mockState)).toEqual(product)
    })

    it('should return undefined where no product was found with the given productId', () => {
      expect(getProductById('non-existing-id', mockState)).toEqual(undefined)
    })
  })

  describe('getSelectedProductSwatches', () => {
    it('should return selected product swatches', () => {
      const selectedProductSwatches = { 111: 222, 333: 444 }
      expect(
        getSelectedProductSwatches({
          products: { selectedProductSwatches },
        })
      ).toEqual(selectedProductSwatches)
    })
  })

  describe('getCurrentOptions', () => {
    const fakeState = {
      products: {
        sortOptions: [
          {
            label: 'Best Match',
            value: 'Relevance',
            navigationState:
              '/en/tsuk/category/shoes-430/heels-458/N-8fnZdgl?Nf=nowPrice%7CBTWN+10.0+124.0&Nrpp=24&siteId=%2F12556',
          },
          {
            label: 'Newest',
            value: 'Newness',
            navigationState:
              '/en/tsuk/category/shoes-430/heels-458/N-8fnZdgl?Nf=nowPrice%7CBTWN+10.0+124.0&Nrpp=24&Ns=product.freshnessRank%7C0&siteId=%2F12556',
          },
          {
            label: 'Price - Low To High',
            value: 'Price Ascending',
            navigationState:
              '/en/tsuk/category/shoes-430/heels-458/N-8fnZdgl?Nf=nowPrice%7CBTWN+10.0+124.0&Nrpp=24&Ns=promoPrice%7C0&siteId=%2F12556',
          },
          {
            label: 'Price - High To Low',
            value: 'Price Descending',
            navigationState:
              '/en/tsuk/category/shoes-430/heels-458/N-8fnZdgl?Nf=nowPrice%7CBTWN+10.0+124.0&Nrpp=24&Ns=promoPrice%7C1&siteId=%2F12556',
          },
        ],
      },
      sorting: {
        currentSortOption: 'Price Ascending',
      },
    }
    it('should return the default Price Ascending', () => {
      const expectedRes = {
        label: 'Price - Low To High',
        value: 'Price Ascending',
        navigationState:
          '/en/tsuk/category/shoes-430/heels-458/N-8fnZdgl?Nf=nowPrice%7CBTWN+10.0+124.0&Nrpp=24&Ns=promoPrice%7C0&siteId=%2F12556',
      }
      expect(getCurrentSortOption(fakeState)).toEqual(expectedRes)
    })
    it('should return Relevance', () => {
      const newFakeState = clone(fakeState)
      newFakeState.sorting.currentSortOption = null
      expect(getCurrentSortOption(newFakeState)).toBe(
        newFakeState.products.sortOptions[0]
      )
    })
  })

  describe('getProductsLocation', () => {
    describe('when location exists', () => {
      it('should return the products location', () => {
        expect(getProductsLocation(mockState)).toEqual({
          pathname: '/en/tsuk/category/shoes-430',
        })
      })
    })

    describe('when location does not exist', () => {
      it('should return an empty object', () => {
        expect(getProductsLocation({ ...mockState, products: {} })).toEqual({})
      })
    })
  })

  describe('isCountryExcluded', () => {
    const baseState = {
      geoIP: {
        geoISO: 'GB',
      },
    }
    const product = {
      attributes: {
        countryExclusion: '',
      },
    }

    it('should return false if countryExclusion is not set', () => {
      expect(isCountryExcluded(baseState, product)).toBe(false)
    })

    it("should return false if countryExclusion has inclusive list which includes user's origin country", () => {
      const product = {
        attributes: {
          countryExclusion: '+GB,US,FR',
        },
      }
      expect(isCountryExcluded(baseState, product)).toBe(false)
    })

    it("should return false if countryExclusion has exclusive list which doesn't exclude user's origin country", () => {
      const product = {
        attributes: {
          countryExclusion: 'US,FR',
        },
      }
      expect(isCountryExcluded(baseState, product)).toBe(false)
    })

    it("should return true if countryExclusion has inclusive list which doesn't include user's origin country", () => {
      const product = {
        attributes: {
          countryExclusion: '+US,FR',
        },
      }
      expect(isCountryExcluded(baseState, product)).toBe(true)
    })

    it("should return true if countryExclusion has exclusive list which includes user's origin country", () => {
      const product = {
        attributes: {
          countryExclusion: 'GB,US,FR',
        },
      }
      expect(isCountryExcluded(baseState, product)).toBe(true)
    })

    it('should return false if no geoISO is set i.e. Akamai is not passing Geo IP data such as a non-prod environment', () => {
      const state = {
        ...baseState,
        geoIP: {
          geoISO: '',
        },
      }
      const product = {
        attributes: {
          countryExclusion: 'GB,US,FR',
        },
      }
      expect(isCountryExcluded(state, product)).toBe(false)
    })
  })
})
