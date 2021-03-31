import GetPaymentsMethods from '../getPaymentsMethods'

const getPaymentsMethods = (req = {}) =>
  new GetPaymentsMethods(req).selectRequest()

describe('getPaymentMethods', () => {
  describe('get all payment methods available for a region', () => {
    it('nothing', () => {
      expect(
        getPaymentsMethods({
          query: {},
        })
      ).toMatchSnapshot()
    })
    it('uk', () => {
      expect(
        getPaymentsMethods({
          query: {
            delivery: 'United Kingdom',
            billing: 'United Kingdom',
          },
        })
      ).toMatchSnapshot()
    })
    it('uk billing only', () => {
      expect(
        getPaymentsMethods({
          query: {
            billing: 'United Kingdom',
          },
        })
      ).toMatchSnapshot()
    })
    it('uk delivery only', () => {
      expect(
        getPaymentsMethods({
          query: {
            delivery: 'United Kingdom',
          },
        })
      ).toMatchSnapshot()
    })
    it('de', () => {
      expect(
        getPaymentsMethods({
          headers: {
            'brand-code': 'tsde',
          },
          query: {
            delivery: 'Germany',
          },
        })
      ).toMatchSnapshot()
    })
    it('de', () => {
      expect(
        getPaymentsMethods({
          headers: {
            'brand-code': 'tsde',
          },
        })
      ).toMatchSnapshot()
    })
  })
})
