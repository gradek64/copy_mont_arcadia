import TotalCost from '../TotalCost'
import testComponentHelper from '../../../../../../../test/unit/helpers/test-component'

const props = {
  totalCost: '$100',
}

describe(TotalCost.name, () => {
  const renderedComponent = testComponentHelper(TotalCost)(props)
  describe('@renders', () => {
    it('should render the total cost with the price value', () => {
      expect(renderedComponent.getTree()).toMatchSnapshot()
      expect(
        renderedComponent.wrapper
          .find('.TotalCost')
          .text()
          .endsWith('$100')
      ).toBe(true)
    })
  })
})
