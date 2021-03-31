import testComponentHelper from 'test/unit/helpers/test-component'

import WishListIcon from '../WishListIcon'

describe('WishListIcon', () => {
  const renderComponent = testComponentHelper(WishListIcon)

  describe('@renders', () => {
    it('should render default state', () => {
      const { getTree } = renderComponent()
      expect(getTree()).toMatchSnapshot()
    })
    it('should render when icon is selected', () => {
      const { getTree } = renderComponent({ isSelected: true })
      expect(getTree()).toMatchSnapshot()
    })
    it('should render with plp modifier', () => {
      const { getTree } = renderComponent({ modifier: 'plp' })
      expect(getTree()).toMatchSnapshot()
    })
    it('should render with pdp modifier', () => {
      const { getTree } = renderComponent({ modifier: 'pdp' })
      expect(getTree()).toMatchSnapshot()
    })
  })
})
