import * as actions from '../carousel-actions'

const key = 'miniProductCarousel0'

describe('Carousel Actions', () => {
  describe('initCarousel()', () => {
    it('should return the correct action', () => {
      expect(actions.initCarousel(key, 123, 3)).toMatchSnapshot()
    })
  })

  describe('setCarouselIndex()', () => {
    it('should return the correct action', () => {
      expect(actions.setCarouselIndex(key, 'foo')).toMatchSnapshot()
    })
  })

  describe('setCurrentItemReference()', () => {
    it('should return the correct action', () => {
      expect(actions.setCurrentItemReference(key, 'fooo')).toMatchSnapshot()
    })
  })

  describe('moveCarouselForward()', () => {
    it('should return the correct action', () => {
      expect(actions.moveCarouselForward(key)).toMatchSnapshot()
    })
  })

  describe('moveCarouselBack()', () => {
    it('should return the correct action', () => {
      expect(actions.moveCarouselBack(key)).toMatchSnapshot()
    })
  })

  describe('carouselZoom()', () => {
    it('should return the correct action', () => {
      expect(actions.carouselZoom(key, 123)).toMatchSnapshot()
    })
  })

  describe('carouselPan()', () => {
    it('should return the correct action', () => {
      expect(actions.carouselPan(key, 123, 456)).toMatchSnapshot()
    })
  })
})
