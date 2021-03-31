import * as formActions from '../formActions'
import buildStore from 'test/unit/build-store'

jest.mock('../../../lib/localisation', () => ({
  localise: jest.fn(),
}))

import { localise } from '../../../lib/localisation'

describe('Form actions', () => {
  describe('setFormField', () => {
    it('returns an action with the correct data set', () => {
      const formName = 'testForm'
      const field = 'testField'
      const value = 'testValue'
      const key = 'testKey'
      const meta = { isDirty: true }

      expect(
        formActions.setFormField(formName, field, value, key, meta)
      ).toEqual({
        type: 'SET_FORM_FIELD',
        field,
        formName,
        isDirty: meta.isDirty,
        key,
        value,
      })
    })

    it('sets default values for key and isDirty', () => {
      const formName = 'testForm'
      const field = 'testField'
      const value = 'testValue'

      expect(formActions.setFormField(formName, field, value)).toEqual({
        type: 'SET_FORM_FIELD',
        field,
        formName,
        isDirty: true,
        key: null,
        value,
      })
    })
  })

  describe('validateForm', () => {
    it('returns an action with the correct data', () => {
      const formName = 'testForm'
      const validationSchema = {
        test: true,
      }

      expect(formActions.validateForm(formName, validationSchema)).toEqual({
        type: 'VALIDATE_FORM',
        formName,
        validationSchema,
      })
    })
  })

  describe('validateFormField', () => {
    it('returns an action with the correct data', () => {
      const formName = 'testForm'
      const field = 'testField'
      const validators = [
        {
          test: true,
        },
      ]

      expect(
        formActions.validateFormField(formName, field, validators)
      ).toEqual({
        type: 'VALIDATE_FORM_FIELD',
        formName,
        field,
        validators,
      })
    })
  })

  describe('setAndValidateFormField', () => {
    it('returns an action with the correct data', () => {
      const formName = 'testForm'
      const field = 'testField'
      const value = 'testValue'
      const validators = [
        {
          test: true,
        },
      ]

      expect(
        formActions.setAndValidateFormField(formName, field, value, validators)
      ).toEqual({
        type: 'SET_AND_VALIDATE_FORM_FIELD',
        formName,
        field,
        value,
        validators,
      })
    })
  })

  describe('clearFormErrors', () => {
    it('returns an action with the correct data', () => {
      const formName = 'testForm'

      expect(formActions.clearFormErrors(formName)).toEqual({
        type: 'CLEAR_FORM_ERRORS',
        formName,
      })
    })
  })

  describe('clearFormFieldError', () => {
    it('returns an action with the correct data', () => {
      const formName = 'testForm'
      const field = 'testField'

      expect(formActions.clearFormFieldError(formName, field)).toEqual({
        type: 'CLEAR_FORM_FIELD_ERROR',
        formName,
        field,
      })
    })
  })

  describe('setFormLoading', () => {
    it('returns an action with the correct data', () => {
      const formName = 'testForm'
      const isLoading = true

      expect(formActions.setFormLoading(formName, isLoading)).toEqual({
        type: 'SET_FORM_LOADING',
        formName,
        isLoading,
      })
    })
  })

  describe('initForm', () => {
    it('returns an action with the correct data', () => {
      const formName = 'testForm'
      const key = 'testKey'

      expect(formActions.initForm(formName, key)).toEqual({
        type: 'INIT_FORM',
        formName,
        key,
      })
    })

    it('provides default parameter values', () => {
      const formName = 'testForm'

      expect(formActions.initForm(formName)).toEqual({
        type: 'INIT_FORM',
        formName,
        key: null,
      })
    })
  })

  describe('setFormMessage', () => {
    const formName = 'testForm'

    it('treats string messages as errors', () => {
      const store = buildStore({
        config: {
          brandName: 'testBrand',
          langHostNames: {
            default: {
              defaultLanguage: 'someDefaultLanguage',
            },
          },
        },
      })

      localise.mockReturnValueOnce('messageLocalised')

      const message = 'testMessage'
      const key = 'testKey'

      const action = store.dispatch(
        formActions.setFormMessage(formName, message, key)
      )

      expect(action).toEqual({
        type: 'SET_FORM_MESSAGE',
        formName,
        message: {
          type: 'error',
          message: 'messageLocalised',
        },
        key,
      })
    })

    it('sets object messages', () => {
      const store = buildStore({
        config: {
          brandName: 'testBrand',
          langHostNames: {
            default: {
              defaultLanguage: 'someDefaultLanguage',
            },
          },
        },
      })

      localise.mockReturnValueOnce('messageLocalised')

      const message = {
        message: 'testMessage',
      }
      const key = 'testKey'

      const action = store.dispatch(
        formActions.setFormMessage(formName, message, key)
      )

      expect(action).toEqual({
        type: 'SET_FORM_MESSAGE',
        formName,
        message: {
          message: 'messageLocalised',
        },
        key,
      })
    })

    it('defaults key to null', () => {
      const store = buildStore({
        config: {
          brandName: 'testBrand',
          langHostNames: {
            default: {
              defaultLanguage: 'someDefaultLanguage',
            },
          },
        },
      })

      localise.mockReturnValueOnce('messageLocalised')

      const message = {
        message: 'testMessage',
      }

      const action = store.dispatch(
        formActions.setFormMessage(formName, message)
      )

      expect(action).toEqual({
        type: 'SET_FORM_MESSAGE',
        formName,
        message: {
          message: 'messageLocalised',
        },
        key: null,
      })
    })
  })

  describe('setFormSuccess', () => {
    it('returns an action with the correct data', () => {
      const formName = 'testForm'
      const success = true
      const key = 'testKey'

      expect(formActions.setFormSuccess(formName, success, key)).toEqual({
        type: 'SET_FORM_SUCCESS',
        formName,
        success,
        key,
      })
    })

    it('defaults key to null', () => {
      const formName = 'testForm'
      const success = true

      expect(formActions.setFormSuccess(formName, success)).toEqual({
        type: 'SET_FORM_SUCCESS',
        formName,
        success,
        key: null,
      })
    })
  })

  describe('setFormMeta', () => {
    it('returns an action with the correct data', () => {
      const formName = 'testForm'
      const field = 'testField'
      const value = 'testValue'
      const key = 'testKey'

      expect(formActions.setFormMeta(formName, field, value, key)).toEqual({
        type: 'SET_FORM_META',
        formName,
        field,
        value,
        key,
      })
    })

    it('defaults key to null', () => {
      const formName = 'testForm'
      const field = 'testField'
      const value = 'testValue'

      expect(formActions.setFormMeta(formName, field, value)).toEqual({
        type: 'SET_FORM_META',
        formName,
        field,
        value,
        key: null,
      })
    })
  })

  describe('focusedFormField', () => {
    it('returns an action with the correct data', () => {
      const formName = 'testForm'
      const field = 'testField'
      const value = 'testValue'

      expect(formActions.focusedFormField(formName, field, value)).toEqual({
        type: 'FOCUSED_FORM_FIELD',
        formName,
        field,
        value,
      })
    })
  })

  describe('touchedFormField', () => {
    it('returns an action with the correct data', () => {
      const formName = 'testForm'
      const field = 'testField'
      const key = 'testKey'

      expect(formActions.touchedFormField(formName, field, key)).toEqual({
        type: 'TOUCHED_FORM_FIELD',
        formName,
        field,
        key,
      })
    })

    it('defaults key to null', () => {
      const formName = 'testForm'
      const field = 'testField'

      expect(formActions.touchedFormField(formName, field)).toEqual({
        type: 'TOUCHED_FORM_FIELD',
        formName,
        field,
        key: null,
      })
    })
  })

  describe('touchedMultipleFormFields', () => {
    it('returns an action with the correct data', () => {
      const formName = 'testForm'
      const fields = ['testField']
      const key = 'testKey'

      expect(
        formActions.touchedMultipleFormFields(formName, fields, key)
      ).toEqual({
        type: 'TOUCHED_MULTIPLE_FORM_FIELDS',
        formName,
        fields,
        key,
      })
    })

    it('defaults key to null', () => {
      const formName = 'testForm'
      const fields = ['testField']

      expect(formActions.touchedMultipleFormFields(formName, fields)).toEqual({
        type: 'TOUCHED_MULTIPLE_FORM_FIELDS',
        formName,
        fields,
        key: null,
      })
    })
  })

  describe('resetForm', () => {
    it('returns an action with the correct data', () => {
      const formName = 'testForm'
      const initialValues = {
        a: 'a',
        b: 'b',
      }
      const key = 'testKey'

      expect(formActions.resetForm(formName, initialValues, key)).toEqual({
        type: 'RESET_FORM',
        formName,
        initialValues,
        key,
      })
    })

    it('defaults key to null', () => {
      const formName = 'testForm'
      const initialValues = {
        a: 'a',
        b: 'b',
      }

      expect(formActions.resetForm(formName, initialValues)).toEqual({
        type: 'RESET_FORM',
        formName,
        initialValues,
        key: null,
      })
    })
  })

  describe('resetFormDirty', () => {
    it('returns an action with the correct data', () => {
      const formName = 'testForm'
      const initialValues = {
        a: 'a',
        b: 'b',
      }
      const key = 'testKey'

      expect(formActions.resetFormDirty(formName, initialValues, key)).toEqual({
        type: 'RESET_FORM_DIRTY',
        formName,
        initialValues,
        key,
      })
    })

    it('defaults key to null', () => {
      const formName = 'testForm'
      const initialValues = {
        a: 'a',
        b: 'b',
      }

      expect(formActions.resetFormDirty(formName, initialValues)).toEqual({
        type: 'RESET_FORM_DIRTY',
        formName,
        initialValues,
        key: null,
      })
    })
  })

  describe('resetFormPartial', () => {
    it('returns an action with the correct data', () => {
      const formName = 'testForm'
      const initialValues = {
        a: 'a',
        b: 'b',
      }
      const key = 'testKey'

      expect(
        formActions.resetFormPartial(formName, initialValues, key)
      ).toEqual({
        type: 'RESET_FORM_PARTIAL',
        formName,
        initialValues,
        key,
      })
    })

    it('defaults key to null', () => {
      const formName = 'testForm'
      const initialValues = {
        a: 'a',
        b: 'b',
      }

      expect(formActions.resetFormPartial(formName, initialValues)).toEqual({
        type: 'RESET_FORM_PARTIAL',
        formName,
        initialValues,
        key: null,
      })
    })
  })

  describe('handleFormResponseErrorMessage', () => {
    it('sets the form message with the relevant error', () => {
      const store = buildStore({
        config: {
          brandName: 'testBrand',
          langHostNames: {
            default: {
              defaultLanguage: 'someDefaultLanguage',
            },
          },
        },
      })

      localise.mockImplementationOnce((language, brand, message) => message)

      const formName = 'testForm'
      const message = 'it fell over'

      const error = {
        response: {
          body: {
            message,
          },
        },
      }

      const action = store.dispatch(
        formActions.handleFormResponseErrorMessage(formName, error)
      )

      expect(action).toEqual({
        type: 'SET_FORM_MESSAGE',
        formName,
        message: {
          type: 'error',
          message,
        },
        key: null,
      })
    })

    it('sets validation errors', () => {
      const store = buildStore({
        config: {
          brandName: 'testBrand',
          langHostNames: {
            default: {
              defaultLanguage: 'someDefaultLanguage',
            },
          },
        },
      })

      localise.mockImplementationOnce((language, brand, message) => message)

      const formName = 'testForm'
      const message = 'You typed it wrong'
      const originalMessage = 'Validation error'

      const error = {
        response: {
          body: {
            originalMessage,
            validationErrors: [
              {
                message,
              },
            ],
          },
        },
      }

      const action = store.dispatch(
        formActions.handleFormResponseErrorMessage(formName, error)
      )

      expect(action).toEqual({
        type: 'SET_FORM_MESSAGE',
        formName,
        message: {
          type: 'error',
          message,
        },
        key: null,
      })
    })

    it('falls back to the default message', () => {
      const store = buildStore({
        config: {
          brandName: 'testBrand',
          langHostNames: {
            default: {
              defaultLanguage: 'someDefaultLanguage',
            },
          },
        },
      })

      localise.mockImplementationOnce((language, brand, message) => message)

      const formName = 'testForm'
      const error = {}

      const defaultMessage = 'Something really bad happened'

      const action = store.dispatch(
        formActions.handleFormResponseErrorMessage(
          formName,
          error,
          defaultMessage
        )
      )

      expect(action).toEqual({
        type: 'SET_FORM_MESSAGE',
        formName,
        message: {
          type: 'error',
          message: defaultMessage,
        },
        key: null,
      })
    })

    it('does not log restrcited action errors', () => {
      const store = buildStore({
        config: {
          brandName: 'testBrand',
          langHostNames: {
            default: {
              defaultLanguage: 'someDefaultLanguage',
            },
          },
        },
      })

      const formName = 'testForm'
      const error = {
        response: {
          status: 401,
          body: {
            isRestrictedActionResponse: true,
          },
        },
      }

      const action = store.dispatch(
        formActions.handleFormResponseErrorMessage(formName, error)
      )

      expect(action).toEqual({
        type: 'SET_FORM_MESSAGE',
        formName,
        message: {
          message: '',
        },
        key: null,
      })
    })
  })
})
