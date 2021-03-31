import { identity } from 'ramda'
import testComponentHelper from 'test/unit/helpers/test-component'
import Checkbox from '../../../../common/FormComponents/Checkbox/Checkbox'
import SavePaymentDetailsCheckbox from '../SavePaymentDetailsCheckbox'

describe(SavePaymentDetailsCheckbox.name, () => {
  const context = {
    l: jest.fn(identity),
  }
  const renderComponent = testComponentHelper(SavePaymentDetailsCheckbox, {
    context,
  })
  const baseProps = {
    onSavePaymentDetailsChange: jest.fn(),
  }
  beforeEach(() => {
    jest.resetAllMocks()
  })
  describe('@render', () => {
    it('should show an unchecked checkbox when savePaymentDetailsEnabled=false', () => {
      const props = {
        ...baseProps,
        savePaymentDetailsEnabled: false,
      }
      const { getTree } = renderComponent(props)
      expect(getTree()).toMatchSnapshot()
    })
    it('should show a checked checkbox when savePaymentDetailsEnabled=true', () => {
      const props = {
        ...baseProps,
        savePaymentDetailsEnabled: true,
      }
      const { getTree } = renderComponent(props)
      expect(getTree()).toMatchSnapshot()
    })
  })
  describe('@events', () => {
    it('should dispatch an action on checkbox onChange event', () => {
      const eventMock = {}
      const savePaymentDetailsEnabled = true
      const props = {
        ...baseProps,
        savePaymentDetailsEnabled,
      }
      const { wrapper } = renderComponent(props)
      wrapper.find(Checkbox).prop('onChange')(eventMock)
      expect(props.onSavePaymentDetailsChange).toHaveBeenCalledTimes(1)
      expect(props.onSavePaymentDetailsChange).toHaveBeenCalledWith(
        !savePaymentDetailsEnabled
      )
    })
  })
})
