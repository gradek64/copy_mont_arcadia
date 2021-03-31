import testComponentHelper from 'test/unit/helpers/test-component'
import CheckoutSubPrimaryTitle from '../CheckoutSubPrimaryTitle'

describe('<CheckoutSubPrimaryTitle />', () => {
  const renderComponent = testComponentHelper(CheckoutSubPrimaryTitle)
  const defaultProps = {
    title: 'To your chosen address',
  }

  describe('@renders', () => {
    it('in default state', () => {
      const { getTree } = renderComponent(defaultProps)
      expect(getTree()).toMatchSnapshot()
    })

    it(`should render a div with className equal to 'CheckoutSubPrimaryTitle' and the passed title prop`, () => {
      const { wrapper } = renderComponent(defaultProps)

      expect(wrapper.hasClass('CheckoutSubPrimaryTitle-withSubTitle')).toBe(
        false
      )
      expect(wrapper.find('.CheckoutSubPrimaryTitle')).toHaveLength(1)
      expect(wrapper.find('.CheckoutSubPrimaryTitle--title').text()).toBe(
        'To your chosen address'
      )
      expect(wrapper.find('.CheckoutSubPrimaryTitle--subTitle').exists()).toBe(
        false
      )
    })

    it('should render a subtitle if subTitle prop is present', () => {
      const subTitle = 'Get it on 12th April'
      const { wrapper } = renderComponent({
        ...defaultProps,
        subTitle,
      })

      expect(wrapper.find('.CheckoutSubPrimaryTitle--subTitle').text()).toBe(
        subTitle
      )
    })

    it(`should add CheckoutSubPrimaryTitle-withSubTitle class to CheckoutSubPrimaryTitle`, () => {
      const subTitle = 'Get it on 12th April'
      const { wrapper } = renderComponent({
        ...defaultProps,
        subTitle,
      })

      expect(wrapper.hasClass('CheckoutSubPrimaryTitle-withSubTitle')).toBe(
        true
      )
    })
  })
})
