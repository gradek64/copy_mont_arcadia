import GeoIPPixelCookies from '../GeoIPPixelCookies'
import createRender from 'test/unit/helpers/test-component'
import { getAllBrandHostnames } from '../../../../../server/config'

jest.mock('../../../../../client/lib/logger')

const render = createRender(GeoIPPixelCookies.WrappedComponent)
const props = {
  brandName: 'topshop',
  cookieValue: 'US',
  handleError: jest.fn(),
  handleSuccess: jest.fn(),
  geoIPReduxState: {
    hostname: 'local.m.us.topshop.com',
    geoISO: 'GB',
    storedGeoPreference: '',
  },
  isMobileMainDev: false,
  isDesktopMainDev: false,
}
const topshopHostnames = getAllBrandHostnames(
  'topshop',
  props.geoIPReduxState.hostname
)

delete window.location
window.location = {
  protocol: 'http:',
  host: props.geoIPReduxState.hostname,
}

describe('GeoIPPixelCookies', () => {
  let wrapper

  function assignWrapper(props) {
    const instance = render(props)
    wrapper = instance.wrapper
  }

  beforeEach(() => {
    assignWrapper(props)
    jest.clearAllMocks()
  })

  it('does not call the handleSuccess prop until images have loaded', () => {
    assignWrapper(props)

    expect(wrapper.find('img').length).toBe(topshopHostnames.length)

    wrapper.find('img').forEach((img, i) => {
      expect(img.props().style.visibility).toBe('hidden')
      expect(img.props().style.position).toBe('absolute')
      expect(img.props().style.left).toBe('-1000px')
      expect(img.props().src).toBe(
        `http://local.${topshopHostnames[i]}/api/geo-ip-pixel/${
          props.cookieValue
        }`
      )
      img.props().onLoad()
    })
    expect(props.handleSuccess).toHaveBeenCalled()
  })

  it('excludes m.de.dorothyperkins.com', () => {
    const dpHostnames = getAllBrandHostnames(
      'dorothyperkins',
      'm.dorothyperkins.com'
    )
    assignWrapper({
      ...props,
      brandName: 'dorothyperkins',
      geoIPReduxState: {
        ...props.geoIPReduxState,
        hostname: 'm.dorothyperkins.com',
      },
    })
    expect(wrapper.find('img').length).toBe(dpHostnames.length - 1)
  })

  it(
    'calls the handelError prop when loading geo Pixel images and there is' +
      ' an error',
    () => {
      expect(wrapper.find('img').length).toBe(topshopHostnames.length)

      wrapper
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
      expect(props.handleError).toHaveBeenCalled()
    }
  )
})
