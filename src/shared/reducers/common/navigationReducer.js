import R from 'ramda'
import createReducer from '../../lib/create-reducer'

export default createReducer(
  {
    menuLinks: [],
    categoryHistory: [],
    productCategories: [],
    userDetailsGroup: [],
    helpAndInfoGroup: [],
    error: {},
    megaNav: {},
    footerCategories: [],
    megaNavSelectedCategory: '',
    megaNavHeight: 0,
  },
  {
    GET_CATEGORIES: (
      state,
      { menuLinks, productCategories, userDetailsGroup, helpAndInfoGroup }
    ) => ({
      ...state,
      menuLinks,
      productCategories,
      userDetailsGroup,
      helpAndInfoGroup,
    }),
    PUSH_CATEGORY_HISTORY: (state, { menuItem }) =>
      R.merge(state, {
        categoryHistory: R.concat(state.categoryHistory, [menuItem]),
      }),
    POP_CATEGORY_HISTORY: (state) =>
      R.merge(state, {
        categoryHistory: R.slice(0, -1, state.categoryHistory),
      }),
    UPDATE_USER_DETAILS_GROUP: (state, { newUserDetailsGroup }) => ({
      ...state,
      userDetailsGroup: newUserDetailsGroup,
    }),
    ERROR_HANDLING_NAVIGATION: (state, { error }) => ({ ...state, error }),
    RESET_CATEGORY_HISTORY: (state) => ({ ...state, categoryHistory: [] }),
    SET_MEGA_NAV: (state, { megaNav }) => ({
      ...state,
      megaNav,
    }),
    SET_FOOTER_CATEGORIES: (state, { footerCategories }) => ({
      ...state,
      footerCategories:
        footerCategories.length > 5
          ? footerCategories.slice(0, 5)
          : footerCategories,
    }),
    SET_MEGA_NAV_SELECTED_CATEGORY: (state, { megaNavSelectedCategory }) => ({
      ...state,
      megaNavSelectedCategory,
    }),
    SET_MEGA_NAV_HEIGHT: (state, { megaNavHeight }) => ({
      ...state,
      megaNavHeight,
    }),
  }
)
