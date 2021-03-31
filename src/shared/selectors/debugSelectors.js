import { path, pathOr } from 'ramda'

const isDebugAllowed = path(['debug', 'isAllowed'])

const isDebugShown = path(['debug', 'isShown'])

const getBuildVersion = pathOr('FIXME', ['debug', 'buildInfo', 'tag'])

const getWcsEnvironment = pathOr('prod', ['debug', 'environment'])

export { isDebugAllowed, isDebugShown, getBuildVersion, getWcsEnvironment }
