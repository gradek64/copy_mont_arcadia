import React from 'react'
import { browserHistory } from 'react-router'
import { showModal, closeModal } from './modalActions'
import { ajaxCounter } from '../components/LoaderOverlayActions'
import { post } from '../../lib/api-service'
import Button from '../../components/common/Button/Button'
import { localise } from '../../lib/localisation'
import { getRedirectPage } from '../../lib/cmslib'
import {
  getDefaultLanguage,
  getBrandName,
} from '../../selectors/configSelectors'
import { isRestrictedActionResponse } from '../../lib/restricted-actions'

export function setFormField(
  formName,
  field,
  value,
  key = null,
  { isDirty = true } = {}
) {
  return {
    type: 'SET_FORM_FIELD',
    field,
    formName,
    value,
    key,
    isDirty,
  }
}

export function validateForm(formName, validationSchema) {
  return {
    type: 'VALIDATE_FORM',
    formName,
    validationSchema,
  }
}

export function validateFormField(formName, field, validators) {
  return {
    type: 'VALIDATE_FORM_FIELD',
    formName,
    field,
    validators,
  }
}

export function setAndValidateFormField(formName, field, value, validators) {
  return {
    type: 'SET_AND_VALIDATE_FORM_FIELD',
    field,
    formName,
    value,
    validators,
  }
}

export function clearFormErrors(formName) {
  return {
    type: 'CLEAR_FORM_ERRORS',
    formName,
  }
}

export function clearFormFieldError(formName, field) {
  return {
    type: 'CLEAR_FORM_FIELD_ERROR',
    field,
    formName,
  }
}

export function setFormLoading(formName, isLoading) {
  return {
    type: 'SET_FORM_LOADING',
    formName,
    isLoading,
  }
}

export function initForm(formName, key = null) {
  return {
    type: 'INIT_FORM',
    formName,
    key,
  }
}

export function setFormMessage(formName, _message, key = null) {
  return (dispatch, getState) => {
    const state = getState()
    const language = getDefaultLanguage(state)
    const brandName = getBrandName(state)

    const message =
      typeof _message === 'string'
        ? { type: 'error', message: _message }
        : _message

    if (message) {
      message.message =
        typeof message.message === 'string'
          ? localise(language, brandName, message.message)
          : ''
    }

    return dispatch({
      type: 'SET_FORM_MESSAGE',
      formName,
      message,
      key,
    })
  }
}

export function setFormSuccess(formName, success, key = null) {
  return {
    type: 'SET_FORM_SUCCESS',
    formName,
    success,
    key,
  }
}

export function setFormMeta(formName, field, value, key = null) {
  return {
    type: 'SET_FORM_META',
    field,
    formName,
    value,
    key,
  }
}

export function focusedFormField(formName, field, value) {
  return {
    type: 'FOCUSED_FORM_FIELD',
    field,
    formName,
    value,
  }
}

export function touchedFormField(formName, field, key = null) {
  return {
    type: 'TOUCHED_FORM_FIELD',
    field,
    formName,
    key,
  }
}
export function touchedMultipleFormFields(formName, fields, key = null) {
  return {
    type: 'TOUCHED_MULTIPLE_FORM_FIELDS',
    fields,
    formName,
    key,
  }
}

export function resetForm(formName, initialValues, key = null) {
  return {
    type: 'RESET_FORM',
    formName,
    initialValues,
    key,
  }
}

export function resetFormDirty(formName, initialValues, key = null) {
  return {
    type: 'RESET_FORM_DIRTY',
    formName,
    initialValues,
    key,
  }
}

export function resetFormPartial(formName, initialValues, key = null) {
  return {
    type: 'RESET_FORM_PARTIAL',
    formName,
    initialValues,
    key,
  }
}

function onCmsFormSubmit(dispatch, modalChildren, modalType, cmsContent) {
  dispatch(showModal(modalChildren, { type: modalType }))
  const initialState = {}
  cmsContent.fieldSchema.forEach((field) => {
    initialState[field] = ''
  })
  dispatch(resetForm('cmsForm', initialState))
}

function handleResponse(dispatch, l, urlType, cmsContent, modalType, text) {
  return () => {
    dispatch(ajaxCounter('decrement'))
    const redirectPage = getRedirectPage(cmsContent, urlType)
    if (redirectPage) {
      browserHistory.push(redirectPage)
    } else {
      const modalChildren = (
        <div>
          <p>{l(text)}</p>
          <Button clickHandler={() => dispatch(closeModal())}>{l`Ok`}</Button>
        </div>
      )
      onCmsFormSubmit(dispatch, modalChildren, modalType, cmsContent)
    }
  }
}

export function submitCmsForm(formName) {
  return (dispatch, getState) => {
    const {
      config: { language, brandName },
      cms: { pages },
      forms: { cmsForm },
    } = getState()
    const l = localise.bind(null, language, brandName)
    const cmsContent = pages[formName].pageData[0]
    dispatch(ajaxCounter('increment'))
    return dispatch(post('/cms/form/submit', { cmsForm, cmsContent }))
      .then(
        handleResponse(
          dispatch,
          l,
          'successURL',
          cmsContent,
          undefined,
          'Thank you for submitting your details.'
        )
      )
      .catch(
        handleResponse(
          dispatch,
          l,
          'failureURL',
          cmsContent,
          'alertdialog',
          'There was an error submitting the form. Please try again.'
        )
      )
  }
}

export function handleFormResponseErrorMessage(
  formName,
  error = {},
  defaultMessage = 'Unknown server error'
) {
  const {
    response,
    response: {
      body: { originalMessage, message, validationErrors } = {},
    } = {},
  } = error

  if (isRestrictedActionResponse(response)) {
    return setFormMessage(formName, {})
  }

  return setFormMessage(formName, {
    type: 'error',
    message:
      originalMessage === 'Validation error'
        ? validationErrors[0].message
        : message || defaultMessage,
  })
}
