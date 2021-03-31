import {
  addCategoryToQuery,
  getRefinmentValue,
  addRefinementsToQuery,
} from './index'

const query = { something: 123 }

const refinements =
  '[{"key":"colour","value":"black,red"},{"key":"fit","value":"regular"}]'

const refinementsForWcs = {
  noOfRefinements: 2,
  refinements: 'colour{1}~[black|red]^fit{1}~[regular]',
}

describe('products utils', () => {
  describe('addCategoryToQuery', () => {
    it('returns a query object with the categoryId and parent_categoryId added if the category parameter is comma separated', () => {
      const category = '456,789'
      expect(addCategoryToQuery(query, category)).toEqual({
        something: 123,
        categoryId: '789',
        parent_categoryId: '456',
      })
    })
    it('returns a query object with an empty categoryId property if no category is provided', () => {
      expect(addCategoryToQuery(query)).toEqual({
        something: 123,
        categoryId: '',
      })
    })

    it('returns a query object with only a categoryId property if the category is not comma separated', () => {
      const category = '789'
      expect(addCategoryToQuery(query, category)).toEqual({
        something: 123,
        categoryId: '789',
      })
    })
  })
  describe('getRefinmentValue', () => {
    it('returns 2 if the value is "Rating" or "Price"', () => {
      expect(getRefinmentValue('Rating')).toBe(2)
      expect(getRefinmentValue('Price')).toBe(2)
      expect(getRefinmentValue('rating')).toBe(2)
      expect(getRefinmentValue('price')).toBe(2)
    })
    it('returns 1 if the value is not "Rating" or "Price"', () => {
      expect(getRefinmentValue('Dog')).toBe(1)
      expect(getRefinmentValue('Style')).toBe(1)
      expect(getRefinmentValue()).toBe(1)
    })
  })
  describe('addRefinementsToQuery', () => {
    it('returns a query object with the Refinements added', () => {
      expect(addRefinementsToQuery(query, refinements)).toEqual({
        ...query,
        ...refinementsForWcs,
      })
    })
    it('returns a query object with empty Refinements properties added if no Refinements is provided', () => {
      expect(addRefinementsToQuery(query)).toEqual({
        ...query,
        noOfRefinements: 0,
        refinements: '',
      })
    })
  })
})
