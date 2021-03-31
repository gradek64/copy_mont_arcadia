import testComponentHelper from 'test/unit/helpers/test-component'
import Checkbox from '../Checkbox'

describe('<Checkbox/>', () => {
  const initialProps = {
    checked: {
      value: false,
    },
    name: 'CheckboxTest',
    onChange: jest.fn(),
  }

  const renderComponent = testComponentHelper(Checkbox.WrappedComponent)

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
    it('in disabled state', () => {
      expect(
        renderComponent({ ...initialProps, isDisabled: true }).wrapper.find(
          '.is-disabled'
        )
      ).toHaveLength(1)
    })
    it('in required state', () => {
      expect(
        renderComponent({ ...initialProps, isRequired: true }).wrapper.find(
          '.Checkbox-required'
        )
      ).toHaveLength(1)
    })
    it('in reverse state', () => {
      expect(
        renderComponent({ ...initialProps, reverse: true }).wrapper.find(
          '.Checkbox--reverse'
        )
      ).toHaveLength(1)
    })
    it('with className', () => {
      expect(
        renderComponent({
          ...initialProps,
          className: 'test-class',
        }).wrapper.find('.test-class')
      ).toHaveLength(1)
    })
    it('with children', () => {
      expect(
        renderComponent({
          ...initialProps,
          children: '<div>test child node</div>',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with correct label', () => {
      const text = 'label text'
      const { wrapper } = renderComponent({ ...initialProps, children: text })
      expect(wrapper.find('.Checkbox-label').text()).toBe(text)
    })

    it('with error', () => {
      const errors = {
        CheckboxTest: 'This field is required',
      }
      const field = {
        isTouched: true,
      }
      const { wrapper } = renderComponent({ ...initialProps, errors, field })
      expect(wrapper.find('.is-erroring')).toHaveLength(1)
      expect(wrapper.find('.Checkbox-validationMessage')).toHaveLength(1)
    })
    it('is unchecked', () => {
      const { wrapper } = renderComponent({ ...initialProps })
      expect(wrapper.find('input').props().checked).toBe(false)
    })
    it('is checked', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        checked: { value: true },
      })
      expect(wrapper.find('input').props().checked).toBe(true)
    })
  })

  describe('@events', () => {
    it('should call onChange() when value changes', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(initialProps.onChange).not.toHaveBeenCalled()
      wrapper.find('.Checkbox-field').simulate('change')
      expect(initialProps.onChange).toHaveBeenCalledTimes(1)
    })

    describe('onBlur - send validation state to GTM', () => {
      it('should be called if an events prop (i.e. it does some validation) is provided and user is on a checkout page', () => {
        const analyticsSpy = jest.fn()
        const { wrapper } = renderComponent({
          ...initialProps,
          sendValidationState: analyticsSpy,
          errors: {},
          isInCheckout: true,
        })

        expect(analyticsSpy).not.toHaveBeenCalled()
        wrapper.find('input').simulate('blur')

        expect(analyticsSpy).toHaveBeenCalledTimes(1)
        const analyticsPayload = analyticsSpy.mock.calls[0][0]
        expect(analyticsPayload.id).toBe('CheckboxTest')
      })

      it('should be called with `success` if error prop does not contain a property relating to this inputName', () => {
        const analyticsSpy = jest.fn()
        const { wrapper } = renderComponent({
          ...initialProps,
          sendValidationState: analyticsSpy,
          errors: { someOtherInputName: 'some error' },
          isInCheckout: true,
        })

        expect(analyticsSpy).not.toHaveBeenCalled()
        wrapper.find('input').simulate('blur')

        expect(analyticsSpy).toHaveBeenCalledTimes(1)
        const analyticsPayload = analyticsSpy.mock.calls[0][0]
        expect(analyticsPayload.validationStatus).toBe('success')
      })

      it('should be called with `failure` if error prop does not contain a property relating to this inputName', () => {
        const analyticsSpy = jest.fn()
        const { wrapper } = renderComponent({
          ...initialProps,
          sendValidationState: analyticsSpy,
          errors: { CheckboxTest: 'some error' },
          isInCheckout: true,
        })

        expect(analyticsSpy).not.toHaveBeenCalled()
        wrapper.find('input').simulate('blur')

        expect(analyticsSpy).toHaveBeenCalledTimes(1)
        const analyticsPayload = analyticsSpy.mock.calls[0][0]
        expect(analyticsPayload.validationStatus).toBe('failure')
      })
    })
  })
})
