/**
 * NOTE on transactionName
 *
 * Within a Route, the transactionName prop is used by New Relic to
 * classify the route statistics with the name given in the prop instead
 * of collecting all the statistics under the default of 'GET /{param*}'.
 *
 * transactionName props is following a particular pattern to help
 * classified and filter the error.
 *
 * the pattern is //route-classification//{path}
 *
 * A transactionName pattern does not need a leading '/' because
 * newrelic.setTransactionName() adds this prefix automatically.
 *
 * https://docs.newrelic.com/docs/agents/nodejs-agent/api-guides/nodejs-agent-api
 */

import React from 'react'
import { connect } from 'react-redux'
import { Route, IndexRoute, Redirect } from 'react-router'
import { nrBrowserLogError } from '../client/lib/logger'

// selectors
import {
  isFeatureWishlistEnabled,
  isFeatureUnifiedLoginRegisterEnabled,
} from './selectors/featureSelectors'

// components
import Main from './components/containers/Main/Main'
import Loader from './components/common/Loader/Loader'
import ErrorMessage from './components/containers/ErrorMessage/ErrorMessage'
import routeHandlers from './lib/routing/v1/state-binding'
import routeHandlersV2 from './lib/routing/v2/state-binding'
import SandBoxPage, {
  NotFound,
} from './components/containers/SandBoxPage/SandBoxPage'

// actions
import { setGenericError } from './actions/common/errorMessageActions'
import GuestCheckoutContainer from './components/containers/CheckoutV2/Guest/GuestCheckoutContainer'

import { isValidSeoUrl, isValidECMCPath } from './lib/url-utils'

const forbidden = () => ({
  error: {
    boom: 'forbidden',
  },
})

const unwrapComponent = (Comp) =>
  Comp.WrappedComponent ? unwrapComponent(Comp.WrappedComponent) : Comp

// The below prevents webpack from following the `require` call in asyncImport which
// is only used on the server.
const requireFunc =
  typeof __webpack_require__ === 'function' ? undefined : require

/**
 * Returns the original Component on server side and an async component on the client.
 * The client side component will render <Loader /> unless the async webpack chunk
 * has already been loaded in which case it will render that.
 *
 * @param  {String}   chunkName  The value of the webpackChunkName magic comment
 * @param  {Function} async      Dynamic import e.g. () => import('./Foo')
 * @param  {String}   path       Path to the module
 * @param  {Function} moduleId   Resolve weak e.g. () => require.resolveWeak('./Foo')
 * @return {ReactComponent}
 */
export const asyncImport = (chunkName, async, path, moduleId) => {
  let ServerComp
  if (!process.browser) ServerComp = requireFunc(path).default // eslint-disable-line

  class AsyncComp extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        Comp: ServerComp || Loader,
        loadingError: false,
      }
    }

    loadComponent = (retry = true) => {
      if (!process.browser) return

      /* eslint-disable */
      if (process.browser && __webpack_modules__[moduleId()]) {
        return this.setState({
          Comp: __webpack_require__(`${moduleId()}`).default,
        })
      }
      /* eslint-enable */

      if (!retry) return

      window.loadScript({
        src: window.webpackManifest.js[`common/${chunkName}.js`],
        onload: () => {
          this.loadComponent(false)
        },
        onerror: () => {
          const nrError = `code-splitting error retrieving ${chunkName}`
          if (this.state.loadingError)
            nrBrowserLogError(nrError, new Error(nrError))
          this.setState({ loadingError: true })
          this.props.setGenericError(
            new Error(
              `Sorry, there's been an error with loading the page. Please try again later`
            ),
            false
          )
        },
      })
    }

    componentWillMount() {
      this.loadComponent()
    }

    render() {
      const Comp = this.state.Comp
      if (this.state.loadingError) return <ErrorMessage />
      return <Comp {...this.props} />
    }
  }

  if (ServerComp) {
    const BaseComp = unwrapComponent(ServerComp)
    AsyncComp.needs = BaseComp.needs
  }

  const FinalAsyncComp = connect(
    null,
    { setGenericError }
  )(AsyncComp)

  FinalAsyncComp.webpackChunkName = chunkName

  return FinalAsyncComp
}

