import { path, pathOr } from 'ramda'
import { createSelector } from 'reselect'

const selectSiteOptions = (state) => pathOr({}, ['siteOptions'], state)

const getBillingCountries = (state) => {
  const { billingCountries } = selectSiteOptions(state)

  return billingCountries
}

const getBillingCountriesISO = (state) => {
  const { billingCountryIso = {} } = selectSiteOptions(state)

  return Object.values(billingCountryIso)
}

const getDDPProduct = (state) => {
  const siteOptions = selectSiteOptions(state)

  return path(['ddp', 'ddpProduct'], siteOptions)
}

const getDDPSkus = (state) => {
  return pathOr([], ['ddpSkus'], getDDPProduct(state))
}

const getDDPSkuItem = createSelector(
  [getDDPSkus, (state, sku) => sku],
  (skus, sku) => {
    return skus.find((elem) => elem.sku === sku)
  }
)

const getDDPDefaultSku = createSelector([getDDPSkus], (skus) => {
  return skus.find((elem) => elem.default === true) || {}
})

const getDDPDefaultSkuPrice = createSelector(
  [getDDPDefaultSku],
  (ddpDefault) => {
    return ddpDefault.unitPrice
  }
)

const getPageTitle = (state) => {
  const { title } = selectSiteOptions(state)

  return title
}

const getMetaDescription = (state) => {
  const { description } = selectSiteOptions(state)
  return description
}

export {
  getBillingCountries,
  selectSiteOptions,
  getDDPSkus,
  getDDPSkuItem,
  getDDPDefaultSku,
  getDDPProduct,
  getPageTitle,
  getMetaDescription,
  getDDPDefaultSkuPrice,
  getBillingCountriesISO,
}
