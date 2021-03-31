import testComponentHelper from 'test/unit/helpers/test-component'
import ReturnHistoryDetailsSummary from '../ReturnHistoryDetailsSummary'

describe('ReturnHistoryDetailsSummary', () => {
  const renderComponent = testComponentHelper(ReturnHistoryDetailsSummary)
  const initialProps = {
    totalOrderPrice: '0.50',
  }

  describe('@defaults', () => {
    it('in default state', () => {
      const { wrapper } = renderComponent(initialProps)
      expect(wrapper.find('.ReturnHistoryDetailsSummary-discount').length).toBe(
        0
      )
    })

    it('renders discount if supplied', () => {
      const { wrapper } = renderComponent({
        ...initialProps,
        totalOrdersDiscount: '-7.00',
      })
      expect(wrapper.find('.ReturnHistoryDetailsSummary-discount').length).toBe(
        1
      )
    })
  })
})
