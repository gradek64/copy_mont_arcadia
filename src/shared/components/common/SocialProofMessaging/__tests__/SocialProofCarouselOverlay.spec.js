import testComponentHelper, {
  buildComponentRender,
  mountRender,
} from 'test/unit/helpers/test-component'

jest.mock('../../../../lib/social-proof-utils')

import SocialProofCarouselOverlay from '../SocialProofCarouselOverlay'
import { incrementSocialProofViewCounter } from '../../../../lib/social-proof-utils'

jest.mock('../../../../lib/social-proof-utils')

jest.mock('react-transition-group', () => ({
  Transition: (props) => props.children(),
}))

const props = {
  carouselIndex: 0,
  carouselOverlayTitle: undefined,
  trendingProductClicks: 12,
  brandCode: 'ts',
}

const render = testComponentHelper(SocialProofCarouselOverlay.WrappedComponent)

jest.useFakeTimers()

function expectAnimationToPerform(wrapper) {
  expect(wrapper.find('Transition').prop('in')).toBe(false)

  jest.advanceTimersByTime(3000)
  wrapper.update()

  expect(wrapper.find('Transition').prop('in')).toBe(true)

  jest.advanceTimersByTime(11000)
  wrapper.update()

  expect(wrapper.find('Transition').prop('in')).toBe(false)
}

function expectAnimationToNotPerform(wrapper) {
  expect(wrapper.find('Transition').prop('in')).toBe(false)

  jest.advanceTimersByTime(3000)
  wrapper.update()

  expect(wrapper.find('Transition').prop('in')).toBe(false)

  jest.advanceTimersByTime(11000)
  wrapper.update()

  expect(wrapper.find('Transition').prop('in')).toBe(false)

  jest.runAllTimers()
  wrapper.update()

  expect(wrapper.find('Transition').prop('in')).toBe(false)
}

