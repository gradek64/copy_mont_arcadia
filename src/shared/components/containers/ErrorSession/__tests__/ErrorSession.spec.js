import testComponentHelper from 'test/unit/helpers/test-component'

import ErrorSession from '../ErrorSession'
import Button from '../../../common/Button/Button'

const noop = () => {}

describe('<ErrorSession />', () => {
  const requiredProps = {
    sessionReset: noop,
    closeModal: noop,
    removeItem: noop,
  }
  const renderComponent = testComponentHelper(ErrorSession.WrappedComponent)

  describe('@renders', () => {
    it('should be empty in default state', () => {
      const { wrapper } = renderComponent(requiredProps)
      expect(wrapper.isEmptyRender()).toBe(true)
    })

    it('should render if `error.sessionExpired` prop is `true`', () => {
      const { getTree } = renderComponent({
        ...requiredProps,
        error: {
          sessionExpired: true,
        },
      })
      expect(getTree()).toMatchSnapshot()
    })

    it('should display ‘Login’ text in <Button /> if `isMyaccount` prop is `true`', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        error: {
          sessionExpired: true,
        },
        isMyaccount: true,
      })
      expect(
        wrapper
          .find(Button)
          .children()
          .text()
      ).toBe('Login')
    })

    it('should add `className` if supplied', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        error: {
          sessionExpired: true,
        },
        className: 'MyClass',
      })
      expect(wrapper.find('.ErrorSession').hasClass('MyClass')).toBe(true)
    })
  })

  describe('@events', () => {
    describe('On <Button /> click', () => {
      it('should redirect to `/`', () => {
        const redirectToMock = jest.fn()
        const { wrapper } = renderComponent({
          ...requiredProps,
          error: {
            sessionExpired: true,
          },
          redirectTo: redirectToMock,
        })
        wrapper.find(Button).prop('clickHandler')()
        expect(redirectToMock).toHaveBeenCalledWith('/')
      })

      it('should redirect to `/login` if `isMyaccount` is `true`', () => {
        const redirectToMock = jest.fn()
        const { wrapper } = renderComponent({
          ...requiredProps,
          error: {
            sessionExpired: true,
          },
          isMyaccount: true,
          redirectTo: redirectToMock,
        })
        wrapper.find(Button).prop('clickHandler')()
        expect(redirectToMock).toHaveBeenCalledWith('/login')
      })

      it('should call `sessionReset`', () => {
        const sessionResetMock = jest.fn()
        const { wrapper } = renderComponent({
          ...requiredProps,
          error: {
            sessionExpired: true,
          },
          sessionReset: sessionResetMock,
          redirectTo: () => {},
        })
        wrapper.find(Button).prop('clickHandler')()
        expect(sessionResetMock).toHaveBeenCalled()
      })

      it('should call `closeModal`', () => {
        const closeModalMock = jest.fn()
        const { wrapper } = renderComponent({
          ...requiredProps,
          error: {
            sessionExpired: true,
          },
          closeModal: closeModalMock,
          redirectTo: () => {},
        })
        wrapper.find(Button).prop('clickHandler')()
        expect(closeModalMock).toHaveBeenCalled()
      })

      it('should call `removeItem`', () => {
        const removeItemMock = jest.fn()
        const { wrapper } = renderComponent({
          ...requiredProps,
          error: {
            sessionExpired: true,
          },
          removeItem: removeItemMock,
          redirectTo: () => {},
        })
        wrapper.find(Button).prop('clickHandler')()
        expect(removeItemMock).toHaveBeenCalled()
      })
    })
  })
})
