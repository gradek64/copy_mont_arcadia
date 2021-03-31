import { getStores, getCountries } from './lib/store-locator-service'

const siteIdRegex = /^\d{5}$/
const booleanRegex = /^(true|false)$/
const coordinateRegex = /^(\+|-)?\d+(\.\d+)?$/

const paramValidation = {
  brand: siteIdRegex,
  brandPrimaryEStoreId: siteIdRegex,
  latitude: coordinateRegex,
  longitude: coordinateRegex,
  country: /^[a-zA-Z\s&]+$/,
  sku: /^\d+$/,
  skuList: /^\d+(,\s?\d+){0,99}$/,
  basketDetails: /^\d+:\d{1,2}(,\s?\d+:\d{1,2}){0,99}$/, // <sku>:<quantity>,<sku>:<quantity>
  deliverToStore: booleanRegex,
  storeIds: /^[A-Z]{1,2}\d{4,5}(,\s?[A-Z]{1,2}\d{4,5}){0,99}$/, // TS1234,S89094
  types: /^(today|brand|other|parcel)(,\s?(today|brand|other|parcel)){0,3}$/,
  cfsi: booleanRegex,
}

function validateQuery(query) {
  const params = Object.keys(query)
  return params.reduce(
    (acc, key) =>
      paramValidation[key] ? paramValidation[key].test(query[key]) && acc : acc,
    true
  )
}

export function getStoresHandler({ query }, reply) {
  if (!validateQuery(query)) {
    return reply({ error: 'Invalid store-locator query' }).code(400)
  }
  return getStores(query)
    .then((result) => {
      const { region } = query
      if (region === 'uk') {
        const stores = result.map((store) => ({
          ...store,
          distance: (store.distance * 0.621).toFixed(2),
        }))
        return reply(stores).code(200)
      }
      return reply(result).code(200)
    })
    .catch((error = {}) =>
      reply({ error: error.message || error.toString() }).code(
        error.statusCode || 400
      )
    )
}

export function getCountriesHandler({ query }, reply) {
  return getCountries(query)
    .then((result) => {
      reply(result).code(200)
    })
    .catch((error = {}) =>
      reply({ error: error.message || error.toString() }).code(
        error.statusCode || 400
      )
    )
}
