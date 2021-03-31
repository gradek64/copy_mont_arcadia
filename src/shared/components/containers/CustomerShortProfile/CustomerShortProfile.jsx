import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { mapObjIndexed, prop, isEmpty, any, values, path, pick } from 'ramda'
import Button from '../../common/Button/Button'
import AccountHeader from '../../common/AccountHeader/AccountHeader'
import Form from '../../common/FormComponents/Form/Form'
import BackToAccountLink from '../MyAccount/BackToAccountLink'
import * as AccountActions from '../../../actions/common/accountActions'
import * as FormActions from '../../../actions/common/formActions'
import Input from '../../common/FormComponents/Input/Input'
import Message from '../../common/FormComponents/Message/Message'
import { validate } from '../../../lib/validator'
import analyticsDecorator from '../../../../client/lib/analytics/analytics-decorator'
import {
  maxLength60Characters,
  validateSpecialChars,
} from '../../../lib/validator/validators'

const getCustomerShortProfile = pick(['firstName', 'lastName', 'email'])

const formName = 'customerShortProfile'
const validationSchema = {
  email: 'email',
  firstName: ['required', maxLength60Characters, validateSpecialChars],
  lastName: ['required', maxLength60Characters, validateSpecialChars],
}

@analyticsDecorator('my-details')
@connect(
  (state) => ({
    customerShortProfile: state.forms.customerShortProfile,
    user: state.account.user,
  }),
  { ...AccountActions, ...FormActions }
)
class CustomerShortProfile extends React.Component {
  static propTypes = {
    customerShortProfile: PropTypes.object,
    user: PropTypes.object,
    changeShortProfileRequest: PropTypes.func,
    resetForm: PropTypes.func,
    setFormField: PropTypes.func,
    setFormMessage: PropTypes.func,
    setFormSuccess: PropTypes.func,
    touchedFormField: PropTypes.func,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  componentDidMount() {
    const { resetForm, user, setFormSuccess } = this.props
    setFormSuccess(formName, false)
    resetForm(formName, getCustomerShortProfile(user))
  }

  componentWillUnmount() {
    this.props.setFormMessage(formName, {})
  }

  onSubmit = (ev) => {
    ev.preventDefault()
    const { changeShortProfileRequest, customerShortProfile } = this.props
    changeShortProfileRequest({
      email: path(['fields', 'email', 'value'], customerShortProfile),
      lastName: path(['fields', 'lastName', 'value'], customerShortProfile),
      firstName: path(['fields', 'firstName', 'value'], customerShortProfile),
    })
  }
  backToAccount = (e) => {
    e.preventDefault()
    browserHistory.push('/my-account')
    this.props.setFormSuccess(formName, false)
    this.props.setFormMessage(formName, {})
  }

  render() {
    const { l } = this.context
    const {
      customerShortProfile,
      setFormField,
      touchedFormField,
      setFormMessage,
    } = this.props

    const clearMessage = () => {
      if (!isEmpty(customerShortProfile.message)) {
        setFormMessage(formName, {})
      }
    }

    const setField = (name) => (e) => {
      clearMessage()
      setFormField(formName, name, e.target.value)
    }

    const touchedField = (name) => () => {
      touchedFormField(formName, name)
    }

    const errors = validate(
      validationSchema,
      mapObjIndexed(prop('value'), customerShortProfile.fields),
      l
    )
    return (
      <section className="CustomerShortProfile">
        <AccountHeader
          link="/my-account"
          label={l`Back to My Account`}
          title={l`My details`}
        />
        <Form
          onSubmit={this.onSubmit}
          className="MyAccount-form MyAccount-wrapper"
        >
          <Input
            field={path(['fields', 'firstName'], customerShortProfile)}
            name="firstName"
            type="text"
            placeholder={l`Example: John`}
            errors={errors}
            label={l`First Name`}
            setField={setField}
            touchedField={touchedField}
            isRequired
            privacyProtected
          />

          <Input
            field={path(['fields', 'lastName'], customerShortProfile)}
            name="lastName"
            type="text"
            placeholder={l`Example: Doe`}
            errors={errors}
            label={l`Last Name`}
            setField={setField}
            touchedField={touchedField}
            isRequired
            privacyProtected
          />

          <Input
            field={path(['fields', 'email'], customerShortProfile)}
            name="email"
            type="email"
            placeholder={l`example@domain.com`}
            errors={errors}
            label={l`Email address`}
            setField={setField}
            touchedField={touchedField}
            isRequired
            privacyProtected
          />

          <Button
            type="submit"
            isDisabled={
              !isEmpty(errors) ||
              !any(prop('isDirty'), values(customerShortProfile.fields))
            }
            className="CustomerShortProfile-saveChanges"
          >
            {l`SAVE CHANGES`}
          </Button>

          <Message
            message={path(['message', 'message'], customerShortProfile)}
            type={path(['message', 'type'], customerShortProfile)}
          />
          <div>
            <BackToAccountLink
              clickHandler={this.backToAccount}
              text={l`Back to My Account`}
            />
          </div>
        </Form>
      </section>
    )
  }
}

export default CustomerShortProfile
