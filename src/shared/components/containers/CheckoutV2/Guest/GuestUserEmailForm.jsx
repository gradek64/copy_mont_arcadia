import React, { Component } from 'react'
import Input from '../../../common/FormComponents/Input/Input'
import Checkbox from '../../../common/FormComponents/Checkbox/Checkbox'

import PropTypes from 'prop-types'
import { pathOr } from 'ramda'
import { connect } from 'react-redux'
import {
  setFormField,
  touchedFormField,
  focusedFormField,
} from '../../../../actions/common/formActions'
import PrivacyNotice from '../../../../components/common/PrivacyNotice/PrivacyNotice'

@connect(
  (state) => ({
    guestUserForm: pathOr('', ['forms', 'checkout', 'guestUser'], state),
  }),
  {
    setFormField,
    touchedFormField,
    focusedFormField,
  }
)
class GuestUserEmailForm extends Component {
  static propTypes = {
    guestUserForm: PropTypes.object.isRequired,
    setFormField: PropTypes.func.isRequired,
    touchedFormField: PropTypes.func.isRequired,
    formName: PropTypes.string,
  }

  static defaultProps = {
    formName: 'guestUser',
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  getEmailValue = (email) => email

  setChecked = (name) => (e) => {
    const { formName, setFormField } = this.props

    setFormField(formName, name, e.target.checked)
  }

  onTouchedField = (field) => () => {
    const { formName, touchedFormField } = this.props

    touchedFormField(formName, field)
  }

  render() {
    const { guestUserForm, formName, setFormField, errors } = this.props
    const { l } = this.context

    const { email, signUpGuest } = guestUserForm.fields
    const setField = (field) => (e) => {
      setFormField(formName, field, e.target.value)
    }
    const fieldValue = this.getEmailValue(email)
    const privacyMessage = l`privacyNoticeSignUpGuestCheckbox`
    const privacyNoticeUrlText = l`privacyNoticeUrlTextSignUpGuestCheckbox`

    return (
      <div className="GuestUserEmailForm">
        <div className="GuestUserEmailForm-email">
          <Input
            name="email"
            setField={setField}
            touchedField={this.onTouchedField}
            label="Email Address"
            isRequired
            id="Guest-email"
            field={fieldValue}
            type="email"
            errors={errors}
            placeholder={`For order confirmation only`}
          />
          <Checkbox
            className={'GuestUserEmailForm-signUpGuestCheckbox'}
            name="signUpGuest"
            onChange={this.setChecked('signUpGuest')}
            checked={{ value: signUpGuest.value || false }}
          >
            {l`Tick here to receive style inspiration and exclusives straight to your inbox.`}
            <br />
            <PrivacyNotice
              privacyMessage={privacyMessage}
              privacyNoticeUrlText={privacyNoticeUrlText}
              showPrivacyMessageForUs
            />
          </Checkbox>
        </div>
      </div>
    )
  }
}

export default GuestUserEmailForm
