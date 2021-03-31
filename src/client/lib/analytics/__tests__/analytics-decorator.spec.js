/** Analytics Decorator
 * == ENZO == Sync Component (done)
 * == ENZO == Async Component (Call API, activate spinner) (done?)
 * - Async Component (Call Multiple API)
 * - Async Component (Call Multiple API, need params) (PLP, PDP)
 * - Async Component Home/CMS
 * - Server Side Render
 * - ComponentWillUnmount (change/close page before finish TimeLoader/Measurement)
 * - Page % Measurement
 * - PLP % Measurement
 */
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import React from 'react'
import { createStore } from 'redux'

import * as analyticsActions from '../../../../shared/actions/common/analyticsActions'
import * as pageTypeActions from '../../../../shared/actions/common/pageTypeActions'
import analyticsDecorator from '../analytics-decorator'

jest.mock(
  '../../../../shared/lib/routing/v2/checkout/checkout-helpers',
  () => ({
    hasDeliveryAddress: jest.fn(),
    hasCreditCard: jest.fn(),
  })
)

jest.mock('../../../../shared/constants/espotsMobile', () => ({
  home: ['espotCmsPage1', 'espotCmsPage2'],
  plp: ['espotPlpPage1'],
}))

const generateSampleProducts = (productsNumber) => {
  const products = []
  for (let i = 0; i < productsNumber; i++) {
    products.push({})
  }
  return products
}

