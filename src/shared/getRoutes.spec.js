import React from 'react'
import { match } from 'react-router'
import getRoutes, { asyncImport } from './getRoutes'
import {
  getMockStoreWithInitialReduxState,
  createStore,
} from '../../test/unit/helpers/get-redux-mock-store'
import { mount } from '../../test/unit/helpers/test-component'
import ChangeShippingDestination from './components/containers/ChangeShippingDestination/ChangeShippingDestination'
import Dressipi from './components/containers/Dressipi/Dressipi'
import SandBoxPage, {
  NotFound,
} from './components/containers/SandBoxPage/SandBoxPage'
import PlpContainer from './components/containers/PLP/PlpContainer'
import PdpContainer from './components/containers/PdpContainer/PdpContainer'
import Loader from './components/common/Loader/Loader'
import ErrorMessage from './components/containers/ErrorMessage/ErrorMessage'

const store = getMockStoreWithInitialReduxState()
const context = { l: (x) => x.join('') }
const routes = getRoutes(store, context)
const baseLocation = {
  pathname: '/',
  query: {},
}

const matchRoute = (pathname) =>
  new Promise((resolve, reject) => {
    match(
      { routes, location: { ...baseLocation, pathname } },
      (error, redirectLocation, renderProps) => {
        if (error) return reject(error)
        resolve({ redirectLocation, renderProps })
      }
    )
  })

const getWrappedCompName = (Comp) => {
  if (Comp.WrappedComponent) return getWrappedCompName(Comp.WrappedComponent)
  return Comp.name
}

const expectRouteToMatch = (route, Comp) =>
  it(`"${route}" should match ${getWrappedCompName(
    Comp
  )} component`, async () => {
    expect(
      JSON.stringify((await matchRoute(route)).renderProps.components[1])
    ).toBe(JSON.stringify(Comp))
  })

const expectRouteToRedirect = (route, location) =>
  it(`"${route}" should redirect to ${JSON.stringify(location)}`, async () => {
    expect((await matchRoute(route)).redirectLocation).toEqual(
      expect.objectContaining(location)
    )
  })

