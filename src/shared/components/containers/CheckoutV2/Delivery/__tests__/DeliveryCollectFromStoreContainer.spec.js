import testComponentHelper, {
  analyticsDecoratorHelper,
} from 'test/unit/helpers/test-component'
import DeliveryCollectFromStoreContainer from '../DeliveryCollectFromStoreContainer'

jest.mock('react-router', () => ({
  browserHistory: {
    push: jest.fn(),
  },
}))

const getProps = () => {
  return {
    isMobile: true,
    location: {},
    setStoreUpdating: jest.fn(),
  }
}

describe('<DeliveryCollectFromStoreContainer />', () => {
  describe('@renders', () => {
    const renderComponent = testComponentHelper(
      DeliveryCollectFromStoreContainer.WrappedComponent.WrappedComponent
    )
    it('in default state', () => {
      expect(renderComponent(getProps()).getTree()).toMatchSnapshot()
    })
  })
  describe('@UNSAFE_componentWillReceiveProps', () => {
    const renderComponent = testComponentHelper(
      DeliveryCollectFromStoreContainer.WrappedComponent.WrappedComponent
    )
    it('calls setStoreUpdating', () => {
      const { instance } = renderComponent(getProps())
      expect(instance.props.setStoreUpdating).not.toHaveBeenCalled()
      instance.UNSAFE_componentWillReceiveProps({ isMobile: false })
      expect(instance.props.setStoreUpdating).toHaveBeenCalledTimes(1)
      expect(instance.props.setStoreUpdating).toHaveBeenCalledWith(false)
    })
  })
  describe('@decorators', () => {
    analyticsDecoratorHelper(
      DeliveryCollectFromStoreContainer,
      'collect-from-store',
      {
        componentName: 'DeliveryCollectFromStoreContainer',
        isAsync: true,
        redux: true,
      }
    )
  })
})
