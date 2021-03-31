import testComponentHelper from 'test/unit/helpers/test-component'
import AddressFormDetails, { mapStateToProps } from '../AddressFormDetails'

describe('<AddressFormDetails />', () => {
  const renderComponent = testComponentHelper(
    AddressFormDetails.WrappedComponent
  )
  const initialProps = {
    addressType: 'deliveryCheckout',
    form: {
      fields: {
        firstName: {
          value: 'John',
        },
        lastName: {
          value: 'Smith',
        },
        telephone: {
          value: '07123123123',
        },
      },
    },
    formName: 'yourDetails',
    setFormField: jest.fn(),
    setAndValidateFormField: jest.fn(),
    touchedFormField: jest.fn(),
    validateForm: jest.fn(),
    clearFormErrors: jest.fn(),
    resetForm: jest.fn(),
    validationSchema: {
      title: 'required',
    },
    deliveryInstructionForm: {},
    currentCountry: 'United Kingdom',
  }

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('with a label', () => {
      expect(
        renderComponent({
          ...initialProps,
          label: 'Your Delivery Details',
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with isDesktopMultiColumnStyle prop', () => {
      expect(
        renderComponent({
          ...initialProps,
          isDesktopMultiColumnStyle: true,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with a type', () => {
      expect(
        renderComponent({
          ...initialProps,
          type: 'storeDelivery',
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with errors', () => {
      expect(
        renderComponent({
          ...initialProps,
          errors: {
            firstName: 'An email address is required.',
            lastName: 'A password is required.',
          },
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with a h4', () => {
      expect(
        renderComponent({
          ...initialProps,
          h4: true,
        }).getTree()
      ).toMatchSnapshot()
    })
  })
  describe('@connected component', () => {
    const state = {
      forms: {
        checkout: {
          yourDetails: {
            fields: {},
            errors: { error: {} },
          },
        },
      },
      siteOptions: {
        titles: {
          title: 'site',
        },
      },
      checkout: {
        orderSummary: {
          shippingCountry: 'United Kingdom',
        },
      },
    }
    describe('mapStateToProps', () => {
      it('should return deitailForm from state', () => {
        const { form } = mapStateToProps(state, {
          addressType: 'deliveryCheckout',
        })
        expect(form).toEqual({ fields: {}, errors: { error: {} } })
      })
      it('should return details formName from state', () => {
        const { formName } = mapStateToProps(state, {
          addressType: 'deliveryCheckout',
        })
        expect(formName).toEqual('yourDetails')
      })
      it('should return detailsForm errors', () => {
        const { errors } = mapStateToProps(state, {
          addressType: 'deliveryCheckout',
        })
        expect(errors).toEqual({ error: {} })
      })
      it('should return detailsForm validationSchema', () => {
        const { validationSchema } = mapStateToProps(state, {
          addressType: 'deliveryCheckout',
        })
        expect(validationSchema).toEqual({
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
      it('should return shamaHash string', () => {
        const { schemaHash } = mapStateToProps(state, {
          addressType: 'deliveryCheckout',
        })
        expect(schemaHash).toEqual('United Kingdom')
      })
    })
  })

  describe('@lifecycle', () => {
    describe('@componentWillUnmount', () => {
      it('should clear errors for DetailForm', () => {
        const clearFormErrorsMock = jest.fn()
        const resetFormMock = jest.fn()
        const { instance } = renderComponent({
          ...initialProps,
          clearFormErrors: clearFormErrorsMock,
          resetForm: resetFormMock,
        })
        instance.componentWillUnmount()
        expect(clearFormErrorsMock).toHaveBeenCalledWith(initialProps.formName)
      })
      describe('when `addressType` is `deliveryMCD`, `billingMCD` and `addressBook`', () => {
        const addressTypes = ['deliveryMCD', 'billingMCD', 'addressBook']
        addressTypes.forEach((addressType) => {
          const clearFormErrorsMock = jest.fn()
          const resetFormMock = jest.fn()
          const { instance } = renderComponent({
            ...initialProps,
            addressType,
            clearFormErrors: clearFormErrorsMock,
            resetForm: resetFormMock,
          })
          instance.componentWillUnmount()
          it(`should reset fields for DetailForm for addressType = ${addressType}`, () => {
            expect(resetFormMock).toHaveBeenCalledWith(initialProps.formName, {
              firstName: '',
              lastName: '',
              telephone: '',
            })
          })
        })
      })
    })
  })

  describe('@events', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    describe('firstName Input', () => {
      it('should call setFormField when prop setField is called', () => {
        const { wrapper, instance } = renderComponent({
          ...initialProps,
          validationSchema: {
            firstName: ['required'],
          },
        })
        const connectedInput = wrapper.find('Connect(Input)')
        connectedInput.find('[name="firstName"]').prop('setField')('firstName')(
          { target: { value: 'Foo' } }
        )
        expect(instance.props.setAndValidateFormField).toHaveBeenLastCalledWith(
          initialProps.formName,
          'firstName',
          'Foo',
          ['required']
        )
      })

      it('should call touchedFormField when prop touchedField is called', () => {
        const { wrapper, instance } = renderComponent(initialProps)
        const connectedInput = wrapper.find('Connect(Input)')
        connectedInput.find('[name="firstName"]').prop('touchedField')(
          'firstName'
        )()
        expect(instance.props.touchedFormField).toHaveBeenLastCalledWith(
          initialProps.formName,
          'firstName'
        )
      })
    })

    describe('lastName Input', () => {
      it('should call setFormField when prop setField is called', () => {
        const { wrapper, instance } = renderComponent({
          ...initialProps,
          validationSchema: {
            lastName: ['required'],
          },
        })
        const connectedInput = wrapper.find('Connect(Input)')
        connectedInput.find('[name="lastName"]').prop('setField')('lastName')({
          target: { value: 'Bar' },
        })
        expect(instance.props.setAndValidateFormField).toHaveBeenLastCalledWith(
          initialProps.formName,
          'lastName',
          'Bar',
          ['required']
        )
      })

      it('should call touchedFormField when prop touchedField is called', () => {
        const { wrapper, instance } = renderComponent(initialProps)
        const connectedInput = wrapper.find('Connect(Input)')
        connectedInput.find('[name="lastName"]').prop('touchedField')(
          'lastName'
        )()
        expect(instance.props.touchedFormField).toHaveBeenLastCalledWith(
          initialProps.formName,
          'lastName'
        )
      })
    })

    describe('telephone Input', () => {
      it('should call setFormField when prop setField is called', () => {
        const { wrapper, instance } = renderComponent({
          ...initialProps,
          validationSchema: {
            telephone: ['required'],
          },
        })
        const connectedInput = wrapper.find('Connect(Input)')
        connectedInput.find('[name="telephone"]').prop('setField')('telephone')(
          { target: { value: '018118181' } }
        )
        expect(instance.props.setAndValidateFormField).toHaveBeenLastCalledWith(
          initialProps.formName,
          'telephone',
          '018118181',
          ['required']
        )
      })

      it('should call touchedFormField when prop touchedField is called', () => {
        const { wrapper, instance } = renderComponent(initialProps)
        const connectedInput = wrapper.find('Connect(Input)')
        connectedInput.find('[name="telephone"]').prop('touchedField')(
          'telephone'
        )()
        expect(instance.props.touchedFormField).toHaveBeenLastCalledWith(
          initialProps.formName,
          'telephone'
        )
      })
    })

    describe('checkbox Input', () => {
      it('should set smsMobileNumber field when checkbox checked is true', () => {
        const { wrapper, instance } = renderComponent({
          ...initialProps,
          delivInstructionForm: {
            fields: {
              smsMobileNumber: {},
            },
          },
          currentCountry: 'United Kingdom',
        })
        const connectedInput = wrapper.find('Connect(Checkbox)')
        connectedInput.find('[name="smsMobileNumber"]').prop('onChange')({
          target: { checked: true },
        })
        expect(instance.props.setFormField).toHaveBeenLastCalledWith(
          'deliveryInstructions',
          'smsMobileNumber',
          '07123123123'
        )
      })
      it('should unset smsMobileNumber field when checkbox checked is false', () => {
        const { wrapper, instance } = renderComponent({
          ...initialProps,
          delivInstructionForm: {
            fields: {
              smsMobileNumber: {},
            },
          },
          currentCountry: 'United Kingdom',
        })
        const connectedInput = wrapper.find('Connect(Checkbox)')
        connectedInput.find('[name="smsMobileNumber"]').prop('onChange')({
          target: { checked: false },
        })
        expect(instance.props.setFormField).toHaveBeenLastCalledWith(
          'deliveryInstructions',
          'smsMobileNumber',
          ''
        )
      })
    })
  })
})