describe('asyncImport', () => {
  let store

  global.__webpack_modules__ = {}
  global.__webpack_require__ = jest.fn()
  require.resolveWeak = jest.fn()
  global.window.webpackManifest = { js: {} }
  global.window.loadScript = jest.fn()
  global.window.loadScript.onerror = jest.fn()

  const setWebpackModule = (moduleId, mod) => {
    require.resolveWeak.mockReturnValue(moduleId)
    global.__webpack_modules__[moduleId] = !!mod
    global.__webpack_require__ = jest.fn((id) => {
      if (String(id) === String(moduleId)) return mod
    })
  }

  beforeEach(() => {
    store = createStore({})
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('on the server renders the PdPContainer and passes props to it', () => {
    process.browser = false
    const webpackChunkName = 'PdpContainerMock'
    const PdpContainerMock = asyncImport(
      webpackChunkName,
      () =>
        import(/* webpackChunkName: "PdpContainerMock" */ './components/containers/PdpContainer/PdpContainer'),
      './components/containers/PdpContainer/PdpContainer',
      () =>
        require.resolveWeak('./components/containers/PdpContainer/PdpContainer')
    )

    expect(PdpContainerMock.needs).toBe(PdpContainer.needs)
    expect(PdpContainerMock.webpackChunkName).toBe(webpackChunkName)

    const wrap = mount(<PdpContainerMock foo="bar" />, { store })
    expect(wrap.find(PdpContainer).length).toBe(1)
    expect(wrap.find(PdpContainer).prop('foo')).toBe('bar')
  })

  describe('in the browser', () => {
    it('when component chunk already loaded should render the component', () => {
      process.browser = true
      setWebpackModule(1, { default: PdpContainer })
      const PdpContainerMock = asyncImport(
        'PdpContainerMock',
        () =>
          import(/* webpackChunkName: "PdpContainerMock" */ './components/containers/PdpContainer/PdpContainer'),
        './components/containers/PdpContainer/PdpContainer',
        () =>
          require.resolveWeak(
            './components/containers/PdpContainer/PdpContainer'
          )
      )

      const wrap = mount(<PdpContainerMock foo="bar" />, { store })

      expect(wrap.find(PdpContainer).length).toBe(1)
      expect(wrap.find(PdpContainer).prop('foo')).toBe('bar')
    })

    it('should display a modal error if a chunk could not get loaded', (done) => {
      let wrap
      const store = createStore({})
      process.browser = true

      const PdpContainerMock = asyncImport(
        'PdpContainerMock',
        () =>
          import(/* webpackChunkName: "PdpContainerMock" */ './components/containers/PdpContainer/PdpContainer'),
        './components/containers/PdpContainer/PdpContainer',
        () =>
          require.resolveWeak(
            './components/containers/PdpContainer/PdpContainer'
          )
      )

      global.window.loadScript.mockImplementationOnce((obj) => {
        setTimeout(() => {
          obj.onerror()

          const actions = store.getActions()
          expect(actions.length).toEqual(1)
          expect(actions[0].error.message).toEqual(
            "Sorry, there's been an error with loading the page. Please try again later"
          )

          wrap.update()

          expect(wrap.find(ErrorMessage).length).toBe(1)

          done()
        })
      })

      wrap = mount(<PdpContainerMock />, { store })
    })

    it('when component chunk missing should fetch chunk, render loader then render component after load', (done) => {
      let wrap
      process.browser = true
      setWebpackModule(1, false)
      global.window.loadScript.mockImplementationOnce((obj) => {
        setTimeout(() => {
          setWebpackModule(1, { default: PdpContainer })
          obj.onload()
          wrap.update()
          expect(wrap.find(PdpContainer).length).toBe(1)
          done()
        })
      })
      const PdpContainerMock = asyncImport(
        'PdpContainerMock',
        () =>
          import(/* webpackChunkName: "PdpContainerMock" */ './components/containers/PdpContainer/PdpContainer'),
        './components/containers/PdpContainer/PdpContainer',
        () =>
          require.resolveWeak(
            './components/containers/PdpContainer/PdpContainer'
          )
      )

      wrap = mount(<PdpContainerMock foo="bar" />, { store })
      expect(wrap.find(Loader).length).toBe(1)
    })
  })
})

describe('getRoutes', () => {
  describe('redirects', () => {
    expectRouteToRedirect(
      '/en/tsuk/category/your-details/sign-in-or-register',
      { pathname: '/login' }
    )
    expectRouteToRedirect(
      '/en/tsuk/category/your-details-foo/sign-in-or-register-foo',
      { pathname: '/login' }
    )

    expectRouteToRedirect('/en/tsuk/category/your-details/my-accountr', {
      pathname: '/login',
    })
    expectRouteToRedirect(
      '/en/tsuk/category/your-details-foo/my-accountr-foo',
      { pathname: '/login' }
    )

    expectRouteToRedirect('/en/tsuk/category/store-finder/home', {
      pathname: '/store-locator',
    })
    expectRouteToRedirect('/en/tsuk/category/store-finder-foo/home', {
      pathname: '/store-locator',
    })

    expectRouteToRedirect('/en/tsuk/category/store-locator/home', {
      pathname: '/store-locator',
    })
    expectRouteToRedirect('/en/tsuk/category/store-locator-foo/home', {
      pathname: '/store-locator',
    })

    expectRouteToRedirect('/en/tsuk/category/find-a-store/home', {
      pathname: '/store-locator',
    })
    expectRouteToRedirect('/en/tsuk/category/find-a-store-foo/home', {
      pathname: '/store-locator',
    })
  })

  describe('SandBoxPage', () => {
    expectRouteToMatch('/en/tsuk/category/help-information/tcs', SandBoxPage)
    expectRouteToMatch(
      '/en/tsuk/category/help-information-foo/tcs-foo',
      SandBoxPage
    )

    expectRouteToMatch('/cms/tcs', SandBoxPage)

    expectRouteToMatch(
      '/en/tsuk/category/help-information/foo-bar',
      SandBoxPage
    )
    expectRouteToMatch(
      '/en/tsuk/category/help-information-foo/foo-bar',
      SandBoxPage
    )

    expectRouteToMatch('/en/tsuk/category/your-details/foo-bar', SandBoxPage)
    expectRouteToMatch(
      '/en/tsuk/category/your-details-foo/foo-bar',
      SandBoxPage
    )

    expectRouteToMatch('/en/tsuk/category/foo/home', SandBoxPage)
    expectRouteToMatch('/en/tsuk/category/foo/bar/home', SandBoxPage)
  })

  describe('ChangeShippingDestination', () => {
    expectRouteToMatch(
      '/change-your-shipping-destination',
      ChangeShippingDestination
    )

    expectRouteToMatch(
      '/en/tsuk/category/help-information/change-your-shipping-destination',
      ChangeShippingDestination
    )
    expectRouteToMatch(
      '/en/tsuk/category/help-information/a/change-your-shipping-destination',
      ChangeShippingDestination
    )
    expectRouteToMatch(
      '/en/tsuk/category/help-information/a/b/change-your-shipping-destination',
      ChangeShippingDestination
    )
    expectRouteToMatch(
      '/en/tsuk/category/help-information/change-your-shipping-destination-foo',
      ChangeShippingDestination
    )

    expectRouteToMatch(
      '/en/tsuk/category/your-details/change-your-shipping-destination',
      ChangeShippingDestination
    )
    expectRouteToMatch(
      '/en/tsuk/category/your-details-foo/change-your-shipping-destination-foo',
      ChangeShippingDestination
    )
  })

  describe('Dressipi', () => {
    expectRouteToMatch('/en/tsuk/category/my-topshop-wardrobe', Dressipi)
    expectRouteToMatch('/en/tsuk/category/a/my-topshop-wardrobe', Dressipi)
    expectRouteToMatch('/en/tsuk/category/a/b/my-topshop-wardrobe', Dressipi)
    expectRouteToMatch('/en/tsuk/category/my-topshop-wardrobe-foo', Dressipi)

    expectRouteToMatch(
      '/en/tsuk/category/help-information/my-topshop-wardrobe',
      Dressipi
    )
    expectRouteToMatch(
      '/en/tsuk/category/help-information-foo/my-topshop-wardrobe',
      Dressipi
    )
    expectRouteToMatch(
      '/en/tsuk/category/help-information-foo/my-topshop-wardrobe',
      Dressipi
    )

    expectRouteToMatch(
      '/en/tsuk/category/help-information/style-adviser',
      Dressipi
    )
    expectRouteToMatch(
      '/en/tsuk/category/help-information-foo/style-adviser-foo',
      Dressipi
    )

    expectRouteToMatch('/en/tsuk/category/style-adviser', Dressipi)
    expectRouteToMatch('/en/tsuk/category/a/style-adviser', Dressipi)
    expectRouteToMatch('/en/tsuk/category/a/b/style-adviser', Dressipi)
    expectRouteToMatch('/en/tsuk/category/style-adviser-foo', Dressipi)

    expectRouteToMatch('/style-adviser', Dressipi)
  })

  describe('PlpContainer', () => {
    expectRouteToMatch('/en/tsuk/category/foo/bar', PlpContainer)
    expectRouteToMatch('/en/tsuk/category/foo', PlpContainer)
    expectRouteToMatch('/en/tsuk/category/foo/bar/baz/quux', PlpContainer)

    expectRouteToMatch('/search', PlpContainer)

    expectRouteToMatch('/filter/one', PlpContainer)

    expectRouteToMatch(
      '/webapp/wcs/stores/servlet/CatalogNavigationSearchResultCmd',
      PlpContainer
    )
  })

  describe('PdpContainer', () => {
    expectRouteToMatch('/en/tsuk/product/dress-12345', PdpContainer)
    expectRouteToMatch('/en/tsuk/product/dresses/dress-12345', PdpContainer)
    expectRouteToMatch(
      '/en/tsuk/product/clothing/dresses/dress-12345',
      PdpContainer
    )

    expectRouteToMatch(
      '/webapp/wcs/stores/servlet/ProductDisplay',
      PdpContainer
    )
  })

  describe('notFound404Container', () => {
    expectRouteToMatch('/iAmAnError', NotFound)
    expectRouteToMatch('/en/tsuk/djdjdj', NotFound)
    expectRouteToMatch('/en/tsuk/category/letsHackthesite', PlpContainer)
  })
})
