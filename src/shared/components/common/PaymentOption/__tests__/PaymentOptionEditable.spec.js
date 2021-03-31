import React from 'react'
import renderComponentHelper from 'test/unit/helpers/test-component'
import PaymentOptionEditable, { showEditor } from '../PaymentOptionEditable'
import PaymentOption from '../PaymentOption'
import PaymentOptionEditor from '../PaymentOptionEditor'

const PaymentOptionStub = () => <div>payment option...</div>
const PaymentOptionEditorStub = () => <div>payment option editor...</div>

const initalProps = {
  type: 'CARD',
  label: 'Visa',
  value: 'VISA',
  isMobile: false,
  description: 'Visa',
  icons: [],
  isChecked: false,
  onChange: jest.fn(),
  showEditor: jest.fn(),
  PaymentOption: PaymentOptionStub,
  PaymentOptionEditor: PaymentOptionEditorStub,
}

function render(props = initalProps) {
  const component = renderComponentHelper(
    PaymentOptionEditable,
    {},
    { mockBrowserEventListening: false }
  )(props)
  return {
    ...component,
    PaymentOptionStub: component.wrapper.find(PaymentOptionStub),
    PaymentOptionEditorStub: component.wrapper.find(PaymentOptionEditorStub),
  }
}

describe('PaymentOptionEditable', () => {
  beforeEach(() => jest.clearAllMocks())

  describe('@render', () => {
    it('renders a PaymentOption', () => {
      expect(render().PaymentOptionStub).toHaveLength(1)
    })

    describe('when the `showEditor` function prop returns true', () => {
      it('renders the PaymentOptionEditor as a child of the PaymentOption', () => {
        initalProps.showEditor.mockReturnValue(true)
        expect(
          render().PaymentOptionStub.find(PaymentOptionEditorStub)
        ).toHaveLength(1)
      })
    })

    describe('when the `showEditor` function prop returns false', () => {
      it('renders the payment option with no children', () => {
        initalProps.showEditor.mockReturnValue(false)
        expect(render().PaymentOptionStub.prop('children')).toBe(false)
      })
    })

    describe('the PaymentOption', () => {
      it('renders with the correct props', () => {
        const paymentOptionProps = render().PaymentOptionStub.props()
        const expectedPaymentoptionProps = { ...initalProps, children: false }

        delete expectedPaymentoptionProps.showEditor
        delete expectedPaymentoptionProps.PaymentOption
        delete expectedPaymentoptionProps.PaymentOptionEditor

        expect(paymentOptionProps).toEqual(expectedPaymentoptionProps)
      })
    })

    describe('the PaymentOptionEditor', () => {
      it('renders with the correct props', () => {
        initalProps.showEditor.mockReturnValue(true)
        const editorProps = render().PaymentOptionEditorStub.props()
        const expectedEditorProps = {
          type: initalProps.type,
          label: initalProps.label,
        }
        expect(editorProps).toEqual(expectedEditorProps)
      })
    })

    describe('the `showEditor` prop', () => {
      it('is called with the props', () => {
        render()
        expect(initalProps.showEditor).toHaveBeenCalledTimes(1)
        expect(initalProps.showEditor).toHaveBeenCalledWith(initalProps)
      })
    })

    describe('default props', () => {
      it('is as expected', () => {
        const props = { ...initalProps }

        delete props.showEditor
        delete props.PaymentOption
        delete props.PaymentOptionEditor

        const renderedProps = render(props).instance.props
        const expectedRenderedProps = {
          ...initalProps,
          showEditor,
          PaymentOption,
          PaymentOptionEditor,
        }

        expect(renderedProps).toEqual(expectedRenderedProps)
      })
    })
  })
})
