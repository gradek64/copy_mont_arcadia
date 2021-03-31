import { cookieOptionsBag, cookieOptionsUnset } from '../../../../../lib/auth'
import { getTotalQuantityFromProducts } from '../../../../../../shared/lib/product-utilities'

const addPromoCookies = () => [
  {
    name: 'arcpromocode',
    value: '',
    options: cookieOptionsUnset,
  },
]

const genBagCountCookie = (products) => ({
  name: 'bagCount',
  value:
    products && Array.isArray(products)
      ? getTotalQuantityFromProducts(products).toString()
      : '0',
})

const basketCookies = (products) => [
  {
    ...genBagCountCookie(products),
    options: cookieOptionsBag,
  },
]

export { addPromoCookies, basketCookies, genBagCountCookie }
