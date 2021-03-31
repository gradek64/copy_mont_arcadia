import React from 'react'
import ButtonLoader from '../../common/ButtonLoader/ButtonLoader'
import Message from '../../common/FormComponents/Message/Message'
import Input from '../../common/FormComponents/Input/Input'
import Form from '../../common/FormComponents/Form/Form'
import PropTypes from 'prop-types'
import { path, map, prop } from 'ramda'

export default class PromotionForm extends React.Component {
  static propTypes = {
    show: PropTypes.bool,
    promotionForm: PropTypes.object,
    onSubmitHandler: PropTypes.func,
    setField: PropTypes.func,
    touchedField: PropTypes.func,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.promotionFormRef = React.createRef()
  }

  onSubmit(formData, e) {
    e.preventDefault()

    if (this.promotionFormRef && this.promotionFormRef.current) {
      this.promotionFormRef.current.querySelector('input').blur()
    }

    this.props.onSubmitHandler(formData)
  }

  render() {
    const { l } = this.context
    const { show, promotionForm, setField, touchedField } = this.props
    const formData = map(prop('value'), promotionForm.fields)

    if (!show) return <div />
    return (
      <Form
        onSubmit={(e) => this.onSubmit(formData, e)}
        ref={this.promotionFormRef}
        className="PromotionCode-form"
      >
        <Input
          field={promotionForm.fields.promotionCode}
          name="promotionCode"
          type="text"
          placeholder={l`Enter your promotion code`}
          autocomplete="off"
          setField={setField}
          touchedField={touchedField}
        />
        <ButtonLoader
          className="PromotionCode-submit"
          formName="promotionCode"
          type="submit"
          isDisabled={!promotionForm.fields.promotionCode.value}
        >
          {l`Apply`}
        </ButtonLoader>

        <Message
          className="PromotionCode-message"
          message={path(['message', 'message'], promotionForm)}
          type={path(['message', 'type'], promotionForm)}
        />
      </Form>
    )
  }
}
