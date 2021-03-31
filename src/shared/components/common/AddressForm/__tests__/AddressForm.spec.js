import {
  buildComponentRender,
  shallowRender,
  mountRender,
  withStore,
} from 'test/unit/helpers/test-component'
import AddressForm, {
  mapStateToProps,
  mapDispatchToProps,
  getHasSelectedAddress,
  gethasFoundAddress,
} from '../AddressForm'
import FindAddress from '../FindAddress'
import ManualAddress from '../ManualAddress'

// constants
import checkoutAddressFormRules from '../../../../../shared/constants/checkoutAddressFormRules'
import qasCountries from '../../../../../shared/constants/qasCountries'

// mocks
import myAccountMock from '../../../../../../test/mocks/myAccount-response.json'
import myCheckoutDetailsMocks from '../../../../../../test/mocks/forms/myCheckoutDetailsFormsMocks'
import checkoutYourAddressMock from '../../../../../../test/mocks/forms/checkoutYourAddressMock'
import configMock from '../../../../../../test/mocks/config'
import siteOptionsMock from '../../../../../../test/mocks/siteOptions'

import { compose } from 'ramda'

jest.mock('../../../../lib/user-agent', () => ({
  isIOS: jest.fn(() => false),
}))

beforeEach(() => jest.clearAllMocks())

