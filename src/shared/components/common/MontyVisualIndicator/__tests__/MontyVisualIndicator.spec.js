import testComponentHelper from 'test/unit/helpers/test-component'
import MontyVisualIndicator from '../MontyVisualIndicator'

const defaultProps = {
  montyVisualIndicatorVisible: true,
}

describe('<MontyVisualIndicator />', () => {
  const renderComponent = testComponentHelper(
    MontyVisualIndicator.WrappedComponent
  )

  describe('@renders', () => {
    it('in default state', () => {
      const { getTree } = renderComponent(defaultProps)
      expect(getTree()).toMatchSnapshot()
    })
    it('is visible when `montyVisualIndicatorVisible` is true', () => {
      const { wrapper } = renderComponent(defaultProps)
      expect(wrapper.find('.MontyVisualIndicator').length).toBe(1)
    })
    it('is visible when `montyVisualIndicatorVisible` is false', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        montyVisualIndicatorVisible: false,
      })
      expect(wrapper.find('.MontyVisualIndicator').length).toBe(0)
    })
  })
})
