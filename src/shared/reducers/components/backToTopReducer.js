import { UPDATE_LOCATION } from 'react-router-redux'
import createReducer from '../../lib/create-reducer'

export default createReducer(
  { isVisible: false },
  {
    [UPDATE_LOCATION]: (state) => ({ ...state, isVisible: false }),
    SET_BACK_TO_TOP_VISIBLE: (state, { isVisible }) => ({
      ...state,
      isVisible,
    }),
  }
)
