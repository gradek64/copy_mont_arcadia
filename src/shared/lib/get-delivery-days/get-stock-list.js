import { path, compose, both, find, propEq } from 'ramda'

export const getStockFromStockList = (sku, store) =>
  compose(
    both(
      Array.isArray,
      compose(
        path(['stock']),
        find(propEq('sku', sku))
      )
    ),
    path(['stockList'])
  )(store)
