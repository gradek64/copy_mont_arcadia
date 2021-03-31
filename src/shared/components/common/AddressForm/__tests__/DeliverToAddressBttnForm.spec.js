import testComponentHelper from '../../../../../../test/unit/helpers/test-component'
import DeliverToAddressBttnForm from '../DeliverToAddressBttnForm'

describe('DeliverToAddressBttnForm', () => {
  const renderComponent = testComponentHelper(DeliverToAddressBttnForm)
  const props = {
    addressType: 'addressBook',
    forms: {
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
      deliverToAddressForm: {
        fields: {
          deliverToAddress: {
            value: '',
            isTouched: false,
          },
        },
        errors: {
          deliverToAddress:
            'Please confirm this new address or cancel to continue',
        },
      },
    },
    onSubmitForm: jest.fn(),
    resetForm: jest.fn(),
    clearFormErrors: jest.fn(),
    validateForm: jest.fn(),
  }
  describe('@render', () => {
    it('should render DeliverToAddressBttnForm', () => {
      const { getTree } = renderComponent(props)
      expect(getTree()).toMatchSnapshot()
    })
  })

  describe('`Deliver to new Address` button', () => {
    describe('is disabled', () => {
      it('when detailsForm has at least one validation error', () => {
        const propswithFieldError = {
          ...props,
          forms: {
            ...props.forms,
            detailsForm: {
              ...props.forms.detailsForm.fields,
              errors: {
                firstName: 'first name is required',
              },
            },
          },
        }
        const renderComponent = testComponentHelper(DeliverToAddressBttnForm)
        const { wrapper } = renderComponent(propswithFieldError)
        const button = wrapper.find('FormButton').first()
        expect(button.props().isDisabled).toBe(true)
      })
      it('when findAddressForm has at least one validation error', () => {
        const propswithFieldError = {
          ...props,
          forms: {
            ...props.forms,
            findAddressForm: {
              ...props.forms.findAddressForm.fields,
              errors: {
                firstName: 'first name is required',
              },
            },
          },
        }

        const renderComponent = testComponentHelper(DeliverToAddressBttnForm)
        const { wrapper } = renderComponent(propswithFieldError)
        const button = wrapper.find('FormButton').first()
        expect(button.props().isDisabled).toBe(true)
      })
      it('when addressForm has at least one validation error', () => {
        const propswithFieldError = {
          ...props,
          forms: {
            ...props.forms,
            addressForm: {
              ...props.forms.addressForm.fields,
              errors: {
                postcode: 'postcode is required',
              },
            },
          },
        }
        const renderComponent = testComponentHelper(DeliverToAddressBttnForm)
        const { wrapper } = renderComponent(propswithFieldError)
        const button = wrapper.find('FormButton').first()
        expect(button.props().isDisabled).toBe(true)
      })
    })
    describe('is enabled', () => {
      it('when detailsForm, findAddressForm and addressForm have no validation errors', () => {
        const renderComponent = testComponentHelper(DeliverToAddressBttnForm)
        const { wrapper } = renderComponent(props)
        const button = wrapper.find('FormButton').first()
        expect(button.props().isDisabled).toBe(false)
      })
    })
  })

  describe('@lifecycle', () => {
    describe('@componentDidMount', () => {
      const validateFormMock = jest.fn()
      const { instance } = renderComponent({
        ...props,
        validateForm: validateFormMock,
      })
      instance.componentDidMount()
      it('it will validate DeliverToAddressBttnForm', () => {
        expect(validateFormMock).toHaveBeenCalledWith(
          instance.deliverToAddressForm,
          instance.deliverToAddressSchema
        )
      })
    })
    describe('@componentWillUnmount', () => {
      const resetFormMock = jest.fn()
      const clearFormErrorsMock = jest.fn()
      const { instance } = renderComponent({
        ...props,
        resetForm: resetFormMock,
        clearFormErrors: clearFormErrorsMock,
      })
      instance.componentWillUnmount()
      it('it will reset DeliverToAddressBttnForm', () => {
        expect(resetFormMock).toHaveBeenCalledWith(
          instance.deliverToAddressForm,
          {
            deliverToAddress: '',
          }
        )
      })
      it('it will clear Errors for DeliverToAddressBttnForm', () => {
        expect(clearFormErrorsMock).toHaveBeenCalledWith(
          instance.deliverToAddressForm
        )
      })
    })
  })

  describe('@events and functions', () => {
    it('should trigger onSubmitForm on Click', () => {
      const onSubmitFormMock = jest.fn()
      const { wrapper } = renderComponent({
        ...props,
        onSubmitForm: onSubmitFormMock,
      })
      wrapper.find('FormButton').simulate('click')
      expect(onSubmitFormMock).toHaveBeenCalledTimes(1)
    })
  })
})
