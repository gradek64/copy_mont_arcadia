import createReducer from '../../lib/create-reducer'

export default createReducer(
  { pages: {} },
  {
    SET_CONTENT: (state, { pageName, content }) => ({
      ...state,
      pages: {
        ...state.pages,
        [pageName]: content,
      },
    }),
    SET_FORM: (state, { formName, content }) => ({
      ...state,
      forms: {
        ...state.forms,
        [formName]: content,
      },
    }),
    CLEAR_HYGIENE_PAGE_CONTENT: (state) => ({
      ...state,
      pages: { ...state.pages, hygienePage: false },
    }),
  }
)
