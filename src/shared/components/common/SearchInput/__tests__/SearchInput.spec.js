import SearchInput from '../SearchInput'
import testComponentHelper from 'test/unit/helpers/test-component'

describe('<SearchInput />', () => {
  const renderComponent = testComponentHelper(SearchInput.WrappedComponent)

  beforeEach(jest.clearAllMocks)

  describe('@renders', () => {
    it('should check the component tree stays the same', () => {
      const { wrapper } = renderComponent()
      expect(renderComponent(wrapper).getTree()).toMatchSnapshot()
    })

    it('it renders correct components', () => {
      const { wrapper } = renderComponent({ submitSearch: jest.fn() })
      expect(wrapper.find('Form.SearchInput-form').length).toBe(1)
      expect(wrapper.find('input.SearchInput-search').length).toBe(1)
    })

    describe('Label prop is not provided', () => {
      it('should not render a label within the form', () => {
        const { wrapper } = renderComponent({
          label: undefined,
        })
        expect(wrapper.find('label.SearchInput-label').length).toBe(0)
      })
    })

    describe('Label prop is provided', () => {
      it('should render a label within the form', () => {
        const { wrapper } = renderComponent({
          label: 'label text',
        })
        expect(wrapper.find('label.SearchInput-label').length).toBe(1)
        expect(wrapper.find('label.SearchInput-label').text()).toBe(
          'label text'
        )
      })
    })

    describe('Placeholder prop is not provided', () => {
      it('Placeholder should default to Search', () => {
        const { wrapper } = renderComponent({
          placeholder: undefined,
        })
        const placeholder = wrapper
          .find('.SearchInput-search')
          .prop('placeholder')

        expect(placeholder).toBe('Search')
      })
    })

    describe('Placeholder prop is provided', () => {
      it('Placeholder should match the provided string', () => {
        const { wrapper } = renderComponent({
          placeholder: 'Some string',
        })
        const placeholder = wrapper
          .find('.SearchInput-search')
          .prop('placeholder')

        expect(placeholder).toBe('Some string')
      })
    })
  })

  describe('@actions', () => {
    let wrapper
    let submitMock

    beforeEach(() => {
      submitMock = jest.fn()
      wrapper = renderComponent({ submitSearch: submitMock }).wrapper
    })

    describe('onChange', () => {
      it('when text is entered, it can update searchTerm state', () => {
        const changeEvent = { target: { value: 'dresses' } }
        wrapper.find('.SearchInput-search').simulate('change', changeEvent)
        expect(wrapper.find('.SearchInput-search').prop('value')).toBe(
          'dresses'
        )
      })
    })

    describe('submitSearch', () => {
      it('on submit, it calls submitSearch action', () => {
        wrapper.setState({ searchTerm: 'dresses' })
        wrapper
          .find('.SearchInput-form')
          .simulate('submit', { preventDefault: () => {} })
        expect(submitMock).toHaveBeenCalled()
      })

      it('when clicking on the search icon, it calls submitSearch action', () => {
        wrapper.setState({ searchTerm: 'dresses' })
        wrapper
          .find('.SearchInput-button')
          .simulate('click', { preventDefault: () => {} })
        expect(submitMock).toHaveBeenCalled()
      })

      it('when no text is entered, it cannot submit', () => {
        wrapper
          .find('.SearchInput-form')
          .simulate('submit', { preventDefault: () => {} })
        expect(submitMock).not.toBeCalled()
      })
    })
  })
})
