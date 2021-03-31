import testComponentHelper from 'test/unit/helpers/test-component'
import CmsModalButton from '../CmsModalButton'

describe('CmsModalButton', () => {
  const renderComponent = testComponentHelper(CmsModalButton.WrappedComponent)
  const initialProps = {
    children: 'Text',
  }

  describe('@render', () => {
    it('should render in default state', () => {
      const { getTree } = renderComponent(initialProps)
      expect(getTree()).toMatchSnapshot()
    })
  })

  describe('@events', () => {
    it('calls showModal when clicked', () => {
      const props = {
        ...initialProps,
        showModal: jest.fn(),
      }
      const { wrapper } = renderComponent(props)
      wrapper.getElement().props.onClick()
      expect(props.showModal).toHaveBeenCalledTimes(1)
    })
  })
})
