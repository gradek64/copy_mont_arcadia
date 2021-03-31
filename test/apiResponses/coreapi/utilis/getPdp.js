require('@babel/register')

jest.unmock('superagent')
import superagent from 'superagent'
import eps from '../routes_tests'
import { headers } from '../utilis'

export const getPdp = async (productId) => {
  const pdpBody = await superagent
    .get(eps.products.productDetailsPage.path(productId))
    .set(headers)

  return pdpBody.body
}

export const getPdpQuickView = async (productId) => {
  const pdpBody = await superagent
    .get(eps.products.productsQuickView.path)
    .query(productId)
    .set(headers)
  return pdpBody.body
}
