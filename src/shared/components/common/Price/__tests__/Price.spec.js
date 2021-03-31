import testComponentHelper, {
  mockLocalise,
} from 'test/unit/helpers/test-component'
import Price from '../Price'

describe('<Price />', () => {
  const initProps = {
    price: '5.4',
  }
  const mountOptions = {
    context: {
      p: (value) => ({
        position: 'before',
        symbol: '£',
        value: parseFloat(value).toFixed(2),
      }),
      l: jest.fn(mockLocalise),
    },
  }

  const renderComponent = testComponentHelper(Price, mountOptions)

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initProps).getTree()).toMatchSnapshot()
    })
    it('with className', () => {
      expect(
        renderComponent({
          ...initProps,
          className: 'Price--default',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('when price is a number', () => {
      expect(
        renderComponent({
          price: 8.3,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('when price is 0', () => {
      expect(
        renderComponent({
          price: 0,
        }).getTree()
      ).toMatchSnapshot()
    })
    it('when no number is free', () => {
      expect(
        renderComponent({
          price: '',
        }).getTree()
      ).toMatchSnapshot()
    })
    it('when price symbol is after the value', () => {
      const { wrapper, getTree } = renderComponent(initProps)
      wrapper.setContext({
        p: (value) => ({
          symbol: ' \u20AC',
          position: 'after',
          value: parseFloat(value).toFixed(2),
        }),
      })
      expect(getTree()).toMatchSnapshot()
    })
    it('when privacyProtected is true', () => {
      expect(
        renderComponent({
          ...initProps,
          privacyProtected: true,
        }).getTree()
      ).toMatchSnapshot()
    })
  })
})
