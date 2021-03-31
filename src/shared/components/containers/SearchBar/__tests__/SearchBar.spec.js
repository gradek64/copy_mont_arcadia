import testComponentHelper, {
  buildComponentRender,
  mountRender,
  withStore,
} from 'test/unit/helpers/test-component'
import { compose } from 'ramda'

import keys from '../../../../constants/keyboardKeys'
import SearchBar from '../SearchBar'

jest.mock('../../../common/Image/Image', () => 'MockImage')
jest.mock('../../../../analytics/tracking/site-interactions')

let originalGetElementById

describe('<SearchBar/>', () => {
  const renderComponent = testComponentHelper(SearchBar.WrappedComponent)
  const defaultProps = {
    logoVersion: 'AAAAA',
    featureBigHeader: false,
    isMobile: false,
    setFormField: jest.fn(),
    focusedFormField: jest.fn(),
    touchedFormField: jest.fn(),
    trackSearchBarSelected: jest.fn(),
  }

  beforeEach(() => jest.resetAllMocks())

  beforeAll(() => {
    originalGetElementById = global.document.getElementById
  })

  afterAll(() => {
    global.document.originalGetElementById = originalGetElementById
  })

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(defaultProps).getTree()).toMatchSnapshot()
    })
    it('if desktop and features enabled', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        isDesktop: true,
        featureBigHeader: true,
        featureResponsive: true,
      })
      expect(wrapper.find('.SearchBar--big').length).toBe(1)
      expect(wrapper.find('.SearchBar-closeIconParent').length).toBe(1)
    })
    it('should add custom class when `className` passed', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        className: 'someClassName',
      })
      expect(wrapper.hasClass('someClassName')).toBe(true)
    })
    it('should have default search icon if not specified', () => {
      const { wrapper } = renderComponent(defaultProps)
      expect(wrapper.find('.SearchBar-icon').prop('src')).toContain(
        'search-icon.svg?version=AAAAA'
      )
    })
    it('should add search icon src if specified', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        logoVersion: 'AAAAA',
        imageFileName: 'some-file.svg',
      })
      expect(wrapper.find('.SearchBar-icon').prop('src')).toContain(
        'some-file.svg?version=AAAAA'
      )
    })
    it('with search bar close icon and seach bar term focuses', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        searchTermIsFocused: true,
        isDesktop: true,
      })
      expect(wrapper.find('.SearchBar-closeIcon')).toHaveLength(1)
    })
    it('with search bar close icon and seach bar term not focuses', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        searchTermIsFocused: false,
        isDesktop: true,
      })
      expect(wrapper.find('.SearchBar-closeIconHidden')).toHaveLength(1)
    })
    it('with input placeholder on mobile', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        searchTermIsFocused: false,
        isMobile: true,
        featureBigHeader: true,
      })
      expect(wrapper.find('.SearchBar-queryInput').prop('placeholder')).toBe(
        'Search for a product...'
      )
    })
    it('with search bar open', () => {
      const { wrapper } = renderComponent({
        ...defaultProps,
        productsSearchOpen: true,
      })
      expect(wrapper.find('.SearchBar-open')).toHaveLength(1)
    })
  })

  describe('@lifecycle', () => {
    describe('componentDidUpdate', () => {
      it('blurs search input', () => {
        const blur = jest.fn()
        const getElementById = jest.fn()
        getElementById.mockReturnValueOnce({ blur })
        global.document.getElementById = getElementById

        const { instance } = renderComponent({
          ...defaultProps,
          isDesktop: false,
          productsSearchOpen: false,
          featureBigHeader: true,
          featureResponsive: true,
        })

        /*
         * we have to call the lifecycle method directly because of this issue
         * https://github.com/airbnb/enzyme/issues/2042
         */
        instance.componentDidUpdate()

        expect(getElementById).toHaveBeenCalledTimes(1)
        expect(getElementById).toHaveBeenCalledWith('searchTermInput')
        expect(blur).toHaveBeenCalledTimes(1)
      })

      it('does not blurs search input when product search is open', () => {
        const blur = jest.fn()
        const getElementById = jest.fn()
        getElementById.mockReturnValueOnce({ blur })
        global.document.getElementById = getElementById

        const { instance } = renderComponent({
          ...defaultProps,
          isDesktop: false,
          productsSearchOpen: true,
          featureBigHeader: true,
          featureResponsive: true,
        })

        /*
         * we have to call the lifecycle method directly because of this issue
         * https://github.com/airbnb/enzyme/issues/2042
         */
        instance.componentDidUpdate()

        expect(getElementById).toHaveBeenCalledTimes(1)
        expect(getElementById).toHaveBeenCalledWith('searchTermInput')
        expect(blur).toHaveBeenCalledTimes(0)
      })

      it('does not blurs search input when on desktop', () => {
        const blur = jest.fn()
        const getElementById = jest.fn()
        getElementById.mockReturnValueOnce({ blur })
        global.document.getElementById = getElementById

        const { instance } = renderComponent({
          ...defaultProps,
          isDesktop: true,
          productsSearchOpen: false,
          featureBigHeader: true,
          featureResponsive: true,
        })

        /*
         * we have to call the lifecycle method directly because of this issue
         * https://github.com/airbnb/enzyme/issues/2042
         */
        instance.componentDidUpdate()

        expect(getElementById).toHaveBeenCalledTimes(1)
        expect(getElementById).toHaveBeenCalledWith('searchTermInput')
        expect(blur).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe('@events', () => {
    describe('onChange', () => {
      it('calls setField', () => {
        const value = 'some value'
        const { wrapper } = renderComponent(defaultProps)

        wrapper.find('.SearchBar-queryInput').prop('onChange')({
          target: { value },
        })
        expect(defaultProps.setFormField).toHaveBeenCalledTimes(1)
        expect(defaultProps.setFormField).toHaveBeenCalledWith(
          'search',
          'searchTerm',
          value
        )
      })
    })

    describe('onFocus', () => {
      it('calls focusedFormField', () => {
        const { wrapper } = renderComponent(defaultProps)

        wrapper.find('.SearchBar-form').prop('onFocus')()
        expect(defaultProps.focusedFormField).toHaveBeenCalledTimes(1)
        expect(defaultProps.focusedFormField).toHaveBeenCalledWith(
          'search',
          'searchTerm',
          true
        )
      })
    })

    describe('onBlur', () => {
      it('calls focusedFormField', () => {
        const { wrapper } = renderComponent(defaultProps)

        wrapper.find('.SearchBar-form').prop('onBlur')()
        return new Promise((resolve) => setTimeout(resolve, 600)).then(() => {
          expect(defaultProps.focusedFormField).toHaveBeenCalledTimes(1)
          expect(defaultProps.focusedFormField).toHaveBeenCalledWith(
            'search',
            'searchTerm',
            false
          )
          expect(defaultProps.touchedFormField).toHaveBeenCalledTimes(1)
          expect(defaultProps.touchedFormField).toHaveBeenCalledWith(
            'search',
            'searchTerm'
          )
        })
      })
    })

    describe('onSubmit', () => {
      const defaultState = {
        forms: {
          search: {
            fields: {
              searchTerm: {
                isFocused: false,
              },
            },
          },
        },
        config: {
          brandName: 'topshop',
          brandCode: 'ts',
        },
      }
      const render = compose(
        mountRender,
        withStore(defaultState)
      )
      const renderComponent = buildComponentRender(
        render,
        SearchBar.WrappedComponent
      )

      it('should focus input when click on icon on desktop', () => {
        const { instance, wrapper } = renderComponent({
          ...defaultProps,
          isDesktop: true,
        })
        const ev = {
          preventDefault: jest.fn(),
        }
        instance.searchInput.focus = jest.fn()
        expect(ev.preventDefault).not.toHaveBeenCalled()
        expect(instance.searchInput.focus).not.toHaveBeenCalled()
        const form = wrapper.find('form').first()
        form.simulate('submit', ev)
        expect(ev.preventDefault).toHaveBeenCalledTimes(1)
        expect(instance.searchInput.focus).toHaveBeenCalledTimes(1)
      })
      it('should not focus input when click on icon on mobile', () => {
        const { instance, wrapper } = renderComponent({
          ...defaultProps,
          isDesktop: false,
        })
        const ev = {
          preventDefault: jest.fn(),
        }
        instance.searchInput.focus = jest.fn()
        expect(ev.preventDefault).not.toHaveBeenCalled()
        expect(instance.searchInput.focus).not.toHaveBeenCalled()
        const form = wrapper.find('form').first()
        form.simulate('submit', ev)
        expect(ev.preventDefault).toHaveBeenCalledTimes(1)
        expect(instance.searchInput.focus).not.toHaveBeenCalled()
      })
      it('should search and blur input when click on icon with search term', () => {
        const { instance, wrapper } = renderComponent({
          isDesktop: false,
          isMobile: false,
          featureBigHeader: false,
          submitSearch: jest.fn(),
          setFormField: jest.fn(),
          focusedFormField: jest.fn(),
        })
        const ev = {
          preventDefault: jest.fn(),
        }
        instance.searchInput.value = 'jeans'
        instance.searchInput.blur = jest.fn()
        expect(ev.preventDefault).not.toHaveBeenCalled()
        expect(instance.searchInput.blur).not.toHaveBeenCalled()
        expect(instance.props.submitSearch).not.toHaveBeenCalled()
        const form = wrapper.find('form').first()
        form.simulate('submit', ev)
        expect(ev.preventDefault).toHaveBeenCalledTimes(1)
        expect(instance.searchInput.blur).toHaveBeenCalledTimes(1)
        expect(instance.props.submitSearch).toHaveBeenCalledTimes(1)
      })
    })

    describe('analytics', () => {
      const defaultState = {
        forms: {
          search: {
            fields: {
              searchTerm: {
                isFocused: false,
              },
            },
          },
        },
        config: {
          brandName: 'topshop',
          brandCode: 'ts',
        },
      }
      const render = compose(
        mountRender,
        withStore(defaultState)
      )
      const renderComponent = buildComponentRender(
        render,
        SearchBar.WrappedComponent
      )

      it('should track a click event when the input field is clicked on', () => {
        const { wrapper } = renderComponent(defaultProps)

        wrapper.find('.SearchBar-queryInput').prop('onClick')()
        expect(defaultProps.trackSearchBarSelected).toHaveBeenCalledTimes(1)
      })

      describe('when the search input field is empty', () => {
        it('should track a click event when the search button is clicked on', () => {
          const { wrapper } = renderComponent(defaultProps)

          wrapper.find('.SearchBar-button').prop('onClick')()
          expect(defaultProps.trackSearchBarSelected).toHaveBeenCalledTimes(1)
        })

        it('should suppress form submission when user hits Enter in the search field', () => {
          const { wrapper } = renderComponent(defaultProps)

          const mockKeyDownEvent = {
            keyCode: keys.ENTER,
            preventDefault: jest.fn(),
          }

          wrapper.find('.SearchBar-queryInput').prop('onKeyDown')(
            mockKeyDownEvent
          )
          expect(mockKeyDownEvent.preventDefault).toHaveBeenCalledTimes(1)
        })

        it('should not suppress form submission when user hits another key in the search field', () => {
          const { wrapper } = renderComponent(defaultProps)

          const mockKeyDownEvent = {
            keyCode: keys.A,
            preventDefault: jest.fn(),
          }

          wrapper.find('.SearchBar-queryInput').prop('onKeyDown')(
            mockKeyDownEvent
          )
          expect(mockKeyDownEvent.preventDefault).not.toHaveBeenCalled()
        })
      })

      describe('when the search input field is not empty', () => {
        it('should not track a click event when the search button is clicked on', () => {
          const { instance, wrapper } = renderComponent(defaultProps)
          instance.searchInput.value = 'foo'

          wrapper.find('.SearchBar-button').prop('onClick')()
          expect(defaultProps.trackSearchBarSelected).not.toHaveBeenCalled()
        })

        it('should not suppress form submission when user hits Enter in the search field', () => {
          const { instance, wrapper } = renderComponent(defaultProps)
          instance.searchInput.value = 'foo'

          const mockKeyDownEvent = {
            keyCode: keys.ENTER,
            preventDefault: jest.fn(),
          }

          wrapper.find('.SearchBar-queryInput').prop('onKeyDown')(
            mockKeyDownEvent
          )
          expect(mockKeyDownEvent.preventDefault).not.toHaveBeenCalled()
        })
      })
    })
  })
})
