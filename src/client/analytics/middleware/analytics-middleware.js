export const actionListeners = {
  pre: {},
  post: {},
}

// utility for addPreDispatchListeners & addPostDispatchListeners as they're almost identical
const addActionListener = (level, actions, listeners) => {
  let actionsArray = actions
  let listenersArray = listeners

  if (!Array.isArray(actions)) {
    actionsArray = [actions]
  }

  if (!Array.isArray(listeners)) {
    listenersArray = [listeners]
  }

  actionsArray.forEach((action) => {
    if (!actionListeners[level][action]) {
      actionListeners[level][action] = []
    }

    actionListeners[level][action] = [
      ...actionListeners[level][action],
      ...listenersArray,
    ]
  })
}

// utility for removePreDispatchListeners & removePostDispatchListeners as they're almost identical
const removeActionListener = (level, actions, listeners) => {
  let actionsArray = actions
  let listenersArray = listeners

  if (!Array.isArray(actions)) {
    actionsArray = [actions]
  }

  if (!Array.isArray(listeners)) {
    listenersArray = [listeners]
  }

  for (let i = 0; i < actionsArray.length; i++) {
    if (actionListeners[level][actionsArray[i]]) {
      for (let j = 0; j < listenersArray.length; j++) {
        for (
          let x = 0;
          x < actionListeners[level][actionsArray[i]].length;
          x++
        ) {
          if (
            actionListeners[level][actionsArray[i]][x] === listenersArray[j]
          ) {
            actionListeners[level][actionsArray[i]].splice(x, 1)
            x--
          }
        }
      }
    }
  }
}

// pass a single/array of Redux action types to listen for BEFORE the state is updated and the
// stateChange listeners are triggered, then trigger a single/array of listeners, recieving the
// action and store object.
export const addPreDispatchListeners = (actions, listeners) => {
  addActionListener('pre', actions, listeners)
}

// pass a single/array of Redux action types to listen for AFTER the state is updated and the
// stateChange listeners are triggered, then trigger a single/array of listeners, recieving the
// action and store object.
export const addPostDispatchListeners = (actions, listeners) => {
  addActionListener('post', actions, listeners)
}

export const removePreDispatchListeners = (actions, listeners) => {
  removeActionListener('pre', actions, listeners)
}

export const removePostDispatchListeners = (actions, listeners) => {
  removeActionListener('post', actions, listeners)
}

// utility for triggerActionPreDispatch & triggerActionPostDispatch as they're almost identical
const triggerActionListeners = (level, action, store) => {
  if (action.type) {
    const listeners = actionListeners[level][action.type]

    if (Array.isArray(listeners)) {
      listeners.forEach((listener) => listener(action, store))
    }
  }
}

// used by the redux middleware to trigger the action pre dispatch listeners
export const triggerActionPreDispatch = (action, store) => {
  triggerActionListeners('pre', action, store)
}

// used by the redux middleware to trigger the action post dispatch listeners
export const triggerActionPostDispatch = (action, store) => {
  triggerActionListeners('post', action, store)
}

// super simple Redux middleware for hooking into redux actions and triggering the registered action
// listeners
export default (store) => (next) => (action) => {
  triggerActionPreDispatch(action, store)
  const result = next(action)
  triggerActionPostDispatch(action, store)
  return result
}
