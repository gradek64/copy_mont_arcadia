import testComponentHelper from 'test/unit/helpers/test-component'
import BillingAddressPreview from '../BillingAddressPreview'
import AddressPreview from '../../../../common/AddressPreview/AddressPreview'

describe('<BillingAddressPreview />', () => {
  const renderComponent = testComponentHelper(
    BillingAddressPreview.WrappedComponent
  )
  const initialProps = {
    address: {
      address1: '3 Britten Close',
      address2: '',
      city: 'LONDON',
      country: 'United Kingdom',
      postcode: 'NW11 7HQ',
      state: '',
    },
    details: {
      firstName: 'Man',
      lastName: 'Mo',
      telephone: '0980090980',
      title: 'Mr',
    },
    brandName: 'topshop',
    onChangeButtonClick: () => {},
  }

  describe('@renders', () => {
    const renderedComponent = renderComponent({
      ...initialProps,
    })

    it('in default state', () => {
      expect(renderedComponent.getTree()).toMatchSnapshot()
    })

    it('should pass `onChangeButtonClick` prop to the `AddressPreview` component', () => {
      const onChangeButtonClick = () => {}
      const { wrapper } = renderComponent({
        ...initialProps,
        onChangeButtonClick,
      })
      expect(wrapper.find(AddressPreview).prop('onClickChangeButton')).toBe(
        onChangeButtonClick
      )
    })
  })
})
