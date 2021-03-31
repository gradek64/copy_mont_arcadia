import getFilterLabel from './get-filter-label'

describe('getFilterLabel', () => {
  describe("with 'brand' key", () => {
    it('returns formatted brandName', () => {
      expect(getFilterLabel('brand', 'topman')).toBe('Topman stores')
      expect(getFilterLabel('brand', 'dorothyperkins')).toBe(
        'Dorothy Perkins stores'
      )
      expect(getFilterLabel('brand', 'missselfridge')).toBe(
        'Miss Selfridge stores'
      )
    })
  })
})
