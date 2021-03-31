import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  buildComponentRender,
  shallowRender,
  mountRender,
  withStore,
} from '../test-component'
import { compose } from 'ramda'

const Component = (prop) => <div>Hello {prop.name}!</div>

const ConnectedComponent = connect((state) => ({ name: state.name }))(Component)

/*eslint-disable */
const ComponentWithContext = (props, { l, p }) => (
  <div>{l`Hello ${props.name}, give me ${p('50')}`}</div>
)
/*eslint-disable */

ComponentWithContext.contextTypes = { l: PropTypes.func, p: PropTypes.func }

const ConnectedComponentWithContext = connect((state) => ({
  name: state.name,
}))(ComponentWithContext)

const props = { name: 'José' }

describe('test-component', () => {
  describe('buildComponentRender', () => {
    it('renders a component', () => {
      const { wrapper, instance, getTree } = buildComponentRender(
        mountRender,
        Component
      )(props)

      expect(wrapper.find('div').text()).toBe(`Hello ${props.name}!`)
      expect(wrapper.props()).toEqual(props)
      expect(getTree()).toMatchSnapshot()
    })

    it('mounts a component', () => {
      const { wrapper, instance, getTree } = buildComponentRender(
        mountRender,
        Component
      )(props)

      expect(wrapper.find('div').text()).toBe(`Hello ${props.name}!`)
      expect(wrapper.props()).toEqual(props)
      expect(getTree()).toMatchSnapshot()
    })

    it('renders with a store (mount)', () => {
      const state = props

      const render = compose(
        mountRender,
        withStore(state)
      )

      const renderComponent = buildComponentRender(render, ConnectedComponent)
      const { wrapper, store, getTree } = renderComponent()

      expect(wrapper.find('div').text()).toBe(`Hello ${props.name}!`)
      expect(store.getState()).toEqual(state)
      expect(getTree()).toMatchSnapshot()
    })

    it('renders with a store (shallow)', () => {
      const state = props

      const render = compose(
        shallowRender,
        withStore(state)
      )

      const renderComponent = buildComponentRender(render, ConnectedComponent)
      const { wrapper, store, getTree } = renderComponent()

      expect(
        wrapper
          .dive()
          .find('div')
          .text()
      ).toBe(`Hello ${props.name}!`)
      expect(store.getState()).toEqual(state)
      expect(getTree()).toMatchSnapshot()
    })

    it('renders with store and new state', () => {
      const state = props
      const { wrapper } = buildComponentRender(
        compose(
          mountRender,
          withStore(state)
        ),
        ConnectedComponent
      )({ props, state: { name: 'Bob' } })

      expect(wrapper.find('div').text()).toBe(`Hello Bob!`)
    })

    it("new state doesn't clobber initial state but is merged", () => {
      const state = {
        name: 'José',
        data: {
          a: {
            b: true,
          },
        },
      }
      const { store } = buildComponentRender(
        compose(
          mountRender,
          withStore(state)
        ),
        ConnectedComponent
      )({ props, state: { name: 'Bob', data: { c: { d: false } } } })

      expect(store.getState()).toEqual({
        name: 'Bob',
        data: {
          a: {
            b: true,
          },
          c: {
            d: false,
          },
        },
      })
    })

    it('should be able to use `l` context variable', () => {
      const { wrapper, context } = buildComponentRender(
        shallowRender,
        ComponentWithContext
      )(props)

      expect(wrapper.find('div').text()).toBe(`Hello José, give me £50.00`)
      expect(context.l).toHaveBeenCalled()
    })

    it('should be able to use `p` context variable', () => {
      const { wrapper, context } = buildComponentRender(
        shallowRender,
        ComponentWithContext
      )(props)

      expect(wrapper.find('div').text()).toBe(`Hello José, give me £50.00`)
      expect(context.p).toHaveBeenCalled()
    })

    it('renders with a store and calling context variables (shallow)', () => {
      const state = props
      const render = compose(
        shallowRender,
        withStore(state)
      )
      const renderComponent = buildComponentRender(
        render,
        ConnectedComponentWithContext
      )
      const { wrapper, store, context } = renderComponent()

      // when using dive() we should pass context throught --> https://github.com/airbnb/enzyme/issues/770
      expect(
        wrapper
          .dive({ context })
          .find('div')
          .text()
      ).toBe(`Hello José, give me £50.00`)
      expect(store.getState()).toEqual(state)
      expect(context.p).toHaveBeenCalled()
      expect(context.l).toHaveBeenCalled()
    })

    it('renders with a store and calling context variables (mount)', () => {
      const state = props
      const render = compose(
        mountRender,
        withStore(state)
      )
      const renderComponent = buildComponentRender(
        render,
        ConnectedComponentWithContext
      )
      const { wrapper, store, context } = renderComponent()
      expect(wrapper.find('div').text()).toBe(`Hello José, give me £50.00`)
      expect(store.getState()).toEqual(state)
      expect(context.p).toHaveBeenCalled()
      expect(context.l).toHaveBeenCalled()
    })
  })
})
