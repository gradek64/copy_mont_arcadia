jest.unmock('superagent')
import superagent from 'superagent'
import eps from '../routes_tests'
import { headers } from './shoppingBag'

export const getFeaturesByConsumer = async (consumer) => {
  const features = await superagent
    .get(eps.consumerFeatures.path(consumer))
    .set(headers)
  return features
}
