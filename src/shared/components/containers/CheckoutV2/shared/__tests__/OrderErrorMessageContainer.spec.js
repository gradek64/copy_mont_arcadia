import OrderErrorMessageContainer from '../OrderErrorMessageContainer'
import testComponentHelper, {
  renderConnectedComponentProps,
} from 'test/unit/helpers/test-component'
import Message from '../../../../common/FormComponents/Message/Message'

const mockProps = {
  errorMessage: 'Something went wrong...',
  orderError: 'hello',
}

const orderErrorProps = {
  orderError: 'Something went wrong...',
}

const $ = {
  message: Message,
}

const renderComponent = testComponentHelper(
  OrderErrorMessageContainer.WrappedComponent
)

describe('<OrderErrorMessageContainer/>', () => {
  describe('@renders', () => {
    describe('when there is an error message', () => {
      it('renders the message', () => {
        const props = { ...mockProps }
        const component = renderComponent(props)
        expect(component.wrapper.find($.message)).toHaveLength(1)
      })
    })

    describe('when there is an order error', () => {
      it('renders the message', () => {
        const props = { ...orderErrorProps }
        const component = renderComponent(props)
        expect(component.wrapper.find($.message)).toHaveLength(1)
      })
    })

    describe('when there is no error message', () => {
      it('does not render the message', () => {
        const props = {
          ...mockProps,
          errorMessage: undefined,
          orderError: undefined,
        }
        const component = renderComponent(props)
        expect(component.wrapper.find($.message)).toHaveLength(0)
      })
    })

    describe('when the message is rendered', () => {
      it('renders with the appropriate props', () => {
        const props = { ...mockProps }
        const component = renderComponent(props)
        const message = component.wrapper.find($.message)
        expect(component.getTreeFor(message)).toMatchSnapshot()
      })
    })
  })

  describe('@connected', () => {
    describe('mapping state to props', () => {
      describe('errorMessage', () => {
        describe('when there is an order form error message', () => {
          it('maps to the error message', () => {
            const state = {
              forms: {
                checkout: {
                  order: {
                    message: {
                      message: 'Something went wrong...',
                    },
                  },
                },
              },
            }
            const props = renderConnectedComponentProps(
              OrderErrorMessageContainer,
              state
            )
            expect(props.errorMessage).toBe('Something went wrong...')
          })
        })

        describe('when the order form error message is not reachable', () => {
          it('maps to undefined', () => {
            const props = renderConnectedComponentProps(
              OrderErrorMessageContainer
            )
            expect(props.errorMessage).toBe(undefined)
          })
        })
      })
    })
  })
})
