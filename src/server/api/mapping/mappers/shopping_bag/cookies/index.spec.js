import { addPromoCookies, basketCookies } from './index'

import { cookieOptionsUnset, cookieOptionsBag } from '../../../../../lib/auth'

const addPromoSetCookies = [
  {
    name: 'arcpromocode',
    value: '',
    options: cookieOptionsUnset,
  },
]

const products = [{ quantity: 1 }, { quantity: 3 }]

const basketSetCookies = [
  {
    name: 'bagCount',
    value: '4',
    options: cookieOptionsBag,
  },
]

const basketEmptySetCookies = [
  {
    name: 'bagCount',
    value: '0',
    options: cookieOptionsBag,
  },
]

describe('cookies to set', () => {
  describe('addPromoCookies', () => {
    it('returns the cookies to set for AddPromo', () => {
      expect(addPromoCookies()).toEqual(addPromoSetCookies)
    })
  })
  describe('basketCookies', () => {
    it('should return a cookie based on the number of items in the bag', () => {
      expect(basketCookies(products)).toEqual(basketSetCookies)
    })

    it('should return a cookie with a bagCount of 0 if the shopping cart is empty', () => {
      expect(basketCookies()).toEqual(basketEmptySetCookies)
    })
  })
})
