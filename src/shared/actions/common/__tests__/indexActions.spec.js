import { updateLocationPathName } from '../indexActions'
import { UPDATE_LOCATION } from 'react-router-redux'

describe('index Actions', () => {
  it('updateLocationPathName to return expected type', () => {
    expect(updateLocationPathName('/')).toEqual({
      type: UPDATE_LOCATION,
      payload: { pathname: '/' },
    })
  })
})
