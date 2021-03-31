import React from 'react'
import { mount } from 'enzyme'

import DDPRenewalCta from '../DDPRenewalCta'

describe('<DDPRenewalCta />', () => {
  const buttonText = 'button text'
  const clickHandler = jest.fn(() => {})
  let wrapper
  let button

  beforeAll(() => {
    wrapper = mount(
      <DDPRenewalCta buttonText={buttonText} clickHandler={clickHandler} />
    )
    button = wrapper.find('button.Button')
  })

  describe('when prop `isContentCentered` is false', () => {
    it('should render button with expected className', () => {
      expect(button.props().className).toBe('Button DDPRenewal-button')
    })
  })

  describe('when prop `isContentCentered` is true', () => {
    it('should render button with expected className', () => {
      wrapper = mount(
        <DDPRenewalCta
          isContentCentered
          buttonText={buttonText}
          clickHandler={clickHandler}
        />
      )
      button = wrapper.find('button.Button')
      expect(button.props().className).toBe(
        'Button DDPRenewal-button DDPRenewal-button--centered'
      )
    })
  })

  it('should render provided button text', () => {
    expect(wrapper.text()).toBe(buttonText)
  })
  it('should trigger clickHandler when button is clicked', () => {
    button.simulate('click')
    expect(clickHandler).toHaveBeenCalledTimes(1)
  })
})
