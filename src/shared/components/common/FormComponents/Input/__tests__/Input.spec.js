import React from 'react'
import testComponentHelper from 'test/unit/helpers/test-component'
import toJson from 'enzyme-to-json'
import { shallow } from 'enzyme'
import Input from '../Input'
import PreloadImages from '../../../PreloadImages/PreloadImages'

jest.mock('../../../../../lib/checkout', () => ({
  isCheckoutPath: jest.fn(),
}))

import { isCheckoutPath } from '../../../../../lib/checkout'

jest.mock('../../../../../lib/user-agent', () => ({
  isIOS: jest.fn(),
}))

import { isIOS } from '../../../../../lib/user-agent'

describe('Input', () => {
  const touchFieldCallbackSpy = jest.fn((name) => name)
  const initialProps = {
    analyticsOnChange: () => {},
    autocomplete: 'autocomplete',
    autofocus: false,
    className: 'horseBreath',
    errors: {},
    field: {},
    inputState: {},
    iosAgent: false,
    isDisabled: false,
    isFocused: false,
    isRequired: false,
    label: 'labelText',
    maxLength: 1000,
    name: 'inputName',
    placeholder: 'placeholder',
    privacyProtected: false,
    setField: jest.fn(),
    toggleInputActive: jest.fn(),
    toggleShowPassword: jest.fn(),
    touchedField: () => touchFieldCallbackSpy,
    type: 'text',
    value: 'value',
  }
  const renderComponent = testComponentHelper(Input.WrappedComponent)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('@render', () => {
    it('should not pass a default pattern to `input` if not number type', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        type: 'tel',
      })
      expect(wrapper.find('input').prop('pattern')).toBeUndefined()
    })

    it('should pass default pattern `[0-9]*` to `input` if number type', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        type: 'number',
      })
      expect(wrapper.find('input').prop('pattern')).toBe('[0-9]*')
    })

    it('should default id if not id was passed as prop', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
      })
      expect(wrapper.find('input').prop('id')).toBe('inputName-text')
    })

    it('should pass on defined id if set in props', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        id: 'inputFieldId',
      })
      expect(wrapper.find('input').prop('id')).toBe('inputFieldId')
    })

    it('should render the reveal password component for a "password" type', () => {
      const { wrapper } = renderComponent({ ...initialProps, type: 'password' })
      const passwordShowFeatureCheck = wrapper.find({
        flag: 'PASSWORD_SHOW_TOGGLE',
      })
      expect(passwordShowFeatureCheck).toHaveLength(1)
      expect(toJson(passwordShowFeatureCheck)).toMatchSnapshot()
      const RenderProp = passwordShowFeatureCheck
        .find(PreloadImages)
        .prop('render')
      expect(toJson(shallow(<RenderProp />))).toMatchSnapshot()
    })

    it('should render the visible password state when the "inputState" has set "showPassword" to true', () => {
      const { wrapper } = renderComponent({ ...initialProps, type: 'password' })
      wrapper.setState({ showPassword: true })
      expect(toJson(wrapper)).toMatchSnapshot()
    })

    it('should visualize validation if field is touched and filled', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        field: {
          isTouched: true,
        },
      })
      expect(wrapper.find('.Input').hasClass('is-touched')).toBe(true)
      expect(wrapper.find('.Input-validateSuccess').length).toBe(1)
    })

    it('should not visualize validation if field is touched and but not filled', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        field: {
          isTouched: true,
          value: '',
        },
      })
      expect(wrapper.find('.Input').hasClass('is-touched')).toBe(false)
      expect(wrapper.find('.Input-validateSuccess').length).toBe(0)
    })

    it('should show the validation error message and icon', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        field: {
          isTouched: true,
        },
        errors: { inputName: 'expectedErrorMessage' },
      })
      expect(wrapper.find('.Input-validationMessage').prop('children')).toBe(
        'expectedErrorMessage'
      )
      expect(wrapper.find('.Input-validateFail').length).toBe(1)
    })

    it('should show the validation success icon and error spacer', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        field: {
          isTouched: true,
        },
      })
      expect(wrapper.find('.Input-validationMessage').length).toBe(0)
      expect(wrapper.find('.Input-validateFail').length).toBe(0)
      expect(wrapper.find('.Input-validateSuccess').length).toBe(1)
    })

    it('the label should be passed to the component as prop', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
      })
      expect(wrapper.find('label').text()).toBe('labelText')
    })

    it('should show the expected value as placeholder of the component', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
      })
      expect(wrapper.find('.Input-field').prop('placeholder')).toBe(
        'placeholder'
      )
    })

    it('should not show error message/icon if the coponent has not been touched', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
      })
      expect(wrapper.find('.IconForm-fail').length).toBe(0)
      expect(wrapper.find('.IconForm-validationMessage').length).toBe(0)
    })
  })

  describe('@methods', () => {
    describe('@handleBlur', () => {
      let currentInstance

      beforeEach(() => {
        jest.resetAllMocks()
        const { instance } = renderComponent(initialProps)
        currentInstance = instance
      })

      it('should call on-blur', () => {
        const onBlur = jest.fn()
        const ev = 'event'

        const { instance } = renderComponent({ ...initialProps, onBlur })

        instance.handleBlur(ev)
        expect(onBlur).toHaveBeenCalledTimes(1)
        expect(onBlur).toHaveBeenCalledWith(ev)
      })

      it('should call touchField callback', () => {
        expect(touchFieldCallbackSpy).not.toHaveBeenCalled()
        currentInstance.handleBlur()
        expect(touchFieldCallbackSpy).toHaveBeenCalledTimes(1)
      })

      it('should toggle isActive', () => {
        currentInstance.setState({ isActive: true })
        currentInstance.handleBlur()
        expect(currentInstance.state.isActive).toBe(false)
      })

      describe('sendAnalyticsValidationState', () => {
        it('should be called if an events prop (i.e. it does some validation) is provided and user is on a checkout page', () => {
          const analyticsSpy = jest.fn()
          const { wrapper, instance } = renderComponent({
            ...initialProps,
            sendAnalyticsValidationState: analyticsSpy,
            errors: {},
          })
          instance.inputField = { id: 'imaginaryId' }
          isCheckoutPath.mockImplementation(() => true)

          expect(analyticsSpy).not.toHaveBeenCalled()
          wrapper.find('input').simulate('blur')

          expect(analyticsSpy).toHaveBeenCalledTimes(1)
          const analyticsPayload = analyticsSpy.mock.calls[0][0]
          expect(analyticsPayload.id).toBe('imaginaryId')
        })

        it('should be called with `success` if error prop does not contain a property relating to this inputName', () => {
          const analyticsSpy = jest.fn()
          const { wrapper, instance } = renderComponent({
            ...initialProps,
            sendAnalyticsValidationState: analyticsSpy,
            errors: { someOtherInputName: 'some error' },
          })
          instance.inputField = { id: 'imaginaryId' }

          isCheckoutPath.mockImplementation(() => true)

          expect(analyticsSpy).not.toHaveBeenCalled()
          wrapper.find('input').simulate('blur')

          expect(analyticsSpy).toHaveBeenCalledTimes(1)
          const analyticsPayload = analyticsSpy.mock.calls[0][0]
          expect(analyticsPayload.validationStatus).toBe('success')
        })

        it('should be called with `failure` if error prop does not contain a property relating to this inputName', () => {
          const analyticsSpy = jest.fn()
          const { wrapper, instance } = renderComponent({
            ...initialProps,
            sendAnalyticsValidationState: analyticsSpy,
            errors: { inputName: 'some error' },
          })
          instance.inputField = { id: 'imaginaryId' }

          isCheckoutPath.mockImplementation(() => true)

          expect(analyticsSpy).not.toHaveBeenCalled()
          wrapper.find('input').simulate('blur')

          expect(analyticsSpy).toHaveBeenCalledTimes(1)
          const analyticsPayload = analyticsSpy.mock.calls[0][0]
          expect(analyticsPayload.validationStatus).toBe('failure')
        })
      })
    })

    describe('componentDidUpdate', () => {
      let prevProps
      let currentInstance
      let currentWrapper

      beforeEach(() => {
        jest.resetAllMocks()
        const { instance, wrapper } = renderComponent(initialProps)
        currentInstance = instance
        currentWrapper = wrapper
      })

      describe('setting focus', () => {
        let setFocusSpy
        beforeEach(() => {
          setFocusSpy = jest
            .spyOn(currentInstance, 'setFocus')
            .mockImplementation(() => {})
        })

        it('prevProps.isFocused does not equal props.isFocused this ', () => {
          prevProps = Object.assign({}, initialProps, {
            isFocused: true,
          })

          expect(setFocusSpy).not.toHaveBeenCalled()
          currentInstance.componentDidUpdate(prevProps)
          expect(setFocusSpy).not.toHaveBeenCalled()
        })

        it('prevProps.isFocused does equal props.isFocused but is false  ', () => {
          prevProps = Object.assign({}, initialProps, {
            isFocused: false,
          })

          expect(setFocusSpy).not.toHaveBeenCalled()
          currentInstance.componentDidUpdate(prevProps)
          expect(setFocusSpy).not.toHaveBeenCalled()
        })

        it('prevProps.isFocused does equal props.isFocused and is true  ', () => {
          currentWrapper.setProps({
            isFocused: true,
          })

          prevProps = Object.assign({}, initialProps)

          expect(setFocusSpy).not.toHaveBeenCalled()
          currentInstance.componentDidUpdate(prevProps)
          expect(setFocusSpy).toHaveBeenCalledTimes(1)
        })
      })

      describe('reveal password', () => {
        it('clicking the reveal password calls "toggleShowPassword"', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            type: 'password',
          })
          const RenderProp = wrapper.find(PreloadImages).prop('render')
          shallow(<RenderProp />).simulate('click', {
            preventDefault: jest.fn(),
          })
          expect(wrapper.state().showPassword).toBe(true)
        })
      })
    })

    describe('suppress validation icon property', () => {
      describe('default behaviour (suppressValidationIcon=false)', () => {
        it('success validation icon displayed', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            field: {
              isTouched: true,
            },
            errors: {},
          })
          expect(wrapper.find('.Input-validateSuccess').exists()).toBe(true)
        })
        it('failure validation icon displayed', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            field: {
              isTouched: true,
            },
            errors: {
              [initialProps.name]: 'Error message',
            },
          })
          expect(wrapper.find('.Input-validateFail').exists()).toBe(true)
        })
      })
      describe('suppressValidationIcon=true', () => {
        it('success validation icon not displayed', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            suppressValidationIcon: true,
            field: {
              isTouched: true,
            },
            errors: {},
          })
          expect(wrapper.find('.Input-validateSuccess').exists()).toBe(false)
        })
        it('failure validation icon not displayed', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            suppressValidationIcon: true,
            field: {
              isTouched: true,
            },
            errors: {
              [initialProps.name]: 'Error message',
            },
          })
          expect(wrapper.find('.Input-validateFail').exists()).toBe(false)
        })
      })
    })

    describe('validation message alignment', () => {
      describe('messagePosition=`default`', () => {
        it('does not add position modifier to class name', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            field: {
              isTouched: true,
            },
            errors: {
              [initialProps.name]: 'Error message',
            },
            messagePosition: 'default',
          })
          expect(wrapper.find('.Input-validationMessage').exists()).toBe(true)
          expect(
            wrapper.find('.Input-validationMessage--default').exists()
          ).toBe(false)
        })
      })
      describe('messagePosition=`bottom`', () => {
        it('adds position modifier to class name', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            field: {
              isTouched: true,
            },
            errors: {
              [initialProps.name]: 'Error message',
            },
            messagePosition: 'bottom',
          })
          expect(wrapper.find('.Input-validationMessage').exists()).toBe(true)
          expect(
            wrapper.find('.Input-validationMessage--bottom').exists()
          ).toBe(true)
        })
      })
    })
  })

  describe('event handlers', () => {
    beforeAll(() => {
      global.process.browser = true
    })

    afterAll(() => {
      global.process.browser = false
    })

    it('it clears up event listeners', () => {
      isIOS.mockReturnValueOnce(true)

      const id = 'test-input'
      const removeEventListener = jest.fn()
      const addEventListener = jest.fn()
      const { wrapper, instance } = renderComponent({
        ...initialProps,
        id,
      })

      const dummyFunction = () => {}
      instance.syncDomValue = dummyFunction

      wrapper
        .find(`#${id}`)
        .getElement()
        .ref({
          addEventListener,
          removeEventListener,
        })

      instance.componentDidMount()

      expect(addEventListener).toHaveBeenCalledWith('change', dummyFunction)

      wrapper.unmount()

      expect(removeEventListener).toHaveBeenCalledWith('change', dummyFunction)
    })
  })
})
