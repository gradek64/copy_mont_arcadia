import { titleCase } from '../../../lib/string-utils'

const getFriendlyBrandName = (brandName) => {
  if (brandName === 'dorothyperkins') {
    return 'dorothy perkins'
  } else if (brandName === 'missselfridge') {
    return 'miss selfridge'
  }

  return brandName
}

export default (key, brandName, CFSI) => {
  return {
    ...(CFSI ? { today: 'Collect today' } : {}),
    brand: `${titleCase(getFriendlyBrandName(brandName))} stores`,
    other: 'Other stores',
    parcel: 'ParcelShops',
  }[key]
}
