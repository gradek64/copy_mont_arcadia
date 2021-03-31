import { shallow } from 'enzyme'
import React from 'react'
import { browserHistory } from 'react-router'
import Helmet from 'react-helmet'

import testComponentHelper, {
  until,
  mount,
} from 'test/unit/helpers/test-component'
import {
  mockStoreCreator,
  createStore,
} from '../../../../../../test/unit/helpers/get-redux-mock-store'
import { forAnalyticsDecorator as createMockStoreForAnalytics } from 'test/unit/helpers/mock-store'
import mockProducts from 'test/mocks/products'

import PlpContainer, {
  WrappedPlpContainer,
  composeCategoryBanner,
} from '../PlpContainer'
import NotFound from '../../NotFound/NotFound'
import ProductList from '../ProductList'
import PlpHeader from '../PlpHeader'
import RefinementContainer from '../RefinementContainer'
import Filters from '../Filters'
import Refinements from '../Refinements/Refinements'
import SandBox from '../../../containers/SandBox/SandBox'
import BackToTop from '../../../common/BackToTop/BackToTop'
import ProductsBreadCrumbs from '../../../common/ProductsBreadCrumbs/ProductsBreadCrumbs'
import * as productRoutes from '../../../../lib/get-product-route'
import RecentlyViewedTab from '../../../common/RecentlyViewedTab/RecentlyViewedTab'
import { isIE11, isFF } from '../../../../lib/browser'
import { getCategoryFromBreadcrumbs } from '../../../../lib/products-utils'
import cmsUtilities, { fixCmsUrl } from '../../../../lib/cms-utilities'
import NoSearchResults from '../../../common/NoSearchResults/NoSearchResults'
import ProductCarousel from '../../../common/ProductCarousel/ProductCarousel'

jest.mock('react-router')
jest.mock('../../../../lib/get-product-route.js', () => ({
  getRouteFromUrl: jest.fn((x) => x),
}))

jest.mock('../../../../lib/browser')
jest.mock('../../../../lib/products-utils')
jest.mock('../../../../lib/cms-utilities')

const NO_INDEX_NO_FOLLOW_META = {
  name: 'robots',
  content: 'noindex,nofollow',
}

beforeAll(() => {
  global.s = {
    Util: {
      cookieWrite: jest.fn(),
    },
  }
  // Only For wallaby
  if (!global.performance) {
    global.performance = {
      timing: {
        navigationStart: 1000,
      },
    }
  }
})

global.scrollTo = jest.fn()

fixCmsUrl.mockImplementation((value) => value)

cmsUtilities.getSandboxId = jest.fn().mockImplementation((value) => value)

