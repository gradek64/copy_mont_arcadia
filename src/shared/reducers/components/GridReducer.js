import createReducer from '../../lib/create-reducer'

const initialGridState = {
  options: {
    default: [2, 3, 4],
    mobile: [1, 2, 3],
  },
  columns: 2,
}

export default createReducer(initialGridState, {
  SET_GRID_LAYOUT: (state, { columns }) => ({ ...state, columns }),
  UPDATE_MEDIA_TYPE: (state, { media }) => ({
    ...state,
    columns: media === 'mobile' ? 2 : 3,
  }),
})
