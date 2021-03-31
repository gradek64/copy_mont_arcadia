import testComponentHelper from 'test/unit/helpers/test-component'
import SortSelector from '../SortSelector'
import Select from '../../../../components/common/FormComponents/Select/Select'
import QubitReact from 'qubit-react/wrapper'

const renderComponent = testComponentHelper(SortSelector.WrappedComponent)

const props = {
  sortOptions: [
    { value: 'test', label: 'test' },
    { value: 'test', label: 'test' },
  ],
  location: {
    pathname: 'david/',
    search: '?q=d&jim=div',
    query: { sort: 'test' },
  },
  visited: ['one'],
  currentSortOption: 'my sort option',
  selectSortOption: jest.fn(),
}

describe('<SortSelector />', () => {
  describe('@renders', () => {
    it('renders in default state', () => {
      const component = renderComponent(props)
      expect(component.getTree()).toMatchSnapshot()
    })

    it('Should render Select field if sortOptions are passed', () => {
      const { wrapper } = renderComponent(props)
      expect(wrapper.find(Select)).toHaveLength(1)
    })

    it('`Select` child component has correct props', () => {
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })

    it('`selectSortOption` is called when `SortSelector` is clicked', () => {
      const { wrapper } = renderComponent(props)
      const value = 'test value'
      wrapper.find('.SortSelector').prop('onChange')({
        target: {
          value,
        },
      })
      expect(props.selectSortOption).toHaveBeenCalledTimes(1)
      expect(props.selectSortOption).toHaveBeenCalledWith(value)
    })

    it('Should not render Select field if no options are passed', () => {
      const { wrapper } = renderComponent({ ...props, sortOptions: [] })
      expect(wrapper.find(Select)).toHaveLength(0)
    })
  })

  describe('@lifecycle', () => {
    describe('@componentDidMount', () => {
      it('will update sort option dropdown', () => {
        const initProps = {
          updateSortOption: jest.fn(),
        }
        const { instance } = renderComponent(initProps)
        instance.componentDidMount()
        expect(instance.props.updateSortOption).toHaveBeenCalledTimes(1)
      })
    })

    describe('@UNSAFE_componentWillReceiveProps', () => {
      it('will update sort option dropdown', () => {
        const initProps = {
          updateSortOption: jest.fn(),
          sortOptions: [],
        }
        const nextProps = {
          sortOptions: [{ label: 'Price - Low to High' }],
        }

        const { instance } = renderComponent(initProps)
        instance.UNSAFE_componentWillReceiveProps(nextProps)
        expect(instance.props.updateSortOption).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('@qubit', () => {
    const { wrapper } = renderComponent(props)
    const qubitWrapper = wrapper.find(QubitReact)
    it('should render one qubit react wrapper', () => {
      expect(qubitWrapper.length).toBe(1)
    })
    it('should render a qubit react wrapper for sortSelector with correct props', () => {
      expect(qubitWrapper.props().id).toBe('EXP-373-hide-ratings')
    })
  })
})
