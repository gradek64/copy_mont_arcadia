import configureMockStore from '../../../../../test/unit/lib/configure-mock-store'
import * as routingActions from '../routingActions'

describe('Routing Actions', () => {
  it('removeFromVisited()', () => {
    expect(routingActions.removeFromVisited(3)).toEqual({
      type: 'REMOVE_FROM_VISITED',
      index: 3,
    })
  })
})
describe('Routing Actions and Reducers', () => {
  describe('removeFromVisited', () => {
    it('should remove item from visited if proper index', () => {
      const store = configureMockStore({
        routing: {
          visited: ['first/url', 'second/url', 'third/url'],
        },
      })
      expect(store.getState().routing.visited.length).toBe(3)
      store.dispatch(routingActions.removeFromVisited(1))
      expect(store.getState().routing.visited.length).toBe(2)
      expect(store.getState().routing.visited[0]).toBe('first/url')
      expect(store.getState().routing.visited[1]).toBe('third/url')
    })
    it('should not remove item from visited if wrong index', () => {
      const store = configureMockStore({
        routing: {
          visited: ['first/url', 'second/url', 'third/url'],
        },
      })
      expect(store.getState().routing.visited.length).toBe(3)
      store.dispatch(routingActions.removeFromVisited(4))
      expect(store.getState().routing.visited.length).toBe(3)
    })
  })

  describe('urlRedirectServer', () => {
    it('should set redirect URL', () => {
      const url = 'some-redirect-url'
      const store = configureMockStore({})

      expect(store.getState().routing.redirect).toBeUndefined()

      store.dispatch(routingActions.urlRedirectServer({ url }))

      expect(store.getState().routing.redirect).toEqual({
        url,
        permanent: false,
      })
    })
    it('should set permanent redirect URL', () => {
      const url = 'some-redirect-url'
      const permanent = true
      const store = configureMockStore({})

      expect(store.getState().routing.redirect).toBeUndefined()

      store.dispatch(routingActions.urlRedirectServer({ url, permanent }))

      expect(store.getState().routing.redirect).toEqual({
        url,
        permanent,
      })
    })
  })
})
describe('updateLocationServer', () => {
  it('should set redirect URL', () => {
    const url =
      '/reset-password-link?storeId=12556&token=4733021&hash=WQOQ1RrJpXIiJNZY9mr27OBbz4s%3D%0A&catalogId=33057&langId=-1'
    const hostname = 'http://local.m.topshop.com:8080'
    const store = configureMockStore({})
    const query = {
      storeId: '12556',
      token: '4733021',
      hash: 'WQOQ1RrJpXIiJNZY9mr27OBbz4s%3D%0A',
      catalogId: '33057',
      langId: '-1',
    }
    store.dispatch(routingActions.updateLocationServer(url, hostname))
    expect(store.getState().routing.location.query).toEqual(query)
  })
  it('should set permanent redirect URL', () => {
    const url = 'some-redirect-url'
    const permanent = true
    const store = configureMockStore({})

    expect(store.getState().routing.redirect).toBeUndefined()

    store.dispatch(routingActions.urlRedirectServer({ url, permanent }))

    expect(store.getState().routing.redirect).toEqual({
      url,
      permanent,
    })
  })
})
