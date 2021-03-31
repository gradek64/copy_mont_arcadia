import createReducer from '../../lib/create-reducer'
import { ALL_FEATURES } from '../../constants/features'
import { invertObj, values } from 'ramda'
import { setJSON, removeItem } from '../../../client/lib/cookie'

const ALL_IDS = values(ALL_FEATURES)
const ALL_FEATURES_BY_ID = invertObj(ALL_FEATURES)

const initialState = {
  status: {},
  overrides: null,
}

const getConfigurableFlagValue = (features, flag) => {
  for (let i = 0; i < features.length; i++) {
    if (typeof features[i] === 'object' && Object.keys(features[i])[0] === flag)
      return features[i][flag]
  }
  return false
}

export default createReducer(initialState, {
  SET_FEATURES: (state, { enabled, overrides }) => {
    const status = ALL_IDS.reduce((result, next) => {
      const feature = ALL_FEATURES_BY_ID[next]
      return {
        ...result,
        [feature]:
          feature in overrides
            ? overrides[feature]
            : enabled.includes(next)
              ? true
              : getConfigurableFlagValue(enabled, next),
      }
    }, {})

    return {
      ...state,
      status,
      overrides,
    }
  },
  SET_FEATURE_STATE: (state, { feature, value, setCookie = true }) => {
    const overrides = {
      ...state.overrides,
      [feature]: value,
    }

    // Sync it to cookies to allow reloading
    if (setCookie) setJSON('featuresOverride', overrides) // TODO get rid of side effect from reducer!

    return {
      ...state,
      status: {
        ...state.status,
        [feature]: value,
      },
      overrides,
    }
  },
  /*
   * NB: TOGGLE_FEATURE is required by the Monty Browser Extension to
   *     override feature flags at runtime without a rebuild.
   * 
   * See https://github.com/ag-digital/monty-browser-extension
   */
  TOGGLE_FEATURE: (state, { feature }) => {
    const isEnabled = state.status[feature]
    const overrides = {
      ...state.overrides,
      [feature]: !isEnabled,
    }

    // Sync it to cookies to allow reloading
    setJSON('featuresOverride', overrides) // TODO get rid of side effect from reducer!

    return {
      ...state,
      status: {
        ...state.status,
        [feature]: !isEnabled,
      },
      overrides,
    }
  },
  REMOVE_OVERRIDES: (state) => {
    removeItem('featuresOverride')

    return {
      ...state,
      overrides: {},
    }
  },
})
