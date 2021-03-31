import { mapObjIndexed, pickBy, compose, tail } from 'ramda'
import * as validators from './validators'

const firstInvalid = (obj, key, l, _validators) => {
  if (_validators.length === 0) return undefined
  let validateAction = _validators[0]
  if (typeof validateAction === 'object') {
    // convert validateAction to a function as it has been serialized for the redux store
    const funcName = Object.keys(validateAction)[0]
    const funcParams = validateAction[funcName]
    validateAction = validators[funcName](...funcParams)
  }
  const fstResult = applyValidation(validateAction, obj, key, l) // eslint-disable-line no-use-before-define
  return fstResult || firstInvalid(obj, key, l, tail(_validators))
}

const applyValidation = (validator, obj, key, l) => {
  if (typeof validator === 'string')
    return validators[validator] && validators[validator](obj, key, l)
  if (Array.isArray(validator)) return firstInvalid(obj, key, l, validator)
  return validator(obj, key, l)
}

const runValidation = (schema, object, l) =>
  mapObjIndexed(
    (validator, key) => applyValidation(validator, object, key, l),
    schema
  )

const filterUndefined = pickBy((v) => !!v)

// validate({ email : "email"}, {email: "andreas@example"})
// => {email: "Please enter a valid email address."}
export const validate = compose(filterUndefined, runValidation)
