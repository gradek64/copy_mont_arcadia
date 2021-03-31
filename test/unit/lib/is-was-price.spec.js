import isWasPrice from '../../../src/shared/lib/is-was-price'

test('isWasPrice function should return undefined if wasPrice is undefinded', () => {
  expect(undefined).toBe(isWasPrice(undefined, '25.00'))
})

test('isWasPrice function should return undefined if wasPrice is less than now price', () => {
  expect(undefined).toBe(isWasPrice('24.00', '25.00'))
})

test('isWasPrice function should return undefined if wasPrice is the same as the now price', () => {
  expect(undefined).toBe(isWasPrice('25.00', '25.00'))
})

test('isWasPrice function should return wasPrice if wasPrice is greater than the now price', () => {
  expect('27.00').toBe(isWasPrice('27.00', '25.00'))
})
