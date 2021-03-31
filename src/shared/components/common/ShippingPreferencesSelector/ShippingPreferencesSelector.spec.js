import { map } from 'ramda'
import testComponentHelper, {
  renderConnectedComponentProps,
} from '../../../../../test/unit/helpers/test-component'
import ShippingPreferencesSelector, {
  WrappedShippingPreferencesSelector,
  cantFindCountryHelpLinks,
} from './ShippingPreferencesSelector'
import {
  getBrandCode,
  getDefaultLanguage,
} from '../../../selectors/configSelectors'
import { getShippingCountries } from '../../../selectors/common/configSelectors'
import { getShippingDestination } from '../../../selectors/shippingDestinationSelectors'
import GeoIPPixelCookies from '../GeoIP/GeoIPPixelCookies'

jest.mock('../../../selectors/configSelectors')
jest.mock('../../../lib/change-shipping-destination')
jest.mock('../../../selectors/shippingDestinationSelectors')
jest.mock('../../../selectors/common/configSelectors')

const fakeShippingCountries = ['Fakeland', 'United Made-Up Emirates']
const mockProps = {
  brandCode: 'ts',
  currentShippingCountry: 'France',
  defaultShippingCountry: 'United Kingdom',
  defaultLanguage: 'English',
  redirect: jest.fn(),
  geoIPEnabled: true,
  shippingCountries: fakeShippingCountries,
}

function renderComponent(props) {
  const component = testComponentHelper(
    WrappedShippingPreferencesSelector,
    {},
    {
      mockBrowserEventListening: false,
    }
  )(props)

  const $ = {
    countrySelector: '.ShippingPreferencesSelector-countrySelector',
    languageSelector: '.ShippingPreferencesSelector-languageSelector',
    submitButton: '.ShippingPreferencesSelector-submitButton',
    form: '.ShippingPreferencesSelector-form',
  }

  return {
    ...component,
    ...map((selector) => () => component.wrapper.find(selector), $),
    getCountrySelector() {
      return component.wrapper.find($.countrySelector)
    },
  }
}

function MockEvent(value) {
  return {
    preventDefault() {},
    target: {
      value,
    },
  }
}

