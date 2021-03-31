import React from 'react'
import { mount } from 'enzyme'

import DDPHeaderContent from '../DDPHeaderContent'

describe('<DDPHeaderContent />', () => {
  const headerText = 'Header Text'
  const iconText = 'icon component'
  const DDPIcon = () => <div className="ddp-icon">{iconText}</div>
  let wrapper
  let title
  const initialProps = {
    headerText,
    DDPIcon: DDPIcon(),
  }

  beforeAll(() => {
    wrapper = mount(<DDPHeaderContent {...initialProps} />)
    title = wrapper.find('h3.DDPRenewal-title')
  })
  describe('when prop `isContentCentered` is true', () => {
    it('should render DDPRenewal-titleContainer--centered', () => {
      const props = { ...initialProps, isContentCentered: true }
      wrapper = mount(<DDPHeaderContent {...props} />)
      const container = wrapper.find('.DDPRenewal-titleContainer--centered')

      expect(container).toHaveLength(1)
    })
  })
  describe('when prop `isContentCentered` is false', () => {
    it('should render DDPRenewal-titleContainer', () => {
      wrapper = mount(<DDPHeaderContent {...initialProps} />)
      const container = wrapper.find('.DDPRenewal-titleContainer')
      const containerCentered = wrapper.find(
        '.DDPRenewal-titleContainer--centered'
      )

      expect(containerCentered).toHaveLength(0)
      expect(container).toHaveLength(1)
    })
  })

  beforeAll(() => {
    wrapper = mount(
      <DDPHeaderContent headerText={headerText} DDPIcon={<DDPIcon />} />
    )
    title = wrapper.find('h3.DDPRenewal-title')
  })

  it('should render titleContainer', () => {
    const container = wrapper.find('.DDPRenewal-titleContainer')
    expect(container).not.toBeNull()
    expect(container).toHaveLength(1)
  })
  it('should render h3 tag with DDPRenewal-title class', () => {
    expect(title).not.toBeNull()
    expect(title).toHaveLength(1)
  })
  it('should render provided headerText', () => {
    expect(title.text()).toBe(headerText)
  })
  it('should render DDPIcon as a component passed in through props', () => {
    const icon = wrapper.find('.ddp-icon')
    expect(icon).not.toBeNull()
    expect(icon).toHaveLength(1)
    expect(icon.text()).toBe(iconText)
  })
})
