import AddressBookFormWrapper, {
  mapStateToProps,
  mapDispatchToProps,
} from '../AddressBookFormWrapper'
import {
  touchedFormField,
  clearFormFieldError,
} from '../../../../../actions/common/formActions'

import {
  getYourAddressSchema,
  getYourDetailsSchema,
  getFindAddressSchema,
} from '../../../../../schemas/validation/addressFormValidationSchema'
import {
  getPostCodeRules,
  getCountriesByAddressType,
} from '../../../../../selectors/common/configSelectors'

describe('AddressBookFormWrapper', () => {
  const state = {}
  const initialProps = {
    addressType: 'addressBook',
    onSaveAddress: jest.fn().mockName('fakeSaveAddress'),
    onClose: jest.fn().mockName('fakeClose'),
  }
  it('should wrap AddressBookForm', () => {
    expect(AddressBookFormWrapper.WrappedComponent.name).toBe('AddressBookForm')
  })
  describe('@mapStateToProps', () => {
    it('should set addressType prop', () => {
      const { addressType } = mapStateToProps(state, initialProps)
      expect(addressType).toBe('addressBook')
    })
    it('should set onSaveAddress prop', () => {
      const { onSaveAddress } = mapStateToProps(state, initialProps)
      expect(onSaveAddress.getMockName()).toEqual('fakeSaveAddress')
    })
    it('should set onClose prop', () => {
      const { onClose } = mapStateToProps(state, initialProps)
      expect(onClose.getMockName()).toEqual('fakeClose')
    })
    it('should set addressForm prop', () => {
      const { addressForm } = mapStateToProps(state, initialProps)
      expect(addressForm).toEqual({})
    })
    it('should set detailsForm prop', () => {
      const { detailsForm } = mapStateToProps(state, initialProps)
      expect(detailsForm).toEqual({})
    })
    it('should set findAddressForm prop', () => {
      const { findAddressForm } = mapStateToProps(state, initialProps)
      expect(findAddressForm).toEqual({})
    })

    describe('Setting Validation Schemas', () => {
      const initialProps = {
        addressType: 'addressBook',
        onSaveAddress: jest.fn().mockName('fakeSaveAddress'),
        onClose: jest.fn().mockName('fakeClose'),
      }
      const postcodeRules = getPostCodeRules('United Kingdom', state)
      const countries = getCountriesByAddressType(state, 'delivery')

      it('should set addressValidationSchema prop to an empty object when getIsFindAddressVisible is true and the findAddressValidationSchema to the appropriate schema', () => {
        const state = {
          forms: {
            addressBook: {
              newAddress: {
                fields: {
                  country: {
                    value: 'United Kingdom',
                  },
                  isManual: false,
                },
              },
            },
          },
          config: {
            qasCountries: {
              'United Kingdom': 'UK',
            },
          },
          account: {
            user: {
              billingDetails: {
                addressDetailsId: 1,
              },
            },
          },
        }

        const {
          addressValidationSchema,
          findAddressValidationSchema,
        } = mapStateToProps(state, initialProps)
        expect(addressValidationSchema).toEqual({})
        expect(JSON.stringify(findAddressValidationSchema)).toEqual(
          JSON.stringify(
            getFindAddressSchema(postcodeRules, {
              hasFoundAddress: false,
              hasSelectedAddress: false,
            })
          )
        )
      })
      it('should set addressValidationSchema prop to the appropriate schema when getIsFindAddressVisible is false and the findAddressValidationSchema to an empty object', () => {
        const state = {
          forms: {
            addressBook: {
              newAddress: {
                fields: {
                  country: {
                    value: 'United Kingdom',
                  },
                },
              },
            },
          },
          config: {
            qasCountries: {},
          },
        }

        const {
          findAddressValidationSchema,
          addressValidationSchema,
        } = mapStateToProps(state, initialProps)
        expect(findAddressValidationSchema).toEqual({})
        expect(JSON.stringify(addressValidationSchema)).toEqual(
          JSON.stringify(getYourAddressSchema(postcodeRules, countries))
        )
      })
      it('should set detailsValidationSchema prop to the appropriate schema', () => {
        const state = {
          forms: {
            addressBook: {
              newAddress: {
                fields: {
                  country: {
                    value: 'United Kingdom',
                  },
                },
              },
            },
          },
          account: {
            user: {
              billingDetails: {
                addressDetailsId: 1,
              },
            },
          },
        }

        const { detailsValidationSchema } = mapStateToProps(state, initialProps)
        expect(JSON.stringify(detailsValidationSchema)).toEqual(
          JSON.stringify(getYourDetailsSchema('United Kingdom'))
        )
      })
    })
  })
  describe('@mapDispatchToProps', () => {
    it('should set touchedFormField action', () => {
      expect(mapDispatchToProps.touchedFormField).toEqual(touchedFormField)
    })
    it('should set clearFormFieldError action', () => {
      expect(mapDispatchToProps.clearFormFieldError).toEqual(
        clearFormFieldError
      )
    })
  })
})
