import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'
import React from 'react'

import OrderProductPromo, { DiscountText } from '../OrderProductPromo'

describe('<OrderProductPromo/>', () => {
  describe('@renders', () => {
    it('renders a link when "promoTitle" is defined', () => {
      const props = {
        product: {
          promoTitle: '3 for £8 Socks Promotion',
        },
      }
      const wrapper = shallow(<OrderProductPromo {...props} />)
      expect(toJson(wrapper)).toMatchSnapshot()
    })
    it('renders discountText when "discountText" is defined and "hasDiscountText" is true', () => {
      const props = {
        product: {
          discountText: '3 for £8 Socks Promotion',
        },
        hasDiscountText: true,
      }
      const wrapper = shallow(<OrderProductPromo {...props} />)
      expect(toJson(wrapper)).toMatchSnapshot()
    })
    it('doesn\'t render discountText when "discountText" is defined and "hasDiscountText" is false', () => {
      const props = {
        product: {
          discountText: '3 for £8 Socks Promotion',
        },
        hasDiscountText: false,
      }
      const wrapper = shallow(<OrderProductPromo {...props} />)
      expect(toJson(wrapper)).toMatchSnapshot()
    })

    describe('returns null', () => {
      it('when the "promotionDisplayURL" is undefined', () => {
        const props = {
          product: {
            promoTitle: '3 for £8 Socks Promotion',
          },
        }
        const wrapper = shallow(<OrderProductPromo {...props} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
      it('when the "promoTitle" is undefined', () => {
        const props = {
          product: {
            promotionDisplayURL:
              'http://www.validpromo.example.org/promoId=3x8socks',
          },
        }
        const wrapper = shallow(<OrderProductPromo {...props} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })
  })
})

describe('<DiscountText/>', () => {
  describe('@renders', () => {
    it('returns a message if "discountText" is defined hasDiscountText is true', () => {
      const props = {
        discountText: 'This is part of a promotion!',
        hasDiscountText: true,
      }
      const wrapper = shallow(<DiscountText {...props} />)
      expect(toJson(wrapper)).toMatchSnapshot()
    })

    describe('returns null', () => {
      it('returns null if "discountText" is defined hasDiscountText is false', () => {
        const props = {
          discountText: 'This is part of a promotion!',
          hasDiscountText: false,
        }
        const wrapper = shallow(<DiscountText {...props} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
      it('returns null if "discountText" is undefined hasDiscountText is true', () => {
        const props = {
          hasDiscountText: true,
        }
        const wrapper = shallow(<DiscountText {...props} />)
        expect(toJson(wrapper)).toMatchSnapshot()
      })
    })
  })
})
