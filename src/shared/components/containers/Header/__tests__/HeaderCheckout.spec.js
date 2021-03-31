import testComponentHelper from 'test/unit/helpers/test-component'
import HeaderCheckout from '../HeaderCheckout'
import BrandLogo from '../../../common/BrandLogo/BrandLogo'

describe('<HeaderCheckout />', () => {
  const initialProps = {
    isMobile: true,
    goToHomePage: jest.fn(),
  }

  const renderComponent = testComponentHelper(HeaderCheckout)

  it('should render the header for mobile', () => {
    expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
  })

  it('should render the header for desktop', () => {
    expect(
      renderComponent({
        ...initialProps,
        isMobile: false,
      }).getTree()
    ).toMatchSnapshot()
  })

  it('should render the brandLogo for mobile', () => {
    const { wrapper } = renderComponent(initialProps)

    expect(wrapper.find(BrandLogo)).toHaveLength(1)
  })

  it('should render the brandLogo for desktop', () => {
    const { wrapper } = renderComponent({ ...initialProps, isMobile: false })

    expect(wrapper.find(BrandLogo)).toHaveLength(1)
  })
})
