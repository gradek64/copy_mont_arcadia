import { get } from '../../lib/api-service'

export function setSiteOptions(siteOptions) {
  return {
    type: 'SET_SITE_OPTIONS',
    siteOptions,
  }
}

export function getSiteOptions() {
  return (dispatch) =>
    dispatch(get('/site-options')).then((response) => {
      const { body } = response
      dispatch(setSiteOptions(body))
    })
}
