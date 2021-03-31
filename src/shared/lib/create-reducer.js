export default function createReducer(initialState, handlers) {
  return function reducer(state, action) {
    const newState = state === undefined ? initialState : state

    if (handlers[action.type]) {
      return handlers[action.type](newState, action)
    }

    return newState
  }
}