describe('ShippingPreferencesSelector', () => {
  beforeEach(() => jest.clearAllMocks())

  describe('@renders', () => {
    describe('the country selector', () => {
      it('is populated with the provided shipping countries', () => {
        const { countrySelector } = renderComponent(mockProps)
        expect(countrySelector().prop('options')).toEqual(fakeShippingCountries)
      })

      describe('when no country has been selected', () => {
        describe('if the current shipping country has been set in the redux state', () => {
          it('should have the current shipping country selected by default', () => {
            const { countrySelector } = renderComponent(mockProps)
            expect(countrySelector().prop('value')).toBe(
              mockProps.currentShippingCountry
            )
          })
        })

        describe('if the current shipping country has not yet been set', () => {
          it('should have the default shipping country selected', () => {
            const { countrySelector } = renderComponent({
              ...mockProps,
              currentShippingCountry: undefined,
            })
            expect(countrySelector().prop('value')).toBe(
              mockProps.defaultShippingCountry
            )
          })
        })
      })

      describe('when a country has been selected', () => {
        it('is rendered with the selected shipping country as the selected option', () => {
          const {
            countrySelector,
            getCountrySelector,
            wrapper,
          } = renderComponent(mockProps)
          countrySelector().prop('onChange')(MockEvent('Germany'))
          wrapper.update()
          expect(getCountrySelector().prop('value')).toBe('Germany')
        })
      })
    })

    describe('the language selector', () => {
      describe('when the selected country is flagged to show languages', () => {
        it('is rendered with the specified brand languages ans options', () => {
          const { languageSelector } = renderComponent(mockProps)
          expect(languageSelector()).toHaveLength(1)
        })

        describe('when no language has been explicitely selected', () => {
          it('should fall back to the current site language', () => {
            const props = {
              ...mockProps,
              currentShippingCountry: 'Germany',
              currentLanguage: 'German',
            }
            const { languageSelector } = renderComponent(props)
            expect(
              languageSelector()
                .first()
                .prop('value')
            ).toEqual('German')
          })
        })

        describe('when a language has been explicitely selected', () => {
          it('is rendered with the selected language as the selected option', () => {
            const props = { ...mockProps, currentShippingCountry: 'Germany' }
            const { languageSelector, wrapper } = renderComponent(props)
            languageSelector().prop('onChange')(MockEvent('French'))
            wrapper.update()

            expect(
              languageSelector()
                .first()
                .prop('value')
            ).toEqual('French')
          })
        })
      })

      describe('when the selected country is flagged to not show languages', () => {
        it('does not render the language selector', () => {
          const props = { ...mockProps, currentShippingCountry: 'South Africa' }
          const { languageSelector } = renderComponent(props)
          expect(languageSelector()).toHaveLength(0)
        })
      })
    })

    describe('the `cant find country` help link', () => {
      it('links to the appropriate brand help link', () => {
        const { wrapper } = renderComponent(mockProps)
        const actual = wrapper
          .find('.ShippingPreferencesSelector-cantFindCountryHelpLink')
          .prop('href')
        expect(actual).toEqual(cantFindCountryHelpLinks[mockProps.brandCode])
      })
    })
  })

  describe('@events', () => {
    describe('when the submit button is clicked', () => {
      describe('when geoIP feature is enabled', () => {
        it('sets the state and renders the GeoIPPixelCookies and does not call the shipping redirect', () => {
          const {
            form,
            countrySelector,
            languageSelector,
            wrapper,
          } = renderComponent(mockProps)

          countrySelector()
            .first()
            .prop('onChange')(MockEvent('France'))
          languageSelector().prop('onChange')(MockEvent('French'))
          form().prop('onSubmit')({ preventDefault() {} })
          wrapper.update()

          expect(mockProps.redirect).not.toHaveBeenCalled()

          expect(wrapper.state().shouldSetGeoIPCookies).toBe(true)
          expect(wrapper.find(GeoIPPixelCookies).length).toBe(1)
        })
      })

      describe('when geoIP feature is disabled', () => {
        it('does not render GeoIPPixelCookies', () => {
          const { form, countrySelector, wrapper } = renderComponent({
            ...mockProps,
            geoIPEnabled: false,
          })

          countrySelector().prop('onChange')(MockEvent('Germany'))
          form().prop('onSubmit')({ preventDefault() {} })

          expect(wrapper.find(GeoIPPixelCookies).length).toBe(0)
        })

        describe('only country has been selected', () => {
          it('calls shipping destination redirect with specified country and its default language', () => {
            const { form, countrySelector } = renderComponent({
              ...mockProps,
              geoIPEnabled: false,
            })

            countrySelector().prop('onChange')(MockEvent('France'))
            form().prop('onSubmit')({ preventDefault() {} })

            expect(mockProps.redirect).toHaveBeenCalledWith(
              'France',
              'French',
              'shippingSelectorModal'
            )
          })
        })

        describe('both country and language have been selected', () => {
          it('calls shipping destination redirect with specified country and language', () => {
            const { form, countrySelector, languageSelector } = renderComponent(
              {
                ...mockProps,
                geoIPEnabled: false,
              }
            )

            countrySelector().prop('onChange')(MockEvent('France'))
            languageSelector().prop('onChange')(MockEvent('French'))
            form().prop('onSubmit')({ preventDefault() {} })

            expect(mockProps.redirect).toHaveBeenCalledWith(
              'France',
              'French',
              'shippingSelectorModal'
            )
          })
        })
      })
    })
  })

  describe('@connected', () => {
    it('wraps the ShippingPreferencesSelector', () => {
      expect(ShippingPreferencesSelector.WrappedComponent).toBe(
        WrappedShippingPreferencesSelector
      )
    })

    describe('mapping to props', () => {
      const state = {
        features: {
          status: {
            FEATURE_GEOIP: false,
          },
        },
      }

      beforeEach(() => {
        getBrandCode.mockReturnValue('foo')
        getShippingDestination.mockReturnValue('Fakeland')
        getDefaultLanguage.mockReturnValue('English')
        getShippingCountries.mockReturnValue(fakeShippingCountries)
      })

      describe('prop: brandCode', () => {
        it('is correctly mapped', () => {
          const {
            brandCode,
            currentShippingCountry,
            shippingCountries,
          } = renderConnectedComponentProps(ShippingPreferencesSelector, state)
          expect(brandCode).toBe('foo')
          expect(currentShippingCountry).toBe('Fakeland')
          expect(shippingCountries).toEqual(fakeShippingCountries)
        })
      })
    })
  })
})
