import { getCarousel, getCarouselSelectedIndex } from '../carouselSelectors'

describe('Carousel selectors', () => {
  describe('getCarousel', () => {
    it('should get the specified carousel by name', () => {
      const carouselName = 'testCarousel'
      const carousel = {
        current: 3,
      }

      const state = {
        carousel: {
          [carouselName]: carousel,
        },
      }

      const carouselFromState = getCarousel(state, carouselName)

      expect(carouselFromState).toBe(carousel)
    })

    it('should default to an empty object', () => {
      const carousel = getCarousel({}, 'someKey')

      expect(carousel).toEqual({})
    })
  })

  describe('getCarouselSelectedIndex', () => {
    it('should get the current index from the specified carousel', () => {
      const carouselName = 'testCarousel'
      const current = 3
      const carousel = {
        current,
      }

      const state = {
        carousel: {
          [carouselName]: carousel,
        },
      }

      expect(getCarouselSelectedIndex(state, carouselName)).toBe(current)
    })
  })
})
