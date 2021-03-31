/* eslint-disable */
import configureStore from '../../../src/shared/lib/configure-store'

export default function configureMockStore(...args) {
  const store = configureStore(...args)

  store.subscribeNth = (dispatchCount, callback) => {
    const unsubscribe = store.subscribe(() => {
      if (!--dispatchCount) {
        // eslint-disable-line
        callback()
        unsubscribe()
      }
    })
  }

  // only works with assert, since it throws an exception
  // when assertion fails.
  // another important caveat, if assertion passes at some point,
  // but will fail in the future, test will pass
  store.subscribeUntilPasses = (callback) => {
    const noDispatches = new Error()
    let notifyNoChanges = setTimeout(() => {
      throw noDispatches
    }, 1000)

    const unsubscribe = store.subscribe(() => {
      clearTimeout(notifyNoChanges)

      try {
        callback()
        unsubscribe()
      } catch (assertionFailed) {
        notifyNoChanges = setTimeout(() => {
          throw assertionFailed
        }, 1000)
      }
    })
  }

  return store
}
