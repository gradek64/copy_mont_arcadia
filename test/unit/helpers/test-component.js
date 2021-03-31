import React from 'react'
import PropTypes from 'prop-types'
import { shallow, mount as enzymeMount } from 'enzyme'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import toJson from 'enzyme-to-json'
import { forAnalyticsDecorator as createMockStoreForAnalytics } from './mock-store'
import { mockStoreCreator } from './get-redux-mock-store'
import { mergeDeepRight } from 'ramda'

export const mockLocalise = (value, ...expressions) => {
  let index = 0
  return []
    .concat(value)
    .join(expressions.length ? '${}' : '')
    .replace(/\${}/g, () => expressions[index++])
}

const mockPrice = (value, asObject) => {
  if (asObject) {
    return {
      symbol: '£',
      value: parseFloat(value).toFixed(2),
      position: 'before',
    }
  }
  return `£${parseFloat(value).toFixed(2)}`
}

const simulateEventHelper = (component) => ({
  eventName,
  eventType,
  targets = [],
  getEvent = jest.fn(),
  afterAllEvents = jest.fn(),
}) => {
  targets.forEach(
    ({ selector, beforeEvent = jest.fn(), afterEvent = jest.fn() }) => {
      component.instance.componentDidMount()
      beforeEvent(component)

      const event = getEvent(eventType)

      if (eventType === 'element' && selector) {
        component.wrapper.find(selector).simulate(eventName, event)
      }
      if (eventType === 'document') {
        const [
          ,
          eventHandler,
        ] = global.document.addEventListener.mock.calls.find(
          ([listenerName]) => listenerName === eventName
        )

        eventHandler(event)
      }

      afterEvent(component)
    }
  )

  afterAllEvents(component)
}

const renderComponentHelper = (
  Component,
  mountOptions = {},
  { mockBrowserEventListening = true } = {}
) => {
  if (mockBrowserEventListening) {
    beforeAll(() => {
      global.document.addEventListener = jest.fn(
        global.document.addEventListener.bind(global.document)
      )

      global.document.removeEventListener = jest.fn(
        global.document.removeEventListener.bind(global.document)
      )
    })

    afterEach(() => {
      global.document.addEventListener.mockClear()
      global.document.removeEventListener.mockClear()
    })
  }

  return ({ children, ...props } = {}) => {
    const mountCommonContext = {
      context: {
        // mock localise lib
        l: jest.fn(mockLocalise),
        // mock price lib
        p: jest.fn(mockPrice),
      },
    }

    const wrapper = shallow(<Component {...props}>{children}</Component>, {
      ...mountCommonContext,
      ...mountOptions,
    })

    const component = {
      wrapper,
      instance: wrapper.instance(),
      getTree: () => toJson(wrapper),
      getTreeFor: (selectedWrapper) => toJson(selectedWrapper),
    }

    return {
      ...component,
      simulateEvent: simulateEventHelper(component),
    }
  }
}

const until = (shallowWrapper, selector, { context = {} } = {}) => {
  if (shallowWrapper.is(selector)) return shallowWrapper.shallow({ context })

  if (
    shallowWrapper.isEmptyRender() ||
    typeof shallowWrapper.getElement().type === 'string'
  )
    return

  return until(shallowWrapper.first().shallow({ context }), selector, {
    context,
  })
}

const renderConnectedComponentProps = (
  ConnectedComponent,
  state = {},
  props = {}
) => {
  const store = createStore((state) => state, state)
  const context = { l: mockLocalise, store }
  const wrapper = shallow(
    <Provider store={store}>
      {/*
        NOTE: The store also needs to be passed in here when
        shallow mounting due to a bug in enzyme
        */}
      <ConnectedComponent store={store} {...props} />
    </Provider>,
    { context }
  )

  // We have to copy over props first otherwise we wont be allowed to delete
  // the `store` prop
  const p = Object.assign({}, wrapper.dive().props())

  // As the store prop is only added because of needed to explicitly pass the store
  // to the component for enzyme to work properly, lets remove it
  delete p.store

  return p
}

/**
 * Builds a custom react renderer
 *
 * E.g.
 * const renderComponent = buildComponentRender(shallowRender, MyFavouriteComponent)
 * const { wrapper } = renderComponent(props)
 * expect(wrapper.find('div').text()).toEqual('Hello World!')
 *
 * `render` functions can be composed together to customise their behaviour.
 *
 * @param {Function} render A custom rendering behaviour
 * @param {Component} Component A react component
 * @return {Function} A function that takes `props` or and object of props and state and renders `Component`
 */
export const buildComponentRender = (render, Component) => (params = {}) => {
  const props = params.props || params

  const context = {
    l: jest.fn(mockLocalise),
    p: jest.fn(mockPrice),
  }
  let renderOpts = {
    Component,
    params,
    props,
    mountOptions: {
      context,
      childContextTypes: {
        l: PropTypes.func,
        p: PropTypes.func,
      },
    },
    return: {
      context,
    },
  }

  renderOpts = render(renderOpts)

  return renderOpts.return
}

