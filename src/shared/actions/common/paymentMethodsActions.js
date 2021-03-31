import { get } from '../../lib/api-service'
import { ajaxCounter } from '../components/LoaderOverlayActions'
import { joinQuery } from '../../lib/query-helper'
import { setGenericError } from '../common/errorMessageActions'

import { handleFormResponseErrorMessage } from './formActions'

function setPaymentMethods(payload) {
  return {
    type: 'SET_PAYMENT_METHODS',
    payload,
  }
}

export function getPaymentMethods(req) {
  const { delivery, billing } = req
  const queryParams = {
    ...(delivery && { delivery }),
    ...(billing && { billing }),
  }

  return async (dispatch) => {
    dispatch(ajaxCounter('increment'))

    try {
      const response = await dispatch(get(`/payments${joinQuery(queryParams)}`))

      dispatch(setPaymentMethods(response.body))
    } catch (error) {
      dispatch(setPaymentMethods([]))
      dispatch(setGenericError(error))
      dispatch(handleFormResponseErrorMessage(error))
    } finally {
      dispatch(ajaxCounter('decrement'))
    }
  }
}

export function getAllPaymentMethods() {
  return (dispatch) => dispatch(getPaymentMethods({}))
}
