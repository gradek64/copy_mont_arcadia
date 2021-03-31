import { filter } from 'ramda'

import createReducer from '../../lib/create-reducer'
import constants from '../../../shared/constants/espotsDesktop'
import {
  SET_ESPOT_DATA,
  REMOVE_PLP_ESPOTS,
} from '../../actions/common/espotActions'

export const initialState = {
  // TODO: They don't change so remove identifiers from state and may be move to constants
  identifiers: {
    navigation: [
      constants.navigation.siteWideHeader,
      constants.navigation.brandHeader,
      constants.navigation.global,
    ],
    miniBag: [constants.miniBag.top, constants.miniBag.bottom],
    miniBagMiddle: [constants.miniBag.middle],
    product: [
      constants.product.col1pos1,
      constants.product.col1pos2,
      constants.product.col2pos1,
      constants.product.col2pos2,
      constants.product.col2pos4,
      constants.product.content1,
      constants.product.bundle1,
      constants.product.klarna1,
      constants.product.klarna2,
    ],
    thankyou: [
      constants.thankyou.mainBody1,
      constants.thankyou.mainBody2,
      constants.thankyou.mainBody3,
      constants.thankyou.mainBody4,
      constants.thankyou.sideBar1,
      constants.thankyou.sideBar2,
      constants.thankyou.sideBar3,
      constants.thankyou.CONFIRMATION_DISCOVER_MORE,
    ],
    orderSummary: [
      constants.orderSummary.discountIntro,
      constants.orderSummary.ddpRenewalExpiring,
      constants.orderSummary.ddpRenewalExpired,
      constants.orderSummary.ddpTermsAndConditions,
    ],
    shared: [constants.shared.CONTACT_BANNER],
    search_results: [constants.search_results.NO_SEARCH_RESULT_ESPOT],
    marketing_slide_up: [constants.marketing_slide_up.MARKETING_SLIDE_UP_ESPOT],
    abandonment_modal: [
      constants.abandonment_modal.HOME,
      constants.abandonment_modal.CATEGORY,
      constants.abandonment_modal.PDP,
    ],
  },
  errors: {
    abandonmentModalError: false,
  },
}

const hasPlpEspot = (cmsData) =>
  Object.values(cmsData).some((espot) => espot.isPlpEspot)
const filterOutPlpEspots = filter((espot) => !espot.isPlpEspot)

export default createReducer(initialState, {
  // TODO refactor this to more sensible name once espot data and content gets removed
  [SET_ESPOT_DATA]: (
    state,
    { payload: { identifier, responsiveCMSUrl, position, isPlpEspot } }
  ) => {
    return {
      ...state,
      cmsData: {
        ...state.cmsData,
        [identifier]: { responsiveCMSUrl, position, isPlpEspot },
      },
    }
  },
  [REMOVE_PLP_ESPOTS]: (state) => {
    if (state.cmsData && hasPlpEspot(state.cmsData)) {
      const nonPlpEspots = state.cmsData
        ? filterOutPlpEspots(state.cmsData)
        : {}
      return {
        ...state,
        cmsData: {
          ...nonPlpEspots,
        },
      }
    }
    return state
  },
  ABANDONMENT_MODAL_ERROR: (state) => {
    return {
      ...state,
      errors: {
        ...state.errors,
        abandonmentModalError: true,
      },
    }
  },
})
