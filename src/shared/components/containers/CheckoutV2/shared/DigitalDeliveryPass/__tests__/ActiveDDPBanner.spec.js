import ActiveDDPBanner from '../ActiveDDPBanner'
import testComponentHelper from '../../../../../../../../test/unit/helpers/test-component'

const renderComponent = testComponentHelper(ActiveDDPBanner)
const dpBannerWording = 'Premier Delivery is active'

describe('<ActiveDDPBanner />', () => {
  describe('@render', () => {
    it('should render the ActiveDDPBanner if the user has an active DDP Subscription and with the white version of the logo', () => {
      expect(
        renderComponent({
          ddpProductName: 'Premier Delivery',
          brandName: 'dorothyperkins',
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should render the ActiveDDPBanner if the user has an active DDP Subscription and with the dark version of the logo', () => {
      expect(
        renderComponent({
          ddpProductName: 'Unlimited delivery',
          brandName: 'wallis',
        }).getTree()
      ).toMatchSnapshot()
    })

    describe('the brand has express delivery (DP)', () => {
      const { wrapper } = renderComponent({
        ddpProductName: 'Premier Delivery',
        brandName: 'dorothyperkins',
      })

      it('should render the brand DDP subscription wording', () => {
        expect(wrapper.find('.ActiveDDPBanner-title').text()).toBe(
          dpBannerWording
        )
      })

      it('should render the DDP logo', () => {
        expect(wrapper.find('.ActiveDDPBanner-img').exists()).toBe(true)
      })
    })

    describe('the brand has express delivery (TS)', () => {
      const { wrapper } = renderComponent({
        ddpProductName: 'Premier Delivery',
        brandName: 'topshop',
      })

      it('should render the brand DDP subscription wording', () => {
        expect(wrapper.find('.ActiveDDPBanner-title').text()).toBe(
          dpBannerWording
        )
      })

      it('Should render the DDP logo', () => {
        expect(wrapper.find('.ActiveDDPBanner-img').exists()).toBe(true)
      })
    })
  })
})