describe('<SocialProofCarouselOverlay />', () => {
  describe('@componentDidMount', () => {
    afterEach(() => {
      jest.runAllTimers()
      jest.clearAllMocks()
    })

    it('starts the animation', () => {
      const { wrapper, instance } = render({
        ...props,
        isTrending: true,
      })

      instance.componentDidMount()

      expectAnimationToPerform(wrapper)
    })

    describe('maximumPDPMessageViewsPerSession is defined', () => {
      it('calls incrementSocialProofViewCounter', () => {
        const { instance } = render({
          ...props,
          hasFetchedTrendingProductsRecently: true,
          maximumPDPMessageViewsPerSession: 3,
          isTrending: true,
        })

        instance.componentDidMount()

        jest.advanceTimersByTime(3000)

        expect(incrementSocialProofViewCounter).toHaveBeenCalledTimes(1)
        expect(incrementSocialProofViewCounter).toHaveBeenCalledWith('PDP')
      })
    })

    describe('maximumPDPMessageViewsPerSession is not defined', () => {
      it('doesnt call incrementSocialProofViewCounter', () => {
        const { instance } = render({
          ...props,
          hasFetchedTrendingProductsRecently: true,
          maximumPDPMessageViewsPerSession: undefined,
          isTrending: true,
        })

        instance.componentDidMount()

        jest.advanceTimersByTime(3000)

        expect(incrementSocialProofViewCounter).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe('@componentWillUnmount', () => {
    it('clears animations timeout', () => {
      const { wrapper, instance } = render(props)

      global.clearTimeout = jest.fn()
      instance.animationStartTimeOut = 'mockTimeOutRef'

      instance.componentWillUnmount()

      expectAnimationToNotPerform(wrapper)
    })
  })

  describe('@render', () => {
    it('triggers the CSS animation isVisible is true', () => {
      const { wrapper } = render(props)

      wrapper.setState({ isVisible: true })

      expect(wrapper.find('Transition').prop('in')).toBe(true)
    })

    it('doesnt triggers the CSS animation if isTrending is false', () => {
      const { wrapper } = render({
        ...props,
        hasFetchedTrendingProductsRecently: true,
        isTrending: true,
      })

      wrapper.setState({ isVisible: false })

      expect(wrapper.find('Transition').prop('in')).toBe(false)
    })

    describe('when it is mobile', () => {
      it('should render two labels and a close button', () => {
        const renderComponent = buildComponentRender(
          mountRender,
          SocialProofCarouselOverlay.WrappedComponent
        )
        const { wrapper } = renderComponent({
          ...props,
          brandCode: 'ts',
          isMobile: true,
          carouselOverlayTitle: 'Trending Product',
        })
        wrapper.setState({ isVisible: true })

        expect(wrapper.find('Transition').prop('in')).toBe(true)
        expect(
          wrapper
            .render()
            .find('.SocialProofCarouselOverlay-title')
            .text()
        ).toBe('Trending Product')
        expect(
          wrapper
            .render()
            .find('.SocialProofCarouselOverlay-text')
            .first()
            .text()
        ).toBe("Shop it before it's gone")
        expect(
          wrapper.render().find('.SocialProofCarouselOverlay-close').length
        ).toBe(1)
      })
    })

    describe('when it is not mobile', () => {
      it('render three labels and a close button', () => {
        const renderComponent = buildComponentRender(
          mountRender,
          SocialProofCarouselOverlay.WrappedComponent
        )
        const { wrapper } = renderComponent({
          ...props,
          brandCode: 'ts',
          isMobile: false,
          carouselOverlayTitle: 'Trending Product',
          carouselOverlayTextNotMobile: 'This style is selling fast!',
        })

        wrapper.setState({ isVisible: true })

        expect(wrapper.find('Transition').prop('in')).toBe(true)
        expect(
          wrapper
            .render()
            .find('.SocialProofCarouselOverlay-title')
            .text()
        ).toBe('Trending Product')
        expect(
          wrapper
            .render()
            .find('.SocialProofCarouselOverlay-text')
            .text()
        ).toBe("This style is selling fast!Shop it before it's gone")
        expect(
          wrapper.render().find('.SocialProofCarouselOverlay-close').length
        ).toBe(1)
      })
    })

    describe('close button', () => {
      describe('on click', () => {
        it('should hide the trending message', () => {
          const renderComponent = buildComponentRender(
            mountRender,
            SocialProofCarouselOverlay.WrappedComponent
          )
          const { wrapper } = renderComponent(props)
          wrapper.setState({ isVisible: true })

          expect(wrapper.find('Transition').prop('in')).toBe(true)

          // Sorry. This was quite painful trying to simulate a click
          wrapper.instance().hideMessage()
          expect(
            wrapper
              .update()
              .find('Transition')
              .prop('in')
          ).toBe(false)
        })
      })
    })
    describe('carouselOverlayTitle', () => {
      it('renders no carouselOverlayTitle markup if is undefined', () => {
        const renderComponent = buildComponentRender(
          mountRender,
          SocialProofCarouselOverlay.WrappedComponent
        )
        const { wrapper } = renderComponent({
          ...props,
          brandCode: 'ts',
          isMobile: false,
          carouselOverlayTitle: undefined,
        })

        wrapper.setState({ isVisible: true })
        expect(
          wrapper.render().find('.SocialProofCarouselOverlay-title').length
        ).toBe(0)
      })
      it('renders carouselOverlayTitle markup if exists', () => {
        const renderComponent = buildComponentRender(
          mountRender,
          SocialProofCarouselOverlay.WrappedComponent
        )
        const { wrapper } = renderComponent({
          ...props,
          brandCode: 'ts',
          isMobile: false,
          carouselOverlayTitle: 'the title',
        })

        wrapper.setState({ isVisible: true })
        expect(
          wrapper.render().find('.SocialProofCarouselOverlay-title').length
        ).toBe(1)
        expect(
          wrapper
            .render()
            .find('.SocialProofCarouselOverlay-title')
            .text()
        ).toBe('the title')
      })
    })
    describe('carouselOverlayTextNotMobile', () => {
      it('renders no carouselOverlayTextNotMobile markup if is undefined', () => {
        const renderComponent = buildComponentRender(
          mountRender,
          SocialProofCarouselOverlay.WrappedComponent
        )
        const { wrapper } = renderComponent({
          ...props,
          brandCode: 'ts',
          isMobile: false,
          carouselOverlayTextNotMobile: undefined,
        })

        wrapper.setState({ isVisible: true })
        expect(
          wrapper.render().find('.SocialProofCarouselOverlay-textNotMobile')
            .length
        ).toBe(0)
      })
      it('renders carouselOverlayTextNotMobile markup if exists', () => {
        const renderComponent = buildComponentRender(
          mountRender,
          SocialProofCarouselOverlay.WrappedComponent
        )
        const { wrapper } = renderComponent({
          ...props,
          brandCode: 'ts',
          isMobile: false,
          carouselOverlayTextNotMobile: 'the text',
        })

        wrapper.setState({ isVisible: true })
        expect(
          wrapper.render().find('.SocialProofCarouselOverlay-textNotMobile')
            .length
        ).toBe(1)
        expect(
          wrapper
            .render()
            .find('.SocialProofCarouselOverlay-textNotMobile')
            .text()
        ).toBe('the text')
      })
    })
  })
})
