import { compose } from 'ramda'
import {
  mountRender,
  withStore,
  buildComponentRender,
} from 'test/unit/helpers/test-component'

import DDPRenewal from '../DDPRenewal'

const testAction = {
  type: 'TEST',
  payload: 'test',
}

jest.mock('../../../../../../actions/common/espotActions', () => ({
  getDDPRenewalEspots: jest.fn(() => {}),
  getDDPTermsAndConditions: jest.fn(() => ({
    type: 'TEST',
    payload: 'test',
  })),
}))

describe('<DDPRenewal /> Mounted', () => {
  const testExpiredUrl = 'test-expired/Url'
  const testExpiringUrl = 'test-expiring/Url'

  const testTermsUrl = 'test-terms/Url'
  const createInitialState = (user, products = []) => ({
    account: {
      user: {
        isDDPUser: true,
        isDDPRenewable: true,
        ddpStartDate: '16 May 2019',
        ddpEndDate: '15 May 2020',
        wasDDPUser: false,
        ddpCurrentOrderCount: 2,
        ddpPreviousOrderCount: null,
        ddpCurrentSaving: 2.05,
        ddpPreviousSaving: null,
        ddpStandardPrice: 9.95,
        ddpExpressDeliveryPrice: 6.0,
        ...user,
      },
    },
    shoppingBag: {
      bag: { products },
    },
    config: {
      brandDisplayName: 'topshop',
      brandName: 'topshop',
      brandCode: 'ts',
      storeCode: 'tsuk',
    },
    viewport: {
      media: 'mobile',
    },
    routing: {
      visited: [],
    },
    features: {
      status: {
        FEATURE_DDP: true,
        FEATURE_IS_DDP_RENEWABLE: true,
      },
    },
    sandbox: {
      pages: {},
    },
    siteOptions: {
      ddp: {
        ddpProduct: {
          ddpSkus: [
            {
              sku: '100000012',
              wasPrice: 7,
              default: true,
              unitPrice: 4,
              catentryId: '32482151',
              wasWasPrice: 10,
              name: 'DDP VIP Subscription',
              description: 'DDP VIP 12 Months',
              timePeriod: '12',
            },
          ],
          name: 'DDP VIP Subscription',
        },
      },
    },
    espot: {
      cmsData: {
        ddp_renewal_expired: {
          responsiveCMSUrl: testExpiredUrl,
        },
        ddp_renewal_expiring: {
          responsiveCMSUrl: testExpiringUrl,
        },
        ddp_terms_and_conditions: {
          responsiveCMSUrl: testTermsUrl,
        },
      },
    },
  })

  const render = compose(
    mountRender,
    withStore(createInitialState())
  )
  const renderRenewalComponent = buildComponentRender(render, DDPRenewal)

  it('renders', () => {
    const { getTree } = renderRenewalComponent()
    expect(getTree()).toMatchSnapshot()
  })

  describe('<DDPRenewalExpiry />', () => {
    describe('when `isMyAccount` is not equal to true', () => {
      it('should render when showDDPRenewal is true', () => {
        const userState = {
          isDDPRenewable: false,
          isDDPUser: false,
          wasDDPUser: true,
        }
        const render = compose(
          mountRender,
          withStore(createInitialState(userState))
        )
        const renderRenewalComponent = buildComponentRender(render, DDPRenewal)
        const { wrapper } = renderRenewalComponent()

        const ddpRenewal = wrapper.find('.DDPRenewal')
        expect(ddpRenewal).toHaveLength(1)

        const ddpAdded = wrapper.find('.DDPAdded')
        expect(ddpAdded).toHaveLength(0)

        const ddpRenewalActive = wrapper.find('.DDPRenewal-active')
        expect(ddpRenewalActive).toHaveLength(0)
      })

      it('should not render when showDDPRenewal is false', () => {
        const userState = {
          isDDPRenewable: false,
          isDDPUser: false,
          wasDDPUser: false,
        }
        const render = compose(
          mountRender,
          withStore(createInitialState(userState))
        )
        const renderRenewalComponent = buildComponentRender(render, DDPRenewal)
        const { wrapper } = renderRenewalComponent()

        const ddpRenewal = wrapper.find('.DDPRenewal')
        expect(ddpRenewal).toHaveLength(0)
      })
    })

    describe('when `isMyAccount` is equal to true', () => {
      it('should render when showDDPRenewalWithinDefaultExpiringBoundaries is true', () => {
        const { wrapper } = renderRenewalComponent({ isMyAccount: true })
        const ddpRenewal = wrapper.find('.DDPRenewal')
        expect(ddpRenewal).toHaveLength(1)

        const ddpAdded = wrapper.find('.DDPAdded')
        expect(ddpAdded).toHaveLength(0)

        const ddpRenewalActive = wrapper.find('.DDPRenewal-active')
        expect(ddpRenewalActive).toHaveLength(0)
      })

      it('should not render when showDDPRenewalWithinDefaultExpiringBoundaries is false', () => {
        const userState = {
          isDDPRenewable: false,
        }
        const render = compose(
          mountRender,
          withStore(createInitialState(userState))
        )
        const renderRenewalComponent = buildComponentRender(render, DDPRenewal)
        const { wrapper } = renderRenewalComponent({ isMyAccount: true })
        const ddpRenewal = wrapper.find('.DDPRenewal')
        expect(ddpRenewal).toHaveLength(0)
      })
    })
  })

  describe('<DDPRenewalAdded />', () => {
    it('renders when shopping bag contains DDP product and canShowAdded is true', () => {
      const userState = {}
      const products = [{ isDDPProduct: true }]
      const render = compose(
        mountRender,
        withStore(createInitialState(userState, products))
      )
      const renderAddedComponent = buildComponentRender(render, DDPRenewal)
      const { wrapper } = renderAddedComponent({ canShowAdded: true })
      const ddpRenewal = wrapper.find('.DDPRenewal')
      expect(ddpRenewal).toHaveLength(0)

      const ddpRenewalActive = wrapper.find('.DDPRenewal-active')
      expect(ddpRenewalActive).toHaveLength(0)

      const ddpAdded = wrapper.find('.DDPAdded')
      expect(ddpAdded).toHaveLength(1)
    })
  })

  describe('<DDPRenewalActive />', () => {
    it('renders when showActiveDDP, canShowActive are true and shopping bag does not contain DDP product', () => {
      const userState = { isDDPRenewable: false }
      const products = []
      const render = compose(
        mountRender,
        withStore(createInitialState(userState, products))
      )
      const renderAddedComponent = buildComponentRender(render, DDPRenewal)
      const { wrapper } = renderAddedComponent({
        showActiveDDP: true,
        isMyAccountDetail: true,
      })

      const ddpAdded = wrapper.find('.DDPAdded')
      expect(ddpAdded).toHaveLength(0)

      const ddpRenewalActive = wrapper.find('.DDPRenewal.DDPRenewal-active')
      expect(ddpRenewalActive).toHaveLength(1)
    })
  })

  it('should format prices properly', () => {
    const userState = {
      ddpCurrentSaving: 15.2,
      ddpExpressDeliveryPrice: 6.0,
    }
    const render = compose(
      mountRender,
      withStore(createInitialState(userState))
    )
    const renderAddedComponent = buildComponentRender(render, DDPRenewal)
    const { wrapper } = renderAddedComponent()
    const ddpRenewalExpiryWrapper = wrapper.find('DDPRenewalExpiry')
    expect(ddpRenewalExpiryWrapper.prop('ddpSavingsValue')).toBe('£15.20')
    expect(ddpRenewalExpiryWrapper.prop('ddpFormattedPrice')).toBe('£4.00')
    expect(ddpRenewalExpiryWrapper.prop('ddpExpressDeliveryPrice')).toBe(
      '£6.00'
    )
  })

  it('should call getDDPTermsAndConditions', () => {
    const userState = {
      ddpCurrentSaving: 15.2,
      ddpExpressDeliveryPrice: 6.0,
    }
    const render = compose(
      mountRender,
      withStore(createInitialState(userState))
    )
    const renderAddedComponent = buildComponentRender(render, DDPRenewal)
    const { store } = renderAddedComponent()
    expect(store.getActions()[0]).toEqual(testAction)
  })
})