const Home = asyncImport(
  'Home',
  () =>
    import(/* webpackChunkName: "Home" */ './components/containers/Home/Home'),
  './components/containers/Home/Home',
  () => require.resolveWeak('./components/containers/Home/Home')
)
const PlpContainer = asyncImport(
  'PlpContainer',
  () =>
    import(/* webpackChunkName: "PlpContainer" */ './components/containers/PLP/PlpContainer'),
  './components/containers/PLP/PlpContainer',
  () => require.resolveWeak('./components/containers/PLP/PlpContainer')
)
const PdpContainer = asyncImport(
  'PdpContainer',
  () =>
    import(/* webpackChunkName: "PdpContainer" */ './components/containers/PdpContainer/PdpContainer'),
  './components/containers/PdpContainer/PdpContainer',
  () => require.resolveWeak('./components/containers/PdpContainer/PdpContainer')
)
const BazaarVoiceReview = asyncImport(
  'BazaarVoiceReview',
  () =>
    import(/* webpackChunkName: "BazaarVoiceReview" */ './components/common/BazaarVoice/BazaarVoiceReview/BazaarVoiceReview'),
  './components/common/BazaarVoice/BazaarVoiceReview/BazaarVoiceReview',
  () =>
    require.resolveWeak(
      './components/common/BazaarVoice/BazaarVoiceReview/BazaarVoiceReview'
    )
)
const SignIn = asyncImport(
  'SignIn',
  () =>
    import(/* webpackChunkName: "BazaarVoiceReview" */ './components/containers/SignIn/SignIn'),
  './components/containers/SignIn/SignIn',
  () => require.resolveWeak('./components/containers/SignIn/SignIn')
)
const SignOut = asyncImport(
  'SignOut',
  () =>
    import(/* webpackChunkName: "SignOut" */ './components/containers/SignOut/SignOut'),
  './components/containers/SignOut/SignOut',
  () => require.resolveWeak('./components/containers/SignOut/SignOut')
)
const MyAccount = asyncImport(
  'MyAccount',
  () =>
    import(/* webpackChunkName: "MyAccount" */ './components/containers/MyAccount/MyAccount'),
  './components/containers/MyAccount/MyAccount',
  () => require.resolveWeak('./components/containers/MyAccount/MyAccount')
)
const MyAccountSubcategory = asyncImport(
  'MyAccount',
  () =>
    import(/* webpackChunkName: "MyAccount" */ './components/containers/MyAccountSubcategory/MyAccountSubcategory'),
  './components/containers/MyAccountSubcategory/MyAccountSubcategory',
  () =>
    require.resolveWeak(
      './components/containers/MyAccountSubcategory/MyAccountSubcategory'
    )
)
const ChangePassword = asyncImport(
  'MyAccount',
  () =>
    import(/* webpackChunkName: "MyAccount" */ './components/containers/ChangePassword/ChangePassword'),
  './components/containers/ChangePassword/ChangePassword',
  () =>
    require.resolveWeak('./components/containers/ChangePassword/ChangePassword')
)
const MyCheckoutDetails = asyncImport(
  'MyAccount',
  () =>
    import(/* webpackChunkName: "MyAccount" */ './components/containers/MyCheckoutDetails/MyCheckoutDetails'),
  './components/containers/MyCheckoutDetails/MyCheckoutDetails',
  () =>
    require.resolveWeak(
      './components/containers/MyCheckoutDetails/MyCheckoutDetails'
    )
)
const ResetPassword = asyncImport(
  'MyAccount',
  () =>
    import(/* webpackChunkName: "MyAccount" */ './components/containers/ResetPassword/ResetPassword'),
  './components/containers/ResetPassword/ResetPassword',
  () =>
    require.resolveWeak('./components/containers/ResetPassword/ResetPassword')
)
const CustomerShortProfile = asyncImport(
  'MyAccount',
  () =>
    import(/* webpackChunkName: "MyAccount" */ './components/containers/CustomerShortProfile/CustomerShortProfile'),
  './components/containers/CustomerShortProfile/CustomerShortProfile',
  () =>
    require.resolveWeak(
      './components/containers/CustomerShortProfile/CustomerShortProfile'
    )
)
const OrderHistoryList = asyncImport(
  'MyAccount',
  () =>
    import(/* webpackChunkName: "MyAccount" */ './components/containers/OrderHistory/OrderHistoryList'),
  './components/containers/OrderHistory/OrderHistoryList',
  () =>
    require.resolveWeak('./components/containers/OrderHistory/OrderHistoryList')
)
const ReturnHistoryList = asyncImport(
  'MyAccount',
  () =>
    import(/* webpackChunkName: "MyAccount" */ './components/containers/ReturnHistory/ReturnHistoryList'),
  './components/containers/ReturnHistory/ReturnHistoryList',
  () =>
    require.resolveWeak(
      './components/containers/ReturnHistory/ReturnHistoryList'
    )
)
const OrderHistoryDetails = asyncImport(
  'MyAccount',
  () =>
    import(/* webpackChunkName: "MyAccount" */ './components/containers/OrderHistoryDetails/OrderHistoryDetails'),
  './components/containers/OrderHistoryDetails/OrderHistoryDetails',
  () =>
    require.resolveWeak(
      './components/containers/OrderHistoryDetails/OrderHistoryDetails'
    )
)
const ReturnHistoryDetails = asyncImport(
  'MyAccount',
  () =>
    import(/* webpackChunkName: "MyAccount" */ './components/containers/ReturnHistory/ReturnHistoryDetails'),
  './components/containers/ReturnHistory/ReturnHistoryDetails',
  () =>
    require.resolveWeak(
      './components/containers/ReturnHistory/ReturnHistoryDetails'
    )
)
const StoreLocator = asyncImport(
  'StoreLocator',
  () =>
    import(/* webpackChunkName: "StoreLocator" */ './components/common/StoreLocator/StoreLocator'),
  './components/common/StoreLocator/StoreLocator',
  () => require.resolveWeak('./components/common/StoreLocator/StoreLocator')
)
const FixedHeightPage = asyncImport(
  'FixedHeightPage',
  () =>
    import(/* webpackChunkName: "FixedHeightPage" */ './components/containers/FixedHeightPage/FixedHeightPage'),
  './components/containers/FixedHeightPage/FixedHeightPage',
  () =>
    require.resolveWeak(
      './components/containers/FixedHeightPage/FixedHeightPage'
    )
)
const Dressipi = asyncImport(
  'Dressipi',
  () =>
    import(/* webpackChunkName: "Dressipi" */ './components/containers/Dressipi/Dressipi'),
  './components/containers/Dressipi/Dressipi',
  () => require.resolveWeak('./components/containers/Dressipi/Dressipi')
)
const ChangeShippingDestination = asyncImport(
  'ChangeShippingDestination',
  () =>
    import(/* webpackChunkName: "ChangeShippingDestination" */ './components/containers/ChangeShippingDestination/ChangeShippingDestination'),
  './components/containers/ChangeShippingDestination/ChangeShippingDestination',
  () =>
    require.resolveWeak(
      './components/containers/ChangeShippingDestination/ChangeShippingDestination'
    )
)
const CmsForm = asyncImport(
  'CmsForm',
  () =>
    import(/* webpackChunkName: "CmsForm" */ './components/containers/CmsForm/CmsForm'),
  './components/containers/CmsForm/CmsForm',
  () => require.resolveWeak('./components/containers/CmsForm/CmsForm')
)
const EReceipt = asyncImport(
  'MyAccount',
  () =>
    import(/* webpackChunkName: "MyAccount" */ './components/containers/EReceipt/EReceipt'),
  './components/containers/EReceipt/EReceipt',
  () => require.resolveWeak('./components/containers/EReceipt/EReceipt')
)
const WrappedWishlistPageContainer = asyncImport(
  'WrappedWishlistPageContainer',
  () =>
    import(/* webpackChunkName: "WrappedWishlistPageContainer" */ './components/containers/Wishlist/WishlistPageContainer'),
  './components/containers/Wishlist/WishlistPageContainer',
  () =>
    require.resolveWeak(
      './components/containers/Wishlist/WishlistPageContainer'
    )
)
const LoginRegisterContainer = asyncImport(
  'LoginRegisterContainer',
  () =>
    import(/* webpackChunkName: "LoginRegisterContainer" */ './components/containers/LoginRegisterContainer/LoginRegisterContainer'),
  './components/containers/LoginRegisterContainer/LoginRegisterContainer',
  () =>
    require.resolveWeak(
      './components/containers/LoginRegisterContainer/LoginRegisterContainer'
    )
)
const ForgotPassword = asyncImport(
  'ForgotPassword',
  () =>
    import(/* webpackChunkName: "ForgotPassword" */ './components/containers/LoginRegister/ForgotPassword'),
  './components/containers/LoginRegister/ForgotPassword',
  () =>
    require.resolveWeak('./components/containers/LoginRegister/ForgotPassword')
)
const RegisterSuccess = asyncImport(
  'RegisterSuccess',
  () =>
    import(/* webpackChunkName: "RegisterSuccess" */ './components/containers/LoginRegister/RegisterSuccess'),
  './components/containers/LoginRegister/RegisterSuccess',
  () =>
    require.resolveWeak('./components/containers/LoginRegister/RegisterSuccess')
)
const Ui = asyncImport(
  'Ui',
  () => import(/* webpackChunkName: "Ui" */ './components/containers/UI/UI'),
  './components/containers/UI/UI',
  () => require.resolveWeak('./components/containers/UI/UI')
)

