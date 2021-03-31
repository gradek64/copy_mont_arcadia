import DDPAppliedToOrderMsg from '../DDPAppliedToOrderMsg'
import testComponentHelper from '../../../../../../../../test/unit/helpers/test-component'

const renderComponent = testComponentHelper(DDPAppliedToOrderMsg)

describe('<DDPAppliedToOrderMsg />', () => {
  describe('@render', () => {
    it('should render the Topshop message when DDP is added to the basket', () => {
      expect(
        renderComponent({
          ddpProductName: 'Topshop Unlimited 12 Months',
          brandName: 'topshop',
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should render the Topshop fallback message if ddpProductName is missing', () => {
      expect(
        renderComponent({
          ddpProductName: 'DDP Subscription',
          brandName: 'topshop',
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should render the Topman message when DDP is added to the basket', () => {
      expect(
        renderComponent({
          ddpProductName: 'Topman Unlimited',
          brandName: 'topman',
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should render the Evans message when DDP is added to the basket', () => {
      expect(
        renderComponent({
          ddpProductName: 'Unlimited delivery',
          brandName: 'evans',
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should render the Dorothy Perkins message when DDP is added to the basket', () => {
      expect(
        renderComponent({
          ddpProductName: 'Premier Delivery',
          brandName: 'dorothyperkins',
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should render the Wallis message when DDP is added to the basket', () => {
      expect(
        renderComponent({
          ddpProductName: 'Unlimited delivery',
          brandName: 'wallis',
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should render the Miss Selfridge message when DDP is added to the basket', () => {
      expect(
        renderComponent({
          ddpProductName: 'Miss S Unlimited',
          brandName: 'missselfridge',
        }).getTree()
      ).toMatchSnapshot()
    })

    it('should render the Burton message when DDP is added to the basket', () => {
      expect(
        renderComponent({
          ddpProductName: 'Premier Delivery',
          brandName: 'burton',
        }).getTree()
      ).toMatchSnapshot()
    })
  })
})
