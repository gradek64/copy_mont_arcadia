// The following have been added in order to permit fallback to CmsWrapper for the rendering of the Components
// that mrCMS is not yet capable to manage.
import { path, flatten } from 'ramda'

// Added a copy of existig function in /server (parseCmsForm, buildValidationSchema, setValidationRules) since we temporarely need it. Didn't move the function to /shared
// since these functions will be removed once mrCMS gets capable to manage TermsAndConditions, CmsForms, Campaigns.
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
