import AddressPreview from '../AddressPreview'
import testComponentHelper from '../../../../../../test/unit/helpers/test-component'

const defaultProps = () => {
  return {
    address: {
      address1: 'Flat 46 Sheppard House',
      address2: '120 Oxford Street',
      city: 'London',
      country: 'United Kingdom',
      postcode: 'E2 7AB',
      state: '',
    },
    details: {
      title: 'Mr',
      firstName: 'John',
      lastName: 'Doe',
    },
    onClickChangeButton: jest.fn(),
    brandName: 'BRAND',
    buttonInLine: true,
  }
}

describe(AddressPreview.name, () => {
  const renderComponent = testComponentHelper(AddressPreview)

  describe('@renders', () => {
    it('should render the address details', () => {
      expect(renderComponent(defaultProps()).getTree()).toMatchSnapshot()
    })

    it('should render the heading if heading prop is true', () => {
      expect(
        renderComponent({
          ...defaultProps(),
          heading: true,
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should not render `AddressPreview-button--rightAligned` class if rightAlignedButton prop is false', () => {
      expect(
        renderComponent({
          ...defaultProps(),
          buttonInLine: false,
        }).getTree()
      ).toMatchSnapshot()
    })
  })

  describe('@events', () => {
    describe('AddressPreview-button', () => {
      it('calls onClickChangeButton on click', () => {
        const props = defaultProps()
        const { wrapper } = renderComponent(props)
        expect(props.onClickChangeButton).not.toBeCalled()
        wrapper
          .find('.AddressPreview-button')
          .first()
          .simulate('click')
        expect(props.onClickChangeButton).toHaveBeenCalledTimes(1)
      })
    })
  })
})
