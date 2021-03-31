import deepFreeze from 'deep-freeze'
import cmsConsts from '../../../../constants/cmsConsts'
import * as espotActions from '../../espotActions'
import * as apiService from '../../../../lib/api-service'
import * as sandBoxActions from '../../sandBoxActions'

import { createStoreForEspots } from './test-helpers'

jest.mock('../../../../lib/api-service')
jest.mock('../../sandBoxActions')

const defaultState = {
  config: {},
  viewport: {},
  espot: {
    identifiers: {
      navigation: [],
      test: ['id2'],
    },
  },
}

describe('Espot Actions', () => {
  const dispatch = jest.fn()
  const getState = jest.fn(() => defaultState)

  const responsiveEspotData = deepFreeze([
    {
      responsiveCMSUrl: 'url1',
      identifier: 'id1',
      position: 1,
      isPlpEspot: true,
    },
  ])

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getEspotData', () => {
    it('should not make a request if arg provided is falsy', () => {
      expect(apiService.get).not.toHaveBeenCalled()
      espotActions.getEspotData()
      expect(apiService.get).not.toHaveBeenCalled()
    })

    it('should not make a request if arg provided is not array', () => {
      expect(apiService.get).not.toHaveBeenCalled()
      espotActions.getEspotData({ foo: 'bar' })
      expect(apiService.get).not.toHaveBeenCalled()
    })

    it('should not make a request if arg provided is empty array', () => {
      expect(apiService.get).not.toHaveBeenCalled()
      espotActions.getEspotData([])
      expect(apiService.get).not.toHaveBeenCalled()
    })

    it('should make a request to the espots endpoint with all array items in query', () => {
      expect(apiService.get).not.toHaveBeenCalled()
      espotActions.getEspotData(['bigOne', 'smallOne'])
      expect(apiService.get).toHaveBeenCalled()
      expect(apiService.get).toHaveBeenCalledWith(
        '/espots?items=bigOne%2CsmallOne'
      )
    })
  })

  describe('setEspotData', () => {
    it('should call dispatch with correct data', () => {
      espotActions.setEspotData(responsiveEspotData)(dispatch, getState)
      const {
        identifier,
        responsiveCMSUrl,
        position,
        isPlpEspot,
      } = responsiveEspotData[0]
      expect(dispatch).toHaveBeenCalledTimes(responsiveEspotData.length)
      expect(dispatch).toHaveBeenCalledWith({
        payload: {
          identifier,
          responsiveCMSUrl,
          position,
          isPlpEspot,
        },
        type: espotActions.SET_ESPOT_DATA,
      })
    })

    it('should provide a default of false for `isPlpEspot` if not provided', () => {
      const dataWithoutIsPlpEspot = [
        { ...responsiveEspotData[0], isPlpEspot: undefined },
      ]
      espotActions.setEspotData(dataWithoutIsPlpEspot)(dispatch, getState)
      const { identifier, responsiveCMSUrl, position } = responsiveEspotData[0]
      expect(dispatch).toHaveBeenCalledWith({
        payload: {
          identifier,
          responsiveCMSUrl,
          position,
          isPlpEspot: false,
        },
        type: espotActions.SET_ESPOT_DATA,
      })
    })
  })

  describe('setEspot', () => {
    it('should call setEspotContent which calls getContent with correct data and then dispatches action', async () => {
      const testIdentifier = 'id2'
      const identifier = 'test'
      const responsiveCMSUrl = 'test.url'

      const { store, apiResponse } = createStoreForEspots({
        identifierList: ['id2'],
        responsiveCMSUrl,
        identifier,
      })

      const getContentSpy = jest.fn(() => () => {})
      sandBoxActions.getContent = getContentSpy
      await store.dispatch(espotActions.setEspot(apiResponse, identifier))

      expect(getContentSpy).toHaveBeenCalledTimes(1)
      expect(getContentSpy).toHaveBeenCalledWith(
        {
          pathname: `/${responsiveCMSUrl}`,
          query: { responsiveCMSUrl: `/${responsiveCMSUrl}` },
        },
        null,
        cmsConsts.ESPOT_CONTENT_TYPE
      )
      expect(store.getActions()).toEqual([
        {
          type: 'SET_ESPOT_DATA',
          payload: {
            identifier: testIdentifier,
            responsiveCMSUrl: `/${responsiveCMSUrl}`,
            position: undefined,
            isPlpEspot: false,
          },
        },
      ])
    })
  })

  describe('removePlpEspots', () => {
    it('should return an action with the `REMOVE_PLP_ESPOTS` type', () => {
      expect(espotActions.removePlpEspots()).toEqual({
        type: espotActions.REMOVE_PLP_ESPOTS,
      })
    })
  })
})
