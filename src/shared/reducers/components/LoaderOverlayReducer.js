import createReducer from '../../lib/create-reducer'

export default createReducer(
  { visible: false, ajaxCounter: 0 },
  {
    TOGGLE_LOADER_OVERLAY: (state) => ({ ...state, visible: !state.visible }),
    AJAXCOUNTER_INCREMENT: (state) => ({
      visible: true,
      ajaxCounter: state.ajaxCounter + 1,
    }),
    AJAXCOUNTER_DECREMENT: (state) => {
      const currentCounter = state.ajaxCounter - 1
      return currentCounter < 1
        ? { visible: false, ajaxCounter: 0 }
        : { visible: true, ajaxCounter: currentCounter }
    },
    AJAXCOUNTER_ZERO: () => ({ visible: false, ajaxCounter: 0 }),
  }
)
