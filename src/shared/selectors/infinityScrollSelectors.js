const rootSelector = (state) => state.infinityScroll || {}

export const getHiddenPages = (state) => rootSelector(state).hiddenPages || {}

export const getHiddenPagesAbove = (state) =>
  getHiddenPages(state).hiddenPagesAbove || []

export const getNumberOfPagesHiddenAtEnd = (state) =>
  getHiddenPages(state).numberOfPagesHiddenAtEnd || 0

export const getCurrentPageFromInfinityScroll = (state) =>
  rootSelector(state).currentPage || 1
