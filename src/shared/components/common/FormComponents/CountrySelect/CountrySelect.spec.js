import testComponentHelper from 'test/unit/helpers/test-component'
import CountrySelect from './CountrySelect'

import { getFormNames } from '../../../../selectors/formsSelectors'

getFormNames.mockImplementation(() => ({
  address: 'yourAddress',
  details: 'yourDetails',
  findAddress: 'findAddress',
}))

jest.mock('../../../../selectors/checkoutSelectors')
jest.mock('../../../../selectors/formsSelectors')
jest.mock('../../../../selectors/common/configSelectors')

describe('<CountrySelect />', () => {
  const requiredProps = {
    addressType: 'deliveryCheckout',
    addressForm: {
      fields: {},
      errors: {},
      message: {},
    },
    country: 'Albania',
    countries: [
      'Albania',
      'Andorra',
      'Anguilla',
      'Armenia',
      'Australia',
      'Austria',
      'Azerbaijan',
    ],
    sendAnalyticsValidationState: () => {},
    setCountry: () => {},
  }

  const renderComponent = testComponentHelper(CountrySelect.WrappedComponent)

  describe('@render', () => {
    it('in default state', () => {
      const { getTree } = renderComponent(requiredProps)
      expect(getTree()).toMatchSnapshot()
    })

    describe('for delivery address', () => {
      it('label should say Delivery country', () => {
        const { wrapper } = renderComponent(requiredProps)

        expect(wrapper.find('.AddressForm-country').prop('label')).toBe(
          'Delivery country'
        )
      })
    })

    describe('for billing address', () => {
      it('label should say Billing country', () => {
        const { wrapper } = renderComponent({
          ...requiredProps,
          addressType: 'billingMCD',
        })

        expect(wrapper.find('.AddressForm-country').prop('label')).toBe(
          'Billing country'
        )
      })
    })

    describe('QubitReact wrappper should container Select component', () => {
      const { wrapper } = renderComponent({ ...requiredProps })
      expect(wrapper.prop('id')).toBe('qubit-delivery-country-select')
    })
  })

  describe('@events and functions', () => {
    it('should call setCountry', () => {
      const setCountryMock = jest.fn()
      const { wrapper } = renderComponent({
        ...requiredProps,
        setCountry: setCountryMock,
        country: 'Albania',
      })

      wrapper.find('.AddressForm-country').simulate('change', {
        target: { value: 'Andorra' },
      })

      expect(setCountryMock).toHaveBeenCalledWith('deliveryCheckout', 'Andorra')
    })
  })
})
