import createReducer from '../../lib/create-reducer'

const initialHiddenPagesState = {
  hiddenPagesAbove: [],
  numberOfPagesHiddenAtEnd: 0,
}

const initialState = {
  currentPage: 1,
  isActive: true,
  hiddenPages: initialHiddenPagesState,
}

export default createReducer(initialState, {
  NEXT_PAGE_INFINITY: (state) => ({
    ...state,
    currentPage: state.currentPage + 1,
  }),
  SET_INFINITY_PAGE: (state, { page, shouldResetHiddenPageState }) => {
    if (shouldResetHiddenPageState) {
      return {
        ...state,
        currentPage: page,
        hiddenPages: initialHiddenPagesState,
      }
    }
    return {
      ...state,
      currentPage: page,
    }
  },
  SET_INFINITY_ACTIVE: (state) => ({
    ...state,
    isActive: true,
  }),
  SET_INFINITY_INACTIVE: (state) => ({
    ...state,
    isActive: false,
  }),
  PRESERVE_SCROLL: (state, { preservedScroll }) => ({
    ...state,
    preservedScroll,
  }),
  CLEAR_PRESERVE_SCROLL: (state) => ({
    ...state,
    preservedScroll: 0,
  }),
  SET_PRODUCTS: (state) => ({
    ...state,
    preservedScroll: 0,
    isActive: true,
  }),
  HIDE_PRODUCTS_ABOVE: (state, { height }) => ({
    ...state,
    hiddenPages: {
      ...state.hiddenPages,
      hiddenPagesAbove: [
        ...state.hiddenPages.hiddenPagesAbove,
        {
          height,
        },
      ],
    },
  }),

  PLP_RETURNED_TOP: (state, { numberOfPagesHiddenAtEnd }) => {
    return {
      ...state,
      hiddenPages: {
        ...state.hiddenPages,
        hiddenPagesAbove: [],
        numberOfPagesHiddenAtEnd,
      },
    }
  },

  UNHIDE_PRODUCTS_ABOVE_AND_HIDE_BELOW: (state, { pageNoToUnhideAbove }) => {
    const length = state.hiddenPages.hiddenPagesAbove.length
    if (length && length !== pageNoToUnhideAbove) {
      return state
    }

    const newLength = pageNoToUnhideAbove - 1

    if (newLength < 0) {
      return state
    }

    const slicedHiddenPagesAbove = state.hiddenPages.hiddenPagesAbove.slice(
      0,
      newLength
    )

    return {
      ...state,
      hiddenPages: {
        ...state.hiddenPages,
        hiddenPagesAbove: slicedHiddenPagesAbove,
        numberOfPagesHiddenAtEnd:
          state.hiddenPages.numberOfPagesHiddenAtEnd + 1,
      },
    }
  },
  UNHIDE_PRODUCTS_BELOW: (state) => {
    const { numberOfPagesHiddenAtEnd } = state.hiddenPages
    if (numberOfPagesHiddenAtEnd <= 0) return state
    return {
      ...state,
      isActive: true,
      hiddenPages: {
        ...state.hiddenPages,
        numberOfPagesHiddenAtEnd: numberOfPagesHiddenAtEnd - 1,
      },
    }
  },
})
