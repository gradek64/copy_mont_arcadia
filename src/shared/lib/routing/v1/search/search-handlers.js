import { getServerProducts } from '../../../../actions/common/productsActions'

export const searchRedirect = ({ dispatch }, nextState, replace, cb) => {
  if (process.browser) {
    return cb()
  }
  dispatch(getServerProducts(nextState.location, replace))
    .then(cb)
    .catch(cb)
}
