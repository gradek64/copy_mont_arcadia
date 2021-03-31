import React from 'react'
import { mount } from 'enzyme'

import DDPMessage from '../DDPMessage'

describe('<DDPMessage />', () => {
  const ChildComponent = () => <div className="child-component" />

  describe('when prop `isContentCentered` is false', () => {
    it('renders span with expected className', () => {
      const wrapper = mount(<DDPMessage />)
      expect(wrapper.find('span').props().className).toBe('DDPRenewal-message')
    })
  })

  describe('when prop `isContentCentered` is true', () => {
    it('renders span with expected className', () => {
      const wrapper = mount(<DDPMessage isContentCentered />)
      expect(wrapper.find('span').props().className).toBe(
        'DDPRenewal-message DDPRenewal-message--centered'
      )
    })
  })

  it('renders message if passed', () => {
    const message = 'this is a message'
    const wrapper = mount(<DDPMessage message={message} />)
    expect(wrapper.text()).toBe(message)
  })
  it('renders children if provided', () => {
    const wrapper = mount(
      <DDPMessage>
        <ChildComponent />
      </DDPMessage>
    )
    const child = wrapper.find('div.child-component')
    expect(child).not.toBeNull()
    expect(child).toHaveLength(1)
  })
  it('renders message if message and children provided', () => {
    const message = 'this is a message'
    const wrapper = mount(
      <DDPMessage message={message}>
        <ChildComponent />
      </DDPMessage>
    )
    const child = wrapper.find('div.child-component')
    expect(wrapper.text()).toBe(message)
    expect(child).toEqual({})
  })
  it('renders empty span if no message or children provided', () => {
    const wrapper = mount(<DDPMessage />)
    expect(wrapper.find('span').text()).toBe('')
  })
})
