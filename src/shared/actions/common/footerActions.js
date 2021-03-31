import { get } from '../../lib/api-service'
import { setGenericError } from './errorMessageActions'
import { isMobile } from '../../selectors/viewportSelectors'

export function getFooterContent() {
  return (dispatch, getState) => {
    if (!isMobile(getState())) {
      return dispatch(get('/footers'))
        .then(({ body }) => {
          if (!body || !body.pageData) return // NOTE: we can't check the error until scrapi is active
          const pageData = body.pageData && body.pageData[0]
          if (
            !pageData ||
            !pageData.data.categories ||
            !pageData.data.newsletter
          ) {
            return dispatch(
              setGenericError({ message: 'Footer template error' })
            )
          }
          dispatch({
            type: 'SET_FOOTER_CATEGORIES',
            footerCategories: pageData.data.categories,
          })
          dispatch({
            type: 'SET_FOOTER_NEWSLETTER',
            newsletter: pageData.data.newsletter,
          })
        })
        .catch((err) => {
          if (err.response && err.response.body) {
            err.message = err.response.body.message
            return dispatch(setGenericError(err))
          }
          // return dispatch(setApiError(err)) // NOTE: KEEP DISABLE FOR FOOTERS
        })
    }
    return Promise.resolve()
  }
}
export const setFooterConfig = (config) => {
  return {
    type: 'SET_FOOTER_CONFIG',
    config,
  }
}
