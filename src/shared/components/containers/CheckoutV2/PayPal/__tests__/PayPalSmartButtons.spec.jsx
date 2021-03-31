import testComponentHelper from 'test/unit/helpers/test-component'
import PayPalSmartButtons from '../PayPalSmartButtons'

describe('<PayPalSmartButtons/>', () => {
  const renderComponent = testComponentHelper(
    PayPalSmartButtons.WrappedComponent
  )
  const initialProps = {
    currencyCode: 'GBP',
    brandName: 'Topshop',
  }

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })
  })

  describe('@lifecycle', () => {
    describe('@componentDidMount', () => {
      it('should call paypalInitSmartButtons', async () => {
        const { instance } = renderComponent(initialProps)
        const spyInitSmartButtons = jest.spyOn(instance, 'initSmartButtons')

        global.window.paypal = {
          Buttons: () => {
            return {
              render: () => {},
            }
          },
        }

        expect(spyInitSmartButtons).not.toHaveBeenCalled()
        await instance.componentDidMount()
        expect(spyInitSmartButtons).toHaveBeenCalledTimes(1)
      })
    })
  })
})
