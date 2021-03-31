import { canGiftCardBeRedeemed } from '../giftCardUtils'

const getGiftCardNumber = (digit7th = 9, digit8th = 9, digit9th = 9) =>
  `999999${digit7th}${digit8th}${digit9th}9`

const testCasesFor9thDigitBasedRule = [
  [getGiftCardNumber(0, 0, 2), 'ev', true],
  [getGiftCardNumber(0, 0, 0), 'br', true],
  [getGiftCardNumber(0, 0, 1), 'br', true],
  [getGiftCardNumber(0, 0, 7), 'br', true],
  [getGiftCardNumber(0, 0, 0), 'dp', true],
  [getGiftCardNumber(0, 0, 1), 'dp', true],
  [getGiftCardNumber(0, 0, 7), 'dp', true],
  [getGiftCardNumber(0, 0, 0), 'wl', true],
  [getGiftCardNumber(0, 0, 1), 'wl', true],
  [getGiftCardNumber(0, 0, 7), 'wl', true],

  [getGiftCardNumber(0, 1, 2), 'ev', true],
  [getGiftCardNumber(0, 1, 0), 'br', true],
  [getGiftCardNumber(0, 1, 1), 'br', true],
  [getGiftCardNumber(0, 1, 7), 'br', true],
  [getGiftCardNumber(0, 1, 0), 'dp', true],
  [getGiftCardNumber(0, 1, 1), 'dp', true],
  [getGiftCardNumber(0, 1, 7), 'dp', true],
  [getGiftCardNumber(0, 1, 0), 'wl', true],
  [getGiftCardNumber(0, 1, 1), 'wl', true],
  [getGiftCardNumber(0, 1, 7), 'wl', true],

  [getGiftCardNumber(8, 0, 2), 'ev', true],
  [getGiftCardNumber(8, 0, 0), 'br', true],
  [getGiftCardNumber(8, 0, 1), 'br', true],
  [getGiftCardNumber(8, 0, 7), 'br', true],
  [getGiftCardNumber(8, 0, 0), 'dp', true],
  [getGiftCardNumber(8, 0, 1), 'dp', true],
  [getGiftCardNumber(8, 0, 7), 'dp', true],
  [getGiftCardNumber(8, 0, 0), 'wl', true],
  [getGiftCardNumber(8, 0, 1), 'wl', true],
  [getGiftCardNumber(8, 0, 7), 'wl', true],

  [getGiftCardNumber(8, 1, 2), 'ev', true],
  [getGiftCardNumber(8, 1, 0), 'br', true],
  [getGiftCardNumber(8, 1, 1), 'br', true],
  [getGiftCardNumber(8, 1, 7), 'br', true],
  [getGiftCardNumber(8, 1, 0), 'dp', true],
  [getGiftCardNumber(8, 1, 1), 'dp', true],
  [getGiftCardNumber(8, 1, 7), 'dp', true],
  [getGiftCardNumber(8, 1, 0), 'wl', true],
  [getGiftCardNumber(8, 1, 1), 'wl', true],
  [getGiftCardNumber(8, 1, 7), 'wl', true],

  [getGiftCardNumber(0, 3, 2), 'ev', true],
  [getGiftCardNumber(0, 3, 0), 'br', true],
  [getGiftCardNumber(0, 3, 1), 'br', true],
  [getGiftCardNumber(0, 3, 7), 'br', true],
  [getGiftCardNumber(0, 3, 0), 'dp', true],
  [getGiftCardNumber(0, 3, 1), 'dp', true],
  [getGiftCardNumber(0, 3, 7), 'dp', true],
  [getGiftCardNumber(0, 3, 0), 'wl', true],
  [getGiftCardNumber(0, 3, 1), 'wl', true],
  [getGiftCardNumber(0, 3, 7), 'wl', true],
]

const falseTestCasesFor9thDigitBasedRule = [
  [getGiftCardNumber(0, 0, 2), 'br', false],
  [getGiftCardNumber(0, 0, 2), 'dp', false],
  [getGiftCardNumber(0, 0, 2), 'wl', false],
  [getGiftCardNumber(0, 0, 0), 'ev', false],
  [getGiftCardNumber(0, 0, 1), 'ev', false],
  [getGiftCardNumber(0, 0, 7), 'ev', false],

  [getGiftCardNumber(0, 1, 2), 'br', false],
  [getGiftCardNumber(0, 1, 2), 'dp', false],
  [getGiftCardNumber(0, 1, 2), 'wl', false],
  [getGiftCardNumber(0, 1, 0), 'ev', false],
  [getGiftCardNumber(0, 1, 1), 'ev', false],
  [getGiftCardNumber(0, 1, 7), 'ev', false],

  [getGiftCardNumber(8, 0, 2), 'br', false],
  [getGiftCardNumber(8, 0, 2), 'dp', false],
  [getGiftCardNumber(8, 0, 2), 'wl', false],
  [getGiftCardNumber(8, 0, 0), 'ev', false],
  [getGiftCardNumber(8, 0, 1), 'ev', false],
  [getGiftCardNumber(8, 0, 7), 'ev', false],

  [getGiftCardNumber(8, 1, 2), 'br', false],
  [getGiftCardNumber(8, 1, 2), 'dp', false],
  [getGiftCardNumber(8, 1, 2), 'wl', false],
  [getGiftCardNumber(8, 1, 0), 'ev', false],
  [getGiftCardNumber(8, 1, 1), 'ev', false],
  [getGiftCardNumber(8, 1, 7), 'ev', false],

  [getGiftCardNumber(0, 3, 2), 'br', false],
  [getGiftCardNumber(0, 3, 2), 'dp', false],
  [getGiftCardNumber(0, 3, 2), 'wl', false],
  [getGiftCardNumber(0, 3, 0), 'ev', false],
  [getGiftCardNumber(0, 3, 1), 'ev', false],
  [getGiftCardNumber(0, 3, 7), 'ev', false],
]

