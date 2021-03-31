import testComponentHelper from 'test/unit/helpers/test-component'
import ApplePayButton from './ApplePayButton'
import Button from '../../../common/Button/Button'

const renderComponent = testComponentHelper(ApplePayButton)

describe('<ApplePayButton/>', () => {
  describe('@renders', () => {
    it('the ApplePay button', () => {
      const { getTree } = renderComponent({})

      expect(getTree()).toMatchSnapshot()
    })

    it('passess props to the button component', () => {
      const props = {
        isActive: 'isActive',
        isDisabled: 'isDisabled',
        clickHandler: 'clickHandler',
      }
      const { wrapper } = renderComponent(props)

      expect(wrapper.find(Button).props()).toEqual(
        expect.objectContaining(props)
      )
    })
  })
})
