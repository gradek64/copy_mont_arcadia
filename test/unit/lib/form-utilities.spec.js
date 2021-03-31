import {
  setFormField,
  setFormMessage,
  setFormSuccess,
  setFormLoading,
  resetForm,
  focusedFormField,
  touchedFormField,
  defaultSchema,
} from '../../../src/shared/lib/form-utilities'

test('setFormField should update the state if given an action with the right formname', () => {
  const state = {
    fields: {
      myField: {
        value: 'default',
        isDirty: false,
        isTouched: false,
        isFocused: false,
      },
    },
  }
  const action = {
    formName: 'myForm',
    field: 'myField',
    value: 'updated',
  }
  const actual = setFormField('myForm')(state, action)
  const expected = {
    fields: {
      myField: {
        value: 'updated',
        isDirty: true,
        isTouched: false,
        isFocused: false,
      },
    },
  }
  expect(actual).toEqual(expected)
})

test('setFormField should ignore actions with the wrong formName', () => {
  const state = {
    fields: {
      myField: {
        value: 'default',
        isDirty: false,
        isTouched: false,
        isFocused: false,
      },
    },
  }
  const action = {
    formName: 'otherForm',
    field: 'myField',
    value: 'updated',
  }
  const actual = setFormField('myForm')(state, action)
  const expected = state
  expect(actual).toEqual(expected)
})

test('setFormMessage should update the state if given an action with the right formname', () => {
  const state = {
    fields: {},
    errors: {},
  }
  const action = {
    formName: 'myForm',
    message: 'this is an error message',
  }
  const actual = setFormMessage('myForm')(state, action)
  const expected = {
    fields: {},
    errors: {},
    message: 'this is an error message',
  }
  expect(actual).toEqual(expected)
})

test('setFormSuccess should update the state if given an action with the right formName', () => {
  const state = {
    fields: {},
    errors: {},
  }
  const action = {
    formName: 'myForm',
    success: true,
  }
  const actual = setFormSuccess('myForm')(state, action)
  const expected = {
    fields: {},
    errors: {},
    success: true,
  }
  expect(actual).toEqual(expected)
})

test('setFormLoading should update the state if given an action with the right formName', () => {
  const state = {
    fields: {},
    errors: {},
  }
  const action = {
    formName: 'myForm',
    isLoading: true,
  }
  const actual = setFormLoading('myForm')(state, action)
  const expected = {
    fields: {},
    errors: {},
    isLoading: true,
  }
  expect(actual).toEqual(expected)
})

test('resetForm should replace the entire fields object', () => {
  const state = {
    fields: {
      myField: {
        value: 'default',
        isDirty: false,
        isTouched: false,
        isFocused: false,
      },
      otherField: {
        value: 'default',
        isDirty: false,
        isTouched: false,
        isFocused: false,
      },
    },
    message: {
      message: 'Some error',
      type: 'error',
    },
  }
  const action = {
    formName: 'myForm',
    initialValues: {
      myField: 'updated',
      newField: 'new',
    },
  }
  const actual = resetForm('myForm')(state, action)
  const expected = {
    fields: {
      myField: {
        value: 'updated',
        isDirty: false,
        isTouched: false,
        isFocused: false,
      },
      newField: {
        value: 'new',
        isDirty: false,
        isTouched: false,
        isFocused: false,
      },
    },
    message: {},
  }
  expect(actual).toEqual(expected)
})

test('resetForm should ignore actions for other forms', () => {
  const state = {
    fields: {
      myField: {
        value: 'default',
        isDirty: false,
        isTouched: false,
        isFocused: false,
      },
      otherField: {
        value: 'default',
        isDirty: false,
        isTouched: false,
        isFocused: false,
      },
    },
  }
  const action = {
    formName: 'otherForm',
    initialValues: {
      myField: 'updated',
      newField: 'new',
    },
  }
  const actual = resetForm('myForm')(state, action)
  const expected = state
  expect(actual).toEqual(expected)
})

test('touchedFormField should set isTouched to true', () => {
  const state = {
    fields: {
      myField: {
        value: 'default',
        isDirty: false,
        isTouched: false,
        isFocused: false,
      },
    },
  }
  const action = {
    formName: 'myForm',
    field: 'myField',
  }
  const actual = touchedFormField('myForm')(state, action)
  const expected = {
    fields: {
      myField: {
        value: 'default',
        isDirty: false,
        isTouched: true,
        isFocused: false,
      },
    },
  }
  expect(actual).toEqual(expected)
})

test('touchedFormField should ignore actions for other forms', () => {
  const state = {
    fields: {
      myField: {
        value: 'default',
        isDirty: false,
        isTouched: false,
        isFocused: false,
      },
    },
  }
  const action = {
    formName: 'otherForm',
    field: 'myField',
  }
  const actual = touchedFormField('myForm')(state, action)
  const expected = {
    fields: {
      myField: {
        value: 'default',
        isDirty: false,
        isTouched: false,
        isFocused: false,
      },
    },
  }
  expect(actual).toEqual(expected)
})

test('focusedFormField should set isTouched to true', () => {
  const state = {
    fields: {
      myField: {
        value: 'default',
        isDirty: false,
        isTouched: false,
        isFocused: false,
      },
    },
  }
  const action = {
    formName: 'myForm',
    field: 'myField',
    value: true,
  }
  const actual = focusedFormField('myForm')(state, action)
  const expected = {
    fields: {
      myField: {
        value: 'default',
        isDirty: false,
        isTouched: false,
        isFocused: true,
      },
    },
  }
  expect(actual).toEqual(expected)
})

test('focusedFormField should ignore actions for other forms', () => {
  const state = {
    fields: {
      myField: {
        value: 'default',
        isDirty: false,
        isTouched: false,
        isFocused: false,
      },
    },
  }
  const action = {
    formName: 'otherForm',
    field: 'myField',
  }
  const actual = focusedFormField('myForm')(state, action)
  const expected = {
    fields: {
      myField: {
        value: 'default',
        isDirty: false,
        isTouched: false,
        isFocused: false,
      },
    },
  }
  expect(actual).toEqual(expected)
})

test('defaultSchema should generate a default schema based on the list of fields', () => {
  const fields = ['a', 'b']
  const actual = defaultSchema(fields)
  const expected = {
    fields: {
      a: {
        value: '',
        isDirty: false,
        isTouched: false,
        isFocused: false,
      },
      b: {
        value: '',
        isDirty: false,
        isTouched: false,
        isFocused: false,
      },
    },
    errors: {},
    message: {},
    isLoading: false,
  }
  expect(actual).toEqual(expected)
})
