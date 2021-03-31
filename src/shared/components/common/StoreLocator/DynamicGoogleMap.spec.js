import testComponentHelper from 'test/unit/helpers/test-component'

import DynamicGoogleMap from './DynamicGoogleMap'

describe('<DynamicGoogleMap/>', () => {
  const renderComponent = testComponentHelper(DynamicGoogleMap, {
    disableLifecycleMethods: false,
  })

  it('should render only map container if no error has occurred', (done) => {
    const props = {
      initMapWhenGoogleMapsAvailable: jest.fn(() => Promise.resolve()),
    }
    const { wrapper } = renderComponent({ ...props })

    setImmediate(() => {
      wrapper.update()
      expect(wrapper.find('.GoogleMap-map')).not.toBeNull()
      expect(wrapper.find('.GoogleMap-error').exists()).toBe(false)
      done()
    })
  })

  it('should render if there is an error', (done) => {
    const error = 'Unfortunately, we were unable to load the map.'
    const props = {
      initMapWhenGoogleMapsAvailable: jest.fn(() => Promise.reject()),
    }
    const { wrapper } = renderComponent({ ...props })
    // We need to use setImmediate here as componentDidMount uses promises
    // which are are added to the microtask queue so we need to wait until
    // the event loop runs that promise before running our assertions
    setImmediate(() => {
      wrapper.update()
      expect(wrapper.find('.GoogleMap-error').exists()).toBeTruthy()
      expect(wrapper.find('.GoogleMap-error .Button').exists()).toBeTruthy()
      expect(wrapper.find('.GoogleMap-error p').text()).toEqual(error)
      done()
    })
  })

  it('should reload the page if user click on reload button', (done) => {
    const props = {
      initMapWhenGoogleMapsAvailable: jest.fn(() => Promise.reject()),
    }
    // workaround for a known bug in JSDOM reflecting in jest 25
    // https://github.com/facebook/jest/issues/9471
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: jest.fn() },
    })

    Object.defineProperty(window.location, 'reload', {
      writable: true,
      value: jest.fn(),
    })

    const { wrapper } = renderComponent({ ...props })
    // We need to use setImmediate here as componentDidMount uses promises
    // which are are added to the microtask queue so we need to wait until
    // the event loop runs that promise before running our assertions
    setImmediate(() => {
      wrapper.update()
      wrapper.find('.GoogleMap-error .Button').simulate('click')
      expect(window.location.reload).toHaveBeenCalled()
      done()
    })
  })
})
