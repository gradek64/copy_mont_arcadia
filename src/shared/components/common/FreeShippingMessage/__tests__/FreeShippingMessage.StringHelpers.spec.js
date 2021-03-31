import {
  getFreeDeliveryNudgeText,
  getFreeDeliveryText,
  getFreeExpressDeliveryText,
} from '../FreeShippingMessage.StringHelpers'

const lMockFunction = jest.fn((text) => text)
describe('Free Shipping Message String Helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  describe('when calling getFreeDeliveryNudgeText', () => {
    const price = '£4'
    it('should return the correct strings for brand ms', () => {
      const actual = getFreeDeliveryNudgeText(lMockFunction, 'ms', price)

      expect(actual.nudgeTextPartOne).toEqual([`You're only `, ` away from`])
      expect(actual.nudgeTextPartTwo).toEqual('FREE standard delivery')
      expect(actual.nudgeTextPartThree).toEqual('Go on, treat yourself...')
      expect(lMockFunction).toHaveBeenCalledWith(
        [`You're only `, ` away from`],
        price
      )
    })
    it('should return default text if brand supplied string does not exist', () => {
      const actual = getFreeDeliveryNudgeText(lMockFunction, 'ts', price)
      expect(actual.nudgeTextPartOne).toEqual([`Spend `, ``])
      expect(actual.nudgeTextPartTwo).toEqual('more and get ')
      expect(actual.nudgeTextPartThree).toEqual('free shipping')
      expect(lMockFunction).toHaveBeenCalledWith([`Spend `, ``], price)
    })
    it('should return default text if no brand supplied', () => {
      const actual = getFreeDeliveryNudgeText(lMockFunction, '', price)
      expect(actual.nudgeTextPartOne).toEqual([`Spend `, ``])
      expect(actual.nudgeTextPartTwo).toEqual('more and get ')
      expect(actual.nudgeTextPartThree).toEqual('free shipping')
      expect(lMockFunction).toHaveBeenCalledWith([`Spend `, ``], price)
    })
  })

  describe('when calling getFreeDeliveryMessage', () => {
    it('should return the correct strings for brand ms', () => {
      const actual = getFreeDeliveryText('ms')
      expect(actual.qualifiedForFreeDeliveryText).toEqual('Congratulations!')
      expect(actual.freeDeliveryText).toEqual(
        `You've qualified for FREE standard delivery`
      )
    })
    it('should return default text if brand supplied is ts', () => {
      const actual = getFreeDeliveryText('ts')
      expect(actual.qualifiedForFreeDeliveryText).toEqual(
        'Your bag qualifies for'
      )
      expect(actual.freeDeliveryText).toEqual('free shipping')
    })
    it('should return default text if no brand supplied', () => {
      const actual = getFreeDeliveryText('')
      expect(actual.qualifiedForFreeDeliveryText).toEqual(
        'Your bag qualifies for'
      )
      expect(actual.freeDeliveryText).toEqual('free shipping')
    })
  })

  describe('when calling getFreeExpressDeliveryText', () => {
    it('should return the correct strings for brand ms', () => {
      const actual = getFreeExpressDeliveryText('ms')
      expect(actual.qualifiedForFreeExpressDeliveryText).toEqual(
        'Congratulations!'
      )
      expect(actual.freeExpressDeliveryText).toEqual(
        `You've qualified for FREE express delivery`
      )
    })
    it('should return empty default text if brand supplied is ts', () => {
      const actual = getFreeExpressDeliveryText('ts')
      expect(actual.qualifiedForFreeExpressDeliveryText).toEqual('')
      expect(actual.freeExpressDeliveryText).toEqual('')
    })
    it('should return empty default text if no brand supplied', () => {
      const actual = getFreeExpressDeliveryText('')
      expect(actual.qualifiedForFreeExpressDeliveryText).toEqual('')
      expect(actual.freeExpressDeliveryText).toEqual('')
    })
  })
})
