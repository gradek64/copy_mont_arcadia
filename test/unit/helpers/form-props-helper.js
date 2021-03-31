/* eslint-disable */

const createMockedFunctions = (functionsToMock) => {
  const mock = {}
  for (const f in functionsToMock) {
    mock[functionsToMock[f]] = jest.fn()
  }
  return mock
}

const formUtilities = createMockedFunctions([
  'setFormField',
  'setFormMessage',
  'setFormSuccess',
  'setFormLoading',
  'setFormMeta',
  'focusedFormField',
  'touchedFormFiled',
  'touchedMultipleFormFields',
  'resetForm',
  'resetFormDirty',
  'resetFormPartial',
  'defaultSchema',
  'sendAnalyticsClickEvent',
  'sendAnalyticsErrorMessage',
])

const generateFormFields = (name, fields, modificatedFields = {}) => {
  const generatedFields = {
    [name]: {
      errors: {},
      fields: {},
      isLoading: false,
      message: {},
    },
  }
  Object.keys(fields).forEach(
    (key) =>
      (generatedFields[name].fields[key] = {
        value: modificatedFields[key] || fields[key],
        isDirty: false,
        isTouched: false,
        isFocused: false,
      })
  )
  return generatedFields
}

const convertFields = (keys, form, modifications, generatedFields) =>
  keys.forEach((fieldKey) =>
    Object.assign(
      generatedFields,
      generateFormFields(fieldKey, form[fieldKey], modifications[fieldKey])
    )
  )

const generateMockFormProps = (form, modifications = {}) => {
  const fields = {}
  const errors = {}
  const keys = Object.keys(form)
  keys.forEach((fieldKey) => (errors[fieldKey] = {}))
  convertFields(keys, form, modifications, fields)
  return {
    ...formUtilities,
    ...fields,
    errors,
  }
}

export default generateMockFormProps
