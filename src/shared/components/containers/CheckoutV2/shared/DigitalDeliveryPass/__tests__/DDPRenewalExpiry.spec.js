import React from 'react'
import { compose } from 'ramda'
import mockdate from 'mockdate'
import {
  mountRender,
  withStore,
  buildComponentRender,
} from 'test/unit/helpers/test-component'

import DDPRenewalExpiry from '../DDPRenewalExpiry'

const DDPIcon = () => <div className="ddp-test-icon" />
const testExpiredUrl = 'test-expired/Url'
const testExpiringUrl = 'test-expiring/Url'
const initialState = {
  config: {
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
      FEATURE_USE_MONTY_CMS_FOR_FORMS: false,
    },
  },
  sandbox: {
    pages: {},
  },
  espot: {
    cmsData: {
      ddp_renewal_expired: {
        responsiveCMSUrl: testExpiredUrl,
      },
      ddp_renewal_expiring: {
        responsiveCMSUrl: testExpiringUrl,
      },
    },
  },
}

const defaultProps = {
  ddpSku: 'default-sku',
  ddpProductName: 'product name',
  ddpEndDate: '1 May 2020',
  showDDPSavings: true,
  hasDDPExpired: false,
  ddpSavingsValue: '6.60',
  ddpFormattedPrice: '£9.95',
  ddpExpressDeliveryPrice: '6.00',
  storeCode: initialState.config.storeCode,
  DDPIcon: <DDPIcon />,
  openModal: jest.fn(),
}

