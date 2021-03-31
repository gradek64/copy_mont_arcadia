import Products from '../Products'

jest.mock('../../../Mapper')
jest.mock('../../../transforms/product')

import transform from '../../../transforms/product'
import { productListPageSize } from '../../../constants/plp'

const responseBody = { body: 'wcs' }
const transformedBody = { body: 'monty' }
const resultBody = { body: 'monty' }

const storeConfig = {
  catalogId: 98765,
  langId: -1,
  siteId: 12345,
  brandName: 'Jimmy',
  storeCode: 'bruk',
}

const queryToWcsStoreConfig = {
  storeId: storeConfig.siteId,
  langId: storeConfig.langId,
  catalogId: storeConfig.catalogId,
}

const categoryQueryFromMonty = {
  category: '24680,13579',
  currentPage: 1,
}

const noParentCategoryQueryFromMonty = {
  category: '12345',
  currentPage: 2,
}

const categoryQueryToWcs = {
  ...queryToWcsStoreConfig,
  sort_field: 'Relevance',
  beginIndex: 1,
  categoryId: '13579',
  parent_categoryId: '24680',
  pageSize: productListPageSize,
}

const noParentCategoryQueryToWcs = {
  ...queryToWcsStoreConfig,
  sort_field: 'Relevance',
  beginIndex: 25,
  categoryId: '12345',
  pageSize: productListPageSize,
}

const searchQueryFromMonty = {
  q: 'red',
  currentPage: 2,
  sort: 'Newnesss',
  pageSize: productListPageSize,
}

const searchQueryToWcs = {
  ...queryToWcsStoreConfig,
  sort_field: 'Newnesss',
  beginIndex: 25,
  searchTerm: 'red',
  pageSize: productListPageSize,
}

const endecaSeoValueQueryFromMonty = {
  endecaSeoValue: 'N-2f83Z1xjf',
  currentPage: 1,
  pageSize: productListPageSize,
}

const endecaSeoValueQueryToWcs = {
  ...queryToWcsStoreConfig,
  beginIndex: 1,
  sort_field: 'Relevance',
  endecaSeoValue: 'N-2f83Z1xjf',
  pageSize: productListPageSize,
}

const refinements =
  '[{"key":"colour","value":"black,red"},{"key":"fit","value":"regular"}]'

const refinementsForWcs = {
  noOfRefinements: 2,
  refinements: 'colour{1}~[black|red]^fit{1}~[regular]',
}

describe('Products', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  describe('mapEndpoint', () => {
    it('sets destinationEndpoint to "/webapp/wcs/stores/servlet/CatalogNavigationSearchResultCmd"', () => {
      const products = new Products()
      expect(products.destinationEndpoint).toBeUndefined()
      products.mapEndpoint()
      expect(products.destinationEndpoint).toBe(
        '/webapp/wcs/stores/servlet/CatalogNavigationSearchResultCmd'
      )
    })
  })

  describe('mapRequestParameters', () => {
    it('maps the request parameters to query for an endecaSeoValue', () => {
      const products = new Products()
      products.storeConfig = storeConfig
      products.query = endecaSeoValueQueryFromMonty
      products.mapRequestParameters()
      expect(products.query).toEqual(endecaSeoValueQueryToWcs)
    })
    it('maps the request parameters to query for a category request', () => {
      const products = new Products()
      products.storeConfig = storeConfig
      products.query = categoryQueryFromMonty
      products.mapRequestParameters()
      expect(products.query).toEqual(categoryQueryToWcs)
    })

    it('maps the request parameters to query for a category request with no parent category', () => {
      const products = new Products()
      products.storeConfig = storeConfig
      products.query = noParentCategoryQueryFromMonty
      products.mapRequestParameters()
      expect(products.query).toEqual(noParentCategoryQueryToWcs)
    })

    it('maps the request parameters to query for a search request', () => {
      const products = new Products()
      products.storeConfig = storeConfig
      products.query = searchQueryFromMonty
      products.mapRequestParameters()
      expect(products.query).toEqual(searchQueryToWcs)
    })
    it('maps the request parameters to query for a category request with refinements', () => {
      const products = new Products()
      products.storeConfig = storeConfig
      products.query = { ...categoryQueryFromMonty, refinements }
      products.mapRequestParameters()
      expect(products.query).toEqual({
        ...categoryQueryToWcs,
        ...refinementsForWcs,
      })
    })
    it('maps the request parameters to query for a search request with refinements', () => {
      const products = new Products()
      products.storeConfig = storeConfig
      products.query = { ...searchQueryFromMonty, refinements }
      products.mapRequestParameters()
      expect(products.query).toEqual({
        ...searchQueryToWcs,
        ...refinementsForWcs,
      })
    })
    it("doesn't overwrite the searchTerm parameter if it's already set", () => {
      const products = new Products()
      products.storeConfig = storeConfig
      products.query = {
        ...noParentCategoryQueryFromMonty,
        searchTerm: '1234',
        q: '5678',
      }
      products.mapRequestParameters()
      expect(products.query).toEqual({
        ...noParentCategoryQueryToWcs,
        searchTerm: '1234',
      })
    })

    it('omits the correct data from the query', () => {
      const products = new Products()
      products.storeConfig = storeConfig
      products.query = {
        ...noParentCategoryQueryFromMonty,
        category: '21312313',
        currentPage: '34',
        refinements: 'some refinement',
        sort: 'Newness',
        q: 'Jeans',
      }
      products.mapRequestParameters()
      expect(products.query.category).toBeUndefined()
      expect(products.query.currentPage).toBeUndefined()
      expect(products.query.refinements).toBeUndefined()
      expect(products.query.sort).toBeUndefined()
      expect(products.query.q).toBeUndefined()
    })
  })
  describe('mapResponseBody', () => {
    it('maps the response body calling the transform for the product', () => {
      const products = new Products()
      products.storeConfig = storeConfig
      products.destinationHostname = 'hostname'

      transform.mockReturnValue(transformedBody)

      expect(transform).not.toHaveBeenCalled()

      expect(products.mapResponseBody(responseBody)).toEqual(resultBody)

      expect(transform).toHaveBeenCalledTimes(1)
      expect(transform).toHaveBeenCalledWith(
        responseBody,
        storeConfig.brandName,
        storeConfig.storeCode,
        'hostname'
      )
    })
  })
})
