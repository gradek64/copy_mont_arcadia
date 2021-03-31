import testComponentHelper from 'test/unit/helpers/test-component'
import DetailsForm from '../DetailsForm'

describe('<DetailsForm />', () => {
  const renderComponent = testComponentHelper(DetailsForm.WrappedComponent)
  const initialProps = {
    detailsType: 'delivery',
    form: {
      fields: {
        title: {
          value: 'Mr',
        },
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
    titles: ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr'],
    setFormField: jest.fn(),
    setAndValidateFormField: jest.fn(),
    touchFormField: jest.fn(),
    validateForm: jest.fn(),
    clearFormErrors: jest.fn(),
    deliveryType: 'home',
    validationSchema: {
      title: 'required',
    },
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

    it('with home delivery', () => {
      expect(
        renderComponent({
          ...initialProps,
          deliveryType: 'HOME',
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with store delivery', () => {
      expect(
        renderComponent({
          ...initialProps,
          deliveryType: 'STORE',
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with parcel delivery', () => {
      expect(
        renderComponent({
          ...initialProps,
          deliveryType: 'PARCELSHOP',
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with home delivery in billing', () => {
      expect(
        renderComponent({
          ...initialProps,
          detailsType: 'billing',
          deliveryType: 'HOME',
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with store delivery in billing', () => {
      expect(
        renderComponent({
          ...initialProps,
          detailsType: 'billing',
          deliveryType: 'STORE',
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with parcel delivery in billing', () => {
      expect(
        renderComponent({
          ...initialProps,
          detailsType: 'billing',
          deliveryType: 'PARCELSHOP',
        }).getTree()
      ).toMatchSnapshot()
    })
  })

  describe('@events', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    describe('title Select', () => {
      it('should call setAndValidateFormField on change', () => {
        const event = {
          target: {
            value: 'Dr',
          },
        }
        const { wrapper, instance } = renderComponent(initialProps)
        const connectedSelect = wrapper.find('Connect(Select)')
        connectedSelect.find('[name="title"]').prop('onChange')(event)
        expect(instance.props.setAndValidateFormField).toHaveBeenLastCalledWith(
          initialProps.formName,
          'title',
          'Dr',
          initialProps.validationSchema.title
        )
      })
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
        connectedInput.find('[name="firstName"]').prop('setField')(
          'firstName'
        )({ target: { value: 'Foo' } })
        expect(
          instance.props.setAndValidateFormField
        ).toHaveBeenLastCalledWith(initialProps.formName, 'firstName', 'Foo', [
          'required',
        ])
      })

      it('should call touchedFormField when prop touchedField is called', () => {
        const { wrapper, instance } = renderComponent(initialProps)
        const connectedInput = wrapper.find('Connect(Input)')
        connectedInput.find('[name="firstName"]').prop('touchedField')(
          'firstName'
        )()
        expect(instance.props.touchFormField).toHaveBeenLastCalledWith(
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
        expect(
          instance.props.setAndValidateFormField
        ).toHaveBeenLastCalledWith(initialProps.formName, 'lastName', 'Bar', [
          'required',
        ])
      })

      it('should call touchedFormField when prop touchedField is called', () => {
        const { wrapper, instance } = renderComponent(initialProps)
        const connectedInput = wrapper.find('Connect(Input)')
        connectedInput.find('[name="lastName"]').prop('touchedField')(
          'lastName'
        )()
        expect(instance.props.touchFormField).toHaveBeenLastCalledWith(
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
        connectedInput.find('[name="telephone"]').prop('setField')(
          'telephone'
        )({ target: { value: '018118181' } })
        expect(
          instance.props.setAndValidateFormField
        ).toHaveBeenLastCalledWith(
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
        expect(instance.props.touchFormField).toHaveBeenLastCalledWith(
          initialProps.formName,
          'telephone'
        )
      })
    })
  })
})
