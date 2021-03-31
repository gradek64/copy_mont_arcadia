import createReducer from '../../lib/create-reducer'

export default createReducer(
  {
    open: false,
    mode: 'normal',
    type: 'dialog',
    children: [],
    predecessorModal: null,
  },
  {
    TOGGLE_MODAL: (state, { entryPoint }) => ({
      ...state,
      open: !state.open,
      entryPoint: state.open ? null : entryPoint,
    }),
    SET_MODAL_MODE: (state, { mode }) => ({ ...state, mode }),
    SET_MODAL_TYPE: (state, { modalType }) => ({ ...state, type: modalType }),
    SET_MODAL_CANCELLED: (state, { cancelled }) => ({ ...state, cancelled }),
    SET_MODAL_CHILDREN: (state, { children }) => ({ ...state, children }),
    CLEAR_MODAL_CHILDREN: (state) => ({ ...state, children: [] }),
    OPEN_MODAL: (state, { entryPoint }) => ({
      ...state,
      open: true,
      entryPoint,
    }),
    CLOSE_MODAL: (state) => {
      if (!state.open) {
        return state
      }
      return {
        ...state,
        open: false,
        entryPoint: null,
      }
    },
    SET_PREDECESSOR_MODAL: (state, { predecessorModal }) => ({
      ...state,
      predecessorModal,
    }),
  }
)
