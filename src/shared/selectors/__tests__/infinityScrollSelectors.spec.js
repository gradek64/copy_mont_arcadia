import {
  getHiddenPages,
  getHiddenPagesAbove,
  getNumberOfPagesHiddenAtEnd,
  getCurrentPageFromInfinityScroll,
} from '../infinityScrollSelectors'

const hiddenPages = {
  hiddenPagesAbove: [{ height: 'mock' }],
  numberOfPagesHiddenAtEnd: 1343,
}

const state = {
  infinityScroll: { currentPage: 6, hiddenPages },
}

describe('infinityScrollSelectors', () => {
  describe('getHiddenPages', () => {
    it('returns the hiddenPages object', () => {
      expect(getHiddenPages(state)).toEqual(hiddenPages)
    })
  })

  describe('getHiddenPagesAbove', () => {
    it('returns hiddenPagesAbove', () => {
      expect(getHiddenPagesAbove(state)).toEqual([{ height: 'mock' }])
    })
  })

  describe('getNumberOfPagesHiddenAtEnd', () => {
    it('returns numberOfPagesHiddenAtEnd', () => {
      expect(getNumberOfPagesHiddenAtEnd(state)).toEqual(1343)
    })
  })

  describe('getCurrentPageFromInfinityScroll', () => {
    it('returns currentPage if it exists', () => {
      expect(getCurrentPageFromInfinityScroll(state)).toEqual(6)
    })
    it('returns 1 if currentPage does not exist', () => {
      const state = {}
      expect(getCurrentPageFromInfinityScroll(state)).toEqual(1)
    })
  })
})
