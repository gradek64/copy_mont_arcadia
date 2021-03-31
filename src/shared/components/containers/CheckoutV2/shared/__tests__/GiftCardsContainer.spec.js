import { clone } from 'ramda'

import { mapStateToProps } from '../GiftCardsContainer'

const state = {
  config: {},
  checkout: {
    orderSummary: {
      basket: {
        total: '10.00',
      },
      giftCards: [
        {
          giftCardId: '4624940',
          giftCardNumber: 'XXXX XXXX XXXX 5039',
          amountUsed: '34.00',
        },
      ],
    },
  },
  forms: {
    giftCard: {
      banner: 'Thank you, your gift card has been added.',
      fields: {
        giftCardNumber: {
          value: '',
          isDirty: false,
          isTouched: false,
          isFocused: false,
        },
        pin: {
          value: '',
          isDirty: false,
          isTouched: false,
          isFocused: false,
        },
      },
    },
  },
  features: {
    status: {
      FEATURE_GIFT_CARDS: true,
    },
  },
}

describe('GiftCardsContainer', () => {
  describe('mapStateToProps', () => {
    it('should get fields from state', () => {
      expect(mapStateToProps(state, {}).fields).toEqual({
        giftCardNumber: {
          value: '',
          isDirty: false,
          isTouched: false,
          isFocused: false,
        },
        pin: {
          value: '',
          isDirty: false,
          isTouched: false,
          isFocused: false,
        },
      })
    })

    it('should get feature flag from state', () => {
      expect(mapStateToProps(state, {}).isFeatureGiftCardsEnabled).toBe(true)
    })

    it('should get `giftCardNumberError` from state', () => {
      const newState = clone(state)
      newState.forms.giftCard = {
        errors: {
          giftCardNumber: 'Giftcard number needs to be 16 characters long.',
        },
      }
      const { giftCardNumberError } = mapStateToProps(newState, {})
      expect(giftCardNumberError).toBe(
        'Giftcard number needs to be 16 characters long.'
      )
    })

    it('should get `pinErrorError` from state', () => {
      const newState = clone(state)
      newState.forms.giftCard = {
        errors: {
          pin: 'Giftcard PIN needs to be 4 characters long.',
        },
      }
      const { pinError } = mapStateToProps(newState, {})
      expect(pinError).toBe('Giftcard PIN needs to be 4 characters long.')
    })

    it('should get gift cards from state', () => {
      expect(mapStateToProps(state, {}).giftCards).toEqual([
        {
          giftCardId: '4624940',
          giftCardNumber: 'XXXX XXXX XXXX 5039',
          amountUsed: '34.00',
        },
      ])
    })

    it('should return empty string for `total` by default', () => {
      expect(mapStateToProps(state, {}).total).toBe('')
    })

    it('should return empty string for `total` if no total is defined and own property `showTotal` is true', () => {
      expect(
        mapStateToProps(
          { ...state, checkout: { orderSummary: {} } },
          { showTotal: true }
        ).total
      ).toBe('')
    })

    it('should return basket total for `total` of own property `showTotal` is true', () => {
      expect(mapStateToProps(state, { showTotal: true }).total).toBe('10.00')
    })

    it('should return empty string for `errorMessage` if it doesn’t exist', () => {
      expect(mapStateToProps(state, {}).errorMessage).toBe('')
    })

    it('should get `errorMessage` from state', () => {
      expect(
        mapStateToProps(
          {
            ...state,
            forms: {
              giftCard: {
                fields: state.forms.giftCard.fields,
                message: {
                  message: 'The gift card number must be valid',
                },
              },
            },
          },
          {}
        ).errorMessage
      ).toBe('The gift card number must be valid')
    })

    it('should get `bannerMessage` from state', () => {
      expect(mapStateToProps(state, {}).bannerMessage).toBe(
        'Thank you, your gift card has been added.'
      )
    })

    it('should get `giftCardRedemptionPercentage` from state', () => {
      expect(mapStateToProps(state, {}).giftCardRedemptionPercentage).toBe(100)
    })

    it('should get `isGiftCardValueThresholdMet` from state', () => {
      expect(mapStateToProps(state, {}).isGiftCardValueThresholdMet).toBe(false)
    })

    it('should get `isGiftCardRedemptionEnabled` from state', () => {
      expect(mapStateToProps(state, {}).isGiftCardRedemptionEnabled).toBe(false)
    })
  })
})
