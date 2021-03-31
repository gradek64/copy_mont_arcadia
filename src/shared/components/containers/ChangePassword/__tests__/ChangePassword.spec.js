import testComponentHelper, {
  analyticsDecoratorHelper,
} from 'test/unit/helpers/test-component'
import generateMockFormProps from 'test/unit/helpers/form-props-helper'
import * as validators from '../../../../lib/validator/validators'

jest.mock('react-router', () => ({
  browserHistory: jest.fn(),
}))

import ChangePassword from '../ChangePassword'
import { browserHistory } from 'react-router'

describe('ChangePassword', () => {
  const hasErrors = {
    oldPassword: 'A password is required.',
    newPassword: 'Please enter a password of at least 6 characters',
    // newPasswordConfirm: 'A password is required.',
  }

  const submitErrorNotChanged = {
    type: 'error',
    message: 'Password needs to be changed',
  }

  const submitCorrect = {
    type: 'confirm',
    message: 'Your password has been successfully changed.',
  }

  const correctFields = {
    email: {
      value: 'jiveturkey@jive.com',
      isDirty: true,
      isTouched: false,
      isFocused: false,
    },
    oldPassword: {
      value: 'Arcadia1',
      isDirty: true,
      isTouched: true,
      isFocused: false,
    },
    newPassword: {
      value: 'Arcadia2',
      isDirty: true,
      isTouched: true,
      isFocused: false,
    },
  }

  const initialProps = {
    setFormMessage: jest.fn(),
    setFormField: jest.fn(),
    touchedFormField: jest.fn(),
    changePwdRequest: jest.fn(),
    changePasswordSuccess: jest.fn(),
    resetForm: jest.fn(),
    email: 'emailMcEmailFace@mcface.com',
    changePassword: {
      fields: {
        email: {
          value: '',
          isDirty: false,
          isTouched: false,
          isFocused: false,
        },
        oldPassword: {
          value: '',
          isDirty: false,
          isTouched: false,
          isFocused: false,
        },
        newPassword: {
          value: '',
          isDirty: false,
          isTouched: false,
          isFocused: false,
        },
      },
      isLoading: false,
      errors: {},
      message: {},
    },
    success: false,
    resetPassword: false,
    postResetURL: undefined,
  }

  const renderComponent = testComponentHelper(
    ChangePassword.WrappedComponent.WrappedComponent
  )

  beforeEach(() => {
    browserHistory.push = jest.fn()
    jest.resetAllMocks()
  })

  describe('@decorators', () => {
    analyticsDecoratorHelper(ChangePassword, 'change-password', {
      componentName: 'ChangePassword',
      isAsync: false,
      redux: true,
    })
  })

  describe('@render', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('should have no AccountHeader component if resetPassword is true', () => {
      expect(
        renderComponent({ ...initialProps, resetPassword: true }).getTree()
      ).toMatchSnapshot()
    })

    it('has errors', () => {
      const newChangePassword = generateMockFormProps(
        initialProps.changePassword,
        { errors: hasErrors }
      )

      expect(
        renderComponent({ ...initialProps, newChangePassword }).getTree()
      ).toMatchSnapshot()
    })

    it('has correct fields', () => {
      expect(
        renderComponent({
          ...initialProps,
          changePassword: { fields: correctFields },
        }).getTree()
      ).toMatchSnapshot()
    })

    it('has success', () => {
      expect(
        renderComponent({ ...initialProps, success: true }).getTree()
      ).toMatchSnapshot()
    })

    it('has success but result constains an error', () => {
      expect(
        renderComponent({
          ...initialProps,
          success: false,
          changePassword: {
            fields: correctFields,
            message: submitErrorNotChanged,
          },
        }).getTree()
      ).toMatchSnapshot()
    })

    it('successfully submitted', () => {
      expect(
        renderComponent({
          ...initialProps,
          success: true,
          changePassword: {
            fields: correctFields,
            message: submitCorrect,
          },
        }).getTree()
      ).toMatchSnapshot()
    })

    it('has BackToAccountLink with Continue to checkout text', () => {
      expect(
        renderComponent({
          ...initialProps,
          success: true,
          resetPassword: true,
          postResetURL: '/checkout',
          changePassword: {
            fields: correctFields,
            message: submitCorrect,
          },
        }).getTree()
      ).toMatchSnapshot()
    })
  })

  describe('@lifecycle', () => {
    let currentInstance

    beforeEach(() => {
      const { instance } = renderComponent(initialProps)
      jest.resetAllMocks()
      currentInstance = instance
    })

    describe('@componentDidMount', () => {
      it('should call the correct prop methods', () => {
        expect(currentInstance.props.setFormField).not.toHaveBeenCalled()

        currentInstance.componentDidMount()
        expect(currentInstance.props.setFormField).toHaveBeenCalledTimes(1)
      })

      it('should call the correct prop methods with the correct arguments', () => {
        currentInstance.componentDidMount()
        expect(currentInstance.props.setFormField).toHaveBeenLastCalledWith(
          'changePassword',
          'email',
          'emailMcEmailFace@mcface.com'
        )
      })

      it('should create the correct validation schema for required fields', () => {
        currentInstance.componentDidMount()
        const validationSchema = currentInstance.validationSchema
        expect(validationSchema.email).toEqual('email')
        expect(validationSchema.oldPassword).toEqual('password')

        const [
          newPassword,
          isNotSameAsFn1,
          isNotSameAsFn2,
        ] = validationSchema.newPassword

        expect(newPassword).toEqual('passwordV1')
        expect(typeof isNotSameAsFn1).toEqual('function')
        expect(typeof isNotSameAsFn2).toEqual('function')
      })

      it('should call validators', () => {
        const isSameAsSpy = jest.spyOn(validators, 'isSameAs')
        const isNotSameAsSpy = jest.spyOn(validators, 'isNotSameAs')

        expect(isSameAsSpy).not.toHaveBeenCalled()
        expect(isNotSameAsSpy).not.toHaveBeenCalled()

        currentInstance.componentDidMount()
        expect(isNotSameAsSpy).toHaveBeenCalledTimes(2)
      })
    })

    describe('@componentWillUnmount', () => {
      it('should call the correct methods', () => {
        const resetFormSpy = jest.fn()
        currentInstance.resetForm = resetFormSpy

        expect(resetFormSpy).not.toHaveBeenCalled()
        expect(
          currentInstance.props.changePasswordSuccess
        ).not.toHaveBeenCalled()
        expect(currentInstance.props.setFormMessage).not.toHaveBeenCalled()

        currentInstance.componentWillUnmount()
        expect(resetFormSpy).toHaveBeenCalledTimes(1)
        expect(
          currentInstance.props.changePasswordSuccess
        ).toHaveBeenCalledTimes(1)
        expect(currentInstance.props.setFormMessage).toHaveBeenCalledTimes(1)
      })

      it('should call the methods with the correct data', () => {
        currentInstance.componentWillUnmount()
        expect(
          currentInstance.props.changePasswordSuccess
        ).toHaveBeenLastCalledWith(false)
        expect(currentInstance.props.setFormMessage).toHaveBeenLastCalledWith(
          'changePassword',
          {}
        )
      })
    })

    describe('@componentDidUpdate', () => {
      const setFocus = jest.fn()

      it('should NOT call oldPassword set focus if is success is still false', () => {
        const { instance } = renderComponent({
          ...initialProps,
          success: false,
        })
        expect(setFocus).not.toHaveBeenCalled()
        instance.oldPassword = {
          setFocus,
        }
        instance.componentDidUpdate({
          success: false,
        })
        expect(setFocus).not.toHaveBeenCalled()
      })

      it('should call oldPassword set focus if is success is true', () => {
        const { instance } = renderComponent({
          ...initialProps,
          success: false,
        })
        expect(setFocus).not.toHaveBeenCalled()
        instance.oldPassword = {
          setFocus,
        }
        instance.componentDidUpdate({
          success: true,
        })
        expect(setFocus).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('@events', () => {
    describe('Inputs', () => {
      it('should call setFormField when prop setField is called', () => {
        const event = {
          target: {
            value: 'olPassword',
          },
        }
        const { wrapper, instance } = renderComponent(initialProps)
        expect(instance.props.setFormField).not.toHaveBeenCalled()
        const connectedInput = wrapper.find('Connect(Input)')
        connectedInput.find('[name="oldPassword"]').prop('setField')(
          'firstName'
        )(event)
        expect(instance.props.setFormField).toHaveBeenCalledTimes(1)
        expect(instance.props.setFormField).toHaveBeenLastCalledWith(
          'changePassword',
          'firstName',
          event.target.value
        )
      })

      it('should call touchedFormField when prop touchedField is called', () => {
        const { wrapper, instance } = renderComponent(initialProps)
        expect(instance.props.touchedFormField).not.toHaveBeenCalled()
        const connectedInput = wrapper.find('Connect(Input)')
        connectedInput.find('[name="oldPassword"]').prop('touchedField')(
          'firstName'
        )()
        expect(instance.props.touchedFormField).toHaveBeenCalledTimes(1)
        expect(instance.props.touchedFormField).toHaveBeenLastCalledWith(
          'changePassword',
          'firstName'
        )
      })
    })

    describe('submit', () => {
      it('calls preventDefault', () => {
        const { wrapper } = renderComponent(initialProps)
        const event = {
          preventDefault: jest.fn(),
        }

        expect(event.preventDefault).toHaveBeenCalledTimes(0)
        wrapper.find('Form').simulate('submit', event)
        expect(event.preventDefault).toHaveBeenCalledTimes(1)
      })
    })

    describe('BackToAccountLink', () => {
      it('calls preventDefault', () => {
        const { wrapper } = renderComponent({ ...initialProps, success: true })
        const event = {
          preventDefault: jest.fn(),
        }

        expect(event.preventDefault).toHaveBeenCalledTimes(0)
        wrapper.find('BackToAccountLink').prop('clickHandler')(event)
        expect(event.preventDefault).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('@instance methods', () => {
    let currentInstance

    beforeEach(() => {
      const { instance } = renderComponent({
        ...initialProps,
        success: true,
        changePassword: {
          fields: correctFields,
          message: submitCorrect,
        },
      })
      jest.resetAllMocks()
      currentInstance = instance
    })

    describe('@onSubmit', () => {
      let evt

      beforeEach(() => {
        evt = {
          preventDefault: jest.fn(),
        }
      })

      it('should call preventDefault', () => {
        expect(evt.preventDefault).not.toHaveBeenCalled()
        currentInstance.onSubmit(evt)
        expect(evt.preventDefault).toHaveBeenCalledTimes(1)
      })

      it('should call changePwdRequest', () => {
        expect(currentInstance.props.changePwdRequest).not.toHaveBeenCalled()
        currentInstance.onSubmit(evt)
        expect(currentInstance.props.changePwdRequest).toHaveBeenCalledTimes(1)
      })

      it('should call changePwdRequest with the correct arguments', () => {
        const expected = {
          emailAddress: 'emailMcEmailFace@mcface.com',
          oldPassword: 'Arcadia1',
          newPassword: 'Arcadia2',
          newPasswordConfirm: 'Arcadia2',
        }
        const resetPasswordValue = currentInstance.props.resetPassword

        currentInstance.onSubmit(evt)
        expect(currentInstance.props.changePwdRequest).toHaveBeenLastCalledWith(
          expected,
          resetPasswordValue
        )
      })
    })

    describe('@resetForm ', () => {
      it('should call prop resetForm', () => {
        expect(currentInstance.props.resetForm).not.toHaveBeenCalled()
        currentInstance.resetForm()
        expect(currentInstance.props.resetForm).toHaveBeenCalledTimes(1)
      })

      it('should call prop resetForm with the correct arguments', () => {
        const expected = {
          email: currentInstance.props.email,
          oldPassword: '',
          newPassword: '',
        }

        currentInstance.resetForm()
        expect(currentInstance.props.resetForm).toHaveBeenLastCalledWith(
          'changePassword',
          expected
        )
      })
    })

    describe('@changePasswordAgain', () => {
      beforeEach(() => {
        currentInstance.resetForm = jest.fn()
      })

      it('should call the correct methods', () => {
        expect(currentInstance.resetForm).not.toHaveBeenCalled()
        expect(currentInstance.props.setFormMessage).not.toHaveBeenCalled()
        expect(
          currentInstance.props.changePasswordSuccess
        ).not.toHaveBeenCalled()

        currentInstance.changePasswordAgain()

        expect(currentInstance.resetForm).toHaveBeenCalledTimes(1)
        expect(currentInstance.props.setFormMessage).toHaveBeenCalledTimes(1)
        expect(
          currentInstance.props.changePasswordSuccess
        ).toHaveBeenCalledTimes(1)
      })

      it('should call methods with the correct arguments', () => {
        currentInstance.changePasswordAgain()
        expect(currentInstance.props.setFormMessage).toHaveBeenLastCalledWith(
          'changePassword',
          {}
        )
        expect(
          currentInstance.props.changePasswordSuccess
        ).toHaveBeenLastCalledWith(false)
      })
    })

    describe('@backToAccount', () => {
      const event = {
        preventDefault: jest.fn(),
      }

      it('should call browserHistory', () => {
        expect(
          currentInstance.props.changePasswordSuccess
        ).not.toHaveBeenCalled()
        currentInstance.backToAccount(event)
        expect(
          currentInstance.props.changePasswordSuccess
        ).toHaveBeenCalledTimes(1)
        expect(browserHistory.push).toHaveBeenCalledTimes(1)
      })

      it('should call browserHistory.push with correct arguments', () => {
        currentInstance.backToAccount(event)
        expect(browserHistory.push).toHaveBeenLastCalledWith('/my-account')
      })

      it('should call browserHistory.push with postResetUrl value if it exists', () => {
        const { instance } = renderComponent({
          ...initialProps,
          success: true,
          postResetURL: '/urlMcUrlFace',
          resetPassword: true,
          changePassword: {
            fields: correctFields,
            message: submitCorrect,
          },
        })

        instance.backToAccount(event)
        expect(browserHistory.push).toHaveBeenLastCalledWith('/urlMcUrlFace')
      })

      it('should call changePasswordSuccess with the correct arguments', () => {
        currentInstance.backToAccount(event)
        expect(
          currentInstance.props.changePasswordSuccess
        ).toHaveBeenLastCalledWith(false)
      })
    })
  })
})
