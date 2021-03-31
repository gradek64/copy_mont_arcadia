import createReducer from '../../lib/create-reducer'

export default createReducer(
  {
    dressipiRecommendations: [],
    position: 0,
    sizeLimit: 4,
    eventId: null,
    contentId: null,
  },
  {
    SET_RELATED_RECOMMENDATIONS: (state, { dressipiRecommendations }) => {
      if (dressipiRecommendations && dressipiRecommendations.length) {
        return {
          ...state,
          dressipiRecommendations,
        }
      }
      return state
    },
    CLEAR_RELATED_RECOMMENDATIONS: (state) => {
      return {
        ...state,
        dressipiRecommendations: [],
      }
    },
    UPDATE_MEDIA_TYPE: (state, { media }) => ({
      ...state,
      sizeLimit: media === 'mobile' ? 5 : 7,
      position: 0,
    }),
    SET_DRESSIPI_EVENT_DATA: (state, { eventId, contentId }) => {
      return {
        ...state,
        eventId,
        contentId,
      }
    },
    CLEAR_DRESSIPI_EVENT_DATA: (state) => {
      return {
        ...state,
        eventId: null,
        contentId: null,
      }
    },
  }
)
