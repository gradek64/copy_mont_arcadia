import testComponentHelper from 'test/unit/helpers/test-component'
import Select from './Select'

describe('<Select/>', () => {
  const initialProps = {
    name: 'country',
    onChange: jest.fn(),
  }

  const renderComponent = testComponentHelper(Select.WrappedComponent)

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
    it('in privacy protected state (sessioncamhidetext)', () => {
      expect(
        renderComponent({
          ...initialProps,
          options: [
            {
              label: 'SelectTest',
              value: 'SelectTest',
              disabled: false,
            },
            {
              label: 'SelectTest1',
              value: 'SelectTest1',
              disabled: true,
            },
            {
              label: 'SelectTest2',
              value: 'SelectTest2',
              disabled: false,
            },
          ],
          privacyProtected: true,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with options as an array of objects', () => {
      expect(
        renderComponent({
          ...initialProps,
          options: [
            {
              label: 'SelectTest',
              value: 'SelectTest',
              disabled: false,
            },
            {
              label: 'SelectTest1',
              value: 'SelectTest1',
              disabled: true,
            },
            {
              label: 'SelectTest2',
              value: 'SelectTest2',
              disabled: false,
            },
          ],
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with options as an array of strings', () => {
      expect(
        renderComponent({
          ...initialProps,
          options: ['SelectTest', 'SelectTest1', 'SelectTest2'],
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with label ', () => {
      expect(
        renderComponent({
          ...initialProps,
          label: 'select country',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with label hidden', () => {
      expect(
        renderComponent({
          ...initialProps,
          label: 'select country',
          hideLabel: true,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with errors', () => {
      expect(
        renderComponent({
          ...initialProps,
          errors: {
            country: 'has error',
          },
          field: {
            isTouched: true,
          },
        }).getTree()
      ).toMatchSnapshot()
      const { wrapper } = renderComponent({
        ...initialProps,
        errors: {
          country: 'has error',
        },
        field: {
          isTouched: false,
        },
      })
      expect(wrapper.find('.is-erroring').length).toBe(0)
    })
    it('with class name', () => {
      expect(
        renderComponent({
          ...initialProps,
          className: 'Select-test',
        }).getTree()
      ).toMatchSnapshot()
    })

    it('with firstDisabled', () => {
      expect(
        renderComponent({
          ...initialProps,
          options: ['SelectTest', 'SelectTest1', 'SelectTest2'],
          firstDisabled: 'Demo Country',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('in disabled state', () => {
      expect(
        renderComponent({ ...initialProps, isDisabled: true }).getTree()
      ).toMatchSnapshot()
    })
    it('in required state', () => {
      expect(
        renderComponent({
          ...initialProps,
          isRequired: true,
          label: 'select country',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with autofocus', () => {
      expect(
        renderComponent({ ...initialProps, autofocus: true }).getTree()
      ).toMatchSnapshot()
    })
    it('with noTranslate with firstDisabled', () => {
      expect(
        renderComponent({ ...initialProps, noTranslate: true }).getTree()
      ).toMatchSnapshot()
    })
    it('with noTranslate without firstDisabled', () => {
      expect(
        renderComponent({
          ...initialProps,
          noTranslate: true,
          options: ['SelectTest', 'SelectTest1', 'SelectTest2'],
          firstDisabled: 'Demo Country',
        }).getTree()
      ).toMatchSnapshot()
    })
  })

  describe('@lifecycle', () => {
    describe('on componentDidMount', () => {
      beforeEach(() => jest.resetAllMocks())

      it('should call onChange and sets instance selected true, when defaultValue', () => {
        const { instance } = renderComponent({
          ...initialProps,
          options: ['SelectTest', 'SelectTest1', 'SelectTest2'],
          defaultValue: 'SelectTest',
        })
        expect(instance.props.onChange).not.toHaveBeenCalled()
        expect(instance.selected).toBeUndefined()
        instance.componentDidMount()
        expect(instance.props.onChange).toHaveBeenCalledWith({
          target: { value: instance.props.defaultValue },
        })
        expect(instance.props.onChange).toHaveBeenCalledTimes(1)
        expect(instance.selected).toBeTruthy()
      })
      it('should not call onChange and not set instance selected true, when no defaultValue', () => {
        const { instance } = renderComponent({
          ...initialProps,
          options: ['SelectTest', 'SelectTest1', 'SelectTest2'],
        })
        expect(instance.props.onChange).not.toHaveBeenCalled()
        expect(instance.selected).toBeUndefined()
        instance.componentDidMount()
        expect(instance.props.onChange).not.toHaveBeenCalled()
        expect(instance.selected).toBeUndefined()
      })
    })

    describe('on UNSAFE_componentWillUpdate', () => {
      let renderedComponent
      beforeEach(() => {
        renderedComponent = renderComponent({
          ...initialProps,
          options: ['SelectTest', 'SelectTest1', 'SelectTest2'],
        })
        jest.resetAllMocks()
        expect(renderedComponent.instance.props.onChange).not.toHaveBeenCalled()
        expect(renderedComponent.instance.selected).toBeUndefined()
      })
      it('should call onChange and sets instance selected true when passed defaultValue and empty value ', () => {
        const { wrapper, instance } = renderedComponent
        wrapper.setProps({
          defaultValue: 'SelectTest',
          value: '',
        })
        expect(instance.props.onChange).toHaveBeenCalledWith({
          target: { value: instance.props.defaultValue },
        })
        expect(instance.props.onChange).toHaveBeenCalledTimes(1)
        expect(instance.selected).toBeTruthy()
      })
      it('if has value onChange should not be called but it should appear selected', () => {
        const { wrapper, instance } = renderedComponent
        wrapper.setProps({
          defaultValue: 'SelectTest',
          value: 'SelectTest2',
        })
        expect(instance.props.onChange).not.toHaveBeenCalled()
        expect(instance.selected).toBe(true)
      })
      it('should not call onChange and not set instance selected true when passed empty defaultValue and empty value ', () => {
        const { wrapper, instance } = renderedComponent
        wrapper.setProps({
          defaultValue: '',
          value: '',
        })
        expect(instance.props.onChange).not.toHaveBeenCalled()
        expect(instance.selected).toBeUndefined()
      })
    })
  })

  describe('@methods', () => {
    describe('@changeHandler', () => {
      let currentInstance
      const event = {
        value: 'valueMcValueFace',
      }

      beforeEach(() => {
        jest.resetAllMocks()
        const { instance } = renderComponent(initialProps)
        currentInstance = instance
      })

      it('should call onChange', () => {
        const { onChange } = currentInstance.props

        expect(onChange).not.toHaveBeenCalled()
        currentInstance.changeHandler(event)
        expect(onChange).toHaveBeenCalledTimes(1)
        expect(onChange).toHaveBeenCalledWith(event)
      })
    })
  })

  describe('@events', () => {
    describe('<select/>', () => {
      beforeEach(() => {
        jest.resetAllMocks()
      })

      it('should call onBlur when <select/> blurs', () => {
        const { wrapper, instance } = renderComponent({
          ...initialProps,
          onBlur: jest.fn(),
        })
        expect(instance.props.onBlur).not.toHaveBeenCalled()
        wrapper.find('select').simulate('blur')
        expect(instance.props.onBlur).toHaveBeenCalledTimes(1)
      })
      it('should call onChange when <select/> changes', () => {
        const { wrapper, instance } = renderComponent(initialProps)
        expect(instance.props.onChange).not.toHaveBeenCalled()
        expect(instance.selected).toBeUndefined()
        wrapper
          .find('select')
          .simulate('change', { target: { value: 'SelectTest1' } })
        expect(instance.props.onChange).toHaveBeenCalledWith({
          target: { value: 'SelectTest1' },
        })
        expect(instance.props.onChange).toHaveBeenCalledTimes(1)
        expect(instance.selected).toBeTruthy()
      })

      describe('sendAnalyticsValidationState', () => {
        it('should be called if an events prop (i.e. it does some validation) is provided and user is on a checkout page', () => {
          const analyticsSpy = jest.fn()
          const { wrapper } = renderComponent({
            ...initialProps,
            sendAnalyticsValidationState: analyticsSpy,
            errors: {},
            isInCheckout: true,
          })

          expect(analyticsSpy).not.toHaveBeenCalled()
          wrapper.find('select').simulate('blur')

          expect(analyticsSpy).toHaveBeenCalledTimes(1)
          const analyticsPayload = analyticsSpy.mock.calls[0][0]
          expect(analyticsPayload.id).toBe('country')
        })

        it('should be called with `success` if error prop does not contain a property relating to this inputName', () => {
          const analyticsSpy = jest.fn()
          const { wrapper } = renderComponent({
            ...initialProps,
            sendAnalyticsValidationState: analyticsSpy,
            errors: { someOtherInputName: 'some error' },
            isInCheckout: true,
          })

          expect(analyticsSpy).not.toHaveBeenCalled()
          wrapper.find('select').simulate('blur')

          expect(analyticsSpy).toHaveBeenCalledTimes(1)
          const analyticsPayload = analyticsSpy.mock.calls[0][0]
          expect(analyticsPayload.validationStatus).toBe('success')
        })

        it('should be called with `failure` if error prop does not contain a property relating to this inputName', () => {
          const analyticsSpy = jest.fn()
          const { wrapper } = renderComponent({
            ...initialProps,
            sendAnalyticsValidationState: analyticsSpy,
            errors: { country: 'some error' },
            isInCheckout: true,
          })

          expect(analyticsSpy).not.toHaveBeenCalled()
          wrapper.find('select').simulate('blur')

          expect(analyticsSpy).toHaveBeenCalledTimes(1)
          const analyticsPayload = analyticsSpy.mock.calls[0][0]
          expect(analyticsPayload.validationStatus).toBe('failure')
        })
      })
    })
  })
})
