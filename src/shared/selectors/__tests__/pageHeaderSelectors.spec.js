import deepFreeze from 'deep-freeze'
import { isHeaderSticky } from '../pageHeaderSelectors'

describe('Page header selectors', () => {
  const state = deepFreeze({
    pageHeader: {
      sticky: true,
    },
  })

  describe('getMetaDescription', () => {
    it('should return false when value is not in state', () => {
      expect(isHeaderSticky({})).toBe(false)
    })
    it('should return value when it is present in state', () => {
      expect(isHeaderSticky(state)).toBe(true)
    })
  })
})
