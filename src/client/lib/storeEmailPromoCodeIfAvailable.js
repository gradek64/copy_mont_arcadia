import qs from 'qs'
import { setItemWithOptions } from './cookie/utils'

export default function storeEmailPromoCodeIfAvailable(queryString) {
  const queryObj = qs.parse(queryString, { ignoreQueryPrefix: true })

  if (!queryObj.ARCPROMO_CODE) return

  setItemWithOptions('arcpromoCode', queryObj.ARCPROMO_CODE, {
    expires: 1000 * 60 * 60 * 24,
  })
}
