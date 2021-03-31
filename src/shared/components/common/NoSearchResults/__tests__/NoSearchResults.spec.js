import testComponentHelper, {
  analyticsDecoratorHelper,
} from 'test/unit/helpers/test-component'
import Helmet from 'react-helmet'
import NoSearchResults from '../NoSearchResults'
import Button from '../../Button/Button'
import SearchInput from '../../SearchInput/SearchInput'
import Recommendations from '../../Recommendations/Recommendations'
import DressipiRecommendationsRail from '../../../common/Recommendations/DressipiRecommendationsRail'
import Espot from '../../../containers/Espot/Espot'
import espotsDesktop from '../../../../constants/espotsDesktop'

/**
 * Tests for mobile filter
 */

describe('<NoSearchResults/>', () => {
  const mobileNonFilterProps = {
    toggleProductsSearchBar: jest.fn(),
    isFiltered: false,
    productListType: null,
    clearRefinements: jest.fn(),
    applyRefinements: jest.fn(),
    isMobile: true,
    isDesktop: false,
    urlHasUpdated: true,
    isLocationSearchQuery: '',
  }
  const mobileFilterProps = {
    ...mobileNonFilterProps,
    isFiltered: true,
  }
  const nonMobileProps = {
    ...mobileNonFilterProps,
    isDesktop: true,
  }
  const nonMobileFeatureFlagProps = {
    ...nonMobileProps,
    isFeatureEnhancedNoSearchResultEnabled: true,
    getNoSearchResultsEspot: jest.fn(),
    brandCode: 'ts',
    queryParams: { q: 'does not exist' },
  }
  const mobileFeatureFlagProps = {
    ...mobileNonFilterProps,
    isFeatureEnhancedNoSearchResultEnabled: true,
    getNoSearchResultsEspot: jest.fn(),
    brandCode: 'ts',
    queryParams: { q: 'does not exist' },
  }

  const renderComponent = testComponentHelper(NoSearchResults.WrappedComponent)

  const testRecommendationsSection = (brandCode) => {
    return describe('Recommendations Section', () => {
      describe('when `isFeatureDressipiRecommendationsEnabled` is true', () => {
        it('should render the `<DressipiReccomendationsRail />` component and not the `<Recommendations />` one', () => {
          const { wrapper } = renderComponent({
            ...nonMobileFeatureFlagProps,
            isFeatureDressipiRecommendationsEnabled: true,
            isLocationQueryObject: {
              q: '?q=blah blah',
            },
            brandCode,
          })
          const dressipiRecommendations = wrapper.find(
            DressipiRecommendationsRail
          )
          const recommendations = wrapper.find(Recommendations)

          expect(recommendations).toHaveLength(0)
          expect(dressipiRecommendations).toHaveLength(1)
        })
      })
      describe('when `isFeatureDressipiRecommendationsEnabled` is false', () => {
        it('should render the`<Recommendations />` component and not the `<DressipiReccomendationsRail />` one', () => {
          const { wrapper } = renderComponent({
            ...nonMobileFeatureFlagProps,
            isFeatureDressipiRecommendationsEnabled: false,
            isLocationQueryObject: {
              q: '?q=blah blah',
            },
            brandCode,
          })
          const dressipiRecommendations = wrapper.find(
            DressipiRecommendationsRail
          )
          const recommendations = wrapper.find(Recommendations)

          expect(dressipiRecommendations).toHaveLength(0)
          expect(recommendations).toHaveLength(1)
        })
      })
    })
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('@render', () => {
    it('in default state', () => {
      expect(renderComponent(mobileNonFilterProps).getTree()).toMatchSnapshot()
    })

    it('has isFiltered', () => {
      expect(renderComponent(mobileFilterProps).getTree()).toMatchSnapshot()
    })

    it('non mobile with isFiltered', () => {
      const props = {
        ...nonMobileProps,
        isFiltered: true,
      }
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })

    it('has no button when desktop', () => {
      expect(renderComponent(nonMobileProps).getTree()).toMatchSnapshot()
    })

    it('calls continueOption method via render method', () => {
      const nonFilterProps = {
        ...mobileNonFilterProps,
        isLocationQueryObject: {
          q: '?q=blah blah',
        },
        isFeatureEnhancedNoSearchResultEnabled: false,
      }
      const { instance } = renderComponent(nonFilterProps)

      jest.spyOn(instance, 'continueOption')

      expect(instance.continueOption).not.toBeCalled()
      instance.render()
      expect(instance.continueOption).toHaveBeenCalledTimes(1)
    })

    it('has a continue shopping button when to take user to home page', () => {
      const props = {
        ...nonMobileProps,
        isFiltered: true,
      }

      const { wrapper } = renderComponent(props)
      expect(
        wrapper.find('.NoSearchResults-continueShoppingButton')
      ).toHaveLength(1)
    })

    describe('when NO_SEARCH_RESULT feature flag is present', () => {
      const NO_SEARCH_RESULT_ESPOT =
        espotsDesktop.search_results.NO_SEARCH_RESULT_ESPOT
      describe('when dp brand', () => {
        const { wrapper, getTree } = renderComponent({
          ...nonMobileFeatureFlagProps,
          brandCode: 'dp',
          isLocationQueryObject: {
            q: '?q=blah blah',
          },
          productListType: 'noSearchResultsIncludesSearch',
          isDesktop: false,
        })

        it('should render sections correctly', () => {
          expect(getTree()).toMatchSnapshot()

          expect(wrapper.find(Helmet).prop('title')).toBe(
            'Sorry your search didn’t match any products.'
          )
          expect(wrapper.find(SearchInput).prop('placeholder')).toBe(
            'Search again?'
          )
          expect(wrapper.find('p').exists()).toBe(false)
          expect(wrapper.find(Espot).prop('identifier')).toBe(
            NO_SEARCH_RESULT_ESPOT
          )
        })
        testRecommendationsSection('dp')
      })

      describe('when wl brand', () => {
        it('should render sections correctly', () => {
          const { wrapper, getTree } = renderComponent({
            ...nonMobileFeatureFlagProps,
            brandCode: 'wl',
            isLocationQueryObject: {
              q: '?q=blah blah',
            },
            productListType: 'noSearchResultsIncludesSearch',
            isDesktop: false,
          })

          expect(getTree()).toMatchSnapshot()

          expect(wrapper.find(Helmet).prop('title')).toBe(
            'Your search did not return any results'
          )
          expect(wrapper.find('h1').text()).toBe(
            'YOU SEARCHED FOR... "does not exist"'
          )
          expect(wrapper.find('p').text()).toBe(
            'Unfortunately there were no results matching your request'
          )
          expect(wrapper.find(SearchInput).prop('label')).toBe(
            'Try using fewer words and make sure all words are spelled correctly.'
          )
          expect(wrapper.find(SearchInput).prop('placeholder')).toBe(undefined)
          expect(wrapper.find(Espot).prop('identifier')).toBe(
            NO_SEARCH_RESULT_ESPOT
          )
        })
        testRecommendationsSection('wl')
      })

      describe('when ts brand', () => {
        it('should render sections correctly', () => {
          const { wrapper, getTree } = renderComponent({
            ...nonMobileFeatureFlagProps,
            brandCode: 'ts',
            isLocationQueryObject: {
              q: '?q=blah blah',
            },
            productListType: 'noSearchResultsIncludesSearch',
            isDesktop: false,
          })

          expect(getTree()).toMatchSnapshot()

          expect(wrapper.find(Helmet).prop('title')).toBe(
            'Your search did not return any results'
          )
          expect(wrapper.find('h1').text()).toBe(
            'YOUR SEARCH DID NOT RETURN ANY RESULTS'
          )
          expect(wrapper.find('p').text()).toBe(
            'Try using fewer words and make sure all words are spelled correctly.'
          )
          expect(wrapper.find(Espot).prop('identifier')).toBe(
            NO_SEARCH_RESULT_ESPOT
          )
        })

        testRecommendationsSection('ts')
      })

      describe('when no matching brand', () => {
        it('should not render paragraph', () => {
          const { wrapper, getTree } = renderComponent({
            ...nonMobileFeatureFlagProps,
            brandCode: 'zz',
            isLocationQueryObject: {
              q: '?q=blah blah',
            },
            productListType: 'noSearchResultsIncludesSearch',
            isDesktop: false,
          })

          expect(getTree()).toMatchSnapshot()

          expect(wrapper.find(Helmet).prop('title')).toBe(
            'Your search did not return any results'
          )
          expect(wrapper.find('h1').text()).toBe(
            'YOUR SEARCH DID NOT RETURN ANY RESULTS'
          )
          expect(wrapper.find('p').exists()).toBe(false)
          expect(wrapper.find(Espot).prop('identifier')).toBe(
            NO_SEARCH_RESULT_ESPOT
          )
        })
        testRecommendationsSection('zz')
      })

      it('should render <SearchInput /> and <Espot /> on mobile', () => {
        const { wrapper } = renderComponent({
          ...mobileFeatureFlagProps,
          isLocationQueryObject: {
            q: '?q=blah blah',
          },
          productListType: 'noSearchResultsIncludesSearch',
          isDesktop: false,
        })
        expect(wrapper.find(SearchInput).length).toBe(1)
        expect(wrapper.find(Espot).length).toBe(1)
      })
    })
  })

  describe('@events', () => {
    const isLocationQueryObject = {
      q: '?q=blah blah',
      productListType: 'noSearchResultsIncludesSearch',
      isDesktop: false,
    }
    it('should call clearAndApplyRefinements', () => {
      const mobFilteredProps = {
        ...mobileFilterProps,
        isLocationQueryObject,
      }
      const { wrapper } = renderComponent(mobFilteredProps)
      expect(mobFilteredProps.clearRefinements).not.toHaveBeenCalled()
      expect(mobFilteredProps.applyRefinements).not.toHaveBeenCalled()
      wrapper
        .find(Button)
        .props()
        .clickHandler()
      expect(mobFilteredProps.clearRefinements).toHaveBeenCalled()
      expect(mobFilteredProps.applyRefinements).toHaveBeenCalled()
    })

    it('should call toggleProductsSearchBar', () => {
      const mobFilteredProps = {
        ...mobileNonFilterProps,
        isLocationQueryObject,
      }
      const { wrapper } = renderComponent(mobFilteredProps)

      expect(mobFilteredProps.toggleProductsSearchBar).not.toBeCalled()
      wrapper
        .find(Button)
        .props()
        .clickHandler()
      expect(mobFilteredProps.toggleProductsSearchBar).toHaveBeenCalledTimes(1)
      expect(
        mobFilteredProps.toggleProductsSearchBar.mock.calls[0][0]
      ).toBeUndefined()
    })

    it('should call getNoSearchResultsEspot(), when mounting & is desktop', () => {
      const { instance } = renderComponent(nonMobileFeatureFlagProps)
      instance.componentDidMount()

      expect(
        nonMobileFeatureFlagProps.getNoSearchResultsEspot
      ).toHaveBeenCalled()
    })

    it('should call getNoSearchResultsEspot(), when mounting & is mobile', () => {
      const { instance } = renderComponent(mobileFeatureFlagProps)
      instance.componentDidMount()

      expect(mobileFeatureFlagProps.getNoSearchResultsEspot).toHaveBeenCalled()
    })
  })

  describe('instance methods', () => {
    describe('clearAndApplyRefinements', () => {
      it('should call clearRefinements and applyRefinements', () => {
        const instance = renderComponent(mobileNonFilterProps).instance

        expect(mobileNonFilterProps.clearRefinements).not.toBeCalled()
        expect(mobileNonFilterProps.applyRefinements).not.toBeCalled()
        instance.clearAndApplyRefinements()
        expect(mobileNonFilterProps.clearRefinements).toHaveBeenCalledTimes(1)
        expect(mobileNonFilterProps.applyRefinements).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Analytics', () => {
    // it reports 404 analytics
    analyticsDecoratorHelper(NoSearchResults, 'not-found', {
      componentName: 'NoSearchResults',
      isAsync: true,
    })
  })
})
