import React from 'react'
import { mount } from 'enzyme'
import mockdate from 'mockdate'

import DDPRenewalAdded from '../DDPRenewalAdded'

describe('<DDPRenewalAdded />', () => {
  const productName = 'product name'
  const ddpEndDate = '1 May 2020'
  const newEndDate = '1 May 2021'
  const DDPIcon = () => <div className="ddp-icon-class" />

  describe("ddp hasn't expired and end date is provided", () => {
    const lSpy = jest.fn((str, prop) => `${str[0]}${prop}`)
    let wrapper

    beforeAll(() => {
      wrapper = mount(
        <DDPRenewalAdded
          productName={productName}
          ddpEndDate={ddpEndDate}
          DDPIcon={<DDPIcon />}
          l={lSpy}
        />
      )
    })

    it('should render component in DDPAdded container', () => {
      const container = wrapper.find('.DDPAdded')
      expect(container).not.toBeNull()
      expect(container).toHaveLength(1)
    })

    it('should render provided DDPIcon in expected icon container', () => {
      const Icon = wrapper.find('.DDPAdded-icon')
      const passedIcon = Icon.find('.ddp-icon-class')
      expect(passedIcon).not.toBeNull()
      expect(passedIcon).toHaveLength(1)
    })

    it('should render title container with title that has provided product name', () => {
      const title = wrapper.find('div.DDPAdded-titleContainer')
      const h3 = title.find('h3.DDPAdded-title')
      expect(h3).not.toBeNull()
      expect(h3).toHaveLength(1)
      expect(h3.text()).toBe(`DDP Added Msg Title ${productName}`)
    })

    it('should render message container that has provided end date', () => {
      const message = wrapper.find('div.DDPAdded-messageContainer')
      const span = message.find('span.DDPAdded-message')
      expect(span).not.toBeNull()
      expect(span).toHaveLength(1)
      expect(span.text()).toBe(`DDP Added Expiry Msg ${newEndDate}`)
    })

    it('should call provided l function with expected text and passed productName', () => {
      expect(lSpy).toHaveBeenCalledWith(
        ['DDP Added Msg Title ', ''],
        productName
      )
    })

    it('should call provided l function with expected text and passed ddpEndDate', () => {
      expect(lSpy).toHaveBeenCalledWith(
        ['DDP Added Expiry Msg ', ''],
        newEndDate
      )
    })
  })

  describe('DDP has expired and ddpEndDate is null', () => {
    const lSpy = jest.fn((str, prop) => `${str[0]}${prop}`)
    let wrapper

    beforeAll(() => {
      mockdate.set('2020-05-01T08:00:00Z')
      wrapper = mount(
        <DDPRenewalAdded
          productName={productName}
          DDPIcon={<DDPIcon />}
          l={lSpy}
        />
      )
    })

    afterAll(() => {
      mockdate.reset()
    })

    it('should render message container that has provided end date', () => {
      const message = wrapper.find('div.DDPAdded-messageContainer')
      const span = message.find('span.DDPAdded-message')
      expect(span).not.toBeNull()
      expect(span).toHaveLength(1)
      expect(span.text()).toBe(`DDP Added Expiry Msg ${newEndDate}`)
    })

    it('should call provided l function with expected text and passed ddpEndDate', () => {
      expect(lSpy).toHaveBeenCalledWith(
        ['DDP Added Expiry Msg ', ''],
        newEndDate
      )
    })
  })

  describe('isMyAccount is true', () => {
    const lSpy = jest.fn((str, prop) => `${str[0]}${prop}`)
    let wrapper

    beforeAll(() => {
      wrapper = mount(
        <DDPRenewalAdded
          productName={productName}
          ddpEndDate={ddpEndDate}
          DDPIcon={<DDPIcon />}
          isMyAccount
          l={lSpy}
        />
      )
    })

    it('renders a different text for DDPAdded-title', () => {
      const title = wrapper.find('div.DDPAdded-titleContainer')
      const h3 = title.find('h3.DDPAdded-title')
      expect(h3).not.toBeNull()
      expect(h3).toHaveLength(1)
      expect(h3.text()).toBe(`DDP Added Msg Title My Account ${productName}`)
    })

    it('renders a different text for DDPAdded-message', () => {
      const message = wrapper.find('div.DDPAdded-messageContainer')
      const span = message.find('span.DDPAdded-message')
      expect(span).not.toBeNull()
      expect(span).toHaveLength(1)
      expect(span.text()).toBe(
        `Complete your purchase to enjoy free UK delivery until ${newEndDate}`
      )
    })
  })

  describe('MyAccountDetail is true', () => {
    const lSpy = jest.fn((str, prop) => `${str[0]}${prop}`)
    let wrapper

    beforeAll(() => {
      wrapper = mount(
        <DDPRenewalAdded
          productName={productName}
          ddpEndDate={ddpEndDate}
          DDPIcon={<DDPIcon />}
          isMyAccountDetail
          l={lSpy}
        />
      )
    })

    it('renders a different text for DDPAdded-title', () => {
      const title = wrapper.find('div.DDPAdded-titleContainer')
      const h3 = title.find('h3.DDPAdded-title')
      expect(h3).not.toBeNull()
      expect(h3).toHaveLength(1)
      expect(h3.text()).toBe(`DDP Added Msg Title My Account ${productName}`)
    })

    it('renders a different text for DDPAdded-message', () => {
      const message = wrapper.find('div.DDPAdded-messageContainer')
      const span = message.find('span.DDPAdded-message')
      expect(span).not.toBeNull()
      expect(span).toHaveLength(1)
      expect(span.text()).toBe(
        `Complete your purchase to enjoy free UK delivery until ${newEndDate}`
      )
    })
  })
})
