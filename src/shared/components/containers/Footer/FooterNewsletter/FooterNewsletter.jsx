import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { prop, mapObjIndexed } from 'ramda'

import { validate } from '../../../../lib/validator'
import Input from '../../../common/FormComponents/Input/Input'
import Button from '../../../common/Button/Button'
import Form from '../../../common/FormComponents/Form/Form'
import {
  setFormField,
  touchedFormField,
} from '../../../../actions/common/formActions'

class FooterNewsletter extends Component {
  static propTypes = {
    footerNewsletterForm: PropTypes.object.isRequired,
    newsletter: PropTypes.object.isRequired,
    setFormField: PropTypes.func.isRequired,
    touchedFormField: PropTypes.func.isRequired,
  }

  static defaultProps = {
    footerNewsletterForm: {},
    newsletter: {
      label: '',
      placeholder: '',
      button: '',
      signUpUrl: '',
      openNewWindow: false,
    },
    setFormField: () => {},
    touchedFormField: () => {},
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  getErrors = () => {
    const validationSchema = { email: 'email' }
    return validate(
      validationSchema,
      mapObjIndexed(prop('value'), this.props.footerNewsletterForm.fields),
      this.context.l
    )
  }

  onSubmit = (e) => {
    e.preventDefault()
    if (Object.keys(this.getErrors()).length) return
    this.redirectUser()
  }

  redirectUser() {
    const { newsletter } = this.props
    const { signUpUrl, openNewWindow } = newsletter

    if (openNewWindow) {
      if (window.open) window.open(signUpUrl)
      return
    }
    if (window.location) window.location = signUpUrl
  }

  getFormattedText(text, length) {
    return text && text.length > length ? `${text.slice(0, length)}...` : text
  }

  render() {
    const {
      footerNewsletterForm,
      setFormField,
      touchedFormField,
      newsletter,
    } = this.props
    const { label, placeholder, button } = newsletter
    const { email } = footerNewsletterForm.fields
    const formattedButtonText = this.getFormattedText(button, 14)
    const errors = this.getErrors()
    const setField = (field) => (e) =>
      setFormField('footerNewsletter', field, e.target.value)
    const touchedField = (field) => () =>
      touchedFormField('footerNewsletter', field)

    return (
      <Form className="FooterNewsletter" onSubmit={this.onSubmit}>
        <label className="FooterNewsletter-label" htmlFor="email">
          {label}
        </label>
        <div className="FooterNewsletter-inputWrapper">
          <Input
            className="FooterNewsletter-input"
            field={email}
            name="email"
            type="email"
            errors={errors}
            placeholder={placeholder}
            setField={setField}
            touchedField={touchedField}
          />
          <Button type="submit" className="FooterNewsletter-button">
            {formattedButtonText}
          </Button>
        </div>
      </Form>
    )
  }
}

export default connect(
  (state) => ({
    footerNewsletterForm: state.forms.footerNewsletter,
    newsletter: state.footer.newsletter,
  }),
  {
    setFormField,
    touchedFormField,
  }
)(FooterNewsletter)
