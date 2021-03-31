import React from 'react'
import testComponentHelper from 'test/unit/helpers/test-component'
import PaymentMethodPreviewEditable from '../PaymentMethodPreviewEditable'

const Placeholder = () => <div>...</div>

const defaultProps = {
  PaymentMethodOptions: () => <Placeholder />,
  PaymentMethodPreview: () => <Placeholder />,
  onEnableEditingClick: jest.fn(() => ({ type: 'FOO' })),
  isEditingEnabled: true,
}

const renderComponent = testComponentHelper(PaymentMethodPreviewEditable)

describe('<PaymentMethodPreviewEditable />', () => {
  describe('@renders', () => {
    describe('when in editing is enabled', () => {
      let props
      let wrapper

      beforeEach(() => {
        props = { ...defaultProps, isEditingEnabled: true }
        wrapper = renderComponent(props).wrapper
      })

      it('does not renders the payment method preview', () => {
        expect(wrapper.find(props.PaymentMethodPreview)).toHaveLength(0)
      })

      it('renders the payment method options form', () => {
        expect(wrapper.find(props.PaymentMethodOptions)).toHaveLength(1)
      })
    })

    describe('when editing is not enabled', () => {
      let props
      let wrapper

      beforeEach(() => {
        props = { ...defaultProps, isEditingEnabled: false }
        wrapper = renderComponent(props).wrapper
      })

      it('renders the payment method preview', () => {
        expect(wrapper.find(props.PaymentMethodPreview)).toHaveLength(1)
      })

      it('does not render the payment method options form', () => {
        expect(wrapper.find(props.PaymentMethodOptions)).toHaveLength(0)
      })
    })
  })

  describe('@events', () => {
    describe('when the payment method preview change button is clicked', () => {
      it('results in `props.onEnableEditingClick()` being called', () => {
        const props = { ...defaultProps, isEditingEnabled: false }
        const wrapper = renderComponent(props).wrapper
        const preview = wrapper.find(props.PaymentMethodPreview)
        preview.prop('onChangeButtonClick')()
        expect(props.onEnableEditingClick).toHaveBeenCalledTimes(1)
      })
    })
  })
})
