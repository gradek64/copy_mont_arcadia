import { wcsPaginate } from '../products-helper'

describe('Product Helper', () => {
  describe('wcsPaginate', () => {
    it('should append the pagination params to the url if currentPage exists', () => {
      const seoUrl = 'url/category/?currentPage=5'
      const expectedSeoUrl = wcsPaginate(seoUrl)
      expect(expectedSeoUrl).toBe('url/category/?currentPage=5&Nrpp=24&No=96')
    })

    it('should not append the pagination params to the url if currentPage does not exist', () => {
      const seoUrl = 'url/category/'
      const expectedSeoUrl = wcsPaginate(seoUrl)
      expect(expectedSeoUrl).toBe('url/category/')
    })
  })
})
