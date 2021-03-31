import React from 'react'
import testComponentHelper from 'test/unit/helpers/test-component'
import AddressPreviewEditable from '../AddressPreviewEditable'

const Placeholder = () => <div>...</div>

const defaultProps = {
  DetailsForm: () => <Placeholder />,
  AddressForm: () => <Placeholder />,
  AddressPreview: () => <Placeholder />,
  onEnableEditingClick: jest.fn(() => ({ type: 'FOO' })),
  isEditingEnabled: true,
}

const renderComponent = testComponentHelper(AddressPreviewEditable)

describe('<AddressPreviewEditable />', () => {
  describe('@renders', () => {
    describe('when in editing is enabled', () => {
      let props
      let wrapper

      beforeEach(() => {
        props = { ...defaultProps, isEditingEnabled: true }
        wrapper = renderComponent(props).wrapper
      })

      it('does not renders the address preview', () => {
        expect(wrapper.find(props.AddressPreview)).toHaveLength(0)
      })

      it('renders the personal details form', () => {
        expect(wrapper.find(props.DetailsForm)).toHaveLength(1)
      })

      it('renders the address details form', () => {
        expect(wrapper.find(props.AddressForm)).toHaveLength(1)
      })
    })

    describe('when editing is not enabled', () => {
      let props
      let wrapper

      beforeEach(() => {
        props = { ...defaultProps, isEditingEnabled: false }
        wrapper = renderComponent(props).wrapper
      })

      it('renders the address preview', () => {
        expect(wrapper.find(props.AddressPreview)).toHaveLength(1)
      })

      it('does not render the personal details form', () => {
        expect(wrapper.find(props.DetailsForm)).toHaveLength(0)
      })

      it('does not render the address details form', () => {
        expect(wrapper.find(props.AddressForm)).toHaveLength(0)
      })
    })
  })

  describe('@events', () => {
    describe('when the address preview change button is clicked', () => {
      it('results in `props.onEnableEditingClick()` being called', () => {
        const props = { ...defaultProps, isEditingEnabled: false }
        const wrapper = renderComponent(props).wrapper
        const preview = wrapper.find(props.AddressPreview)
        preview.prop('onChangeButtonClick')()
        expect(props.onEnableEditingClick).toHaveBeenCalledTimes(1)
      })
    })
  })
})
