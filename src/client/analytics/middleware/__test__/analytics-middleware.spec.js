import reduxMiddleware, {
  actionListeners,
  addPreDispatchListeners,
  addPostDispatchListeners,
  removePreDispatchListeners,
  removePostDispatchListeners,
  triggerActionPreDispatch,
  triggerActionPostDispatch,
} from '../analytics-middleware'

describe('listenerMiddleware.js', () => {
  afterEach(() => {
    actionListeners.pre = {}
    actionListeners.post = {}
  })

  it('addPreDispatchListeners(actions, listeners)', () => {
    const spyListener1 = jest.fn()
    const spyListener2 = jest.fn()
    const spyListener3 = jest.fn()

    addPreDispatchListeners('FIRST_ACTION', spyListener1)
    addPreDispatchListeners(
      ['FIRST_ACTION', 'SECOND_ACTION'],
      [spyListener2, spyListener3]
    )

    expect(actionListeners.pre.FIRST_ACTION).toEqual([
      spyListener1,
      spyListener2,
      spyListener3,
    ])
    expect(actionListeners.pre.SECOND_ACTION).toEqual([
      spyListener2,
      spyListener3,
    ])
  })

  it('addPostDispatchListeners(actions, listeners)', () => {
    const spyListener1 = jest.fn()
    const spyListener2 = jest.fn()
    const spyListener3 = jest.fn()

    addPostDispatchListeners('FIRST_ACTION', spyListener1)
    addPostDispatchListeners(
      ['FIRST_ACTION', 'SECOND_ACTION'],
      [spyListener2, spyListener3]
    )

    expect(actionListeners.post.FIRST_ACTION).toEqual([
      spyListener1,
      spyListener2,
      spyListener3,
    ])
    expect(actionListeners.post.SECOND_ACTION).toEqual([
      spyListener2,
      spyListener3,
    ])
  })

  it('removePreDispatchListeners(actions, listeners)', () => {
    const spyListener1 = jest.fn()
    const spyListener2 = jest.fn()
    const spyListener3 = jest.fn()

    actionListeners.pre.FIRST_ACTION = [
      spyListener1,
      spyListener2,
      spyListener3,
    ]
    actionListeners.pre.SECOND_ACTION = [spyListener2, spyListener3]

    removePreDispatchListeners('FIRST_ACTION', spyListener1)
    expect(actionListeners.pre.FIRST_ACTION).toEqual([
      spyListener2,
      spyListener3,
    ])

    removePreDispatchListeners(
      ['FIRST_ACTION', 'SECOND_ACTION'],
      [spyListener1, spyListener3]
    )
    expect(actionListeners.pre.FIRST_ACTION).toEqual([spyListener2])
    expect(actionListeners.pre.FIRST_ACTION).toEqual([spyListener2])
  })

  it('removePostDispatchListeners(actions, listeners)', () => {
    const spyListener1 = jest.fn()
    const spyListener2 = jest.fn()
    const spyListener3 = jest.fn()

    actionListeners.post.FIRST_ACTION = [
      spyListener1,
      spyListener2,
      spyListener3,
    ]
    actionListeners.post.SECOND_ACTION = [spyListener2, spyListener3]

    removePostDispatchListeners('FIRST_ACTION', spyListener1)
    expect(actionListeners.post.FIRST_ACTION).toEqual([
      spyListener2,
      spyListener3,
    ])

    removePostDispatchListeners(
      ['FIRST_ACTION', 'SECOND_ACTION'],
      [spyListener1, spyListener3]
    )
    expect(actionListeners.post.FIRST_ACTION).toEqual([spyListener2])
    expect(actionListeners.post.FIRST_ACTION).toEqual([spyListener2])
  })

  it('triggerActionPreDispatch(action, store)', () => {
    const spyListener1 = jest.fn()
    const spyListener2 = jest.fn()
    const action = { type: 'MY_ACTION_NAME' }
    const store = {}
    actionListeners.pre.MY_ACTION_NAME = [spyListener1, spyListener2]

    triggerActionPreDispatch(action, store)
    expect(spyListener1).toHaveBeenCalledTimes(1)
    expect(spyListener2).toHaveBeenCalledTimes(1)
  })

  it('triggerActionPostDispatch(action, store)', () => {
    const spyListener1 = jest.fn()
    const spyListener2 = jest.fn()
    const action = { type: 'MY_ACTION_NAME' }
    const store = {}
    actionListeners.post.MY_ACTION_NAME = [spyListener1, spyListener2]

    triggerActionPostDispatch(action, store)
    expect(spyListener1).toHaveBeenCalledTimes(1)
    expect(spyListener2).toHaveBeenCalledTimes(1)
  })

  it('redux middleware', () => {
    const spyListener1 = jest.fn()
    const spyListener2 = jest.fn()
    const spyNext = jest.fn()
    const action = { type: 'MY_ACTION_NAME' }
    const store = {}

    actionListeners.pre.MY_ACTION_NAME = [spyListener1]
    actionListeners.post.MY_ACTION_NAME = [spyListener2]

    reduxMiddleware(store)(spyNext)(action)

    expect(spyListener1).toHaveBeenCalledTimes(1)
    expect(spyListener2).toHaveBeenCalledTimes(1)
    expect(spyListener1).toHaveBeenLastCalledWith(action, store)
    expect(spyNext).toHaveBeenLastCalledWith(action)
  })
})
