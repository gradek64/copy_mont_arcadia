import testComponentHelper, {
  renderConnectedComponentProps,
} from 'test/unit/helpers/test-component'

const state = {
  forms: {
    checkout: {
      yourAddress: {
        fields: {
          address1: { value: 'foo...' },
        },
      },
      yourDetails: {
        fields: {
          title: { value: 'mr' },
        },
      },
    },
  },
}

const mockProps = {
  address: {
    address1: 'foo...',
  },
  details: {
    title: 'mr',
  },
  setDeliveryEditingEnabled: jest.fn(),
}

const checkoutActions = {
  setDeliveryEditingEnabled: jest.fn(() => ({
    type: 'Foo',
  })),
}

function mockCheckoutActions() {
  jest.doMock(
    '../../../../../actions/common/checkoutActions',
    () => checkoutActions
  )
}

function requireAddressPreviewContainer() {
  jest.clearAllMocks()
  mockCheckoutActions()
  return require('../DeliveryAddressPreviewContainer').default
}

function renderComponent(props) {
  const AddressPreviewContainer = requireAddressPreviewContainer()
  const mocking = { mockBrowserEventListening: false }
  return testComponentHelper(
    AddressPreviewContainer.WrappedComponent,
    {},
    mocking
  )(props)
}

describe('<DeliveryAddressPreviewContainer />', () => {
  describe('@renders', () => {
    describe('the default rendering', () => {
      it('renders as expected', () => {
        expect(renderComponent(mockProps).getTree()).toMatchSnapshot()
      })
    })
  })

  describe('@connected', () => {
    const props = renderConnectedComponentProps(
      requireAddressPreviewContainer(),
      state
    )

    it('should correctly map state to props', () => {
      expect(props.address).toEqual({ address1: 'foo...' })
      expect(props.details).toEqual({ title: 'mr' })
    })

    it('should correctly map dispatch to props', () => {
      props.setDeliveryEditingEnabled(true)

      expect(checkoutActions.setDeliveryEditingEnabled).toHaveBeenCalledTimes(1)
      expect(checkoutActions.setDeliveryEditingEnabled).toHaveBeenCalledWith(
        true
      )
    })
  })
})
