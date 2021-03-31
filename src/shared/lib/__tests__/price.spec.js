import { normalizePrice, format, formatForRadix } from '../price'

describe('OrderComplete.normalizePrice()', () => {
  it('should trip out currency symbols form price', () => {
    expect(normalizePrice('£ 45.00')).toBe('45.00')
    expect(normalizePrice('45,00 €')).toBe('45,00')
  })
})

describe('format()', () => {
  it('Handle GBP', () => {
    expect(format('GBP', '45')).toBe('£45.00')
    expect(format('GBP', '45.00')).toBe('£45.00')
    expect(format('GBP', '45.50')).toBe('£45.50')
  })

  it('EUR', () => {
    expect(format('EUR', '45,50')).toBe('45,50 €')
    expect(format('EUR', '45.50')).toBe('45,50 €')
    expect(format('EUR', '45.00')).toBe('45,00 €')
  })

  it('USD', () => {
    expect(format('USD', '45.50')).toBe('$45.50')
  })

  it('USD', () => {
    expect(format('USD', 45)).toBe('$45.00')
  })

  it('USD', () => {
    expect(format('USD')).toBe('$0.00')
  })

  it('AS OBJECT', () => {
    expect(format('GBP', '45', true)).toEqual({
      symbol: '£',
      value: '45.00',
      position: 'before',
    })
  })

  it('INVALID CURRENCY', () => {
    expect(format('AAAAAA')).toBe('AAAAAA')
  })
})

describe('formatForRadix()', () => {
  it('Handle Commans', () => {
    expect(formatForRadix('5,00', ',')).toEqual(5.0)
  })

  it('Handle Points', () => {
    expect(formatForRadix('5.00')).toEqual(5.0)
  })

  it('Handle Number', () => {
    expect(formatForRadix(5)).toEqual(5)
    expect(formatForRadix(5.0)).toEqual(5.0)
  })
})
