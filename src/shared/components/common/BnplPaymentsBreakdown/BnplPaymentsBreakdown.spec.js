import React from 'react'
import { Link } from 'react-router'
import testComponentHelper from 'test/unit/helpers/test-component'
import BnplPaymentsBreakdown from './BnplPaymentsBreakdown'
import Image from '../Image/Image'

const initialProps = {
  unitPrice: '5.00',
  bnplPaymentOptions: {},
  storeCode: 'tsuk',
  isMobile: false,
  showModal: jest.fn(),
}

describe('<BnplPaymentsBreakdown/>', () => {
  const renderComponent = testComponentHelper(BnplPaymentsBreakdown)

  describe('@renders', () => {
    it('in default state', () => {
      expect(renderComponent(initialProps).getTree()).toMatchSnapshot()
    })

    describe('clearpay instalments are present and product price is >= 10', () => {
      it('shows number of instalments and correct amount for Clearpay', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          unitPrice: '10.00',
          bnplPaymentOptions: {
            clearpay: {
              amount: '0.01',
              instalments: 4,
            },
          },
        })

        expect(wrapper.text()).toEqual(
          expect.stringContaining('Or 4 payments of £0.01 with')
        )

        const link = wrapper.find(Link)

        expect(link.prop('to')).toBe('')

        expect(link.find(Image).props()).toEqual({
          alt: 'clearpay',
          className:
            'BnplPaymentsBreakdown-paymentIcon BnplPaymentsBreakdown-paymentIcon--clearpay',
          src: '/assets/common/images/bnpl-clearpay.svg',
        })
      })
    })

    describe('clearpay instalments are present and product price is < 20', () => {
      it('renders nothing', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          bnplPaymentOptions: {
            clearpay: {
              amount: '0.01',
              instalments: 4,
            },
          },
        })

        expect(wrapper.html()).toEqual(null)
      })
    })

    describe('Clearpay instalments are present and product price is >= 10', () => {
      it('shows number of instalments and correct amount for Clearpay and Klarna', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          unitPrice: '10.00',
          bnplPaymentOptions: {
            clearpay: {
              amount: '1.11',
              instalments: 2,
            },
          },
        })

        expect(wrapper.text()).toEqual(
          expect.stringContaining('Or 2 payments of £1.11 with')
        )
      })
    })

    describe('Clearpay instalments are present and product price is < 10', () => {
      it('renders nothing', () => {
        const { wrapper } = renderComponent({
          ...initialProps,
          bnplPaymentOptions: {
            clearpay: {
              amount: '1.11',
              instalments: 2,
            },
          },
        })

        expect(wrapper.html()).toEqual(null)
      })
    })
  })

  describe('@events', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    describe('when clearpay instalments are present and product price is >= 10', () => {
      describe('when is desktop', () => {
        it('should call `event.preventDefault` and `showModal` with the correct parameters', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            unitPrice: '10.00',
            bnplPaymentOptions: {
              clearpay: {
                amount: '12.01',
                instalments: 3,
              },
            },
          })
          const event = { preventDefault: jest.fn() }
          const link = wrapper.find(Link)
          link.prop('onClick')(event)

          expect(event.preventDefault).toHaveBeenCalledTimes(1)
          expect(initialProps.showModal).toHaveBeenCalledTimes(1)
          expect(initialProps.showModal).toHaveBeenCalledWith(
            <div className="BnplPaymentsBreakdown-lightboxWrapper">
              <img
                alt="clearpay"
                className="BnplPaymentsBreakdown-lightbox"
                src="https://static.afterpay.com/clearpay-lightbox-desktop.png"
              />
              <a
                className="BnplPaymentsBreakdown-termsLink BnplPaymentsBreakdown-termsLink--desktop"
                href="https://www.clearpay.co.uk/en-GB/terms-of-service"
                rel="noopener noreferrer"
                target="_blank"
              >
                Terms
              </a>
            </div>,
            { mode: 'bnplPaymentsBreakdown' }
          )
        })
      })

      describe('when is mobile', () => {
        it('should call `event.preventDefault` and `showModal` with the correct parameters', () => {
          const { wrapper } = renderComponent({
            ...initialProps,
            unitPrice: '10.00',
            bnplPaymentOptions: {
              clearpay: {
                amount: '12.01',
                instalments: 3,
              },
            },
            isMobile: true,
          })
          const event = { preventDefault: jest.fn() }
          const link = wrapper.find(Link)
          link.prop('onClick')(event)

          expect(event.preventDefault).toHaveBeenCalledTimes(1)
          expect(initialProps.showModal).toHaveBeenCalledTimes(1)
          expect(initialProps.showModal).toHaveBeenCalledWith(
            <div className="BnplPaymentsBreakdown-lightboxWrapper">
              <img
                alt="clearpay"
                className="BnplPaymentsBreakdown-lightbox"
                src="https://static.afterpay.com/clearpay-lightbox-mobile.png"
              />
              <a
                className="BnplPaymentsBreakdown-termsLink BnplPaymentsBreakdown-termsLink--mobile"
                href="https://www.clearpay.co.uk/en-GB/terms-of-service"
                rel="noopener noreferrer"
                target="_blank"
              >
                Terms
              </a>
            </div>,
            { mode: 'bnplPaymentsBreakdown' }
          )
        })
      })
    })
  })
})
