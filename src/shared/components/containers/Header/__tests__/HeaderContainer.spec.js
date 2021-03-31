import { shallow } from 'enzyme'
import React from 'react'
import testComponentHelper from 'test/unit/helpers/test-component'
import HeaderContainer from '../HeaderContainer'
import HeaderBig from '../HeaderBig'
import configureStore from 'redux-mock-store'
import { isMinViewPort } from '../../../../selectors/viewportSelectors'
import { shouldDisplayMobileHeaderIfSticky } from '../../../../selectors/pageHeaderSelectors'
import { WindowScroll } from '../../WindowEventProvider/WindowScroll'

jest.mock('../../../../selectors/viewportSelectors', () => ({
  isMinViewPort: jest.fn().mockReturnValue(() => false),
  isMobile: jest.fn().mockReturnValue(() => false),
}))
jest.mock('../../../../selectors/pageHeaderSelectors', () => ({
  shouldDisplayMobileHeaderIfSticky: jest.fn().mockReturnValue(false),
}))

const brandName = 'topshop'

const setSticky = jest.fn()

beforeEach(() => jest.clearAllMocks())

describe('<HeaderContainer />', () => {
  const initProps = {
    location: {
      pathname: '/product/',
    },
    isMinViewPort,
    isMobile: true,
    brandName: 'topshop',
    forceMobileHeaderIfSticky: false,
    sticky: false,
    setSticky,
    isStickyMobile: false,
  }
  const isResponsive = {
    featureResponsive: true,
    featureBigHeader: true,
  }

  describe('Connected component', () => {
    it('should receive the correct props', () => {
      const featureBigHeader = true
      const featureResponsive = true
      const initialState = {
        viewport: {
          media: 'mobile',
        },
        features: {
          status: {
            FEATURE_HEADER_BIG: featureBigHeader,
            FEATURE_RESPONSIVE: featureResponsive,
          },
        },
        pageHeader: {
          sticky: true,
        },
        config: {
          brandName,
        },
      }
      expect(shouldDisplayMobileHeaderIfSticky).toHaveBeenCalledTimes(0)
      const container = shallow(
        <HeaderContainer location={{}} store={configureStore()(initialState)} />
      )
      expect(shouldDisplayMobileHeaderIfSticky).toHaveBeenCalledTimes(1)
      expect(container).toBeTruthy()
      expect(container.prop('isMobile')).toBeTruthy()
      expect(container.prop('sticky')).toBe(true)
      expect(container.prop('brandName')).toBe(brandName)
      expect(container.prop('featureBigHeader')).toBe(featureBigHeader)
      expect(container.prop('featureResponsive')).toBe(featureResponsive)
      expect(container.prop('forceMobileHeaderIfSticky')).toBe(false)
      expect(container.prop('isMinViewPort')).toEqual(expect.any(Function))
    })
  })

  const renderComponent = testComponentHelper(HeaderContainer.WrappedComponent)
  describe('@renders', () => {
    describe('@mobile', () => {
      beforeEach(() => jest.clearAllMocks())

      it('in default state', () => {
        expect(renderComponent(initProps).getTree()).toMatchSnapshot()
      })
      it('does not render HeaderBig', () => {
        const { wrapper } = renderComponent(initProps)
        expect(wrapper.find(HeaderBig)).toHaveLength(0)
      })
      it('does not forceDisplay header by default', () => {
        const { wrapper } = renderComponent(initProps)
        expect(wrapper.find('Header').prop('forceDisplay')).toBe(false)
      })
      it('does not forceDisplay if sticky=true', () => {
        const { wrapper } = renderComponent({ ...initProps, sticky: true })
        expect(wrapper.find('Header').prop('forceDisplay')).toBe(false)
      })
      it('does not forceDisplay if forceMobileHeaderIfSticky=true', () => {
        const { wrapper } = renderComponent({
          ...initProps,
          forceMobileHeaderIfSticky: true,
        })
        expect(wrapper.find('Header').prop('forceDisplay')).toBe(false)
      })
      it('sets forceDisplay if forceMobileHeaderIfSticky=true', () => {
        const { wrapper } = renderComponent({
          ...initProps,
          sticky: true,
          forceMobileHeaderIfSticky: true,
        })
        expect(wrapper.find('Header').prop('forceDisplay')).toBe(true)
      })
      it('in login page', () => {
        expect(
          renderComponent({
            ...initProps,
            location: {
              pathname: '/login/',
            },
          }).getTree()
        ).toMatchSnapshot()
      })
      it('in summary page', () => {
        expect(
          renderComponent({
            ...initProps,
            location: {
              pathname: '/summary/',
            },
          }).getTree()
        ).toMatchSnapshot()
      })
      it('in checkout page', () => {
        expect(
          renderComponent({
            ...initProps,
            location: {
              pathname: '/checkout/',
            },
          }).getTree()
        ).toMatchSnapshot()
      })
      it('in checkout page and featureResponsive is enabled', () => {
        expect(
          renderComponent({
            ...initProps,
            ...isResponsive,
            location: {
              pathname: '/checkout/',
            },
          }).getTree()
        ).toMatchSnapshot()
      })
      it('in product page and featureResponsive is enabled', () => {
        expect(
          renderComponent({
            ...initProps,
            ...isResponsive,
          }).getTree()
        ).toMatchSnapshot()
      })
    })
    describe('@desktop', () => {
      it('in default state', () => {
        expect(
          renderComponent({ ...initProps, isMobile: false }).getTree()
        ).toMatchSnapshot()
      })
      it('does not render HeaderBig by default', () => {
        const { wrapper } = renderComponent({
          ...initProps,
          isMobile: false,
        })
        expect(wrapper.find(HeaderBig)).toHaveLength(0)
      })
      it('renders HeaderBig when responsive', () => {
        const { wrapper } = renderComponent({
          ...initProps,
          ...isResponsive,
          isMobile: false,
        })
        expect(wrapper.find(HeaderBig)).toHaveLength(1)
      })
      it('renders HeaderBig when sticky', () => {
        const { wrapper } = renderComponent({
          ...initProps,
          ...isResponsive,
          sticky: true,
          isMobile: false,
        })
        expect(wrapper.find(HeaderBig)).toHaveLength(1)
      })
      it('renders HeaderBig when forceMobileHeaderIfSticky=true', () => {
        const { wrapper } = renderComponent({
          ...initProps,
          ...isResponsive,
          forceMobileHeaderIfSticky: true,
          isMobile: false,
        })
        expect(wrapper.find(HeaderBig)).toHaveLength(1)
      })
      it('does not render HeaderBig when forceMobileHeaderIfSticky=true and sticky=true', () => {
        const { wrapper } = renderComponent({
          ...initProps,
          ...isResponsive,
          forceMobileHeaderIfSticky: true,
          sticky: true,
          isMobile: false,
        })
        expect(wrapper.find(HeaderBig)).toHaveLength(0)
      })
      it('in checkout page', () => {
        expect(
          renderComponent({
            ...initProps,
            location: {
              pathname: '/checkout/',
            },
            isMobile: false,
          }).getTree()
        ).toMatchSnapshot()
      })
      it('in product page and featureResponsive is enabled', () => {
        expect(
          renderComponent({
            ...initProps,
            ...isResponsive,
            isMobile: false,
          }).getTree()
        ).toMatchSnapshot()
      })
      it('in checkout page and featureResponsive is enabled', () => {
        expect(
          renderComponent({
            ...initProps,
            ...isResponsive,
            location: {
              pathname: '/checkout/',
            },
            isMobile: false,
          }).getTree()
        ).toMatchSnapshot()
      })
      it('wraps with WindowScroll when isMobile=false', () => {
        const { wrapper } = renderComponent({
          ...initProps,
          ...isResponsive,
          isFeatureStickyHeaderEnabled: true,
          isMobile: false,
        })
        expect(wrapper.find(WindowScroll)).toHaveLength(1)
      })
      it('does not wrap with WindowScroll when isMobile=true', () => {
        const { wrapper } = renderComponent({
          ...initProps,
          ...isResponsive,
          isFeatureStickyHeaderEnabled: true,
          isMobile: true,
        })
        expect(wrapper.find(WindowScroll).exists()).toEqual(false)
      })
    })
  })

  describe('@lifecycle', () => {
    describe('UNSAFE_componentWillReceiveProps', () => {
      it('calls setSticky(false) if sticky and new location is checkout', () => {
        const { instance, wrapper } = renderComponent({
          ...initProps,
          isInCheckout: false,
          sticky: true,
        })
        wrapper.update()
        instance.UNSAFE_componentWillReceiveProps({
          ...initProps,
          isInCheckout: true,
        })
        wrapper.update()
        expect(setSticky).toHaveBeenCalledTimes(1)
        expect(setSticky).toHaveBeenLastCalledWith(false)
      })
      it('calls setSticky(false) if new layout is mobile and current layout is not', () => {
        const { instance, wrapper } = renderComponent({
          ...initProps,
          isMobile: false,
        })
        wrapper.update()
        instance.UNSAFE_componentWillReceiveProps({
          ...initProps,
          isMobile: true,
        })
        wrapper.update()
        expect(setSticky).toHaveBeenCalledTimes(1)
        expect(setSticky).toHaveBeenLastCalledWith(false)
      })
      it('does not call setSticky if not sticky and new location is checkout and new layout is not mobile', () => {
        const { instance, wrapper } = renderComponent({
          ...initProps,
          isInCheckout: false,
          sticky: false,
          isMobile: true,
        })
        wrapper.update()
        instance.UNSAFE_componentWillReceiveProps({
          ...initProps,
          isInCheckout: true,
          isMobile: false,
        })
        wrapper.update()
        expect(setSticky).not.toHaveBeenCalled()
      })
    })
  })

  describe('@events', () => {
    beforeEach(() => {
      setSticky.mockReset()
      isMinViewPort.mockReset()
    })
    it('calls setSticky action on first scroll movement around y position', () => {
      const { wrapper } = renderComponent({
        ...initProps,
        isFeatureStickyHeaderEnabled: true,
      })
      const scrollPoint = 38
      wrapper.instance().ref = { current: { offsetTop: 0 } }
      expect(setSticky).toHaveBeenCalledTimes(0)
      wrapper.instance().onUpdateScrollPosition(scrollPoint)
      expect(setSticky).toHaveBeenCalledTimes(0)
      wrapper.instance().onUpdateScrollPosition(scrollPoint + 1)
      expect(setSticky).toHaveBeenLastCalledWith(true)
      wrapper.setProps({ sticky: true })
      setSticky.mockReset()
      wrapper.instance().onUpdateScrollPosition(scrollPoint + 2)
      expect(setSticky).toHaveBeenCalledTimes(0)
      wrapper.instance().onUpdateScrollPosition(scrollPoint + 1)
      expect(setSticky).toHaveBeenCalledTimes(0)
      wrapper.instance().onUpdateScrollPosition(scrollPoint)
      expect(setSticky).toHaveBeenLastCalledWith(false)
      wrapper.setProps({ sticky: false })
      setSticky.mockReset()
      wrapper.instance().onUpdateScrollPosition(scrollPoint - 1)
      expect(setSticky).toHaveBeenCalledTimes(0)
    })
    it('does not call setSticky action if isInCheckout is true', () => {
      const { wrapper } = renderComponent({
        ...initProps,
        isFeatureStickyHeaderEnabled: true,
        isInCheckout: true,
      })
      const scrollPoint = 38
      wrapper.instance().ref = { current: { offsetTop: 0 } }
      wrapper.instance().onUpdateScrollPosition(scrollPoint + 50)
      expect(setSticky).toHaveBeenCalledTimes(0)
    })
    it('does not call setSticky action if ref is not defined', () => {
      const { wrapper } = renderComponent({
        ...initProps,
        isFeatureStickyHeaderEnabled: true,
      })
      const scrollPoint = 38
      wrapper.instance().ref = null
      wrapper.instance().onUpdateScrollPosition(scrollPoint + 50)
      expect(setSticky).toHaveBeenCalledTimes(0)
    })
    it('dorothy perkins invokes sticky at breakpoint for >= laptop viewport', () => {
      const { wrapper } = renderComponent({
        ...initProps,
        isFeatureStickyHeaderEnabled: true,
        brandName: 'dorothyperkins',
      })
      isMinViewPort.mockImplementation(() => true)
      const scrollPoint = 87
      wrapper.instance().ref = { current: { offsetTop: 0 } }
      expect(setSticky).toHaveBeenCalledTimes(0)
      wrapper.instance().onUpdateScrollPosition(scrollPoint)
      expect(setSticky).toHaveBeenCalledTimes(0)
      wrapper.instance().onUpdateScrollPosition(scrollPoint + 1)
      expect(setSticky).toHaveBeenLastCalledWith(true)
      expect(isMinViewPort).toHaveBeenCalledTimes(2)
    })
    it('dorothy perkins invokes sticky at breakpoint for < laptop viewport', () => {
      const { wrapper } = renderComponent({
        ...initProps,
        isFeatureStickyHeaderEnabled: true,
        brandName: 'dorothyperkins',
      })
      isMinViewPort.mockImplementation(() => false)
      const scrollPoint = 42
      wrapper.instance().ref = { current: { offsetTop: 0 } }
      expect(setSticky).toHaveBeenCalledTimes(0)
      wrapper.instance().onUpdateScrollPosition(scrollPoint)
      expect(setSticky).toHaveBeenCalledTimes(0)
      wrapper.instance().onUpdateScrollPosition(scrollPoint + 1)
      expect(setSticky).toHaveBeenLastCalledWith(true)
      expect(isMinViewPort).toHaveBeenCalledTimes(2)
    })
  })

  describe('onScroll', () => {
    it('should call onUpdateScrollPosition on window scroll', () => {
      const mockEvent = { event: 'mockEvent' }
      const mockWindow = {
        scrollY: 10,
        pageYOffset: 10,
      }
      const { instance } = renderComponent(initProps)
      const onUpdateScrollPositionMock = jest.spyOn(
        instance,
        'onUpdateScrollPosition'
      )

      expect(onUpdateScrollPositionMock).toHaveBeenCalledTimes(0)
      instance.onScroll(mockEvent, mockWindow)
      expect(onUpdateScrollPositionMock).toHaveBeenCalledTimes(1)
      expect(onUpdateScrollPositionMock).toHaveBeenCalledWith(10)
    })
  })
})
