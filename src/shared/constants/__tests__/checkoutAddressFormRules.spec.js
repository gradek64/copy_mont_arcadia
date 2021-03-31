import rules from '../checkoutAddressFormRules'

describe('Checkout Address Form Rules', () => {
  it('Provie address form rules', () => {
    expect(rules).toMatchSnapshot()
  })
  describe('UK postcode', () => {
    const { pattern } = rules['United Kingdom']
    describe('accepts valid patterns', () => {
      it('EC1 1AA', () => {
        expect('EC1 1AA'.match(pattern)).toBeTruthy()
      })
      it("'EC1 1AA  '", () => {
        expect('EC1 1AA  '.match(pattern)).toBeTruthy()
      })
      it('EC11AA', () => {
        expect('EC11AA'.match(pattern)).toBeTruthy()
      })
    })
    it("doesn't match invalid postcode", () => {
      expect('x'.match(pattern)).toBeFalsy()
    })
  })
})
