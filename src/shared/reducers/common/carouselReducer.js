import createReducer from '../../lib/create-reducer'

const initialState = {
  direction: 'right',
  previous: -1,
  current: 0,
  max: 1,
  zoom: 1,
  panX: 0,
  panY: 0,
  tapMessage: undefined,
  currentItemReference: undefined,
  initialIndex: 0,
}

export default createReducer(
  {},
  {
    INIT_CAROUSEL: (state, { key, max, initialIndex }) => {
      return {
        ...state,
        [key]: {
          ...initialState,
          max,
          current: initialIndex || initialState.current,
          previous: initialIndex ? initialIndex - 1 : initialState.previous,
          initialIndex: initialIndex || initialState.initialIndex,
        },
      }
    },
    SET_CAROUSEL_INDEX: (state, { key, current }) => {
      const oldCurrent = state[key].current
      if (oldCurrent === current) return state

      return {
        ...state,
        [key]: {
          ...state[key],
          previous: oldCurrent,
          current,
        },
      }
    },
    SET_CURRENT_ITEM_REFERENCE: (state, { key, currentItemReference }) => ({
      ...state,
      [key]: {
        ...state[key],
        currentItemReference,
      },
    }),
    FORWARD_CAROUSEL: (state, { key }) => ({
      ...state,
      [key]: {
        ...state[key],
        direction: 'right',
        previous: state[key].current,
        current:
          state[key].current < state[key].max - 1 ? state[key].current + 1 : 0,
      },
    }),
    BACK_CAROUSEL: (state, { key }) => ({
      ...state,
      [key]: {
        ...state[key],
        direction: 'left',
        previous: state[key].current,
        current:
          state[key].current > 0 ? state[key].current - 1 : state[key].max - 1,
      },
    }),
    ZOOM_CAROUSEL: (state, { key, zoom }) => ({
      ...state,
      [key]: {
        ...state[key],
        zoom,
      },
    }),
    PAN_CAROUSEL: (state, { key, panX, panY }) => ({
      ...state,
      [key]: {
        ...state[key],
        panX,
        panY,
      },
    }),
  }
)
