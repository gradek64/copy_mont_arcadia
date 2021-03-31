import { getPageTitle, getFixedCmsPageName } from '../page-view-utils'

describe('page view utils', () => {
  describe('getPageTitle()', () => {
    it('should return the document title with the last pipe-separated value stripped off', () => {
      window.document.title = 'Foo | Bar | Baz'
      expect(getPageTitle()).toBe('Foo | Bar')
      window.document.title = null
    })

    it('should return the unmodified document title when there is no pipe-separated value', () => {
      window.document.title = 'Foo Bar Baz'
      expect(getPageTitle()).toBe('Foo Bar Baz')
      window.document.title = null
    })
  })

  describe('getFixedCmsPageName()', () => {
    it(`should strip 'mob - ' prefix from the document title as returned by getPageTitle()`, () => {
      window.document.title = 'mob - Foo | Bar | Baz'
      expect(getFixedCmsPageName()).toBe('Foo | Bar')

      window.document.title = 'mob - Foo Bar Baz'
      expect(getFixedCmsPageName()).toBe('Foo Bar Baz')

      window.document.title = 'Foo'
      expect(getFixedCmsPageName()).toBe('Foo')

      window.document.title = null
    })
  })
})
