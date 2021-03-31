import { path } from 'ramda'

import giftCardTransform, * as fragments from '../giftCard'

import wcsGuest from '../../../../../../test/apiResponses/orders/addGiftCard/wcs-guest.json'
import montyGuest from '../../../../../../test/apiResponses/orders/addGiftCard/hapiMonty-guest.json'
import wcsRegistered from '../../../../../../test/apiResponses/orders/addGiftCard/wcs-registered.json'
import montyRegistered from '../../../../../../test/apiResponses/orders/addGiftCard/hapiMonty-registered.json'

describe('giftCard transform functions', () => {
  describe('numberFragment', () => {
    const { numberFragment } = fragments

    it('should return a string with two decimal places given a number', () => {
      expect(numberFragment(20)).toBe('20.00')
    })
    it('should return a string with two decimal places given a string number', () => {
      expect(numberFragment('30')).toBe('30.00')
    })
    it('should return a string "0.00" if the value passed to it is not defined', () => {
      expect(numberFragment()).toBe('0.00')
    })
  })

  describe('giftCard Fragment', () => {
    const { giftCardFragment } = fragments
    it('should return a default giftCards object if values are not available', () => {
      expect(giftCardFragment({})).toEqual({
        giftCardId: '',
        giftCardNumber: '',
        balance: '0.00',
        amountUsed: '0.00',
        remainingBalance: '0.00',
      })
    })
  })

  describe('giftCards fragment', () => {
    const { giftCardsFragment } = fragments

    it('should return an empty array if the argument passed to it is not an array', () => {
      expect(giftCardsFragment({})).toEqual([])
    })

    it('should convert the giftCards array from WCS into a format expected by Monty', () => {
      expect(
        giftCardsFragment(
          path(
            ['giftCards', 'GiftCardsManagerForm', 'giftCards'],
            wcsRegistered
          )
        )
      ).toEqual(montyRegistered.giftCards)
    })
  })

  describe('giftCardDiscountFragment', () => {
    const { giftCardDiscountFragment } = fragments
    it('should format a gift card discount to a format expected by Monty', () => {
      expect(
        giftCardDiscountFragment(
          path(
            ['giftCards', 'GiftCardsManagerForm', 'giftCards', 0],
            wcsRegistered
          )
        )
      ).toEqual({
        label: 'Gift Card - XXXX XXXX XXXX 6765',
        value: '5.00',
      })
    })

    it('should return a default gift card discount if values are not available', () => {
      expect(giftCardDiscountFragment()).toEqual({
        label: '',
        value: '0.00',
      })
    })
  })

  describe('giftCardDiscountsFragment', () => {
    const { giftCardDiscountsFragment } = fragments

    it('should return an empty array if both the discounts and gift card parameters are not an array ', () => {
      expect(giftCardDiscountsFragment({}, {})).toEqual([])
      expect(giftCardDiscountsFragment({}, [])).toEqual([])
      expect(giftCardDiscountsFragment([], {})).toEqual([])
    })

    it('should create a discounts array from gift cards and discounts in a format expected by Monty', () => {
      expect(
        giftCardDiscountsFragment(
          path(
            ['giftCards', 'GiftCardsManagerForm', 'giftCards'],
            wcsRegistered
          ),
          [{ discount: 'foo' }]
        )
      ).toEqual([
        {
          label: 'Gift Card - XXXX XXXX XXXX 6765',
          value: '5.00',
        },
        { discount: 'foo' },
      ])
    })
  })

  describe('giftCard transform', () => {
    it('should transform a response from WCS into a format expected by Monty, when the user is registered', () => {
      expect(giftCardTransform(wcsRegistered, false, '£')).toEqual(
        montyRegistered
      )
    })

    it('should transform a response from WCS into a format expected by Monty, when the user is a guest', () => {
      expect(giftCardTransform(wcsGuest, true, '£')).toEqual(montyGuest)
    })
  })
})
