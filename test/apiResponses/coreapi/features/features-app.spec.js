import { booleanType, objectType } from '../utilis'

require('@babel/register')

import { getFeaturesByConsumer } from '../utilis/features'

describe('it should return features for Branding Brands app', () => {
  let features
  beforeAll(async () => {
    try {
      features = await getFeaturesByConsumer('app')
    } catch (e) {
      global.console.log('error', e)
    }
  }, 60000)

  describe('I can get features ', () => {
    it('app has features', () => {
      const featuresSchemaApp = {
        title: 'Features',
        type: 'object',
        required: ['success', 'flags'],
        properties: {
          success: booleanType(true),
          flags: objectType,
        },
      }
      expect(JSON.parse(features.res.text)).toMatchSchema(featuresSchemaApp)
      expect(features.res.headers['cache-control']).toContain('max-age=600')
    })
  })
})

describe('it should return features for Monty', () => {
  let features
  beforeAll(async () => {
    try {
      features = await getFeaturesByConsumer('monty')
    } catch (e) {
      global.console.log('error', e)
    }
  }, 60000)

  describe('I can get a list of features ', () => {
    it('monty returns more than one feature', () => {
      const featuresList = JSON.parse(features.res.text)
      let count = 0
      featuresList.features.forEach(() => {
        count += 1
      })
      expect(count).toBeGreaterThan(1)
    })
  })
})
