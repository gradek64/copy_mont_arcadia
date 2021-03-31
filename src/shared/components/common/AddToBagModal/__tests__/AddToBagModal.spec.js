import testComponentHelper from 'test/unit/helpers/test-component'

import AddToBagModal from '../AddToBagModal'

import AddToBagConfirm from '../../AddToBagConfirm/AddToBagConfirm'
import Button from '../../Button/Button'

describe('<AddToBagModal />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const requiredProps = {
    toggleModal: jest.fn(),
  }
  const renderComponent = testComponentHelper(AddToBagModal.WrappedComponent)

  describe('@renders', () => {
    it('should render correct default state', () => {
      const { getTree } = renderComponent(requiredProps)
      expect(getTree()).toMatchSnapshot()
    })
  })

  describe('@events', () => {
    it('should call toggleModal on AddToBagConfirm close event', () => {
      const { instance, wrapper } = renderComponent(requiredProps)

      expect(instance.props.toggleModal).not.toHaveBeenCalled()
      wrapper.find(AddToBagConfirm).prop('onClose')()
      expect(instance.props.toggleModal).toHaveBeenCalledTimes(1)
    })

    it('should call toggleModal on AddToBagConfirm close event', () => {
      const { instance, wrapper } = renderComponent(requiredProps)

      expect(instance.props.toggleModal).not.toHaveBeenCalled()
      wrapper.find(Button).prop('clickHandler')()
      expect(instance.props.toggleModal).toHaveBeenCalledTimes(1)
    })
  })
})