describe('PlpContainer', () => {
  beforeEach(() => jest.clearAllMocks())

  const defaultLocation = {
    search: '/en/tsuk/dresses?query=custom',
    protocol: 'https:',
    hostname: 'm.topshop.com',
    pathname: '/fakepathname',
    action: 'POP',
    query: {},
  }

  const renderComponent = testComponentHelper(WrappedPlpContainer)
  const initialProps = {
    visited: [],
    location: defaultLocation,
    products: [{}],
    breadcrumbs: [],
    brandUrl: 'someString',
    brandCode: 'someString',
    canonicalUrl: 'canonicalUrl',
    getProducts: jest.fn(),
    getServerProducts: jest.fn(),
    clearOptions: jest.fn(),
    clearProducts: jest.fn(),
    setInfinityPage: jest.fn(),
    totalProducts: 1,
    categoryTitle: 'categoryTitle',
    title: 'page title',
    categoryDescription: 'categoryDescription',
    setInfinityActive: jest.fn(),
    isLoadingMore: false,
    isLoadingAll: false,
    preservedScroll: 10,
    isInfinityScrollActive: false,
    hitWaypointBottom: jest.fn(),
    params: {},
    updateProductsLocation: jest.fn(),
    productsRefinements: [],
    productsLocation: {},
    searchTerm: '',
    refinements: {},
    showTacticalMessage: jest.fn(),
    hideTacticalMessage: jest.fn(),
    clearRefinements: jest.fn(),
    clearSortOptions: jest.fn(),
    resetProductState: jest.fn(),
    analyticsSetProducts: jest.fn(),
    refreshPlp: false,
    plpPropsRefresh: jest.fn(),
    applyRefinements: jest.fn(),
    isMobile: false,
    categoryBanner: '',
    shouldIndex: true,
    stickyHeader: false,
    isModalOpen: false,
    getTrendingProducts: jest.fn(),
    megaNavHeight: 50,
    isFeatureStickyHeaderDesktopEnabled: jest.fn(),
    isFeatureStickyHeaderMobileEnabled: jest.fn(),
    getSocialProofBanners: jest.fn(),
    currentPage: 1,
  }

  describe('@render', () => {
    it('default render', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('renders for mobile', () => {
      expect(
        renderComponent({ ...initialProps, isMobile: true }).getTree()
      ).toMatchSnapshot()
    })

    it('renders ProductsBreadCrumbs', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find(ProductsBreadCrumbs)).toHaveLength(1)
    })

    it('renders stickyHeader=true', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        stickyHeader: true,
      })
      const RefinementContainerComponent = wrapper.find(RefinementContainer)
      expect(RefinementContainerComponent).toHaveLength(1)
      expect(RefinementContainerComponent.prop('stickyHeader')).toBe(true)
    })

    it('renders RecentlyViewedTab', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
      })

      expect(wrapper.find(RecentlyViewedTab).exists()).toBe(true)
    })

    it('shows no search results when no items are found', () => {
      const store = createStore({
        products: {
          totalProducts: 0,
          isLoadingAll: false,
        },
        refinements: {
          selectedOptions: {
            color: 'black',
          },
        },
        viewport: {
          media: 'desktop',
        },
      })

      const wrapper = mount(<PlpContainer location={defaultLocation} />, {
        store,
      })

      expect(wrapper.find('NoSearchResults')).toHaveLength(1)
    })

    it('inserts a qubit wrapper Dressipi PLP spotlight test (adp-2861)', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        isMobile: true,
        categoryId: 2234,
      })
      const qubitElement = wrapper.find(
        '#qubit-adp-2861-dressipi-plp-spotlight'
      )

      expect(qubitElement.length).toBe(1)
      expect(qubitElement.prop('shouldUseQubit')).toBe(true)
      expect(qubitElement.prop('children')).toBe(null)
      expect(qubitElement.prop('peepNextItem')).toBe(true)
      expect(qubitElement.prop('ProductCarousel')).toEqual(ProductCarousel)
    })

    it('should hide refinements when a search returns no results', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        location: {
          ...initialProps.location,
          pathname: '/search',
        },
        refinements: {},
        totalProducts: 0,
      })

      expect(wrapper.find(RefinementContainer)).toHaveLength(0)
    })

    it('should pass the category id to component', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        isMobile: true,
        categoryId: '2222',
        breadcrumbs: [
          { label: 'Home', url: '/' },
          {
            label: 'Clothing',
            category: '203984',
            url: '/en/tsuk/category/clothing-427',
          },
          { label: 'Trousers & Leggings', category: '203984,208528' },
        ],
      })
      const qubitElement = wrapper.find(
        '#qubit-adp-2861-dressipi-plp-spotlight'
      )
      expect(qubitElement.length).toBe(1)
      expect(qubitElement.prop('shouldUseQubit')).toBe(true)
      expect(qubitElement.prop('children')).toBe(null)
      expect(qubitElement.prop('peepNextItem')).toBe(true)
      expect(qubitElement.prop('categoryId')).toBe('2222')
      expect(qubitElement.prop('ProductCarousel')).toEqual(ProductCarousel)
    })

    describe('when no products returned for a category url', () => {
      describe('when there are refinements', () => {
        it('should show `<NoSearchResults/>` with the `isFiltered` set to true', () => {
          const props = {
            ...initialProps,
            refinements: {
              color: 'black',
            },
            location: {
              pathname: '/en/tsuk/category/clothing-281559/mens-jeans-281570',
              search: '?category=203984%2C208524&currentPage=3',
              query: {},
            },
            totalProducts: 0,
            products: undefined,
            isLoadingAll: false,
            getProducts: () => {},
          }

          const { wrapper } = renderComponent(props)
          const noSearchResults = wrapper.find(NoSearchResults)
          expect(noSearchResults).toHaveLength(1)
          expect(noSearchResults.prop('isFiltered')).toBe(true)
          expect(wrapper.find(RefinementContainer)).toHaveLength(1)
        })
      })

      describe('when there are no refinements', () => {
        const props = {
          ...initialProps,
          refinements: {},
          location: {
            pathname: '/search/',
            search: '?category=203984%2C208524&currentPage=3',
            query: {},
          },
          totalProducts: 0,
          products: undefined,
          isLoadingAll: false,
          getProducts: () => {},
        }

        it('should show listHeader', () => {
          const { wrapper } = renderComponent(props)
          expect(wrapper.find(Filters)).toHaveLength(1)
          expect(wrapper.find(SandBox)).toHaveLength(1)
          expect(wrapper.find(Refinements)).toHaveLength(1)
        })

        it('should show `<NoSearchResults/>` with the `isFiltered` set to undefined', () => {
          const { wrapper } = renderComponent(props)
          const noSearchResults = wrapper.find(NoSearchResults)
          expect(noSearchResults).toHaveLength(1)
          expect(noSearchResults.prop('isFiltered')).toBe(undefined)
          expect(noSearchResults.key()).toBe('ns4')
          expect(wrapper.find(RefinementContainer)).toHaveLength(0)
        })
      })
    })

    it('should display products when products returned', () => {
      const props = {
        ...initialProps,
        products: mockProducts,
        totalProducts: 372,
      }

      const { wrapper } = renderComponent(props)
      expect(wrapper.find(ProductList)).toHaveLength(1)
    })

    it('should display filters when products returned', () => {
      const props = {
        ...initialProps,
        products: mockProducts,
        totalProducts: 372,
      }

      const { wrapper } = renderComponent(props)
      expect(wrapper.find(Filters)).toHaveLength(1)
    })

    it('should display title when products returned', () => {
      const props = {
        ...initialProps,
        products: mockProducts,
        totalProducts: 372,
      }

      const { wrapper } = renderComponent(props)
      expect(wrapper.find(PlpHeader)).toHaveLength(1)
    })

    it('`isFeatureCategoryHeaderShowMoreDesktopEnabled` and `isFeatureCategoryHeaderShowMoreMobileEnabled` should be true if passed in props', () => {
      const props = {
        ...initialProps,
        isFeatureStickyHeaderDesktopEnabled: true,
        isFeatureStickyHeaderMobileEnabled: true,
      }
      const { instance } = renderComponent(props)
      expect(instance.props.isFeatureStickyHeaderDesktopEnabled).toEqual(true)
      expect(instance.props.isFeatureStickyHeaderMobileEnabled).toEqual(true)
    })

    it('should display back to top button when products returned', () => {
      const props = {
        ...initialProps,
        products: mockProducts,
        totalProducts: 372,
      }

      const { wrapper } = renderComponent(props)
      expect(wrapper.find(BackToTop)).toHaveLength(1)
    })

    it('should display filters when products change', () => {
      const props = {
        ...initialProps,
        totalProducts: 372,
      }

      const { wrapper } = renderComponent(props)
      expect(wrapper.find(Filters)).toHaveLength(1)
    })

    it('should create pagination links', () => {
      const props = {
        ...initialProps,
        totalProducts: 372,
      }
      const { wrapper } = renderComponent(props)
      expect(wrapper.find('.PlpContainer-pagination')).toHaveLength(1)
      expect(wrapper.find('.PlpContainer-paginationNext')).toHaveLength(1)
      expect(wrapper.find('.PlpContainer-paginationPrev')).toHaveLength(1)
    })

    it('should call hitWaypointBottom when there are more products', () => {
      const hitWaypointBottom = jest.fn()
      const props = {
        ...initialProps,
        totalProducts: 372,
        hitWaypointBottom,
      }
      const { instance } = renderComponent(props)

      instance.loadingMoreProducts()

      expect(hitWaypointBottom).toHaveBeenCalled()
    })

    it('should call hitWaypointBottom when there are hidden products at the bottom of the PLP', () => {
      const hitWaypointBottom = jest.fn()
      const props = {
        ...initialProps,
        products: mockProducts,
        totalProducts: 20,
        hitWaypointBottom,
        numberOfPagesHiddenAtEnd: 1,
      }
      const { instance } = renderComponent(props)

      instance.loadingMoreProducts()

      expect(hitWaypointBottom).toHaveBeenCalledTimes(1)
    })

    it('should not call hitWaypointBottom when all the products are loaded and not hidden at bottom of PLP', () => {
      const hitWaypointBottom = jest.fn()
      const props = {
        ...initialProps,
        products: mockProducts,
        totalProducts: 20,
        hitWaypointBottom,
      }
      const { instance } = renderComponent(props)

      instance.loadingMoreProducts()

      expect(hitWaypointBottom).not.toHaveBeenCalled()
    })

    it('renders responsive plp category header', () => {
      const props = {
        ...initialProps,
        catHeaderResponsiveCmsUrl:
          '/cms/pages/json/json-0000140416/json-0000140416.json',
      }
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })

    describe('when pathname contains excluded domains', () => {
      it('should show not found if pathname contains `dpth` ', () => {
        const props = {
          ...initialProps,
          location: {
            pathname: '/en/dpth/',
            search: null,
            query: {},
          },
          products: mockProducts,
          totalProducts: 372,
        }
        const { wrapper } = renderComponent(props)
        expect(wrapper.find(NotFound)).toHaveLength(1)
      })

      it('should show not found if pathname contains `dpmy` ', () => {
        const props = {
          ...initialProps,
          location: {
            pathname: '/en/dpmy/',
            search: null,
            query: {},
          },
          products: mockProducts,
          totalProducts: 372,
        }
        const { wrapper } = renderComponent(props)
        expect(wrapper.find(NotFound)).toHaveLength(1)
      })
    })

    describe('when pathname does not contain excluded domains', () => {
      it('should not show not found', () => {
        const props = {
          ...initialProps,
          location: {
            pathname: '/en/dpuk/',
            search: null,
            query: {},
          },
          products: mockProducts,
          totalProducts: 372,
        }
        const { wrapper } = renderComponent(props)
        expect(wrapper.find(NotFound)).toHaveLength(0)
      })
    })
  })

  describe('@decorators', () => {
    it('should be wrapped container in analytics, and window scroll', () => {
      const mockStore = createMockStoreForAnalytics({ preloadedState: {} })
      const shallowOptions = { context: { store: mockStore } }
      const wrapper = shallow(<PlpContainer />, shallowOptions)
      const analyticsDecorator = until(
        wrapper,
        'AnalyticsDecorator',
        shallowOptions
      )

      expect(PlpContainer.displayName).toMatch(/AnalyticsDecorator/)
      expect(analyticsDecorator.instance().pageType).toBe('plp')
      expect(analyticsDecorator.instance().isAsync).toBe(true)
    })
  })

  describe('@methods', () => {
    describe('@getHelmetProps', () => {
      it('should return noindex meta for search page', () => {
        const props = {
          ...initialProps,
          location: {
            ...defaultLocation,
            pathname: 'prefix/search?querystring',
          },
        }

        const { instance } = renderComponent(props)

        expect(instance.getHelmetProps()).toEqual({
          title: `Search - ${initialProps.categoryTitle}`,
          meta: [
            {
              name: 'description',
              content: `Search - ${initialProps.categoryTitle}`,
            },
            NO_INDEX_NO_FOLLOW_META,
          ],
        })
      })

      it('should return noindex meta when products are loading', () => {
        const props = {
          ...initialProps,
          isLoadingAll: true,
        }
        const link = [{ rel: 'canonical', href: initialProps.canonicalUrl }]
        const { instance } = renderComponent(props)
        expect(instance.getHelmetProps()).toEqual({
          link,
          title: `loading products`,
          meta: [
            {
              name: 'description',
              content: `loading products`,
            },
            NO_INDEX_NO_FOLLOW_META,
          ],
        })
      })

      it('should return canonical link, without noindex meta when shouldIndex is true', () => {
        const props = {
          ...initialProps,
          shouldIndex: true,
        }
        const link = [{ rel: 'canonical', href: initialProps.canonicalUrl }]
        const desc = {
          name: 'description',
          content: initialProps.categoryDescription,
        }
        const { instance } = renderComponent(props)
        expect(instance.getHelmetProps()).toEqual({
          link,
          title: initialProps.title,
          meta: [desc],
        })
      })

      it('should return noindex meta when shouldIndex is false', () => {
        const props = {
          ...initialProps,
          shouldIndex: false,
        }
        const link = [{ rel: 'canonical', href: initialProps.canonicalUrl }]
        const desc = {
          name: 'description',
          content: initialProps.categoryDescription,
        }
        const { instance } = renderComponent(props)
        expect(instance.getHelmetProps()).toEqual({
          link,
          title: initialProps.title,
          meta: [desc, NO_INDEX_NO_FOLLOW_META],
        })
      })

      it('builds a canonical url when products is not available (canonicalisationMap hostname)', () => {
        const store = createStore()
        mount(<PlpContainer location={defaultLocation} />, { store })
        const link = Helmet.peek().linkTags[0]
        expect(link.rel).toBe('canonical')
        expect(link.href).toBe('http://www.topshop.com/fakepathname')
      })
      it('builds a canonical url when products is not available (NOT canonicalisationMap hostname)', () => {
        const store = createStore()
        mount(
          <PlpContainer
            location={{
              ...defaultLocation,
              hostname: 'www.topman.com',
            }}
          />,
          { store }
        )
        const link = Helmet.peek().linkTags[0]
        expect(link.rel).toBe('canonical')
        expect(link.href).toBe('https://www.topman.com/fakepathname')
      })
      it('prefixes the canonical url with https if "canonicalUrl" is not available in state.props and FEATURE_HTTPS_CANONICAL is enabled', () => {
        const store = createStore({
          features: {
            status: {
              FEATURE_HTTPS_CANONICAL: true,
            },
          },
        })
        mount(<PlpContainer location={defaultLocation} />, { store })
        const link = Helmet.peek().linkTags[0]
        expect(link.rel).toBe('canonical')
        expect(link.href).toBe('https://www.topshop.com/fakepathname')
      })
      it('prefixes the canonical url with https if "canonicalUrl" available in state.products and FEATURE_HTTPS_CANONICAL is enabled', () => {
        const store = createStore({
          features: {
            status: {
              FEATURE_HTTPS_CANONICAL: true,
            },
          },
          products: {
            canonicalUrl: 'http://www.topshop.com/anotherfakepathname',
          },
        })
        mount(<PlpContainer location={defaultLocation} />, { store })
        const link = Helmet.peek().linkTags[0]
        expect(link.rel).toBe('canonical')
        expect(link.href).toBe('https://www.topshop.com/anotherfakepathname')
      })
      it('should include the current page number in the canonical url', () => {
        const store = createStore({
          features: {
            status: {
              FEATURE_HTTPS_CANONICAL: true,
            },
          },
          products: {
            canonicalUrl: 'http://www.topshop.com/anotherfakepathname',
          },
        })
        mount(
          <PlpContainer
            location={{
              ...defaultLocation,
              query: {
                currentPage: 3,
              },
            }}
          />,
          { store }
        )
        const link = Helmet.peek().linkTags[0]
        expect(link.rel).toBe('canonical')
        expect(link.href).toBe(
          'https://www.topshop.com/anotherfakepathname?currentPage=3&No=48'
        )
      })
    })
  })

  describe('@lifecycle', () => {
    const oldWindowNavigatorAgent = window.navigator.userAgent

    afterAll(() => {
      Object.defineProperty(global.navigator, 'userAgent', {
        get: () => oldWindowNavigatorAgent,
        configurable: true,
      })
    })

    describe('@componentDidMount', () => {
      describe('when it is not a search page', () => {
        it('should call setInfinityPage with the currentPage number', () => {
          const props = { ...initialProps, currentPage: 5 }
          expect(props.setInfinityPage).not.toHaveBeenCalled()

          const { instance } = renderComponent(props)

          instance.componentDidMount()

          expect(instance.props.setInfinityPage).toHaveBeenCalledWith(5)
        })
      })

      describe('when it is a search page', () => {
        it('should not call setInfinityPage', () => {
          const props = {
            ...initialProps,
            currentPage: 5,
            location: { ...defaultLocation, pathname: '/search/' },
          }
          expect(props.setInfinityPage).not.toHaveBeenCalled()

          const { instance } = renderComponent(props)

          instance.componentDidMount()

          expect(props.setInfinityPage).not.toHaveBeenCalled()
        })
      })

      it('should have called updateProductsLocation', async () => {
        const props = {
          ...initialProps,
          updateProductsLocation: jest.fn(),
          visited: ['category'],
          location: {
            ...defaultLocation,
            query: {
              category: 'category',
            },
          },
        }

        expect(props.updateProductsLocation).not.toHaveBeenCalled()

        const { instance } = renderComponent(props)

        instance.componentDidMount()

        expect(instance.props.updateProductsLocation).toHaveBeenCalledTimes(1)
      })

      it('should have called getProducts if no product when plpContainer is loaded', async () => {
        const props = {
          ...initialProps,
          products: undefined,
          getProducts: jest.fn(),
          visited: ['category'],
          location: {
            ...defaultLocation,
            pathname: '/filter/somefilter',
          },
        }

        const { instance } = renderComponent(props)
        instance.componentDidMount()
        expect(props.updateProductsLocation).not.toHaveBeenCalled()
        expect(instance.props.getProducts).toHaveBeenCalledTimes(1)
      })

      it('should not have called getProducts if on the search page and `locationQuery.q` is undefined', async () => {
        const props = {
          ...initialProps,
          products: undefined,
          getProducts: jest.fn(),
          location: {
            ...defaultLocation,
            pathname: '/search/',
          },
        }
        const { instance } = renderComponent(props)
        instance.componentDidMount()
        expect(instance.props.getProducts).not.toHaveBeenCalled()

        instance.componentDidMount({
          ...props,
          location: {
            ...defaultLocation,
            pathname: '/search',
          },
        })

        expect(instance.props.getProducts).not.toHaveBeenCalled()
      })

      it('should preserve scroll if IE11', async () => {
        const props = {
          ...initialProps,
          updateProductsLocation: jest.fn(),
          visited: ['category'],
          location: {
            ...defaultLocation,
            action: 'POP',
          },
        }
        expect(global.scrollTo).not.toHaveBeenCalled()

        const { instance } = renderComponent(props)

        const browserState = process.browser
        global.process.browser = true

        isIE11.mockImplementationOnce(() => true)

        instance.componentDidMount()

        expect(global.scrollTo).toHaveBeenCalledWith(0, 10)

        global.process.browser = browserState
      })

      it('should preserve scroll if Firefox', async () => {
        const props = {
          ...initialProps,
          updateProductsLocation: jest.fn(),
          visited: ['category'],
          location: {
            ...defaultLocation,
            action: 'POP',
          },
        }
        expect(global.scrollTo).not.toHaveBeenCalled()

        const { instance } = renderComponent(props)

        const browserState = process.browser
        global.process.browser = true

        isFF.mockImplementationOnce(() => true)

        instance.componentDidMount()

        expect(global.scrollTo).toHaveBeenCalledWith(0, 10)

        global.process.browser = browserState
      })

      it('should fetch products if not just server side rendered', () => {
        const props = {
          ...initialProps,
          visited: ['category', 'blah'],
        }

        expect(props.updateProductsLocation).not.toHaveBeenCalled()

        const { instance } = renderComponent(props)

        instance.componentDidMount()

        expect(instance.props.getProducts).toHaveBeenCalledTimes(1)
      })

      it('should not fetch products if just server side rendered', () => {
        const props = {
          ...initialProps,
          visited: ['category'],
        }

        expect(props.updateProductsLocation).not.toHaveBeenCalled()

        const { instance } = renderComponent(props)

        instance.componentDidMount()

        expect(instance.props.getProducts).not.toHaveBeenCalled()
      })

      describe('getTrendingProducts', () => {
        it('should call getTrendingProducts if PLP social proof enabled', () => {
          const props = {
            ...initialProps,
            isFeaturePLPSocialProofEnabled: true,
          }

          expect(props.getTrendingProducts).not.toHaveBeenCalled()

          const { instance } = renderComponent(props)

          instance.componentDidMount()

          expect(instance.props.getTrendingProducts).toHaveBeenCalledTimes(1)
        })

        it('should not call getTrendingProducts if PLP social proof disabled', () => {
          const props = {
            ...initialProps,
            isFeaturePLPSocialProofEnabled: false,
          }

          expect(props.getTrendingProducts).not.toHaveBeenCalled()

          const { instance } = renderComponent(props)

          instance.componentDidMount()

          expect(instance.props.getTrendingProducts).not.toHaveBeenCalled()
        })
      })

      describe('getSocialProofBanners', () => {
        it('should call getSocialProofBanners if PLP social proof enabled', () => {
          const props = {
            ...initialProps,
            isFeaturePLPSocialProofEnabled: true,
          }

          expect(props.getSocialProofBanners).not.toHaveBeenCalled()

          const { instance } = renderComponent(props)

          instance.componentDidMount()

          expect(instance.props.getSocialProofBanners).toHaveBeenCalledTimes(1)
        })
      })
    })

    describe('@UNSAFE_componentWillMount', () => {
      it('should call clearRefinements and clearSortOptions', () => {
        const props = {
          ...initialProps,
          clearRefinements: jest.fn(),
          clearSortOptions: jest.fn(),
        }

        expect(props.clearRefinements).not.toHaveBeenCalled()
        expect(props.clearSortOptions).not.toHaveBeenCalled()

        const { instance } = renderComponent(props)

        expect(instance.props.clearRefinements).toHaveBeenCalledTimes(1)
        expect(instance.props.clearSortOptions).toHaveBeenCalledTimes(1)
      })

      it('should NOT call clearRefinements and clearSortOptions if refinements is in the url query', () => {
        const props = {
          ...initialProps,
          clearRefinements: jest.fn(),
          clearSortOptions: jest.fn(),
          location: {
            ...defaultLocation,
            query: {
              refinements: 'colour:yellow',
            },
          },
        }

        expect(props.clearRefinements).not.toHaveBeenCalled()
        expect(props.clearSortOptions).not.toHaveBeenCalled()

        const { instance } = renderComponent(props)

        expect(instance.props.clearRefinements).not.toHaveBeenCalled()
        expect(instance.props.clearSortOptions).not.toHaveBeenCalled()
      })

      describe('reset product state in browser', () => {
        const isBrowser = process.browser

        beforeAll(() => {
          process.browser = true
        })

        afterAll(() => {
          process.browser = isBrowser
        })

        it('should not reset product state if it is an initial render', () => {
          const props = {
            ...initialProps,
            visited: ['/'],
            location: {
              pathname: 'abc',
              query: {},
            },
            productsLocation: {
              pathname: 'def',
              query: {},
            },
          }

          const { instance } = renderComponent(props)

          expect(instance.props.resetProductState).not.toHaveBeenCalled()
        })

        it('should reset product state if the PLP pathname has changed and is not an initial order', () => {
          const props = {
            ...initialProps,
            visited: ['/', '/'],
            location: {
              pathname: 'abc',
              query: {},
            },
            productsLocation: {
              pathname: 'def',
              query: {},
            },
          }

          const { instance } = renderComponent(props)

          expect(instance.props.resetProductState).toHaveBeenCalled()
        })

        it('should not reset product state if the PLP pathname and query object have not changed', () => {
          const props = {
            ...initialProps,
            visited: ['/', '/'],
            location: {
              pathname: 'abc',
              query: {
                currentPage: 1,
              },
            },
            productsLocation: {
              pathname: 'abc',
              query: {
                currentPage: 1,
              },
            },
          }

          renderComponent(props)

          expect(initialProps.resetProductState).not.toHaveBeenCalled()
        })

        it('should reset product state if the PLP query object has changed', () => {
          const props = {
            ...initialProps,
            visited: ['/', '/'],
            location: {
              pathname: 'abc',
              query: {
                currentPage: 1,
              },
            },
            productsLocation: {
              pathname: 'abc',
              query: {
                currentPage: 2,
              },
            },
          }

          expect(initialProps.resetProductState).not.toHaveBeenCalled()

          renderComponent(props)

          expect(initialProps.resetProductState).toHaveBeenCalledTimes(1)
        })
      })
    })

    describe('@UNSAFE_componentWillReceiveProps', () => {
      let browserHistoryReplaceSpy
      beforeEach(() => {
        browserHistoryReplaceSpy = jest.spyOn(browserHistory, 'replace')
      })

      it('should call loadingMoreProducts', () => {
        const getProducts = jest.fn()
        const { instance } = renderComponent({
          ...initialProps,
          isInfinityScrollActive: true,
          hasReachedPageBottom: false,
          getProducts,
        })
        const loadingMoreProductsSpy = jest.spyOn(
          instance,
          'loadingMoreProducts'
        )
        const nextProps = {
          isModalOpen: false,
          hasReachedPageBottom: true,
        }
        instance.UNSAFE_componentWillReceiveProps(nextProps)
        expect(loadingMoreProductsSpy).toHaveBeenCalled()
        expect(browserHistoryReplaceSpy).not.toHaveBeenCalled()
        expect(getProducts).not.toHaveBeenCalled()
      })

      it('should not call loadingMoreProducts', () => {
        const getProducts = jest.fn()
        const analyticsSetProducts = jest.fn()
        const { instance } = renderComponent({
          ...initialProps,
          isInfinityScrollActive: true,
          hasReachedPageBottom: false,
          getProducts,
          analyticsSetProducts,
        })
        const loadingMoreProductsSpy = jest.spyOn(
          instance,
          'loadingMoreProducts'
        )
        const nextProps = {
          isModalOpen: true,
          hasReachedPageBottom: true,
          location: {},
        }
        instance.UNSAFE_componentWillReceiveProps(nextProps)
        expect(loadingMoreProductsSpy).not.toHaveBeenCalled()
      })

      it('should not not call loadingMoreProducts if minibag is open', () => {
        const getProducts = jest.fn()
        const analyticsSetProducts = jest.fn()
        const { instance } = renderComponent({
          ...initialProps,
          isInfinityScrollActive: true,
          hasReachedPageBottom: false,
          getProducts,
          analyticsSetProducts,
          miniBagOpen: true,
        })
        const loadingMoreProductsSpy = jest.spyOn(
          instance,
          'loadingMoreProducts'
        )
        const nextProps = {
          isModalOpen: true,
          hasReachedPageBottom: true,
          location: {},
        }
        instance.UNSAFE_componentWillReceiveProps(nextProps)
        expect(loadingMoreProductsSpy).not.toHaveBeenCalled()
      })

      it('should browserHistory and getRouteFromUrl when not loading, has one product and visited length > 1', () => {
        const getRouteFromUrlSpy = jest.spyOn(productRoutes, 'getRouteFromUrl')

        const { instance } = renderComponent({
          ...initialProps,
          visited: [1, 2],
          redirectIfOneProduct: true,
        })

        expect(browserHistoryReplaceSpy).not.toHaveBeenCalled()
        expect(getRouteFromUrlSpy).not.toHaveBeenCalled()
        instance.UNSAFE_componentWillReceiveProps({
          isLoadingAll: false,
          products: [{ sourceUrl: 'someUrl' }],
          location: {
            action: 'blah',
          },
        })
        expect(browserHistoryReplaceSpy).toHaveBeenCalledTimes(1)
        expect(getRouteFromUrlSpy).toHaveBeenCalledTimes(1)
        expect(getRouteFromUrlSpy).toHaveBeenCalledWith('someUrl')
      })

      describe('Next location does not equal current location', () => {
        it('calls clearRefinements and getProducts when nextLocation.action is POP', () => {
          const { instance } = renderComponent({
            ...initialProps,
            clearRefinements: jest.fn(),
            getProducts: jest.fn(),
          })

          expect(instance.props.clearRefinements).toHaveBeenCalledTimes(1)
          expect(instance.props.getProducts).not.toHaveBeenCalled()

          instance.UNSAFE_componentWillReceiveProps({
            isLoadingAll: true,
            products: [{ sourceUrl: 'someUrl' }],
            location: {
              action: 'POP',
              pathname: 'someotherpathname',
            },
          })
          expect(instance.props.clearRefinements).toHaveBeenCalledTimes(2)
          expect(instance.props.getProducts).toHaveBeenCalledTimes(1)
        })

        it('calls getProducts but not clearRefinements when action is not POP', () => {
          const { instance } = renderComponent(initialProps)

          expect(instance.props.clearRefinements).toHaveBeenCalledTimes(1)
          expect(instance.props.getProducts).not.toHaveBeenCalled()

          instance.UNSAFE_componentWillReceiveProps({
            isLoadingAll: true,
            products: [{ sourceUrl: 'someUrl' }],
            location: {
              action: 'NOTPOP',
              pathname: 'someotherpathname',
            },
          })

          expect(instance.props.clearRefinements).toHaveBeenCalledTimes(1)
          expect(instance.props.getProducts).toHaveBeenCalledTimes(1)
          expect(instance.props.getProducts).toHaveBeenCalledWith({
            action: 'NOTPOP',
            pathname: 'someotherpathname',
          })
        })
      })

      describe('when isLoadingAll is false and next isLoadingAll is true', () => {
        it('should assign the value of the window.scrollY to the `scrollY` internal state', () => {
          const { instance } = renderComponent(initialProps)
          expect(instance.state.scrollY).toBe(0)
          global.scrollY = 50
          instance.UNSAFE_componentWillReceiveProps({
            isLoadingAll: true,
            products: [{ sourceUrl: 'someUrl' }],
            location: defaultLocation,
            refreshPlp: true,
          })

          expect(instance.state.scrollY).toBe(50)
        })
      })

      describe('when isLoadingAll and next isLoadingAll are both false', () => {
        it('should not assign the value of the window.scrollY to the `scrollY` internal state', () => {
          const { instance } = renderComponent(initialProps)
          expect(instance.state.scrollY).toBe(0)
          global.scrollY = 50
          expect(instance.state.scrollY).not.toBe(50)
          instance.UNSAFE_componentWillReceiveProps({
            isLoadingAll: false,
            products: [{ sourceUrl: 'someUrl' }],
            location: defaultLocation,
            refreshPlp: true,
          })
          expect(instance.state.scrollY).toBe(0)
        })
      })
    })

    describe('@componentWillUnmount', () => {
      it('should have called hideTacticalMessage', async () => {
        const props = {
          ...initialProps,
        }

        expect(props.hideTacticalMessage).not.toHaveBeenCalled()

        const { instance } = renderComponent(props)

        instance.componentWillUnmount()

        expect(props.hideTacticalMessage).toHaveBeenCalledTimes(1)
      })
    })

    describe('@componentDidUpdate', () => {
      describe('Auto scrolling', () => {
        const prevProps = {
          ...initialProps,
          isLoadingAll: true,
        }

        const newProps = {
          ...initialProps,
          isLoadingAll: false,
        }

        const { browser } = global.process

        beforeAll(() => {
          global.process.browser = true
        })

        beforeEach(() => {
          global.sandbox = {
            mapped: [],
          }
        })

        afterAll(() => {
          global.process.browser = browser
          global.sandbox = undefined
        })

        describe('should not scroll', () => {
          it('if isLoadingAll is false and previous isLoadingAll is false', async () => {
            const { instance } = renderComponent(newProps)

            expect(global.scrollTo).not.toHaveBeenCalled()
            instance.componentDidUpdate({
              ...prevProps,
              isLoadingAll: false,
            })
            expect(global.scrollTo).not.toHaveBeenCalled()
          })

          it('if isLoadingAll is true and previous isLoadingAll is true', async () => {
            const { instance } = renderComponent({
              ...newProps,
              isLoadingAll: true,
            })

            expect(global.scrollTo).not.toHaveBeenCalled()
            instance.componentDidUpdate(prevProps)
            expect(global.scrollTo).not.toHaveBeenCalled()
          })
        })

        describe('should scroll to the top', () => {
          it('on IE11', () => {
            const { instance } = renderComponent({
              ...newProps,
            })

            isIE11.mockImplementationOnce(() => true)

            instance.componentDidUpdate({
              ...prevProps,
              isMobile: true,
            })

            expect(global.scrollTo).toHaveBeenCalledWith(0, 0)
          })

          it('the category is changed', () => {
            const { instance } = renderComponent({
              ...newProps,
              breadcrumbs: [{ label: 'foo' }],
            })

            getCategoryFromBreadcrumbs.mockImplementationOnce((item) => item[0])

            instance.componentDidUpdate({
              ...prevProps,
              breadcrumbs: [{ label: 'bar' }],
            })

            expect(global.scrollTo).toHaveBeenCalledWith(0, 0)
          })

          it('window.sandbox.mapped is not initialised', () => {
            const { instance } = renderComponent({
              ...newProps,
            })

            global.sandbox.mapped = undefined
            instance.componentDidUpdate(prevProps)

            expect(global.scrollTo).toHaveBeenCalledWith(0, 0)
          })

          it('the view is above the filter row', () => {
            const { instance } = renderComponent({
              ...newProps,
              megaNavHeight: 50,
            })

            instance.ResultSectionRef = { current: { offsetTop: 500 } }
            instance.setState({ scrollY: 100 })

            instance.componentDidUpdate(prevProps)
            expect(global.scrollTo).toHaveBeenCalledWith(0, 0)
          })
        })

        describe('should scroll to the results section', () => {
          const catHeaderResponsiveCmsUrl = 'path/to/json'

          it('immediately if there is no category header', () => {
            const { instance } = renderComponent({
              ...newProps,
              megaNavHeight: 50,
            })

            instance.ResultSectionRef = { current: { offsetTop: 500 } }
            instance.setState({ scrollY: 501 })

            instance.componentDidUpdate(prevProps)
            expect(global.scrollTo).toHaveBeenCalledWith(0, 500)
          })

          it('immediately if the category header is already mapped', () => {
            const { instance } = renderComponent({
              ...newProps,
              megaNavHeight: 50,
              catHeaderResponsiveCmsUrl,
            })

            instance.ResultSectionRef = { current: { offsetTop: 500 } }
            instance.setState({ scrollY: 501 })

            global.sandbox.mapped.push(
              encodeURIComponent(catHeaderResponsiveCmsUrl)
            )

            instance.componentDidUpdate(prevProps)
            expect(global.scrollTo).toHaveBeenCalledWith(0, 500)
          })

          it('Once the category header has loaded', async (done) => {
            const { instance } = renderComponent({
              ...newProps,
              megaNavHeight: 50,
              catHeaderResponsiveCmsUrl,
            })

            instance.ResultSectionRef = { current: { offsetTop: 500 } }
            instance.PlpHeaderRef = { current: { offsetTop: 500 } }

            instance.setState({ scrollY: 501 })

            cmsUtilities.removeListener = jest.fn()
            cmsUtilities.registerListener = jest.fn((operation, fn) => {
              const sandboxRef = encodeURIComponent(catHeaderResponsiveCmsUrl)

              fn('', '', sandboxRef)
              expect(global.scrollTo).toHaveBeenCalledWith(0, 500)
              done()
            })

            instance.componentDidUpdate(prevProps)
          })

          it('should call scroll to the right position with `isFeatureStickyHeaderEnabled`', () => {
            const { instance } = renderComponent(newProps)

            instance.ResultSectionRef = { current: { offsetTop: 500 } }
            instance.setState({ scrollY: 501 })

            expect(global.scrollTo).not.toHaveBeenCalled()
            instance.componentDidUpdate(prevProps)

            expect(global.scrollTo).toHaveBeenCalledWith(0, 500)
          })
          it('should call scroll To whith the right params', () => {
            const { instance } = renderComponent({
              ...newProps,
              isFeatureStickyHeaderEnabled: false,
              megaNavHeight: 0,
            })

            instance.ResultSectionRef = { current: { offsetTop: 500 } }
            instance.setState({ scrollY: 1000 })

            expect(global.scrollTo).not.toHaveBeenCalled()
            instance.componentDidUpdate(prevProps)

            expect(global.scrollTo).toHaveBeenCalledWith(0, 500)
          })
        })

        describe('when isMobile', () => {
          describe('should scroll to the PlpHeader section', () => {
            const catHeaderResponsiveCmsUrl = 'path/to/json'
            it('immediately if there is no category header', () => {
              const { instance } = renderComponent({
                ...newProps,
                megaNavHeight: 50,
                isMobile: true,
              })

              instance.PlpHeaderRef = { current: { offsetTop: 500 } }
              instance.setState({ scrollY: 501 })
              instance.componentDidUpdate(prevProps)

              expect(global.scrollTo).toHaveBeenCalledWith({
                behavior: 'smooth',
                left: 0,
                top: 500,
              })
            })

            it('immediately if the category header is already mapped', () => {
              const { instance } = renderComponent({
                ...newProps,
                megaNavHeight: 50,
                isMobile: true,
                catHeaderResponsiveCmsUrl,
              })

              instance.PlpHeaderRef = { current: { offsetTop: 500 } }
              instance.setState({ scrollY: 501 })

              global.sandbox.mapped.push(
                encodeURIComponent(catHeaderResponsiveCmsUrl)
              )

              instance.componentDidUpdate(prevProps)
              expect(global.scrollTo).toHaveBeenCalledWith({
                behavior: 'smooth',
                left: 0,
                top: 500,
              })
            })

            it('Once the category header has loaded', async (done) => {
              const { instance } = renderComponent({
                ...newProps,
                megaNavHeight: 50,
                isMobile: true,
                catHeaderResponsiveCmsUrl,
              })

              instance.ResultSectionRef = { current: { offsetTop: 500 } }
              instance.PlpHeaderRef = { current: { offsetTop: 500 } }
              instance.setState({ scrollY: 501 })

              cmsUtilities.removeListener = jest.fn()
              cmsUtilities.registerListener = jest.fn((operation, fn) => {
                const sandboxRef = encodeURIComponent(catHeaderResponsiveCmsUrl)

                fn('', '', sandboxRef)
                expect(global.scrollTo).toHaveBeenCalledWith({
                  behavior: 'smooth',
                  left: 0,
                  top: 500,
                })
                done()
              })

              instance.componentDidUpdate(prevProps)
            })

            it('should call scroll to the right position with `isFeatureStickyHeaderEnabled`', () => {
              const { instance } = renderComponent({
                ...newProps,
                isMobile: true,
              })

              instance.PlpHeaderRef = { current: { offsetTop: 500 } }
              instance.setState({ scrollY: 501 })

              expect(global.scrollTo).not.toHaveBeenCalled()
              instance.componentDidUpdate(prevProps)

              expect(global.scrollTo).toHaveBeenCalledWith({
                behavior: 'smooth',
                left: 0,
                top: 500,
              })
            })

            it('should call scroll To whith the right params', () => {
              const { instance } = renderComponent({
                ...newProps,
                isFeatureStickyHeaderEnabled: false,
                isMobile: true,
                megaNavHeight: 0,
              })

              instance.PlpHeaderRef = { current: { offsetTop: 500 } }
              instance.setState({ scrollY: 1000 })

              expect(global.scrollTo).not.toHaveBeenCalled()
              instance.componentDidUpdate(prevProps)

              expect(global.scrollTo).toHaveBeenCalledWith({
                behavior: 'smooth',
                left: 0,
                top: 500,
              })
            })

            it('immediately if sandbox.mapped array does not contain the catHeaderResponsiveCmsUrl', () => {
              const { instance } = renderComponent({
                ...newProps,
                megaNavHeight: 50,
                isMobile: true,
                catHeaderResponsiveCmsUrl,
              })

              instance.PlpHeaderRef = { current: { offsetTop: 500 } }
              instance.ResultSectionRef = { current: { offsetTop: 500 } }

              instance.setState({ scrollY: 501 })

              global.sandbox.mapped.push(
                encodeURIComponent('path/to/anotherJson')
              )

              instance.componentDidUpdate(prevProps)
              expect(global.scrollTo).toHaveBeenCalledWith({
                behavior: 'smooth',
                left: 0,
                top: 500,
              })
            })
          })

          describe('when category has changed', () => {
            it('should scroll to the top of the page', () => {
              const { instance } = renderComponent({
                ...newProps,
                breadcrumbs: [{ label: 'foo' }],
                isMobile: true,
              })

              getCategoryFromBreadcrumbs.mockImplementationOnce(
                (item) => item[0]
              )

              instance.componentDidUpdate({
                ...prevProps,
                breadcrumbs: [{ label: 'bar' }],
              })

              expect(global.scrollTo).toHaveBeenCalledWith(0, 0)
            })
          })
        })
      })
    })
  })

  describe('@component helpers', () => {
    describe('composeCategoryBanner', () => {
      it('should return encoded html data from encodedcmsMobileContent for category banner', () => {
        const props = {
          ...initialProps,
          products: {
            categoryBanner: {
              encodedcmsMobileContent: 'mock_encoded_html_data',
            },
          },
        }
        const store = mockStoreCreator(props)
        const state = store.getState()
        const banner = composeCategoryBanner(state)
        expect(banner).toEqual('mock_encoded_html_data')
      })
      it('should return encoded html data from bannerHtml as a fallback for category banner', () => {
        const props = {
          ...initialProps,
          products: {
            categoryBanner: {
              bannerHtml: 'fallback_html_encoded',
            },
          },
        }
        const store = mockStoreCreator(props)
        const state = store.getState()
        const banner = composeCategoryBanner(state)
        expect(banner).toEqual('fallback_html_encoded')
      })
      it('should return empty string if no categoryBanner', () => {
        const props = {
          ...initialProps,
          products: {
            categoryBanner: {},
          },
        }
        const store = mockStoreCreator(props)
        const state = store.getState()
        const banner = composeCategoryBanner(state)
        expect(banner).toEqual('')
      })
    })
  })
})
