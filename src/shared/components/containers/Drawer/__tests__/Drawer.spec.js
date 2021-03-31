import testComponentHelper from 'test/unit/helpers/test-component'
import Drawer from '../Drawer'

describe('<Drawer></Drawer>', () => {
  const mockProps = {
    isOpen: false,
    children: 'Hello World!',
    isScrollable: false,
  }
  const renderComponent = testComponentHelper(Drawer)

  describe('@render', () => {
    it('is closed', () => {
      expect(renderComponent(mockProps).getTree()).toMatchSnapshot()
    })
    it('is open', () => {
      expect(
        renderComponent({ ...mockProps, isOpen: true }).getTree()
      ).toMatchSnapshot()
    })
    it('is open and scrollable', () => {
      expect(
        renderComponent({
          ...mockProps,
          isOpen: true,
          isScrollable: true,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('is open and not scrollable', () => {
      expect(
        renderComponent({
          ...mockProps,
          isOpen: false,
          isScrollable: false,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('has a direction and is open and scrollable', () => {
      expect(
        renderComponent({
          ...mockProps,
          isOpen: true,
          isScrollable: true,
          direction: 'bottom',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('has a direction and is not open but scrollable', () => {
      expect(
        renderComponent({
          ...mockProps,
          isOpen: false,
          isScrollable: true,
          direction: 'bottom',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('has a direction and is not open and not scrollable', () => {
      expect(
        renderComponent({
          ...mockProps,
          isOpen: false,
          isScrollable: false,
          direction: 'bottom',
        }).getTree()
      ).toMatchSnapshot()
    })
  })
})
