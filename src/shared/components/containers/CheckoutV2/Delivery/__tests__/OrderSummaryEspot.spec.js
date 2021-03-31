import {
  mountRender,
  buildComponentRender,
  withStore,
} from '../../../../../../../test/unit/helpers/test-component'
import { compose } from 'ramda'

import OrderSummaryEspot from '../OrderSummaryEspot'

import espotsDesktopConstants from '../../../../../constants/espotsDesktop'
import espotsMobileConstants from '../../../../../constants/espotsMobile'

describe('<OrderSummaryEspot />', () => {
  const renderer = compose(
    mountRender,
    withStore({
      config: {
        storeCode: 'dpuk',
        brandCode: 'dp',
        region: 'uk',
      },
      routing: {
        visited: [],
        location: {
          pathname: '/checkout/delivery',
          query: {},
        },
      },
      sandbox: {
        pages: {},
      },
      viewport: {
        media: 'mobile',
      },
      features: {
        status: {
          FEATURE_USE_MONTY_CMS_FOR_FORMS: false,
        },
      },
    })
  )
  const mountComponent = buildComponentRender(renderer, OrderSummaryEspot)
  const mobileEspotSelector = `[data-espot="${
    espotsMobileConstants.checkout[0]
  }"]`
  const desktopEspotSelector = `[data-espot="${
    espotsDesktopConstants.orderSummary.discountIntro
  }"]`

  it('should display mobile espot if isMobile is true and isFeatureMobileCheckoutEspotEnabled is true', () => {
    const props = {
      isMobile: true,
      isFeatureMobileCheckoutEspotEnabled: true,
    }
    const { wrapper } = mountComponent(props)
    expect(wrapper.find(mobileEspotSelector).exists()).toBe(true)
    expect(wrapper.find(desktopEspotSelector).exists()).toBe(false)
  })
  it('should display desktop espot if isMobile is false', () => {
    const props = {
      isMobile: false,
    }
    const { wrapper } = mountComponent(props)
    expect(wrapper.find(desktopEspotSelector).exists()).toBe(true)
    expect(wrapper.find(mobileEspotSelector).exists()).toBe(false)
  })
  it('should display no espot if isMobile is true and isFeatureMobileCheckoutEspotEnabled is false', () => {
    const props = {
      isMobile: true,
      isFeatureMobileCheckoutEspotEnabled: false,
    }
    const { wrapper } = mountComponent(props)
    expect(wrapper.find(mobileEspotSelector).exists()).toBe(false)
    expect(wrapper.find(desktopEspotSelector).exists()).toBe(false)
  })
})
