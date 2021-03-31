import testComponentHelper from 'test/unit/helpers/test-component'
import CrossSellLinks from '../CrossSellLinks'
import productMock from '../../../../../../test/mocks/product-detail'

import SandBox from '../../../containers/SandBox/SandBox'

const initialProps = {
  product: productMock,
}

describe('<CrossSellLinks />', () => {
  const renderComponent = testComponentHelper(CrossSellLinks.WrappedComponent)
  const findCrossSellLinksSandbox = (wrapper) =>
    wrapper
      .find(SandBox)
      .findWhere((SandBox) => SandBox.key() === 'crossSellLinksSandBox')

  it("doesn't renders the SandBox if the feature flag is not enabled", () => {
    const { wrapper } = renderComponent(initialProps)
    const crossSellLinksSandBox = findCrossSellLinksSandbox(wrapper)

    expect(crossSellLinksSandBox.exists()).toBe(false)
  })

  it('passes the correct attribute to the SandBox component', () => {
    const attributeMock = 'attributeMock'
    const product = {
      ...productMock,
      attributes: {
        ...productMock.attributes,
        ECMC_PROD_CROSS_SELL_8: attributeMock,
      },
    }
    const { wrapper } = renderComponent({
      ...initialProps,
      product,
      isFeatureCrossSellLinksEnabled: true,
    })

    const crossSellLinksSandBox = findCrossSellLinksSandbox(wrapper)

    expect(crossSellLinksSandBox.exists()).toBe(true)
    expect(crossSellLinksSandBox.prop('cmsPageName')).toBe(attributeMock)
  })

  it('does not render the sandbox if the attributes is undefined', () => {
    const product = {
      ...productMock,
      attributes: {
        ...productMock.attributes,
        ECMC_PROD_CROSS_SELL_8: undefined,
      },
    }
    const { wrapper } = renderComponent({
      ...initialProps,
      product,
      isFeatureCrossSellLinksEnabled: true,
    })

    const crossSellLinksSandBox = findCrossSellLinksSandbox(wrapper)

    expect(crossSellLinksSandBox.exists()).toBe(false)
  })
})
