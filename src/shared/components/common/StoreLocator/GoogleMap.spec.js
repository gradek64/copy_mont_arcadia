import GoogleMap from './GoogleMap'
import testComponentHelper from '../../../../../test/unit/helpers/test-component'

describe('<GoogleMap/>', () => {
  const defaultProps = {
    currentLat: 2,
    currentLng: 3,
    markers: [],
    staticMapUrls: {
      url: '',
      signature: '',
    },
    dimensions: { width: 100, height: 100 },
    iconDomain: 'static.foo.com',
    zoom: 15,
    initMapWhenGoogleMapsAvailable: jest.fn(),
    loadGoogleMapScript: jest.fn(),
    signStaticMapsUrl: jest.fn(),
    className: 'sampleClassName',
    borderless: true,
  }

  beforeEach(() => {
    jest.resetAllMocks()
    jest.useFakeTimers()
  })
  const renderComponent = testComponentHelper(GoogleMap.WrappedComponent)

  describe('@renders', () => {
    const props = {
      ...defaultProps,
    }

    const { wrapper, instance } = renderComponent(props)

    describe('when a user click on a the static map', () => {
      it('should display google dynamic map', () => {
        instance.props.loadGoogleMapScript.mockImplementationOnce(() =>
          Promise.resolve()
        )

        wrapper.find('.GoogleMap--staticMap').simulate('click')

        expect(instance.props.loadGoogleMapScript).toHaveBeenCalledTimes(1)
        expect(wrapper.find('DynamicGoogleMap')).toBeTruthy()
        expect(wrapper.hasClass('sampleClassName')).toBe(true)
        expect(wrapper.hasClass('GoogleMap--borderless')).toBe(true)
      })
    })
  })

  describe('componentDidMount()', () => {
    // if no height and width then signStaticMapsUrl shouldn't be called
    it('should call signStaticMapsUrl, if dimensions are provided', async () => {
      const staticMapSpy = jest.fn((args, cb) => {
        cb({ url: 'url', signature: 'signature' })
      })
      const props = {
        ...defaultProps,
        signStaticMapsUrl: staticMapSpy,
      }

      const { wrapper } = renderComponent(props)
      const instance = wrapper.instance()
      instance.componentDidMount()
      expect(staticMapSpy).toHaveBeenCalledWith(
        {
          currentLat: props.currentLat,
          currentLng: props.currentLng,
          markers: props.markers,
          dimensions: props.dimensions,
          iconDomain: props.iconDomain,
          zoom: props.zoom,
        },
        expect.any(Function)
      )
    })

    // if height and width set signStaticMapsUrl should be called
    it("should not call signStaticMapsUrl, if dimensions props aren't provided", async () => {
      const staticMapSpy = jest.fn()
      const props = {
        ...defaultProps,
        signStaticMapsUrl: staticMapSpy,
        dimensions: {},
      }

      const { wrapper } = renderComponent(props)
      await wrapper.update()
      expect(staticMapSpy).not.toHaveBeenCalled()
    })
  })

  describe('Map rendering', () => {
    const testUrl = 'test.url'
    const testSignature = 'test.signature'
    let signStaticMapSpy
    let wrapper
    let instance

    beforeEach(async () => {
      signStaticMapSpy = jest.fn((args, cb) => {
        cb({ url: testUrl, signature: testSignature })
      })
      const props = {
        ...defaultProps,
        signStaticMapsUrl: signStaticMapSpy,
      }
      ;({ wrapper, instance } = renderComponent(props))
      instance.componentDidMount()
      await wrapper.update()
    })

    describe('Renders The Map', () => {
      it('should display image with src attribute staticMapUrl prop is set', () => {
        expect(wrapper.find(`img[src="${testSignature}"]`).length).toBe(1)
      })

      it('should display image with alt tag applied', () => {
        expect(wrapper.find(`img[alt="static map"]`).length).toBe(1)
      })

      it('should fallback to unsigned image src url if image triggers onError', () => {
        wrapper.find('img').simulate('error')
        wrapper.update()
        expect(wrapper.find(`img[src="${testUrl}"]`).length).toBe(1)
      })
    })

    describe('Shows Loader', () => {
      it("should display loading icon if staticMapUrl doesn't exist in state", async () => {
        const props = {
          ...defaultProps,
          dimensions: {},
          signStaticMapsUrl: jest.fn(),
        }
        const { wrapper } = renderComponent(props)
        expect(wrapper.find('Loader').length).toBe(1)
      })
    })
  })
})
