import createReducer from '../../lib/create-reducer'

export default createReducer(
  {},
  {
    SET_DEFAULT_VIEW: (state, { viewType }) => {
      const { defaultViewType } = state
      return defaultViewType
        ? state
        : {
            ...state,
            defaultViewType:
              defaultViewType === undefined ? viewType : undefined,
          }
    },
    SELECT_VIEW: (state, { viewType }) => {
      return {
        ...state,
        selectedViewType: viewType,
      }
    },
  }
)
