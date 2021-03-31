import React from 'react'
import { compose } from 'ramda'

import { setAuthentication } from '../../actions/common/authActions'
import withRestrictedActionDispatch, {
  restrictedAction,
  storeActionData,
  isRestrictedActionResponse,
  intendedUserChanged,
} from '../restricted-actions'

import {
  withStore,
  mountRender,
  buildComponentRender,
} from 'test/unit/helpers/test-component'

import buildStore from 'test/unit/build-store'

jest.mock('react-router', () => ({
  browserHistory: {
    replace: jest.fn(),
  },
}))

import { browserHistory } from 'react-router'

function createMounter(Component, mockState = {}) {
  const render = compose(
    mountRender,
    withStore({
      config: {
        brandName: 'XXXXX',
        brandCode: 'XXXXX',
      },
      ...mockState,
    })
  )
  return buildComponentRender(render, Component)
}

const TestComponentAnonymous = () => <div>Hello, World!</div>

function TestComponentFunction() {
  return <div>Hello, World!</div>
}

class TestComponentClass extends React.Component {
  render() {
    return <div>Hello, World!</div>
  }
}

// eslint-disable-next-line
class TestComponentClassDisplayName extends React.Component {
  static displayName = 'TestComponentCustom'

  render() {
    return <div>Hello, World!</div>
  }
}

