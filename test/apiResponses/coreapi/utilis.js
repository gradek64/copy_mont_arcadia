import { pathOr } from 'ramda'
import variables from './variables.json'

// API HEADERS
require('dotenv').config({ silent: true })

export const wcsEnv = process.env.WCS_ENVIRONMENT

export const headers = {
  'Content-Type': 'application/json',
  'BRAND-CODE': 'tsuk',
}
// CATEGORY SEO URL
export const categorySeo = '/en/tsuk/category/clothing-427/t-shirts-6864659'

// Address moniker
export const moniker =
  'GBR%7C965b3fe0-eaf4-4941-908e-b091b2c81abe%7C7.730ZOGBRFAnjBwAAAAABAwEAAAABf4E0UgAhAAIAAAAAAAAAAAD..1oAAAAA.....wAAAAAAAAAAAAAAAAAAADEsdzEzIDRsbgAAAAAA$9?country=GBR'

// API RESPONSE EXPECTED RESULTS
export const stringTypeCanBeEmpty = { type: 'string' }
export const stringType = { type: 'string', pattern: '^.+$' }
export const stringTypeEmpty = { type: 'string', pattern: '^$' }
export const stringTypePattern = (pattern) => ({ type: 'string', pattern })
export const stringTypeNumber = { type: 'string', pattern: '^[0-9.]+$' }
export const stringTypeTimestamp = {
  type: 'string',
  pattern: '^[0-9.(\\-: \\)]+$',
}
export const stringOrNull = { type: ['string', 'null'] }
export const numberType = { type: 'number', pattern: '^[0-9]+$' }
export const numberTypePattern = (minValue, maxValue) => ({
  type: 'number',
  minimum: minValue,
  maximum: maxValue,
})
export const booleanType = (boolean) => ({ type: 'boolean', enum: [boolean] })
export const booleanOrNull = { type: ['boolean', 'null'] }
export const booleanOrString = { type: ['boolean', 'string'] }
export const booleanTypeAny = { type: 'boolean' }
export const objectType = { type: 'object' }
export const objectOrStringType = { type: ['object', 'string'] }
const arrayBase = (type) =>
  function createArrayType(minItems = 0, uniqueItems = true, items = 'object') {
    return {
      type,
      minItems,
      uniqueItems,
      items: { type: items },
    }
  }
export const arrayType = arrayBase('array')
export const arrayOrBooleanType = arrayBase(['array', 'boolean'])
export const nullType = { type: 'null' }
export const calculateTotal = (deliveryMethod, subTotalPrice) => {
  return (
    parseFloat(subTotalPrice) + parseFloat(deliveryMethod.replace(/.*?£/, ''))
  ).toFixed(2)
}

// TEST DATA //
// USER CREDENTIALS
export const userCredentialsFullProfile = {
  username: 'userfullprofile@sample.com',
  password: 'monty1',
}
export const userCredentialsPartialProfile = {
  username: 'userpartialprofile@sample.com',
  password: 'monty1',
}
export const userCredentialsOrdersAndReturnsProfile = {
  username: 'returnstest@test1.com',
  password: 'monty123',
}
export const createUser = (subscribe = true) => {
  return {
    email: /[a-z]{6}@sample.org/,
    password: 'monty1',
    passwordConfirm: 'monty1',
    subscribe,
  }
}
export const setVariable = (path, fallback = null) =>
  pathOr(fallback, [wcsEnv, ...path], variables)

// adds "Required & Properties" to pre-defined 'base' schema
export const addPropsToSchema = (schema, propsToAdd) => {
  return {
    ...schema,
    required: [...schema.required, ...Object.keys(propsToAdd)],
    properties: Object.assign(schema.properties, propsToAdd),
  }
}

// removes "Required" elements from pre-defined 'base' schema
export const removeReqsFromSchema = (schema, reqsToRemove) => {
  return {
    ...schema,
    required: schema.required.filter((ele) => !reqsToRemove.includes(ele)),
  }
}
