import superagent from '../../../shared/lib/superagent'
import { path, pickBy } from 'ramda'
import { joinQuery } from '../../../shared/lib/query-helper'
import { getSiteConfigs } from '../../config'
import storeLocatorCountriesMock from '../mocks/store-locator-countries.json'
import storeLocatorStoresMock from '../mocks/store-locator-stores.json'

function jsonpCallbackResultToJson(result) {
  return JSON.parse(result.text.replace(/^\((.*)\);$/, '$1'))
}

function removeFinalComma(string) {
  return typeof string === 'string' ? string.replace(/(.*),$/, '$1') : string
}

function isDefined(value) {
  return value !== undefined
}

function parseCollectFromStoreDates(brand, collectTimes = '') {
  return collectTimes
    .split(',')
    .reduce((accum, collectTime) => {
      const [brandId, availableUntil, collectFrom] = collectTime.split('~')
      return parseInt(brandId, 10) === brand
        ? accum.concat({ availableUntil, collectFrom })
        : accum
    }, [])
    .sort((t1, t2) => {
      const date1 = new Date(t1.availableUntil)
      const date2 = new Date(t2.availableUntil)
      return date1 < date2 ? -1 : 1
    })
}

function parseCollectFromStorePrices(brand, prices = '') {
  const standardRegexp = new RegExp(`${brand}_Standard`)
  const expressRegexp = new RegExp(`${brand}_[Express|Collection]`)

  return prices.split(',').reduce((result, price) => {
    if (price.match(standardRegexp)) {
      return {
        ...result,
        standard: parseFloat(price.split('=')[1]),
      }
    }

    if (price.match(expressRegexp)) {
      return {
        ...result,
        express: parseFloat(price.split('=')[1]),
      }
    }

    return result
  }, {})
}

function parseCollectFromStore(brand, store) {
  if (!store.cfsStandard && !store.cfsExpress) {
    return undefined
  }

  const prices = parseCollectFromStorePrices(brand, store.spare4)
  const collectFromStore = {}

  if (store.cfsStandard) {
    collectFromStore.standard = {
      dates: parseCollectFromStoreDates(brand, store.cfsStandard),
      price: prices.standard,
    }
  }

  if (store.cfsExpress) {
    collectFromStore.express = {
      dates: parseCollectFromStoreDates(brand, store.cfsExpress),
      price: prices.express,
    }
  }

  return collectFromStore
}

function parseStore(brand, store) {
  return pickBy(isDefined, {
    storeId: store.storeId,
    brandPrimaryEStoreId: store.brandPrimaryEStoreId,
    brandName: store.brandName,
    name: store.storeName,
    stock: store.stock,
    distance: store.distance,
    latitude: store.latitude,
    longitude: store.longitude,
    address: {
      line1: removeFinalComma(store.address1),
      line2: removeFinalComma(store.address2),
      city: store.address3,
      postcode: store.postcode,
      country: store.country,
    },
    openingHours: {
      monday: store.openingMon,
      tuesday: store.openingTue,
      wednesday: store.openingWed,
      thursday: store.openingThu,
      friday: store.openingFri,
      saturday: store.openingSat,
      sunday: store.openingSun,
    },
    telephoneNumber: store.telephoneNumber,
    collectFromStore: parseCollectFromStore(brand, store),
    cfsiAvailableOn: store.cfsiAvailableOn,
    ffsAvailableOn: store.ffsAvailableOn,
    cfsiPickCutOffTime: store.cfsiPickCutOffTime,
    stockList: store.stockList,
    basketInStock: store.basketInStock,
  })
}

function getBrandUKCode(id) {
  const siteConfigs = getSiteConfigs()
  const { brandName } = siteConfigs.find(
    ({ siteId: currentSiteId }) => parseInt(id, 10) === currentSiteId
  )
  const { siteId } = siteConfigs.find(
    ({ region, brandName: currentBrandName }) =>
      region === 'uk' && currentBrandName === brandName
  )
  return siteId
}

export function getStores({
  brand,
  brandPrimaryEStoreId,
  latitude,
  longitude,
  country,
  sku,
  skuList,
  basketDetails,
  deliverToStore,
  storeIds,
  types = 'today,brand,other,parcel',
  cfsi,
}) {
  if (process.env.CMS_TEST_MODE === 'true') {
    return Promise.resolve(storeLocatorStoresMock)
  }

  let API = process.env.API_URL_STORE_LOCATOR
  let brandParam = 'brand'

  if (cfsi === 'true') {
    API = process.env.API_URL_STORE_LOCATOR_V2
    brandParam = 'brandPrimaryEStoreId'
  }

  const brandId = brand || brandPrimaryEStoreId
  const brandUkCode = getBrandUKCode(brandId)
  const query = pickBy(isDefined, {
    lat: latitude,
    long: longitude,
    dist: 50,
    res: 15,
    storeIds,
    sku,
    skuList,
    basketDetails,
    country,
  })

  query[brandParam] = brandUkCode
  query.jsonp_callback = ''

  if (deliverToStore) {
    const typesArray = types.split(',')
    Object.assign(query, {
      dts: deliverToStore,
      colBrand: typesArray.includes('brand').toString(),
      colOther: typesArray.includes('other').toString(),
      colHermes: typesArray.includes('parcel').toString(),
      colNow: typesArray.includes('today').toString(),
    })
  }

  return superagent.get(`${API}${joinQuery(query)}`).then((result) => {
    let resultJson
    try {
      resultJson = jsonpCallbackResultToJson(result)
    } catch (e) {
      throw { statusCode: 500, message: 'Invalid response from server' } // eslint-disable-line
    }

    if (resultJson.error) {
      throw { message: resultJson.error.message, statusCode: 400 } // eslint-disable-line
    } else {
      const stores = path(['stores', 'store'], resultJson)
      if (Array.isArray(stores)) {
        return stores.map((store) => parseStore(brandUkCode, store))
      } else if (stores) {
        return [parseStore(brandUkCode, stores)]
      }
      return []
    }
  })
}

export function getCountries({ brand, brandPrimaryEStoreId, cfsi }) {
  if (process.env.CMS_TEST_MODE === 'true') {
    return Promise.resolve(storeLocatorCountriesMock)
  }

  let API = process.env.API_URL_COUNTRIES
  let brandParam = 'brand'

  if (cfsi === 'true') {
    API = process.env.API_URL_COUNTRIES_V2
    brandParam = 'brandPrimaryEStoreId'
  }

  const brandId = brand || brandPrimaryEStoreId
  const brandUKCode = getBrandUKCode(brandId)
  const countryListURL = `${API}?${brandParam}=${brandUKCode}&jsonp_callback=`

  return superagent.get(countryListURL).then((result) => {
    let resultJson
    try {
      resultJson = jsonpCallbackResultToJson(result)
    } catch (e) {
      throw { statusCode: 500, message: 'Invalid response from server' } // eslint-disable-line
    }

    if (resultJson.error) {
      throw { message: resultJson.error.message, statusCode: 400 } // eslint-disable-line
    } else {
      return path(['countries', 'country'], resultJson)
    }
  })
}
