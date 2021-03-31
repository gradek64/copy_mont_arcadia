import testComponentHelper from 'test/unit/helpers/test-component'

import { exceedsMaxSocialProofViewCount } from '../../../../lib/social-proof-utils'

jest.mock('../../../../lib/social-proof-utils')

import CarouselImagesOverlay from '../CarouselImagesOverlay'
import SocialProofCarouselOverlay from '../../SocialProofMessaging/SocialProofCarouselOverlay'

const props = {
  isFeatureSocialProofCarouselOverlayEnabled: true,
  isTrending: false,
  carouselIndex: 0,
  carouselOverlayTitle: undefined,
  getTrendingProducts: jest.fn(),
  brandCode: 'ts',
  maximumPDPMessageViewsPerSession: 3,
  isMobile: false,
}

const render = testComponentHelper(CarouselImagesOverlay.WrappedComponent)

describe('<CarouselImagesOverlay />', () => {
  describe('@componentDidMount', () => {
    beforeEach(() => {
      exceedsMaxSocialProofViewCount.mockClear()
    })

    it('should fetch trending products', () => {
      const getTrendingProductsMock = jest.fn()
      const { instance } = render({
        ...props,
        isFeatureEnabled: true,
        getTrendingProducts: getTrendingProductsMock,
      })

      instance.componentDidMount()

      expect(getTrendingProductsMock).toHaveBeenCalledTimes(1)
      expect(getTrendingProductsMock).toHaveBeenCalledWith('PDP')
    })
  })

  describe('@render', () => {
    describe('isFeatureSocialProofCarouselOverlayEnabled is true', () => {
      describe('product is trending', () => {
        it('renders socialProof banner if exceedsMaxSocialProofViewCount is false', () => {
          exceedsMaxSocialProofViewCount.mockReturnValue(false)

          const { wrapper } = render({
            ...props,
            isFeatureSocialProofCarouselOverlayEnabled: true,
            isTrending: true,
            isMobile: false,
          })

          expect(wrapper.find(SocialProofCarouselOverlay).exists()).toBe(true)
          expect(wrapper.find('.Carousel-tapMessage').exists()).toBe(false)
        })

        it('doesnt renders socialProof banner if exceedsMaxSocialProofViewCount is true', () => {
          exceedsMaxSocialProofViewCount.mockReturnValue(true)

          const { wrapper } = render({
            ...props,
            isFeatureSocialProofCarouselOverlayEnabled: true,
            isTrending: true,
          })

          expect(wrapper.find(SocialProofCarouselOverlay).exists()).toBe(false)
          expect(wrapper.find('.Carousel-tapMessage').exists()).toBe(false)
        })

        it('renders the tapMessage if it is mobile and maximumPDPMessageViewsPerSession is undefined', () => {
          const { wrapper } = render({
            ...props,
            isFeatureSocialProofCarouselOverlayEnabled: true,
            isTrending: true,
            isMobile: true,
            maximumPDPMessageViewsPerSession: undefined,
          })

          expect(wrapper.find(SocialProofCarouselOverlay).exists()).toBe(false)
          expect(wrapper.find('.Carousel-tapMessage').exists()).toBe(true)
        })

        it('renders the tapMessage if it is mobile and user has reached maximum views per session', () => {
          exceedsMaxSocialProofViewCount.mockReturnValue(true)

          const { wrapper } = render({
            ...props,
            isFeatureSocialProofCarouselOverlayEnabled: true,
            isTrending: true,
            isMobile: true,
            maximumPDPMessageViewsPerSession: 3,
          })

          expect(wrapper.find(SocialProofCarouselOverlay).exists()).toBe(false)
          expect(wrapper.find('.Carousel-tapMessage').exists()).toBe(true)
        })
      })

      describe('product is not trending', () => {
        it('doesnt renders socialProof banner', () => {
          const { wrapper } = render({
            ...props,
            isFeatureSocialProofCarouselOverlayEnabled: true,
            isTrending: false,
          })

          exceedsMaxSocialProofViewCount.mockReturnValue(false)

          expect(wrapper.find(SocialProofCarouselOverlay).exists()).toBe(false)
          expect(wrapper.find('.Carousel-tapMessage').exists()).toBe(false)
        })

        it('renders the tapMessage banner if it is mobile ', () => {
          const { wrapper } = render({
            ...props,
            isFeatureSocialProofCarouselOverlayEnabled: true,
            isTrending: false,
            isMobile: true,
          })

          exceedsMaxSocialProofViewCount.mockReturnValue(false)

          expect(wrapper.find(SocialProofCarouselOverlay).exists()).toBe(false)
          expect(wrapper.find('.Carousel-tapMessage').exists()).toBe(true)
        })
      })
    })

    describe('isFeatureSocialProofCarouselOverlayEnabled is false', () => {
      describe('isMobile is true', () => {
        it('doesnt render socialProof but it renders tapMassage', () => {
          const { wrapper } = render({
            ...props,
            isFeatureSocialProofCarouselOverlayEnabled: false,
            hasFetchedTrendingProductsRecently: true,
            isTrending: true,
            isMobile: true,
          })

          expect(wrapper.find(SocialProofCarouselOverlay).exists()).toBe(false)
          expect(wrapper.find('.Carousel-tapMessage').exists()).toBe(true)
        })
      })

      describe('isMobile is false', () => {
        it('doesnt render neither socialProof or tapMessage', () => {
          const { wrapper } = render({
            ...props,
            isFeatureSocialProofCarouselOverlayEnabled: false,
            hasFetchedTrendingProductsRecently: true,
            isTrending: true,
            isMobile: false,
          })

          expect(wrapper.find(SocialProofCarouselOverlay).exists()).toBe(false)
          expect(wrapper.find('.Carousel-tapMessage').exists()).toBe(false)
        })
      })
    })
  })
})