describe('Analytics Decorator', () => {
  const MockComponent = () => <div>Mock Component</div>

  analyticsActions.pageLoaded = jest.fn(() => ({ type: 'PAGE_LOADED' }))

  const storeListenerMock = jest.fn()

  const nowMock = jest.spyOn(Date, 'now')

  const createMockStore = (preloadedState = {}) => {
    return createStore(
      (state, action) =>
        action.type === 'UPDATE_STATE'
          ? { ...state, ...action.payload }
          : state,
      {
        routing: {
          visited: ['/', '/somewhere/else'],
          location: {
            pathname: '/checkout/login',
          },
        },
        loaderOverlay: {
          visible: false,
        },
        checkout: {
          orderSummary: {},
        },
        sandbox: {
          pages: {},
        },
        storeLocator: {
          loading: false,
          stores: [],
        },
        products: {
          products: null,
          isLoadingAll: true,
        },
        currentProduct: {},
        account: {
          user: {},
        },
        quickview: {
          product: {},
        },
        modal: {
          open: false,
          mode: 'normal',
        },
        ...preloadedState,
      }
    )
  }

  const updateStateAction = (payload) => ({
    type: 'UPDATE_STATE',
    payload,
  })

  beforeAll(() => {
    global.s = {
      Util: {
        cookieWrite: jest.fn(),
      },
    }
    global.window.performance.timing = { navigationStart: 1000 }
  })

  beforeEach(() => {
    analyticsActions.pageLoaded.mockClear()
    nowMock.mockReturnValue(2000)
    jest.useFakeTimers()
  })

  afterEach(() => {
    storeListenerMock.mockClear()
    nowMock.mockClear()
    jest.clearAllTimers()
  })

  afterAll(() => {
    analyticsActions.pageLoaded.mockRestore()
    nowMock.mockRestore()
  })

  it('should be a function', () => {
    expect(typeof analyticsDecorator('some-page')).toBe('function')
  })

  describe('Sync Component', () => {
    it('should match snapshot', () => {
      const AnalyticsSyncComponent = analyticsDecorator('some-page')(
        MockComponent
      )
      const analyticsSyncComponent = mount(<AnalyticsSyncComponent />, {
        context: {
          store: createMockStore(),
        },
      })
      expect(toJson(analyticsSyncComponent)).toMatchSnapshot()
    })

    it('should call `pageLoadedAction` on componentDidMount', () => {
      const mockStore = createMockStore()
      const AnalyticsSyncComponent = analyticsDecorator('some-page')(
        MockComponent
      )
      mount(<AnalyticsSyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledTimes(1)
    })

    it('should call `pageLoadedAction` with `pageName` and `loadTime`', () => {
      const mockStore = createMockStore()
      const AnalyticsSyncComponent = analyticsDecorator('some-page')(
        MockComponent
      )
      mount(<AnalyticsSyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledWith('some-page', 0)
    })

    it('should use the Navigation Timing API for the start time if this is the initial render', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/'],
          location: {
            pathname: '/',
          },
        },
      })
      const AnalyticsSyncComponent = analyticsDecorator('some-page')(
        MockComponent
      )
      mount(<AnalyticsSyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledWith(
        'some-page',
        1000
      )
    })
  })

  describe('Async Component', () => {
    it('should match snapshot', () => {
      const AnalyticsAsyncComponent = analyticsDecorator('some-page', {
        isAsync: true,
      })(MockComponent)
      const analyticsAsyncComponent = mount(<AnalyticsAsyncComponent />, {
        context: {
          store: createMockStore(),
        },
      })
      expect(toJson(analyticsAsyncComponent)).toMatchSnapshot()
    })

    it('should not call `pageLoadedAction` on componentDidMount', () => {
      const mockStore = createMockStore()
      const AnalyticsAsyncComponent = analyticsDecorator('some-page', {
        isAsync: true,
      })(MockComponent)
      mount(<AnalyticsAsyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).not.toHaveBeenCalledWith()
    })

    it('should DON`T call `pageLoadedAction` on componentWillUnmount', () => {
      const mockStore = createMockStore()
      const AnalyticsAsyncComponent = analyticsDecorator('some-page', {
        isAsync: true,
      })(MockComponent)

      const wrapper = mount(<AnalyticsAsyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).not.toHaveBeenCalled()
      wrapper.unmount()
      // WE REMOVE COMPONENT WILL MOUNT A THE MOMENT
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).not.toHaveBeenCalled()
    })

    it('should call `pageLoadedAction` when component has finished loading', () => {
      const mockStore = createMockStore()
      const AnalyticsAsyncComponent = analyticsDecorator('some-page', {
        isAsync: true,
      })(MockComponent)
      mount(<AnalyticsAsyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      mockStore.dispatch(
        updateStateAction({
          loaderOverlay: {
            visible: true,
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).not.toHaveBeenCalled()
      mockStore.dispatch(
        updateStateAction({
          loaderOverlay: {
            visible: false,
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledTimes(1)
    })

    it('should call `pageLoadedAction` with `pageName` and `loadTime`', () => {
      const mockStore = createMockStore()
      const AnalyticsAsyncComponent = analyticsDecorator('some-page', {
        isAsync: true,
      })(MockComponent)
      mount(<AnalyticsAsyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      nowMock.mockReturnValue(3000)
      mockStore.dispatch(
        updateStateAction({
          loaderOverlay: {
            visible: true,
          },
        })
      )
      mockStore.dispatch(
        updateStateAction({
          loaderOverlay: {
            visible: false,
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledWith(
        'some-page',
        1000
      )
    })

    it('should reset when moving to a new page - pathname is changing', () => {
      const mockStore = createMockStore()
      const AnalyticsAsyncComponent = analyticsDecorator('some-page', {
        isAsync: true,
      })(MockComponent)
      mount(<AnalyticsAsyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      nowMock.mockReturnValue(3000)
      mockStore.dispatch(
        updateStateAction({
          loaderOverlay: {
            visible: true,
          },
        })
      )
      mockStore.dispatch(
        updateStateAction({
          loaderOverlay: {
            visible: false,
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledWith(
        'some-page',
        1000
      )
      // emulate moving to a new page
      mockStore.dispatch(
        updateStateAction({
          routing: {
            visited: ['/', '/somewhere/else'],
            location: {
              pathname: '/somewhere/else',
            },
          },
        })
      )
      nowMock.mockReturnValue(5000)
      mockStore.dispatch(
        updateStateAction({
          loaderOverlay: {
            visible: true,
          },
        })
      )
      mockStore.dispatch(
        updateStateAction({
          loaderOverlay: {
            visible: false,
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledWith(
        'some-page',
        2000
      )
      expect(analyticsActions.pageLoaded).toHaveBeenCalledTimes(2)
    })

    it('should reset when moving to a new page - search is changing', () => {
      const mockStore = createMockStore()
      const AnalyticsAsyncComponent = analyticsDecorator('some-page', {
        isAsync: true,
      })(MockComponent)
      mount(<AnalyticsAsyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      nowMock.mockReturnValue(3000)
      mockStore.dispatch(
        updateStateAction({
          loaderOverlay: {
            visible: true,
          },
        })
      )
      mockStore.dispatch(
        updateStateAction({
          loaderOverlay: {
            visible: false,
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledWith(
        'some-page',
        1000
      )
      // emulate moving to a new page
      mockStore.dispatch(
        updateStateAction({
          routing: {
            visited: ['/', '/somewhere/else'],
            location: {
              pathname: '/checkout/login',
              search: '?search=sth',
            },
          },
        })
      )
      nowMock.mockReturnValue(5000)
      mockStore.dispatch(
        updateStateAction({
          loaderOverlay: {
            visible: true,
          },
        })
      )
      mockStore.dispatch(
        updateStateAction({
          loaderOverlay: {
            visible: false,
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledWith(
        'some-page',
        2000
      )
      expect(analyticsActions.pageLoaded).toHaveBeenCalledTimes(2)
    })

    it('should use the Navigation Timing API for the start time if this is the initial render', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/'],
          location: {
            pathname: '/',
          },
        },
      })
      const AnalyticsAsyncComponent = analyticsDecorator('some-page', {
        isAsync: true,
      })(MockComponent)
      mount(<AnalyticsAsyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      mockStore.dispatch(
        updateStateAction({
          loaderOverlay: {
            visible: true,
          },
        })
      )
      mockStore.dispatch(
        updateStateAction({
          loaderOverlay: {
            visible: false,
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledWith(
        'some-page',
        1000
      )
    })

    it('should assume component has already loaded if this is an initial render', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/'],
          location: {
            pathname: '/',
          },
        },
      })
      const AnalyticsAsyncComponent = analyticsDecorator('some-page', {
        isAsync: true,
      })(MockComponent)
      mount(<AnalyticsAsyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledTimes(1)
    })

    it('should only call `pageLoadedAction` once', () => {
      const mockStore = createMockStore()
      const AnalyticsAsyncComponent = analyticsDecorator('some-page', {
        isAsync: true,
      })(MockComponent)
      mount(<AnalyticsAsyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      mockStore.dispatch(
        updateStateAction({
          loaderOverlay: {
            visible: true,
          },
        })
      )
      mockStore.dispatch(
        updateStateAction({
          loaderOverlay: {
            visible: false,
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalled()
      mockStore.dispatch(
        updateStateAction({
          loaderOverlay: {
            visible: true,
          },
        })
      )
      mockStore.dispatch(
        updateStateAction({
          loaderOverlay: {
            visible: false,
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledTimes(1)
    })

    it('Should call pageLoaded action if product.isPreloaded changes', () => {
      const mockStore = createMockStore()
      const AnalyticsComponent = analyticsDecorator('pdp', {
        isAsync: true,
      })(MockComponent)

      mockStore.dispatch(
        updateStateAction({
          currentProduct: {
            isPreloaded: true,
          },
        })
      )

      mount(<AnalyticsComponent />, {
        context: {
          store: mockStore,
        },
      })

      jest.runAllTimers()

      expect(analyticsActions.pageLoaded).not.toHaveBeenCalled()

      mockStore.dispatch(
        updateStateAction({
          currentProduct: {
            isPreloaded: false,
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledTimes(1)
    })
  })

  describe('Home Component', () => {
    it('should call `pageLoadedAction` when the home cms page is loaded', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/some-else', '/'],
          location: {
            pathname: '/',
          },
        },
      })
      const AnalyticsHomeComponent = analyticsDecorator('home', {
        isAsync: true,
      })(MockComponent)
      mount(<AnalyticsHomeComponent />, {
        context: {
          store: mockStore,
        },
      })
      mockStore.dispatch(
        updateStateAction({
          sandbox: {
            pages: {
              home: {},
              mobileHomepageESpotPos1: {},
            },
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledTimes(1)
    })
    it('should not dispatch if not on home location', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/', '/some-else'],
          location: {
            pathname: '/some-else',
          },
        },
      })
      const AnalyticsHomeComponent = analyticsDecorator('home', {
        isAsync: true,
      })(MockComponent)
      mount(<AnalyticsHomeComponent />, {
        context: {
          store: mockStore,
        },
      })
      mockStore.dispatch(
        updateStateAction({
          sandbox: {
            pages: {
              home: {},
              mobileHomepageESpotPos1: {},
            },
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).not.toHaveBeenCalled()
    })
  })

  describe('CMS Component', () => {
    it('should call `pageLoadedAction` when sandbox pages load', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/somewhere/else', '/some-cms-page'],
          location: {
            pathname: '/some-cms-page',
          },
        },
      })
      const AnalyticsHomeComponent = analyticsDecorator('mrCms-pages', {
        isAsync: true,
      })(MockComponent)
      mount(<AnalyticsHomeComponent />, {
        context: {
          store: mockStore,
        },
      })
      mockStore.dispatch(
        updateStateAction({
          sandbox: {
            pages: {
              '/some-other-cms-page': {},
            },
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).not.toHaveBeenCalled()
      mockStore.dispatch(
        updateStateAction({
          sandbox: {
            pages: {},
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).not.toHaveBeenCalled()
      mockStore.dispatch(
        updateStateAction({
          sandbox: {
            pages: {
              '/some-page-data': {},
              '/some-cms-page': {},
            },
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledTimes(1)
    })

    it('should call `pageLoadedAction` when terms and conditions page have loaded', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/somewhere/else', '/some-terms-and-conditions-page'],
          location: {
            pathname: '/some-terms-and-conditions-page',
          },
        },
      })
      const AnalyticsHomeComponent = analyticsDecorator('mrCms-pages', {
        isAsync: true,
      })(MockComponent)
      mount(<AnalyticsHomeComponent />, {
        context: {
          store: mockStore,
        },
      })
      mockStore.dispatch(
        updateStateAction({
          sandbox: {
            pages: {
              termsAndConditions: {},
            },
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledTimes(1)
    })

    it('should call `pageLoadedAction` when not found page have loaded', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/somewhere/else', '/some-wrong-page'],
          location: {
            pathname: '/some-wrong-page',
          },
        },
      })
      const AnalyticsHomeComponent = analyticsDecorator('mrCms-pages', {
        isAsync: true,
      })(MockComponent)
      mount(<AnalyticsHomeComponent />, {
        context: {
          store: mockStore,
        },
      })
      mockStore.dispatch(
        updateStateAction({
          sandbox: {
            pages: {
              notFound: {},
            },
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledTimes(1)
    })

    it('should call `pageLoadedAction` when size guide page have loaded', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/somewhere/else', '/size-guide/IvyPark'],
          location: {
            pathname: '/size-guide/IvyPark',
          },
        },
      })
      const AnalyticsHomeComponent = analyticsDecorator('mrCms-pages', {
        isAsync: true,
      })(MockComponent)
      mount(<AnalyticsHomeComponent />, {
        context: {
          store: mockStore,
        },
      })
      mockStore.dispatch(
        updateStateAction({
          sandbox: {
            pages: {
              IvyPark: {},
            },
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledTimes(1)
    })

    it('should not call `pageLoadedAction` when navSocial', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/somewhere/else', '/some-page'],
          location: {
            pathname: '/some-page',
          },
        },
      })
      const AnalyticsHomeComponent = analyticsDecorator('mrCms-pages', {
        isAsync: true,
      })(MockComponent)
      mount(<AnalyticsHomeComponent />, {
        context: {
          store: mockStore,
        },
      })
      mockStore.dispatch(
        updateStateAction({
          sandbox: {
            pages: {
              navSocial: {},
            },
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).not.toHaveBeenCalled()
    })

    it('should not call `pageLoadedAction` when espot', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/somewhere/else', '/some-page'],
          location: {
            pathname: '/some-page',
          },
        },
      })
      const AnalyticsHomeComponent = analyticsDecorator('mrCms-pages', {
        isAsync: true,
      })(MockComponent)
      mount(<AnalyticsHomeComponent cmsPageName="espotCmsPage1" />, {
        context: {
          store: mockStore,
        },
      })
      mockStore.dispatch(
        updateStateAction({
          sandbox: {
            pages: {
              espotCmsPage1: {},
            },
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).not.toHaveBeenCalled()
    })

    it('should not call `pageLoadedAction` on the homepage', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/somewhere/else', '/'],
          location: {
            pathname: '/',
          },
        },
      })
      const AnalyticsHomeComponent = analyticsDecorator('mrCms-pages', {
        isAsync: true,
      })(MockComponent)
      mount(<AnalyticsHomeComponent />, {
        context: {
          store: mockStore,
        },
      })
      mockStore.dispatch(
        updateStateAction({
          sandbox: {
            pages: {
              termsAndConditions: {},
            },
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).not.toHaveBeenCalled()
    })
  })

  it('should not call `pageLoadedAction` on the homepage server-side', () => {
    const mockStore = createMockStore({
      routing: {
        visited: ['/'],
        location: {
          pathname: '/',
        },
      },
    })
    const AnalyticsHomeComponent = analyticsDecorator('mrCms-pages', {
      isAsync: true,
    })(MockComponent)
    mount(<AnalyticsHomeComponent />, {
      context: {
        store: mockStore,
      },
    })
    jest.runAllTimers()
    expect(analyticsActions.pageLoaded).not.toHaveBeenCalled()
  })

  describe('PDP Component Container', () => {
    it('should call not `mrCms-pages` when on pdp page', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/'],
          location: {
            pathname: '/product/123',
          },
        },
      })
      const AnalyticsHomeComponent = analyticsDecorator('mrCms-pages', {
        isAsync: true,
      })(MockComponent)
      mount(<AnalyticsHomeComponent />, {
        context: {
          store: mockStore,
        },
      })
      expect(analyticsActions.pageLoaded).toHaveBeenCalledTimes(0)
    })
  })

  describe('PLP Component Container', () => {
    // State -> Products -> isLoadingAll
    it('should call `pageLoadedAction` when all products are loaded', () => {
      const mockStore = createMockStore()
      const AnalyticsHomeComponent = analyticsDecorator('plp', {
        isAsync: true,
      })(MockComponent)
      mount(<AnalyticsHomeComponent />, {
        context: {
          store: mockStore,
        },
      })
      /* We emulate PLP
      * 1) REMOVE_PRODUCTS
      * 2) LOADING_PRODUCTS
      * 3) SET_PRODUCTS
      * */
      mockStore.dispatch(
        updateStateAction({
          // REMOVE_PRODUCTS
          products: {
            products: null, // on real actions products object is removed, we emulate clearing the array
            isLoadingAll: true,
          },
        })
      )
      mockStore.dispatch(
        updateStateAction({
          // LOADING_PRODUCTS
          products: {
            products: [],
            isLoadingAll: true,
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).not.toHaveBeenCalled()
      mockStore.dispatch(
        updateStateAction({
          // SET_PRODUCTS
          products: {
            products: ['dsdsd', 'asdada'],
            isLoadingAll: false,
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledTimes(1)
      // If Activate infinite scrolling should NOT call page load Again
      mockStore.dispatch(
        updateStateAction({
          routing: {
            visited: ['/', '/somewhere/else'],
            location: {
              search: 'currentPage=2',
              pathname: '/checkout/login',
            },
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledTimes(1)
    })
    it('should call `pageLoadedAction` when goes back to the same PLP page', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/category/dresses', '/', '/category/dresses'],
          location: {
            pathname: '/category/dresses',
            query: {
              q: 'q',
              category: 'dresses',
            },
          },
        },
        products: {
          location: {
            pathname: '/category/dresses',
            query: {
              q: 'q',
              category: 'dresses',
            },
          },
          products: [{}, {}],
          isLoadingAll: false,
        },
      })
      const AnalyticsHomeComponent = analyticsDecorator('plp', {
        isAsync: true,
      })(MockComponent)
      mount(<AnalyticsHomeComponent />, {
        context: {
          store: mockStore,
        },
      })
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledTimes(1)
    })
  })

  describe('Store Locator', () => {
    it('should call `pageLoadedAction` when store-locator loaded Server Side', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/store-locator'],
          location: {
            pathname: 'store-locator',
          },
        },
      })
      const AnalyticsHomeComponent = analyticsDecorator('store-locator', {
        isAsync: true,
      })(MockComponent)
      mount(<AnalyticsHomeComponent />, {
        context: {
          store: mockStore,
        },
      })
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledTimes(1)
    })

    it('should call `pageLoadedAction` when store-locator stores loaded', () => {
      const mockStore = createMockStore()
      const AnalyticsHomeComponent = analyticsDecorator('store-locator', {
        isAsync: true,
      })(MockComponent)
      mount(<AnalyticsHomeComponent />, {
        context: {
          store: mockStore,
        },
      })
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).not.toHaveBeenCalled()
      mockStore.dispatch(
        updateStateAction({
          storeLocator: {
            stores: [],
            loading: true,
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).not.toHaveBeenCalled()
      mockStore.dispatch(
        updateStateAction({
          storeLocator: {
            loading: true,
            stores: ['Oxford', 'Bologna'],
          },
        })
      )
      expect(analyticsActions.pageLoaded).not.toHaveBeenCalled()
      mockStore.dispatch(
        updateStateAction({
          storeLocator: {
            stores: ['Oxford', 'Bologna'],
            loading: false,
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledTimes(1)
    })

    it('should call not `pageLoadedAction` when in collect-from-store', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/some-else', '/checkout/delivery/collect-from-store'],
          location: {
            pathname: '/checkout/delivery/collect-from-store',
          },
        },
      })
      const AnalyticsHomeComponent = analyticsDecorator('store-locator', {
        isAsync: true,
      })(MockComponent)
      mount(<AnalyticsHomeComponent />, {
        context: {
          store: mockStore,
        },
      })
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).not.toHaveBeenCalled()
      mockStore.dispatch(
        updateStateAction({
          storeLocator: {
            stores: [],
            loading: true,
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).not.toHaveBeenCalled()
      mockStore.dispatch(
        updateStateAction({
          storeLocator: {
            loading: true,
            stores: ['Oxford', 'Bologna'],
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).not.toHaveBeenCalled()
      mockStore.dispatch(
        updateStateAction({
          storeLocator: {
            stores: ['Oxford', 'Bologna'],
            loading: false,
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).not.toHaveBeenCalled()
    })
  })

  describe('FindStore PDP', () => {
    const mockStore = createMockStore({
      routing: {
        visited: ['/category/shoes/', 'shoes'],
        location: {
          pathname: '/shoes',
        },
      },
    })
    it('onComponentDidMount don`t dispatch pageLoaded', () => {
      const FindStoreDecorated = analyticsDecorator('find-in-store', {
        isAsync: true,
      })(MockComponent)
      mount(<FindStoreDecorated />, {
        context: {
          store: mockStore,
        },
      })
      expect(analyticsActions.pageLoaded).not.toHaveBeenCalled()
    })
    it('should dispatch pageLoaded when new stores are loaded', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/category/shoes/', 'shoes'],
          location: {
            pathname: '/shoes',
          },
        },
      })
      const FindStoreDecorated = analyticsDecorator('find-in-store', {
        isAsync: true,
      })(MockComponent)
      mount(<FindStoreDecorated />, {
        context: {
          store: mockStore,
        },
      })
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).not.toHaveBeenCalled() // on first mount nothing
      // Emulate new props (put loading true)
      mockStore.dispatch(
        updateStateAction({
          storeLocator: {
            stores: [],
            loading: true,
          },
        })
      )
      mockStore.dispatch(
        updateStateAction({
          storeLocator: {
            loading: true,
            stores: ['Oxford', 'Bologna'],
          },
        })
      )
      mockStore.dispatch(
        updateStateAction({
          storeLocator: {
            stores: ['Oxford', 'Bologna'],
            loading: false,
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledTimes(1)
    })
  })

  describe('Collect From Store', () => {
    it('should dispatch pageLoaded when new stores are loaded', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/category/shoes/', 'shoes'],
          location: {
            pathname: '/shoes',
          },
        },
      })
      const FindStoreDecorated = analyticsDecorator('collect-from-store', {
        isAsync: true,
      })(MockComponent)
      mount(<FindStoreDecorated />, {
        context: {
          store: mockStore,
        },
      })
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).not.toHaveBeenCalled() // on first mount nothing
      // Emulate new props (put loading true)
      mockStore.dispatch(
        updateStateAction({
          storeLocator: {
            stores: [],
            loading: true,
          },
        })
      )
      mockStore.dispatch(
        updateStateAction({
          storeLocator: {
            loading: true,
            stores: ['Oxford', 'Bologna'],
          },
        })
      )
      mockStore.dispatch(
        updateStateAction({
          storeLocator: {
            stores: ['Oxford', 'Bologna'],
            loading: false,
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledTimes(1)
    })
  })

  describe('PDP component full render', () => {
    it('should call `pageLoadedAction` when currentProduct is defined', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/category/shoes/', 'shoes'],
          location: {
            pathname: '/shoes',
          },
        },
      })
      const AnalyticsPDPcomponent = analyticsDecorator('pdp', {
        isAsync: true,
      })(MockComponent)
      mount(<AnalyticsPDPcomponent />, {
        context: {
          store: mockStore,
        },
      })
      mockStore.dispatch(
        updateStateAction({
          currentProduct: {
            price: '35.00',
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledTimes(1)
    })
  })

  describe('BazaarVoiceReview', () => {
    it('should call `pageLoadedAction` when authenticated', () => {
      const mockStore = createMockStore({
        auth: {
          authentication: 'full',
        },
      })
      const AnalyticsBazaarVoiceComponent = analyticsDecorator(
        'write-a-review'
      )(MockComponent)
      mount(<AnalyticsBazaarVoiceComponent />, {
        context: { store: mockStore },
      })
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledTimes(1)
    })
    it('should not call `pageLoadedAction` when not authenticated', () => {
      const mockStore = createMockStore({
        auth: {
          authentication: false,
        },
      })
      const AnalyticsBazaarVoiceComponent = analyticsDecorator(
        'write-a-review'
      )(MockComponent)
      mount(<AnalyticsBazaarVoiceComponent />, {
        context: { store: mockStore },
      })
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).not.toHaveBeenCalled()
    })
  })

  describe('SummaryContainer', () => {
    it('should call `pageLoadedAction` in componentDidMount when sync', () => {
      const checkoutHelpersMock = require('../../../../shared/lib/routing/v2/checkout/checkout-helpers')
      checkoutHelpersMock.hasDeliveryAddress.mockReturnValue(false)
      checkoutHelpersMock.hasCreditCard.mockReturnValue(false)
      const mockStore = createMockStore()
      const AnalyticsSummaryContainerComponent = analyticsDecorator(
        'delivery-payment',
        { isAsync: false }
      )(MockComponent)
      mount(<AnalyticsSummaryContainerComponent />, {
        context: {
          store: mockStore,
        },
      })
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledTimes(1)
    })
    it('should call `pageLoadedAction` when component is loaded if hasDeliveryAddress and hasCreditCard', () => {
      const checkoutHelpersMock = require('../../../../shared/lib/routing/v2/checkout/checkout-helpers')
      checkoutHelpersMock.hasDeliveryAddress.mockReturnValue(true)
      checkoutHelpersMock.hasCreditCard.mockReturnValue(true)
      const mockStore = createMockStore()
      const AnalyticsSummaryContainerComponent = analyticsDecorator(
        'delivery-payment',
        { isAsync: false }
      )(MockComponent)
      mount(<AnalyticsSummaryContainerComponent />, {
        context: {
          store: mockStore,
        },
      })
      mockStore.dispatch(
        updateStateAction({
          loaderOverlay: {
            visible: true,
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).not.toHaveBeenCalled()
      mockStore.dispatch(
        updateStateAction({
          loaderOverlay: {
            visible: false,
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledTimes(1)
    })
  })
  describe('hasCachedCategory', () => {
    it('should return true all conditions', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/category/dresses', '/', '/category/dresses'],
          location: {
            pathname: '/category/dresses',
            query: {
              q: 'q',
              category: 'dresses',
            },
          },
        },
        products: {
          location: {
            pathname: '/category/dresses',
            query: {
              q: 'q',
              category: 'dresses',
            },
          },
          products: [{}, {}],
          isLoadingAll: false,
        },
      })
      const AnalyticsSyncComponent = analyticsDecorator('mrCms-pages')(
        MockComponent
      )
      const wrapper = mount(<AnalyticsSyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      const instance = wrapper.find('AnalyticsDecorator').instance()
      expect(instance.props.hasCachedCategory).toBe(true)
    })
    it('should return true if search', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/category/dresses', '/', '/category/dresses'],
          location: {
            pathname: '/search/',
            query: {
              q: 'q',
              category: 'dresses',
            },
          },
        },
        products: {
          location: {
            pathname: '/search/',
            query: {
              q: 'q',
              category: 'dresses',
            },
          },
          products: [{}, {}],
          isLoadingAll: false,
        },
      })
      const AnalyticsSyncComponent = analyticsDecorator('mrCms-pages')(
        MockComponent
      )
      const wrapper = mount(<AnalyticsSyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      const instance = wrapper.find('AnalyticsDecorator').instance()
      expect(instance.props.hasCachedCategory).toBe(true)
    })
    it('should return false if do not have location in products', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/category/dresses', '/', '/category/dresses'],
          location: {
            pathname: '/category/dresses',
            query: {
              q: 'q',
              category: 'dresses',
            },
          },
        },
        products: {
          products: [{}, {}],
          isLoadingAll: false,
        },
      })
      const AnalyticsSyncComponent = analyticsDecorator('mrCms-pages')(
        MockComponent
      )
      const wrapper = mount(<AnalyticsSyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      const instance = wrapper.find('AnalyticsDecorator').instance()
      expect(instance.props.hasCachedCategory).toBe(false)
    })
    it('should return false if pathname is different', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/category/dresses', '/', '/category/dresses'],
          location: {
            pathname: '/category/dresses',
            query: {
              q: 'q',
              category: 'dresses',
            },
          },
        },
        products: {
          location: {
            pathname: '/category/tops',
            query: {
              q: 'q',
              category: 'dresses',
            },
          },
          products: [{}, {}],
          isLoadingAll: false,
        },
      })
      const AnalyticsSyncComponent = analyticsDecorator('mrCms-pages')(
        MockComponent
      )
      const wrapper = mount(<AnalyticsSyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      const instance = wrapper.find('AnalyticsDecorator').instance()
      expect(instance.props.hasCachedCategory).toBe(false)
    })
    it('should return false if q is different', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/category/dresses', '/', '/category/dresses'],
          location: {
            pathname: '/category/dresses',
            query: {
              q: 'q',
              category: 'dresses',
            },
          },
        },
        products: {
          location: {
            pathname: '/category/dresses',
            query: {
              q: 'q1',
              category: 'dresses',
            },
          },
          products: [{}, {}],
          isLoadingAll: false,
        },
      })
      const AnalyticsSyncComponent = analyticsDecorator('mrCms-pages')(
        MockComponent
      )
      const wrapper = mount(<AnalyticsSyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      const instance = wrapper.find('AnalyticsDecorator').instance()
      expect(instance.props.hasCachedCategory).toBe(false)
    })
    it('should return false if category is different', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/category/dresses', '/', '/category/dresses'],
          location: {
            pathname: '/category/dresses',
            query: {
              q: 'q',
              category: 'dresses',
            },
          },
        },
        products: {
          location: {
            pathname: '/category/dresses',
            query: {
              q: 'q',
              category: 'tops',
            },
          },
          products: [{}, {}],
          isLoadingAll: false,
        },
      })
      const AnalyticsSyncComponent = analyticsDecorator('mrCms-pages')(
        MockComponent
      )
      const wrapper = mount(<AnalyticsSyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      const instance = wrapper.find('AnalyticsDecorator').instance()
      expect(instance.props.hasCachedCategory).toBe(false)
    })
  })

  describe('PLP cases', () => {
    const begginingPageViewed = 20
    const somePageViewed = 50
    const wholePageViewed = 100
    it('should return 20% if loaded products length is less than total products', () => {
      const productsCount = 3
      const mockStore = createMockStore({
        products: {
          isLoadingAll: false,
          totalProducts: 17,
          products: generateSampleProducts(productsCount),
        },
      })
      const AnalyticsSyncComponent = analyticsDecorator('plp', {
        isAsync: true,
      })(MockComponent)
      const wrapper = mount(<AnalyticsSyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      const instance = wrapper.find('AnalyticsDecorator').instance()
      expect(instance.props.percentageViewedPlp.percentageViewedPlp).toBe(
        begginingPageViewed
      )
      expect(instance.props.percentageViewedPlp.loadedProductsCount).toBe(
        productsCount
      )
    })
    it('should return 100% if loaded products length is equal total products', () => {
      const productsCount = 22
      const mockStore = createMockStore({
        products: {
          isLoadingAll: false,
          totalProducts: 22,
          products: generateSampleProducts(productsCount),
        },
      })
      const AnalyticsSyncComponent = analyticsDecorator('plp', {
        isAsync: true,
      })(MockComponent)
      const wrapper = mount(<AnalyticsSyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      const instance = wrapper.find('AnalyticsDecorator').instance()
      expect(instance.props.percentageViewedPlp.percentageViewedPlp).toBe(
        wholePageViewed
      )
      expect(instance.props.percentageViewedPlp.loadedProductsCount).toBe(
        productsCount
      )
    })
    it('should return 100% if total products is zero', () => {
      const productsCount = 0
      const mockStore = createMockStore({
        products: {
          isLoadingAll: false,
          totalProducts: 0,
          products: [],
        },
      })
      const AnalyticsSyncComponent = analyticsDecorator('plp', {
        isAsync: true,
      })(MockComponent)
      const wrapper = mount(<AnalyticsSyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      const instance = wrapper.find('AnalyticsDecorator').instance()
      expect(instance.props.percentageViewedPlp.percentageViewedPlp).toBe(
        wholePageViewed
      )
      expect(instance.props.percentageViewedPlp.loadedProductsCount).toBe(
        productsCount
      )
    })
    it('should return 50% if loaded products length is less than total products but more than 20', () => {
      const productsCount = 22
      const mockStore = createMockStore({
        products: {
          isLoadingAll: false,
          totalProducts: 40,
          products: generateSampleProducts(productsCount),
        },
      })
      const AnalyticsSyncComponent = analyticsDecorator('plp', {
        isAsync: true,
      })(MockComponent)
      const wrapper = mount(<AnalyticsSyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      const instance = wrapper.find('AnalyticsDecorator').instance()
      expect(instance.props.percentageViewedPlp.percentageViewedPlp).toBe(
        somePageViewed
      )
      expect(instance.props.percentageViewedPlp.loadedProductsCount).toBe(
        productsCount
      )
    })
  })

  describe('isDisabled', () => {
    it('should return true if cms page with homepage path', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/', '/somewhere/else'],
          location: {
            pathname: '/',
          },
        },
      })
      const AnalyticsSyncComponent = analyticsDecorator('mrCms-pages')(
        MockComponent
      )
      const wrapper = mount(<AnalyticsSyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      const instance = wrapper.find('AnalyticsDecorator').instance()
      expect(instance.props.isDisabled).toBe(true)
    })
    it('should return true if home page in not home path', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/', '/somewhere/else'],
          location: {
            pathname: '/category/dresses',
          },
        },
      })
      const AnalyticsSyncComponent = analyticsDecorator('home')(MockComponent)
      const wrapper = mount(<AnalyticsSyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      const instance = wrapper.find('AnalyticsDecorator').instance()
      expect(instance.props.isDisabled).toBe(true)
    })
    it('should return true if storelocator page in collect-from-store path', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/', '/somewhere/else'],
          location: {
            pathname: '/sth/collect-from-store',
          },
        },
      })
      const AnalyticsSyncComponent = analyticsDecorator('store-locator')(
        MockComponent
      )
      const wrapper = mount(<AnalyticsSyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      const instance = wrapper.find('AnalyticsDecorator').instance()
      expect(instance.props.isDisabled).toBe(true)
    })
    it('should return true if plp page but with undefined products', () => {
      const mockStore = createMockStore()
      const AnalyticsSyncComponent = analyticsDecorator('plp')(MockComponent)
      const wrapper = mount(<AnalyticsSyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      const instance = wrapper.find('AnalyticsDecorator').instance()
      expect(instance.props.isDisabled).toBe(true)
    })
    it('should return true if plp page and one product', () => {
      const mockStore = createMockStore({
        products: {
          products: [{}],
          isLoadingAll: true,
        },
      })
      const AnalyticsSyncComponent = analyticsDecorator('plp')(MockComponent)
      const wrapper = mount(<AnalyticsSyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      const instance = wrapper.find('AnalyticsDecorator').instance()
      expect(instance.props.isDisabled).toBe(true)
    })
    it('should return false otherwise', () => {
      const mockStore = createMockStore()
      const AnalyticsSyncComponent = analyticsDecorator('some-page')(
        MockComponent
      )
      const wrapper = mount(<AnalyticsSyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      const instance = wrapper.find('AnalyticsDecorator').instance()
      expect(instance.props.isDisabled).toBe(false)
    })
  })
  describe('delivery-details', () => {
    it('should override `isAsync` to false if query string contains `new-user', () => {
      const mockStore = createMockStore({
        routing: {
          visited: ['/', '/somewhere/else'],
          location: {
            search: '?new-user',
          },
        },
      })
      const AnalyticsAsyncComponent = analyticsDecorator('delivery-details', {
        isAsync: true,
      })(MockComponent)
      const wrapper = mount(<AnalyticsAsyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      expect(wrapper.find('AnalyticsDecorator').instance().isAsync).toBe(false)
    })
  })

  describe('ProductQuickView', () => {
    it('should call `pageLoadedAction` when the quickview products are loaded', () => {
      const mockStore = createMockStore()
      const ProductQuickView = analyticsDecorator('product-quick-view', {
        isAsync: true,
      })(MockComponent)
      mount(<ProductQuickView />, {
        context: {
          store: mockStore,
        },
      })
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledTimes(0)
      // similute the loading criteria check (i.e. product is loaded)
      mockStore.dispatch(
        updateStateAction({
          quickview: {
            product: {
              name: '1337',
            },
          },
        })
      )
      jest.runAllTimers()
      expect(analyticsActions.pageLoaded).toHaveBeenCalledTimes(1)
    })
  })
  describe('handleQuickview', () => {
    it('should call reset time when QV is about to close in some component', () => {
      const mockStore = createMockStore()
      const AnalyticsSyncComponent = analyticsDecorator('plp')(MockComponent)
      const wrapper = mount(<AnalyticsSyncComponent />, {
        context: {
          store: mockStore,
        },
      })
      const instance = wrapper.find('AnalyticsDecorator').instance()
      const props = {
        modal: {
          mode: 'plpQuickview',
          open: true,
        },
      }
      const nextProps = {
        modal: {
          open: false,
          mode: 'plpQuickview',
        },
      }

      nowMock.mockReturnValue(3000)
      instance.handleQuickview('plp', props, nextProps)
      expect(instance.hasHandledOnLoad).toBe(false)
      expect(instance.shouldResend).toBe(true)
      expect(instance.startTime).toBe(3000)
    })
  })
  describe('isSpecialCmsPage', () => {
    it('should return true if cmsPageName is some espot', () => {
      const mockStore = createMockStore()
      const AnalyticsSyncComponent = analyticsDecorator('some-page')(
        MockComponent
      )
      const wrapper = mount(
        <AnalyticsSyncComponent cmsPageName="espotCmsPage1" />,
        {
          context: {
            store: mockStore,
          },
        }
      )
      const instance = wrapper.find('AnalyticsDecorator').instance()
      expect(instance.isSpecialCmsPage()).toBe(true)
    })
    it('should return true if cmsPageName is some navSocial', () => {
      const mockStore = createMockStore()
      const AnalyticsSyncComponent = analyticsDecorator('some-page')(
        MockComponent
      )
      const wrapper = mount(
        <AnalyticsSyncComponent cmsPageName="navSocial" />,
        {
          context: {
            store: mockStore,
          },
        }
      )
      const instance = wrapper.find('AnalyticsDecorator').instance()
      expect(instance.isSpecialCmsPage()).toBe(true)
    })
    it('should return false if cmsPageName is not navSocial or some espot', () => {
      const mockStore = createMockStore()
      const AnalyticsSyncComponent = analyticsDecorator('some-page')(
        MockComponent
      )
      const wrapper = mount(
        <AnalyticsSyncComponent cmsPageName="randomCmsPageName" />,
        {
          context: {
            store: mockStore,
          },
        }
      )
      const instance = wrapper.find('AnalyticsDecorator').instance()
      expect(instance.isSpecialCmsPage()).toBe(false)
    })
  })

  describe('pageType tracking', () => {
    beforeEach(() => {
      jest.spyOn(pageTypeActions, 'setPageType')
      jest.spyOn(pageTypeActions, 'clearPageType')
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    const props = Object.freeze({ foo: 'bar', fish: 'legs' })
    const createComponentInstance = (suppressPageTypeTracking) => {
      const AnalyticsComponent = analyticsDecorator('page-foo', {
        suppressPageTypeTracking,
      })(MockComponent)
      const wrapper = mount(<AnalyticsComponent {...props} />, {
        context: {
          store: createMockStore({}),
        },
      })
      return wrapper.find('AnalyticsDecorator').instance()
    }

    it('should set and clear pageType if page tracking is not suppressed when using a callback function', () => {
      const instance = createComponentInstance(false)
      expect(instance.pageType).toBe('page-foo')
      expect(instance.props.isTrackingPageType).toBe(true)
      expect(pageTypeActions.setPageType).toHaveBeenCalledTimes(1)
      expect(pageTypeActions.setPageType).toHaveBeenCalledWith('page-foo')
      instance.componentWillUnmount()
      expect(pageTypeActions.clearPageType).toHaveBeenCalledTimes(1)
    })

    it('should not set or clear pageType if page tracking is suppressed with a callback function', () => {
      const instance = createComponentInstance(true)
      expect(instance.props.isTrackingPageType).toBe(false)
      expect(pageTypeActions.setPageType).not.toHaveBeenCalled()
      instance.componentWillUnmount()
      expect(pageTypeActions.clearPageType).not.toHaveBeenCalled()
    })
  })
})
