import testReducer from '../routingReducer'
import { UPDATE_LOCATION } from 'react-router-redux'
import configureMockStore from '../../../../../test/unit/lib/configure-mock-store'

describe('Routing Reducer', () => {
  it('Default values', () => {
    const state = configureMockStore().getState()
    expect(state.routing.visited).toEqual([])
    expect(state.routing.location.pathname).toBe('')
  })
  describe('REMOVE_FROM_VISITED', () => {
    it('index item removed from visited if proper index', () => {
      expect(
        testReducer(
          { visited: ['first/url', 'second/url'] },
          {
            type: 'REMOVE_FROM_VISITED',
            index: 1,
          }
        )
      ).toEqual({ visited: ['first/url'] })
    })
    it('index item not removed from visited if wrong index', () => {
      const visited = ['first/url', 'second/url']
      expect(
        testReducer(
          { visited },
          {
            type: 'REMOVE_FROM_VISITED',
            index: 2,
          }
        )
      ).toEqual({ visited })
    })
  })
  describe('UPDATE_LOCATION_SERVER', () => {
    it('should update location', () => {
      const newLocation = {
        pathname: 'some/mew/pathname',
      }
      expect(
        testReducer(
          { location: { pathname: 'some/location' } },
          {
            type: 'UPDATE_LOCATION_SERVER',
            location: newLocation,
          }
        )
      ).toEqual({ location: newLocation })
    })
  })
  describe('URL_REDIRECT_SERVER', () => {
    it('should set redirect', () => {
      expect(
        testReducer(
          {},
          {
            type: 'URL_REDIRECT_SERVER',
            redirect: 'redirect/url',
          }
        )
      ).toEqual({ redirect: 'redirect/url' })
    })
  })
  describe('SET_PAGE_STATUS_CODE', () => {
    it('should set pageStatusCode', () => {
      expect(
        testReducer(
          {},
          {
            type: 'SET_PAGE_STATUS_CODE',
            statusCode: 200,
          }
        )
      ).toEqual({ pageStatusCode: 200 })
    })
  })
  describe('`UPDATE_LOCATION`', () => {
    const visited = ['first/url', 'second/url']
    const location = {
      pathname: 'second/url',
    }
    it('should update pathname and add it to visited', () => {
      expect(
        testReducer(
          { visited, location },
          {
            type: UPDATE_LOCATION,
            payload: {
              pathname: 'new/url',
              query: '?query',
            },
          }
        )
      ).toEqual({
        visited: ['first/url', 'second/url', 'new/url'],
        location: {
          pathname: 'new/url',
          query: '?query',
        },
      })
    })
    it('should set pathname and add it to visited - server side render', () => {
      expect(
        testReducer(
          { visited: [], location: {} },
          {
            type: UPDATE_LOCATION,
            payload: {
              pathname: 'new/url',
              query: '?query',
            },
          }
        )
      ).toEqual({
        visited: ['new/url'],
        location: {
          pathname: 'new/url',
          query: '?query',
        },
      })
    })
    it('should not add to visited the same path two times in a row', () => {
      expect(
        testReducer(
          { visited, location },
          {
            type: UPDATE_LOCATION,
            payload: {
              pathname: 'second/url',
            },
          }
        )
      ).toEqual({
        visited: ['first/url', 'second/url'],
        location: {
          pathname: 'second/url',
        },
      })
    })
  })
})
