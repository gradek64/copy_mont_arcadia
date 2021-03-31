import WithQubit from '../WithQubit'
import QubitWrapper from 'qubit-react/wrapper'
import testComponentHelper from 'test/unit/helpers/test-component'

const renderComponent = testComponentHelper(WithQubit)

describe('WithQubit', () => {
  const defaultProps = {
    shouldUseQubit: true,
    id: 'test',
    children: 'tree',
  }

  describe('shouldUseQubit is true', () => {
    it('should wrap the children in QubitWrapper with correct props', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        weather: 'windy',
      })
      const passedProps = {
        children: 'tree',
        id: 'test',
        weather: 'windy',
      }

      expect(wrapper.find(QubitWrapper).exists()).toBe(true)
      expect(wrapper.find(QubitWrapper).props()).toEqual(passedProps)
    })
  })

  describe('shouldUseQubit is false', () => {
    it('should not wrap the children in QubitWrapper', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        shouldUseQubit: false,
      })

      expect(wrapper.find(QubitWrapper).exists()).toBe(false)
      expect(wrapper.text()).toEqual('tree')
    })
  })

  describe('no children is passed', () => {
    it('should render a qubit wrapper with children null', () => {
      const { wrapper } = renderComponent({
        shouldUseQubit: true,
        id: 'qubitTest',
      })

      expect(wrapper.find(QubitWrapper).exists()).toBe(true)
      expect(wrapper.find(QubitWrapper).prop('children')).toBe(null)
    })
  })
})
