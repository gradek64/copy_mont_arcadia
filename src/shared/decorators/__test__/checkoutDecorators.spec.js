import React, { Component } from 'react'
import { mount } from 'enzyme'
import { createStore } from 'redux'
import { hasCheckedOut } from '../../selectors/checkoutSelectors'
import { whenCheckedOut } from '../checkoutDecorators'

jest.mock('../../selectors/checkoutSelectors', () => ({
  hasCheckedOut: jest.fn(),
}))

function mountComponentDecoratedWith(decorator) {
  @decorator
  class SomeComponent extends Component {
    render() {
      return <div>foo</div>
    }
  }
  const store = createStore(() => {}, {})
  return mount(<SomeComponent />, { context: { store } })
}

describe('Checkout Decorators', () => {
  describe('@whenCheckedOut', () => {
    afterEach(() => jest.resetAllMocks())

    describe('when the basket has been checked out', () => {
      it('returns a component that renders the decorated component', () => {
        hasCheckedOut.mockImplementation(() => true)
        const expectToRender = '<div>foo</div>'

        expect(mountComponentDecoratedWith(whenCheckedOut).html()).toBe(
          expectToRender
        )
      })
    })

    describe('when the basket has not been checked out', () => {
      it('returns a component that renders null', () => {
        hasCheckedOut.mockImplementation(() => false)
        const expectToRender = ''
        expect(mountComponentDecoratedWith(whenCheckedOut).html()).toBe(
          expectToRender
        )
      })
    })
  })
})
