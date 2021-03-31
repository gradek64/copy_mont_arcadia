import { path, flatten } from 'ramda'
import { replaceDomain } from '../../../shared/lib/query-helper'

function setValidationRules(fields, field, validationSchema) {
  if (!validationSchema[field.name]) validationSchema[field.name] = []
  Object.keys(field.validation).forEach((validator) => {
    // This maps the CMS forms validation keys to our validator functions.
    // It has to be serialized data for the redux store.

    if (field.validation[validator]) {
      switch (validator) {
        case 'equalTo': {
          const fieldGUID = field.validation[validator].condition
          const fieldNameToEqual = fields.find(({ guid }) => guid === fieldGUID)
            .name
          const fieldErrorMessage = field.validation[validator].message
          validationSchema[field.name] = validationSchema[field.name].concat({
            isSameAs: [fieldErrorMessage, fieldNameToEqual],
          })
          break
        }
        default:
          validationSchema[field.name] = validationSchema[field.name].concat(
            validator
          )
          break
      }
    }
  })
}

function buildValidationSchema(fieldsets) {
  const validationSchema = {}
  fieldsets.forEach(({ fields }) => {
    fields.forEach((field) => {
      if (field.dropdowns) {
        const dropdowns = path(['dropdowns'], field)
        dropdowns.forEach((dropdown) =>
          setValidationRules(fields, dropdown, validationSchema)
        )
      } else if (field.name) {
        const validation = path(['validation'], field)
        if (validation) {
          setValidationRules(fields, field, validationSchema)
        }
      }
    })
  })
  return validationSchema
}

export function parseCmsForm(content) {
  return {
    ...content,
    fieldSchema: flatten(
      content.fieldsets.map((fieldset) => {
        return fieldset.fields
          .map((field) => {
            if (field.dropdowns)
              return field.dropdowns.map((dropdown) => dropdown.name)
            return field.name
          })
          .filter((name) => name)
      })
    ),
    validationSchema: buildValidationSchema(content.fieldsets),
  }
}

export function parseFormData(cmsForm, hiddenFields) {
  const formData = {}
  Object.keys(hiddenFields).forEach((hiddenField) => {
    formData[hiddenFields[hiddenField].name] = hiddenFields[hiddenField].value
  })
  Object.keys(cmsForm.fields).forEach((field) => {
    formData[field] = cmsForm.fields[field].value
  })
  return formData
}

export function replaceImageDomains(body) {
  // If we have no host name to swap out, just return
  if (!process.env.CMS_IMAGE_HOSTNAME) return body

  // Just to avoid TermsAndConditions pages to get broken
  if (!Array.isArray(body.pageData)) return body

  return {
    ...body,
    pageData:
      body.pageData &&
      body.pageData.map((item) => {
        return item.data && item.data.assets
          ? {
              ...item,
              data: {
                ...item.data,
                assets: item.data.assets.map((asset) => ({
                  ...asset,
                  source: replaceDomain(
                    asset.source,
                    process.env.CMS_IMAGE_HOSTNAME
                  ),
                })),
              },
            }
          : item
      }),
  }
}
