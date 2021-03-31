import testComponentHelper from 'test/unit/helpers/test-component'
import UserLocatorInput from './UserLocatorInput'
import debounce from 'lodash.debounce'

jest.mock('lodash.debounce', () => jest.fn((f) => f))

describe('<UserLocatorInput', () => {
  const predictionArray = [
    {
      place_id: '1',
      description: 'Somewhere',
    },
    {
      place_id: '2',
      description: 'Somewhere',
    },
    {
      place_id: '3',
      description: 'Somewhere',
    },
  ]

  const props = {
    onGetCurrentPositionSuccess: jest.fn(),
    getCurrentLocationError: jest.fn(),
    setFormField: jest.fn(),
    fetchAutocomplete: jest.fn(),
    setSelectedPlace: jest.fn(),
    resetPredictions: jest.fn(),
    passPlaceDescriptionToStoreFinder: jest.fn(),
    resetSearchTerm: jest.fn(),
    resetSelectedPlace: jest.fn(),
    setUserLocatorPending: jest.fn(),
    predictions: [],
    userLocatorSearch: null,
    selectedPlaceDetails: {},
    selectedCountry: null,
    pending: false,
    setUserInputGeoLocation: jest.fn(),
    clearGeolocationError: jest.fn(),
    geoLocationError: false,
  }

  const renderComponent = testComponentHelper(UserLocatorInput.WrappedComponent)

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })
    it('has predictions', () => {
      expect(
        renderComponent({
          ...props,
          predictions: predictionArray,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('has geolocation errors', () => {
      expect(
        renderComponent({
          ...props,
          geoLocationError: 'Random geolocation',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('has geolocation', () => {
      expect(
        renderComponent({
          ...props,
          isFeatureStoreLocatorGpsEnabled: true,
          country: 'a',
          selectedCountry: 'a',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('has geolocation pending state', () => {
      expect(
        renderComponent({
          ...props,
          isFeatureStoreLocatorGpsEnabled: true,
          country: 'a',
          selectedCountry: 'a',
          pending: true,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('selectedCountry=defaultCountry should show input field', () => {
      expect(
        renderComponent({
          ...props,
          selectedCountry: 'United Kingdom',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('has userLocatorSearch', () => {
      expect(
        renderComponent({
          ...props,
          userLocatorSearch: 'searchy mcSearchFace',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('no userLocatorSearch and pending', () => {
      expect(
        renderComponent({
          ...props,
          pending: true,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('has selectedPlaceDetails', () => {
      expect(
        renderComponent({
          ...props,
          selectedPlaceDetails: {
            place_id: 122,
          },
        }).getTree()
      ).toMatchSnapshot()
    })
    it('enabled submit button if submitAlwaysEnabled', () => {
      const { wrapper, getTreeFor } = renderComponent({
        ...props,
        submitAlwaysEnabled: true,
      })
      expect(
        getTreeFor(wrapper.find('.UserLocator-goButton'))
      ).toMatchSnapshot()
    })
  })

  describe('@events', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should resetPredictions via documentClick method', () => {
      const { instance } = renderComponent(props)
      expect(instance.props.resetPredictions).toHaveBeenCalledTimes(0)
      instance.onDocumentClick()
      expect(instance.props.resetPredictions).toHaveBeenCalledTimes(1)
    })

    describe('input is visible', () => {
      describe('input onchange', () => {
        it('should call correct props on change of input', () => {
          const { instance, wrapper } = renderComponent({
            ...props,
            selectedCountry: 'United Kingdom',
            userLocatorSearch: 'searchy mcSearchFace',
            geoLocationError: 'Random geolocation error',
          })

          expect(instance.props.resetSelectedPlace).toHaveBeenCalledTimes(0)
          expect(instance.props.setFormField).toHaveBeenCalledTimes(0)
          expect(instance.props.fetchAutocomplete).toHaveBeenCalledTimes(0)
          expect(debounce).toHaveBeenCalledTimes(1)

          wrapper
            .find('input')
            .simulate('change', { target: { value: 'blah' } })

          expect(instance.props.clearGeolocationError).toHaveBeenCalledTimes(1)
          expect(instance.props.resetSelectedPlace).toHaveBeenCalledTimes(1)
          expect(instance.props.setFormField).toHaveBeenCalledTimes(1)
          expect(instance.props.setFormField).toHaveBeenCalledWith(
            'userLocator',
            'userLocation',
            'blah'
          )
          expect(instance.props.fetchAutocomplete).toHaveBeenCalledTimes(1)
          expect(instance.props.fetchAutocomplete).toHaveBeenCalledWith('blah')
        })

        it('should clear value if current input value is Current Location', () => {
          const { instance, wrapper } = renderComponent({
            ...props,
            country: 'United Kingdom',
            isFeatureStoreLocatorGpsEnabled: true,
            selectedCountry: 'United Kingdom',
            userLocatorSearch: 'Current Location',
            userInputGeoLocation: true,
          })

          const locationInput = wrapper.find('#UserLocatorInput')

          expect(locationInput.props().value).toBe('Current Location')

          locationInput.simulate('click')

          expect(instance.props.setFormField).toHaveBeenCalledWith(
            'userLocator',
            'userLocation',
            ''
          )
        })

        it('should focus but not clear input value if not Current Location', () => {
          const { instance, wrapper } = renderComponent({
            ...props,
            country: 'United Kingdom',
            isFeatureStoreLocatorGpsEnabled: true,
            selectedCountry: 'United Kingdom',
            userLocatorSearch: 'W1T 3NL',
          })

          const locationInput = wrapper.find('#UserLocatorInput')

          expect(locationInput.props().value).toBe('W1T 3NL')

          locationInput.simulate('click')

          expect(instance.props.setFormField).not.toHaveBeenCalled()
        })
      })

      describe('clear search button', () => {
        it('clear button', () => {
          const { instance, wrapper } = renderComponent({
            ...props,
            selectedCountry: 'United Kingdom',
            country: 'United Kingdom',
            userLocatorSearch: 'searchy mcSearchFace',
          })

          expect(instance.props.setFormField).toHaveBeenCalledTimes(0)
          expect(instance.props.resetPredictions).toHaveBeenCalledTimes(0)
          expect(instance.props.resetSearchTerm).toHaveBeenCalledTimes(0)
          expect(instance.props.resetSelectedPlace).toHaveBeenCalledTimes(0)

          wrapper.find('.UserLocatorInput-clearButton').simulate('click')

          expect(instance.props.setFormField).toHaveBeenCalledTimes(1)
          expect(instance.props.setFormField).toHaveBeenCalledWith(
            'userLocator',
            'userLocation',
            ''
          )
          expect(instance.props.resetPredictions).toHaveBeenCalledTimes(1)
          expect(instance.props.resetSearchTerm).toHaveBeenCalledTimes(1)
          expect(instance.props.resetSelectedPlace).toHaveBeenCalledTimes(1)
        })
      })
    })

    describe('Get my current location button', () => {
      let preventDefault
      let getCurrentPos

      beforeEach(() => {
        preventDefault = jest.fn()
        getCurrentPos = jest.fn()

        global.window.navigator.geolocation = {
          getCurrentPosition: getCurrentPos,
        }
      })

      afterEach(() => {
        global.window.navigator.geolocation = undefined
      })

      it('should call preventDefault when clicked', () => {
        const { wrapper } = renderComponent({
          ...props,
          geoLocationEnabled: true,
          country: 'a',
          selectedCountry: 'a',
          isFeatureStoreLocatorGpsEnabled: true,
        })

        expect(preventDefault).toHaveBeenCalledTimes(0)
        wrapper
          .find('.UserLocatorInput-currentLocationButton')
          .simulate('click', { preventDefault })
        expect(preventDefault).toHaveBeenCalledTimes(1)
      })

      it('should call setUserLocatorPending', () => {
        const { instance, wrapper } = renderComponent({
          ...props,
          geoLocationEnabled: true,
          country: 'a',
          selectedCountry: 'a',
          isFeatureStoreLocatorGpsEnabled: true,
        })

        expect(instance.props.setUserLocatorPending).toHaveBeenCalledTimes(0)

        wrapper
          .find('.UserLocatorInput-currentLocationButton')
          .simulate('click', { preventDefault })

        expect(instance.props.setUserLocatorPending).toHaveBeenCalledTimes(1)
        expect(instance.props.setUserLocatorPending).toHaveBeenCalledWith(true)
      })

      it('should call getCurrentPosition with correct arguments', () => {
        const { wrapper } = renderComponent({
          ...props,
          geoLocationEnabled: true,
          country: 'a',
          selectedCountry: 'a',
          isFeatureStoreLocatorGpsEnabled: true,
        })

        expect(getCurrentPos).toHaveBeenCalledTimes(0)

        wrapper
          .find('.UserLocatorInput-currentLocationButton')
          .simulate('click', { preventDefault })

        expect(getCurrentPos).toHaveBeenCalledTimes(1)
      })
    })

    describe('prediction list', () => {
      it('should call correct methods on click', () => {
        const { instance } = renderComponent({
          ...props,
          selectedCountry: 'United Kingdom',
          userLocatorSearch: 'searchy mcSearchFace',
          predictions: predictionArray,
        })

        expect(instance.props.resetPredictions).toHaveBeenCalledTimes(0)
        expect(instance.props.setSelectedPlace).toHaveBeenCalledTimes(0)
        expect(instance.props.setFormField).toHaveBeenCalledTimes(0)
        expect(
          instance.props.passPlaceDescriptionToStoreFinder
        ).toHaveBeenCalledTimes(0)

        instance.setUserSelectedPlace(predictionArray[0])

        expect(instance.props.resetPredictions).toHaveBeenCalledTimes(1)
        expect(instance.props.setSelectedPlace).toHaveBeenCalledTimes(1)
        expect(instance.props.setFormField).toHaveBeenCalledTimes(1)
      })
      it('should call correct methods on arrow key/enter select of prediction', () => {
        const { wrapper, instance } = renderComponent({
          ...props,
          selectedCountry: 'United Kingdom',
          userLocatorSearch: 'searchy mcSearchFace',
          predictions: predictionArray,
        })

        expect(instance.props.resetPredictions).toHaveBeenCalledTimes(0)
        expect(instance.props.setSelectedPlace).toHaveBeenCalledTimes(0)
        expect(instance.props.setFormField).toHaveBeenCalledTimes(0)

        const locationInput = wrapper.find('#UserLocatorInput')
        locationInput.simulate('keydown', { keyCode: 40 })
        locationInput.simulate('keydown', { keyCode: 13 })

        expect(instance.props.resetPredictions).toHaveBeenCalledTimes(1)
        expect(instance.props.setSelectedPlace).toHaveBeenCalledWith({
          place_id: '2',
          description: 'Somewhere',
        })
        expect(instance.props.setFormField).toHaveBeenCalledTimes(1)
      })
    })
  })
})
