import { setProductIsActive } from '../../../client/lib/cookie'
import { PRODUCT } from '../../constants/productImageTypes'
import { analyticsPlpClickEvent } from '../../analytics/tracking/site-interactions'

export const setDefaultView = (viewType) => ({
  type: 'SET_DEFAULT_VIEW',
  viewType,
})

export const selectView = (viewType) => (dispatch) => {
  if (process.browser) {
    setProductIsActive(viewType === PRODUCT)
  }
  analyticsPlpClickEvent(`productview-${viewType.toLowerCase()}`)

  dispatch({
    type: 'SELECT_VIEW',
    viewType,
  })
}
