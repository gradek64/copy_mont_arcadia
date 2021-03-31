import {
  trimFromFileExtension,
  floatToPriceString,
} from '../../lib/string-utils'
import superagent from 'superagent'
import { error, nrBrowserLogError } from '../../../client/lib/logger'
import { getRegion } from '../../selectors/common/configSelectors'
import { getRouteFromUrl } from '../../lib/get-product-route'
import { removeQuery } from '../../lib/query-helper'

function formatDressipiData({
  event_id: eventId,
  similar_items,
  garment_data,
}) {
  const { content_id: contentId, items } = similar_items
  return {
    eventId,
    contentId,
    dressipiRecommendations: items.map(({ garment_id }, position) => {
      const {
        name,
        product_id,
        feed_image_urls,
        old_price: unitPrice,
        price: salePrice,
        product_code: productCode,
        id,
        url,
      } =
        garment_data.find((data) => data.product_code === garment_id) || {}
      return {
        name,
        productId: parseInt(product_id, 10),
        img: feed_image_urls[0],
        amplienceUrl: trimFromFileExtension(feed_image_urls[0], 'jpg'),
        salePrice: floatToPriceString(salePrice),
        unitPrice: floatToPriceString(unitPrice),
        productCode,
        id,
        position,
        url: removeQuery(getRouteFromUrl(url)),
      }
    }),
  }
}

function setDressipiRelatedRecommendations(dressipiRecommendations) {
  return {
    type: 'SET_RELATED_RECOMMENDATIONS',
    dressipiRecommendations,
  }
}

function setDressipiEventData(eventId, contentId) {
  return {
    type: 'SET_DRESSIPI_EVENT_DATA',
    eventId,
    contentId,
  }
}

function clearDressipiRecommendations() {
  return {
    type: 'CLEAR_RELATED_RECOMMENDATIONS',
  }
}

function clearDressipiEventData() {
  return {
    type: 'CLEAR_DRESSIPI_EVENT_DATA',
  }
}

export function fetchDressipiRelatedRecommendations(
  productId,
  dressipiBaseUrl
) {
  return (dispatch, getState) => {
    const state = getState()
    const region = getRegion(state).toUpperCase()
    const url = `${dressipiBaseUrl}/api/items/${productId}/related?methods=similar_items&locale=${region}&language=${region}&exclude_source_garment=true&max_similar_items=5&garment_format=detailed&identifier_type=product-code`
    return superagent
      .get(url)
      .withCredentials()
      .then((res) => {
        const {
          dressipiRecommendations,
          eventId,
          contentId,
        } = formatDressipiData(res.body)
        dispatch(setDressipiRelatedRecommendations(dressipiRecommendations))
        dispatch(setDressipiEventData(eventId, contentId))
      })
      .catch((e) => {
        error('Dressipi Related Products', e)
        nrBrowserLogError('Error fetching Related Products from Dressipi', e)
        dispatch(clearDressipiRecommendations())
        dispatch(clearDressipiEventData())
      })
  }
}

export function clickRecommendation(id) {
  return {
    type: 'CLICK_RECOMMENDATION',
    id,
  }
}
