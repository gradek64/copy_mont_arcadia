import * as genericUtils from '../../../src/shared/lib/generic-utils'

test('padWithZerosToTwo returns "00" for argument as empty string', () => {
  expect(genericUtils.padWithZerosToTwo('')).toBe('00')
})

test('padWithZerosToTwo returns "01" for argument = "1"', () => {
  expect(genericUtils.padWithZerosToTwo('1')).toBe('01')
})

test('padWithZerosToTwo returns "01" for argument = 1', () => {
  expect(genericUtils.padWithZerosToTwo(1)).toBe('01')
})

test('padWithZerosToTwo returns "12" for argument = "12"', () => {
  expect(genericUtils.padWithZerosToTwo('12')).toBe('12')
})

test('padWithZerosToTwo returns "12" for argument = 12', () => {
  expect(genericUtils.padWithZerosToTwo(12)).toBe('12')
})

test('padWithZerosToTwo returns "23" for argument = "123"', () => {
  expect(genericUtils.padWithZerosToTwo('123')).toBe('23')
})

test('padWithZerosToTwo returns "23" for argument = 123', () => {
  expect(genericUtils.padWithZerosToTwo(123)).toBe('23')
})
