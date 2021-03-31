import DebugButton from '../DebugButton/DebugButton'
import testComponentHelper from 'test/unit/helpers/test-component'

describe(DebugButton.name, () => {
  const initProps = {
    debugButtonVisible: true,
    showDebug: jest.fn(),
  }
  const renderComponent = testComponentHelper(DebugButton.WrappedComponent)
  describe('render', () => {
    it('is visible when "debugButtonVisible" is true', () => {
      const { wrapper, getTree } = renderComponent(initProps)
      expect(getTree()).toMatchSnapshot()
      expect(wrapper.find('.DebugButton')).toHaveLength(1)
    })
    it('is hidden when "debugButtonVisible" is false', () => {
      const props = {
        ...initProps,
        debugButtonVisible: false,
      }
      const { wrapper, getTree } = renderComponent(props)
      expect(getTree()).toMatchSnapshot()
      expect(wrapper.find('.DebugButton')).toHaveLength(0)
    })
  })

  describe('events', () => {
    it('call the showDebug action on component click', () => {
      const { instance, wrapper } = renderComponent(initProps)
      wrapper.find('.DebugButton').simulate('click')
      expect(instance.props.showDebug).toHaveBeenCalled()
    })
  })
})
