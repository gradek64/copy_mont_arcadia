import { pathOr } from 'ramda'

const resolveBrandName = (storeCode) => {
  let brandName = ''

  if (/^BR/.test(storeCode)) {
    brandName = 'Burton'
  } else if (/^DP/.test(storeCode)) {
    brandName = 'Dorothy Perkins'
  } else if (/^EV/.test(storeCode)) {
    brandName = 'Evans'
  } else if (/^MS/.test(storeCode)) {
    brandName = 'Miss Selfridge'
  } else if (/^TM/.test(storeCode)) {
    brandName = 'Topman'
  } else if (/^TS/.test(storeCode)) {
    brandName = 'Topshop'
  } else if (/^WL/.test(storeCode)) {
    brandName = 'Wallis'
  } else if (/^OU/.test(storeCode)) {
    brandName = 'Outfit'
  } else if (/^S/.test(storeCode)) {
    // for ParcelShop
    brandName = 'Hermes'
  }

  return brandName
}

export const composeStoreName = (storeCode, storeDetails) => {
  const brandName = resolveBrandName(storeCode)
  const storeName = pathOr('', ['address2'], storeDetails)

  return brandName + (brandName && storeName && ' ') + storeName
}

// @NOTE Parcelshop storeCodes start with `S` ie: S08137
// whereas brandStores preprend their brandCode ie: TS -> TS897
export const resolveStoreCodeType = (storeCode) => {
  return storeCode && typeof storeCode === 'string'
    ? storeCode.startsWith('S')
      ? 'PARCELSHOP'
      : 'STORE'
    : ''
}
