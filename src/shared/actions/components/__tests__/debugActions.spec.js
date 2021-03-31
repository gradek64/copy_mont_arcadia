import { hideDebug, showDebug, allowDebug, setDebugInfo } from '../debugActions'

describe('testing a debug actions', () => {
  describe(allowDebug, () => {
    it('it should return action to allow debug', () => {
      const expectedAction = {
        type: 'ALLOW_DEBUG',
      }
      expect(allowDebug()).toEqual(expectedAction)
    })
  })

  describe(setDebugInfo, () => {
    it('will return setDebugInfo', () => {
      const environmentMock = 'environmentMock'
      const buildInfoMock = { test: true }

      const expectedAction = {
        type: 'SET_DEBUG_INFO',
        environment: environmentMock,
        buildInfo: buildInfoMock,
      }
      expect(
        setDebugInfo({ environment: environmentMock, buildInfo: buildInfoMock })
      ).toEqual(expectedAction)
    })
  })

  describe(showDebug, () => {
    it('will return showDebug', () => {
      const expectedAction = {
        type: 'SHOW_DEBUG',
      }
      expect(showDebug()).toEqual(expectedAction)
    })
  })

  describe(hideDebug, () => {
    it('will return hideDebug', () => {
      const expectedAction = {
        type: 'HIDE_DEBUG',
      }
      expect(hideDebug()).toEqual(expectedAction)
    })
  })
})
