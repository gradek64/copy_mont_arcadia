jest.unmock('superagent')
import superagent from 'superagent'

import eps from '../routes_tests'
import { headers } from '../utilis'

export const getEspots = async (espots) => {
  const response = await superagent
    .get(eps.espots.path)
    .query({ items: espots.join(',') })
    .set(headers)
  return response
}
