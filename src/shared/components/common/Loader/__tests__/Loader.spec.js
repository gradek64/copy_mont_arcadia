import testComponentHelper from 'test/unit/helpers/test-component'

import Loader from '../Loader'

describe('<Loader />', () => {
  const renderComponent = testComponentHelper(Loader)

  describe('@renders', () => {
    it('should render in default state', () => {
      const { getTree } = renderComponent()
      expect(getTree()).toMatchSnapshot()
    })

    it('should be able to change `fillColor`', () => {
      const { wrapper } = renderComponent({
        fillColor: '#ffffff',
      })
      expect(wrapper.find({ fill: '#ffffff' }).exists()).toBe(true)
    })

    it('should add supplied `className`', () => {
      const { wrapper } = renderComponent({
        className: 'MyClass',
      })
      expect(wrapper.find('.Loader').hasClass('MyClass')).toBe(true)
    })

    it('should add ‘Loader--button’ and ‘Loader-image--button’ classes only, if `isButton` is `true`', () => {
      const { wrapper } = renderComponent({
        isButton: true,
      })
      expect(wrapper.find('.Loader--button').exists()).toBe(true)
      expect(wrapper.find('.Loader').exists()).toBe(false)
      expect(wrapper.find('.Loader-image--button').exists()).toBe(true)
      expect(wrapper.find('.Loader-image').exists()).toBe(false)
    })

    it("should add 'Loader--in-input' and 'Loader--in-input' classes, if 'isInInput is 'true'", () => {
      const { wrapper } = renderComponent({
        isInInput: true,
      })
      expect(wrapper.find('.Loader--in-input').exists()).toBe(true)
      expect(wrapper.find('.Loader').exists()).toBe(false)
      expect(wrapper.find('.Loader-image--in-input').exists()).toBe(true)
      expect(wrapper.find('.Loader-image').exists()).toBe(false)
    })
  })
})
