// actions
import { setFormMessage, setFormField, resetForm } from './formActions'
import { ajaxCounter } from '../components/LoaderOverlayActions'

// libs
import { get } from '../../lib/api-service'
import { joinQuery } from '../../lib/query-helper'
import { path } from 'ramda'

/**
 * Function to find address by exact id (moniker). Only returns one address
 * and fill the address form with the information
 * and set AddressForm mode to isManual
 * @param {*} moniker GUID for the address
 * @param {*} country
 * @param {*} formNames
 */
export function findExactAddressByMoniker({ moniker, country, formNames }) {
  const encodedMoniker = encodeURIComponent(moniker)

  return (dispatch) => {
    dispatch(ajaxCounter('increment'))
    return dispatch(get(`/address/${encodedMoniker}?country=${country}`))
      .then((res) => {
        dispatch(ajaxCounter('decrement'))
        if ('body' in res) {
          dispatch(
            resetForm(formNames.address, { ...res.body, isManual: true })
          )
          dispatch(setFormField(formNames.address, 'isManual', true))
        }
        return res
      })
      .catch((err) => {
        dispatch(ajaxCounter('decrement'))
        const defaultError =
          'We are unable to find your address at the moment. Please enter your address manually.'
        const error =
          (err.response && err.response.body && err.response.body.message) ||
          defaultError
        dispatch(setFormMessage(formNames.address, error))
      })
  }
}

/**
 *  Action for calling the /address api and get all the addresses available for a post code
 *  Note: If there are only one, then call findExactAddressByMoniker
 * @param {*} data address finders info
 * @param {*} formNames
 */
export function findAddress({ data, formNames }) {
  return (dispatch) => {
    const defaultError =
      'We are unable to find your address at the moment. Please enter your address manually.'
    dispatch(ajaxCounter('increment'))
    dispatch(setFormMessage(formNames.findAddress, ''))
    return dispatch(get(`/address${joinQuery(data)}`))
      .then((res) => {
        dispatch(ajaxCounter('decrement'))
        if ('body' in res) {
          dispatch(setFormField(formNames.findAddress, 'findAddress', true))
          const monikers = Array.from(res.body)
          if (monikers.length) {
            // if only one returned then we should apply the address in the form
            if (monikers.length === 1) {
              return dispatch(
                findExactAddressByMoniker({
                  country: data.country,
                  moniker: monikers[0].moniker,
                  formNames,
                })
              )
            }
            return monikers
          }
        }
        dispatch(setFormMessage(formNames.findAddress, defaultError))
        return null
      })
      .catch((err) => {
        dispatch(ajaxCounter('decrement'))
        const statusCode = path(['response', 'statusCode'], err)
        if (statusCode === 503 || statusCode === 422) {
          // 503 the server for the address look up is unavailable (timeout)
          // 422 is the response from wcs if the address could not be found
          dispatch(setFormMessage(formNames.findAddress, defaultError))
        } else {
          const error =
            path(['response', 'body', 'message'], err) || defaultError
          dispatch(setFormMessage(formNames.findAddress, error))
        }
      })
  }
}
