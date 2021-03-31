import {
  creditCardOptions,
  expiryMonths,
  USStates,
} from '../constants/siteOptions'
import { getExpiryYears } from '../utils/genericUtils'

const DDPSkusFragment = ({ partNumber, ...rest } = {}) => ({
  sku: partNumber,
  ...rest,
})

const DDPFragment = ({ ddpProduct } = {}) => {
  const { ddpSkus = [], catentryId, ...rest } = ddpProduct
  return {
    ddpProduct: {
      ddpSkus: ddpSkus.map(DDPSkusFragment),
      productId: catentryId,
      ...rest,
    },
  }
}

/**
 * @param {Object} siteOptions
 * @return {Object}
 */
const siteOptionsTransform = ({ ddp, ...siteOptions }) => ({
  ...siteOptions,
  ddp: ddp ? DDPFragment(ddp) : undefined,
  creditCardOptions,
  expiryMonths,
  expiryYears: getExpiryYears(12),
  USStates,
})

export default siteOptionsTransform
