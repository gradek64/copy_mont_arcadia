import { path, pathOr } from 'ramda'
import { getProductById } from './productSelectors'

const getSwatchProducts = (state) => path(['swatches'], state)

const getSwatchProductById = (productId, state) =>
  path(['products', productId], getSwatchProducts(state))

const getSelectedSwatchProduct = (productId, state) =>
  path(
    [
      'colourSwatches',
      path(['selected'], getSwatchProductById(productId, state)),
      'swatchProduct',
    ],
    getProductById(productId, state)
  )

const getSelectedSwatchProductId = (productId, state) =>
  pathOr(productId, ['productId'], getSelectedSwatchProduct(productId, state))

export {
  getSwatchProductById,
  getSelectedSwatchProduct,
  getSelectedSwatchProductId,
}