describe('withRestrictedActionDispatch', () => {
  describe('does not have any visual impact', () => {
    const Component = withRestrictedActionDispatch({})(TestComponentAnonymous)
    const mountComponent = createMounter(Component, {
      routing: {
        location: {
          query: {},
        },
      },
      account: {
        user: {
          email: 'abc@123.com',
        },
      },
    })

    it('matches snapshot', () => {
      expect(mountComponent().getTree()).toMatchSnapshot()
    })

    it('matches output html of plain wrapped component', () => {
      const { wrapper: wrappedWrapper } = mountComponent()

      const mountPlainComponent = createMounter(TestComponentAnonymous)
      const { wrapper: plainWrapper } = mountPlainComponent()

      const wrappedHTML = wrappedWrapper.html()
      const plainHTML = plainWrapper.html()

      expect(wrappedHTML).toBe(plainHTML)
    })

    it('does not alter props passed down to the wrapped component', () => {
      const mockProps = {
        prop1: 1,
        prop2: 2,
        prop3: 3,
      }
      const MockComponent = jest.fn(() => {
        return null
      })

      const Component = withRestrictedActionDispatch({})(MockComponent)
      const mountMock = createMounter(Component, {
        routing: {
          location: {
            query: {},
          },
        },
      })

      mountMock(mockProps)

      expect(MockComponent).toHaveBeenCalledWith(mockProps, expect.anything())
    })
  })

  describe('sets display name to help in dev tools', () => {
    it('for class components', () => {
      const Component = withRestrictedActionDispatch({})(TestComponentClass)
      const expected = `Connect(WithRestrictedActionDispatch(${
        TestComponentClass.name
      }))`

      expect(Component.displayName).toBe(expected)
    })

    it('for class components with custom display names', () => {
      const Component = withRestrictedActionDispatch({})(
        TestComponentClassDisplayName
      )
      const expected = `Connect(WithRestrictedActionDispatch(${
        TestComponentClassDisplayName.displayName
      }))`

      expect(Component.displayName).toBe(expected)
    })

    it('for function components', () => {
      const Component = withRestrictedActionDispatch({})(TestComponentFunction)
      const expected = `Connect(WithRestrictedActionDispatch(${
        TestComponentFunction.name
      }))`

      expect(Component.displayName).toBe(expected)
    })

    it('for anonymous function components', () => {
      const Component = withRestrictedActionDispatch({})(TestComponentAnonymous)
      const expected = `Connect(WithRestrictedActionDispatch(${
        TestComponentAnonymous.name
      }))`

      expect(Component.displayName).toBe(expected)
    })
  })

  describe('Useful behaviour', () => {
    it('keeps a static reference to the wrapped component', () => {
      const Component = withRestrictedActionDispatch({})(TestComponentAnonymous)

      expect(Component.WrappedComponent).toBe(TestComponentAnonymous)
    })
  })

  describe('Usage errors', () => {
    it('throws if mapDispatchToPropsObj is not passed', () => {
      const expectedErrorMessage = "'mapDispatchToPropsObj' object is required"

      expect(() => withRestrictedActionDispatch()).toThrowError(
        expectedErrorMessage
      )
    })

    it('throws if mapDispatchToPropsObj is not an object', () => {
      expect(() => withRestrictedActionDispatch(() => {})).toThrowError()
    })

    it('throws if a component is not passed to wrap', () => {
      const expectedErrorMessage =
        'A Component must be passed in order to wrap behaviour'
      const wrapComponent = withRestrictedActionDispatch({})

      expect(() => wrapComponent()).toThrowError(expectedErrorMessage)
    })
  })

  describe('Returned component', () => {
    describe('scenarios where behavior should not run', () => {
      const Component = withRestrictedActionDispatch({})(TestComponentAnonymous)
      const mountComponent = (state) => createMounter(Component, state)()

      it('does not run behaviour if there is no action data', () => {
        storeActionData(null)
        const { wrapper } = mountComponent()

        const instance = wrapper.instance().getWrappedInstance()
        const spy = jest.spyOn(instance, 'dispatchAction')

        instance.componentDidMount()

        expect(spy).not.toHaveBeenCalled()
      })

      it('does not run behaviour if the action is not available in props', () => {
        storeActionData({
          actionName: 'test',
          userEmail: 'test@testing.com',
          redirectUrl: '/',
          args: [],
        })

        const { wrapper } = mountComponent()

        const instance = wrapper.instance().getWrappedInstance()
        const spy = jest.spyOn(instance, 'dispatchAction')

        instance.componentDidMount()

        expect(spy).not.toHaveBeenCalled()
      })
    })

    describe('in scenarios where behavior should run', () => {
      const mockAction = jest.fn(() => ({
        type: 'IGNORE',
      }))

      const mapDispatchToPropsObj = {
        testAction: mockAction,
      }

      function createComponent() {
        return withRestrictedActionDispatch(mapDispatchToPropsObj)(
          TestComponentAnonymous
        )
      }

      beforeEach(() => {
        mockAction.mockClear()
      })

      it('should call action with derived params array', () => {
        const Component = createComponent()
        const mountComponent = (state) => createMounter(Component, state)()
        const actionName = 'testAction'

        const userEmail = 'abc@123.com'
        const args = [1, 2, 3]

        storeActionData({
          actionName,
          args,
          redirectUrl: '/',
          userEmail,
        })

        mountComponent({
          account: {
            user: {
              email: userEmail,
            },
          },
        })

        expect(mockAction).toHaveBeenCalledTimes(1)
        expect(mockAction).toHaveBeenCalledWith(...args)
      })
    })
  })
})

