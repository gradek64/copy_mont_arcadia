import toJson from 'enzyme-to-json'

import testComponentHelper from 'test/unit/helpers/test-component'

import ButtonLoader from '../ButtonLoader'
import Button from '../../Button/Button'

describe('<ButtonLoader />', () => {
  const renderComponent = testComponentHelper(ButtonLoader.WrappedComponent)

  describe('@renders', () => {
    it('should render in default state', () => {
      const { getTree } = renderComponent({
        children: 'Apply',
      })
      expect(getTree()).toMatchSnapshot()
    })

    it('should render `<Loader />` within `<Button />` if form is loading', () => {
      const { wrapper } = renderComponent({
        forms: {
          checkout: { isLoading: true },
        },
        formName: 'checkout',
      })
      const button = wrapper.find(Button)
      expect(toJson(button.children())).toMatchSnapshot()
    })
  })
})
