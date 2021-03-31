import superagent from 'superagent'
import eps from '../routes_tests'
import { headers } from '../utilis'

export const getOrderSummary = async (cookies = '') =>
  superagent
    .get(eps.checkout.orderSummary.path)
    .set(headers)
    .set({
      Cookie: cookies,
    })

export const updateOrderSummary = async (updatePayload, cookies = '') =>
  superagent
    .put(eps.checkout.updateOrderSummary.path)
    .set(headers)
    .set({ Cookie: cookies })
    .send(updatePayload)

export const addNewDeliveryAddress = async (payload, cookies = '') =>
  superagent
    .post(eps.checkout.addOrderSummaryDeliveryAddress.path)
    .set(headers)
    .set({ Cookie: cookies })
    .send(payload)

export const amendDeliveryAddress = async (payload, cookies = '') =>
  superagent
    .put(eps.checkout.amendOrderSummaryDeliveryAddress.path)
    .set(headers)
    .set({ Cookie: cookies })
    .send(payload)

export const deleteDeliveryAddress = async (payload, cookies = '') =>
  superagent
    .deletede(eps.checkout.orderSummaryDeleteDeliveryAddress.path)
    .set(headers)
    .set({ Cookie: cookies })
    .send(payload)