describe('<AddressForm />', () => {
  const requiredProps = {
    addressType: 'billingCheckout',
    country: 'United Kingdom',
    findAddressForm: {
      fields: {},
      errors: {},
      message: {},
    },
    addressForm: {
      fields: {},
      errors: {},
      message: {},
    },
    detailsForm: {
      fields: {},
      errors: {},
      message: {},
    },
    formNames: {
      address: 'billingAddress',
      details: 'billingDetails',
      findAddress: 'billingFindAddress',
    },
    postCodeRules: checkoutAddressFormRules['United Kingdom'],
    countryCode: qasCountries['United Kingdom'],
    siteDeliveryISOs: configMock.siteDeliveryISOs,
    shouldDisplayDeliveryInstructions: true,
    // non req
    canFindAddress: true,
    isFindAddressVisible: false,
    titleHidden: true,
    isDesktopMultiColumnStyle: false,
    // functions
    onSelectCountry: () => {},
    sendEventAnalytics: () => {},
    clearFormErrors: () => {},
    clearFormFieldError: () => {},
    findAddress: () => {},
    findExactAddressByMoniker: () => {},
    resetForm: () => {},
    resetFormPartial: () => {},
    setFormField: () => {},
    setAndValidateFormField: jest.fn(),
    touchedFormField: () => {},
    validateForm: () => {},
    isCheckout: false,
    showModal: () => {},
  }
  const renderComponent = buildComponentRender(
    shallowRender,
    AddressForm.WrappedComponent
  )

  describe('@renders', () => {
    it('should render default with isDesktopMultiColumnStyle=false', () => {
      const { instance } = renderComponent({
        ...requiredProps,
        isFindAddressVisible: false,
      })
      expect(instance).toMatchSnapshot()
    })

    it('should render multi column form when isDesktopMultiColumnStyle prop is true', () => {
      const { instance } = renderComponent({
        ...requiredProps,
        isDesktopMultiColumnStyle: true,
        isFindAddressVisible: false,
      })
      expect(instance).toMatchSnapshot()
    })

    it('hides the title when titleHidden property is true', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        titleHidden: true,
      })
      expect(wrapper.find('.FormAddress-heading').length).toBe(0)
    })

    it('should render only ManualAddress form', () => {
      const updatedProps = { ...requiredProps, isFindAddressVisible: false }
      const { instance } = renderComponent(updatedProps)
      expect(instance).toMatchSnapshot()
    })

    it('should render only FindAddress form', () => {
      const updatedProps = { ...requiredProps, isFindAddressVisible: true }
      const { instance } = renderComponent(updatedProps)
      expect(instance).toMatchSnapshot()
    })

    describe('when `addressType` is `deliveryCheckout` or `billingCheckout`', () => {
      const addressTypes = ['billingCheckout', 'deliveryCheckout']

      addressTypes.forEach((addressType) => {
        it(`should set 'shouldResetFormOnUnmount' prop to 'false' in <ManualAddress /> if 'addressType' = ${addressType}`, () => {
          const { wrapper } = renderComponent({ ...requiredProps, addressType })
          expect(
            wrapper.find('ManualAddress').prop('shouldResetFormOnUnmount')
          ).toBe(false)
        })
      })
    })

    describe('when `addressType` is `deliveryMCD`, `billingMCD` and `addressBook`', () => {
      const addressTypes = ['deliveryMCD', 'billingMCD', 'addressBook']

      addressTypes.forEach((addressType) => {
        it(`should set 'shouldResetFormOnUnmount' prop to 'true' in <ManualAddress /> if 'addressType' = ${addressType}`, () => {
          const { wrapper } = renderComponent({ ...requiredProps, addressType })
          expect(
            wrapper.find('ManualAddress').prop('shouldResetFormOnUnmount')
          ).toBe(true)
        })
      })
    })
  })
  describe('@lifecycle', () => {
    describe('constructor', () => {
      it('should init monikers in the internal state', () => {
        const { instance } = renderComponent(requiredProps)
        expect(instance.state.monikers).toEqual([])
      })
    })

    describe('@componentDidMount', () => {
      it('should validate and set default country', () => {
        const setAndValidateFormFieldMock = jest.fn()
        const { instance } = renderComponent({
          ...requiredProps,
          setAndValidateFormField: setAndValidateFormFieldMock,
          addressValidationSchema: {
            country: 'country-validation',
          },
        })
        instance.componentDidMount()
        expect(setAndValidateFormFieldMock).toHaveBeenCalledWith(
          requiredProps.formNames.address,
          'country',
          requiredProps.country,
          'country-validation'
        )
      })
    })

    describe('@componentDidUpdate', () => {
      describe('when `schemaHash` changes', () => {
        const validateFormMock = jest.fn()
        const findAddressValidationSchema = {}
        const detailsValidationSchema = {}
        const addressValidationSchema = {}

        it('should only validate FindAddress form if isFindAddressVisible is true', () => {
          const { instance } = renderComponent({
            ...requiredProps,
            isFindAddressVisible: true,
            schemaHash: '12345',
            findAddressValidationSchema,
            detailsValidationSchema,
            validateForm: validateFormMock,
          })
          instance.componentDidUpdate({ schemaHash: '67890' })

          expect(validateFormMock).toHaveBeenCalledWith(
            requiredProps.formNames.findAddress,
            findAddressValidationSchema
          )
        })
        it('should only validate ManualAddress form if isFindAddressVisible is false', () => {
          const { instance } = renderComponent({
            ...requiredProps,
            isFindAddressVisible: false,
            schemaHash: '12345',
            findAddressValidationSchema,
            detailsValidationSchema,
            validateForm: validateFormMock,
          })
          instance.componentDidUpdate({ schemaHash: '67890' })

          expect(validateFormMock).toHaveBeenCalledWith(
            requiredProps.formNames.address,
            addressValidationSchema
          )
        })
      })
    })
  })

  describe('@events and functions', () => {
    describe('for FindAddress form', () => {
      describe('Select Address in FindAddress form', () => {
        const findExactAddressByMonikerMock = jest.fn()
        const clearFormErrorsMock = jest.fn()
        const { instance, wrapper } = renderComponent({
          ...requiredProps,
          isFindAddressVisible: true,
          countryCode: 'GBP',
          findExactAddressByMoniker: findExactAddressByMonikerMock,
          clearFormErrors: clearFormErrorsMock,
        })

        instance.setState({
          monikers: [
            { moniker: '111 Something Close' },
            { moniker: '114 Something Avenue' },
            { moniker: '134 Something Road' },
          ],
        })

        it('calls findExactAddressByMoniker', () => {
          wrapper.find(FindAddress).prop('handleAddressChange')({
            target: { selectedIndex: 1 },
          })
          expect(findExactAddressByMonikerMock).toHaveBeenCalledWith({
            country: 'GBP',
            moniker: '111 Something Close',
            formNames: requiredProps.formNames,
          })
        })

        it('clears all errors for FindAdress form', () => {
          wrapper.find(FindAddress).prop('handleAddressChange')({
            target: { selectedIndex: 1 },
          })
          expect(clearFormErrorsMock).toHaveBeenCalledWith(
            requiredProps.formNames.findAddress
          )
        })
      })

      describe('Select Address in FindAddress form', () => {
        const findExactAddressByMonikerMock = jest.fn()
        const clearFormErrorsMock = jest.fn()
        const { instance, wrapper } = renderComponent({
          ...requiredProps,
          isFindAddressVisible: true,
          countryCode: 'GBP',
          findExactAddressByMoniker: findExactAddressByMonikerMock,
          clearFormErrors: clearFormErrorsMock,
        })

        instance.setState({
          monikers: [],
        })

        it('does not call findExactAddressByMoniker when there are no monikers', () => {
          wrapper.find(FindAddress).prop('handleAddressChange')({
            target: { selectedIndex: 1 },
          })
          expect(findExactAddressByMonikerMock).not.toHaveBeenCalled()
        })
      })

      describe('Find Address Request', () => {
        const findAddressMock = jest.fn()
        const clearFormFieldErrorMock = jest.fn()
        const clearFormErrorsMock = jest.fn()
        findAddressMock.mockImplementation(() => {
          return Promise.resolve({
            body: '111 Something Close',
          })
        })
        const { instance, wrapper } = renderComponent({
          ...requiredProps,
          countryCode: 'GBP',
          isFindAddressVisible: true,
          findAddressForm: {
            fields: {
              houseNumber: {
                value: '35',
              },
              postcode: {
                value: 'NW1 7HQ',
              },
            },
          },
          findAddress: findAddressMock,
          clearFormFieldError: clearFormFieldErrorMock,
          clearFormErrors: clearFormErrorsMock,
        })

        describe('when response comes back with a single address object', () => {
          it('calls findAddress when handleFindAddressRequest invoked', () => {
            wrapper.find(FindAddress).prop('handleFindAddressRequest')()
            expect(findAddressMock).toHaveBeenCalledWith({
              data: {
                country: 'GBP',
                postcode: 'NW1 7HQ',
                address: '35',
              },
              formNames: requiredProps.formNames,
            })
          })
          it('clears erros for `findAddress` and `selectForm` fields in FindAddress form', () => {
            wrapper
              .find(FindAddress)
              .prop('handleFindAddressRequest')()
              .then(() => {
                expect(clearFormFieldErrorMock).toHaveBeenCalledWith(
                  requiredProps.formNames.findAddress,
                  'findAddress'
                )
                expect(clearFormFieldErrorMock).toHaveBeenCalledWith(
                  requiredProps.formNames.findAddress,
                  'selectAddress'
                )
              })
          })
        })

        describe('when response comes back with an array of addresses', () => {
          findAddressMock.mockImplementationOnce(() => {
            return Promise.resolve([
              { moniker: '111 Something Close' },
              { moniker: '114 Something Avenue' },
              { moniker: '134 Something Road' },
            ])
          })

          it('clears `findAdress` error in findAddressForm ', () => {
            wrapper
              .find(FindAddress)
              .prop('handleFindAddressRequest')()
              .then(() => {
                expect(clearFormFieldErrorMock).toHaveBeenCalledWith(
                  requiredProps.formNames.findAddress,
                  'findAddress'
                )
              })
          })
          it('should setState with monikers asynchronously', () => {
            return wrapper
              .find(FindAddress)
              .prop('handleFindAddressRequest')()
              .then(() => {
                expect(instance.state.monikers).toEqual([
                  { moniker: '111 Something Close' },
                  { moniker: '114 Something Avenue' },
                  { moniker: '134 Something Road' },
                ])
              })
          })
        })
      })

      describe('click on `manually enter address` ', () => {
        const resetFormPartialMock = jest.fn()
        let setWrapper
        beforeEach(() => {
          const render = compose(
            mountRender,
            withStore({ features: { status: '' } })
          )
          const mountRenderComponent = buildComponentRender(
            render,
            AddressForm.WrappedComponent
          )
          const { wrapper } = mountRenderComponent({
            ...requiredProps,
            isFindAddressVisible: true,
            resetFormPartial: resetFormPartialMock,
          })
          setWrapper = wrapper
        })
        it('should reset isManual=true for Manual Form', () => {
          setWrapper
            .find(FindAddress)
            .find('button')
            .at(1)
            .simulate('click', { preventDefault: jest.fn() })
          expect(resetFormPartialMock).toHaveBeenCalledWith(
            requiredProps.formNames.address,
            {
              isManual: true,
            }
          )
        })
      })

      describe('delivery instructions', () => {
        it('should show for delivery address', () => {
          const { wrapper } = renderComponent({
            ...requiredProps,
            addressType: 'deliveryCheckout',
          })

          expect(wrapper.exists('.Accordion--deliveryInstructions')).toBe(true)
        })

        it('should not show for billing address', () => {
          const { wrapper } = renderComponent({
            ...requiredProps,
            addressType: 'billingCheckout',
          })

          expect(wrapper.exists('.Accordion--deliveryInstructions')).toBe(false)
        })

        it('should toggle deliveryAccordion state when accordion clicked', () => {
          const { wrapper, instance } = renderComponent({
            ...requiredProps,
            addressType: 'deliveryCheckout',
          })

          expect(instance.state.deliveryAccordion).toBe(false)
          expect(
            wrapper.find('.Accordion--deliveryInstructions').prop('expanded')
          ).toEqual(false)

          instance.handleAccordionToggle()

          expect(instance.state.deliveryAccordion).toBe(true)
          expect(
            wrapper.find('.Accordion--deliveryInstructions').prop('expanded')
          ).toEqual(true)
        })

        it('should persist accordion state when form is updated/validated', () => {
          const { instance, wrapper } = renderComponent({
            ...requiredProps,
            addressType: 'deliveryCheckout',
          })

          instance.handleAccordionToggle()

          wrapper.setProps({
            addressForm: {
              fields: {
                address1: {
                  value: '1 Bar Street',
                },
              },
            },
          })

          expect(instance.state.deliveryAccordion).toBe(true)
          expect(
            wrapper.find('.Accordion--deliveryInstructions').prop('expanded')
          ).toEqual(true)
        })

        it('should not show for countries that do not have delivery instructions', () => {
          const { wrapper } = renderComponent({
            ...requiredProps,
            shouldDisplayDeliveryInstructions: false,
            addressType: 'deliveryCheckout',
          })

          expect(wrapper.exists('.Accordion--deliveryInstructions')).toBe(false)
        })
      })

      describe('trimOnBlur', () => {
        it('should update FindAddress postcode field with trimmed content', () => {
          const { wrapper } = renderComponent({
            ...requiredProps,
            isFindAddressVisible: true,
            findAddressValidationSchema: {
              postcode: 'findaddress-postcodevalidation',
            },
          })
          wrapper.find(FindAddress).prop('onBlur')('postcode')({
            target: { value: ' abc ' },
          })
          expect(requiredProps.setAndValidateFormField).toHaveBeenCalledWith(
            requiredProps.formNames.findAddress,
            'postcode',
            'abc',
            'findaddress-postcodevalidation'
          )
        })
      })
      describe('Touched Field Postcode', () => {
        const touchedFormFieldMock = jest.fn()

        beforeEach(() => {
          const { wrapper } = renderComponent({
            ...requiredProps,
            isFindAddressVisible: true,
            touchedFormField: touchedFormFieldMock,
          })
          wrapper.find(FindAddress).prop('touchField')(
            requiredProps.formNames.findAddress
          )('postCode')()
        })
        it('should be able to touch postcode field', () => {
          expect(touchedFormFieldMock).toHaveBeenCalledWith(
            requiredProps.formNames.findAddress,
            'postCode'
          )
        })
      })
    })

    describe('for ManualForm form', () => {
      describe('Set and Validate', () => {
        const setAndValidateFormFieldMock = jest.fn()
        const { wrapper } = renderComponent({
          ...requiredProps,
          isFindAddressVisible: false,
          addressValidationSchema: {
            postcode: 'address-postcodevalidation',
          },
          findAddressValidationSchema: {},
          setAndValidateFormField: setAndValidateFormFieldMock,
        })
        wrapper.find(ManualAddress).prop('setAndValidateAddressField')('')({
          target: {
            value: '',
          },
        })
        expect(setAndValidateFormFieldMock).toHaveBeenCalledTimes(1)
      })
      describe('Touched Field address1', () => {
        const touchedFormFieldMock = jest.fn()
        beforeEach(() => {
          const { wrapper } = renderComponent({
            ...requiredProps,
            isFindAddressVisible: false,
            touchedFormField: touchedFormFieldMock,
          })
          wrapper.find(ManualAddress).prop('touchField')(
            requiredProps.formNames.address
          )('address1')()
        })

        it('should be able to touch address1 field', () => {
          expect(touchedFormFieldMock).toHaveBeenCalledWith(
            requiredProps.formNames.address,
            'address1'
          )
        })
      })
      describe('trimOnBlur', () => {
        it('should update ManualAddress postcode field with trimmed content', () => {
          const { wrapper } = renderComponent({
            ...requiredProps,
            isFindAddressVisible: false,
            addressValidationSchema: {
              postcode: 'address-postcodevalidation',
            },
          })
          wrapper.find(ManualAddress).prop('onBlur')('postcode')({
            target: { value: ' abc ' },
          })
          expect(requiredProps.setAndValidateFormField).toHaveBeenCalledWith(
            requiredProps.formNames.address,
            'postcode',
            'abc',
            'address-postcodevalidation'
          )
        })
      })
      describe('On "Find Address" button click', () => {
        const resetFormPartialMock = jest.fn()
        let setWrapper
        let setInstance
        beforeEach(() => {
          const render = compose(
            mountRender,
            withStore({ features: { status: '' } })
          )
          const mountRenderComponent = buildComponentRender(
            render,
            AddressForm.WrappedComponent
          )
          const { instance, wrapper } = mountRenderComponent({
            ...requiredProps,
            isFindAddressVisible: false,
            ...{
              addressForm: {
                fields: {
                  address1: {
                    value: '',
                  },
                  address2: {
                    value: '',
                  },
                  postcode: {
                    value: '',
                  },
                  city: {
                    value: '',
                  },
                },
              },
            },
            resetFormPartial: resetFormPartialMock,
          })
          setWrapper = wrapper
          setInstance = instance
        })

        it('should reset monikers to empty array', () => {
          setInstance.setState({
            monikers: [
              {
                moniker: '111 Something Close',
              },
            ],
          })
          expect(setInstance.state.monikers).toEqual([
            {
              moniker: '111 Something Close',
            },
          ])
          setWrapper
            .find(ManualAddress)
            .find('button')
            .at(1)
            .simulate('click', { preventDefault: jest.fn() })
          expect(setInstance.state.monikers).toEqual([])
        })
        it('should reset ManualAddress Form fields', () => {
          setWrapper
            .find(ManualAddress)
            .find('button')
            .at(1)
            .simulate('click', { preventDefault: jest.fn() })
          expect(resetFormPartialMock).toHaveBeenCalledWith(
            requiredProps.formNames.address,
            {
              isManual: false,
            }
          )
        })
      })

      describe('On "Clear Form" button click', () => {
        const render = compose(
          mountRender,
          withStore({ features: { status: '' } })
        )
        const mountRenderComponent = buildComponentRender(
          render,
          AddressForm.WrappedComponent
        )
        it('should reset ManualAddress form', () => {
          const resetFormMock = jest.fn()
          const { wrapper } = mountRenderComponent({
            ...requiredProps,
            isFindAddressVisible: false,
            ...{
              addressForm: {
                fields: {
                  address1: {
                    value: '',
                  },
                  address2: {
                    value: '',
                  },
                  postcode: {
                    value: '',
                  },
                  city: {
                    value: '',
                  },
                },
              },
            },
            resetForm: resetFormMock,
          })
          wrapper
            .find(ManualAddress)
            .find('button')
            .first()
            .simulate('click', { preventDefault: jest.fn() })

          expect(resetFormMock).toHaveBeenCalledWith(
            requiredProps.formNames.address,
            {
              address1: '',
              address2: '',
              city: '',
              country: 'United Kingdom',
              county: '',
              postcode: '',
              state: '',
              isManual: true,
            }
          )
        })

        it('should validate address form', () => {
          const addressValidationSchema = {}
          const validateFormMock = jest.fn()
          const { wrapper } = mountRenderComponent({
            ...requiredProps,
            isFindAddressVisible: false,
            ...{
              addressForm: {
                fields: {
                  address1: {
                    value: '',
                  },
                  address2: {
                    value: '',
                  },
                  postcode: {
                    value: '',
                  },
                  city: {
                    value: '',
                  },
                },
              },
            },
            validateForm: validateFormMock,
            addressValidationSchema,
          })
          wrapper
            .find(ManualAddress)
            .find('button')
            .first()
            .simulate('click', { preventDefault: jest.fn() })
          expect(validateFormMock).toHaveBeenCalledWith(
            requiredProps.formNames.address,
            addressValidationSchema
          )
        })
      })
    })
  })

  describe('@component helpers', () => {
    describe('getHasSelectedAddress', () => {
      it('should return true when address selected', () => {
        const selectedAddress = getHasSelectedAddress({
          fields: {
            address1: {
              value: 'Address 1',
            },
          },
        })
        expect(selectedAddress).toBe(true)
      })
      it('should return false when NO address selected', () => {
        const selectedAddress = getHasSelectedAddress({
          fields: {
            address1: {
              value: '',
            },
          },
        })
        expect(selectedAddress).toBe(false)
      })
    })

    describe('gethasFoundAddress', () => {
      it('should return true when findAddress has NO value', () => {
        const selectedAddress = gethasFoundAddress({
          fields: {
            findAddress: {
              value: '',
            },
          },
        })
        expect(selectedAddress).toBe(true)
      })
      it('should return false when NO value in findAddres', () => {
        const selectedAddress = gethasFoundAddress({
          fields: {
            findAddress: {
              value: 'touched',
            },
          },
        })
        expect(selectedAddress).toBe(false)
      })
    })
  })

  describe('@connected component', () => {
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
        checkout: {
          yourAddress: checkoutYourAddressMock,
        },
      },
      siteOptions: {
        ...siteOptionsMock,
        USStates: ['CA', 'AL'],
      },
    }

    it('should wrap `AdressForm` component', () => {
      expect(AddressForm.WrappedComponent.name).toBe('AddressForm')
    })

    describe('mapDispatchToProps', () => {
      it('should return `clearFormErrors` action', () => {
        const { clearFormErrors } = mapDispatchToProps
        expect(clearFormErrors.name).toBe('clearFormErrors')
      })
      it('should return `clearFormFieldError` action', () => {
        const { clearFormFieldError } = mapDispatchToProps
        expect(clearFormFieldError.name).toBe('clearFormFieldError')
      })
      it('should return `findAddress` action', () => {
        const { findAddress } = mapDispatchToProps
        expect(findAddress.name).toBe('findAddress')
      })
      it('should return `findExactAddressByMoniker` action', () => {
        const { findExactAddressByMoniker } = mapDispatchToProps
        expect(findExactAddressByMoniker.name).toBe('findExactAddressByMoniker')
      })
      it('should return `resetForm` action', () => {
        const { resetForm } = mapDispatchToProps
        expect(resetForm.name).toBe('resetForm')
      })
      it('should return `setFormField` action', () => {
        const { setFormField } = mapDispatchToProps
        expect(setFormField.name).toBe('setFormField')
      })
      it('should return `setAndValidateFormField` action', () => {
        const { setAndValidateFormField } = mapDispatchToProps
        expect(setAndValidateFormField.name).toBe('setAndValidateFormField')
      })
      it('should return `touchedFormField` action', () => {
        const { touchedFormField } = mapDispatchToProps
        expect(touchedFormField.name).toBe('touchedFormField')
      })
      it('should return `validateForm` action', () => {
        const { validateForm } = mapDispatchToProps
        expect(validateForm.name).toBe('validateForm')
      })
    })

    describe('mapStateToProps', () => {
      it('should get addressForm fields from state (deliveryMCD) from state', () => {
        const { addressForm } = mapStateToProps(state, {
          addressType: 'deliveryMCD',
        })
        expect(addressForm.fields).toBeDefined()
        expect(addressForm.fields).toEqual(
          expect.objectContaining({
            address1: {
              value: '2 Britten Close',
              isDirty: false,
              isTouched: false,
              isFocused: false,
            },
          })
        )
      })
      it('should get addressForm fields from state (billingMCD) from state', () => {
        const { addressForm } = mapStateToProps(state, {
          addressType: 'billingMCD',
        })
        expect(addressForm.fields).toBeDefined()
        expect(addressForm.fields).toEqual(
          expect.objectContaining({
            address1: {
              value: '35 Britten Close',
              isDirty: true,
              isTouched: false,
              isFocused: false,
            },
          })
        )
      })
      it('should return addressValidationSchema', () => {
        const { addressValidationSchema } = mapStateToProps(state, {
          addressType: 'deliveryCheckout',
        })
        expect(addressValidationSchema).toEqual({
          address1: ['required', 'noEmoji', expect.any(Function)],
          address2: ['noEmoji', expect.any(Function)],
          postcode: ['required', expect.any(Function), 'noEmoji'],
          city: ['required', 'noEmoji', expect.any(Function)],
          country: ['required', expect.any(Function)],
        })
      })
      it('should get initial country from config', () => {
        const { country } = mapStateToProps(state, {
          addressType: 'deliveryMCD',
        })
        expect(country).toBe('United Kingdom')
      })
      it('should get countries from config', () => {
        const { countries } = mapStateToProps(state, {
          addressType: 'deliveryCheckout',
        })
        expect(countries).toEqual(
          expect.arrayContaining(['Antarctica', 'United Kingdom', 'Vietnam'])
        )
      })
      it('should get countryCode from config', () => {
        const { countryCode } = mapStateToProps(state, {
          addressType: 'deliveryMCD',
        })
        expect(countryCode).toEqual('GBR')
      })
      it('should return canFindAddress', () => {
        const returningUser = {
          account: {
            user: {
              billingDetails: {
                addressDetailsId: 1,
              },
            },
          },
        }
        const { canFindAddress } = mapStateToProps(
          { ...state, ...returningUser },
          {
            addressType: 'deliveryCheckout',
          }
        )
        expect(canFindAddress).toEqual(true)
      })
      it('should return canFindAddress', () => {
        const returningUser = {
          account: {
            user: {
              billingDetails: {
                addressDetailsId: 1,
              },
            },
          },
        }
        const { canFindAddress } = mapStateToProps(
          { ...state, ...returningUser },
          {
            addressType: 'addressBook',
          }
        )
        expect(canFindAddress).toEqual(false)
      })
      it('should get detailsForm from state (deliveryMCD)', () => {
        const { detailsForm } = mapStateToProps(state, {
          addressType: 'deliveryMCD',
        })
        expect(detailsForm.fields).toBeDefined()
        expect(detailsForm.fields).toEqual(
          expect.objectContaining({
            title: {
              value: 'Mr',
              isDirty: false,
              isTouched: false,
              isFocused: false,
            },
          })
        )
      })
      it('should get detailsForm from state (billingMCD)', () => {
        const { detailsForm } = mapStateToProps(state, {
          addressType: 'billingMCD',
        })
        expect(detailsForm.fields).toBeDefined()
        expect(detailsForm.fields).toEqual(
          expect.objectContaining({
            firstName: {
              value: 'Jose Billing',
              isDirty: false,
              isTouched: false,
              isFocused: false,
            },
          })
        )
      })
      it('should get detailsValidationSchema from state', () => {
        const { detailsValidationSchema } = mapStateToProps(state, {
          addressType: 'deliveryMCD',
        })
        expect(detailsValidationSchema).toEqual({
          firstName: [
            'noEmoji',
            'required',
            expect.any(Function),
            expect.any(Function),
          ],
          lastName: [
            'noEmoji',
            'required',
            expect.any(Function),
            expect.any(Function),
          ],
          telephone: ['required', 'ukPhoneNumber', 'noEmoji'],
        })
      })
      it('should get findAddressForm from state', () => {
        const { findAddressForm } = mapStateToProps(state, {
          addressType: 'deliveryMCD',
        })
        expect(findAddressForm).toEqual({
          fields: {
            postCode: {
              value: '',
              isDirty: false,
              isTouched: false,
              isFocused: false,
            },
            houseNumber: {
              value: '',
              isDirty: false,
              isTouched: false,
              isFocused: false,
            },
            findAddress: {
              value: '',
              isDirty: false,
              isTouched: false,
              isFocused: false,
            },
          },
          isLoading: false,
          errors: {},
          message: {},
        })
      })
      it('should get findAddressValidationSchema from state', () => {
        const { findAddressValidationSchema } = mapStateToProps(state, {
          addressType: 'deliveryMCD',
        })
        expect(findAddressValidationSchema).toEqual({
          postcode: ['required', expect.any(Function), 'noEmoji'],
          houseNumber: 'noEmoji',
          findAddress: expect.any(Function),
          selectAddress: expect.any(Function),
        })
      })
      it('should get findAddressValidationSchema emtpy when isFindAddressVisible is false', () => {
        const returningUser = {
          account: {
            user: {
              billingDetails: {
                addressDetailsId: 1,
              },
            },
          },
        }
        const { findAddressValidationSchema } = mapStateToProps(
          { ...state, ...returningUser },
          {
            addressType: 'addressBook',
          }
        )
        expect(findAddressValidationSchema).toEqual({})
      })
      it('should get formNames from constants', () => {
        const { formNames } = mapStateToProps(state, {
          addressType: 'deliveryMCD',
        })
        expect(formNames).toEqual({
          address: 'deliveryAddressMCD',
          details: 'deliveryDetailsAddressMCD',
          findAddress: 'deliveryFindAddressMCD',
        })
      })
      it('should return isFindAddressVisible', () => {
        const { isFindAddressVisible } = mapStateToProps(state, {
          addressType: 'deliveryMCD',
        })
        expect(isFindAddressVisible).toEqual(true)
      })
      it('should get postCodeRules from state', () => {
        const { postCodeRules } = mapStateToProps(state, {
          addressType: 'deliveryMCD',
        })
        expect(postCodeRules).toEqual({
          pattern: {},
          stateFieldType: false,
          postcodeRequired: true,
          premisesRequired: false,
          premisesLabel: 'House number',
        })
      })
      it('should get schemaHash from state', () => {
        const { schemaHash } = mapStateToProps(state, {
          addressType: 'deliveryMCD',
        })
        expect(schemaHash).toEqual('United Kingdom:true:true:true')
      })
      it('should get usStates from state', () => {
        const { usStates } = mapStateToProps(state, {
          addressType: 'addressBook',
        })
        expect(usStates).toEqual(['CA', 'AL'])
      })
    })
  })
})