/**
 * Shallow render function for use with `buildComponentRender`
 *
 * @param  {Object} renderOpts
 * @return {Object} renderOpts
 */
export const shallowRender = (renderOpts) => {
  const { Component, mountOptions, props } = renderOpts
  const wrapper = shallow(<Component {...props} />, mountOptions)

  return {
    ...renderOpts,
    return: {
      ...renderOpts.return,
      wrapper,
      instance: wrapper.instance(),
      getTree: () => toJson(wrapper),
      getTreeFor: (selectedWrapper) => toJson(selectedWrapper),
    },
  }
}

/**
 * Mount render function for use with `buildComponentRender`
 *
 * @param  {Object} renderOpts
 * @return {Object} renderOpts
 */
export const mountRender = (renderOpts) => {
  const { Component, mountOptions, props } = renderOpts
  const wrapper = enzymeMount(<Component {...props} />, mountOptions)

  return {
    ...renderOpts,
    return: {
      ...renderOpts.return,
      wrapper,
      instance: wrapper.instance(),
      getTree: () => toJson(wrapper),
      getTreeFor: (selectedWrapper) => toJson(selectedWrapper),
    },
  }
}

/**
 * Store render function for use with `buildComponentRender`
 * Provides a mock store (uses redux-mock-store) to the Component being rendered
 *
 * @param  {Object} renderOpts
 * @return {Object} renderOpts
 */
export const withStore = (initialState = {}) => (renderOpts = {}) => {
  const newState = renderOpts.params.state || {}
  const state = mergeDeepRight(initialState, newState)
  const store = mockStoreCreator(state)

  return {
    ...renderOpts,
    mountOptions: {
      ...renderOpts.mountOptions,
      context: {
        ...(renderOpts.mountOptions.context || {}),
        store,
      },
      childContextTypes: {
        ...(renderOpts.mountOptions.childContextTypes || {}),
        store: PropTypes.object,
      },
    },
    return: {
      ...renderOpts.return,
      store,
    },
  }
}

export const mount = (element, mountOpts = { store: undefined }) => {
  return enzymeMount(
    element,
    mergeDeepRight(
      {
        context: {
          store: mountOpts.store,
          l: (x) => x,
          addListener: () => {},
        },
        childContextTypes: {
          store: () => {},
          l: (x) => x,
          addListener: () => {},
        },
      },
      mountOpts
    )
  )
}

/**
 * Test Helper for the Analytics decorators
 * @param {function} Component - The tested component.
 * @param {string} pageType - The name of the page.
 * @param {Object} options - The options object.
 * @param {boolean} options.isAsync - Set true if the component loads async. Default: false
 * @param {boolean} options.isModal - Set true if the component is a modal window. Default: false
 * @param {boolean} options.sendAdobe - Set false to disable Adobe Analytics for the particular page. Default: true
 * @param {boolean} options.redux - Set true if the component wrapped by a Redux Connect. Default: undefined
 * @param {string} options.name - The name of the component. Required with options.redux = true. Default: undefined
 * @param {object} options.props - Props to pass into the component. Default: {}
 * @param {object} options.expectedProps - Expected props to test on the decorator component. Default: {}
 */
const analyticsDecoratorHelper = (
  Component,
  pageType,
  { isAsync = false, componentName, redux, expectedProps = {}, props = {} }
) => {
  if (redux && !componentName) {
    throw new Error(
      'You need to pass the componentName in the options object if the testing component wrapped by Redux Connect'
    )
  }
  const mockStore = createMockStoreForAnalytics({
    preloadedState: {
      viewport: {},
      account: {
        user: {},
      },
      config: {
        region: 'uk',
      },
      shoppingBag: {},
    },
  })

  const shallowOptions = {
    context: {
      store: mockStore,
    },
  }

  const myComponent = shallow(<Component {...props} />, shallowOptions)

  it('should be wrapped in an AnalyticsDecorator component', () => {
    expect(Component.displayName).toMatch(/AnalyticsDecorator/)
    const analyticsDecorator = until(
      myComponent,
      'AnalyticsDecorator',
      shallowOptions
    )
    expect(analyticsDecorator.instance().pageType).toBe(pageType)
    expect(analyticsDecorator.instance().isAsync).toBe(isAsync)
    Object.entries(expectedProps, ([prop, expectedValue]) => {
      expect(analyticsDecorator.instance().props[prop]).toBe(expectedValue)
    })
  })

  if (redux) {
    it('should be wrapped in a Connect component', () => {
      expect(Component.WrappedComponent.displayName).toBe(
        `Connect(${componentName})`
      )
    })
  }
}

export default renderComponentHelper

export {
  until,
  renderConnectedComponentProps,
  analyticsDecoratorHelper,
  mockPrice,
}
