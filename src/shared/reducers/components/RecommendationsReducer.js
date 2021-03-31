import createReducer from '../../lib/create-reducer'
import { IMAGE_FORMAT } from '../../constants/amplience'
import { trimFromFileExtension } from '../../lib/string-utils'
import { splitQuery } from '../../lib/query-helper'

export default createReducer(
  {
    recommendations: [],
    position: 0,
    sizeLimit: 4,
  },
  {
    UPDATE_MEDIA_TYPE: (state, { media }) => ({
      ...state,
      sizeLimit: media === 'mobile' ? 5 : 7,
      position: 0,
    }),
    SET_RECOMMENDATIONS: (state, { recommendations }) => {
      if (recommendations && recommendations.length) {
        return {
          ...state,
          recommendations: recommendations.map((recommendation, index) => ({
            ...recommendation,
            productId: parseInt(splitQuery(recommendation.url).productId, 10),
            amplienceUrl: trimFromFileExtension(
              recommendation.img,
              IMAGE_FORMAT
            ),
            position: index + 1,
          })),
        }
      }
      return state
    },
    FORWARD_RECOMMENDATIONS: (state) => ({
      ...state,
      position: state.position > 0 ? state.position - 1 : state.sizeLimit,
    }),
    BACK_RECOMMENDATIONS: (state) => ({
      ...state,
      position: state.position < state.sizeLimit ? state.position + 1 : 0,
    }),
  }
)
