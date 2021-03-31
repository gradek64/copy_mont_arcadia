import testComponentHelper from 'test/unit/helpers/test-component'
import DeliveryAddressPreview from '../DeliveryAddressPreview'
import AddressPreview from '../../../../common/AddressPreview/AddressPreview'

describe('<DeliveryAddressPreview />', () => {
  const renderComponent = testComponentHelper(
    DeliveryAddressPreview.WrappedComponent
  )
  const initialProps = {
    address: {
      address1: '1 Britten Close',
      address2: '',
      city: 'LONDON',
      country: 'United Kingdom',
      postcode: 'NW11 7HQ',
      state: '',
    },
    details: {
      firstName: 'Jose',
      lastName: 'Quinto',
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
