import AddressFormDetailsContainer, {
  mapStateToProps,
} from '../AddressFormDetailsContainer'

import myAccountMock from '../../../../../../../test/mocks/myAccount-response.json'
import myCheckoutDetailsMocks from '../../../../../../../test/mocks/forms/myCheckoutDetailsFormsMocks'
import configMock from '../../../../../../../test/mocks/config'

// selectors
import { getAddressForm } from '../../../../../selectors/formsSelectors'

describe('<AddressFormDetailsContainer />', () => {
  const state = {
    config: configMock,
    account: {
      user: myAccountMock,
      myCheckoutDetails: {
        editingEnabled: false,
      },
    },
    forms: {
      account: {
        myCheckoutDetails: myCheckoutDetailsMocks,
      },
    },
    findAddress: {
      isManual: false,
    },
  }
  const initialProps = {
    addressType: 'deliveryMCD',
  }

  it('should wrap `AddressFormDetails` component', () => {
    expect(AddressFormDetailsContainer.WrappedComponent.name).toBe(
      'AddressFormDetails'
    )
  })

  describe('mapStateToProps', () => {
    it('should get addressType from state', () => {
      const { addressType } = mapStateToProps(state, initialProps)
      expect(addressType).toEqual(initialProps.addressType)
    })
    it('should get country from state', () => {
      const { country } = mapStateToProps(state, initialProps)
      expect(country).toEqual('United Kingdom')
    })
    it('should get formNames from state', () => {
      const { formNames } = mapStateToProps(state, initialProps)
      expect(formNames).toEqual({
        address: 'deliveryAddressMCD',
        details: 'deliveryDetailsAddressMCD',
        findAddress: 'deliveryFindAddressMCD',
      })
    })
    it('should return getAddressFormFromState', () => {
      const { getAddressFormFromState } = mapStateToProps(state, initialProps)
      expect(getAddressFormFromState).toEqual(getAddressForm)
    })
  })
})
