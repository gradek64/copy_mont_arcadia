import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as ShippingDestinationActions from '../shippingDestinationActions'
import * as configSelectors from '../../../selectors/configSelectors'
import { defaultLanguages } from '../../../constants/languages'
import * as languageUtils from '../../../lib/language'
import {
  shippingDestinationRedirect,
  getTransferBasketParameters,
} from '../../../lib/change-shipping-destination'

jest.mock('../../../lib/change-shipping-destination', () => ({
  shippingDestinationRedirect: jest.fn(),
  getTransferBasketParameters: jest.fn(),
}))

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Shipping Destination Actions', () => {
  const storeCode = 'tsuk'
  const mockHostname = 'mockHostname'
  const dispatch = jest.fn()
  const getState = jest.fn().mockImplementation(() => ({
    config: {
      storeCode,
    },
    routing: {
      location: {
        hostname: mockHostname,
      },
    },
  }))

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('redirect', () => {
    getTransferBasketParameters.mockReturnValueOnce({})

    it('calls `shippingDestinationRedirect`', () => {
      jest
        .spyOn(configSelectors, 'getLangHostnames')
        .mockReturnValue('getLangHostNamesMockValue')

      ShippingDestinationActions.redirect('United Kingdom', 'English')(
        dispatch,
        getState
      )
      expect(shippingDestinationRedirect).toHaveBeenCalledTimes(1)
      expect(shippingDestinationRedirect).toHaveBeenCalledWith({
        shippingDestination: 'United Kingdom',
        langHostnames: 'getLangHostNamesMockValue',
        thirdPartySiteUrls: {},
        selectedLanguage: 'English',
        optionalParameters: {},
        hostname: mockHostname,
      })
    })

    it('calls `shippingDestinationRedirect` with correct internationalRedirect parameter', () => {
      const initiatedFrom = 'myComponentWhichMakesRedirect'
      jest
        .spyOn(configSelectors, 'getLangHostnames')
        .mockReturnValue('getLangHostNamesMockValue')
      ShippingDestinationActions.redirect(
        'United Kingdom',
        'English',
        initiatedFrom
      )(dispatch, getState)
      expect(shippingDestinationRedirect).toHaveBeenCalledTimes(1)
      expect(shippingDestinationRedirect).toHaveBeenCalledWith({
        shippingDestination: 'United Kingdom',
        langHostnames: 'getLangHostNamesMockValue',
        thirdPartySiteUrls: {},
        selectedLanguage: 'English',
        optionalParameters: {
          internationalRedirect: `${initiatedFrom}-${storeCode}`,
        },
        hostname: mockHostname,
      })
    })

    it('calls `shippingDestinationRedirect` with thirdPartySiteUrls', () => {
      jest
        .spyOn(configSelectors, 'getLangHostnames')
        .mockReturnValue('getLangHostNamesMockValue')

      jest
        .spyOn(configSelectors, 'getThirdPartySiteUrls')
        .mockReturnValue('sg.topshop.com')

      ShippingDestinationActions.redirect('Singapore', 'English')(
        dispatch,
        getState
      )
      expect(shippingDestinationRedirect).toHaveBeenCalledTimes(1)
      expect(shippingDestinationRedirect).toHaveBeenCalledWith({
        shippingDestination: 'Singapore',
        langHostnames: 'getLangHostNamesMockValue',
        selectedLanguage: 'English',
        optionalParameters: {},
        hostname: mockHostname,
        thirdPartySiteUrls: 'sg.topshop.com',
      })
    })
  })

  describe('setLanguage', () => {
    it('should set language and save to storage by default', () => {
      const language = 'foobarish'
      expect(ShippingDestinationActions.setLanguage(language)).toEqual({
        type: 'SET_LANGUAGE',
        language,
        persist: true,
      })
    })

    it('should set language without saving to storage when specified', () => {
      const language = 'foobarish'
      expect(ShippingDestinationActions.setLanguage(language, false)).toEqual({
        type: 'SET_LANGUAGE',
        language,
        persist: false,
      })
    })
  })

  describe('shippingDestination', () => {
    describe('when calling updateShippingDestination', () => {
      const queryCountry = 'Germany'
      const geoCountry = 'France'
      const geoISO = 'FR'
      const siteDefaultCountry = 'Spain'

      const initialState = {
        config: {
          brandCode: 'ts',
          country: siteDefaultCountry,
          siteDeliveryISOs: ['GB'],
        },
        geoIP: {
          geoISO,
        },
      }

      beforeEach(() => {
        jest.clearAllMocks()
        jest.spyOn(ShippingDestinationActions, 'setLanguage')
        jest.spyOn(languageUtils, 'getDefaultLanguageByShippingCountry')
      })

      describe('when "currentCountry" is truthy', () => {
        it('should set destination to "currentCountry", update language and persist the state change', async () => {
          const language = defaultLanguages[queryCountry]
          const persist = true
          const store = mockStore({
            ...initialState,
            routing: {
              location: {
                query: {
                  currentCountry: 'DE',
                },
              },
            },
          })

          await store.dispatch(
            ShippingDestinationActions.updateShippingDestination()
          )

          const expectedActions = [
            {
              type:
                ShippingDestinationActions.shippingDestinationConsts
                  .SET_SHIPPING_DESTINATION,
              destination: 'Germany',
              persist: true,
            },
            {
              type:
                ShippingDestinationActions.shippingDestinationConsts
                  .SET_LANGUAGE,
              language,
              persist,
            },
          ]

          expect(store.getActions()).toEqual(expectedActions)
        })

        it('should set destination to the country passed as argument', async () => {
          const country = 'Vietnam'
          const persist = true
          const store = mockStore({
            ...initialState,
            config: {
              brandCode: 'ts',
              deliveryCountries: [{ iso: 'VN', name: 'Vietnam' }],
            },
          })

          await store.dispatch(
            ShippingDestinationActions.updateShippingDestination(country)
          )

          const expectedActions = [
            {
              type:
                ShippingDestinationActions.shippingDestinationConsts
                  .SET_SHIPPING_DESTINATION,
              destination: country,
              persist,
            },
            {
              type:
                ShippingDestinationActions.shippingDestinationConsts
                  .SET_LANGUAGE,
              language: 'English',
              persist: true,
            },
          ]

          expect(store.getActions()).toEqual(expectedActions)
        })
      })

      describe('when "currentCountry" is falsy but "geoISO" is truthy and site delivers to current "geoISO"', () => {
        it('should set destination to the current "geoISO", update language and NOT persist the state change', async () => {
          const language = defaultLanguages[geoCountry]
          const persist = false
          const store = mockStore({
            ...initialState,
            config: {
              ...initialState.config,
              siteDeliveryISOs: ['GB', 'FR'],
            },
          })

          await store.dispatch(
            ShippingDestinationActions.updateShippingDestination()
          )

          const expectedActions = [
            {
              type:
                ShippingDestinationActions.shippingDestinationConsts
                  .SET_SHIPPING_DESTINATION,
              destination: geoCountry,
              persist,
            },
            {
              type:
                ShippingDestinationActions.shippingDestinationConsts
                  .SET_LANGUAGE,
              language,
              persist,
            },
          ]

          expect(store.getActions()).toEqual(expectedActions)
        })
      })

      describe('when "currentCountry" is falsy and current site does not deliver to geoISO', () => {
        it('should set destination to the "defaultCountry", update language and NOT persist state change', async () => {
          const language = defaultLanguages[siteDefaultCountry]
          const persist = false
          const store = mockStore(initialState)

          await store.dispatch(
            ShippingDestinationActions.updateShippingDestination()
          )

          const expectedActions = [
            {
              type:
                ShippingDestinationActions.shippingDestinationConsts
                  .SET_SHIPPING_DESTINATION,
              destination: siteDefaultCountry,
              persist,
            },
            {
              type:
                ShippingDestinationActions.shippingDestinationConsts
                  .SET_LANGUAGE,
              language,
              persist,
            },
          ]

          expect(store.getActions()).toEqual(expectedActions)
        })
      })

      describe('when shippingDestination has already been set and site does not deliver to geoISO', () => {
        it('should not set the shipping destination or the language', () => {
          const getStateWithShippingDestination = () => ({
            ...getState(),
            shippingDestination: {
              destination: 'FakeLand',
            },
          })
          ShippingDestinationActions.updateShippingDestination()(
            dispatch,
            getStateWithShippingDestination
          )
          expect(dispatch).not.toHaveBeenCalled()
        })
      })
    })
  })
})
