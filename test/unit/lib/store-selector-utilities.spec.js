import {
  getAppliedFilters,
  getSelectedFilters,
} from '../../../src/shared/lib/store-locator-utilities'

const filters = {
  brand: {
    selected: false,
    applied: true,
  },
  other: {
    selected: true,
    applied: false,
  },
  parcel: {
    selected: false,
    applied: true,
  },
}

test('getAppliedFilters() to return an array of filter name which have the prop "applied" as true', () => {
  const result = getAppliedFilters(filters)
  expect(result.length).toBe(2)
  expect(result).toEqual(['brand', 'parcel'])
})

test('getSelectedFilters() to return an array of filter name which have the prop "selected" as true', () => {
  const result = getSelectedFilters(filters)
  expect(result.length).toBe(1)
  expect(result).toEqual(['other'])
})
