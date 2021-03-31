import { calculatePayloadSize, boolToString } from '../analytics-utils'

describe(calculatePayloadSize.name, () => {
  it('returns 0 if payload is undefined', () => {
    expect(calculatePayloadSize(undefined)).toBe(0)
  })
  it('calculates bytesize of different data-types', () => {
    expect(calculatePayloadSize(0)).toBe(1)
    expect(calculatePayloadSize(0.9)).toBe(3)
    expect(calculatePayloadSize([])).toBe(2)
    expect(calculatePayloadSize(null)).toBe(4)
    expect(calculatePayloadSize({ foo: 'bar' })).toBe(13)
  })
})

describe('boolToString()', () => {
  it('should return `True` when truthy value provided', () => {
    expect(boolToString(true)).toBe('True')
    expect(boolToString(1)).toBe('True')
    expect(boolToString('truthy')).toBe('True')
  })
  it('should return `False` when falsey value provided', () => {
    expect(boolToString(false)).toBe('False')
    expect(boolToString(undefined)).toBe('False')
    expect(boolToString('')).toBe('False')
  })
})
