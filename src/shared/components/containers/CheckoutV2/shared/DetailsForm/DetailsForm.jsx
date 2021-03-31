import PropTypes from 'prop-types'
import { path } from 'ramda'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getYourDetailsSchema } from '../validationSchemas'
import {
  getDetailsForm,
  getCountryFor,
  getSelectedDeliveryLocationType,
} from '../../../../../selectors/checkoutSelectors'
import { getFormNames } from '../../../../../lib/checkout-utilities/utils'
import { isIOS as getIsIOS } from '../../../../../lib/user-agent'
import {
  setFormField,
  setAndValidateFormField,
  touchedFormField,
  validateForm,
  clearFormErrors,
} from '../../../../../actions/common/formActions'
import Input from '../../../../common/FormComponents/Input/Input'
import Select from '../../../../common/FormComponents/Select/Select'

const mapStateToProps = (state, { detailsType }) => {
  // @TODO REFACTOR
  const country = getCountryFor(detailsType, state)
  const form = getDetailsForm(detailsType, state)
  const deliveryType = getSelectedDeliveryLocationType(state)
  const formName = getFormNames(detailsType).details

  return {
    form,
    titles: state.siteOptions.titles,
    formName,
    errors: form.errors,
    deliveryType,
    validationSchema: getYourDetailsSchema(country),
    // NOTE: rather hacky way of determining whether the schemas have updated (as can't do a `===` on them)
    // think about using something like https://github.com/reactjs/reselect
    schemaHash: [country].join(':'),
  }
}

const mapDispatchToProps = {
  setFormField,
  setAndValidateFormField,
  touchFormField: touchedFormField,
  validateForm,
  clearFormErrors,
}

@connect(mapStateToProps, mapDispatchToProps)
class DetailsForm extends Component {
  static propTypes = {
    detailsType: PropTypes.oneOf(['deliveryCheckout', 'billingCheckout'])
      .isRequired, // @TODO DELETE
    deliveryType: PropTypes.string,
    label: PropTypes.string,
    titleHidden: PropTypes.bool,
    h4: PropTypes.bool,
    form: PropTypes.object.isRequired,
    formName: PropTypes.string.isRequired,
    titles: PropTypes.array.isRequired,
    errors: PropTypes.object,
    validationSchema: PropTypes.object,
    // functions
    setAndValidateFormField: PropTypes.func.isRequired,
    touchFormField: PropTypes.func.isRequired,
    validateForm: PropTypes.func.isRequired,
    clearFormErrors: PropTypes.func.isRequired,
    renderTelephone: PropTypes.bool,
  }

  static defaultProps = {
    label: '',
    titlesHidden: false,
    h4: false,
    errors: {},
    deliveryType: '',
    validationSchema: {},
    events: {
      title: 'event131',
      firstName: 'event132',
      lastName: 'event133',
      telephone: 'event134',
    },
    renderTelephone: true,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  componentDidMount() {
    this.validateDetails()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.schemaHash !== this.props.schemaHash) {
      this.validateDetails()
    }
  }

  componentWillUnmount() {
    const { formName, clearFormErrors } = this.props
    clearFormErrors(formName)
  }

  setTitleField = ({ target: { value: title } = {} } = {}) => {
    const { formName, setAndValidateFormField, validationSchema } = this.props
    setAndValidateFormField(formName, 'title', title, validationSchema.title)
  }

  setAndValidateDetailsField = (fieldName) => ({
    target: { value } = {},
  } = {}) => {
    const { formName, validationSchema, setAndValidateFormField } = this.props
    setAndValidateFormField(
      formName,
      fieldName,
      value,
      validationSchema[fieldName]
    )
  }

  validateDetails() {
    const { formName, validationSchema, validateForm } = this.props
    return validateForm(formName, validationSchema)
  }

  touchDetailsField = (fieldName) => () => {
    const { formName, touchFormField } = this.props
    touchFormField(formName, fieldName)
  }

  render() {
    const { l } = this.context
    const {
      form,
      label,
      titles,
      errors,
      detailsType,
      titleHidden,
      h4,
      deliveryType,
      renderTelephone,
    } = this.props
    const isIOS = process.browser && getIsIOS()
    const deliveryTypeClass =
      detailsType === 'delivery'
        ? `DetailsForm--${deliveryType.toLowerCase()}`
        : ''

    return (
      <section
        className={`DetailsForm DetailsForm--${detailsType} ${deliveryTypeClass}`}
        aria-label="Delivery Details"
      >
        {!titleHidden && (
          <header className="DetailsForm-header">
            {h4 ? (
              <h4 className="DetailsForm-headerText">{l(label)}</h4>
            ) : (
              <h3 className="DetailsForm-headerText">{l(label)}</h3>
            )}
          </header>
        )}
        <div className="DetailsForm-row">
          <Select
            autofocus={!isIOS}
            className="DetailsForm-title left-col-margin"
            label={l`Title`}
            disabled={form.success}
            name="title"
            value={path(['fields', 'title', 'value'], form)}
            firstDisabled={l`Please select`}
            onChange={this.setTitleField}
            options={titles}
            isRequired
            errors={errors}
            field={path(['fields', 'title'], form)}
          />
          <div className="DetailsForm-col right-col-margin">&nbsp;</div>
        </div>
        <div className="DetailsForm-row">
          <Input
            className="DetailsForm-firstName left-col-margin"
            isDisabled={form.success}
            field={path(['fields', 'firstName'], form)}
            name="firstName"
            errors={errors}
            label={l`First Name`}
            placeholder={l`First Name`}
            setField={this.setAndValidateDetailsField}
            touchedField={this.touchDetailsField}
            isRequired
          />
          <Input
            isDisabled={form.success}
            className="DetailsForm-lastName right-col-margin"
            field={path(['fields', 'lastName'], form)}
            name="lastName"
            errors={errors}
            label={l`Surname`}
            placeholder={l`Surname`}
            setField={this.setAndValidateDetailsField}
            touchedField={this.touchDetailsField}
            isRequired
          />
        </div>
        {renderTelephone && (
          <div className="DetailsForm-row DetailsForm-telephoneRow">
            <Input
              className="DetailsForm-telephone left-col-margin"
              isDisabled={form.success}
              field={path(['fields', 'telephone'], form)}
              name="telephone"
              type="tel"
              errors={errors}
              label={l`Primary Phone Number`}
              placeholder={l`07123 123123`}
              setField={this.setAndValidateDetailsField}
              touchedField={this.touchDetailsField}
              isRequired
            />
            <div className="DetailsForm-col right-col-margin">&nbsp;</div>
          </div>
        )}
      </section>
    )
  }
}

export default DetailsForm
