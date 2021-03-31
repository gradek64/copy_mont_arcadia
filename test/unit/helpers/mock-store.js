import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'

const forAnalyticsDecorator = ({
  reducer = (state) => state,
  preloadedState = {},
} = {}) => {
  return createStore(
    reducer,
    {
      routing: {
        visited: ['/'],
        location: {
          pathname: '/checkout/login',
        },
      },
      loaderOverlay: {
        visible: false,
      },
      sandbox: {
        pages: {},
      },
      storeLocator: {
        loading: false,
      },
      products: {
        isLoadingAll: true,
      },
      auth: {},
      config: {
        brandCode: null,
        hostnames: [],
      },
      account: {
        user: {},
      },
      infinityScroll: {},
      refinements: {},
      plpContainer: {},
      currentProduct: {},
      recommendations: {},
      viewport: {},
      quickview: {
        product: {},
      },
      ...preloadedState,
    },
    applyMiddleware(thunk)
  )
}

const createMockStore = forAnalyticsDecorator

export { forAnalyticsDecorator, createMockStore }
