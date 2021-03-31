import { orderSummaryUkStandard as orderSummaryWithNoSavedAddressesMock } from '../../../../test/mocks/orderSummary/uk-standard'
import orderSummaryWithSavedAddressesMock from '../../../../test/mocks/orderSummary/savedAddresses'
import {
  getSavedAddresses,
  getIsNewAddressFormVisible,
  getDefaultCountry,
  getHasFoundAddress,
  getHasSelectedAddress,
} from '../addressBookSelectors'
import { getFormNames } from '../formsSelectors'

describe('addressBookSelectors', () => {
  describe('getSavedAddresses', () => {
    describe('when there is no account delivery address and no order summary', () => {
      const state = {
        checkout: {},
        account: {
          user: {
            deliveryDetails: {
              addressDetailsId: -1,
              nameAndPhone: {
                title: '',
                firstName: '',
                lastName: '',
                telephone: '',
              },
              address: {
                address1: '',
                address2: '',
                city: '',
                state: '',
                country: '',
                postcode: '',
              },
            },
          },
        },
      }

      it('should return an empty array', () => {
        const actual = getSavedAddresses(state)
        const expected = []
        expect(actual).toEqual(expected)
      })
    })

    describe('when there is no account delivery address and no saved addresses', () => {
      const state = {
        checkout: {
          orderSummary: orderSummaryWithNoSavedAddressesMock,
        },
        account: {
          user: {
            deliveryDetails: {
              addressDetailsId: -1,
              nameAndPhone: {
                title: '',
                firstName: '',
                lastName: '',
                telephone: '',
              },
              address: {
                address1: '',
                address2: '',
                city: '',
                state: '',
                country: '',
                postcode: '',
              },
            },
          },
        },
      }
      it('should return an empty array', () => {
        const actual = getSavedAddresses(state)
        const expected = []
        expect(actual).toEqual(expected)
      })
    })
    describe('when there is account delivery address and no saved addresses', () => {
      const state = {
        checkout: {
          orderSummary: orderSummaryWithNoSavedAddressesMock,
        },
        account: {
          user: {
            deliveryDetails: {
              addressDetailsId: 2245363,
              nameAndPhone: {
                title: 'Mrs',
                firstName: 'new first name',
                lastName: 'Williams',
                telephone: '07971134030',
              },
              address: {
                address1: '7 Hannah Close',
                address2: 'Llanishen',
                city: 'CARDIFF',
                state: '',
                country: 'United Kingdom',
                postcode: 'se5 9hr',
              },
            },
          },
        },
      }
      it('should return the account delivery address', () => {
        const actual = getSavedAddresses(state)
        const expected = [
          {
            id: 2245363,
            addressName: 'CARDIFF, se5 9hr, United Kingdom',
            selected: true,
            address1: '7 Hannah Close',
            address2: 'Llanishen',
            city: 'CARDIFF',
            state: '',
            postcode: 'se5 9hr',
            country: 'United Kingdom',
            title: 'Mrs',
            firstName: 'new first name',
            lastName: 'Williams',
            telephone: '07971134030',
          },
        ]
        expect(actual).toEqual(expected)
      })
    })
    describe('when there are saved addresses', () => {
      const state = {
        checkout: {
          orderSummary: orderSummaryWithSavedAddressesMock,
        },
        account: {
          user: {
            deliveryDetails: {
              addressDetailsId: 2245363,
              nameAndPhone: {
                title: 'Mrs',
                firstName: 'new first name',
                lastName: 'Williams',
                telephone: '07971134030',
              },
              address: {
                address1: '7 Hannah Close',
                address2: 'Llanishen',
                city: 'CARDIFF',
                state: '',
                country: 'United Kingdom',
                postcode: 'se5 9hr',
              },
            },
          },
        },
      }
      it('should return the saved addresses', () => {
        const actual = getSavedAddresses(state)
        const expected = [
          {
            id: 843489,
            addressName: 'London, E3 2DS, United Kingdom',
            selected: true,
            address1: '2 Foo Road',
            address2: '',
            city: 'London',
            state: '',
            postcode: 'E3 2DS',
            country: 'United Kingdom',
            title: 'Ms',
            firstName: 'Jane',
            lastName: 'Doe',
            telephone: '01234 567890',
          },
        ]
        expect(actual).toEqual(expected)
      })
    })
  })
  describe('getIsNewAddressFormVisible', () => {
    const state = {
      addressBook: {
        isNewAddressFormVisible: true,
      },
    }
    it('should isNewAddressFormVisible', () => {
      const actual = getIsNewAddressFormVisible(state)
      const expected = true
      expect(actual).toEqual(expected)
    })
  })
  describe('getFormNames', () => {
    it('should return the newAddress form names', () => {
      const actual = getFormNames('addressBook')
      const expected = {
        address: 'newAddress',
        details: 'newDetails',
        findAddress: 'newFindAddress',
        deliverToAddress: 'newDeliverToAddress',
      }
      expect(actual).toEqual(expected)
    })
  })

  describe('getDefaultCountry', () => {
    it('should return the country from user deliveryDetails when is set', () => {
      const state = {
        account: {
          user: {
            deliveryDetails: {
              address: {
                country: 'United Kingdom',
              },
            },
          },
        },
        config: {
          country: 'Albania',
        },
      }
      const actual = getDefaultCountry(state)
      const expected = 'United Kingdom'
      expect(actual).toBe(expected)
    })
    it('should return the country from the brand config when the user deliveryDetails is not set', () => {
      const state = {
        config: {
          country: 'Albania',
        },
      }
      const actual = getDefaultCountry(state)
      const expected = 'Albania'
      expect(actual).toBe(expected)
    })
  })

  describe('getHasFoundAddress', () => {
    it('should return true when the value of findAddress is truthy', () => {
      const findAddressForm = {
        fields: {
          findAddress: {
            value: 'something true',
          },
        },
      }

      const actual = getHasFoundAddress(findAddressForm)
      const expected = true
      expect(actual).toBe(expected)
    })

    it('should return false when the value of findAddress is falsey', () => {
      const findAddressForm = {
        fields: {
          findAddress: {
            value: '',
          },
        },
      }

      const actual = getHasFoundAddress(findAddressForm)
      const expected = false
      expect(actual).toBe(expected)
    })
  })

  describe('getHasSelectedAddress', () => {
    it('should return true when the value of address1 is truthy', () => {
      const addressForm = {
        fields: {
          address1: {
            value: 'something true',
          },
        },
      }

      const actual = getHasSelectedAddress(addressForm)
      const expected = true
      expect(actual).toBe(expected)
    })

    it('should return false when the value of address1 is falsey', () => {
      const addressForm = {
        fields: {
          address1: {
            value: '',
          },
        },
      }

      const actual = getHasSelectedAddress(addressForm)
      const expected = false
      expect(actual).toBe(expected)
    })
  })
})
