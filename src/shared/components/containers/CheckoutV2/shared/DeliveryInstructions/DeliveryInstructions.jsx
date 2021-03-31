import PropTypes from 'prop-types'
import React from 'react'
import Form from '../../../../common/FormComponents/Form/Form'

// components
import Input from '../../../../common/FormComponents/Input/Input'

const fieldType = PropTypes.shape({
  value: PropTypes.string,
  isTouched: PropTypes.bool,
})

const DeliveryInstructions = (props, { l }) => {
  const {
    deliveryInstructionsField,
    deliveryInstructionsError,
    maxDeliveryInstructionsCharacters,
    validationSchema,
    setAndValidateFormField,
    touchFormField,
  } = props
  // NOTE: need these, as the translations expect the variables to have specific names
  const maxCharacters = maxDeliveryInstructionsCharacters
  const usedCharacters = deliveryInstructionsField.value.length
  // handlers
  const setAndValidateField = (fieldName) => ({ target: { value } }) => {
    setAndValidateFormField(
      'deliveryInstructions',
      fieldName,
      value,
      validationSchema[fieldName]
    )
  }
  const touchField = (fieldName) => () =>
    touchFormField('deliveryInstructions', fieldName)

  return (
    <section className="DeliveryInstructions">
      <Form className="DeliveryInstructions-form">
        <div className="DeliveryInstructions-row">
          <div className="DeliveryInstructions-left left-col-margin">
            <p className="DeliveryInstructions-subTitle">
              {l`Let us know where we can leave your order if you are not in.`}
            </p>
            <Input
              field={deliveryInstructionsField}
              name="deliveryInstructions"
              placeholder={l`Delivery Instructions`}
              setField={setAndValidateField}
              touchedField={touchField}
              maxLength={maxDeliveryInstructionsCharacters}
              errors={{ deliveryInstructions: deliveryInstructionsError }}
            />
            <span className="DeliveryInstructions-charsRemaining">
              {l`${usedCharacters}/${maxCharacters}`}
            </span>
          </div>
          <div className="DeliveryInstructions-right right-col-margin" />
        </div>
      </Form>
    </section>
  )
}

DeliveryInstructions.propTypes = {
  deliveryInstructionsField: fieldType,
  deliveryInstructionsError: PropTypes.string,
  maxDeliveryInstructionsCharacters: PropTypes.number,
  setAndValidateFormField: PropTypes.func.isRequired,
  touchFormField: PropTypes.func.isRequired,
}

DeliveryInstructions.defaultProps = {
  deliveryInstructionsField: {
    value: '',
    isTouched: false,
  },
  deliveryInstructionsError: '',
  maxDeliveryInstructionsCharacters: 30,
}

DeliveryInstructions.contextTypes = {
  l: PropTypes.func,
}

export default DeliveryInstructions
