import testComponentHelper from 'test/unit/helpers/test-component'

import ProductDescriptionSeeMore from '../ProductDescriptionSeeMore'
import FeatureCheck from '../../FeatureCheck/FeatureCheck'

describe('<ProductDescriptionSeeMore/>', () => {
  const renderComponent = testComponentHelper(ProductDescriptionSeeMore)

  describe('@renders', () => {
    it('should render in default state', () => {
      const { wrapper } = renderComponent()
      expect(wrapper.find('ProductDescription-seeMore')).toHaveLength(0)
      expect(wrapper.find(FeatureCheck)).toHaveLength(0)
    })

    describe('if `seeMoreLinks` prop supplied', () => {
      const seeMoreValue = [
        { seeMoreLabel: 'Blue dresses', seeMoreUrl: '/_/N-2f83Z1xjf' },
      ]

      it('should wrap ‘see more’ in a feature flag check', () => {
        const { wrapper } = renderComponent({ seeMoreValue })
        expect(wrapper.find(FeatureCheck).prop('flag')).toBe(
          'FEATURE_PRODUCT_DESCRIPTION_SEE_MORE'
        )
      })

      it('should filter out `seeMoreValue` items that don‘t have a `seeMoreUrl`', () => {
        const { wrapper } = renderComponent({
          seeMoreValue: [
            { seeMoreLabel: 'Jeans' },
            { seeMoreLabel: 'Spray On Jeans', seeMoreUrl: '/_/N-2bu3Z1xjf' },
          ],
        })
        expect(wrapper.find('li')).toHaveLength(1)
      })
    })
  })
})
