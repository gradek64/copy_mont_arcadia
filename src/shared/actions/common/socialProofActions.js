import superagent from 'superagent'
import { getRegion } from '../../selectors/common/configSelectors'
import {
  getSocialProofConfigForView,
  getDistinctSocialProofConfigs,
  getBrandName,
  getSocialProofBannersCMSPageID,
  getStoreCode,
} from '../../selectors/configSelectors'
import {
  isFeatureSocialProofEnabled,
  isFeatureSocialProofEnabledForView,
} from '../../selectors/featureSelectors'
import {
  hasFetchedTrendingProductsRecently,
  hasFetchedSocialProofBanners,
} from '../../selectors/socialProofSelectors'

import { error, nrBrowserLogError } from '../../../client/lib/logger'

/**
 * we could use Qubit's http-api-tally package to fetch the social proof data
 * but to save on bundle size we're hitting the API directly
 * see https://docs.qubit.com/content/developers/api-tally
 */

const tallyEndpoint = 'https://tally-1.qubitproducts.com/tally'
const cmsEndpoint = '/cmscontent/page-data'

const op_type = 'topk'

export const getTrendingProducts = (view) => {
  return (dispatch, getState) => {
    const state = getState()
    const featureEnabled = isFeatureSocialProofEnabledForView(state, view)
    const hasAlreadyFetchedRecently = hasFetchedTrendingProductsRecently(
      state,
      view
    )

    const { counter, k } = getSocialProofConfigForView(state, view)

    /**
     * Note, we only fetch the trending products once every 30 mins unless the
     * user increments the count for a product
     */
    if (!featureEnabled || hasAlreadyFetchedRecently || !(counter && k)) {
      return Promise.resolve()
    }

    const brandName = getBrandName(state)
    const region = getRegion(state)

    /**
     * Note, the Tally endpoint expects a path of the following shape:
     * /tally/tracking_id/op_type/counter
     * However it does not enforce that you use the given property's real
     * tracking_id. We want to keep a count of the top trending products per
     * catalog, so we are using brandName-region instead
     */
    return superagent
      .get(`${tallyEndpoint}/${brandName}-${region}/${op_type}/${counter}`)
      .query({ k })
      .then((res) => {
        if (res && res.status === 200) {
          const { body: { data } = {} } = res
          /**
           * data should be an array of 250 arrays that look like this:
           * ["topshop::t201_product-2::topk::35389499", "606"]
           * where 606 is the number of times that the product with ID
           * 35389499 has been added to basket so far that day
           */
          if (Array.isArray(data)) {
            const trendingProductCounts = data.reduce(
              (mapping, [tallyKey, count]) => {
                const parts = tallyKey.split('::')
                if (parts[3] && count) {
                  return { ...mapping, [parts[3]]: Number(count) }
                }
                return mapping
              },
              {}
            )
            return dispatch({
              type: 'FETCH_SOCIAL_PROOF_SUCCESS',
              counter,
              trendingProductCounts,
            })
          }

          throw new Error('Invalid data received from Qubit Tally endpoint')
        }
      })
      .catch((e) => {
        error('tally', e)
        nrBrowserLogError('Error fetching Trending Product data from Tally', e)
      })
  }
}

const incrementCounter = ({
  productId,
  counter,
  timePeriod,
  brandName,
  region,
}) => {
  return (dispatch) => {
    if (!(counter && timePeriod)) return Promise.resolve()

    return superagent
      .post(
        `${tallyEndpoint}/${brandName}-${region}/${op_type}/${counter}/${productId}/${timePeriod}`
      )
      .then(({ body }) => {
        if (!body || body.status !== 'saved') {
          throw new Error('Error posting Trending Product data from Tally')
        }

        return dispatch({
          type: 'RESET_SOCIAL_PROOF',
          counter,
        })
      })
      .catch((e) => {
        error('tally', e)
        nrBrowserLogError('Error posting Trending Product data from Tally', e)
      })
  }
}

export const incrementSocialProofCounters = (productId) => {
  return (dispatch, getState) => {
    // We do not want this thunk to throw an error / return a rejected promise
    // as it is dispatched from other actions with specific error handling

    const state = getState()
    const featureEnabled = isFeatureSocialProofEnabled(state)

    if (!featureEnabled) return Promise.resolve()

    const brandName = getBrandName(state)
    const region = getRegion(state)

    return Promise.all(
      getDistinctSocialProofConfigs(state).map(({ counter, timePeriod }) =>
        incrementCounter({ productId, counter, timePeriod, brandName, region })(
          dispatch
        )
      )
    )
  }
}

const getECMCPageImages = (cmsPageId, brandName, storeCode) => {
  return superagent
    .get(`${cmsEndpoint}/${brandName}/${storeCode}`)
    .query({
      seoUrl: `/cms/pages/json/json-${cmsPageId}/json-${cmsPageId}.json`,
    })
    .then(({ body }) => {
      try {
        const page = body.page.pageData[0]
        const rowContent = page.options.descendants[0]
        const colContent = rowContent.options.descendants[0]
        const socialProof = colContent.options.descendants[0]
        const socialProofImages = socialProof.options.images

        return socialProofImages
      } catch (e) {
        throw new Error('Error with the JSON structure from ECMC')
      }
    })
}

export const getSocialProofBanners = () => {
  return (dispatch, getState) => {
    const state = getState()
    const hasAlreadyFetchedBanners = hasFetchedSocialProofBanners(state)
    const featureEnabled = isFeatureSocialProofEnabled(state)
    const cmsPageId = getSocialProofBannersCMSPageID(state)

    if (!featureEnabled || hasAlreadyFetchedBanners || !cmsPageId)
      return Promise.resolve()

    const brandName = getBrandName(state)
    const storeCode = getStoreCode(state)

    return getECMCPageImages(cmsPageId, brandName, storeCode)
      .then((images) => {
        if (images) {
          const { PLP: plpBanners, orderProduct: orderProductBanners } = images

          dispatch({
            type: 'FETCH_SOCIAL_PROOF_BANNERS_SUCCESS',
            plpBanners,
            orderProductBanners,
          })
        }
      })
      .catch((e) => {
        error('SocialProof', e)
        nrBrowserLogError('Error getting Trending Product banners from ECMC', e)
      })
  }
}
