import * as carouselThunks from '../carousel-thunks'
import * as analytics from '../../../../analytics'
import * as carouselActions from '../carousel-actions'

jest.mock('../carousel-actions')
jest.mock('../../../../analytics')

const mockDispatch = jest.fn()

const carouselKey = 'foo'
const pdpCarouselKeys = ['bundles', 'productDetail', 'overlayCarousel']

describe('Carousel thunks', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('forwardCarousel()', () => {
    it('should dispatch the correct carousel navigation action', () => {
      carouselThunks.forwardCarousel(carouselKey)(mockDispatch)
      expect(carouselActions.moveCarouselForward).toHaveBeenCalledTimes(1)
      expect(carouselActions.moveCarouselForward).toHaveBeenCalledWith(
        carouselKey
      )
    })

    pdpCarouselKeys.forEach((pdpCarouselKey) => {
      it(`should dispatch an analytics click event action when on a PDP page [${pdpCarouselKey}]`, () => {
        carouselThunks.forwardCarousel(pdpCarouselKey)(mockDispatch)
        expect(analytics.sendAnalyticsClickEvent).toHaveBeenCalledTimes(1)
        expect(analytics.sendAnalyticsClickEvent).toHaveBeenCalledWith({
          category: 'pdp',
          action: 'next',
          label: 'image carousel',
        })
      })
    })

    it('should not dispatch an analytics action on non-PDP pages', () => {
      carouselThunks.forwardCarousel('Something completely random')(
        mockDispatch
      )
      expect(analytics.sendAnalyticsClickEvent).not.toHaveBeenCalled()
    })
  })

  describe('backCarousel()', () => {
    it('should dispatch the correct carousel navigation action', () => {
      carouselThunks.backCarousel(carouselKey)(mockDispatch)
      expect(carouselActions.moveCarouselBack).toHaveBeenCalledTimes(1)
      expect(carouselActions.moveCarouselBack).toHaveBeenCalledWith(carouselKey)
    })

    pdpCarouselKeys.forEach((pdpCarouselKey) => {
      it(`should dispatch an analytics click event action when on a PDP page [${pdpCarouselKey}]`, () => {
        carouselThunks.backCarousel(pdpCarouselKey)(mockDispatch)
        expect(analytics.sendAnalyticsClickEvent).toHaveBeenCalledTimes(1)
        expect(analytics.sendAnalyticsClickEvent).toHaveBeenCalledWith({
          category: 'pdp',
          action: 'previous',
          label: 'image carousel',
        })
      })
    })

    it('should not dispatch an analytics action on non-PDP pages', () => {
      carouselThunks.backCarousel('Something completely random')(mockDispatch)
      expect(analytics.sendAnalyticsClickEvent).not.toHaveBeenCalled()
    })
  })
})
