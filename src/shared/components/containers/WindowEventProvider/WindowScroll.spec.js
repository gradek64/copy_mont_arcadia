import React from 'react'
import { WindowScroll } from './WindowScroll'
import { shallow } from 'enzyme'
import testComponentHelper from 'test/unit/helpers/test-component'

const context = {
  removeListener: jest.fn(),
  addListener: jest.fn(),
}
const disableLifecycleMethods = false
const onScroll = jest.fn()
const onScrollPast = jest.fn()
const onCustomScroll = jest.fn()
const onReachedPageBottom = jest.fn()

const fakeWindow = {
  document: {
    body: {
      offsetHeight: 200,
    },
  },
  innerHeight: 100,
}

jest.mock('lodash.throttle', () => (a) => a)

describe('<WindowScroll />', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('register and remove listeners', () => {
    it('register listener on componentDidMount', () => {
      shallow(
        <WindowScroll>
          <div />
        </WindowScroll>,
        {
          context,
          disableLifecycleMethods,
        }
      )

      expect(context.addListener).toHaveBeenCalledTimes(1)
      expect(context.addListener).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function)
      )
    })

    it('removes listener on componentWillUnmount', () => {
      shallow(
        <WindowScroll>
          <div />
        </WindowScroll>,
        {
          context,
          disableLifecycleMethods,
        }
      ).unmount()

      expect(context.removeListener).toHaveBeenCalledTimes(1)
    })

    it('should call onScroll on scroll', () => {
      shallow(
        <WindowScroll onScroll={onScroll}>
          <div />
        </WindowScroll>,
        {
          context,
          disableLifecycleMethods,
        }
      )

      const [, handler] = context.addListener.mock.calls[0]

      handler({ random: 'event' })
      expect(onScroll).toHaveBeenCalledTimes(1)
      expect(onScroll).toHaveBeenCalledWith({ random: 'event' })
    })
  })

  describe('onScrollPast', () => {
    let handler

    beforeEach(() => {
      shallow(
        <WindowScroll scrollPastThreshold={0.5} onScrollPast={onScrollPast}>
          <div />
        </WindowScroll>,
        {
          context,
          disableLifecycleMethods,
        }
      )
      handler = context.addListener.mock.calls[0][1]
    })

    it('should not call at the top of the page', () => {
      handler({ random: 'event' }, { ...fakeWindow, scrollY: 0 })
      expect(onScrollPast).toHaveBeenCalledTimes(0)
    })

    it('should call when threshold is passed', () => {
      handler({ random: 'event' }, { ...fakeWindow, scrollY: 51 })
      expect(onScrollPast).toHaveBeenCalledTimes(1)
      expect(onScrollPast).toHaveBeenCalledWith(true, { random: 'event' })
    })

    it('should call not call when still scrolling', () => {
      handler({ random: 'event' }, { ...fakeWindow, scrollY: 51 })

      onScrollPast.mockReset()
      handler({ random: 'event' }, { ...fakeWindow, scrollY: 52 })
      expect(onScrollPast).toHaveBeenCalledTimes(0)
    })

    it('should call when scrolled back pass threshold', () => {
      handler({ random: 'event' }, { ...fakeWindow, scrollY: 51 })

      onScrollPast.mockReset()
      handler({ random: 'event' }, { ...fakeWindow, scrollY: 40 })
      expect(onScrollPast).toHaveBeenCalledTimes(1)
      expect(onScrollPast).toHaveBeenCalledWith(false, { random: 'event' })
    })
  })

  describe('onScrollPase using pixels', () => {
    let handler

    beforeEach(() => {
      shallow(
        <WindowScroll scrollPastThreshold={40} onScrollPast={onScrollPast}>
          <div />
        </WindowScroll>,
        {
          context,
          disableLifecycleMethods,
        }
      )
      handler = context.addListener.mock.calls[0][1]
    })

    it('should call when threshold passed is a integer (e.g pixel)', () => {
      handler({ random: 'event' }, { ...fakeWindow, scrollY: 41 })
      expect(onScrollPast).toHaveBeenCalledTimes(1)
      expect(onScrollPast).toHaveBeenCalledWith(true, { random: 'event' })
    })
  })

  describe('onCustomScroll', () => {
    let handler

    beforeEach(() => {
      shallow(
        <WindowScroll onCustomScroll={onCustomScroll}>
          <div />
        </WindowScroll>,
        {
          context,
          disableLifecycleMethods,
        }
      )
      handler = context.addListener.mock.calls[0][1]
    })

    it('should call onCustomScroll on scroll if it exists', () => {
      handler({ random: 'event' }, { ...fakeWindow, scrollY: 0 })

      onCustomScroll.mockReset()
      handler({ random: 'event' }, { ...fakeWindow, scrollY: 40 })
      expect(onCustomScroll).toHaveBeenCalledTimes(1)
      expect(onCustomScroll).toHaveBeenCalledWith(
        { random: 'event' },
        { ...fakeWindow, scrollY: 40 }
      )
    })
  })

  describe('onReachedPageBottom', () => {
    let handler

    beforeEach(() => {
      shallow(
        <WindowScroll onReachedPageBottom={onReachedPageBottom}>
          <div />
        </WindowScroll>,
        {
          context,
          disableLifecycleMethods,
        }
      )
      handler = context.addListener.mock.calls[0][1]
    })

    it('should not call at the top of the page', () => {
      handler({ random: 'event' }, { ...fakeWindow, scrollY: 0 })
      expect(onReachedPageBottom).toHaveBeenCalledTimes(0)
    })

    it('should call once at the bottom of the page', () => {
      handler({ random: 'eventA' }, { ...fakeWindow, scrollY: 100 })

      handler({ random: 'eventB' }, { ...fakeWindow, scrollY: 101 })
      expect(onReachedPageBottom).toHaveBeenCalledTimes(1)
      expect(onReachedPageBottom).toHaveBeenCalledWith(true, {
        random: 'eventA',
      })
    })

    it('should call once when scrolled up from the bottom of the page', () => {
      handler({ random: 'eventA' }, { ...fakeWindow, scrollY: 100 })

      onReachedPageBottom.mockReset()
      handler({ random: 'eventB' }, { ...fakeWindow, scrollY: 99 })

      handler({ random: 'eventC' }, { ...fakeWindow, scrollY: 98 })
      expect(onReachedPageBottom).toHaveBeenCalledTimes(1)
      expect(onReachedPageBottom).toHaveBeenCalledWith(false, {
        random: 'eventB',
      })
    })
  })

  describe('onReachedPageBottom with buffer', () => {
    let handler

    beforeEach(() => {
      shallow(
        <WindowScroll
          onReachedPageBottom={onReachedPageBottom}
          pageBottomBuffer={20}
        >
          <div />
        </WindowScroll>,
        {
          context,
          disableLifecycleMethods,
        }
      )
      handler = context.addListener.mock.calls[0][1]
    })
    it('should not call at the top of the page', () => {
      handler({ random: 'event' }, { ...fakeWindow, scrollY: 0 })
      expect(onReachedPageBottom).toHaveBeenCalledTimes(0)
    })
    it('should call once at the bottom of the page', () => {
      handler({ random: 'eventA' }, { ...fakeWindow, scrollY: 80 })
      handler({ random: 'eventB' }, { ...fakeWindow, scrollY: 81 })
      expect(onReachedPageBottom).toHaveBeenCalledTimes(1)
      expect(onReachedPageBottom).toHaveBeenCalledWith(true, {
        random: 'eventA',
      })
    })
  })

  describe('@lifecycle', () => {
    const initialProps = {
      children: <div />,
      onScroll: jest.fn(),
      onCustomScroll: jest.fn(),
      onReachedPageBottom: jest.fn(),
      scrollPastThreshold: 100,
      pageBottomBuffer: 50,
      scrollDelay: 500,
    }
    const renderComponent = testComponentHelper(WindowScroll, { context })

    describe('constructor', () => {
      it('instantiates', () => {
        const instance = new WindowScroll({
          scrollDelay: 200,
        })
        expect(instance.props.scrollDelay).toBe(200)
        expect(instance.scrollHandler).toBe(instance.handleScroll)
      })
    })

    describe('componentDidMount', () => {
      it('should bind `scrollHandler` event listener', () => {
        const { instance } = renderComponent(initialProps)
        const addListenerMock = jest.spyOn(context, 'addListener')

        expect(addListenerMock).toHaveBeenCalledTimes(0)
        instance.componentDidMount()
        expect(addListenerMock).toHaveBeenCalledTimes(1)
        expect(addListenerMock).toHaveBeenCalledWith(
          'scroll',
          instance.scrollHandler
        )
      })
    })

    describe('componentWillUnmount', () => {
      it('should unbind `scrollHandler` event listener', () => {
        const { instance } = renderComponent(initialProps)
        const removeListenerMock = jest.spyOn(context, 'removeListener')

        expect(removeListenerMock).toHaveBeenCalledTimes(0)
        instance.componentWillUnmount()
        expect(removeListenerMock).toHaveBeenCalledTimes(1)
        expect(removeListenerMock).toHaveBeenCalledWith(
          'scroll',
          instance.scrollHandler
        )
      })
    })
  })

  describe('@instance methods', () => {
    const initialProps = {
      children: <div />,
    }
    const renderComponent = testComponentHelper(WindowScroll, { context })
    const mockEvent = { event: 'mockEvent' }
    const mockWindow = {
      ...fakeWindow,
      scrollY: 50,
      pageYOffset: 50,
    }

    describe('handleScroll', () => {
      it('should call default methods if no custom callback', () => {
        const { instance } = renderComponent({
          ...initialProps,
          onScroll: jest.fn(),
        })
        const checkScrollPassedThresholdMock = jest.spyOn(
          instance,
          'checkScrollPassedThreshold'
        )
        const checkScrollReachedPageBottomMock = jest.spyOn(
          instance,
          'checkScrollReachedPageBottom'
        )

        instance.handleScroll(mockEvent, mockWindow)
        expect(instance.props.onScroll).toHaveBeenCalledTimes(1)
        expect(checkScrollPassedThresholdMock).toHaveBeenCalledTimes(1)
        expect(checkScrollPassedThresholdMock).toHaveBeenCalledWith(
          mockEvent,
          mockWindow
        )
        expect(checkScrollReachedPageBottomMock).toHaveBeenCalledTimes(1)
        expect(checkScrollReachedPageBottomMock).toHaveBeenCalledWith(
          mockEvent,
          mockWindow
        )
      })

      it('should call `onCustomScroll` if passed as prop', () => {
        const { instance } = renderComponent({
          ...initialProps,
          onScroll: jest.fn(),
          onCustomScroll: jest.fn(),
        })
        const mockEvent = { event: 'mockEvent' }
        const checkScrollPassedThresholdMock = jest.spyOn(
          instance,
          'checkScrollPassedThreshold'
        )
        const checkScrollReachedPageBottomMock = jest.spyOn(
          instance,
          'checkScrollReachedPageBottom'
        )

        instance.handleScroll(mockEvent, mockWindow)
        expect(instance.props.onCustomScroll).toHaveBeenCalledTimes(1)
        expect(instance.props.onCustomScroll).toHaveBeenCalledWith(
          mockEvent,
          mockWindow
        )
        expect(instance.props.onScroll).not.toHaveBeenCalled()
        expect(checkScrollPassedThresholdMock).not.toHaveBeenCalled()
        expect(checkScrollReachedPageBottomMock).not.toHaveBeenCalled()
      })
    })

    describe('checkScrollPassedThreshold', () => {
      it('should not call `onScrollPast` callback if threshold < 0', () => {
        const { instance } = renderComponent({
          ...initialProps,
          onScrollPast: jest.fn(),
          scrollPastThreshold: -1,
        })

        instance.checkScrollPassedThreshold(mockEvent, mockWindow)
        expect(instance.props.onScrollPast).not.toHaveBeenCalled()
      })
      it('should not call `onScrollPast` callback if threshold not passed (>= scrollY)', () => {
        const { instance } = renderComponent({
          ...initialProps,
          onScrollPast: jest.fn(),
          scrollPastThreshold: 50,
        })

        instance.checkScrollPassedThreshold(mockEvent, mockWindow)
        expect(instance.props.onScrollPast).not.toHaveBeenCalled()
      })
      it('should call `onScrollPast` callback if threshold passed (< scrollY)', () => {
        const { instance } = renderComponent({
          ...initialProps,
          onScrollPast: jest.fn(),
          scrollPastThreshold: 49,
        })

        instance.checkScrollPassedThreshold(mockEvent, mockWindow)
        expect(instance.props.onScrollPast).toHaveBeenCalledTimes(1)
        expect(instance.props.onScrollPast).toHaveBeenCalledWith(
          true,
          mockEvent
        )
      })
    })

    describe('checkScrollReachedPageBottom', () => {
      it('should not call `onReachedPageBottom` callback if page bottom not passed', () => {
        const { instance } = renderComponent({
          ...initialProps,
          onReachedPageBottom: jest.fn(),
          pageBottomBuffer: 49,
        })

        instance.checkScrollReachedPageBottom(mockEvent, mockWindow)
        expect(instance.props.onReachedPageBottom).not.toHaveBeenCalled()
      })

      it('should call `onReachedPageBottom` callback if page bottom passed', () => {
        const { instance } = renderComponent({
          ...initialProps,
          onReachedPageBottom: jest.fn(),
          pageBottomBuffer: 50,
        })

        instance.checkScrollReachedPageBottom(mockEvent, mockWindow)
        expect(instance.props.onReachedPageBottom).toHaveBeenCalledTimes(1)
        expect(instance.props.onReachedPageBottom).toHaveBeenCalledWith(
          true,
          mockEvent
        )
      })
    })
  })
})
