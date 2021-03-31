import { isSearchBarOpen } from '../productSearchSelectors'

describe('ProductSearchSelectors', () => {
  describe('isSearchBarOpen()', () => {
    it('should return true if state.productSearch.open is true', () => {
      const state = { productsSearch: { open: true } }
      expect(isSearchBarOpen(state)).toBe(true)
    })

    it('should return false if state.productSearch.open is false', () => {
      const state = { productsSearch: { open: false } }
      expect(isSearchBarOpen(state)).toBe(false)
    })

    it('should return undefined and not throw an error if the state is empty', () => {
      expect(() => isSearchBarOpen({})).not.toThrow()
      expect(isSearchBarOpen({})).toBeUndefined()
    })
  })
})
