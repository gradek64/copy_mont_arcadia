const rootSelector = (state) => state.dressipiRecommendations || {}

export const getDressipiRelatedRecommendations = (state) =>
  rootSelector(state).dressipiRecommendations || {}

export const getDressipiContentId = (state) =>
  rootSelector(state).contentId || null

export const getDressipiEventId = (state) => rootSelector(state).eventId || null
