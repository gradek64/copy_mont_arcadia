import { post, del, put } from '../../lib/api-service'

import { getDefaultCountry } from '../../selectors/addressBookSelectors'
import { getFormNames } from '../../selectors/formsSelectors'
import { resetForm, handleFormResponseErrorMessage } from './formActions'
import { updateOrderSummaryWithResponse } from './checkoutActions'
import { setGenericError } from './errorMessageActions'

import { ajaxCounter } from '../components/LoaderOverlayActions'

const hideNewAddressForm = () => ({
  type: 'ADDRESS_BOOK_HIDE_NEW_ADDRESS_FORM',
})

const showNewAddressForm = () => {
  return (dispatch, getState) => {
    const state = getState()
    const formNames = getFormNames('addressBook')
    const country = getDefaultCountry(state)
    dispatch(
      resetForm(formNames.address, {
        address1: '',
        address2: '',
        postcode: '',
        city: '',
        country,
        state: '',
        county: null,
        isManual: false,
      })
    )
    dispatch(
      resetForm(formNames.details, {
        title: '',
        firstName: '',
        lastName: '',
        telephone: '',
      })
    )
    dispatch(
      resetForm(formNames.findAddress, {
        houseNumber: '',
        message: '',
        findAddress: '',
        selectAddress: '',
        postcode: '',
      })
    )
    dispatch(
      resetForm(formNames.deliverToAddress, {
        deliverToAddress: '',
      })
    )
    dispatch({
      type: 'ADDRESS_BOOK_SHOW_NEW_ADDRESS_FORM',
    })
  }
}

const createAddress = (address) => {
  return async (dispatch) => {
    dispatch(ajaxCounter('increment'))

    try {
      const response = await dispatch(
        post('/checkout/order_summary/delivery_address', {
          ...address,
          responseType: 'orderSummary',
        })
      )

      dispatch(hideNewAddressForm())
      dispatch(
        updateOrderSummaryWithResponse({ body: response.body }, false, false)
      )
    } catch (error) {
      dispatch(setGenericError(error))
      dispatch(handleFormResponseErrorMessage(error))
    } finally {
      dispatch(ajaxCounter('decrement'))
    }
  }
}
function deleteAddressSet(payload) {
  return {
    type: 'ADDRESS_BOOK_DELETE_ADDRESS',
    payload,
  }
}

const deleteAddress = (address) => {
  return async (dispatch) => {
    dispatch(ajaxCounter('increment'))

    try {
      const response = await dispatch(
        del('/checkout/order_summary/delivery_address', {
          addressId: address.id ? address.id : address.addressId,
        })
      )

      dispatch(deleteAddressSet(response.body))
    } catch (error) {
      dispatch(setGenericError(error))
      dispatch(handleFormResponseErrorMessage(error))
    } finally {
      dispatch(ajaxCounter('decrement'))
    }
  }
}

const selectAddress = (address) => {
  return async (dispatch) => {
    dispatch(ajaxCounter('increment'))

    try {
      const response = await dispatch(
        put('/checkout/order_summary/delivery_address', {
          addressId: address.id ? address.id : address.addressId,
        })
      )

      dispatch(
        updateOrderSummaryWithResponse({ body: response.body }, false, false)
      )
    } catch (error) {
      dispatch(setGenericError(error))
      dispatch(handleFormResponseErrorMessage(error))
    } finally {
      dispatch(ajaxCounter('decrement'))
    }
  }
}

export {
  hideNewAddressForm,
  showNewAddressForm,
  createAddress,
  deleteAddress,
  selectAddress,
}
