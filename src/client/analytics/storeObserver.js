let previousState
export const listeners = []

export const addStateListeners = (...newListeners) => {
  listeners.push(...newListeners)
}

export const removeStateListeners = (...removeListeners) => {
  for (let i = 0; i < removeListeners.length; i++) {
    for (let j = 0; j < listeners.length; j++) {
      if (removeListeners[i] === listeners[j]) {
        listeners.splice(j, 1)
        j--
      }
    }
  }
}

// the Redux store follows the observer pattern. This is the observer for triggering registered
// stateChange listeners
const storeObserver = (store) => {
  store.subscribe(() => {
    const currentState = store.getState()

    listeners.forEach((listener) => {
      listener(previousState, currentState, store)
    })

    previousState = currentState
  })
}

export default storeObserver
