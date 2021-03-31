import testComponentHelper from 'test/unit/helpers/test-component'
import EnhancedMessage from '../EnhancedMessage'
import { CSSTransition } from 'react-transition-group'

describe('<EnhancedMessage />', () => {
  const initialProps = {
    onTransitionComplete: jest.fn(),
  }
  const renderComponent = testComponentHelper(EnhancedMessage)

  describe('@renders', () => {
    it('renders in default state', () => {
      const component = renderComponent(initialProps)
      expect(component.getTree()).toMatchSnapshot()
    })
    it('renders with optional header', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        header: 'this is a header',
        message: 'this is a message',
      })
      expect(wrapper.find('.EnhancedMessage-header')).toHaveLength(1)
    })
    it('renders if message is a string', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        message: 'this is a message',
      })
      expect(wrapper.find('.EnhancedMessage-message')).toHaveLength(1)
    })
    it('renders if array of messages', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        message: ['this is a message', 'this is another message'],
      })
      expect(wrapper.find('.EnhancedMessage-message')).toHaveLength(2)
    })
    it('renders if children passed (default)', () => {
      const props = {
        ...initialProps,
        message: 'hello World',
        children: '<div>Children</div>',
      }
      const component = renderComponent(props)
      expect(component.getTree()).toMatchSnapshot()
    })
    it('renders if children passed ("bottom")', () => {
      const props = {
        ...initialProps,
        message: 'hello World',
        children: '<div>Children</div>',
        renderChildrenOn: 'bottom',
      }
      const component = renderComponent(props)
      expect(component.getTree()).toMatchSnapshot()
    })
    it('does not render if no message or children', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find('.EnhancedMessage').exists()).toEqual(false)
    })
    it('renders with error class if isError is true', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        message: 'this is an error message',
        isError: true,
      })
      expect(wrapper.find('.EnhancedMessage.is-error')).toHaveLength(1)
    })
    it('renders with animation capability if duration provided', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        message: 'this is a message',
        duration: 1000,
      })
      expect(wrapper.find(CSSTransition)).toHaveLength(1)
      expect(wrapper.find('.EnhancedMessage')).toHaveLength(1)
    })
    it('renders without animation capability if duration not provided', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        message: 'this is a message',
      })
      expect(wrapper.find(CSSTransition).exists()).toEqual(false)
      expect(wrapper.find('.EnhancedMessage')).toHaveLength(1)
    })
  })

  describe('@lifecycle', () => {
    beforeEach(() => jest.resetAllMocks())

    describe('constructor', () => {
      it('sets initial state for message visibility', () => {
        const { instance } = renderComponent(initialProps)
        expect(instance.state).toEqual({ isVisible: false })
      })
    })

    describe('componentDidMount', () => {
      it('sets the message visibility state to true', () => {
        const { instance } = renderComponent(initialProps)
        const setDisplayStateSpy = jest.spyOn(instance, 'setDisplayState')
        instance.componentDidMount()
        expect(setDisplayStateSpy).toHaveBeenCalledTimes(1)
        expect(setDisplayStateSpy).toHaveBeenCalledWith(true)
      })
    })

    describe('UNSAFE_componentWillReceiveProps', () => {
      it('calls `setDisplayState` with `nextProps.isVisible` if changed', () => {
        const { instance } = renderComponent({
          ...initialProps,
          isVisible: false,
        })
        const setDisplayStateSpy = jest.spyOn(instance, 'setDisplayState')
        instance.state = { isVisible: false }
        instance.UNSAFE_componentWillReceiveProps({ isVisible: true })
        expect(setDisplayStateSpy).toHaveBeenCalled()
        expect(setDisplayStateSpy).toHaveBeenCalledWith(true)
      })
    })

    describe('componentWillUnmount', () => {
      it('calls instance method to trigger callback if showOnce is true', () => {
        const { instance } = renderComponent({
          ...initialProps,
          showOnce: true,
        })
        const setHandleOnExitedSpy = jest.spyOn(instance, 'handleOnExited')
        instance.componentWillUnmount()
        expect(setHandleOnExitedSpy).toHaveBeenCalledTimes(1)
      })
    })

    describe('shouldComponentUpdate', () => {
      it('returns true if state changes', () => {
        const { instance } = renderComponent(initialProps)
        instance.state = { isVisible: false }
        expect(instance.shouldComponentUpdate({}, { isVisible: true })).toEqual(
          true
        )
      })

      it('returns false if state does not change', () => {
        const { instance } = renderComponent({
          ...initialProps,
        })
        instance.state = { isVisible: false }
        expect(
          instance.shouldComponentUpdate({}, { isVisible: false })
        ).toEqual(false)
      })
    })
  })

  describe('instance methods', () => {
    describe('setDisplayState', () => {
      it('updates the message visibility state', () => {
        const { instance } = renderComponent(initialProps)
        const isVisible = true
        const setStateSpy = jest.spyOn(instance, 'setState')
        instance.setDisplayState(isVisible)
        expect(setStateSpy).toHaveBeenCalledTimes(1)
        expect(setStateSpy).toHaveBeenCalledWith({ isVisible })
      })
    })

    describe('handleOnEntered', () => {
      it('sets the message visibility state to false after `enter` transition if transient message', () => {
        const { instance } = renderComponent({
          ...initialProps,
          duration: 1000,
        })
        const setDisplayStateSpy = jest.spyOn(instance, 'setDisplayState')
        instance.handleOnEntered()
        expect(setDisplayStateSpy).toHaveBeenCalledTimes(1)
        expect(setDisplayStateSpy).toHaveBeenCalledWith(false)
      })
      it('does not change message visibility state to false after `enter` transition if permanent message', () => {
        const { instance } = renderComponent({
          ...initialProps,
          duration: false,
        })
        const setDisplayStateSpy = jest.spyOn(instance, 'setDisplayState')
        instance.handleOnEntered()
        expect(setDisplayStateSpy).not.toHaveBeenCalled()
      })
    })

    describe('handleOnExited', () => {
      it('triggers callback method after entire transition completes', () => {
        const id = '1234'
        const { instance } = renderComponent({
          ...initialProps,
          id,
        })
        instance.handleOnExited(id)
        expect(initialProps.onTransitionComplete).toHaveBeenCalledTimes(1)
        expect(initialProps.onTransitionComplete).toHaveBeenCalledWith(id)
      })
    })
  })
})
