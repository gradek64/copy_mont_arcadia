import configureStore from '../configure-store'

describe('configure-store', () => {
  const initalState = {}

  it('can be configured with thunk 3rd param data', () => {
    const store = configureStore(initalState, { traceId: '123R456' })

    return store.dispatch((dispatch, getState, { traceId }) => {
      expect(traceId).toBe('123R456')
    })
  })

  it('can be configured without thunk 3rd param data', () => {
    const store = configureStore(initalState)

    return store.dispatch((dispatch, getState, data) => {
      expect(data).toEqual({})
    })
  })
})