const { searchRedirect } = routeHandlers
const {
  checkoutRedirect,
  requiresNotAuth,
  requiresAuth,
  onEnterPayment,
  checkAuthentication,
  onEnterDelivery,
  redirectOnSSR,
} = routeHandlersV2

export default function getRoutes(context, { l }) {
  const { getState } = context
  const state = getState()

  /**
   * Encode URI but decode ['/', ':']
   * @param {string} path
   */
  const encode = (path) =>
    encodeURIComponent(path)
      .replace(/%2F/g, '/')
      .replace(/%3A/g, ':')

  /**
   * Add route for path, component and props, but if path is not encoded, add that route too
   * @param {string} path
   * @param {object} component
   * @param {object} props
   */
  const route = (path, component, props = {}) => {
    const routes = [
      <Route path={path} component={component} key={path} {...props} />,
    ]
    const encoded = encode(path)
    if (path !== encoded) {
      routes.push(
        <Route path={encoded} component={component} key={path} {...props} />
      )
    }
    return routes
  }

  /**
   * Add a redirect from both the path and the encoded path
   * @param {string} path
   * @param {string} to
   */
  const redirect = (path, to) => {
    const encoded = encode(path)
    const redirects = [<Redirect from={path} to={to} key={path} />]
    if (path !== encoded) {
      redirects.push(<Redirect from={encoded} to={to} key={path} />)
    }
    return redirects
  }

  /**
   * Return Array<Array<Redirect>> with redirect being `[localised category]/[path]** /home`
   * @param {Array<string>} paths
   */
  const redirectToStoreLocatorFrom = (...paths) =>
    paths.map((path) =>
      redirect(`/**/${l`category`}/${path}**/home`, '/store-locator')
    )

  // import * as checkout from './components/containers/CheckoutV2'
  const CheckoutContainer = asyncImport(
    'checkout',
    () =>
      import(/* webpackChunkName: "checkout" */ './components/containers/CheckoutV2/CheckoutContainer'),
    './components/containers/CheckoutV2/CheckoutContainer',
    () =>
      require.resolveWeak(
        './components/containers/CheckoutV2/CheckoutContainer'
      )
  )

  const CheckoutDeliveryContainer = asyncImport(
    'checkout',
    () =>
      import(/* webpackChunkName: "checkout" */ './components/containers/CheckoutV2/Delivery/DeliveryContainer'),
    './components/containers/CheckoutV2/Delivery/DeliveryContainer',
    () =>
      require.resolveWeak(
        './components/containers/CheckoutV2/Delivery/DeliveryContainer'
      )
  )

  const CheckoutDeliveryCollectFromStoreContainer = asyncImport(
    'checkout',
    () =>
      import(/* webpackChunkName: "checkout" */ './components/containers/CheckoutV2/Delivery/DeliveryCollectFromStoreContainer'),
    './components/containers/CheckoutV2/Delivery/DeliveryCollectFromStoreContainer',
    () =>
      require.resolveWeak(
        './components/containers/CheckoutV2/Delivery/DeliveryCollectFromStoreContainer'
      )
  )

  const CheckoutLoginContainer = asyncImport(
    'checkout',
    () =>
      import(/* webpackChunkName: "checkout" */ './components/containers/CheckoutV2/LoginContainer'),
    './components/containers/CheckoutV2/LoginContainer',
    () =>
      require.resolveWeak('./components/containers/CheckoutV2/LoginContainer')
  )

  const CheckoutPaymentContainer = asyncImport(
    'checkout',
    () =>
      import(/* webpackChunkName: "checkout" */ './components/containers/CheckoutV2/Payment/PaymentContainer'),
    './components/containers/CheckoutV2/Payment/PaymentContainer',
    () =>
      require.resolveWeak(
        './components/containers/CheckoutV2/Payment/PaymentContainer'
      )
  )

  const CheckoutDeliveryPaymentContainer = asyncImport(
    'checkout',
    () =>
      import(/* webpackChunkName: "checkout" */ './components/containers/CheckoutV2/DeliveryPayment/DeliveryPaymentContainer'),
    './components/containers/CheckoutV2/DeliveryPayment/DeliveryPaymentContainer',
    () =>
      require.resolveWeak(
        './components/containers/CheckoutV2/DeliveryPayment/DeliveryPaymentContainer'
      )
  )

  const checkoutOrderComplete = asyncImport(
    'checkout',
    () =>
      import(/* webpackChunkName: "checkout" */ './components/containers/CheckoutV2/Summary/OrderComplete'),
    './components/containers/CheckoutV2/Summary/OrderComplete',
    () =>
      require.resolveWeak(
        './components/containers/CheckoutV2/Summary/OrderComplete'
      )
  )

  const PSD2OrderConfirm = asyncImport(
    'PSD2',
    () =>
      import(/* webpackChunkName: "PSD2" */ './components/containers/PSD2/OrderConfirm/OrderConfirm'),
    './components/containers/PSD2/OrderConfirm/OrderConfirm',
    () =>
      require.resolveWeak(
        './components/containers/PSD2/OrderConfirm/OrderConfirm'
      )
  )
  const PSD2OrderSuccess = asyncImport(
    'PSD2',
    () =>
      import(/* webpackChunkName: "PSD2" */ './components/containers/PSD2/OrderSuccess/OrderSuccess'),
    './components/containers/PSD2/OrderSuccess/OrderSuccess',
    () =>
      require.resolveWeak(
        './components/containers/PSD2/OrderSuccess/OrderSuccess'
      )
  )
  const PSD2OrderFailure = asyncImport(
    'PSD2',
    () =>
      import(/* webpackChunkName: "PSD2" */ './components/containers/PSD2/OrderFailure/OrderFailure'),
    './components/containers/PSD2/OrderFailure/OrderFailure',
    () =>
      require.resolveWeak(
        './components/containers/PSD2/OrderFailure/OrderFailure'
      )
  )
  const checkoutFlow = (context) => {
    const loginContainer = isFeatureUnifiedLoginRegisterEnabled(
      context.getState()
    )
      ? LoginRegisterContainer
      : CheckoutLoginContainer
    return [
      <Route
        key="checkout"
        path="checkout"
        component={CheckoutContainer}
        transactionName="/Checkout//checkout"
      >
        <IndexRoute onEnter={checkoutRedirect(context)} />
        <Route
          path="login"
          component={loginContainer}
          onEnter={requiresNotAuth(context)}
          transactionName="/Login//login"
        />
        <Route
          path="delivery"
          component={CheckoutDeliveryContainer}
          onEnter={onEnterDelivery(context)}
          transactionName="/Checkout//delivery"
        />
        <Route
          path="delivery/collect-from-store"
          component={CheckoutDeliveryCollectFromStoreContainer}
          onEnter={requiresAuth(context)}
          transactionName="/Checkout//delivery/collect-from-store"
        />
        <Route
          path="payment"
          component={CheckoutPaymentContainer}
          onEnter={onEnterPayment(context)}
          transactionName="/Checkout//payment"
        />
        <Route
          path="delivery-payment"
          component={CheckoutDeliveryPaymentContainer}
          onEnter={onEnterPayment(context)}
          transactionName="/Checkout//delivery-payment"
        />
      </Route>,
    ]
  }

  /* This is the initial setup for guest checkout routes - ADP-2548
   *
   * TODO:
   *  - Investigate what is required to enter a guest checkout routes (onEnter)
   *  - Example: guest checkout cookie is true and items in the bag.
   *  - This was not part of route list implementation (delivery/collect-from-store)
   *    and will be required for mobile. Investigate to confirm findings.
   *  - Code splitting will be required and guest checkout should be part of the
   *    checkout group
   *
   *  */
  const guestCheckoutFlow = () => {
    return [
      <Route
        key="guest/checkout"
        path="guest/checkout"
        component={GuestCheckoutContainer}
        onEnter={redirectOnSSR()}
        transactionName="/Guest//checkout"
      >
        <Route
          path="delivery"
          component={CheckoutDeliveryContainer}
          transactionName="/Guest/Checkout//delivery"
        />
        <Route
          path="delivery/collect-from-store"
          component={CheckoutDeliveryCollectFromStoreContainer}
          transactionName="/Guest/Checkout//delivery/collect-from-store"
        />
        <Route
          path="payment"
          component={CheckoutPaymentContainer}
          transactionName="/Guest/Checkout//payment"
        />
      </Route>,
    ]
  }

  const wishlist = (state) => {
    const featureWishlistEnabled = isFeatureWishlistEnabled(state)
    return featureWishlistEnabled ? (
      <Route
        path="/wishlist"
        component={WrappedWishlistPageContainer}
        contentType="page"
        transactionName="/Wishlist//wishlist"
      />
    ) : null
  }

  const psd2OrderFlow = () => [
    <Route
      key="psd2-order-confirm"
      path="psd2-order-confirm"
      component={PSD2OrderConfirm}
      transactionName="/Checkout//psd2-order-confirm"
    />,
    <Route
      key="psd2-order-success"
      path="psd2-order-success/:orderId"
      component={PSD2OrderSuccess}
      transactionName="/Checkout//psd2-order-success"
    />,
    <Route
      key="psd2-order-failure"
      path="psd2-order-failure"
      component={PSD2OrderFailure}
      transactionName="/Checkout//psd2-order-failure"
    />,
  ]

  /* TODO: Create a URL strategy for handling localised CMS content */
  /**
   * The transactionName for the Home page is set to /Content//homepage
   * it is an exception, as the real path is / - We are using the key word
   * homepage instead of the actual path
   * See comment about transactionName at the top of this module for more info.
   */

  const NEW_RELIC_TRANSACTION_NAME_ROOT = '/Content//homepage'

  return (
    <Route
      name="main"
      component={Main}
      path="/"
      transactionName={NEW_RELIC_TRANSACTION_NAME_ROOT}
    >
      <IndexRoute
        cmsPageName="home"
        component={Home}
        cacheable
        transactionName={NEW_RELIC_TRANSACTION_NAME_ROOT}
      />

      {redirectToStoreLocatorFrom(
        'store-finder',
        'store-locator',
        'find-a-store'
      )}

      {route(l`change-your-shipping-destination`, ChangeShippingDestination, {
        transactionName: '/navigation//change-your-shipping-destination',
      })}
      {route(
        `/**/${l`category`}/help-information**/${l`change-your-shipping-destination`}**`,
        ChangeShippingDestination,
        {
          cacheable: true,
          transactionName:
            '/Content//*/*/{category}/help-information*/{change-your-shipping-destination}*',
          onEnter: (state, replace, cb) => {
            const { pathname } = state.location
            if (!isValidSeoUrl(pathname)) {
              return cb(forbidden())
            }

            cb()
          },
        }
      )}
      {route(
        `/**/${l`category`}/your-details**/${l`change-your-shipping-destination`}**`,
        ChangeShippingDestination,
        {
          transactionName:
            '/YourDetails//*/{category}/your-details*/{change-your-shipping-destination}*',
          onEnter: (state, replace, cb) => {
            const { pathname } = state.location
            if (!isValidSeoUrl(pathname)) {
              return cb(forbidden())
            }

            cb()
          },
        }
      )}
      {route(
        `/**/${l`category`}/help-information**/style-adviser**`,
        Dressipi,
        {
          cacheable: true,
          transactionName:
            '/Content//*/{category}/help-information*/style-adviser*',
          onEnter: (state, replace, cb) => {
            const { pathname } = state.location
            if (!isValidSeoUrl(pathname)) {
              return cb(forbidden())
            }

            cb()
          },
        }
      )}
      {route(`/**/${l`category`}(/**)/my-topshop-wardrobe**`, Dressipi, {
        cacheable: true,
        transactionName: '/Content//*/{category/}(/*)/my-topshop-wardrobe*',
        onEnter: (state, replace, cb) => {
          const { pathname } = state.location
          if (!isValidSeoUrl(pathname)) {
            return cb(forbidden())
          }

          cb()
        },
      })}
      {route(`/**/${l`category`}(/**)style-adviser**`, Dressipi, {
        cacheable: true,
        transactionName: '/Content//*/{category}(/*)style-adviser*',
        onEnter: (state, replace, cb) => {
          const { pathname } = state.location
          if (!isValidSeoUrl(pathname)) {
            return cb(forbidden())
          }

          cb()
        },
      })}
      <Route
        path="style-adviser"
        component={Dressipi}
        transactionName="/Content//style-adviser"
      />

      {route(`/**/${l`category`}/help-information**/${l`tcs`}**`, SandBoxPage, {
        cmsPageName: 'termsAndConditions',
        cacheable: true,
        transactionName: '/Content//*/{category}/help-information*/{tcs}*',
        onEnter: (state, replace, cb) => {
          const { pathname } = state.location
          if (!isValidSeoUrl(pathname)) {
            return cb(forbidden())
          }

          cb()
        },
      })}
      {route(`/cms/${l`tcs`}`, SandBoxPage, {
        cmsPageName: 'termsAndConditions',
        contentType: 'page',
        transactionName: '/Content//cms/{tcs}',
      })}
      {route(`/cms/privacyPolicy`, SandBoxPage, {
        cmsPageName: 'privacyPolicy',
        contentType: 'page',
        transactionName: '/Content//cms/privacyPolicy',
      })}
      {route(
        `/**/${l`category`}/help-information**/:hygieneType-**`,
        SandBoxPage,
        {
          cacheable: true,
          transactionName:
            '/Content//*/*/{category}/help-information*/:hygieneType-*',
          onEnter: (state, replace, cb) => {
            const { pathname } = state.location
            if (!isValidSeoUrl(pathname)) {
              return cb(forbidden())
            }

            cb()
          },
        }
      )}
      {/* CMS content accessible from outside the application http://localhost:8080/en/tsuk/category/topshop-gift-card-247/home?TS=1466070708078 */}
      {route(`/**/${l`category`}/**${l`/home`}`, SandBoxPage, {
        cacheable: true,
        contentType: 'page',
        transactionName: '/Content//*/{category}/*{/home}',
        onEnter: (state, replace, cb) => {
          const { pathname } = state.location
          if (!isValidSeoUrl(pathname)) {
            return cb(forbidden())
          }

          cb()
        },
      })}
      {redirect(
        `/**/${l`category`}/your-details**/${l`sign-in-or-register`}**`,
        '/login'
      )}
      {redirect(
        `/**/${l`category`}/your-details**/${l`my-account`}**`,
        '/login'
      )}
      {route(`/**/${l`category`}/your-details**/:hygieneType-**`, SandBoxPage, {
        cacheable: true,
        transactionName:
          '/YourDetails//*/{category}/your-details*/:hygieneType-*',
        onEnter: (state, replace, cb) => {
          const { pathname } = state.location
          if (!isValidSeoUrl(pathname)) {
            return cb(forbidden())
          }

          cb()
        },
      })}
      <Route
        path="login"
        component={
          isFeatureUnifiedLoginRegisterEnabled(context.getState())
            ? LoginRegisterContainer
            : SignIn
        }
        onEnter={checkAuthentication(context)}
        transactionName="/Login//login"
      />
      <Route path="logout" component={SignOut} transactionName="logout" />
      {checkoutFlow(context)}
      {guestCheckoutFlow(context)}

      {route(`/**/${l`category`}/**:param`, PlpContainer, {
        cacheable: true,
        transactionName: '/PLP//*/*/{category}/*(/*):param',
        preserveScroll: true,
        onEnter: (state, replace, cb) => {
          const { pathname } = state.location
          if (!isValidSeoUrl(pathname)) {
            return cb(forbidden())
          }
          cb()
        },
      })}
      {route(`/search`, PlpContainer, {
        cacheable: true,
        onEnter: searchRedirect(context),
        transactionName: '/PLP//search',
        preserveScroll: true,
      })}
      {route('/filter/:searchFilter', PlpContainer, {
        cacheable: true,
        transactionName: '/PLP//filter/:searchFilter',
        preserveScroll: true,
      })}

      {route(`/**/**/${l`product`}/:identifier`, PdpContainer, {
        cacheable: true,
        transactionName: '/PDP//*/*/{product}/:identifier',
        onEnter: (state, replace, cb) => {
          const { pathname } = state.location
          if (!isValidSeoUrl(pathname)) {
            return cb(forbidden())
          }
          cb()
        },
      })}
      {route(`/**/**/${l`product`}/**/:identifier`, PdpContainer, {
        cacheable: true,
        transactionName: '/PDP//*/*/{product}/*/:identifier',
        onEnter: (state, replace, cb) => {
          const { pathname } = state.location
          if (!isValidSeoUrl(pathname)) {
            return cb(forbidden())
          }
          cb()
        },
      })}
      {route(`/**/**/${l`product`}/**/**/:identifier`, PdpContainer, {
        cacheable: true,
        transactionName: '/PDP//*/*/{product}/*/*/:identifier',
        onEnter: (state, replace, cb) => {
          const { pathname } = state.location
          if (!isValidSeoUrl(pathname)) {
            return cb(forbidden())
          }
          cb()
        },
      })}

      {route(`/**/${l`product`}(/**)/:identifier`, PdpContainer, {
        cacheable: true,
        transactionName: '/PDP//*/{product}(/*)/:identifier',
        onEnter: (state, replace, cb) => {
          const { pathname } = state.location
          if (!isValidSeoUrl(pathname)) {
            return cb(forbidden())
          }
          cb()
        },
      })}

      <Route
        path="review/*"
        component={BazaarVoiceReview}
        transactionName="/Content//review/*"
      />
      <Route
        path="reset-password"
        component={() => <ChangePassword resetPassword />}
        transactionName="/ResetPassword//reset-password"
      />
      <Route path="reset-password-link" component={ResetPassword} />
      <Route
        path="my-account"
        component={MyAccount}
        onEnter={checkAuthentication(context)}
        transactionName="/MyAccount//my-account"
      />
      <Route
        path="my-account"
        component={MyAccountSubcategory}
        onEnter={checkAuthentication(context)}
        transactionName="/MyAccount//my-account"
      >
        <Route
          path="my-password"
          component={ChangePassword}
          transactionName="/MyPassword//my-password"
        />
        <Route
          path="details(/edit)"
          component={MyCheckoutDetails}
          transactionName="/MyAccount//details(/edit)"
        />
        <Route
          path="my-details"
          component={CustomerShortProfile}
          transactionName="/MyAccount//my-details"
        />
        <Route
          path="order-history"
          component={OrderHistoryList}
          transactionName="/MyAccount//order-history"
        />
        <Route
          path="order-history/:param"
          component={OrderHistoryDetails}
          transactionName="/MyAccount//order-history/:param"
        />
        <Route
          path="return-history"
          component={ReturnHistoryList}
          transactionName="/MyAccount//return-history"
        />
        <Route
          path="return-history/:param/:id"
          component={ReturnHistoryDetails}
          transactionName="/MyAccount//return-history/:param/:id"
        />
        <Route
          path="e-receipts"
          component={EReceipt}
          transactionName="/MyAccount//e-receipts"
        />
      </Route>
      <Route
        path="/form/:cmsFormName"
        component={CmsForm}
        transactionName="/Form//:cmsFormName"
      />
      <Route
        path="/store-locator"
        component={FixedHeightPage}
        transactionName="/SIS//store-locator"
      >
        <IndexRoute component={StoreLocator} />
      </Route>
      <Route path="ui" component={Ui} />
      <Route
        path="/size-guide/:cmsPageName"
        component={SandBoxPage}
        contentType="page"
        transactionName="/Content//size-guide/:cmsPageName"
        onEnter={(state, replace, cb) => {
          const { cmsPageName } = state.params
          if (!/^[a-zA-Z0-9_-]+$/.test(cmsPageName)) return cb(forbidden())

          cb()
        }}
      />
      {wishlist(state)}
      <Route
        path="/cms-preview/*"
        component={SandBoxPage}
        transactionName="/Content//cms-preview/*"
        onEnter={(state, replace, cb) => {
          const { pathname } = state.location
          if (!isValidECMCPath(pathname)) return cb(forbidden())

          cb()
        }}
      />
      <Route
        key="order-complete"
        path="order-complete"
        component={checkoutOrderComplete}
        transactionName="/Checkout//order-complete"
      />
      {psd2OrderFlow()}
      <Route
        path="/webapp/wcs/stores/servlet/TopCategoriesDisplay"
        component={Home}
        transactionName="/Content//webapp/wcs/stores/servlet/TopCategoriesDisplay"
      />
      <Route
        path="/webapp/wcs/stores/servlet/ProductDisplay"
        component={PdpContainer}
        transactionName="/PDP//webapp/wcs/stores/servlet/ProductDisplay"
      />
      <Route
        path="/webapp/wcs/stores/servlet/ResetPasswordLink"
        component={ResetPassword}
        transactionName="/ResetPassword//webapp/wcs/stores/servlet/ResetPasswordLink"
      />
      <Route
        path="/forgot-password"
        component={ForgotPassword}
        transactionName="/ForgotPassword//forgot-password"
      />
      <Route
        path="/register-success"
        component={RegisterSuccess}
        transactionName="/RegisterSuccess//register-success"
      />
      <Route
        path="/webapp/wcs/stores/servlet/CatalogNavigationSearchResultCmd"
        component={PlpContainer}
        transactionName="/PLP//webapp/wcs/stores/servlet/CatalogNavigationSearchResultCmd"
      />
      <Route
        path="*"
        cmsPageName="error404"
        component={NotFound}
        contentType="page"
        transactionName="/*//*"
      />
    </Route>
  )
}
