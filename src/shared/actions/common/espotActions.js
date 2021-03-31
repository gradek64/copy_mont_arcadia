import { path, pathOr } from 'ramda'
import espotDesktopConstants, {
  espotGroupId,
} from '../../constants/espotsDesktop'
import { fixCmsUrl } from '../../lib/cms-utilities'
import { get } from '../../lib/api-service'
import { joinQuery } from '../../lib/query-helper'
import cmsConsts from '../../constants/cmsConsts'
import { getContent } from './sandBoxActions'

export const espotKeysMap = {
  global: {
    'CE Tactical message espot': 'global',
    'header espot': 'siteWideHeader',
    'monty header espot': 'brandHeader',
  },
  shared: {
    CONTACT_BANNER: 'CONTACT_BANNER',
  },
  search_results: {
    NO_SEARCH_RESULT_ESPOT: 'NO_SEARCH_RESULT_ESPOT',
  },
  abandonment_modal: {
    HOME: 'ABANDONMENT_SIGNUP_MODAL_HOME',
    CATEGORY: 'ABANDONMENT_SIGNUP_MODAL_CATEGORY',
    PDP: 'ABANDONMENT_SIGNUP_MODAL_PDP',
  },
  marketing_slider: {
    MARKETING_SLIDE_UP_ESPOT: 'MARKETING_SLIDE_UP_ESPOT',
  },
  pdp: {
    'CE Product espot - column 1 position 1': 'col1pos1',
    'CE Product espot - column 1 position 2': 'col1pos2',
    'Klarna-PDP-E-Spot-1': 'klarna1',
    'Klarna-PDP-E-Spot-2': 'klarna2',
    'CE Product espot - column 2 position 1': 'col2pos1',
    'CE Product espot - column 2 position 2': 'col2pos2',
    'CE Product espot - column 2 position 4': 'col2pos4',
    CE3_CONTENT_ESPOT_1: 'content1',
  },
  orderSummary: {
    ddp_renewal_expiring: 'ddp_renewal_expiring',
    ddp_renewal_expired: 'ddp_renewal_expired',
    ddp_terms_and_conditions: 'ddp_terms_and_conditions',
  },
  bundles: {
    'CE Product espot - column 1 position 1': 'col1pos1',
    'Klarna-PDP-E-Spot-1': 'klarna1',
    CE3_CONTENT_ESPOT_1: 'content1',
    'Klarna-PDP-E-Spot-2': 'klarna2',
  },
  thankyou: {
    CONFIRMATION_DISCOVER_MORE: 'CONFIRMATION_DISCOVER_MORE',
  },
}

export const SET_ESPOT_DATA = 'SET_ESPOT_DATA'
export const REMOVE_PLP_ESPOTS = 'REMOVE_PLP_ESPOTS'
export const ABANDONMENT_MODAL_ERROR = 'ABANDONMENT_MODAL_ERROR'
export const espotEndpoint = '/espots'

const { ESPOT_CONTENT_TYPE } = cmsConsts

export function setEspotContent(espotData) {
  return (dispatch, getState) =>
    Promise.all(
      espotData.map(({ responsiveCMSUrl }) => {
        if (!responsiveCMSUrl) {
          return null
        }
        // pathname and query are both required to support client side and server sider rendering (See sandbox)
        const location = {
          pathname: responsiveCMSUrl,
          query: { responsiveCMSUrl },
        }
        return getContent(location, null, ESPOT_CONTENT_TYPE)(
          dispatch,
          getState
        )
      })
    )
}

export function getEspotData(espots) {
  if (!espots || !Array.isArray(espots) || !espots.length) return

  const query = joinQuery({ items: espots.join(',') })
  return get(`${espotEndpoint}${query}`)
}

export function setEspotData(responsiveEspotData) {
  return (dispatch) => {
    responsiveEspotData.forEach(
      ({ identifier, responsiveCMSUrl, position, isPlpEspot = false }) => {
        dispatch({
          type: SET_ESPOT_DATA,
          payload: {
            identifier,
            responsiveCMSUrl,
            position,
            isPlpEspot,
          },
        })
      }
    )
  }
}

export function setEspot(
  apiResponse,
  espotGroupId,
  apiResponsePath = ['EspotContents', 'cmsMobileContent', 'responsiveCMSUrl']
) {
  return (dispatch, getState) => {
    const identifiers = pathOr(
      [],
      ['espot', 'identifiers', espotGroupId],
      getState()
    )
    const espotData = identifiers
      .map((identifier) => {
        const responsiveCMSUrl = path(
          [identifier, ...apiResponsePath],
          apiResponse
        )
        return (
          responsiveCMSUrl && {
            identifier,
            responsiveCMSUrl: fixCmsUrl(responsiveCMSUrl),
          }
        )
      })
      .filter(Boolean)
    setEspotData(espotData)(dispatch)
    return setEspotContent(espotData)(dispatch, getState)
  }
}

export function removePlpEspots() {
  return {
    type: REMOVE_PLP_ESPOTS,
  }
}

export function setThankyouPageEspots(apiResponse) {
  return (dispatch, getState) => {
    return setEspot(apiResponse.espots, espotGroupId.THANKYOU)(
      dispatch,
      getState
    )
  }
}

