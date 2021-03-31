import React from 'react'
import testComponentHelper from 'test/unit/helpers/test-component'
import ButtonLink from './ButtonLink'

describe('<ButtonLink/>', () => {
  const renderComponent = testComponentHelper(ButtonLink)

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent().getTree()).toMatchSnapshot()
    })

    it('in disabled state', () => {
      expect(renderComponent({ isDisabled: true }).getTree()).toMatchSnapshot()
    })

    it('with type', () => {
      expect(renderComponent({ type: 'foo' }).getTree()).toMatchSnapshot()
    })

    it('with className', () => {
      expect(
        renderComponent({ className: 'fooButton' }).getTree()
      ).toMatchSnapshot()
    })

    it('with children', () => {
      expect(
        renderComponent({
          children: [<span key="text">Text</span>, <i key="icon" />],
        }).getTree()
      ).toMatchSnapshot()
    })
  })

  describe('@events', () => {
    describe('button onClick', () => {
      it('calls clickHandler', () => {
        const clickHandler = jest.fn()
        const { wrapper } = renderComponent({
          clickHandler,
        })
        const event = {}
        expect(clickHandler).not.toHaveBeenCalled()
        wrapper.find('button').simulate('click', event)
        expect(clickHandler).toHaveBeenCalledTimes(1)
        expect(clickHandler).toHaveBeenCalledWith(event)
      })

      it('should not call clickHandler if disabled true', () => {
        const clickHandler = jest.fn()
        const { wrapper } = renderComponent({
          clickHandler,
          isDisabled: true,
        })
        expect(clickHandler).not.toHaveBeenCalled()
        wrapper.find('button').simulate('click', {})
        expect(clickHandler).not.toHaveBeenCalled()
      })
    })
  })
})
