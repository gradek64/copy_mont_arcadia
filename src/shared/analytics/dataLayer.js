import pageSchema from './schemas/page'
import userSessionSchema from './schemas/userSession'
import basketSchema from './schemas/basket'
import promosSchema from './schemas/promos'
import { productClickSchema } from './schemas/product'
import { ANALYTICS_PLATFORM_ID } from './analytics-constants'

let dataLayerModule = null

if (process.env.NODE_ENV === 'production') {
  dataLayerModule = require('@ag-digital/analytics-datalayer/prod')
} else {
  dataLayerModule = require('@ag-digital/analytics-datalayer/dev')
}

const dataLayer = dataLayerModule.default

const origCall = dataLayer.push
dataLayer.push = (data, schemaName, eventName) => {
  origCall({ ...data, platform: ANALYTICS_PLATFORM_ID }, schemaName, eventName)
}

// GTM-136 🐒 - So That undefined can be passed into the schema (So that it passes validation)
if (process.env.NODE_ENV !== 'production') {
  const origCall = dataLayer.push
  dataLayer.push = (data, schemaName, eventName) => {
    origCall(JSON.parse(JSON.stringify(data)), schemaName, eventName)
  }
}

// Mock adapter in case this is run server-side without a `window` object
export const attachable =
  typeof window === 'undefined' ? { push: () => {}, dataLayer: [] } : window

// This adapter pushes data to GTM in the way it expects
export const gtm = dataLayerModule.gtmAdapter(attachable)
export const extendArray = dataLayerModule.extendArray

if (process.browser) {
  // Schemas are based on the http://json-schema.org/ standard
  // To learn: https://spacetelescope.github.io/understanding-json-schema/
  dataLayer
    // Attaches the dataLayer to `window.analytics-datalayer` so it can be tested by an E2E framework
    // in the future
    .attachTo(attachable, 'analytics-datalayer')
    .addSchema('pageSchema', pageSchema)
    .addSchema('userSessionSchema', userSessionSchema)
    .addSchema('basketSchema', basketSchema)
    .addSchema('promosSchema', promosSchema)
    .addSchema('productClickSchema', productClickSchema)
    .addAdapter('gtm', gtm)
}

export default dataLayer
