import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Input from '../../../components/common/FormComponents/Input/Input'
import Checkbox from '../../../components/common/FormComponents/Checkbox/Checkbox'
import Select from '../../../components/common/FormComponents/Select/Select'
import Button from '../../../components/common/Button/Button'
import RadioButton from '../../../components/common/FormComponents/RadioButton/RadioButton'
import Form from '../../../components/common/FormComponents/Form/Form'
import * as formActions from '../../../actions/common/formActions'
import { path, map, prop, isEmpty } from 'ramda'
import { validate } from '../../../lib/validator'

@connect(
  (state) => ({
    cmsForm: state.forms.cmsForm,
  }),
  { ...formActions }
)
class CmsForm extends Component {
  static propTypes = {
    formName: PropTypes.string,
    setFormField: PropTypes.func,
    touchedFormField: PropTypes.func,
    submitCmsForm: PropTypes.func,
    cmsForm: PropTypes.object,
    formContent: PropTypes.object,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  setField = (name) => (e) =>
    this.props.setFormField('cmsForm', name, e.target.value)
  setChecked = (name) => (e) =>
    this.props.setFormField('cmsForm', name, e.target.checked)
  touchedField = (name) => () => this.props.touchedFormField('cmsForm', name)

  handleSubmit = (e) => {
    const { submitCmsForm, formName } = this.props
    e.preventDefault()
    submitCmsForm(formName)
  }

  errors() {
    const { l } = this.context
    const {
      cmsForm: { fields },
      formContent,
    } = this.props
    const validationSchema = formContent.validationSchema
    return validate(validationSchema, map(prop('value'), fields), l)
  }

  required(fieldName) {
    const { formContent } = this.props
    const validationSchema = formContent.validationSchema
    return (
      validationSchema[fieldName] &&
      validationSchema[fieldName].indexOf('required') > -1
    )
  }

  selectComponent(field, key) {
    const { cmsForm } = this.props
    const { guid, options, name } = field
    return (
      <Select
        key={key || guid}
        label={field.label || field['label ']}
        options={options}
        name={name}
        value={path(['fields', name, 'value'], cmsForm) || undefined}
        onChange={this.setField(name)}
        onBlur={this.touchedField(name)}
        isRequired={this.required(field.name)}
      />
    )
  }

  renderInput(field) {
    const { cmsForm } = this.props

    return (
      <Input
        value=""
        name={field.name}
        label={field.label || ''}
        placeholder={field.placeholder || ''}
        field={path(['fields', field.name], cmsForm)}
        setField={this.setField}
        touchedField={this.touchedField}
        errors={this.errors()}
        isRequired={this.required(field.name)}
      />
    )
  }

  renderSelect(field) {
    if (Array.isArray(field.dropdowns)) {
      return field.dropdowns.map((field, index) => {
        return this.selectComponent(field, index)
      })
    } else if (Array.isArray(field.options)) {
      return this.selectComponent(field)
    }
  }

  renderCheckbox(field) {
    const { cmsForm } = this.props
    return (
      field.values && (
        <Checkbox
          name={field.name}
          checked={path(['fields', field.name], cmsForm)}
          onChange={this.setChecked(field.name)}
          isRequired={this.required(field.name)}
        >
          {field.heading}
        </Checkbox>
      )
    )
  }

  renderButton(field) {
    return (
      <Button
        {...field}
        isDisabled={field.type === 'submit' ? !isEmpty(this.errors()) : false}
      >
        {field.label}
      </Button>
    )
  }

  renderInnerHTML(field) {
    return (
      <div
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: field.value }}
      />
    )
  }

  renderRadioButtons(fields) {
    const { cmsForm } = this.props
    const radioSelectedValue = cmsForm.fields[fields.name].value
    return (
      <div>
        <label // eslint-disable-line jsx-a11y/label-has-for
          className="RadioButton-cmsLabel"
        >
          {fields.heading}
          {this.required(fields.name) && (
            <span className="RadioButton-required">*</span>
          )}
        </label>
        {fields.values &&
          fields.values.map((field, index) => {
            return (
              <RadioButton
                value={field.value}
                checked={radioSelectedValue === field.value}
                key={index} // eslint-disable-line react/no-array-index-key
                name={fields.name}
                label={field.label}
                onChange={this.setField(fields.name)}
              />
            )
          })}
      </div>
    )
  }

  renderField(field) {
    const fieldTypes = {
      text: () => this.renderInput(field),
      email: () => this.renderInput(field),
      password: () => this.renderInput(field),
      select: () => this.renderSelect(field),
      checkbox: () => this.renderCheckbox(field),
      submit: () => this.renderButton(field),
      innerHTML: () => this.renderInnerHTML(field),
      radio: () => this.renderRadioButtons(field),
    }
    return fieldTypes[field.type] && fieldTypes[field.type]()
  }

  renderHiddenFields(hiddenFields) {
    return (
      hiddenFields &&
      hiddenFields.map((hiddenField, index) => {
        return (
          <input
            key={index} // eslint-disable-line react/no-array-index-key
            type="hidden"
            {...hiddenField}
          />
        )
      })
    )
  }

  renderFieldsets(fieldsets) {
    return (
      fieldsets &&
      fieldsets.map(({ fields }, fieldsetIndex) => {
        return Array.isArray(fields) && fields.length ? (
          <div
            className="CmsForm-fieldSet"
            key={fieldsetIndex} // eslint-disable-line react/no-array-index-key
          >
            {fields.map((field, fieldIndex) => {
              return (
                <div
                  key={fieldIndex} // eslint-disable-line react/no-array-index-key
                >
                  {this.renderField(field)}
                </div>
              )
            })}
          </div>
        ) : null
      })
    )
  }

  renderCmsForm({ hiddenFields, formAttributes, fieldsets }) {
    return (
      <Form {...formAttributes} onSubmit={this.handleSubmit}>
        {this.renderHiddenFields(hiddenFields)}
        {this.renderFieldsets(fieldsets)}
      </Form>
    )
  }

  renderHeader(formContent) {
    const { miscContent } = formContent
    const imageUrl = miscContent.mobileImage
      ? miscContent.mobileImage.replace('_mobile', '')
      : null

    return (
      <div className="CmsForm-header">
        {miscContent && miscContent.mobileImage ? (
          <img className="CmsForm-hero" src={imageUrl} alt="" />
        ) : null}
        {miscContent && miscContent.h1 ? (
          <div className="CmsForm-title">
            <h1>{miscContent.h1}</h1>
          </div>
        ) : null}
      </div>
    )
  }

  renderIntroOutroHTML(formContent, introOutro) {
    const { miscContent } = formContent
    return miscContent &&
      miscContent[introOutro] &&
      miscContent[introOutro].html ? (
      <div
        className={`CmsForm-${introOutro}`}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: miscContent[introOutro].html }}
      />
    ) : null
  }

  render() {
    const { formContent } = this.props

    return (
      <div className="CmsForm">
        {this.renderHeader(formContent)}
        {this.renderIntroOutroHTML(formContent, 'introHTML')}
        {this.renderCmsForm(formContent)}
        {this.renderIntroOutroHTML(formContent, 'outroHTML')}
      </div>
    )
  }
}

//
// https://montyprod.api.arcadiagroup.co.uk/api/tsuk/cms/page/url?url=/en/tsuk/category/sign-up-to-style-notes-3176160/home?TS=1466666505349
//
// {
//   "guid": "43BF32F5-74C6-554B-6AC8-5948CCDAAF43",
//   "hideForMobile": false,
//   "type": "select",
//   "name": "dateOfBirth",
//   "label": "Date of Birth:",
//   "placeholder": "",
//   "dropdowns": [
//   {
//     "label ": "Date of Birth (day)",
//     "type": "select",
//     "name": "dd",
//     "options": [
//       {
//         "value": "",
//         "label": "Day"
//       },
//       {
//         "value": "1",
//         "label": "1"
//       },
//       {
//         "value": "2",
//    ...
//

export default CmsForm
