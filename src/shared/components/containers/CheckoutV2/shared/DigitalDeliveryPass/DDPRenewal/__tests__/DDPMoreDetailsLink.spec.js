import React from 'react'
import { mount } from 'enzyme'

import DDPMoreDetailsLink from '../DDPMoreDetailsLink'

describe('<DDPMoreDetailsLink />', () => {
  describe('when can map storeCode with a DDP landing page', () => {
    describe('<Link />', () => {
      it('should render a Link component with the correct className', () => {
        const wrapper = mount(<DDPMoreDetailsLink storeCode={'tsuk'} />)
        const link = wrapper.find('Link')
        expect(link.prop('className')).toBe('DDPMoreDetailsLink')
      })

      it('should have the correct `to` prop for tsuk', () => {
        const wrapper = mount(<DDPMoreDetailsLink storeCode={'tsuk'} />)
        const link = wrapper.find('Link')
        expect(link.prop('to')).toBe(
          '/en/tsuk/category/topshop-premier-8994768/home'
        )
      })
      it('should have the correct `to` prop for dpuk', () => {
        const wrapper = mount(<DDPMoreDetailsLink storeCode={'dpuk'} />)
        const link = wrapper.find('Link')
        expect(link.prop('to')).toBe(
          '/en/dpuk/category/digital-delivery-pass-8069175/home'
        )
      })

      it('should have the correct `to` prop for msuk', () => {
        const wrapper = mount(<DDPMoreDetailsLink storeCode={'msuk'} />)
        const link = wrapper.find('Link')
        expect(link.prop('to')).toBe(
          '/en/msuk/category/miss-s-unlimited-8073836/home'
        )
      })

      it('should have the correct `to` prop for bruk', () => {
        const wrapper = mount(<DDPMoreDetailsLink storeCode={'bruk'} />)
        const link = wrapper.find('Link')
        expect(link.prop('to')).toBe('/en/bruk/category/ddp-8068633/home')
      })

      it('should have the correct `to` prop for wluk', () => {
        const wrapper = mount(<DDPMoreDetailsLink storeCode={'wluk'} />)
        const link = wrapper.find('Link')
        expect(link.prop('to')).toBe(
          '/en/wluk/category/unlimited-delivery-8036879/home'
        )
      })

      it('should have the correct `to` prop for evuk', () => {
        const wrapper = mount(<DDPMoreDetailsLink storeCode={'evuk'} />)
        const link = wrapper.find('Link')
        expect(link.prop('to')).toBe(
          '/en/evuk/category/unlimited-delivery-8060594/home?TS=1566400554634'
        )
      })
    })
  })

  describe('when cannot map storeCode with a DDP landing page', () => {
    describe('<Link />', () => {
      it('should not render a Link component', () => {
        const wrapper = mount(<DDPMoreDetailsLink storeCode={'wrongValue'} />)
        const link = wrapper.find('Link')
        expect(link.length).toBe(0)
      })
    })
  })
})