const testCasesForBaseRule = [
  [getGiftCardNumber(7, 4), 'ev', true],
  [getGiftCardNumber(6, 2), 'ev', true],

  [getGiftCardNumber(7, 0), 'br', true],
  [getGiftCardNumber(7, 0), 'dp', true],
  [getGiftCardNumber(7, 0), 'wl', true],

  [getGiftCardNumber(7, 3), 'br', true],
  [getGiftCardNumber(7, 3), 'dp', true],
  [getGiftCardNumber(7, 3), 'wl', true],

  [getGiftCardNumber(7, 6), 'br', true],
  [getGiftCardNumber(7, 6), 'dp', true],
  [getGiftCardNumber(7, 6), 'wl', true],

  [getGiftCardNumber(6, 0), 'br', true],
  [getGiftCardNumber(6, 0), 'dp', true],
  [getGiftCardNumber(6, 0), 'wl', true],

  [getGiftCardNumber(6, 1), 'br', true],
  [getGiftCardNumber(6, 1), 'dp', true],
  [getGiftCardNumber(6, 1), 'wl', true],

  [getGiftCardNumber(6, 7), 'br', true],
  [getGiftCardNumber(6, 7), 'dp', true],
  [getGiftCardNumber(6, 7), 'wl', true],
]

const falseTestCasesForBaseRule = [
  [getGiftCardNumber(7, 4), 'br', false],
  [getGiftCardNumber(7, 4), 'dp', false],
  [getGiftCardNumber(7, 4), 'wl', false],

  [getGiftCardNumber(6, 2), 'br', false],
  [getGiftCardNumber(6, 2), 'dp', false],
  [getGiftCardNumber(6, 2), 'wl', false],

  [getGiftCardNumber(7, 0), 'ev', false],
  [getGiftCardNumber(7, 0), 'ev', false],
  [getGiftCardNumber(7, 0), 'ev', false],

  [getGiftCardNumber(7, 3), 'ev', false],
  [getGiftCardNumber(7, 3), 'ev', false],
  [getGiftCardNumber(7, 3), 'ev', false],

  [getGiftCardNumber(7, 6), 'ev', false],
  [getGiftCardNumber(7, 6), 'ev', false],
  [getGiftCardNumber(7, 6), 'ev', false],

  [getGiftCardNumber(6, 0), 'ev', false],
  [getGiftCardNumber(6, 0), 'ev', false],
  [getGiftCardNumber(6, 0), 'ev', false],

  [getGiftCardNumber(6, 1), 'ev', false],
  [getGiftCardNumber(6, 1), 'ev', false],
  [getGiftCardNumber(6, 1), 'ev', false],

  [getGiftCardNumber(6, 7), 'ev', false],
  [getGiftCardNumber(6, 7), 'ev', false],
  [getGiftCardNumber(6, 7), 'ev', false],
]

describe('giftCardUtils', () => {
  describe('canGiftCardBeRedeemed', () => {
    describe('when card type is based on 9th digit rule', () => {
      describe('returns true', () => {
        test.each(testCasesFor9thDigitBasedRule)(
          'given %p and %p as arguments, returns %p',
          (giftCardNumber, brandCode, expectedResult) => {
            const result = canGiftCardBeRedeemed(giftCardNumber, brandCode)
            expect(result).toEqual(expectedResult)
          }
        )
      })

      describe('returns false', () => {
        test.each(falseTestCasesFor9thDigitBasedRule)(
          'given %p and %p as arguments, returns %p',
          (giftCardNumber, brandCode, expectedResult) => {
            const result = canGiftCardBeRedeemed(giftCardNumber, brandCode)
            expect(result).toEqual(expectedResult)
          }
        )
      })
    })

    describe('when card type is based on 7th and 8th digit rule', () => {
      describe('returns true', () => {
        test.each(testCasesForBaseRule)(
          'given %p and %p as arguments, returns %p',
          (giftCardNumber, brandCode, expectedResult) => {
            const result = canGiftCardBeRedeemed(giftCardNumber, brandCode)
            expect(result).toEqual(expectedResult)
          }
        )
      })

      describe('returns false', () => {
        test.each(falseTestCasesForBaseRule)(
          'given %p and %p as arguments, returns %p',
          (giftCardNumber, brandCode, expectedResult) => {
            const result = canGiftCardBeRedeemed(giftCardNumber, brandCode)
            expect(result).toEqual(expectedResult)
          }
        )
      })
    })
  })
})
