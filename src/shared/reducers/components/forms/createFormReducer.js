import createReducer from '../../../lib/create-reducer'
import * as formUtils from '../../../lib/form-utilities'

export default function createFormReducer(formName, schema, reducers = {}) {
  const initialState = formUtils.defaultSchema(schema)
  const baseReducers = {
    SET_FORM_META: formUtils.setFormMeta(formName),
    SET_FORM_FIELD: formUtils.setFormField(formName),
    VALIDATE_FORM: formUtils.validateForm(formName),
    VALIDATE_FORM_FIELD: formUtils.validateFormField(formName),
    SET_AND_VALIDATE_FORM_FIELD: formUtils.setAndValidateFormField(formName),
    CLEAR_FORM_ERRORS: formUtils.clearFormErrors(formName),
    CLEAR_FORM_FIELD_ERROR: formUtils.clearFormFieldError(formName),
    SET_FORM_MESSAGE: formUtils.setFormMessage(formName),
    SET_FORM_LOADING: formUtils.setFormLoading(formName),
    FOCUSED_FORM_FIELD: formUtils.focusedFormField(formName),
    TOUCHED_FORM_FIELD: formUtils.touchedFormField(formName),
    TOUCHED_MULTIPLE_FORM_FIELDS: formUtils.touchedMultipleFormFields(formName),
    RESET_FORM: formUtils.resetForm(formName),
    RESET_FORM_PARTIAL: formUtils.resetFormPartial(formName),
    RESET_FORM_DIRTY: formUtils.resetFormDirty(formName),
    CLEAR_CHECKOUT_FORMS: () => initialState,
    LOGOUT: () => initialState,
  }
  return createReducer(initialState, { ...baseReducers, ...reducers })
}
