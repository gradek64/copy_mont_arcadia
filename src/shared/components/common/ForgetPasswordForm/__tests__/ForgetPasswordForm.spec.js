import renderComponentHelper from 'test/unit/helpers/test-component'
import ForgetPasswordForm from '../ForgetPasswordForm'

const renderComponent = renderComponentHelper(
  ForgetPasswordForm.WrappedComponent
)

describe('<ForgetPasswordForm />', () => {
  const props = {
    className: 'ForgetPassword-form',
    forgetPwdRequest: jest.fn(),
    forgetPasswordForm: {
      fields: {
        email: {
          value: 'foo@bar.com',
        },
      },
      errors: {},
      message: {},
    },
    isFeatureDesktopResetPasswordEnabled: false,
    resetForm: jest.fn(),
    resetPasswordLinkRequest: jest.fn(),
    setForgetPassword: jest.fn(),
    setFormField: jest.fn(),
    setFormMessage: jest.fn(),
    touchedFormField: jest.fn(),
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('@render', () => {
    it('renders', () => {
      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })
  })

  describe('@lifecycle', () => {
    describe('componentWillUnmount', () => {
      it('calls the appropriate actions to reset the state', () => {
        const { wrapper } = renderComponent(props)
        wrapper.unmount()
        expect(props.setForgetPassword).toHaveBeenCalledTimes(1)
        expect(props.setForgetPassword).toHaveBeenLastCalledWith(false)
        expect(props.setFormMessage).toHaveBeenCalledTimes(1)
        expect(props.setFormMessage).toHaveBeenLastCalledWith(
          'forgetPassword',
          {}
        )
        expect(props.resetForm).toHaveBeenCalledTimes(1)
        expect(props.resetForm).toHaveBeenLastCalledWith('forgetPassword', {
          email: '',
        })
      })
    })
  })

  describe('@events', () => {
    describe('@submit', () => {
      const event = { preventDefault: jest.fn() }

      it('prevents the event default', () => {
        const { wrapper } = renderComponent(props)
        wrapper
          .find('.ForgetPassword-form')
          .first()
          .simulate('submit', event)
        expect(event.preventDefault).toHaveBeenCalledTimes(1)
      })

      it('calls the "forgetPwdRequest"', () => {
        const { wrapper } = renderComponent(props)
        wrapper
          .find('.ForgetPassword-form')
          .first()
          .simulate('submit', event)
        expect(props.forgetPwdRequest).toHaveBeenCalledTimes(1)
        expect(props.forgetPwdRequest).toHaveBeenLastCalledWith({
          email: 'foo@bar.com',
        })
      })

      it('calls the "resetPasswordLinkRequest" when the "isFeatureDesktopResetPasswordEnabled" feature is active', () => {
        const { wrapper } = renderComponent({
          ...props,
          isFeatureDesktopResetPasswordEnabled: true,
        })
        wrapper
          .find('.ForgetPassword-form')
          .first()
          .simulate('submit', event)
        expect(props.resetPasswordLinkRequest).toHaveBeenCalledTimes(1)
        expect(props.resetPasswordLinkRequest).toHaveBeenLastCalledWith({
          email: 'foo@bar.com',
        })
      })

      it('passes orderId if it its passed in as a prop', () => {
        const { wrapper } = renderComponent({
          ...props,
          orderId: 12345,
          isFeatureDesktopResetPasswordEnabled: true,
        })
        wrapper
          .find('.ForgetPassword-form')
          .first()
          .simulate('submit', event)
        expect(props.resetPasswordLinkRequest).toHaveBeenCalledTimes(1)
        expect(props.resetPasswordLinkRequest).toHaveBeenLastCalledWith({
          email: 'foo@bar.com',
          orderId: 12345,
          pageTitle: 'ShoppingBag',
        })
      })

      it('should not scroll into view if enableScrollToMessage is false', async () => {
        const { instance } = renderComponent({
          ...props,
          orderId: 12345,
          isFeatureDesktopResetPasswordEnabled: false,
          enableScrollToMessage: false,
        })

        instance.formRef = {
          current: {
            getBoundingClientRect: jest.fn(),
            scrollIntoView: jest.fn(),
          },
        }

        await instance.submitHandler(event)

        expect(
          instance.formRef.current.getBoundingClientRect
        ).not.toHaveBeenCalled()
        expect(instance.formRef.current.scrollIntoView).not.toHaveBeenCalled()
      })

      it('should scroll into view if enableScrollToMessage is true', async () => {
        const { instance } = renderComponent({
          ...props,
          orderId: 12345,
          isFeatureDesktopResetPasswordEnabled: false,
          enableScrollToMessage: true,
        })

        window.innerHeight = 1

        instance.formRef = {
          current: {
            getBoundingClientRect: jest.fn(() => ({ y: 1, height: 1 })),
            scrollIntoView: jest.fn(),
          },
        }

        await instance.submitHandler(event)

        expect(
          instance.formRef.current.getBoundingClientRect
        ).toHaveBeenCalled()
        expect(instance.formRef.current.scrollIntoView).toHaveBeenCalled()
      })
    })
  })
})
