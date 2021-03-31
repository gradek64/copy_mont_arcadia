import React from 'react'
import { compose } from 'ramda'
import {
  mountRender,
  withStore,
  buildComponentRender,
} from 'test/unit/helpers/test-component'
import DDPRenewalActive from '../DDPRenewalActive'

const DDPIcon = () => <div className="ddp-test-icon" />
const initialState = {
  config: {
    brandName: 'topshop',
    brandCode: 'ts',
    storeCode: 'tsuk',
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
}

describe('<DDPRenewal/>', () => {
  const render = compose(
    mountRender,
    withStore(initialState)
  )
  const renderComponent = buildComponentRender(render, DDPRenewalActive)
  let wrapper
  const l = jest.fn((args, ...params) => `${args[0]}${params}`)

  const defaultActions = {
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

  it('should render outer div with DDPRenewal DDPRenewal-active className', () => {
    expect(wrapper.childAt(0).prop('className')).toBe(
      'DDPRenewal DDPRenewal-active'
    )
  })

  it('DDPRenewalActive component first child has a class of DDPRenewal-container', () => {
    const container = wrapper.find('.DDPRenewal-active').childAt(0)
    expect(container.prop('className')).toBe('DDPRenewal-container')
  })

  it('should render passed DDPIcon', () => {
    const ddpIcon = wrapper.find('div.ddp-test-icon')
    expect(ddpIcon).not.toBeNull()
    expect(ddpIcon).toHaveLength(1)
  })

  it('should render message container with 2 messages', () => {
    const messageContainer = wrapper.find('.DDPRenewal-messageContainer')
    expect(messageContainer).not.toBeNull()
    expect(messageContainer.children()).toHaveLength(2)
  })

  describe('isMyAccount', () => {
    describe('isMyAccount is true', () => {
      it('adds DDPRenewal-myAccountActive class', () => {
        const { wrapper } = renderComponent({
          ...defaultProps,
          ...defaultActions,
          isMyAccount: true,
        })

        expect(wrapper.childAt(0).prop('className')).toBe(
          'DDPRenewal DDPRenewal-active DDPRenewal-myAccountActive'
        )
      })
    })

    describe('isMyAccount is false', () => {
      it('does not add DDPRenewal-myAccountActive class', () => {
        const { wrapper } = renderComponent({
          ...defaultProps,
          ...defaultActions,
          isMyAccount: false,
        })

        expect(wrapper.childAt(0).prop('className')).toBe(
          'DDPRenewal DDPRenewal-active'
        )
      })
    })
  })

  describe('isMyAccountDetails', () => {
    describe('isMyAccountDetails is true', () => {
      it('adds DDPRenewal-myAccountDetailsActive class', () => {
        const { wrapper } = renderComponent({
          ...defaultProps,
          ...defaultActions,
          isMyAccountDetail: true,
        })

        expect(wrapper.childAt(0).prop('className')).toBe(
          'DDPRenewal DDPRenewal-active DDPRenewal-myAccountDetailsActive'
        )
      })
    })
    describe('isMyAccountDetails is false', () => {
      it('does not add DDPRenewal-myAccountDetailsActive class', () => {
        const { wrapper } = renderComponent({
          ...defaultProps,
          ...defaultActions,
          isMyAccountDetail: false,
        })

        expect(wrapper.childAt(0).prop('className')).toBe(
          'DDPRenewal DDPRenewal-active'
        )
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

  describe('More Details Section', () => {
    describe('when prop `isContentCentered` is true', () => {
      it('should render More Details in span with class DDPRenewal-moreDetails--centered', () => {
        const { wrapper } = renderComponent({
          ...defaultProps,
          ...defaultActions,
          isContentCentered: true,
          withMoreDetailsLink: true,
        })
        const moreDetailsCentered = wrapper.find(
          'span.DDPRenewal-moreDetails--centered'
        )
        expect(moreDetailsCentered).not.toBeNull()
        expect(moreDetailsCentered).toHaveLength(1)
      })
    })

    describe('when prop `isContentCentered` is false', () => {
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
