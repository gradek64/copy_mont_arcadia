import React from 'react'
import { mount } from 'enzyme'

import DDPTermsAndConditions from '../DDPTermsAndConditions'

describe('<DDPTermsAndConditions />', () => {
  const buttonText = 'Button Text'
  let openModalSpy
  let wrapper

  beforeEach(() => {
    openModalSpy = jest.fn()
    wrapper = mount(
      <DDPTermsAndConditions buttonText={buttonText} openModal={openModalSpy} />
    )
  })

  it('should render provided buttonText', () => {
    expect(wrapper.text()).toBe(buttonText)
  })

  it('should call openModalSpy when button is clicked', () => {
    const btn = wrapper.find('.DDPTermsAndConditions-button')
    btn.simulate('click')
    expect(openModalSpy).toHaveBeenCalledTimes(1)
  })
})
