import { UPDATE_LOCATION } from 'react-router-redux'

export function updateLocationPathName(pathName) {
  return {
    type: UPDATE_LOCATION,
    payload: {
      pathname: pathName,
    },
  }
}
