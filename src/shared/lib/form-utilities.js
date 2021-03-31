import {
  identity,
  map,
  evolve,
  assocPath,
  fromPairs,
  omit,
  pick,
  pluck,
} from 'ramda'

import { validate } from './validator'

export const setFormField = (formName) => (state, action) => {
  if (action.formName === formName) {
    const schema = {
      fields: {
        [action.field]: {
          value: () => action.value,
          isDirty: () => ('isDirty' in action ? action.isDirty : true),
        },
      },
    }
    return evolve(schema, state)
  }
  return state
}

export const validateForm = (_formName) => (
  state,
  { formName, validationSchema }
) => {
  if (_formName === formName) {
    const formErrors = validate(
      validationSchema,
      { ...pluck('value', state.fields) },
      identity
    )
    const transformations = {
      errors: () => {
        return map(
          (errors) => (Array.isArray(errors) ? errors[0] : errors),
          formErrors
        )
      },
    }
    return evolve(transformations, state)
  }
  return state
}

export const validateFormField = (_formName) => (
  state,
  { formName, field, validators = [] }
) => {
  if (_formName === formName) {
    const { [field]: fieldErrors = [] } = validate(
      { [field]: validators },
      { ...pluck('value', state.fields) },
      identity
    )
    const fieldError = Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors
    const transformations = {
      errors: (errors) => ({
        ...errors,
        [field]: fieldError,
      }),
    }
    return evolve(transformations, state)
  }
  return state
}

export const setAndValidateFormField = (_formName) => (
  state,
  { formName, field, value, validators = [] }
) => {
  if (_formName === formName) {
    const { [field]: fieldErrors = [] } = validate(
      { [field]: validators },
      { ...pluck('value', state.fields), [field]: value },
      identity
    )
    const fieldError = Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors
    const transformations = {
      fields: {
        [field]: {
          value: () => value,
          isDirty: () => true,
        },
      },
      errors: (errors) => ({
        ...errors,
        [field]: fieldError,
      }),
    }
    return evolve(transformations, state)
  }
  return state
}

export const clearFormErrors = (_formName) => (state, { formName }) => {
  if (_formName === formName) {
    const transformations = {
      errors: () => ({}),
    }
    return evolve(transformations, state)
  }
  return state
}

export const clearFormFieldError = (_formName) => (
  state,
  { formName, field }
) => {
  if (_formName === formName) {
    const transformations = {
      errors: (errors) => omit([field], errors),
    }
    return evolve(transformations, state)
  }
  return state
}

export const setFormMessage = (formName) => (state, action) => {
  if (action.formName === formName) {
    return { ...state, message: action.message }
  }
  return state
}

export const setFormSuccess = (_formName) => (state, { success, formName }) => {
  return formName === _formName ? { ...state, success } : state
}

export const setFormLoading = (formName) => (state, action) => {
  if (action.formName === formName) {
    return { ...state, isLoading: action.isLoading }
  }
  return state
}

export const setFormMeta = (formName) => (state, action) => {
  if (action.formName === formName) {
    return { ...state, [action.field]: action.value }
  }
  return state
}

export const focusedFormField = (formName) => (state, action) => {
  if (action.formName === formName) {
    return assocPath(['fields', action.field, 'isFocused'], action.value, state)
  }
  return state
}

export const touchedFormField = (formName) => (state, action) => {
  if (action.formName === formName) {
    return assocPath(['fields', action.field, 'isTouched'], true, state)
  }
  return state
}

export const touchedMultipleFormFields = (formName) => (state, action) => {
  if (action.formName === formName) {
    const fields = {
      ...state.fields,
      ...map(
        (field) => ({ ...field, isTouched: true }),
        pick(action.fields, state.fields)
      ),
    }
    return { ...state, fields }
  }
  return state
}

export const resetForm = (formName) => (state, action) => {
  if (action.formName === formName) {
    const initialValues = action.initialValues
    const emptyField = {
      value: '',
      isDirty: false,
      isTouched: false,
      isFocused: false,
    }

    return {
      ...state,
      fields: map((value) => ({ ...emptyField, value }), initialValues),
      message: {},
    }
  }
  return state
}

export const resetFormDirty = (formName) => (state, action) => {
  if (action.formName === formName) {
    const initialValues = action.initialValues
    const emptyField = {
      value: '',
      isDirty: true,
      isTouched: true,
      isFocused: false,
    }

    return {
      ...state,
      fields: map((value) => ({ ...emptyField, value }), initialValues),
      message: {},
    }
  }
  return state
}

export const resetFormPartial = (formName) => (state, action) => {
  if (action.formName === formName) {
    const initialValues = action.initialValues
    const emptyField = {
      value: '',
      isDirty: false,
      isTouched: false,
      isFocused: false,
    }

    const reset = () =>
      map((value) => ({ ...emptyField, value }), initialValues)

    return {
      ...state,
      fields: { ...state.fields, ...reset() },
    }
  }
  return state
}

export const defaultSchema = (fields = [], meta = {}) => {
  return {
    fields: fromPairs(
      map(
        (key) => [
          key,
          { value: '', isDirty: false, isTouched: false, isFocused: false },
        ],
        fields
      )
    ),
    isLoading: false,
    errors: {},
    message: {},
    ...meta,
  }
}
