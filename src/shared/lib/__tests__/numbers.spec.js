import { round } from '../numbers'

describe('Numbers Utils', () => {
  describe('round', () => {
    it('rounds to 2 decimal places by default', () => {
      expect(round(1.005).toString()).toEqual('1.01')
      expect(round(1.001).toString()).toEqual('1')
      expect(round(1.011).toString()).toEqual('1.01')
    })

    it('rounds to custom decimal places', () => {
      expect(round(1.005, 3).toString()).toEqual('1.005')
      expect(round(1.0005, 3).toString()).toEqual('1.001')
      expect(round(1.0001, 3).toString()).toEqual('1')
      expect(round(1.0011, 3).toString()).toEqual('1.001')
    })
  })
})
