import testComponentHelper from 'test/unit/helpers/test-component'
import MarketingSlideUp from '../MarketingSlideUp'
import Espot from '../../../containers/Espot/Espot'
import espotsDesktop from '../../../../constants/espotsDesktop'
import Drawer from '../../Drawer/Drawer'

jest.mock('../../../../../client/lib/cookie/utils', () => ({
  setItem: jest.fn(),
}))

describe('<MarketingSlideUp/>', () => {
  const requiredProps = {
    dismissMarketingSlideUp: jest.fn(),
    getMarketingSlideUpEspot: jest.fn(),
    fireMarketingSlideUpClickEvent: jest.fn(),
    showMarketingSlideUp: jest.fn(),
    hideMarketingSlideUp: jest.fn(),
    getMarketingSliderDismissedCookie: jest.fn(),
    isMarketingSlideUpActive: false,
    numberOfClickEventsFired: 0,
    isFeatureMarketingSliderEnabled: true,
    isLoggedIn: false,
    areSideDrawersOpen: false,
    isRestrictedPath: false,
    marketingSliderDismissed: false,
  }
  const renderComponent = testComponentHelper(MarketingSlideUp.WrappedComponent)
  const MARKETING_SLIDE_UP_ESPOT =
    espotsDesktop.marketing_slide_up.MARKETING_SLIDE_UP_ESPOT
  beforeEach(() => {
    jest.clearAllMocks()
  })
  describe('@renders', () => {
    describe('in default state', () => {
      it('should render an unopen drawer with no MarketingSlideUp in default state', () => {
        const { wrapper } = renderComponent(requiredProps)
        expect(wrapper.find(Drawer).prop('isOpen')).toBe(false)
        expect(wrapper.find('.MarketingSlideUp').length).toBe(0)
      })
    })
    describe('when numberOfClickEventsFired is 3 clicks', () => {
      it('should not contain MarketingSlideUp if isFeatureMarketingSliderEnabled is set to false', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          numberOfClickEventsFired: 3,
          isFeatureMarketingSliderEnabled: false,
        })
        expect(wrapper.find('.MarketingSlideUp').length).toBe(0)
      })
      it('should not contain MarketingSlideUp if user is logged in', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          numberOfClickEventsFired: 3,
          isLoggedIn: true,
        })
        expect(wrapper.find('.MarketingSlideUp').length).toBe(0)
      })
      it('should not contain MarketingSlideUp if user is on a restricted journey', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          numberOfClickEventsFired: 3,
          isRestrictedPath: true,
        })
        expect(wrapper.find('.MarketingSlideUp').length).toBe(0)
      })
      it('should not contain MarketingSlideUp if marketing slider has been dismissed', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          numberOfClickEventsFired: 3,
          marketingSliderDismissed: true,
        })
        expect(wrapper.find('.MarketingSlideUp').length).toBe(0)
      })
      describe('is not logged in, not in checkout and slider has not been dismissed', () => {
        describe('when side drawers are not open', () => {
          const { wrapper } = renderComponent({
            ...requiredProps,
            numberOfClickEventsFired: 3,
            isLoggedIn: false,
            isRestrictedPath: false,
            areSideDrawersOpen: false,
            isMarketingSlideUpActive: true,
          })
          it('should contain MarketingSlideUp', () => {
            expect(wrapper.find('.MarketingSlideUp').length).toBe(1)
          })
          it('should contain MarketingSlideUp-closeButton', () => {
            expect(wrapper.find('.MarketingSlideUp-closeButton').length).toBe(1)
          })
          it('should contain an espot', () => {
            expect(wrapper.find(Espot).length).toBe(1)
            expect(wrapper.find(Espot).prop('identifier')).toBe(
              MARKETING_SLIDE_UP_ESPOT
            )
          })
        })
        describe('when side drawers are open', () => {
          const { wrapper } = renderComponent({
            ...requiredProps,
            marketingSliderDismissed: false,
            isLoggedIn: false,
            isRestrictedPath: false,
            areSideDrawersOpen: true,
            numberOfClickEventsFired: 3,
            isMarketingSlideUpActive: true,
          })
          it('should not contain MarketingSlideUp', () => {
            expect(wrapper.find('.MarketingSlideUp').length).toBe(0)
          })
          it('should contain MarketingSlideUp when the drawer is then closed', () => {
            wrapper.setProps({ areSideDrawersOpen: false })
            expect(wrapper.find('.MarketingSlideUp').length).toBe(1)
          })
        })
      })
    })
    describe('when numberOfClickEventsFired is less than 3', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        numberOfClickEventsFired: 2,
      })
      it('should not contain MarketingSlideUp', () => {
        expect(wrapper.find('.MarketingSlideUp').length).toBe(0)
      })
    })
  })

  describe('when clicking', () => {
    const removeEventListenerMock = jest.fn()
    global.document.removeEventListener = removeEventListenerMock
    it('should fireMarketingSlideUpClickEvent when handleMarketingClickEvent is called and clicks less than 3', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        numberOfClickEventsFired: 2,
      })
      const instance = wrapper.instance()
      instance.handleMarketingClickEvent()
      expect(requiredProps.fireMarketingSlideUpClickEvent).toBeCalled()
    })
    it('should show the marketing slider and set the cookie if the user clicks 3 times', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        numberOfClickEventsFired: 2,
      })
      const instance = wrapper.instance()
      instance.handleMarketingClickEvent()
      expect(requiredProps.showMarketingSlideUp).toBeCalled()
      expect(requiredProps.getMarketingSliderDismissedCookie).toBeCalled()
    })
    it('should remove then event listener if numberOfClickEventsFired is called again after 3 times or more', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        numberOfClickEventsFired: 3,
      })
      const instance = wrapper.instance()
      instance.handleMarketingClickEvent()
      expect(removeEventListenerMock).toHaveBeenCalledTimes(1)
    })
  })
  describe('when component mounts', () => {
    it('should add an event listener', () => {
      const addEventListenerMock = jest.fn()
      global.document.addEventListener = addEventListenerMock
      const { wrapper } = renderComponent({
        ...requiredProps,
      })
      wrapper.instance().componentDidMount()
      expect(addEventListenerMock).toHaveBeenCalledTimes(1)
    })
    it('should add call its espot content', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
      })
      wrapper.instance().componentDidMount()
      expect(requiredProps.getMarketingSlideUpEspot).toHaveBeenCalledTimes(1)
    })
  })
  describe('when marketing slider is visible', () => {
    const { wrapper } = renderComponent({
      ...requiredProps,
      numberOfClickEventsFired: 3,
      isMarketingSlideUpActive: true,
    })
    it('should fire dismissMarketingSlideUp when MarketingSlideUp button is click', () => {
      wrapper.find('.MarketingSlideUp-closeButton').simulate('click')
      expect(requiredProps.hideMarketingSlideUp).toBeCalled()
    })
  })
})
