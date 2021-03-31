import testComponentHelper from 'test/unit/helpers/test-component'
import LabeledPrice from '../'

describe('LabeledPrice', () => {
  const renderComponent = testComponentHelper(LabeledPrice)
  const l = jest.fn()

  describe('should render correctly based on type of props provided', () => {
    const requiredProps = {
      brandName: 'topshop',
      l,
    }

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('rrp', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        rrp: '34',
      })
      expect(wrapper.find('.HistoricalPrice-rrp')).toHaveLength(1)
      expect(l).toHaveBeenCalledWith(['', ''], 'RRP')
    })

    it('wasWasPrice', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        wasWasPrice: '34',
      })
      expect(wrapper.find('.HistoricalPrice-wasWas')).toHaveLength(1)
      expect(l).toHaveBeenCalledWith(['', ''], 'Was')
    })

    it('wasPrice', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        wasPrice: '34',
      })
      expect(wrapper.find('.HistoricalPrice-was')).toHaveLength(1)
      expect(l).toHaveBeenCalledWith(['', ''], 'Was')
    })

    it('regPrice', () => {
      const { wrapper } = renderComponent({
        ...requiredProps,
        regPrice: '34',
      })
      expect(wrapper.find('.HistoricalPrice-promotion')).toHaveLength(1)
      expect(wrapper.find('.HistoricalPrice-old')).toHaveLength(0)
      expect(l).toHaveBeenCalledWith(['', ''], 'Now')
    })
  })

  describe('should not render label if brandName is dp or br', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    it('dp', () => {
      renderComponent({
        brandName: 'dorothyperkins',
        wasPrice: '34',
        l,
      })
      expect(l).toHaveBeenCalledWith(['', ''], '')
    })

    it('br', () => {
      renderComponent({
        brandName: 'burton',
        rrp: '34',
        l,
      })
      expect(l).toHaveBeenCalledWith(['', ''], '')
    })
  })
})
