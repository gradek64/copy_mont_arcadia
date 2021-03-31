import { get } from '../../lib/api-service'

const setFeatures = (enabled, overrides = {}) => ({
  type: 'SET_FEATURES',
  enabled,
  overrides,
})

const setFeature = (feature, value) => ({
  type: 'SET_FEATURE_STATE',
  feature,
  value,
})

export const initFeatures = (features, featuresOverride) => {
  return (dispatch) => {
    let overrides
    try {
      overrides = featuresOverride ? JSON.parse(featuresOverride) : {}
    } catch (e) {
      // Fall back to no overrides.
    }

    return dispatch(setFeatures(features, overrides))
  }
}

export const toggleFeature = (feature) => {
  return (dispatch, getState) => {
    const { status } = getState().features
    const isEnabled = status[feature]

    return dispatch(setFeature(feature, !isEnabled))
  }
}

const removeOverrides = () => ({ type: 'REMOVE_OVERRIDES' })

const updateFeatures = (features) => {
  return (dispatch, getState) => {
    const { overrides } = getState().features
    return dispatch(setFeatures(features, overrides))
  }
}

const syncFeatures = () => {
  return (dispatch) => {
    return dispatch(get('/features')).then(({ body: { features } }) => {
      dispatch(updateFeatures(features))
    })
  }
}

export const resetFeatures = () => {
  return (dispatch) => {
    dispatch(removeOverrides())
    dispatch(syncFeatures())
  }
}

export const initFeaturesListener = (navigator = null) => {
  return (dispatch) => {
    if (!process.browser) return
    window.setInterval(() => {
      if ((navigator || window.navigator).onLine) dispatch(syncFeatures())
    }, parseInt(process.env.FEATURES_POLLING_INTERVAL, 10) || 600000)
  }
}
