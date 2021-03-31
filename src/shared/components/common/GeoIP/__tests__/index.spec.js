import R from 'ramda'
import GeoIP from '../'
import createRender, {
  buildComponentRender,
  mountRender,
  withStore,
} from 'test/unit/helpers/test-component'
import { SUPPORTED_FEATURES } from '../../../../constants/features'
import topshop from '../../../../../server/config/brands/topshop'
import { getAllBrandHostnames } from '../../../../../server/config'
import { info, error } from '../../../../../client/lib/logger'
import { GTM_EVENT } from '../../../../analytics'
import GeoIPPixelCookies from '../GeoIPPixelCookies'
import { translateGeoIPTextInPreferredLanguage } from '../../../../lib/localisation'
import RedirectionPrompt from '../RedirectionPrompt'

jest.mock('../../../../../client/lib/cookie/utils')
jest.mock('../../../../../client/lib/logger')
jest.mock('../../../../lib/localisation')

const { FEATURE_GEOIP } = SUPPORTED_FEATURES

const render = createRender(GeoIP.WrappedComponent)
const mount = (state = {}) =>
  buildComponentRender(
    R.compose(
      mountRender,
      withStore({
        geoIP: {
          hostname: 'm.us.topshop.com',
          geoISO: 'AZ',
          storedGeoPreference: 'FR',
        },
        config: topshop.find((conf) => conf.region === 'us'),
        features: {
          status: {
            [FEATURE_GEOIP]: true,
          },
        },
        ...state,
      })
    ),
    GeoIP.WrappedComponent
  )

const props = {
  redirectURL: 'm.topshop.com',
  currentSiteRegion: 'us',
  currentSiteISO: 'US',
  userISOPreference: 'GB',
  userRegionPreference: 'uk',
  userLanguagePreference: 'en-us',
  brandName: 'topshop',
  l: jest.fn(),
  closeModal: jest.fn(),
  geoIPReduxState: {
    hostname: 'm.us.topshop.com',
    geoISO: 'GB',
    storedGeoPreference: '',
  },
  showFootnote: true,
  handleClose: jest.fn(),
  handleRemoveCloseHandler: jest.fn(),
  sendAnalyticsDisplayEvent: jest.fn(),
  currentSiteLanguage: 'en',
  toggleLoaderOverlay: jest.fn(),
  currentSiteLanguageRegion: 'en-gb',
}
const topshopHostnames = getAllBrandHostnames(
  'topshop',
  props.geoIPReduxState.hostname
)

delete window.location
window.location = {
  protocol: 'http:',
  host: 'local.m.topshop.com',
  assign: jest.fn(),
}

