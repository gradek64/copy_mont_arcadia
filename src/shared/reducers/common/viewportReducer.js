import createReducer from '../../lib/create-reducer'
import { LANDSCAPE, PORTRAIT } from '../../constants/viewportConstants'

export default createReducer(
  {
    height: 0,
    width: 0,
    pageHeight: 0,
    iosAgent: false,
    media: 'mobile',
    touch: false,
  },
  {
    UPDATE_MEDIA_TYPE: (state, { media }) => ({
      ...state,
      media,
    }),
    UPDATE_WINDOW: (state, { data: { height, width } }) => ({
      ...state,
      height,
      width,
      orientation: height >= width ? PORTRAIT : LANDSCAPE,
    }),
    UPDATE_PAGE_HEIGHT: (state, { pageHeight }) => ({
      ...state,
      pageHeight,
    }),
    UPDATE_AGENT: (state, { iosAgent }) => ({
      ...state,
      iosAgent,
    }),
    UPDATE_TOUCH: (state, { touch }) => ({
      ...state,
      touch,
    }),
  }
)