describe('restrictedAction', () => {
  function getMockStore(pathname) {
    return buildStore({
      auth: {
        authentication: 'full',
      },
      account: {
        user: {
          email: 'test@testing.com',
        },
      },
      routing: {
        location: {
          pathname: pathname || '/',
        },
        visited: ['/my-account'],
      },
    })
  }

  const mockAction = jest.fn(() => () => {})

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns a new function', () => {
    const action = restrictedAction(mockAction, 'test')

    expect(typeof action).toBe('function')
  })

  it('passes on arguments to the original action', () => {
    const testArgs = [1, 2]
    const store = getMockStore()
    const action = restrictedAction(mockAction, 'test')
    store.dispatch(action(...testArgs))

    expect(mockAction).toHaveBeenCalledWith(...testArgs)
  })

  it('does not redirect for non-restricted paths', () => {
    const isBrowser = process.browser
    process.browser = true

    const store = getMockStore(
      '/en/tsuk/product/new-in-this-week-2169932/new-in-fashion-6367514/short-sleeve-boiler-suit-8584611'
    )
    const action = restrictedAction(mockAction, 'test')
    store.dispatch(action())

    expect(browserHistory.replace).not.toHaveBeenCalled()

    process.browser = isBrowser
  })

  it('redirects the user to checkout login if they are already in checkout', async () => {
    const isBrowser = process.browser
    process.browser = true

    mockAction.mockImplementation(() => {
      return (dispatch) => {
        dispatch(setAuthentication('partial'))

        return Promise.resolve()
      }
    })

    const store = getMockStore('/checkout/payment')
    const action = restrictedAction(mockAction, 'test')

    await store.dispatch(action())

    expect(browserHistory.replace).toHaveBeenCalledWith({
      pathname: '/checkout/login',
      search: '?redirectUrl=%2Fcheckout%2Fpayment',
    })

    process.browser = isBrowser
  })

  it('throws an error if redirect is called on the server', async () => {
    const isBrowser = process.browser
    process.browser = false

    mockAction.mockImplementation(() => {
      return (dispatch) => {
        dispatch(setAuthentication('partial'))

        return Promise.resolve()
      }
    })

    const store = getMockStore('/checkout/delivery')
    const action = restrictedAction(mockAction, 'test')

    try {
      await store.dispatch(action())
      global.fail('expected action to throw')
    } catch (error) {
      expect(error.message).toBe(
        'Restricted action redirect may only be called in the browser'
      )
    }

    process.browser = isBrowser
  })

  it('redirects if the action causes a user to become partially authenticated on restricted pages', async () => {
    const isBrowser = process.browser
    process.browser = true

    mockAction.mockImplementation(() => {
      return (dispatch) => {
        dispatch(setAuthentication('partial'))

        return Promise.resolve()
      }
    })

    const store = getMockStore('/my-account')
    const action = restrictedAction(mockAction, 'test')

    await store.dispatch(action())

    expect(browserHistory.replace).toHaveBeenCalled()
    expect(browserHistory.replace).toHaveBeenCalledWith({
      pathname: '/login',
      search: '?redirectUrl=%2Fmy-account',
    })

    process.browser = isBrowser
  })

  it('catches 401 and redirects if the action causes a user to become partially authenticated', async () => {
    const isBrowser = process.browser
    process.browser = true

    mockAction.mockImplementation(() => {
      return (dispatch) => {
        dispatch(setAuthentication('partial'))

        return Promise.reject({
          status: 401,
          response: {
            body: {
              isRestrictedActionResponse: true,
            },
            status: 401,
          },
        })
      }
    })

    const store = getMockStore('/my-account')
    const action = restrictedAction(mockAction, 'test')

    try {
      await store.dispatch(action())
    } catch (error) {
      global.fail('Expected thunk not to throw.')
    }

    expect(browserHistory.replace).toHaveBeenCalled()
    expect(browserHistory.replace).toHaveBeenCalledWith({
      pathname: '/login',
      search: '?redirectUrl=%2Fmy-account',
    })

    process.browser = isBrowser
  })
})

describe('isRestrictedActionResponse', () => {
  it('returns true if response is restricted action', () => {
    const resp = { status: 401, body: { isRestrictedActionResponse: true } }
    expect(isRestrictedActionResponse(resp)).toBe(true)
  })

  it('returns false if response is not restricted action', () => {
    const resp = { status: 401 }
    expect(isRestrictedActionResponse(resp)).toBe(false)
  })
})

describe('intendedUserChanged', () => {
  it('should return null if there is currently no actionData', () => {
    storeActionData(null)

    const result = intendedUserChanged()

    expect(result).toBe(null)
  })

  it('should return a function if there is actionData', () => {
    storeActionData({
      userEmail: 'test@example.com',
    })

    const result = intendedUserChanged()

    expect(typeof result).toBe('function')
  })

  it('should return a function which returns true if the passed email does not match the original user email', () => {
    const userEmail = 'test@example.com'

    storeActionData({
      userEmail,
    })

    const didChange = intendedUserChanged()
    const result = didChange(userEmail)

    expect(result).toBe(false)
  })

  it('should return a function which returns false if the passed email matches the original user email', () => {
    const userEmail = 'test@example.com'

    storeActionData({
      userEmail,
    })

    const didChange = intendedUserChanged()
    const result = didChange('test@notthesame.com')

    expect(result).toBe(true)
  })
})
