import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Input from '../../common/FormComponents/Input/Input'
import Select from '../../common/FormComponents/Select/Select'
import { reduce, take, drop, fromPairs, map } from 'ramda'
import rules from '../../../constants/checkoutAddressFormRules'
import { getCountriesByAddressType } from '../../../selectors/common/configSelectors'

@connect(
  (state) => ({
    customerDetailsSchema: state.config.customerDetailsSchema,
    siteOptions: state.siteOptions,
    deliveryCountries: getCountriesByAddressType(state, 'deliveryMCD'),
    rules: state.config.checkoutAddressFormRules,
  }),
  {}
)
class DetailsFields extends Component {
  static propTypes = {
    user: PropTypes.object,
    setField: PropTypes.func,
    touchedField: PropTypes.func,
    form: PropTypes.object,
    resetForm: PropTypes.func,
    customerDetailsSchema: PropTypes.array,
    siteOptions: PropTypes.object,
    deliveryCountries: PropTypes.array,
    errors: PropTypes.object,
    state: PropTypes.object,
    privacyProtected: PropTypes.bool,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  componentDidMount() {
    const { user } = this.props
    if (user) this.setUserInfo()
  }

  setUserInfo() {
    const { resetForm, customerDetailsSchema, user } = this.props
    const { nameAndPhone, address } = user.deliveryDetails
    const getNameAndPhoneDetails = (schem) =>
      map((key) => [key, nameAndPhone[key]], schem)
    const getAddressDetails = (schem) =>
      map((key) => [key, address[key]], schem)
    const userInfo = fromPairs([
      ...getNameAndPhoneDetails(take(4, customerDetailsSchema)),
      ...getAddressDetails(take(6, drop(4, customerDetailsSchema))),
      ...[
        ['type', ''],
        ['cardNumber', ''],
        ['expiryMonth', ''],
        ['expiryYear', ''],
      ],
    ])
    resetForm('customerDetails', userInfo)
  }

  resetForm() {
    const { resetForm, customerDetailsSchema } = this.props
    const reset = reduce(
      (obj, key) => ({ ...obj, [key]: '' }),
      {},
      customerDetailsSchema
    )

    resetForm('customerDetails', reset)
  }

  renderStateFields() {
    const {
      setField,
      touchedField,
      form,
      siteOptions,
      errors,
      state,
      privacyProtected,
    } = this.props
    const { l } = this.context

    if (state && !state.stateFieldType) {
      return null
    } else if (state && state.stateFieldType) {
      return state.stateFieldType === 'input' ? (
        <Input
          label={l`State`}
          field={form.fields.state}
          setField={() => setField('state')}
          touchedField={() => touchedField('state')}
          placeholder={l`State`}
          name="state"
          errors={errors}
          privacyProtected={privacyProtected}
        />
      ) : (
        <Select
          label={l`State`}
          options={siteOptions.USStates}
          name="state"
          defaultValue={form.fields.state.value}
          value={form.fields.state.value}
          onChange={setField('state')}
          onBlur={touchedField('state')}
          privacyProtected={privacyProtected}
        />
      )
    }
  }

  render() {
    const { l } = this.context
    const {
      setField,
      touchedField,
      deliveryCountries,
      form,
      siteOptions,
      errors,
      privacyProtected,
    } = this.props
    const country = form.fields.country.value

    return (
      <section className="DetailsField">
        <h3>{l`Contact information`}</h3>
        <Select
          label={l`Title`}
          options={siteOptions.titles}
          name="title"
          firstDisabled={l`Please select`}
          value={form.fields.title.value}
          onChange={setField('title')}
          onBlur={touchedField('title')}
          isRequired
          privacyProtected={privacyProtected}
        />

        <Input
          label={l`First Name`}
          placeholder={l`First Name`}
          name="firstName"
          field={form.fields.firstName}
          setField={() => setField('firstName')}
          touchedField={() => touchedField('firstName')}
          errors={errors}
          isRequired
          privacyProtected={privacyProtected}
        />

        <Input
          label={l`Surname`}
          placeholder={l`Surname`}
          name="lastName"
          field={form.fields.lastName}
          setField={() => setField('lastName')}
          touchedField={() => touchedField('lastName')}
          errors={errors}
          isRequired
          privacyProtected={privacyProtected}
        />

        <Input
          label={l`Mobile`}
          placeholder={l`Mobile Number`}
          field={form.fields.telephone}
          setField={() => setField('telephone')}
          touchedField={() => touchedField('telephone')}
          name="telephone"
          type="tel"
          errors={errors}
          isRequired
          privacyProtected={privacyProtected}
        />

        <h3>{l`Delivery address`}</h3>

        <Select
          label={l`Country`}
          options={deliveryCountries}
          name="country"
          defaultValue={form.fields.country.value}
          value={form.fields.country.value}
          onChange={setField('country')}
          onBlur={touchedField('country')}
          isRequired
          privacyProtected={privacyProtected}
        />
        <Input
          label={
            country && rules[country]
              ? l(rules[country].postcodeLabel)
              : l`Postcode`
          }
          placeholder={
            country && rules[country]
              ? l(rules[country].postcodeLabel)
              : l`Postcode`
          }
          field={form.fields.postcode}
          setField={() => setField('postcode')}
          touchedField={() => touchedField('postcode')}
          name="postcode"
          errors={errors}
          isRequired
          privacyProtected={privacyProtected}
        />
        <Input
          label={
            country && rules[country]
              ? l(rules[country].premisesLabel)
              : l`Address Line 1`
          }
          placeholder={
            country && rules[country]
              ? l(rules[country].premisesLabel)
              : l`Address Line 1`
          }
          field={form.fields.address1}
          setField={() => setField('address1')}
          touchedField={() => touchedField('address1')}
          name="address1"
          errors={errors}
          isRequired
          privacyProtected={privacyProtected}
        />
        <Input
          label={l`Address Line 2`}
          field={form.fields.address2}
          setField={() => setField('address2')}
          touchedField={() => touchedField('address2')}
          placeholder={l`Address Line 2`}
          name="address2"
          errors={errors}
          privacyProtected={privacyProtected}
        />
        <Input
          label={l`Town/City`}
          field={form.fields.city}
          setField={() => setField('city')}
          touchedField={() => touchedField('city')}
          placeholder={l`Town/City`}
          name="city"
          errors={errors}
          isRequired
          privacyProtected={privacyProtected}
        />

        {this.renderStateFields()}

        <div>
          <a // eslint-disable-line jsx-a11y/no-static-element-interactions
            onClick={() => this.resetForm()}
            className="DetailsFields-anchor"
          >{l`Reset Form`}</a>
        </div>
      </section>
    )
  }
}

export default DetailsFields
