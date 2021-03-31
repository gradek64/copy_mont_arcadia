import { createSelector } from 'reselect'

const rootSelector = (state) => state.sessionTokens

export const getJsessionid = createSelector(
  rootSelector,
  (state) => state.jsessionid
)

export const getSessionJwt = createSelector(
  rootSelector,
  (state) => state.sessionJwt
)
