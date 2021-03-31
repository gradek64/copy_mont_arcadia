import reducer from '../BreadCrumbsReducer'
import { hideBreadCrumbs } from '../../../actions/common/breadCrumbsActions'

describe('BreadCrumbsReducer', () => {
  const initialState = {
    isHidden: false,
  }

  it('should return the initial state', () => {
    const expectedState = initialState

    expect(reducer(undefined, {})).toEqual(expectedState)
  })

  it('should handle HIDE_BREADCRUMBS', () => {
    const expectedState = {
      isHidden: true,
    }

    expect(reducer(undefined, hideBreadCrumbs(true))).toEqual(expectedState)
  })
})
