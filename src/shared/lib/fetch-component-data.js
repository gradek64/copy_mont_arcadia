import * as logger from '../../server/lib/logger'

const promiseRejectsAfter2Mins = () => {
  let cancelTimeoutPromise
  const timeoutPromise = new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Fetch component data timed out after 2 minutes`))
    }, 120000)
    cancelTimeoutPromise = () => {
      clearTimeout(timeoutId)
      resolve()
    }
  })

  return { timeoutPromise, cancelTimeoutPromise }
}

const unwrapComponent = (comp) =>
  comp.WrappedComponent ? unwrapComponent(comp.WrappedComponent) : comp

const componentHasNeeds = (comp) => !!comp.needs

const gatherNeeds = (needs, component) => {
  logger.debug('fetch-component-data', {
    name: component.name,
    needs: component.needs.map((func) => func.name),
  })
  return component.needs.concat(needs)
}

const executeNeed = (dispatch, needArgs) => (need) => {
  const action = need(needArgs)
  return !action ? null : dispatch(action)
}

const notNull = (x) => x !== null

/**
 * @param dispatch {Function}
 * @param components {Array<Component>}
 * @param needArgs {Object} Args to be passed to each need
 * @return {Promise<Array>}
 */
export default function fetchComponentData(dispatch, components, needArgs) {
  const needPromises = components
    .map(unwrapComponent)
    .filter(componentHasNeeds)
    .reduce(gatherNeeds, [])
    .map(executeNeed(dispatch, needArgs))
    .filter(notNull)

  const { timeoutPromise, cancelTimeoutPromise } = promiseRejectsAfter2Mins()

  const needsPromises = Promise.all(needPromises)

  // Cancel timeout without impacting the race between the needs and the timeout
  needsPromises.then(() => cancelTimeoutPromise())

  return Promise.race([needsPromises, timeoutPromise])
}
