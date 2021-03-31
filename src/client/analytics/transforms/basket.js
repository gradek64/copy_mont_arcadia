import {
  getShoppingBagProducts,
  getShoppingBagTotalItems,
  getShoppingBagTotal,
} from '../../../shared/selectors/shoppingBagSelectors'
import { getCheckoutOrderLines } from '../../../shared/selectors/checkoutSelectors'
import transformProduct from './product'

export default (state) => {
  const products = getShoppingBagProducts(state)
  const orderLines = getCheckoutOrderLines(state)
  return {
    totalQuantity: getShoppingBagTotalItems(state) || 0,
    totalPrice: getShoppingBagTotal(state),
    productList: products.map((product) =>
      transformProduct(product, orderLines)
    ),
  }
}
