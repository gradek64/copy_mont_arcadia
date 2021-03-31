import withStorage from '../withStorage'
import { MERGE_ACTION_SUFFIX } from '../../../../client/lib/state-sync/syncHandlerFactory'
import mockdate from 'mockdate'

describe('withStorage higher order reducer', () => {
  const testMergeActionType = `FOO${MERGE_ACTION_SUFFIX}`
  const reducerMock = jest.fn()
  const mergeActionMock = jest.fn()
  const persistMock = jest.fn()
  const storageHandler = {
    storedActions: ['SET_FOO', 'SET_BAR'],
    mergeActionType: testMergeActionType,
    merge: mergeActionMock,
    persist: persistMock,
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should throw an error when storageHandler is not provided', () => {
    expect(() => {
      withStorage()
    }).toThrow(Error)
  })

  it('should detect and call a merge action', () => {
    const decoratedReducer = withStorage(storageHandler)(reducerMock)
    const data = { test: 'data' }
    const state = {}
    const action = { type: testMergeActionType, data }
    decoratedReducer(state, action)
    expect(reducerMock).not.toHaveBeenCalled()
    expect(mergeActionMock).toHaveBeenCalledTimes(1)
    expect(mergeActionMock).toHaveBeenCalledWith(state, data)
  })

  it('should directly call the decorated reducer if stored actions array is missing', () => {
    const storageHandlerWithoutStoredActions = {}
    const decoratedReducer = withStorage(storageHandlerWithoutStoredActions)(
      reducerMock
    )
    const initialState = {}
    const action = { type: 'SET_FOO' }
    const reducerMockOutputState = { test: 'output' }
    reducerMock.mockImplementation(() => reducerMockOutputState)
    expect(reducerMock).not.toHaveBeenCalled()
    const output = decoratedReducer(initialState, action)
    expect(reducerMock).toHaveBeenCalledWith(initialState, action)
    expect(mergeActionMock).not.toHaveBeenCalled()
    expect(persistMock).not.toHaveBeenCalled()
    expect(output).toEqual(reducerMockOutputState)
  })

  it('should directly call the decorated reducer if stored actions array is empty', () => {
    const storageHandlerWithoutStoredActions = { storedActions: [] }
    const decoratedReducer = withStorage(storageHandlerWithoutStoredActions)(
      reducerMock
    )
    const initialState = {}
    const action = { type: 'SET_FOO' }
    const reducerMockOutputState = { test: 'output' }
    reducerMock.mockImplementation(() => reducerMockOutputState)
    expect(reducerMock).not.toHaveBeenCalled()
    const output = decoratedReducer(initialState, action)
    expect(reducerMock).toHaveBeenCalledWith(initialState, action)
    expect(mergeActionMock).not.toHaveBeenCalled()
    expect(persistMock).not.toHaveBeenCalled()
    expect(output).toEqual(reducerMockOutputState)
  })

  it('should directly call the decorated reducer if action is not stored', () => {
    const decoratedReducer = withStorage(storageHandler)(reducerMock)
    const initialState = {}
    const action = { type: 'ACTION_NOT_STORED' }
    const reducerMockOutputState = { test: 'output' }
    reducerMock.mockImplementation(() => reducerMockOutputState)
    expect(reducerMock).not.toHaveBeenCalled()
    const output = decoratedReducer(initialState, action)
    expect(reducerMock).toHaveBeenCalledWith(initialState, action)
    expect(mergeActionMock).not.toHaveBeenCalled()
    expect(persistMock).not.toHaveBeenCalled()
    expect(output).toEqual(reducerMockOutputState)
  })

  it('should not persist a stored action when action has persist set to false', () => {
    const decoratedReducer = withStorage(storageHandler)(reducerMock)
    const initialState = { foo: 'bar' }
    const action = { type: 'SET_FOO', foo: 'baz', persist: false }
    const reducerMockOutputState = { test: 'output' }
    reducerMock.mockImplementation(() => reducerMockOutputState)

    expect(reducerMock).not.toHaveBeenCalled()
    const outputState = decoratedReducer(initialState, action)
    expect(reducerMock).toHaveBeenCalledWith(initialState, action)
    expect(mergeActionMock).not.toHaveBeenCalled()
    expect(persistMock).not.toHaveBeenCalled()
    expect(outputState).toEqual(reducerMockOutputState)
  })

  it('should persist a stored action with lastPersistTime', () => {
    mockdate.set('1/1/2019')

    const decoratedReducer = withStorage(storageHandler)(reducerMock)
    const initialState = { bar: 'baz' }
    const action = { type: 'SET_BAR', bar: 'foo' }
    const lastPersistTime = { lastPersistTime: 1546300800000 }
    const stateWithLastPersistTime = { ...initialState, ...lastPersistTime }
    const reducerMockOutputState = { ...{ bar: 'foo' }, ...lastPersistTime }
    reducerMock.mockImplementation(() => reducerMockOutputState)

    expect(reducerMock).not.toHaveBeenCalled()
    const outputState = decoratedReducer(initialState, action)
    expect(mergeActionMock).not.toHaveBeenCalled()
    expect(reducerMock).toHaveBeenCalledWith(stateWithLastPersistTime, action)
    expect(persistMock).toHaveBeenCalledWith(reducerMockOutputState)
    expect(outputState).toEqual(reducerMockOutputState)

    mockdate.reset()
  })
})
