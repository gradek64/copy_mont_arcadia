import testComponentHelper from 'test/unit/helpers/test-component'
import NotifyProductForm from './NotifyProductForm'

describe('<NotifyProductForm />', () => {
  const renderComponent = testComponentHelper(
    NotifyProductForm.WrappedComponent
  )
  const sizes = [
    {
      sku: '602017001100552',
      size: '40',
      quantity: 10,
      selected: false,
    },
    {
      sku: '602017001100553',
      size: '41',
      quantity: 10,
      selected: false,
    },
  ]

  const oneSize = [
    {
      sku: '602017001076279',
      size: 'ONE',
      quantity: 0,
      selected: false,
    },
  ]

  const userData = {
    firstName: 'firstName',
    surname: 'surname',
    email: 'nameyMcName@mcname.me',
  }

  const submittingFields = {
    firstName: {
      isDirty: true,
      isTouched: true,
      value: userData.firstName,
    },
    surname: {
      isDirty: true,
      isTouched: true,
      value: userData.surname,
    },
    email: {
      isDirty: true,
      isTouched: true,
      value: userData.email,
    },
    state: {
      value: 'submitting',
      isDirty: false,
      isTouched: false,
    },
  }

  const submittedFields = {
    firstName: {
      value: userData.firstName,
    },
    surname: {
      value: userData.surname,
    },
    email: {
      value: userData.email,
    },
    state: {
      value: 'notfalse',
    },
  }

  const fieldscorrect = {
    firstName: {
      value: userData.firstName,
    },
    surname: {
      value: userData.surname,
    },
    email: {
      value: userData.email,
    },
    state: {
      value: '',
    },
  }

  const fields = {
    firstName: {
      value: '',
      isDirty: false,
      isTouched: false,
    },
    surname: {
      value: '',
      isDirty: false,
      isTouched: false,
    },
    email: {
      value: '',
      isDirty: false,
      isTouched: false,
    },
    state: {
      value: '',
      isDirty: false,
      isTouched: false,
    },
  }

  const resetFormFields = {
    firstName: {
      value: null,
      isDirty: false,
      isTouched: false,
    },
    surname: {
      value: '',
      isDirty: false,
      isTouched: false,
    },
    email: {
      value: '',
      isDirty: false,
      isTouched: false,
    },
    state: {
      value: 'somevalue',
      isDirty: false,
      isTouched: false,
    },
  }

  const initialProps = {
    showModal: jest.fn(),
    toggleModal: jest.fn(),
    setModalChildren: jest.fn(),
    resetForm: jest.fn(),
    setFormField: jest.fn(),
    touchedFormField: jest.fn(),
    touchedMultipleFormFields: jest.fn(),
    updateSelectedOosItem: jest.fn(),
    emailMeStock: jest.fn(),
    submitForm: jest.fn(),
    productId: 27528600,
    productTitle: 'Embroidered Poplin Top',
    sizes,
    stockThreshold: 0,
    backInStock: false,
    notifyMe: false,
    notifyStockForm: {
      fields,
      isLoading: false,
      errors: {},
      message: {},
    },
    modal: {
      open: false,
      mode: 'normal',
      type: 'dialog',
      children: [],
    },
    selectedOosItem: {},
    user: {},
    brandName: 'Topshop UK',
    updateActiveItem: jest.fn(),
  }

  beforeEach(() => jest.resetAllMocks())

  describe('@render', () => {
    it('default', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('has only one size', () => {
      expect(
        renderComponent({
          ...initialProps,
          sizes: oneSize,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('shows form submitting', () => {
      expect(
        renderComponent({
          ...initialProps,
          notifyStockForm: { fields: submittingFields },
        }).getTree()
      ).toMatchSnapshot()
    })

    it('has backInStock message', () => {
      expect(
        renderComponent({
          ...initialProps,
          backInStock: true,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('has Provide us with your email address.. message', () => {
      expect(
        renderComponent({
          ...initialProps,
          backInStock: false,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('shows submitted form', () => {
      expect(
        renderComponent({
          ...initialProps,
          notifyStockForm: { fields: submittedFields },
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should call resetForm', () => {
      expect(initialProps.resetForm).not.toHaveBeenCalled()
      renderComponent({
        ...initialProps,
        notifyStockForm: { fields: resetFormFields },
        user: userData,
      })
      expect(initialProps.resetForm).toHaveBeenCalledTimes(1)
    })
    it('should show size error when state.showSizeError is true and selectedOosItem is empty', () => {
      const { wrapper, getTree } = renderComponent(initialProps)
      wrapper.setState({ showSizeError: true })
      expect(getTree()).toMatchSnapshot()
    })
  })

  describe('@lifeCycles', () => {
    describe('constructor', () => {
      it('should set state of showSizeError to false', () => {
        const { instance } = renderComponent(initialProps)
        expect(instance.state.showSizeError).toBe(false)
      })
    })
  })

  describe('@events', () => {
    describe('form submit', () => {
      const event = {
        preventDefault: jest.fn(),
      }
      beforeEach(jest.resetAllMocks)
      it('should call event.preventDefault and touchedMultipleFormFields', () => {
        const { instance, wrapper } = renderComponent(initialProps)
        expect(event.preventDefault).not.toHaveBeenCalled()
        expect(instance.props.touchedMultipleFormFields).not.toHaveBeenCalled()
        wrapper.find('Form').simulate('submit', event)
        expect(event.preventDefault).toHaveBeenCalledTimes(1)
        expect(instance.props.touchedMultipleFormFields).toHaveBeenCalledTimes(
          1
        )
      })
      it('should call submitForm on click when fields are entered and not set showSizeError to true', () => {
        const { instance, wrapper } = renderComponent({
          ...initialProps,
          notifyStockForm: { fields: fieldscorrect },
          selectedOosItem: initialProps.sizes[0],
        })
        expect(instance.props.submitForm).not.toHaveBeenCalled()
        wrapper.find('Form').simulate('submit', event)
        expect(instance.props.submitForm).toHaveBeenCalledTimes(1)
        expect(instance.state.showSizeError).not.toBe(true)
      })
      it('should set state of showSizeError to true if fields incorrecet or not filled and not call submitForm', () => {
        const { instance, wrapper } = renderComponent({
          ...initialProps,
          selectedOosItem: initialProps.sizes[0],
        })
        expect(instance.state.showSizeError).toBe(false)
        wrapper.find('Form').simulate('submit', event)
        expect(instance.props.submitForm).not.toHaveBeenCalled()
        expect(instance.state.showSizeError).toBe(true)
      })
    })

    describe('inputs', () => {
      let renderedComponent
      let field
      const event = {
        target: {
          value: 123,
        },
        preventDefault: jest.fn(),
      }

      beforeEach(() => {
        renderedComponent = renderComponent({
          ...initialProps,
          notifyStockForm: { fields: fieldscorrect },
        })
      })

      describe('firstName', () => {
        field = 'firstName'

        it('should call setFormField for firstName', () => {
          const { instance, wrapper } = renderedComponent

          expect(instance.props.setFormField).not.toHaveBeenCalled()
          const connectedInput = wrapper.find('Connect(Input)')
          connectedInput.find(`[name='${field}']`).prop('setField')(field)(
            event
          )
          expect(instance.props.setFormField).toHaveBeenCalledTimes(1)
          expect(instance.props.setFormField).toHaveBeenLastCalledWith(
            'notifyStock',
            field,
            event.target.value
          )
        })

        it('should call touchedFormField when prop touchedField is called', () => {
          const { wrapper, instance } = renderedComponent
          expect(instance.props.touchedFormField).not.toHaveBeenCalled()
          const connectedInput = wrapper.find('Connect(Input)')
          connectedInput.find(`[name='${field}']`).prop('touchedField')(field)(
            event
          )
          expect(instance.props.touchedFormField).toHaveBeenCalledTimes(1)
          expect(instance.props.touchedFormField).toHaveBeenLastCalledWith(
            'notifyStock',
            field
          )
        })
      })

      describe('surname', () => {
        field = 'surname'

        it('should call setFormField for firstName', () => {
          const { instance, wrapper } = renderedComponent
          const connectedInput = wrapper.find('Connect(Input)')

          expect(instance.props.setFormField).not.toHaveBeenCalled()

          connectedInput.find(`[name='${field}']`).prop('setField')(field)(
            event
          )

          expect(instance.props.setFormField).toHaveBeenCalledTimes(1)
          expect(instance.props.setFormField).toHaveBeenLastCalledWith(
            'notifyStock',
            field,
            event.target.value
          )
        })

        it('should call touchedFormField when prop touchedField is called', () => {
          const { wrapper, instance } = renderedComponent
          const connectedInput = wrapper.find('Connect(Input)')

          expect(instance.props.touchedFormField).not.toHaveBeenCalled()

          connectedInput.find(`[name='${field}']`).prop('touchedField')(field)(
            event
          )

          expect(instance.props.touchedFormField).toHaveBeenCalledTimes(1)
          expect(instance.props.touchedFormField).toHaveBeenLastCalledWith(
            'notifyStock',
            field
          )
        })
      })

      describe('email', () => {
        field = 'email'

        it('should call setFormField for firstName', () => {
          const { instance, wrapper } = renderedComponent
          const connectedInput = wrapper.find('Connect(Input)')

          expect(instance.props.setFormField).not.toHaveBeenCalled()

          connectedInput.find(`[name='${field}']`).prop('setField')(field)(
            event
          )

          expect(instance.props.setFormField).toHaveBeenCalledTimes(1)
          expect(instance.props.setFormField).toHaveBeenLastCalledWith(
            'notifyStock',
            field,
            event.target.value
          )
        })

        it('should call touchedFormField when prop touchedField is called', () => {
          const { wrapper, instance } = renderedComponent
          const connectedInput = wrapper.find('Connect(Input)')

          expect(instance.props.touchedFormField).not.toHaveBeenCalled()

          connectedInput.find(`[name='${field}']`).prop('touchedField')(field)(
            event
          )

          expect(instance.props.touchedFormField).toHaveBeenCalledTimes(1)
          expect(instance.props.touchedFormField).toHaveBeenLastCalledWith(
            'notifyStock',
            field
          )
        })
      })
    })
  })
})
