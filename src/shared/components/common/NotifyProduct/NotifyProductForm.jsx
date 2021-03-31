import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isEmpty, mapObjIndexed } from 'ramda'
import { connect } from 'react-redux'
import Input from '../FormComponents/Input/Input'
import Button from '../Button/Button'
import ProductSizes from '../ProductSizes/ProductSizes'
import { toggleModal } from '../../../actions/common/modalActions'
import {
  resetForm,
  setFormField,
  touchedFormField,
  touchedMultipleFormFields,
} from '../../../actions/common/formActions'
import { updateActiveItem } from '../../../actions/common/productsActions'
import { validate } from '../../../lib/validator'
import Form from '../FormComponents/Form/Form'

@connect(
  (state) => ({
    notifyStockForm: state.forms.notifyStock,
    selectedOosItem: state.productDetail.selectedOosItem,
    user: state.account.user,
    brandName: state.config.name,
  }),
  {
    toggleModal,
    resetForm,
    setFormField,
    touchedFormField,
    touchedMultipleFormFields,
    updateActiveItem,
  }
)
class NotifyProductForm extends Component {
  static propTypes = {
    notifyStockForm: PropTypes.object,
    sizes: PropTypes.array,
    stockThreshold: PropTypes.number,
    selectedOosItem: PropTypes.object,
    setFormField: PropTypes.func,
    touchedFormField: PropTypes.func,
    touchedMultipleFormFields: PropTypes.func,
    toggleModal: PropTypes.func,
    resetForm: PropTypes.func,
    backInStock: PropTypes.bool,
    productTitle: PropTypes.string,
    brandName: PropTypes.string,
    user: PropTypes.object,
    submitForm: PropTypes.func,
    updateActiveItem: PropTypes.func,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      showSizeError: false,
    }
  }

  renderSubmitted(formDataState) {
    const { l } = this.context
    const { toggleModal } = this.props

    return (
      <section>
        <h1>{l`Submitted`}</h1>
        <p>{formDataState}</p>
        <Button clickHandler={toggleModal}>{l`Back to shopping`}</Button>
      </section>
    )
  }

  renderSubmitting() {
    const { l } = this.context
    return <div>{l`Submitting`}...</div>
  }

  submitNotifyMe = (event, errors) => {
    const {
      submitForm,
      touchedMultipleFormFields,
      notifyStockForm,
    } = this.props
    event.preventDefault()
    touchedMultipleFormFields(
      'notifyStock',
      Object.keys(notifyStockForm.fields)
    )
    if (isEmpty(errors)) {
      submitForm()
    } else {
      this.setState({
        showSizeError: true,
      })
    }
  }

  render() {
    const { l } = this.context
    const {
      setFormField,
      notifyStockForm,
      selectedOosItem,
      touchedFormField,
      sizes,
      stockThreshold,
      backInStock,
      productTitle,
      resetForm,
      brandName,
      user,
      updateActiveItem,
    } = this.props

    const fields = notifyStockForm.fields
    const formData = mapObjIndexed((obj) => obj.value, fields)
    const errors = validate(
      {
        email: 'email',
        firstName: 'required',
        surname: 'required',
        selectedOosItem: 'productSize',
      },
      { ...formData, selectedOosItem },
      l
    )

    const touchedField = (name) => () => touchedFormField('notifyStock', name)
    const setField = (name) => (e) =>
      setFormField('notifyStock', name, e.target.value)
    const copy = backInStock
      ? l`Provide us with your email address and we’ll let you know when the item becomes available.`
      : `${l`Provide us with your email address and we’ll let you know when this item arrives on`} ${brandName}`

    const label = l`Select size`

    if (formData.state === 'submitting') return this.renderSubmitting()

    if (
      fields.firstName.value === null &&
      !fields.firstName.isTouched &&
      !isEmpty(user)
    ) {
      resetForm('notifyStock', {
        firstName: user.firstName,
        surname: user.lastName,
        email: user.email,
        state: null,
      })
    }

    if (formData.state !== '' && formData.state !== null) {
      return this.renderSubmitted(formData.state)
    }

    return (
      <section>
        <h4>{productTitle}</h4>
        <p>{copy}</p>
        <ProductSizes
          label={label}
          selectedOosItem={selectedOosItem}
          items={sizes}
          stockThreshold={stockThreshold}
          activeItem={{}}
          notifyEmail
          showOosOnly
          error={this.state.showSizeError && errors.selectedOosItem}
          showOutOfStockLabel={false}
          onSelectSize={updateActiveItem}
        />
        <Form onSubmit={(event) => this.submitNotifyMe(event, errors)}>
          <Input
            field={fields.firstName}
            name="firstName"
            errors={errors}
            label={l`First Name`}
            setField={setField}
            touchedField={touchedField}
            isRequired
          />
          <Input
            field={fields.surname}
            name="surname"
            errors={errors}
            label={l`Last Name`}
            setField={setField}
            touchedField={touchedField}
            isRequired
          />
          <Input
            field={fields.email}
            type="email"
            name="email"
            errors={errors}
            label={l`Email address`}
            setField={setField}
            touchedField={touchedField}
            isRequired
          />
          <Button type="submit" className="NotifyProduct-submitButton">
            {l`Submit`}
          </Button>
        </Form>
      </section>
    )
  }
}

export default NotifyProductForm
