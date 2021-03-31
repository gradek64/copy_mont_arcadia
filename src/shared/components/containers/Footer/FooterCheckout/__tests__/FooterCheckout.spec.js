import deepFreeze from 'deep-freeze'
import testComponentHelper from 'test/unit/helpers/test-component'
import FooterCheckout from '../FooterCheckout'
import { paymentsConfigBySite } from '../../../../../../server/config/paymentConfig'

describe('<FooterCheckout />', () => {
  const renderComponent = testComponentHelper(FooterCheckout.WrappedComponent)
  // this parses paymentsConfig to get supported brand/region configurations
  const brandsAndRegions = Object.entries(paymentsConfigBySite).reduce(
    (result, [brand, locales]) => [
      ...result,
      ...Object.keys(locales).map((locale) => [brand, locale]),
    ],
    []
  )

  it.each(brandsAndRegions)(
    'should render footer relevant to %p brand and %p region',
    (brandCode, region) => {
      const initialProps = deepFreeze({
        brandCode,
        region,
        acceptedPayments: paymentsConfigBySite[brandCode][region],
      })
      expect(renderComponent(initialProps)).toMatchSnapshot()
    }
  )
})
