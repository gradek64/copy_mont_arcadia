import storeObserver, {
  listeners,
  addStateListeners,
  removeStateListeners,
} from '../storeObserver'

describe('.storeObserver', () => {
  beforeEach(() => {
    listeners.splice(0, listeners.length)
  })

  it('calls store subscribe with a callback function', () => {
    const mock = jest.fn()
    const store = {
      subscribe: mock,
      getState: () => {},
    }

    storeObserver(store)
    expect(store.subscribe.mock.calls[0][0]).toEqual(expect.any(Function))
  })

  it('addStateListeners()', () => {
    const mockListener1 = jest.fn()
    const mockListener2 = jest.fn()
    const mockListener3 = jest.fn()

    addStateListeners(mockListener1)
    addStateListeners(mockListener2, mockListener3)
    expect(listeners).toEqual([mockListener1, mockListener2, mockListener3])
  })

  it('removeStateListeners()', () => {
    const mockListener1 = jest.fn()
    const mockListener2 = jest.fn()
    const mockListener3 = jest.fn()

    addStateListeners(mockListener1, mockListener2, mockListener3)
    removeStateListeners(mockListener1, mockListener3)
    expect(listeners).toEqual([mockListener2])
  })

  it('calls listener functions with currentState and previousState when state changes', () => {
    const mockListener = jest.fn()
    addStateListeners(mockListener)
    const mockSubscribe = jest.fn()
    const store = {
      subscribe: mockSubscribe,
      getState: () => 'hey i am some state',
    }

    storeObserver(store)
    mockSubscribe.mock.calls[0][0]() // invoke the subscribe callback

    expect(mockListener).toHaveBeenLastCalledWith(
      undefined,
      'hey i am some state',
      store
    )
  })
})
