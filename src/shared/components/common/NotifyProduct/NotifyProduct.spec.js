import testComponentHelper from 'test/unit/helpers/test-component'
import NotifyProduct from './NotifyProduct'

describe('<NotifyProduct />', () => {
  const renderComponent = testComponentHelper(NotifyProduct.WrappedComponent)
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

  const sizesNoQuatity = [
    {
      sku: '602017001100552',
      size: '40',
      quantity: 10,
      selected: false,
    },
    {
      sku: '602017001100553',
      size: '41',
      quantity: 0,
      selected: false,
    },
  ]

  const fields = {
    firstName: {
      value: '',
      isDirty: false,
      isTouched: false,
      isFocused: false,
    },
    surname: {
      value: '',
      isDirty: false,
      isTouched: false,
      isFocused: false,
    },
    email: {
      value: '',
      isDirty: false,
      isTouched: false,
      isFocused: false,
    },
    state: {
      value: '',
      isDirty: false,
      isTouched: false,
      isFocused: false,
    },
  }

  const initialProps = {
    showModal: jest.fn(),
    toggleModal: jest.fn(),
    setModalChildren: jest.fn(),
    resetForm: jest.fn(),
    setFormField: jest.fn(),
    touchedFormField: jest.fn(),
    updateSelectedOosItem: jest.fn(),
    emailMeStock: jest.fn(),
    sizes: sizesNoQuatity,
    backInStock: false,
    notifyMe: true,
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
    brandName: 'Topshop UK',
  }

  beforeEach(() => jest.resetAllMocks())

  describe('@render', () => {
    it('default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('sizes are all in stock', () => {
      expect(
        renderComponent({
          ...initialProps,
          backInStock: true,
          notifyMe: true,
          sizes,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('notifyMe is true, backInStock is false and not all sizes are in stock', () => {
      expect(
        renderComponent({
          ...initialProps,
          backInStock: false,
          notifyMe: true,
          sizes: sizesNoQuatity,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('notifyMe is false, backInStock is true and not all sizes are in stock', () => {
      expect(
        renderComponent({
          ...initialProps,
          backInStock: true,
          notifyMe: false,
          sizes: sizesNoQuatity,
        }).getTree()
      ).toMatchSnapshot()
    })
  })

  describe('@lifecycle', () => {
    describe('@UNSAFE_componentWillReceiveProps', () => {
      const baseNextProps = {
        notifyStockForm: {
          fields,
          isLoading: true,
          errors: {},
          message: {},
        },
        modal: {
          open: true,
        },
        selectedOosItem: {},
      }

      it('should not call setModalChildren if nextProps.nofityStockForm equals nofityStockForm', () => {
        const { instance } = renderComponent(initialProps)
        const nextProps = {
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
        }

        expect(instance.props.setModalChildren).not.toHaveBeenCalled()
        instance.UNSAFE_componentWillReceiveProps(nextProps)
        expect(instance.props.setModalChildren).not.toHaveBeenCalled()
      })

      it('should call setModalChildren if nextProps nofityStockForm does not equal nofityStockForm', () => {
        const { instance } = renderComponent({
          ...initialProps,
          sizes: sizesNoQuatity,
          backInStock: true,
          notifyMe: true,
          modal: {
            open: true,
          },
        })

        const newNextProps = {
          ...instance.props,
          ...baseNextProps,
          notifyStockForm: {
            ...baseNextProps.notifyStockForm,
            isLoading: true,
          },
        }
        expect(instance.props.setModalChildren).not.toHaveBeenCalled()
        instance.UNSAFE_componentWillReceiveProps(newNextProps)
        expect(instance.props.setModalChildren).toHaveBeenCalledTimes(1)
      })

      it('should call setModalChildren if nextProps selectedOosItem does not equal selectedOosItem', () => {
        const { instance } = renderComponent(initialProps)
        const nextProps = {
          ...instance.props,
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
          selectedOosItem: {
            size: 8,
          },
        }

        expect(instance.props.setModalChildren).not.toHaveBeenCalled()
        instance.UNSAFE_componentWillReceiveProps(nextProps)
        expect(instance.props.setModalChildren).toHaveBeenCalledTimes(1)
      })

      it('should call updateSelectedOosItem and resetForm if nextProps modal is not open', () => {
        const { instance } = renderComponent({
          ...initialProps,
          modal: {
            open: true,
          },
        })
        const nextProps = {
          ...instance.props,
          notifyStockForm: {
            fields,
            isLoading: true,
            errors: {},
            message: {},
          },
          modal: {
            open: false,
          },
        }

        expect(instance.props.updateSelectedOosItem).not.toHaveBeenCalled()
        expect(instance.props.resetForm).not.toHaveBeenCalled()
        instance.UNSAFE_componentWillReceiveProps(nextProps)
        expect(instance.props.updateSelectedOosItem).toHaveBeenCalledTimes(1)
        expect(instance.props.updateSelectedOosItem).toHaveBeenCalledWith({})
        expect(instance.props.resetForm).toHaveBeenCalledTimes(1)
        expect(instance.props.resetForm).toHaveBeenCalledWith('notifyStock', {
          firstName: null,
          surname: null,
          email: null,
          state: null,
        })
      })

      it('should call showModal if modal not open and nextProps selectedOosItem is not empty', () => {
        const { instance } = renderComponent(initialProps)
        const nextProps = {
          ...instance.props,
          notifyStockForm: {
            fields,
            isLoading: true,
            errors: {},
            message: {},
          },
          modal: {
            open: false,
          },
          selectedOosItem: {
            prop: {},
          },
        }

        expect(instance.props.showModal).not.toHaveBeenCalled()
        instance.UNSAFE_componentWillReceiveProps(nextProps)
        expect(instance.props.showModal).toHaveBeenCalledTimes(1)
      })

      it('should call showModal if modal not open and nextProps selectedOosItem is not empty and one sized item', () => {
        const { instance } = renderComponent({
          ...initialProps,
          sizes: [{ size: 'ONE', quantity: 0 }],
        })
        const nextProps = {
          ...instance.props,
          notifyStockForm: {
            fields,
            isLoading: true,
            errors: {},
            message: {},
          },
          modal: {
            open: false,
          },
          selectedOosItem: {
            prop: {},
          },
        }
        expect(instance.props.updateSelectedOosItem).not.toHaveBeenCalled()
        instance.UNSAFE_componentWillReceiveProps(nextProps)
        expect(instance.props.updateSelectedOosItem).toHaveBeenCalledTimes(1)
        expect(instance.props.updateSelectedOosItem).toHaveBeenLastCalledWith(
          instance.props.sizes[0]
        )
      })

      it('should not call showModal if modal not open and nextProps selectedOosItem is empty', () => {
        const { instance } = renderComponent(initialProps)
        const nextProps = {
          ...instance.props,
          notifyStockForm: {
            fields,
            isLoading: true,
            errors: {},
            message: {},
          },
          modal: {
            open: false,
          },
          selectedOosItem: {},
        }

        expect(instance.props.showModal).not.toHaveBeenCalled()
        instance.UNSAFE_componentWillReceiveProps(nextProps)
        expect(instance.props.showModal).not.toHaveBeenCalled()
      })
    })
  })

  describe('instance methods', () => {
    describe('submitForm', () => {
      it('should call setFormField', () => {
        const { instance } = renderComponent(initialProps)
        expect(initialProps.setFormField).not.toHaveBeenCalled()
        instance.submitForm()
        expect(initialProps.setFormField).toHaveBeenCalledTimes(1)
      })

      it('should call emailMeStock', () => {
        const { instance } = renderComponent(initialProps)
        expect(initialProps.emailMeStock).not.toHaveBeenCalled()
        instance.submitForm()
        expect(initialProps.emailMeStock).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('@events', () => {
    it('should call showModal when clickHandler called', () => {
      const { instance, wrapper } = renderComponent({
        ...initialProps,
        sizes: sizesNoQuatity,
        backInStock: true,
        notifyMe: true,
      })

      expect(instance.props.showModal).not.toHaveBeenCalled()
      wrapper.find('.NotifyProduct-button').prop('clickHandler')()
      expect(instance.props.showModal).toHaveBeenCalledTimes(1)
    })

    it('should call showModal with the correct args', () => {
      const { instance, wrapper } = renderComponent({
        ...initialProps,
        sizes: sizesNoQuatity,
        backInStock: true,
        notifyMe: true,
      })

      wrapper.find('.NotifyProduct-button').prop('clickHandler')()

      const mockCalls = instance.props.showModal.mock.calls

      expect(typeof mockCalls[0][0]).toBe('object')
      expect(mockCalls[0][1]).toMatchObject({ mode: 'roll' })
    })
  })
})
