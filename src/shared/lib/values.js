import { isNil, isEmpty } from 'ramda'

// :: Any -> Boolean
export const isNilOrEmpty = (x) => isNil(x) || isEmpty(x)

// :: Any -> Boolean
export const isUUIDv4 = (x) =>
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
    x
  )