describe('<DDPRenewalExpiry />', () => {
  const render = compose(
    mountRender,
    withStore(initialState)
  )
  const renderComponent = buildComponentRender(render, DDPRenewalExpiry)
  let wrapper
  const getDDPRenewalEspots = jest.fn(() => {})
  const addToBag = jest.fn(() => {})
  const l = jest.fn((args, ...params) => `${args[0]}${params}`)

  const defaultActions = {
    getDDPRenewalEspots,
    addToBag,
    l,
  }

  beforeAll(() => {
    process.browser = true
    ;({ wrapper } = renderComponent({
      ...defaultProps,
      ...defaultActions,
    }))
  })

  afterAll(() => {
    jest.resetAllMocks()
    process.browser = false
  })

  it('@renders', () => {
    expect(wrapper).not.toBeNull()
  })

  it('should render outer div with DDPRenewal className', () => {
    expect(wrapper.childAt(0).prop('className')).toBe('DDPRenewal')
  })

  it('DDPRenewal component first child has a class of DDPRenewal-container', () => {
    const container = wrapper.childAt(0)
    expect(container.childAt(0).prop('className')).toBe('DDPRenewal-container')
  })

  it('should trigger getDDPRenewalEspots', () => {
    expect(getDDPRenewalEspots).toHaveBeenCalledTimes(1)
  })

  it('should render passed DDPIcon', () => {
    const ddpIcon = wrapper.find('div.ddp-test-icon')
    expect(ddpIcon).not.toBeNull()
    expect(ddpIcon).toHaveLength(1)
  })

  it('should render message container with 3 messages and cta', () => {
    const messageContainer = wrapper.find('.DDPRenewal-messageContainer')
    expect(messageContainer).not.toBeNull()
    expect(messageContainer.children()).toHaveLength(4)
  })

  describe('isMyAccount', () => {
    describe('isMyAccount is true', () => {
      it('adds DDPRenewal-myAccountExpiry class', () => {
        const { wrapper } = renderComponent({
          ...defaultProps,
          ...defaultActions,
          isMyAccount: true,
        })

        expect(wrapper.childAt(0).prop('className')).toBe(
          'DDPRenewal DDPRenewal-myAccountExpiry'
        )
      })
    })

    describe('isMyAccount is false', () => {
      it('does not add DDPRenewal-myAccountExpiry class', () => {
        const { wrapper } = renderComponent({
          ...defaultProps,
          ...defaultActions,
          isMyAccount: false,
        })

        expect(wrapper.childAt(0).prop('className')).toBe('DDPRenewal')
      })
    })
  })

  describe('isMyAccountDetail', () => {
    describe('isMyAccountDetail is true', () => {
      it('adds DDPRenewal-myAccountDetailsExpiry class', () => {
        const { wrapper } = renderComponent({
          ...defaultProps,
          ...defaultActions,
          isMyAccountDetail: true,
        })

        expect(wrapper.childAt(0).prop('className')).toBe(
          'DDPRenewal DDPRenewal-myAccountDetailsExpiry'
        )
      })
    })
    describe('isMyAccountDetail is false', () => {
      it('does not add DDPRenewal-myAccountExpiry class', () => {
        const { wrapper } = renderComponent({
          ...defaultProps,
          ...defaultActions,
          isMyAccountDetail: false,
        })

        expect(wrapper.childAt(0).prop('className')).toBe('DDPRenewal')
      })
    })
  })

  describe('withOuterDDPTitleAndSeparator', () => {
    describe('withOuterDDPTitleAndSeparator is true', () => {
      beforeAll(() => {
        ;({ wrapper } = renderComponent({
          ...defaultProps,
          ...defaultActions,
          withOuterDDPTitleAndSeparator: true,
        }))
      })

      it('should render an element with className DDPRenewal-withOuterDDPTitleAndSeparator', () => {
        const withOuterDDPTitleAndSeparator = wrapper.find(
          '.DDPRenewal-withOuterDDPTitleAndSeparator'
        )

        expect(withOuterDDPTitleAndSeparator).toHaveLength(1)
      })

      it('should render the name of the DDP product inside DDPRenewal-withOuterDDPTitleAndSeparatorTitle', () => {
        const withOuterDDPTitleAndSeparator = wrapper.find(
          '.DDPRenewal-withOuterDDPTitleAndSeparator'
        )
        const productTitle = withOuterDDPTitleAndSeparator.find(
          '.DDPRenewal-withOuterDDPTitleAndSeparatorTitle'
        )

        expect(productTitle).toHaveLength(1)
        expect(productTitle.text()).toBe('product name')
      })
    })

    describe('withOuterDDPTitleAndSeparator is false', () => {
      beforeAll(() => {
        ;({ wrapper } = renderComponent({
          ...defaultProps,
          ...defaultActions,
        }))
      })
      it('should not render an element with className DDPRenewal-withOuterDDPTitleAndSeparator', () => {
        const withOuterDDPTitleAndSeparator = wrapper.find(
          '.DDPRenewal-withOuterDDPTitleAndSeparator'
        )

        expect(withOuterDDPTitleAndSeparator).toHaveLength(0)
      })

      it('should not render the name of the DDP product inside DDPRenewal-withOuterDDPTitleAndSeparatorTitle', () => {
        const withOuterDDPTitleAndSeparator = wrapper.find(
          '.DDPRenewal-withOuterDDPTitleAndSeparator'
        )
        const productTitle = withOuterDDPTitleAndSeparator.find(
          '.DDPRenewal-withOuterDDPTitleAndSeparatorTitle'
        )

        expect(productTitle).toHaveLength(0)
      })
    })
  })

  describe('hasDDPExpired', () => {
    describe('hasDDPExpired is false', () => {
      const ddpProductName = 'product name'
      const ddpEndDate = '5 May 2020'
      const newEndDate = '5 May 2021'
      const ddpFormattedPrice = '£20.00'
      let expiringWrapper

      beforeAll(() => {
        ;({ wrapper: expiringWrapper } = renderComponent({
          ...defaultProps,
          ...defaultActions,
          ddpFormattedPrice,
          ddpProductName,
          ddpEndDate,
          hasDDPExpired: false,
        }))
      })

      it('should render expiring title', () => {
        const title = expiringWrapper.find('h3.DDPRenewal-title')
        expect(title.text()).toBe(
          `DDP expiring title ${ddpProductName},${ddpEndDate}`
        )
      })
      it('should render extend continueSavingMessage with correct end Date', () => {
        const messageContainer = expiringWrapper.find(
          '.DDPRenewal-messageContainer'
        )
        const continueSaving = messageContainer.childAt(1)
        expect(continueSaving.text()).toBe(`DDP Extend Msg ${newEndDate}`)
      })
      it('should render extend button text', () => {
        const button = expiringWrapper.find('button.Button')
        expect(button.text()).toBe(`DDP Button Extend ${ddpFormattedPrice}`)
      })
      it('should render Espot with expiring identifier', () => {
        const espot = expiringWrapper.find('Espot')
        expect(espot.prop('identifier')).toBe('ddp_renewal_expiring')
      })
    })
    describe('hasDDPexpired is true', () => {
      const ddpProductName = 'diff product name'
      const newEndDate = '4 April 2021'
      const ddpFormattedPrice = '£15.00'
      let expiredWrapper

      beforeAll(() => {
        mockdate.set('2020-04-04T08:00:00.000Z')
        ;({ wrapper: expiredWrapper } = renderComponent({
          ...defaultProps,
          ...defaultActions,
          ddpFormattedPrice,
          ddpProductName,
          ddpEndDate: null,
          hasDDPExpired: true,
        }))
      })

      afterAll(() => {
        mockdate.reset()
      })

      it('should render expired title', () => {
        const title = expiredWrapper.find('h3.DDPRenewal-title')
        expect(title.text()).toBe(`DDP expired title ${ddpProductName}`)
      })
      it('should render renewal continueSavingMessage with correct end Date', () => {
        const messageContainer = expiredWrapper.find(
          '.DDPRenewal-messageContainer'
        )
        const continueSaving = messageContainer.childAt(1)
        expect(continueSaving.text()).toBe(`DDP Renewal Msg ${newEndDate}`)
      })
      it('should render renew button text', () => {
        const button = expiredWrapper.find('button.Button')
        expect(button.text()).toBe(`DDP Button Renew ${ddpFormattedPrice}`)
      })
      it('should render Espot with expired identifier', async () => {
        const espot = expiredWrapper.find('Espot')
        expect(espot.prop('identifier')).toBe('ddp_renewal_expired')
      })
    })
  })

  describe('showDDPSavings', () => {
    it('should render savings message when showDDPSavings is true', () => {
      const savings = '7.70'
      const { wrapper } = renderComponent({
        ...defaultProps,
        ...defaultActions,
        ddpSavingsValue: savings,
        showDDPSavings: true,
      })
      const savingsMessage = wrapper
        .find('.DDPRenewal-messageContainer')
        .childAt(0)
      expect(savingsMessage.text()).toBe(`DDP Savings Msg ${savings}`)
    })
    it('should render express saving message when showDDPSavings is false', () => {
      const ddpExpressDeliveryPrice = '5.54'
      const { wrapper } = renderComponent({
        ...defaultProps,
        ...defaultActions,
        ddpExpressDeliveryPrice,
        showDDPSavings: false,
      })
      const savingsMessage = wrapper
        .find('.DDPRenewal-messageContainer')
        .childAt(0)
      expect(savingsMessage.text()).toBe(
        `DDP Express Saving ${ddpExpressDeliveryPrice}`
      )
    })
  })

  describe('Button', () => {
    const addToBagSpy = jest.fn(() => {})
    const ddpFormattedPrice = '£10.12'
    const ddpSku = 'btn-add-sku'
    let btnWrapper

    beforeAll(() => {
      ;({ wrapper: btnWrapper } = renderComponent({
        ...defaultProps,
        ...defaultActions,
        ddpFormattedPrice,
        ddpSku,
        addToBag: addToBagSpy,
      }))
    })

    it('button text should match passed price', () => {
      expect(btnWrapper.find('button.Button').text()).toBe(
        `DDP Button Extend ${ddpFormattedPrice}`
      )
    })

    it('on click, should call addToBag with passed ddpSku', () => {
      const btn = btnWrapper.find('button.Button')
      btn.simulate('click')
      expect(addToBagSpy).toHaveBeenCalledWith(ddpSku)
    })
  })

  describe('when `withMoreDetailsLink` prop is false', () => {
    describe('Terms & Conditions Section', () => {
      describe('when prop `isMyAccountDetail` is true', () => {
        it('should render T&Cs in span with class DDPRenewal-terms--centered', () => {
          const { wrapper } = renderComponent({
            ...defaultProps,
            ...defaultActions,
            isMyAccountDetail: true,
          })
          const tAndCCentered = wrapper.find('span.DDPRenewal-terms--centered')
          expect(tAndCCentered).not.toBeNull()
          expect(tAndCCentered).toHaveLength(1)
        })
      })

      describe('when prop `isMyAccount` is true', () => {
        it('should render T&Cs in span with class DDPRenewal-terms--centered', () => {
          const { wrapper } = renderComponent({
            ...defaultProps,
            ...defaultActions,
            isMyAccount: true,
          })
          const tAndCCentered = wrapper.find('span.DDPRenewal-terms--centered')
          expect(tAndCCentered).not.toBeNull()
          expect(tAndCCentered).toHaveLength(1)
        })
      })

      describe('when prop `isMyAccountDetail` and `isMyAccount` is false', () => {
        it('should render T&Cs in span with class DDPRenewal-terms', () => {
          const tAndC = wrapper.find('span.DDPRenewal-terms')
          const tAndCCentered = wrapper.find('span.DDPRenewal-terms--centered')

          expect(tAndCCentered).toHaveLength(0)
          expect(tAndC).not.toBeNull()
          expect(tAndC).toHaveLength(1)
        })
      })

      it('should display the terms and conditions link', () => {
        const tAndC = wrapper.find('span.DDPRenewal-terms')
        expect(tAndC.text()).toBe('Terms & Conditions')
      })
    })
  })

  describe('when `withMoreDetailsLink` prop is true', () => {
    describe('More Details Section', () => {
      describe('when prop `isContentCentered` is true', () => {
        it('should render More Details in span with class DDPRenewal-moreDetails--centered', () => {
          const { wrapper } = renderComponent({
            ...defaultProps,
            ...defaultActions,
            isMyAccount: true,
            withMoreDetailsLink: true,
          })
          const moreDetailsCentered = wrapper.find(
            'span.DDPRenewal-moreDetails--centered'
          )
          expect(moreDetailsCentered).not.toBeNull()
          expect(moreDetailsCentered).toHaveLength(1)
        })
      })

      describe('when prop `isMyAccount` is false', () => {
        it('should render More Details in span with class DDPRenewal-moreDetails', () => {
          const { wrapper } = renderComponent({
            ...defaultProps,
            ...defaultActions,
            withMoreDetailsLink: true,
          })
          const moreDetails = wrapper.find('span.DDPRenewal-moreDetails')
          const moreDetailsCentered = wrapper.find(
            'span.DDPRenewal-moreDetails--centered'
          )

          expect(moreDetailsCentered).toHaveLength(0)
          expect(moreDetails).not.toBeNull()
          expect(moreDetails).toHaveLength(1)
        })
      })

      it('should display the More Details link', () => {
        const { wrapper } = renderComponent({
          ...defaultProps,
          ...defaultActions,
          storeCode: initialState.config.storeCode,
          withMoreDetailsLink: true,
        })
        const moreDetails = wrapper.find('span.DDPRenewal-moreDetails')

        expect(moreDetails.text()).toBe('More details')
      })
    })
  })
})
