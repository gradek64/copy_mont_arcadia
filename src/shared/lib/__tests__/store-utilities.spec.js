import { composeStoreName, resolveStoreCodeType } from '../store-utilities'

describe(composeStoreName.name, () => {
  const storeDetails = {
    address2: 'StoreName',
  }

  it('should return empty string if params are not valid', () => {
    expect(composeStoreName(null, null)).toBe('')
    expect(composeStoreName('007', false)).toBe('')
    expect(composeStoreName(undefined, undefined)).toBe('')
    expect(composeStoreName({}, {})).toBe('')
  })

  it('should return storeName if storeCode does not match any of the brand or parcelshop locations', () => {
    expect(composeStoreName('MI6007', storeDetails)).toBe('StoreName')
  })

  it('should return brandName if brandName does not exist', () => {
    expect(composeStoreName('TM6007', {})).toBe('Topman')
  })

  it("should compose storeName for Arcadia's stores", () => {
    expect(composeStoreName('BR0001', storeDetails)).toBe('Burton StoreName')
    expect(composeStoreName('DP0002', storeDetails)).toBe(
      'Dorothy Perkins StoreName'
    )
    expect(composeStoreName('EV0003', storeDetails)).toBe('Evans StoreName')
    expect(composeStoreName('MS0004', storeDetails)).toBe(
      'Miss Selfridge StoreName'
    )
    expect(composeStoreName('TM0005', storeDetails)).toBe('Topman StoreName')
    expect(composeStoreName('TS0006', storeDetails)).toBe('Topshop StoreName')
    expect(composeStoreName('WL0007', storeDetails)).toBe('Wallis StoreName')
    expect(composeStoreName('OU0008', storeDetails)).toBe('Outfit StoreName')
  })

  it('should compose storeName for ParcelShop stores', () => {
    expect(composeStoreName('S0001', storeDetails)).toBe('Hermes StoreName')
  })
})

describe(resolveStoreCodeType.name, () => {
  it('should return empty string if there is no storeCode or is not a string', () => {
    expect(resolveStoreCodeType()).toBe('')
    expect(resolveStoreCodeType(null)).toBe('')
    expect(resolveStoreCodeType({})).toBe('')
    expect(resolveStoreCodeType('')).toBe('')
  })
  it('should return PARCELSHOP for storeCodes that start with `S`', () => {
    expect(resolveStoreCodeType('S0007')).toBe('PARCELSHOP')
  })
  it('should return STORE for storeCodes that do not start with `S`', () => {
    expect(resolveStoreCodeType('TS007')).toBe('STORE')
  })
})
