import React from 'react'
import testComponentHelper from 'test/unit/helpers/test-component'
import { WindowNavigationListener } from './WindowNavigationListener'

const context = {
  addListener: jest.fn(),
  removeListener: jest.fn(),
}

const props = {
  closeModal: jest.fn(),
  modalOpen: false,
  children: <p>Hello</p>,
}
const renderComponent = testComponentHelper(WindowNavigationListener)

describe('WindowNavigationListener', () => {
  describe('@render', () => {
    it('renders children', () => {
      const { getTree } = renderComponent(props)
      expect(getTree()).toMatchSnapshot()
    })
  })

  describe('@lifecycle', () => {
    beforeEach(() => jest.clearAllMocks())

    it('componentDidMount', () => {
      const { instance } = renderComponent(props)
      instance.context = context
      instance.componentDidMount()
      expect(context.addListener).toHaveBeenCalledWith(
        'popstate',
        instance.onBrowserNavigation
      )
    })

    it('componentWillUnmount', () => {
      const { instance } = renderComponent(props)
      instance.context = context
      instance.componentWillUnmount()
      expect(context.removeListener).toHaveBeenCalledWith(
        'popstate',
        instance.onBrowserNavigation
      )
    })

    describe('@instance methods', () => {
      describe('onBrowserNavigation', () => {
        beforeEach(() => jest.clearAllMocks())

        it('closes modal if open', () => {
          const { instance } = renderComponent({
            ...props,
            modalOpen: true,
          })
          expect(props.closeModal).not.toHaveBeenCalled()
          instance.onBrowserNavigation()
          expect(props.closeModal).toHaveBeenCalled()
        })

        it('does not close modal if not open', () => {
          const { instance } = renderComponent({
            ...props,
          })
          instance.onBrowserNavigation()
          expect(props.closeModal).not.toHaveBeenCalled()
        })
      })
    })
  })
})
