import React from 'react'
import testComponentHelper from 'test/unit/helpers/test-component'
import Button from './Button'

describe('<Button/>', () => {
  const renderComponent = testComponentHelper(Button)

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
    it('with is-active class', () => {
      const { wrapper } = renderComponent({ isActive: true })
      expect(wrapper.hasClass('is-active')).toBe(true)
    })
    it('with children', () => {
      expect(
        renderComponent({
          children: [<span key="text">Text</span>, <i key="icon" />],
        }).getTree()
      ).toMatchSnapshot()
    })
    it('with ariaLabel', () => {
      const { wrapper } = renderComponent({ ariaLabel: 'CHECKOUT SECURELY' })
      expect(wrapper.find('button').prop('aria-label')).toEqual(
        'CHECKOUT SECURELY'
      )
    })
    it('with lang', () => {
      const { wrapper } = renderComponent({ lang: 'IT' })
      expect(wrapper.find('button').prop('lang')).toEqual('IT')
    })
  })

  describe('translate', () => {
    it('should render with className notranslate when non-text children passed', () => {
      const { wrapper } = renderComponent({
        children: [<span key="text">Text</span>, <i key="icon" />],
      })
      expect(wrapper.props().className).toContain('notranslate')
    })
    it('should not render with className notranslate when text children passed', () => {
      const { wrapper } = renderComponent({
        children: 'Text',
      })
      expect(wrapper.props().className).not.toContain('notranslate')
    })
  })

  describe('@events', () => {
    describe('<button className="Button" />', () => {
      it('calls clickHandler on click', () => {
        const { wrapper, instance } = renderComponent({
          clickHandler: jest.fn(),
        })

        expect(instance.props.clickHandler).not.toBeCalled()
        wrapper.find('.Button').simulate('click')
        expect(instance.props.clickHandler).toHaveBeenCalledTimes(1)
      })

      it('does not call clickHandler on click when disabled', () => {
        const { wrapper, instance } = renderComponent({
          isDisabled: true,
          clickHandler: jest.fn(),
        })

        wrapper.find('.Button').simulate('click')
        expect(instance.props.clickHandler).not.toBeCalled()
      })
    })
  })
})
