import * as actions from '../featuresActions'

jest.mock('../../../lib/api-service')

describe('featuresActions', () => {
  const testSyncFeatures = (syncFeatures) => {
    const features = {
      overrides: 'test overrides',
    }
    const dispatch = jest.fn()
    const apiService = require('../../../lib/api-service')
    const mockGetReturnValue = 'mock'

    apiService.get.mockReturnValue(mockGetReturnValue)

    dispatch.mockReturnValue(Promise.resolve({ body: { features } }))

    const promiseFromSyncFeatures = syncFeatures(dispatch)

    expect(dispatch.mock.calls.length).toBe(1)
    expect(dispatch.mock.calls[0][0]).toEqual(mockGetReturnValue)

    return promiseFromSyncFeatures.then(() => {
      const updateFeatures = dispatch.mock.calls[1][0]
      const getState = () => ({ features })
      const setFeaturesExpectedAction = {
        type: 'SET_FEATURES',
        enabled: features,
        overrides: features.overrides,
      }

      updateFeatures(dispatch, getState)

      expect(dispatch.mock.calls.length).toBe(3)
      expect(dispatch.mock.calls[2][0]).toEqual(setFeaturesExpectedAction)
    })
  }

  describe('initFeatures', () => {
    it('should dispatch setFeatures with overrides', () => {
      const dispatch = jest.fn()
      const expected = {
        enabled: 'enabled',
        overrides: {
          MOCK_FEATURE: 'test',
        },
        type: 'SET_FEATURES',
      }
      const features = expected.enabled
      const featuresOverride = JSON.stringify(expected.overrides)

      actions.initFeatures(features, featuresOverride)(dispatch)

      expect(dispatch.mock.calls.length).toBe(1)
      expect(dispatch.mock.calls[0][0]).toEqual(expected)
    })

    it('should dispatch setFeatures without overrides', () => {
      const dispatch = jest.fn()
      const expected = {
        enabled: 'enabled',
        overrides: {},
        type: 'SET_FEATURES',
      }
      const features = expected.enabled
      const featuresOverride = null

      actions.initFeatures(features, featuresOverride)(dispatch)

      expect(dispatch.mock.calls.length).toBe(1)
      expect(dispatch.mock.calls[0][0]).toEqual(expected)
    })

    it('should dispatch setFeatures with invalid json', () => {
      const dispatch = jest.fn()
      const expectedAction = {
        enabled: 'enabled',
        overrides: {},
        type: 'SET_FEATURES',
      }
      const features = expectedAction.enabled
      const featuresOverride = 'invalid json'

      actions.initFeatures(features, featuresOverride)(dispatch)

      expect(dispatch.mock.calls.length).toBe(1)
      expect(dispatch.mock.calls[0][0]).toEqual(expectedAction)
    })
  })

  it('should dispatch a chain of actions for syncFeatures', () => {
    const dispatch = jest.fn()
    const removeOverridesExpectedAction = {
      type: 'REMOVE_OVERRIDES',
    }

    actions.resetFeatures()(dispatch)

    expect(dispatch.mock.calls.length).toBe(2)
    expect(dispatch.mock.calls[0][0]).toEqual(removeOverridesExpectedAction)

    return testSyncFeatures(dispatch.mock.calls[1][0])
  })

  describe('toggleFeature', () => {
    it('should activate the feature flag if it is disabled', () => {
      const feature = 'test feature'
      const getState = () => ({ features: { status: { [feature]: false } } })
      const dispatch = jest.fn()
      const expectedAction = {
        type: 'SET_FEATURE_STATE',
        feature,
        value: true,
      }

      const action = actions.toggleFeature(feature)
      action(dispatch, getState)

      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledWith(expectedAction)
    })

    it('should disable the feature flag if it is enabled', () => {
      const feature = 'test feature'
      const getState = () => ({ features: { status: { [feature]: true } } })
      const dispatch = jest.fn()
      const expectedAction = {
        type: 'SET_FEATURE_STATE',
        feature,
        value: false,
      }

      const action = actions.toggleFeature(feature)
      action(dispatch, getState)

      expect(dispatch).toHaveBeenCalledTimes(1)
      expect(dispatch).toHaveBeenCalledWith(expectedAction)
    })
  })

  describe('initFeaturesListener', () => {
    jest.useFakeTimers()

    it('should do nothing when not in browser', () => {
      const dispatch = jest.fn()

      actions.initFeaturesListener()(dispatch)

      expect(dispatch).toHaveBeenCalledTimes(0)
      expect(setTimeout).toHaveBeenCalledTimes(0)
    })

    it('should set interval', () => {
      const dispatch = jest.fn()

      process.browser = true
      const interval = 123
      process.env.FEATURES_POLLING_INTERVAL = interval

      actions.initFeaturesListener({ onLine: false })(dispatch)
      jest.advanceTimersByTime(process.env.FEATURES_POLLING_INTERVAL)

      expect(dispatch).toHaveBeenCalledTimes(0)
      expect(setInterval).toHaveBeenCalledTimes(1)
      expect(setInterval.mock.calls[0][1]).toBe(interval)
    })

    it('should syncFeatures when navigator.onLine', () => {
      const dispatch = jest.fn()

      process.browser = true
      process.env.FEATURES_POLLING_INTERVAL = 123

      actions.initFeaturesListener({ onLine: true })(dispatch)
      jest.advanceTimersByTime(process.env.FEATURES_POLLING_INTERVAL)

      expect(dispatch).toHaveBeenCalledTimes(1)

      return testSyncFeatures(dispatch.mock.calls[0][0])
    })
  })
})
