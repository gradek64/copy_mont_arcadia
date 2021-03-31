import React from 'react'
import PaymentOptionEditor from '../PaymentOptionEditor'
import renderComponentHelper from 'test/unit/helpers/test-component'
import KlarnaForm from '../../../containers/CheckoutV2/Klarna/KlarnaForm'
import CardPaymentMethod from '../../../containers/CheckoutV2/shared/PaymentDetails/PaymentMethods/CardPaymentMethod'

const EditorForNOOPStub = () => <div>noop...</div>
const EditorForCardStub = () => <div>card...</div>
const EditorForAccntStub = () => <div>accnt...</div>
const EditorForKlarnaStub = () => <div>klarna...</div>

const initialProps = {
  type: 'CARD',
  label: 'Visa',
  EditorForNOOP: EditorForNOOPStub,
  EditorForCard: EditorForCardStub,
  EditorForAccnt: EditorForAccntStub,
  EditorForKlarna: EditorForKlarnaStub,
}

function render(props = initialProps) {
  const component = renderComponentHelper(
    PaymentOptionEditor,
    {},
    { mockBrowserEventListening: false }
  )(props)
  return {
    ...component,
    loginNotice: component.wrapper.find('.PaymentOptionEditor-loginNotice'),
    EditorForCardStub: component.wrapper.find(EditorForCardStub),
    EditorForNOOPStub: component.wrapper.find(EditorForNOOPStub),
    EditorForAccntStub: component.wrapper.find(EditorForAccntStub),
    EditorForKlarnaStub: component.wrapper.find(EditorForKlarnaStub),
  }
}

describe('<PaymentOptionEditor />', () => {
  describe('renders', () => {
    describe('the login notice', () => {
      it('does not render the login notice when the type is CARD', () => {
        expect(render().loginNotice).toHaveLength(0)
      })

      it('does not render the login notice when the type is ACCNT', () => {
        const props = { ...initialProps, type: 'ACCNT' }
        expect(render(props).loginNotice).toHaveLength(0)
      })

      it('renders the login notice when the type is not CARD or ACCNT', () => {
        const props = { ...initialProps, type: 'FOO' }
        expect(render(props).loginNotice).toHaveLength(1)
      })
    })

    describe('the editor', () => {
      it('renders the card editor when the type is card', () => {
        expect(render().EditorForCardStub).toHaveLength(1)
      })

      it('renders the account editor when the type is account', () => {
        const props = { ...initialProps, type: 'ACCNT' }
        expect(render(props).EditorForAccntStub).toHaveLength(1)
      })

      it('renders the klarna editor when the type is klarna', () => {
        const props = { ...initialProps, type: 'KLRNA' }
        expect(render(props).EditorForKlarnaStub).toHaveLength(1)
      })

      it('renders a NOOP editor for types other than card, account and klarna', () => {
        const props = { ...initialProps, type: 'FOO' }
        expect(render(props).EditorForNOOPStub).toHaveLength(1)
      })
    })

    describe('the default editors', () => {
      describe('EditorForCard', () => {
        it('renders the CardPaymentMethod component with the appropriate props', () => {
          const props = { type: 'CARD', label: 'foo' }
          const editorForCardWrapper = render(props)
            .wrapper.find('EditorForCard')
            .dive()
          expect(editorForCardWrapper.props()).toEqual({
            formCardErrorPath: [
              'forms',
              'account',
              'myCheckoutDetails',
              'paymentCardDetailsMCD',
              'errors',
            ],
            formCardName: 'paymentCardDetailsMCD',
            formCardPath: [
              'account',
              'myCheckoutDetails',
              'paymentCardDetailsMCD',
              'fields',
            ],
            isPaymentCard: true,
          })
          expect(editorForCardWrapper.type()).toBe(CardPaymentMethod)
        })
      })

      /*
       * TODO : rewrite this test
       * this test actually test the test and not the component
       */
      xdescribe('EditorForAccnt', () => {
        it('is the CardPaymentMethod component', () => {
          const props = { type: 'ACCNT', label: 'foo' }
          const wrapper = render(props)
          expect(wrapper.instance.props.type).toBe('ACCNT')
        })
      })

      /*
       * TODO : rewrite this test
       * this test actually test the test and not the component
       */
      xdescribe('EditorForKlarna', () => {
        it('is the KlarnaForm component', () => {
          const props = { type: 'KLRNA', label: 'foo' }
          expect(render(props).instance.props.EditorForKlarna).toBe(KlarnaForm)
        })
      })

      /*
       * TODO : rewrite this test
       * this test actually test the test and not the component
       */

      xdescribe('EditorForNOOP', () => {
        it('renders nothing', () => {
          const props = { type: 'KLRNA', label: 'foo' }
          const EditorForNOOP = render(props).instance.props.EditorForNOOP
          expect(EditorForNOOP()).toBe(null)
        })
      })
    })
  })
})
