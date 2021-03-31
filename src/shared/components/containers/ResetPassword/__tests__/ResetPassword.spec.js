import testComponentHelper, {
  analyticsDecoratorHelper,
} from '../../../../../../test/unit/helpers/test-component'
import DecoratedResetPassword, { ResetPassword } from '../ResetPassword'
import { browserHistory } from 'react-router'
import Message from '../../../common/FormComponents/Message/Message'
import Form from '../../../common/FormComponents/Form/Form'

jest.mock('react-router', () => ({
  browserHistory: jest.fn(),
}))

jest.mock('../../../../lib/window', () => ({
  changeURL: jest.fn(),
}))

describe('ResetPassword', () => {
  const emptyForm = {
    fields: {
      email: {
        value: '',
        isDirty: false,
        isTouched: false,
        isFocused: false,
      },
      password: {
        value: '',
        isDirty: false,
        isTouched: false,
        isFocused: false,
      },
    },
    isLoading: false,
    errors: {},
    message: {},
  }

  const invalidForm = {
    fields: {
      email: {
        value: 'foobar.com',
        isDirty: true,
        isTouched: true,
        isFocused: false,
      },
      password: {
        value: 'Arcadia',
        isDirty: true,
        isTouched: true,
        isFocused: false,
      },
    },
    message: {
      type: 'error',
      message: 'You have already used that password, try another',
    },
  }

  const validForm = {
    fields: {
      email: {
        value: 'foo@bar.com',
        isDirty: true,
        isTouched: false,
        isFocused: false,
      },
      password: {
        value: 'Arcadia2',
        isDirty: true,
        isTouched: true,
        isFocused: false,
      },
      passwordConfirm: {
        value: 'Arcadia2',
        isDirty: true,
        isTouched: true,
        isFocused: false,
      },
    },
    message: {
      type: 'confirm',
      message: '🎉',
    },
  }

  const initialProps = {
    leavingResetPasswordForm: jest.fn(),
    passwordResetSuccessfully: false,
    isResetPasswordLinkValid: jest.fn(),
    resetForm: jest.fn(),
    resetPasswordForm: emptyForm,
    resetPasswordLinkRequest: jest.fn(),
    resetPasswordRequest: jest.fn(),
    setFormField: jest.fn(),
    setFormMessage: jest.fn(),
    touchedFormField: jest.fn(),
    location: {
      query: {
        // NOTE: WCS returns us back a strangely encoded hash containing
        // a new line character at the end of it. Keep this data below
        // as close to the actual data as possible as we need to test
        // the process where we re-encode the hash and token before sending
        // the request.  The reset password endpoint requires that both
        // these pieces of data be url encoded.
        hash: 'PTDX9O3cs1pqfZabugt1Y4xOjec=↵',
        token: 'foo@bar.com',
      },
    },
  }

  const renderComponent = testComponentHelper(ResetPassword)

  beforeEach(() => {
    browserHistory.push = jest.fn()
    jest.clearAllMocks()
  })

  describe('@decorators', () => {
    analyticsDecoratorHelper(DecoratedResetPassword, 'reset-password', {
      componentName: 'ResetPassword',
      isAsync: false,
      redux: true,
    })
  })

  describe('@render', () => {
    it('default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    it('invalid form', () => {
      expect(
        renderComponent({
          ...initialProps,
          resetPasswordForm: invalidForm,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('valid form', () => {
      expect(
        renderComponent({
          ...initialProps,
          resetPasswordForm: validForm,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('valid link should render ResetPassword form', () => {
      const validLink = renderComponent({
        ...initialProps,
        isResetPasswordLinkValid: true,
      }).getTree()
      expect(validLink.props.className).toEqual(
        'ResetPassword ResetPassword-form'
      )
    })

    it('invalid link should render ExpiredPassword', () => {
      const invalidLink = renderComponent({
        ...initialProps,
        isResetPasswordLinkValid: false,
      }).getTree()
      expect(invalidLink.type).toEqual('Connect(ExpiredPassword)')
    })

    it('invalid email data', () => {
      expect(
        renderComponent({
          ...initialProps,
          location: {
            query: {},
          },
        }).getTree()
      ).toMatchSnapshot()
    })

    describe('when the form is invalid', () => {
      it('should render the `<Message />` component if there is a message and pass the right props', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          resetPasswordForm: invalidForm,
        })
        const form = wrapper.find(Form)
        const message = form.find(Message)

        expect(message).toHaveLength(1)
        expect(message.prop('type')).toBe(invalidForm.message.type)
        expect(message.prop('message')).toBe(invalidForm.message.message)
      })
    })
  })

  describe('@lifecycle', () => {
    let currentInstance
    let currentWrapper

    beforeEach(() => {
      const { wrapper, instance } = renderComponent(initialProps)
      jest.resetAllMocks()
      currentInstance = instance
      currentWrapper = wrapper
    })

    describe('@UNSAFE_componentWillMount', () => {
      it('should call the correct prop methods', () => {
        expect(currentInstance.props.setFormField).not.toHaveBeenCalled()
        currentInstance.UNSAFE_componentWillMount()
        expect(currentInstance.props.setFormField).toHaveBeenCalledTimes(1)
      })

      it('should call the correct prop methods with the correct arguments', () => {
        currentInstance.UNSAFE_componentWillMount()
        expect(currentInstance.props.setFormField).toHaveBeenLastCalledWith(
          'resetPassword',
          'email',
          'foo@bar.com'
        )
      })
      it('should create the correct validation schema for required fields', () => {
        currentInstance.UNSAFE_componentWillMount()
        const validationSchema = currentInstance.validationSchema
        expect(validationSchema.email).toEqual('required')

        const [password, isNotSameAsFn] = validationSchema.password
        expect(password).toEqual('passwordV1')
        expect(typeof isNotSameAsFn).toEqual('function')
      })

      it('should set the emailData state when valid', () => {
        currentInstance.UNSAFE_componentWillMount()
        expect(currentWrapper.state('emailData')).toMatchObject({
          hash: 'PTDX9O3cs1pqfZabugt1Y4xOjec=↵',
          token: 'foo@bar.com',
        })
      })

      it('should set the invalidEmailData flag when the data is invalid', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          location: {
            query: {},
          },
        })
        expect(wrapper.state('emailData')).toBeUndefined()
        expect(wrapper.state('invalidEmailData')).toBe(true)
      })
    })

    describe('@UNSAFE_componentWillReceiveProps', () => {
      describe('when password is successfully reset', () => {
        it('should redirect to "/checkout" if there is an orderId', () => {
          expect(browserHistory).toHaveBeenCalledTimes(0)
          currentInstance.setState({
            emailData: {
              hash: 'PTDX9O3cs1pqfZabugt1Y4xOjec=↵',
              token: 'foo@bar.com',
              orderId: '007',
            },
          })
          currentInstance.UNSAFE_componentWillReceiveProps({
            ...initialProps,
            passwordResetSuccessfully: true,
          })
          expect(browserHistory.push).toHaveBeenCalledWith('/checkout')
        })

        it('should redirect to "/my-account"', () => {
          expect(browserHistory).toHaveBeenCalledTimes(0)
          currentInstance.UNSAFE_componentWillReceiveProps({
            ...initialProps,
            passwordResetSuccessfully: true,
          })
          expect(browserHistory.push).toHaveBeenCalledWith(
            '/my-account?getBasket=false'
          )
        })

        it('should redirect to "/my-account" if the orderId is 0', () => {
          expect(browserHistory).toHaveBeenCalledTimes(0)
          currentInstance.setState({
            emailData: {
              hash: 'PTDX9O3cs1pqfZabugt1Y4xOjec=↵',
              token: 'foo@bar.com',
              orderId: '0',
            },
          })
          currentInstance.UNSAFE_componentWillReceiveProps({
            ...initialProps,
            basketCount: 2,
            passwordResetSuccessfully: true,
          })
          expect(browserHistory.push).toHaveBeenCalledWith(
            '/my-account?getBasket=true'
          )
        })

        it('should redirect to "/my-account" with getBasket param set to true', () => {
          expect(browserHistory).toHaveBeenCalledTimes(0)
          currentInstance.UNSAFE_componentWillReceiveProps({
            ...initialProps,
            basketCount: 2,
            passwordResetSuccessfully: true,
          })
          expect(browserHistory.push).toHaveBeenCalledWith(
            '/my-account?getBasket=true'
          )
        })
      })
    })

    describe('@componentWillUnmount', () => {
      it('should call the methods with the correct data', () => {
        currentInstance.componentWillUnmount()
        expect(
          currentInstance.props.leavingResetPasswordForm
        ).toHaveBeenCalledTimes(1)
        expect(currentInstance.props.setFormMessage).toHaveBeenCalledTimes(1)
        expect(currentInstance.props.setFormMessage).toHaveBeenLastCalledWith(
          'resetPassword',
          {}
        )
        expect(currentInstance.props.resetForm).toHaveBeenCalledTimes(1)
        expect(currentInstance.props.resetForm).toHaveBeenLastCalledWith(
          'resetPassword',
          {
            email: '',
            password: '',
          }
        )
      })
    })
  })

  describe('@events', () => {
    describe('Inputs', () => {
      it('should call setFormField when prop setField is called', () => {
        const event = {
          target: {
            value: 'newPassword',
          },
        }
        const { wrapper, instance } = renderComponent(initialProps)
        wrapper.find('[name="password"]').prop('setField')('foo')(event)
        expect(instance.props.setFormField).toHaveBeenLastCalledWith(
          'resetPassword',
          'foo',
          event.target.value
        )
      })

      it('should call touchedFormField when prop touchedField is called', () => {
        const { wrapper, instance } = renderComponent(initialProps)
        wrapper.find('[name="password"]').prop('touchedField')('foo')()
        expect(instance.props.touchedFormField).toHaveBeenLastCalledWith(
          'resetPassword',
          'foo'
        )
      })
    })

    describe('submit', () => {
      it('calls preventDefault', () => {
        const { wrapper } = renderComponent(initialProps)
        const event = { preventDefault: jest.fn() }
        wrapper.find(Form).simulate('submit', event)
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
        resetPasswordForm: validForm,
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
        currentInstance.onSubmit(evt)
        expect(evt.preventDefault).toHaveBeenCalledTimes(1)
      })

      it('should call resetPasswordRequest', () => {
        expect(
          currentInstance.props.resetPasswordRequest
        ).not.toHaveBeenCalled()
        currentInstance.onSubmit(evt)
        expect(
          currentInstance.props.resetPasswordRequest
        ).toHaveBeenCalledTimes(1)
      })

      it('should call resetPasswordRequest with the correct arguments', () => {
        const expected = {
          email: 'foo@bar.com',
          password: 'Arcadia2',
          passwordConfirm: 'Arcadia2',
          hash: encodeURIComponent('PTDX9O3cs1pqfZabugt1Y4xOjec=↵'),
        }
        currentInstance.onSubmit(evt)
        expect(
          currentInstance.props.resetPasswordRequest
        ).toHaveBeenLastCalledWith(expected)
      })
    })
  })
})
