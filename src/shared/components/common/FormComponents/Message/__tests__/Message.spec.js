import { mount } from 'enzyme'
import React from 'react'

import testComponentHelper from 'test/unit/helpers/test-component'

import Message from '../Message'

describe('<Message/>', () => {
  const initialProps = {
    message: 'This is a normal message',
    type: 'normal',
    className: 'normalMessage',
  }

  const renderComponent = testComponentHelper(Message)

  describe('@renders', () => {
    it('with no props', () => {
      expect(renderComponent().getTree()).toMatchSnapshot()
    })
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
    it('should add is-hidden class and have no text if message is empty', () => {
      const propsWithNoMessage = { ...initialProps, message: '' }
      const { wrapper } = renderComponent(propsWithNoMessage)
      expect(wrapper.find('.Message').hasClass('is-hidden')).toBe(true)
      expect(wrapper.find('.Message').text()).toEqual('')
    })
    it('should add is-confirm class if type is confirm', () => {
      const propsWithConfirmType = { ...initialProps, type: 'confirm' }
      const { wrapper } = renderComponent(propsWithConfirmType)
      expect(wrapper.find('.Message').hasClass('is-confirm')).toBe(true)
    })
    it('should add is-error class if type is error', () => {
      const propsWithErrorType = { ...initialProps, type: 'error' }
      const { wrapper } = renderComponent(propsWithErrorType)
      expect(wrapper.find('.Message').hasClass('is-error')).toBe(true)
    })
  })

  describe('@lifecycle', () => {
    describe('on componentDidMount', () => {
      it('should invoke onDidMount function if passed as props', () => {
        const { instance } = renderComponent({
          ...initialProps,
          onDidMount: jest.fn(),
        })
        expect(instance.props.onDidMount).not.toHaveBeenCalled()
        instance.componentDidMount()
        expect(instance.props.onDidMount).toHaveBeenCalledWith(instance)
      })
    })

    describe('on componentWillUnmount', () => {
      it('should invoke onUnMount function if passed as props', () => {
        const { instance } = renderComponent({
          ...initialProps,
          onUnMount: jest.fn(),
        })
        expect(instance.props.onUnMount).not.toHaveBeenCalled()
        instance.componentWillUnmount()
        expect(instance.props.onUnMount).toHaveBeenCalled()
      })
    })
  })

  describe('@methods', () => {
    describe('scrollTo', () => {
      it('should scroll to element on invocation', () => {
        const scrollToMock = jest.fn()
        const props = {
          ...initialProps,
          window: {
            scrollTo: scrollToMock,
          },
        }
        // NOTE: need to use full-rendering `mount` so `refs` work
        const wrapper = mount(<Message {...props} />)
        wrapper.instance().scrollTo()
        expect(scrollToMock).toHaveBeenCalledWith(0, 0)
      })
    })
  })
})