describe('GeoIP Modal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('sends tracking event when mounted', () => {
    mount()(props)
    expect(props.sendAnalyticsDisplayEvent).toHaveBeenCalledTimes(1)
    expect(props.sendAnalyticsDisplayEvent).toHaveBeenCalledWith(
      {
        currentLocale: props.currentSiteRegion,
        suggestedLocale: props.userRegionPreference,
      },
      GTM_EVENT.GEO_IP_MODAL_DISPLAYED
    )
  })

  it('renders the RedirectionPrompt component', () => {
    const { wrapper } = render(props)
    const prompt = wrapper.find(RedirectionPrompt)
    expect(prompt).toHaveLength(1)
    expect(prompt.prop('currentSiteRegion')).toBe('us')
    expect(prompt.prop('userRegionPreference')).toBe('uk')
    expect(prompt.prop('userISOPreference')).toBe('GB')
    expect(prompt.prop('currentSiteISO')).toBe('US')
    expect(prompt.prop('showFootnote')).toBe(true)
  })

  it('does not redirect a user until all images have loaded', () => {
    const { wrapper: geoIP } = mount({})({
      l: () => {},
      handleClose: () => {},
      ...props,
    })

    window.location.href = `https://${props.geoIPReduxState.hostname}`

    const wrapperRedirectionPrompt = geoIP.find(RedirectionPrompt)
    wrapperRedirectionPrompt.prop('setGeoIPCookies')({
      cookieValue: 'GB',
      shouldRedirect: true,
    })()

    geoIP.update()

    geoIP.find('img').forEach((img, i) => {
      expect(window.location.assign).not.toHaveBeenCalled()
      expect(img.props().style.visibility).toBe('hidden')
      expect(img.props().style.position).toBe('absolute')
      expect(img.props().style.left).toBe('-1000px')
      expect(img.props().src).toBe(
        `http://${topshopHostnames[i]}/api/geo-ip-pixel/${
          props.userISOPreference
        }`
      )
      img.props().onLoad()
    })

    expect(info).toHaveBeenCalledWith('GeoIP', {
      message: 'User has been redirected to their preferred site',
      sourceURL: window.location.href,
      newGeoPreference: props.userISOPreference,
      geoIPReduxState: props.geoIPReduxState,
      redirectURL: props.redirectURL,
    })
    expect(window.location.assign).toHaveBeenCalledWith(
      `http://${props.redirectURL}/`
    )
  })

  it('logs an error when loading geo Pixel images and there is an error', () => {
    const geoIPProps = {
      redirectURL: 'https://m.fr.topshop.com',
      hostname: 'm.us.topshop.com',
      geoISO: 'AZ',
      storedGeoPreference: 'FR',
    }

    const { wrapper: geoIP } = mount({
      geoIP: geoIPProps,
    })({ l: () => {}, handleClose: () => {}, ...props })

    const wrapperRedirectionPrompt = geoIP.find(RedirectionPrompt)
    wrapperRedirectionPrompt.prop('setGeoIPCookies')({
      cookieValue: 'GB',
      shouldRedirect: true,
    })()

    geoIP.update()

    expect(geoIP.find('img').length).toBe(topshopHostnames.length)

    geoIP
      .find('img')
      .first()
      .props()
      .onError({
        nativeEvent: {
          currentTarget: {
            currentSrc: window.location.href,
          },
        },
      })
    expect(error).toHaveBeenCalled()
    expect(window.location.assign).not.toHaveBeenCalled()

    window.location.assign.mockRestore()
  })

  it('sets the cookies to the current site ISO if user selects to stay', () => {
    const geoIPProps = {
      ...props,
      redirectURL: 'stage.m.us.topshop.com',
      geoIPReduxState: {
        ...props.geoIPReduxState,
        hostname: 'stage.m.topshop.com',
      },
    }

    const { wrapper: geoIP } = mount()({
      l: () => {},
      handleClose: () => {},
      ...geoIPProps,
    })

    window.location.href = `https://${geoIPProps.hostname}`

    const wrapperRedirectionPrompt = geoIP.find(RedirectionPrompt)
    wrapperRedirectionPrompt.prop('setGeoIPCookies')({
      cookieValue: 'US',
      shouldRedirect: false,
    })()

    geoIP.update()

    expect(geoIP.find('img').length).toBe(topshopHostnames.length)

    const imgs = geoIP.find('img')

    imgs.forEach((img, i) => {
      expect(window.location.assign).not.toHaveBeenCalled()
      expect(img.props().style.visibility).toBe('hidden')
      expect(img.props().style.position).toBe('absolute')
      expect(img.props().style.left).toBe('-1000px')
      expect(img.props().src).toBe(
        `http://${topshopHostnames[i]}/api/geo-ip-pixel/${props.currentSiteISO}`
      )
      img.props().onLoad()
    })
    expect(info).toHaveBeenCalledWith('GeoIP', {
      message: 'User has chosen to stay on the requested site',
      sourceURL: window.location.href,
      newGeoPreference: geoIPProps.currentSiteISO,
      geoIPReduxState: geoIPProps.geoIPReduxState,
      redirectURL: geoIPProps.redirectURL,
    })
    expect(window.location.assign).not.toHaveBeenCalled()
    expect(geoIPProps.closeModal).toHaveBeenCalled()

    window.location.assign.mockRestore()
  })

  it('sets the cookies to the current site ISO if user closes modal', () => {
    let promise
    const handleClose = (handler) => {
      promise = handler()
    }
    const geoIPProps = {
      ...props,
      redirectURL: 'stage.m.us.topshop.com',
      geoIPReduxState: {
        ...props.geoIPReduxState,
        hostname: 'stage.m.topshop.com',
      },
    }

    const { wrapper: geoIP } = mount()({
      l: () => {},
      ...geoIPProps,
      handleClose,
    })
    expect(geoIP.find('img').length).toBe(topshopHostnames.length)

    geoIP.find('img').forEach((img, i) => {
      expect(img.props().style.visibility).toBe('hidden')
      expect(img.props().style.position).toBe('absolute')
      expect(img.props().style.left).toBe('-1000px')
      expect(img.props().src).toBe(
        `http://${topshopHostnames[i]}/api/geo-ip-pixel/${props.currentSiteISO}`
      )
      img.props().onLoad()
    })

    return promise
  })

  it('sets the cookies on a mobile main dev domain', () => {
    const geoIPProps = {
      ...props,
      redirectURL: 'foobar.m.us.topshop.com',
      geoIPReduxState: {
        ...props.geoIPReduxState,
        hostname: 'foobar.m.topshop.com',
      },
    }
    const { wrapper: geoIP } = mount({ geoIP: geoIPProps.geoIPReduxState })({
      l: () => {},
      handleClose: () => {},
      ...geoIPProps,
    })

    const wrapperRedirectionPrompt = geoIP.find(RedirectionPrompt)
    wrapperRedirectionPrompt.prop('setGeoIPCookies')({
      cookieValue: 'US',
      shouldRedirect: false,
    })()

    geoIP.update()

    expect(geoIP.find('img').length).toBe(topshopHostnames.length)

    geoIP.find('img').forEach((img, i) => {
      expect(img.props().src).toBe(
        `http://foobar.${topshopHostnames[i]}/api/geo-ip-pixel/${
          props.currentSiteISO
        }`
      )
    })
  })

  it('sets the cookies on a mobile AWS domain', () => {
    const geoIPProps = {
      ...props,
      redirectURL: 'foo-m-us-topshop-com.digital.arcadiagroup.co.uk',
      geoIPReduxState: {
        ...props.geoIPReduxState,
        hostname: 'foo-m-topshop-com.digital.arcadiagroup.co.uk',
      },
    }
    const { wrapper: geoIP } = mount({
      geoIP: geoIPProps.geoIPReduxState,
      hostname: { isMobileMainDev: true },
    })({
      l: () => {},
      handleClose: () => {},
      ...geoIPProps,
    })

    const wrapperRedirectionPrompt = geoIP.find(RedirectionPrompt)
    wrapperRedirectionPrompt.prop('setGeoIPCookies')({
      cookieValue: 'US',
      shouldRedirect: false,
    })()

    geoIP.update()

    expect(geoIP.find('img').length).toBe(topshopHostnames.length)

    geoIP.find('img').forEach((img, i) => {
      expect(img.props().src).toBe(
        `http://foo-${topshopHostnames[i].replace(
          /\./g,
          '-'
        )}.digital.arcadiagroup.co.uk/api/geo-ip-pixel/${props.currentSiteISO}`
      )
    })
  })

  it('adds port number if used', () => {
    window.location.port = '8080'
    const geoIPProps = {
      ...props,
      redirectURL: 'local.m.us.topshop.com?foo=bar',
      geoIPReduxState: {
        ...props.geoIPReduxState,
        hostname: 'local.m.topshop.com',
      },
    }
    const { wrapper: geoIP } = mount({ geoIP: geoIPProps.geoIPReduxState })({
      l: () => {},
      handleClose: () => {},
      ...geoIPProps,
    })

    const wrapperRedirectionPrompt = geoIP.find(RedirectionPrompt)
    wrapperRedirectionPrompt.prop('setGeoIPCookies')({
      cookieValue: 'GB',
      shouldRedirect: true,
    })()

    geoIP.update()

    geoIP.find('img').forEach((img, i) => {
      expect(img.props().src).toBe(
        `http://local.${topshopHostnames[i]}:8080/api/geo-ip-pixel/${
          props.userISOPreference
        }`
      )
      img.props().onLoad()
    })

    expect(window.location.assign).toHaveBeenCalledWith(
      'http://local.m.us.topshop.com:8080/?foo=bar'
    )
    delete window.location.port
  })

  it('if handleClose callback is called multiple times, throw an error', () => {
    const handleClose = (handler) => {
      handler()
      handler()
    }
    expect(() => render({ ...props, handleClose })).toThrow(
      'Cannot call handleClose callback multiple times'
    )
  })

  it('removes handleClose callback when the GeoIP Modal unmounts', () => {
    const { wrapper } = render(props)
    wrapper.unmount()
    expect(props.handleRemoveCloseHandler).toHaveBeenCalled()
  })

  it('should call toggleLoaderOverlay when shouldSetGeoIPCookies is equal to true', () => {
    const { wrapper: geoIP } = render(props)
    expect(props.toggleLoaderOverlay).not.toHaveBeenCalled()
    geoIP.setState({ shouldSetGeoIPCookies: true })
    geoIP.find(GeoIPPixelCookies).prop('handleSuccess')()
    expect(props.toggleLoaderOverlay).toHaveBeenCalledTimes(1)
  })
})

