import { errorReport } from './reporter'
import { setItem, getItem } from './cookie/utils'

export { setItem, getItem, removeItem } from './cookie/utils'

export const getJSON = (key) => {
  const value = getItem(key)
  if (!value) return value

  let parsed
  try {
    parsed = JSON.parse(value)
  } catch (e) {
    errorReport(e)
  }

  return parsed
}

export const setJSON = (key, value) => setItem(key, JSON.stringify(value))

export function setStoreCookie({ storeId }) {
  const previousChosenStores = getItem('WC_physicalStores')
  const storeIdArray = previousChosenStores
    ? previousChosenStores.split('|')
    : []

  if (storeId) {
    // @NOTE Set cookie for FFS
    setItem('WC_pickUpStore', storeId, 90)
  }

  if (!storeIdArray.includes(storeId)) {
    storeIdArray.push(storeId)
  }

  if (storeIdArray.length > 5) {
    storeIdArray.shift()
  }

  const stores = storeIdArray.join('|')

  if (stores !== previousChosenStores) {
    setItem('WC_physicalStores', stores, 90)
  }
}

export function setProductIsActive(productIsActive) {
  setItem('productIsActive', productIsActive, 90)
}
