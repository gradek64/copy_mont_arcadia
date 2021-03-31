import testComponentHelper from 'test/unit/helpers/test-component'
import TopSectionItemLayout from '../../../containers/TopNavMenu/TopSectionItemLayout'
import StoreFinder from '../StoreFinder'
import UserLocatorInput from '../../../common/UserLocatorInput/UserLocatorInput'

describe('<StoreFinder />', () => {
  const defaultProps = {
    selectedCountry: 'United Kingdom',
    storeLocatorType: 'findInStore',
    searchStoresCheckout: jest.fn(),
    searchStores: jest.fn(),
    selectCountry: jest.fn(),
  }
  const renderComponent = testComponentHelper(StoreFinder.WrappedComponent)

  describe('@renders', () => {
    it('should render in default state', () => {
      const { getTree } = renderComponent(defaultProps)
      expect(getTree()).toMatchSnapshot()
    })

    it('should render the TopSectionItemLayout component', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
      })
      expect(
        wrapper.find(TopSectionItemLayout).prop('leftIcon')
      ).toMatchSnapshot()
      expect(wrapper.find(TopSectionItemLayout)).toHaveLength(1)
      expect(wrapper.find(TopSectionItemLayout).prop('text')).toBe(
        'Store Finder'
      )
      expect(wrapper.find(TopSectionItemLayout).prop('expanded')).toBe(false)
    })

    describe('@events', () => {
      beforeEach(() => jest.clearAllMocks())

      describe('when selectedCountry is not equal to the default country', () => {
        describe('when the row is clicked', () => {
          describe('when storeLocatorType is not equal to collectFromStore', () => {
            it('should call searchStores', () => {
              const { wrapper } = renderComponent({
                ...defaultProps,
                selectedCountry: 'France',
              })
              expect(defaultProps.searchStores).not.toHaveBeenCalled()
              wrapper.find('.rowClick').simulate('click')
              return new Promise((resolve) => setTimeout(resolve)).then(() => {
                expect(defaultProps.searchStores).toHaveBeenCalled()
              })
            })
          })
        })
      })

      describe('when selectedCountry is equal to the default country', () => {
        describe('when the row with an up arrow is clicked', () => {
          it('should hide the user locator input', () => {
            const { wrapper } = renderComponent({
              ...defaultProps,
            })
            wrapper.setState({ showUserLocatorInput: true })
            expect(wrapper.find(UserLocatorInput)).toHaveLength(1)
            wrapper.find('.rowClick').simulate('click')
            expect(wrapper.find(UserLocatorInput)).toHaveLength(0)
          })
        })

        describe('when the row with a down arrow is clicked', () => {
          it('should show the user locator input', () => {
            const { wrapper } = renderComponent({
              ...defaultProps,
            })
            wrapper.setState({ showUserLocatorInput: false })
            wrapper.find('.rowClick').simulate('click')
            expect(wrapper.find(UserLocatorInput)).toHaveLength(1)
          })
        })
      })
    })

    describe('@lifecycle', () => {
      describe('UNSAFE_componentWillReceiveProps', () => {
        it('should call searchStores when current currentSelectedCountry prop is different to the previous state', () => {
          const { wrapper } = renderComponent({
            ...defaultProps,
          })
          expect(defaultProps.selectCountry).not.toHaveBeenCalled()
          wrapper.setProps({
            selectedCountry: 'Spain',
          })
          expect(defaultProps.selectCountry).toHaveBeenCalledTimes(1)
        })

        it('it should set the showUserLocatorInput to false when selectedCountry is not equal to the default country and showUserLocatorInput is equal to true', () => {
          const { wrapper } = renderComponent({
            ...defaultProps,
            selectedCountry: 'United Kingdom',
          })
          wrapper.setProps({
            selectedCountry: 'France',
          })
          expect(wrapper.state().showUserLocatorInput).toBe(false)
          expect(wrapper.find(UserLocatorInput)).toHaveLength(0)
        })
      })
    })
  })
})