describe('mapStateToProps', () => {
  it('passes the right props to GeoIP', () => {
    const geoIPProps = {
      redirectURL: 'm.fr.topshop.com',
      currentSiteRegion: 'us',
      currentSiteISO: 'US',
      userISOPreference: 'FR',
      userRegionPreference: 'fr',
      brandName: 'topshop',
      showFootnote: true,
      geoIPReduxState: {
        hostname: 'm.us.topshop.com',
        geoISO: 'AZ',
        storedGeoPreference: 'FR',
      },
      currentSiteLanguage: 'en',
      sendAnalyticsDisplayEvent: () => {},
      toggleLoaderOverlay: () => {},
      closeModal: () => {},
    }
    const { wrapper } = mount()({
      l: () => {},
      handleClose: () => {},
      ...geoIPProps,
    })

    expect(wrapper.find(GeoIP.WrappedComponent).props()).toMatchObject({
      redirectURL: 'm.fr.topshop.com',
      currentSiteRegion: 'us',
      currentSiteISO: 'US',
      userRegionPreference: 'fr',
      userISOPreference: 'FR',
      brandName: 'topshop',
      showFootnote: true,
      geoIPReduxState: {
        hostname: 'm.us.topshop.com',
        geoISO: 'AZ',
        storedGeoPreference: 'FR',
      },
      currentSiteLanguage: 'en',
    })
  })

  it('passes the right props to GeoIP for PDP case', () => {
    const geoIPProps = {
      redirectURL: 'm.fr.topshop.com/fr/tsfr/clothing/robe-1',
      currentSiteRegion: 'us',
      currentSiteISO: 'US',
      userRegionPreference: 'fr',
      userISOPreference: 'FR',
      brandName: 'topshop',
      showFootnote: false,
      geoIPReduxState: {
        redirectURL: 'm.fr.topshop.com/fr/tsfr/clothing/robe-1',
        hostname: 'm.us.topshop.com/en/tsus/clothing/dress-1',
        geoISO: 'AZ',
        storedGeoPreference: 'FR',
      },
      currentSiteLanguage: 'en',
      sendAnalyticsDisplayEvent: () => {},
      toggleLoaderOverlay: () => {},
      closeModal: () => {},
    }
    const { wrapper } = mount()({
      l: () => {},
      handleClose: () => {},
      ...geoIPProps,
    })

    expect(wrapper.find(GeoIP.WrappedComponent).props()).toMatchObject({
      redirectURL: 'm.fr.topshop.com/fr/tsfr/clothing/robe-1',
      currentSiteRegion: 'us',
      currentSiteISO: 'US',
      userRegionPreference: 'fr',
      userISOPreference: 'FR',
      brandName: 'topshop',
      showFootnote: false,
      geoIPReduxState: {
        redirectURL: 'm.fr.topshop.com/fr/tsfr/clothing/robe-1',
        hostname: 'm.us.topshop.com/en/tsus/clothing/dress-1',
        geoISO: 'AZ',
        storedGeoPreference: 'FR',
      },
      currentSiteLanguage: 'en',
    })
  })

  describe('should bind translateGeoIPTextInPreferredLanguage with correct props and pass down as geoTranslate', () => {
    jest.clearAllMocks()
    const featureEnabledProps = {
      ...props,
      brandName: 'topshop',
      userLanguagePreference: 'en-us',
      currentSiteLanguageRegion: 'fr-fr',
    }
    const { wrapper } = render(featureEnabledProps)
    expect(translateGeoIPTextInPreferredLanguage).not.toHaveBeenCalled()
    wrapper.find(RedirectionPrompt).prop('geoTranslate')(
      'some dictionary entry'
    )
    expect(translateGeoIPTextInPreferredLanguage).toHaveBeenCalled()
    expect(translateGeoIPTextInPreferredLanguage).toHaveBeenCalledWith(
      'en-us',
      'fr-fr',
      'topshop',
      'some dictionary entry'
    )
  })
})

