import { map, curry, filter, compose } from 'ramda'

/**
 * When tests are ran, server-side-renderer test injects two empty object properties
 * 'retainFunctions' is a safety function to remove these two empty objects from our export
 */
const retainFunctions = filter((i) => typeof i === 'function')
const bindHandlers = compose(map(curry), retainFunctions)

export default (routeHandlers) => bindHandlers(routeHandlers)
