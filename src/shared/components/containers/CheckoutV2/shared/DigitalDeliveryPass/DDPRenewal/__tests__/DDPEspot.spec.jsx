import React from 'react'
import { shallow } from 'enzyme'
import DDPEspot from '../DDPEspot'

describe('<DDPEspot />', () => {
  let spy

  beforeEach(() => {
    spy = jest.fn()
  })

  it('should render with expected ddp_renewal_expired identifier when hasDDPExpired is true', () => {
    const wrapper = shallow(
      <DDPEspot hasDDPExpired getDDPRenewalEspots={spy} />
    )
    const parent = wrapper.find('div[data-espot="ddp_renewal_expired"]')
    expect(parent).not.toBeNull()
    expect(parent).toHaveLength(1)
  })

  it('should render with expected ddp_renewal_expiring identifier when hasDDPExpired is false', () => {
    const wrapper = shallow(<DDPEspot getDDPRenewalEspots={spy} />)
    const parent = wrapper.find('div[data-espot="ddp_renewal_expiring"]')
    expect(parent).not.toBeNull()
    expect(parent).toHaveLength(1)
  })

  it('should call getDDPRenewalEspots once', () => {
    process.browser = true
    shallow(<DDPEspot getDDPRenewalEspots={spy} />)
    expect(spy).toHaveBeenCalledTimes(1)
    delete process.browser
  })

  it('should render Espot with expected identifier', () => {
    const wrapper = shallow(
      <DDPEspot hasDDPExpired getDDPRenewalEspots={spy} />
    )
    const espot = wrapper.find('Connect(Espot)')
    expect(espot).not.toBeNull()
    expect(espot.props().identifier).toBe('ddp_renewal_expired')
  })

  it('should render Espot with isResponsive', () => {
    const wrapper = shallow(
      <DDPEspot hasDDPExpired getDDPRenewalEspots={spy} />
    )
    const espot = wrapper.find('Connect(Espot)')
    expect(espot).not.toBeNull()
    expect(espot.props().isResponsive).toBe(true)
  })
})
