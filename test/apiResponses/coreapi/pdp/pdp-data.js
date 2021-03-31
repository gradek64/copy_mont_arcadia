import { setVariable } from './../utilis'

// PRODUCTS DATA
try {
  require('dotenv').config()
} catch (e) {
  // eslint-disable-next-line no-console
  console.error(e)
}

export const pdpSimpleProduct = '30514342'
export const pdpProductOnSale = '30839301'
export const pdpColourSwatches = setVariable(
  ['pdp', 'ColourSwatches'],
  '28071485'
)
export const pdpFixedBundleProduct = setVariable(
  ['pdp', 'FixedBundleProduct'],
  '27511600'
)
export const pdpFlexibleBundleProduct = setVariable(
  ['pdp', 'FlexibleBundleProduct'],
  '29355195'
)
export const pdpProductQuickViewQuery = { productId: '21088572' }