describe('@events', () => {
  beforeEach(jest.clearAllMocks)
  const { wrapper: geoIP } = render(props)

  describe('when the user chooses to be redirected', () => {
    it('should call the toggleLoaderOverlay', () => {
      expect(props.toggleLoaderOverlay).not.toHaveBeenCalled()
      geoIP.find(RedirectionPrompt).prop('setGeoIPCookies')({
        cookieValue: 'GB',
        shouldRedirect: true,
      })()
      expect(props.toggleLoaderOverlay).toHaveBeenCalledTimes(1)
    })
  })

  describe('when the user chooses to stay on current site', () => {
    it('should call the toggleLoaderOverlay', () => {
      expect(props.toggleLoaderOverlay).not.toHaveBeenCalled()
      geoIP.find(RedirectionPrompt).prop('setGeoIPCookies')({
        cookieValue: 'US',
        shouldRedirect: false,
      })()
      expect(props.toggleLoaderOverlay).toHaveBeenCalledTimes(1)
    })
  })

  describe('when the close button on the modal is clicked', () => {
    it('should call the toggleLoaderOverlay', () => {
      let onClose
      const handleClose = (handler) => {
        onClose = handler
      }
      render({
        ...props,
        handleClose,
      })
      expect(props.toggleLoaderOverlay).not.toHaveBeenCalled()
      onClose()
      expect(props.toggleLoaderOverlay).toHaveBeenCalledTimes(1)
    })
  })
})
