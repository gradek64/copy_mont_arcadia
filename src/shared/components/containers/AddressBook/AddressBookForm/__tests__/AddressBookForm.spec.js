import { compose } from 'ramda'
import testComponentHelper, {
  buildComponentRender,
  shallowRender,
  mountRender,
  withStore,
} from '../../../../../../../test/unit/helpers/test-component'
import AddressBookForm from '../AddressBookForm'
import { addressBookFormMock } from '../../../../../../../test/mocks/forms/addressBookFormMock'
import {
  getPostCodeRules,
  getCountriesByAddressType,
} from '../../../../../selectors/common/configSelectors'
import {
  getYourAddressSchema,
  getYourDetailsSchema,
  getFindAddressSchema,
} from '../../../../../schemas/validation/addressFormValidationSchema'
import { scrollElementIntoView } from '../../../../../lib/scroll-helper'

jest.mock('../../../../../lib/scroll-helper', () => ({
  scrollElementIntoView: jest.fn(),
}))

describe('AddressBookForm', () => {
  const state = {
    forms: {
      addressBook: addressBookFormMock,
    },
    features: {
      status: {
        FEATURE_ADDRESS_BOOK: true,
      },
    },
    config: {
      deliveryCountries: [{ iso: 'UK', name: 'United Kingdom' }],
      checkoutAddressFormRules: {
        'United Kingdom': {
          pattern:
            '^(([gG][iI][rR] {0,}0[aA]{2})|(([aA][sS][cC][nN]|[sS][tT][hH][lL]|[tT][dD][cC][uU]|[bB][bB][nN][dD]|[bB][iI][qQ][qQ]|[fF][iI][qQ][qQ]|[pP][cC][rR][nN]|[sS][iI][qQ][qQ]|[iT][kK][cC][aA]) {0,}1[zZ]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yxA-HK-XY]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$',
          postcodeLabel: 'Postcode',
          premisesRequired: false,
          premisesLabel: 'House number',
        },
      },
    },
    siteOptions: {
      titles: ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr'],
    },
  }
  const countries = getCountriesByAddressType(state, 'addressBook')
  const rules = getPostCodeRules(state, 'United Kingdom')
  const renderComponent = testComponentHelper(AddressBookForm)
  describe('@render', () => {
    it('should show the newAddress form', () => {
      const props = {
        addressType: 'addressBook',
        onSaveAddress: jest.fn(),
        closeAccordionWithAddress: jest.fn(),
        onClose: jest.fn(),
        addressForm: {
          fields: {
            address1: {
              value: '',
            },
            address2: {
              value: null,
            },
            city: {
              value: '',
            },
            country: {
              value: '',
            },
            postcode: {
              value: '',
            },
            state: {
              value: '',
            },
          },
          errors: {},
        },
        detailsForm: {
          fields: {
            title: {
              value: '',
            },
            firstName: {
              value: '',
            },
            lastName: {
              value: '',
            },
            telephone: {
              value: '',
            },
          },
          errors: {},
        },
        findAddressForm: {
          fields: {
            houseNumber: {
              value: '',
            },
            postcode: {
              value: '',
            },
          },
          errors: {},
        },
        addressValidationSchema: {},
        detailsValidationSchema: {},
        findAddressValidationSchema: {},
        touchedFormField: jest.fn(),
        clearFormFieldError: jest.fn(),
        dispatch: jest.fn(),
      }
      const { getTree } = renderComponent(props)
      expect(getTree()).toMatchSnapshot()
    })
  })
  describe('@events', () => {
    it('should call the onSaveAddress function when the form is submitted with a valid address', () => {
      const props = {
        addressType: 'addressBook',
        onSaveAddress: jest.fn(() => Promise.resolve()),
        onClose: jest.fn(),
        addressForm: {
          fields: {
            address1: {
              value: '1 Acme Road',
            },
            address2: {
              value: null,
            },
            city: {
              value: 'London',
            },
            country: {
              value: 'United Kingdom',
            },
            postcode: {
              value: 'EC3N 1JJ',
            },
            state: {
              value: '',
            },
            deliverToAddress: '',
          },
          errors: {},
        },
        detailsForm: {
          fields: {
            title: {
              value: 'Mr',
            },
            firstName: {
              value: 'Jose',
            },
            lastName: {
              value: 'Quinto',
            },
            telephone: {
              value: '01234567890',
            },
          },
          errors: {},
        },
        findAddressForm: {
          fields: {
            houseNumber: {
              value: '',
            },
            postcode: {
              value: '',
            },
          },
          errors: {},
        },
        addressValidationSchema: getYourAddressSchema(rules, countries),
        detailsValidationSchema: getYourDetailsSchema('United Kingdom', {
          hasSelectedAddress: true,
        }),
        findAddressValidationSchema: getFindAddressSchema(rules, {
          hasFoundAddresses: true,
          hasSelectedAddress: true,
        }),
        touchedFormField: jest.fn(),
        clearFormFieldError: jest.fn(),
        dispatch: jest.fn(),
      }
      const { wrapper } = renderComponent(props)
      wrapper.find('DeliverToAddressBttnForm').prop('onSubmitForm')({
        preventDefault: jest.fn(),
      })
      expect(props.clearFormFieldError).toHaveBeenCalledWith(
        'newDeliverToAddress',
        'deliverToAddress'
      )
      expect(props.onSaveAddress).toHaveBeenCalledTimes(1)
    })
    it('should call the onSaveAddress function when the form is submitted with a valid address & phone number that has a space', () => {
      const props = {
        addressType: 'addressBook',
        onSaveAddress: jest.fn(() => Promise.resolve()),
        onClose: jest.fn(),
        addressForm: {
          fields: {
            address1: {
              value: '1 Acme Road',
            },
            address2: {
              value: null,
            },
            city: {
              value: 'London',
            },
            country: {
              value: 'United Kingdom',
            },
            postcode: {
              value: 'EC3N 1JJ',
            },
            state: {
              value: '',
            },
          },
          errors: {},
        },
        detailsForm: {
          fields: {
            title: {
              value: 'Mr',
            },
            firstName: {
              value: 'Jose',
            },
            lastName: {
              value: 'Quinto',
            },
            telephone: {
              value: '01234 567890',
            },
            deliverToAddress: '',
          },
          errors: {},
        },
        findAddressForm: {
          fields: {
            houseNumber: {
              value: '',
            },
            postcode: {
              value: '',
            },
          },
          errors: {},
        },
        addressValidationSchema: getYourAddressSchema(rules, countries),
        detailsValidationSchema: getYourDetailsSchema('United Kingdom', {
          hasSelectedAddress: true,
        }),
        findAddressValidationSchema: getFindAddressSchema(rules, {
          hasFoundAddresses: true,
          hasSelectedAddress: true,
        }),
        touchedFormField: jest.fn(),
        clearFormFieldError: jest.fn(),
        dispatch: jest.fn(),
      }
      const { wrapper } = renderComponent(props)
      wrapper.find('DeliverToAddressBttnForm').prop('onSubmitForm')({
        preventDefault: jest.fn(),
      })
      expect(props.clearFormFieldError).toHaveBeenCalledWith(
        'newDeliverToAddress',
        'deliverToAddress'
      )
      expect(props.onSaveAddress).toHaveBeenCalledTimes(1)
    })
    it('should call the validateDDPForCountry on onSaveAddress success when bag has DDP product', () => {
      const props = {
        addressType: 'addressBook',
        onSaveAddress: jest.fn(() => Promise.resolve()),
        closeAccordionWithAddress: jest.fn(),
        bagHasDDPProduct: false,
        validateDDPForCountry: jest.fn(),
        onClose: jest.fn(),
        addressForm: {
          fields: {
            address1: {
              value: '1 Acme Road',
            },
            address2: {
              value: null,
            },
            city: {
              value: 'London',
            },
            country: {
              value: 'United Kingdom',
            },
            postcode: {
              value: 'EC3N 1JJ',
            },
            state: {
              value: '',
            },
          },
          errors: {},
        },
        detailsForm: {
          fields: {
            title: {
              value: 'Mr',
            },
            firstName: {
              value: 'Jose',
            },
            lastName: {
              value: 'Quinto',
            },
            telephone: {
              value: '01234 567890',
            },
            deliverToAddress: '',
          },
          errors: {},
        },
        findAddressForm: {
          fields: {
            houseNumber: {
              value: '',
            },
            postcode: {
              value: '',
            },
          },
          errors: {},
        },
        addressValidationSchema: getYourAddressSchema(rules, countries),
        detailsValidationSchema: getYourDetailsSchema('United Kingdom', {
          hasSelectedAddress: true,
        }),
        findAddressValidationSchema: getFindAddressSchema(rules, {
          hasFoundAddresses: true,
          hasSelectedAddress: true,
        }),
        touchedFormField: jest.fn(),
        clearFormFieldError: jest.fn(),
        dispatch: jest.fn(),
      }
      const { wrapper } = renderComponent(props)
      wrapper.find('DeliverToAddressBttnForm').prop('onSubmitForm')({
        preventDefault: jest.fn(),
      })
      expect(props.clearFormFieldError).toHaveBeenCalledWith(
        'newDeliverToAddress',
        'deliverToAddress'
      )
      props.onSaveAddress().then(() => {
        expect(props.validateDDPForCountry).toHaveBeenCalled()
        expect(props.closeAccordionWithAddress).toHaveBeenCalled()
      })
    })
    it('should not call the onSaveAddress function when the form is submitted with no details', () => {
      const props = {
        addressType: 'addressBook',
        onSaveAddress: jest.fn(),
        onClose: jest.fn(),
        addressForm: {
          fields: {
            address1: {
              value: '1 Acme Road',
            },
            address2: {
              value: null,
            },
            city: {
              value: 'London',
            },
            country: {
              value: 'United Kingdom',
            },
            postcode: {
              value: 'EC3N 1JJ',
            },
            state: {
              value: '',
            },
          },
          errors: {},
        },
        detailsForm: {
          fields: {
            title: {
              value: '',
            },
            firstName: {
              value: '',
            },
            lastName: {
              value: '',
            },
            telephone: {
              value: '',
            },
          },
          errors: {},
        },
        findAddressForm: {
          fields: {
            houseNumber: {
              value: '',
            },
            postcode: {
              value: '',
            },
          },
          errors: {},
        },
        addressValidationSchema: getYourAddressSchema(rules, countries),
        detailsValidationSchema: getYourDetailsSchema('United Kingdom'),
        findAddressValidationSchema: getFindAddressSchema(rules, {
          hasFoundAddress: true,
          hasSelectedAddress: true,
        }),
        touchedFormField: jest.fn(),
        clearFormFieldError: jest.fn(),
        dispatch: jest.fn(),
      }
      const render = compose(
        shallowRender,
        withStore(state)
      )
      const renderComponent = buildComponentRender(render, AddressBookForm)
      const { wrapper } = renderComponent(props)
      wrapper.find('DeliverToAddressBttnForm').prop('onSubmitForm')({
        preventDefault: jest.fn(),
      })
      expect(props.clearFormFieldError).toHaveBeenCalledWith(
        'newDeliverToAddress',
        'deliverToAddress'
      )
      expect(props.onSaveAddress).not.toHaveBeenCalled()
    })
    it('should not call the onSaveAddress function when the form is submitted with no address', () => {
      const props = {
        addressType: 'addressBook',
        onSaveAddress: jest.fn(),
        onClose: jest.fn(),
        addressForm: {
          fields: {
            address1: {
              value: '',
            },
            address2: {
              value: null,
            },
            city: {
              value: '',
            },
            country: {
              value: '',
            },
            postcode: {
              value: '',
            },
            state: {
              value: '',
            },
          },
          errors: {},
        },
        detailsForm: {
          fields: {
            title: {
              value: 'Mr',
            },
            firstName: {
              value: 'Jose',
            },
            lastName: {
              value: 'Quinto',
            },
            telephone: {
              value: '01234567890',
            },
          },
          errors: {},
        },
        findAddressForm: {
          fields: {
            houseNumber: {
              value: '',
            },
            postcode: {
              value: '',
            },
          },
          errors: {},
        },
        addressValidationSchema: getYourAddressSchema(rules),
        detailsValidationSchema: getYourDetailsSchema('United Kingdom'),
        findAddressValidationSchema: getFindAddressSchema(rules, {
          hasFoundAddress: true,
          hasSelectedAddress: true,
        }),
        touchedFormField: jest.fn(),
        clearFormFieldError: jest.fn(),
        dispatch: jest.fn(),
      }
      const render = compose(
        shallowRender,
        withStore(state)
      )
      const renderComponent = buildComponentRender(render, AddressBookForm)
      const { wrapper } = renderComponent(props)
      wrapper.find('DeliverToAddressBttnForm').prop('onSubmitForm')({
        preventDefault: jest.fn(),
      })
      expect(props.clearFormFieldError).toHaveBeenCalledWith(
        'newDeliverToAddress',
        'deliverToAddress'
      )
      expect(props.onSaveAddress).not.toHaveBeenCalled()
    })
    it('should not call the onSaveAddress function when the form is submitted with details and no find address', () => {
      const props = {
        addressType: 'addressBook',
        onSaveAddress: jest.fn(),
        onClose: jest.fn(),
        addressForm: {
          fields: {
            address1: {
              value: '',
            },
            address2: {
              value: null,
            },
            city: {
              value: '',
            },
            country: {
              value: '',
            },
            postcode: {
              value: '',
            },
            state: {
              value: '',
            },
          },
          errors: {},
        },
        detailsForm: {
          fields: {
            title: {
              value: 'Mr',
            },
            firstName: {
              value: 'Jose',
            },
            lastName: {
              value: 'Quinto',
            },
            telephone: {
              value: '01234567890',
            },
          },
          errors: {},
        },
        findAddressForm: {
          fields: {
            houseNumber: {
              value: '',
            },
            postcode: {
              value: '',
            },
          },
          errors: {},
        },
        addressValidationSchema: getYourAddressSchema(rules, countries),
        detailsValidationSchema: getYourDetailsSchema('United Kingdom'),
        findAddressValidationSchema: getFindAddressSchema(rules, {
          hasFoundAddress: false,
          hasSelectedAddress: false,
        }),
        touchedFormField: jest.fn(),
        clearFormFieldError: jest.fn(),
        dispatch: jest.fn(),
      }
      const render = compose(
        shallowRender,
        withStore(state)
      )
      const renderComponent = buildComponentRender(render, AddressBookForm)
      const { wrapper } = renderComponent(props)
      wrapper.find('DeliverToAddressBttnForm').prop('onSubmitForm')({
        preventDefault: jest.fn(),
      })
      expect(props.clearFormFieldError).toHaveBeenCalled()
      expect(props.onSaveAddress).not.toHaveBeenCalled()
    })
    it('should call onClose when the close link is clicked', () => {
      const props = {
        addressType: 'addressBook',
        onSaveAddress: jest.fn(),
        onClose: jest.fn(),
        addressForm: addressBookFormMock.newAddress,
        detailsForm: addressBookFormMock.newDetails,
        findAddressForm: addressBookFormMock.newFindAddress,
        addressValidationSchema: {},
        detailsValidationSchema: {},
        findAddressValidationSchema: {},
        clearFormFieldError: jest.fn(),
        touchedFormField: jest.fn(),
      }
      const { wrapper } = renderComponent(props)
      const closeLink = wrapper.find('.AddressBookForm-close').first()
      closeLink.simulate('click', { preventDefault: jest.fn() })
      expect(props.onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('@functions', () => {
    describe('scrollToFirstError', () => {
      it('should call scrollElementInView for address1 formComponent', () => {
        global.process.browser = true
        const props = {
          addressType: 'addressBook',
          onSaveAddress: jest.fn(),
          onClose: jest.fn(),
          addressForm: {
            fields: {
              address1: {
                value: '',
              },
              address2: {
                value: null,
              },
              city: {
                value: '',
              },
              country: {
                value: '',
              },
              postcode: {
                value: '',
              },
              state: {
                value: '',
              },
            },
            errors: {},
          },
          detailsForm: {
            fields: {
              title: {
                value: '',
              },
              firstName: {
                value: '',
              },
              lastName: {
                value: '',
              },
              telephone: {
                value: '',
              },
            },
            errors: {},
          },
          findAddressForm: {
            fields: {
              houseNumber: {
                value: '',
              },
              postcode: {
                value: '',
              },
            },
            errors: {},
          },
          addressValidationSchema: {},
          detailsValidationSchema: {},
          findAddressValidationSchema: {},
          touchedFormField: jest.fn(),
          dispatch: jest.fn(),
        }
        const render = compose(
          mountRender,
          withStore(state)
        )
        const renderComponent = buildComponentRender(render, AddressBookForm)
        const { instance } = renderComponent(props)
        jest.spyOn(document, 'querySelector').mockImplementation(() => {
          return 'address1'
        })
        instance.scrollToFirstError('address1')
        expect(scrollElementIntoView).toHaveBeenCalledWith('address1', 400, 20)
      })
    })
  })
})
