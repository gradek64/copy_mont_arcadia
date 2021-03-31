import { serverSideRenderer } from './server-side-renderer'

import paymentsHelper from '../lib/payments-helper'

import {
  setOrderPending,
  setOrderError,
} from '../../shared/actions/common/orderActions'

export const setOrderPayload = (request, store) => {
  const orderPayload = paymentsHelper(request)
  const error = 'Unable to complete payment, please retry again later'
  return orderPayload
    ? store.dispatch(setOrderPending(orderPayload))
    : store.dispatch(setOrderError(error))
}

export default function orderCompleteHandler(request, reply) {
  return serverSideRenderer(request, reply, {
    postStorePopulation: setOrderPayload,
  })
}
