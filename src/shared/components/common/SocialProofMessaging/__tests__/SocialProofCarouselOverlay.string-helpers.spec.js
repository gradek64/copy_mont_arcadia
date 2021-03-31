import {
  getCarouselOverlayTitle,
  getCarouselOverlayTextNotMobile,
  getCarouselOverlayTextMobileAndDesktop,
} from '../SocialProofCarouselOverlay.string-helpers'

describe('SocialProofCarouselOverlay strings helpers', () => {
  const lMockFunction = jest.fn((text) => text)
  describe('@getCarouselOverlayTitle', () => {
    it('returns the correct string for ts', () => {
      expect(getCarouselOverlayTitle('ts')).toBe('Trending Product')
    })
    it('returns the correct string for tm', () => {
      expect(getCarouselOverlayTitle('tm')).toBe('Selling Fast!')
    })
    it('returns an undefined string if a brandcode is not in the object', () => {
      expect(getCarouselOverlayTitle('ss')).toBe(undefined)
    })
  })

  describe('@getCarouselOverlayTextNotMobile', () => {
    it('returns the correct string for ts', () => {
      expect(getCarouselOverlayTextNotMobile('ts')).toBe(
        'This style is selling fast!'
      )
    })

    it('returns undefined otherwise', () => {
      expect(getCarouselOverlayTextNotMobile('ss')).toBe(undefined)
    })
  })

  describe('@getCarouselOverlayTextMobileAndDesktop', () => {
    const trendingProductClicks = 12

    it('returns the correct string for tm', () => {
      expect(
        getCarouselOverlayTextMobileAndDesktop(
          lMockFunction,
          'tm',
          trendingProductClicks
        )
      ).toEqual(['This item has been added to bag ', ' times today'])
      expect(lMockFunction).toHaveBeenCalledWith(
        ['This item has been added to bag ', ' times today'],
        trendingProductClicks
      )
    })

    it('returns the correct string for wl', () => {
      expect(
        getCarouselOverlayTextMobileAndDesktop(
          lMockFunction,
          'wl',
          trendingProductClicks
        )
      ).toEqual(['This item has been added to bag ', ' times in the last hour'])
      expect(lMockFunction).toHaveBeenCalledWith(
        ['This item has been added to bag ', ' times in the last hour'],
        trendingProductClicks
      )
    })

    it('returns the correct string for ms', () => {
      expect(
        getCarouselOverlayTextMobileAndDesktop(
          lMockFunction,
          'ms',
          trendingProductClicks
        )
      ).toEqual(['This item has been added to bag ', ' times'])

      expect(lMockFunction).toHaveBeenCalledWith(
        ['This item has been added to bag ', ' times'],
        trendingProductClicks
      )
    })

    it('returns the correct string for ev', () => {
      expect(
        getCarouselOverlayTextMobileAndDesktop(
          lMockFunction,
          'ev',
          trendingProductClicks
        )
      ).toEqual(['', ' people have added this to their bag in the last hour'])

      expect(lMockFunction).toHaveBeenCalledWith(
        ['', ' people have added this to their bag in the last hour'],
        trendingProductClicks
      )
    })

    it('returns a default string otherwise', () => {
      expect(
        getCarouselOverlayTextMobileAndDesktop(
          lMockFunction,
          'ts',
          trendingProductClicks
        )
      ).toEqual([`Shop it before it's gone`])
    })
  })
})
