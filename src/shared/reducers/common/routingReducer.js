import createReducer from '../../lib/create-reducer'
import { UPDATE_LOCATION } from 'react-router-redux'

const updateLocationUrl = (visited, url) => {
  if (visited.length === 0) return [url]
  return visited[visited.length - 1] !== url ? [...visited, url] : [...visited]
}

const removeFromVisited = (visited, index) => {
  if (index >= visited.length) return visited
  return [...visited.slice(0, index), ...visited.slice(index + 1)]
}

/*

We should be able to delete REMOVE_FROM_VISITED by replacing the last item in
visited array on UPDATE_LOCATION. Then we can remove removeFromVisited action
creator. This should mean that the visited array is more accurate
because there may be other places that people replace the location
but don't updated the visited array.

 */

export default createReducer(
  { location: { pathname: '', query: {} }, visited: [] },
  {
    [UPDATE_LOCATION]: (state, { payload }) => ({
      ...state,
      visited: updateLocationUrl(state.visited, payload.pathname),
      location: {
        ...state.location,
        ...payload,
      },
    }),
    UPDATE_LOCATION_SERVER: (state, { location }) => ({
      ...state,
      location,
    }),
    URL_REDIRECT_SERVER: (state, { redirect }) => ({
      ...state,
      redirect,
    }),
    SET_PAGE_STATUS_CODE: (state, { statusCode }) => ({
      ...state,
      pageStatusCode: statusCode,
    }),
    REMOVE_FROM_VISITED: (state, { index }) => ({
      ...state,
      visited: removeFromVisited(state.visited, index),
    }),
  }
)
