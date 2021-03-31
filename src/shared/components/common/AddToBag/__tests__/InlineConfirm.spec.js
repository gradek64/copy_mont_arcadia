import testComponentHelper from 'test/unit/helpers/test-component'

import { WrappedInlineConfirm } from '../InlineConfirm'
import AddToBagConfirm from '../../AddToBagConfirm/AddToBagConfirm'

describe('<InlineConfirm />', () => {
  const requiredProps = {
    showMiniBagConfirm: () => {},
  }
  const renderComponent = testComponentHelper(WrappedInlineConfirm)

  describe('@renders', () => {
    it('should render correct default state', () => {
      const { getTree } = renderComponent(requiredProps)
      expect(getTree()).toMatchSnapshot()
    })

    it('should display correct quantity added', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        quantity: 3,
      })
      expect(wrapper.find('.InlineConfirm-label').text()).toContain(
        '3 item(s) added to bag'
      )
    })
  })

  describe('@events', () => {
    it('should call `showMiniBagConfirm` with argument `false` on closing `AddToBagConfirm`', () => {
      const showMiniBagConfirmMock = jest.fn()
      const { wrapper } = renderComponent({
        ...requiredProps,
        showMiniBagConfirm: showMiniBagConfirmMock,
      })
      wrapper.find(AddToBagConfirm).prop('onClose')()
      expect(showMiniBagConfirmMock).toHaveBeenCalledWith(false)
    })
  })
})