export function setNavigationEspots(apiResponse) {
  return (dispatch, getState) => {
    return setEspot(apiResponse, espotGroupId.NAVIGATION)(dispatch, getState)
  }
}

export function setMiniBagEspots(apiResponse) {
  return (dispatch, getState) => {
    const setEspotPromises = []
    setEspotPromises.push(
      setEspot(apiResponse.espots, espotGroupId.MINI_BAG)(dispatch, getState)
    )

    const { products = [] } = apiResponse
    const firstProduct = products[0]
    if (firstProduct) {
      setEspotPromises.push(
        setEspot(firstProduct, espotGroupId.MINI_BAG_MIDDLE)(dispatch, getState)
      )
    }
    return Promise.all(setEspotPromises)
  }
}

export function setPDPEspots(apiResponse) {
  return (dispatch, getState) => {
    return setEspot(apiResponse, espotGroupId.PRODUCT)(dispatch, getState)
  }
}

export function setProductListEspots(apiResponse) {
  return (dispatch, getState) => {
    const records = pathOr([], ['records'], apiResponse)
    const promises = []

    /*
     * TODO clean this up, do we need to handle this differently compared to other
     * espot groups? Can we consolidate these two approaches?
     */
    dispatch(removePlpEspots())
    records.forEach((record) => {
      const position = record.Position
      const identifier = `productList${position}`

      const responsiveCMSUrl = path(
        ['contentForMonty', 'members', 'cmsMobileContent', 'responsiveCMSUrl'],
        record
      )

      const responsiveEspotData = [
        {
          identifier,
          responsiveCMSUrl: fixCmsUrl(responsiveCMSUrl),
          position,
          isPlpEspot: true,
        },
      ]
      setEspotData(responsiveEspotData)(dispatch)
      promises.push(setEspotContent(responsiveEspotData)(dispatch, getState))
    })

    return Promise.all(promises)
  }
}

export function setOrderSummaryEspots(apiResponse) {
  return (dispatch, getState) => {
    return setEspot(apiResponse, espotGroupId.ORDER_SUMMARY)(dispatch, getState)
  }
}

const mapEspotKeys = (apiResponse, page, groupId) =>
  Object.entries(apiResponse.espots).reduce((acc, [key, value]) => {
    const espotsDesktopKey = espotKeysMap[page][key]
    if (espotsDesktopKey) {
      const mappedKey = espotDesktopConstants[groupId][espotsDesktopKey]
      if (mappedKey) return { ...acc, [mappedKey]: value }
    }
    return acc
  }, {})

/**
 * To personalise the PDP page's espots a new /espots endpoint has been created
 * to fetch the required responsiveCMSUrls (which determine the content shown)
 * without any caching.
 * It uses different keys to describe espots to the ones we use in Monty so we
 * have to map the keys in the response before setting them.
 */
export function getPDPEspots(page = 'pdp') {
  return (dispatch) => {
    const espotNames = Object.keys(espotKeysMap[page])
    return dispatch(getEspotData(espotNames)).then(({ body }) => {
      return dispatch(
        setPDPEspots(mapEspotKeys(body, page, espotGroupId.PRODUCT))
      )
    })
  }
}

export function getPDPBundleEspots() {
  return getPDPEspots('bundles')
}

/**
 * @param {string[]} espotKeyList - a list of espot keys used to generate query string incall to espots api
 * @param {string} espotIdentifiersId - this is used to select the correct list of identifiers from the espot identifiers
 *  slice of the store
 */
function getEspot(espotKeys, espotIdentifiersId) {
  return (dispatch) =>
    dispatch(getEspotData(espotKeys)).then(({ body }) =>
      dispatch(setEspot(body && body.espots, espotIdentifiersId))
    )
}

export function getOrderCompleteEspot() {
  return getEspot(['CONFIRMATION_DISCOVER_MORE'], espotGroupId.THANKYOU)
}

export function getContactBanner() {
  return getEspot(['CONTACT_BANNER'], espotGroupId.SHARED)
}

export function getNoSearchResultsEspot() {
  return getEspot(['NO_SEARCH_RESULT_ESPOT'], espotGroupId.SEARCH_RESULTS)
}

export function setAbandonmentModalEspotError() {
  return {
    type: ABANDONMENT_MODAL_ERROR,
  }
}

export function getDDPTermsAndConditions() {
  return getEspot(['ddp_terms_and_conditions'], espotGroupId.ORDER_SUMMARY)
}

export function getDDPRenewalEspots() {
  return getEspot(
    ['ddp_renewal_expiring', 'ddp_renewal_expired'],
    espotGroupId.ORDER_SUMMARY
  )
}

export function getAbandonmentModalEspot(espot) {
  return async (dispatch) => {
    try {
      await dispatch(getEspot([espot], espotGroupId.ABANDONMENT_MODAL))
    } catch (e) {
      await dispatch(setAbandonmentModalEspotError())
    }
  }
}

export function getMarketingSlideUpEspot() {
  return getEspot(['MARKETING_SLIDE_UP_ESPOT'], espotGroupId.MARKETING_SLIDE_UP)
}
