import createReducer from '../../lib/create-reducer'

export default createReducer(
  {
    dictionary: {},
  },
  {
    SET_LOCALE_DICTIONARY: (state, { dictionary, geoIPDictionary }) => ({
      ...state,
      dictionary,
      geoIPDictionary,
    }),
  }
)
