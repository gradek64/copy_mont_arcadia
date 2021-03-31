import { path, pathOr } from 'ramda'

export const getSuccess = (state) => path(['resetPassword', 'success'], state)

export const getBasketCount = (state) =>
  pathOr(0, ['resetPassword', 'basketCount'], state)
