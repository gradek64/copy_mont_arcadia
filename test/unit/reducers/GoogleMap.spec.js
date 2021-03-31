import configureStore from '../../../src/shared/lib/configure-store'
import * as StoreLocatorActions from '../../../src/shared/actions/components/StoreLocatorActions'
import { updateMediaType } from '../../../src/shared/actions/common/viewportActions'

let originalBrowser

describe('GoogleMap integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  beforeAll(() => {
    originalBrowser = process.browser
    Object.defineProperty(process, 'browser', {
      value: true,
    })
  })

  afterAll(() => {
    Object.defineProperty(process, 'browser', {
      value: originalBrowser,
    })
  })

  it('Store Locator reducer initialises google map with default values', () => {
    const store = configureStore()
    const {
      currentLat,
      currentLng,
      currentZoom,
    } = store.getState().storeLocator
    expect(currentLat).toBeTruthy()
    expect(currentZoom).toBeTruthy()
    expect(currentLng).toBeTruthy()
  })
  describe('Configuration', () => {
    const setOptions = jest.fn()

    const Map = jest.fn(() => ({
      getDiv: jest.fn(() => {
        const container = document.createElement('div')
        container.className = 'GoogleMap-map'

        return container
      }),
      setCenter: jest.fn(),
      setZoom: jest.fn(),
      setOptions,
    }))

    beforeEach(() => {
      window.google.maps = {
        event: {
          addListener: jest.fn(),
        },
        Map,
        LatLng: jest.fn(),
      }
      delete window.map

      const insertionPoint = document.createElement('div')
      insertionPoint.className = 'GoogleMap-map'
      document.body.appendChild(insertionPoint)
    })

    it('initMap initialises google map widget using google js library', async () => {
      const store = configureStore()

      await store.dispatch(StoreLocatorActions.initMapWhenGoogleMapsAvailable())

      expect(global.window.google.maps.Map).toHaveBeenCalled()
      expect(window.map).toBeTruthy()
    })

    it('uses a single map instance', async () => {
      const store = configureStore()

      await store.dispatch(StoreLocatorActions.initMapWhenGoogleMapsAvailable())
      await store.dispatch(StoreLocatorActions.initMapWhenGoogleMapsAvailable())

      expect(Map).toHaveBeenCalledTimes(1)
    })

    it('turns on the zoom control when not mobile', async () => {
      const store = configureStore()
      store.dispatch(updateMediaType('desktop'))

      await store.dispatch(StoreLocatorActions.initMapWhenGoogleMapsAvailable())

      expect(Map).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ zoomControl: true })
      )
    })

    it('turns off the zoom control when is mobile', async () => {
      const store = configureStore()
      store.dispatch(updateMediaType('mobile'))

      await store.dispatch(StoreLocatorActions.initMapWhenGoogleMapsAvailable())

      expect(Map).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ zoomControl: false })
      )
    })
  })
})
