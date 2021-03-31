import React from 'react'
import { localise } from '../../lib/localisation'

import { isFeatureDDPEnabled } from '../../selectors/featureSelectors'
import { getDDPSkuItem } from '../../selectors/siteOptionsSelectors'
import { bagContainsDDPProduct } from '../../selectors/shoppingBagSelectors'
import {
  isDDPUser,
  isDDPOrder,
  isDDPActiveUserPreRenewWindow,
  getDDPDefaultName,
} from '../../selectors/ddpSelectors'
import { isMobile } from '../../selectors/viewportSelectors'
import { isInCheckout } from '../../selectors/routingSelectors'
import { ajaxCounter } from '../components/LoaderOverlayActions'

import { addToBag, openMiniBag } from './shoppingBagActions'
import { setGenericError } from '../common/errorMessageActions'
import {
  sendAnalyticsDisplayEvent,
  GTM_EVENT,
  GTM_TRIGGER,
} from '../../analytics'

import AddToBagModal from '../../components/common/AddToBagModal/AddToBagModal'

export function addDDPToBag(skuId) {
  return (dispatch, getState) => {
    const { language, brandName } = getState().config
    const l = localise.bind(null, language, brandName)
    const state = getState()
    const isDDPEnabled = isFeatureDDPEnabled(state)
    const ddpSkuItem = getDDPSkuItem(state, skuId)
    const bagHasDDPProduct = bagContainsDDPProduct(state)
    const userHasNonRenewableDDPSubscription = isDDPActiveUserPreRenewWindow(
      state
    )

    const isCheckout = isInCheckout(state)
    const shouldShowBagDrawer = !isMobile(state) && !isCheckout

    if (!isDDPEnabled) {
      return dispatch(
        setGenericError({ message: 'DDP is not enabled on this site' })
      )
    }

    if (!ddpSkuItem) {
      return dispatch(setGenericError({ message: 'Invalid DDP Product' }))
    }

    if (userHasNonRenewableDDPSubscription) {
      return dispatch(
        setGenericError({
          message: l`Great news! You already have a delivery subscription.`,
        })
      )
    }

    if (bagHasDDPProduct) {
      return dispatch(
        setGenericError({
          message: l`You already have a delivery subscription in your bag.`,
        })
      )
    }

    /**
     * PartNumber  = ddpSkuItem.sku
     * it is required from wcs for add_item_V2
     * and it has to be the same value as SKU
     */

    // @NOTE for DDP we need to use sku catEntryId instead of productId
    dispatch(ajaxCounter('increment'))
    return dispatch(
      addToBag(
        ddpSkuItem.catentryId,
        skuId,
        ddpSkuItem.sku,
        1,
        !isCheckout ? <AddToBagModal /> : null
      )
    )
      .then(() => {
        // @NOTE Done in the same fashion as in AddToBag.jsx
        // All this callback logic could potentially be moved to addToBagSuccess action
        dispatch(ajaxCounter('decrement'))
        if (shouldShowBagDrawer) {
          setTimeout(() => {
            dispatch(openMiniBag(true))
            dispatch(
              sendAnalyticsDisplayEvent(
                {
                  bagDrawerTrigger: GTM_TRIGGER.PRODUCT_ADDED_TO_BAG,
                  pageType: state.pageType,
                },
                GTM_EVENT.BAG_DRAWER_DISPLAYED
              )
            )
          }, 100)
        }
      })
      .catch((err) => {
        dispatch(ajaxCounter('decrement'))
        dispatch(setGenericError({ message: err.message }))
      })
  }
}

export function validateDDPForCountry(country) {
  return (dispatch, getState) => {
    const state = getState()
    const { language, brandName } = state.config
    const l = localise.bind(null, language, brandName)
    const isDDPAvailable = isDDPUser(state) || isDDPOrder(state)
    const ddpProductName = getDDPDefaultName(state)
    if (isDDPAvailable && country !== 'United Kingdom')
      dispatch(
        setGenericError({
          message: l`To buy or use your ${ddpProductName} subscription, your order...`,
        })
      )
  }
}
