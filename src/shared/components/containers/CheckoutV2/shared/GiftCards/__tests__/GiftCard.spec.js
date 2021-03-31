import testComponentHelper from 'test/unit/helpers/test-component'
import GiftCard from '../GiftCard'

describe('<GiftCard />', () => {
  const renderComponent = testComponentHelper(GiftCard)

  const requiredProps = {
    cardNumber: 'XXXX XXXX XXXX 7299',
    amountUsed: '5.00',
  }

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(requiredProps).getTree()).toMatchSnapshot()
    })
  })

  describe('@events', () => {
    describe('on Remove gift Card button click', () => {
      it('should trigger removeGiftCard action', () => {
        const onRemoveMock = jest.fn()
        const { wrapper } = renderComponent({
          ...requiredProps,
          onRemove: onRemoveMock,
        })
        // call click handler
        const event = {}
        wrapper.find('.GiftCard-remove').prop('clickHandler')(event)
        expect(onRemoveMock).toHaveBeenCalledWith(event)
      })
    })
  })
})
