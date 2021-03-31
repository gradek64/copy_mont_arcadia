import React from 'react'
import { Link } from 'react-router'
import classnames from 'classnames'
import Image from '../Image/Image'
import PropTypes from 'prop-types'

const MINIMUM_PRICE_THRESHOLD = 10

export const klarnaLandingPages = {
  tsuk: '/en/tsuk/category/try-before-you-buy-7296958/home',
  tmuk: '/en/tmuk/category/try-now-pay-later-6948361/home',
  dpuk: '/en/dpuk/category/try-now-pay-later-7030240/home',
  msuk: '/en/msuk/category/klarna-5917166/home',
  bruk: '/en/bruk/category/klarna-try-now-buy-later-7299260/home',
  wluk: '/en/wluk/category/bnpl-5103430/home',
  evuk: '/en/evuk/category/klarna-buy-now-pay-later-5778039/home',
}

const BnplPaymentsBreakdown = (
  { unitPrice, bnplPaymentOptions = {}, showModal, storeCode, isMobile },
  { p }
) => {
  const handleOnClick = (event, paymentMethod) => {
    if (paymentMethod === 'clearpay') {
      event.preventDefault()

      const termsLinkClasses = classnames('BnplPaymentsBreakdown-termsLink', {
        'BnplPaymentsBreakdown-termsLink--mobile': isMobile,
        'BnplPaymentsBreakdown-termsLink--desktop': !isMobile,
      })

      showModal(
        <div className="BnplPaymentsBreakdown-lightboxWrapper">
          <img
            alt={paymentMethod}
            className="BnplPaymentsBreakdown-lightbox"
            src={`https://static.afterpay.com/clearpay-lightbox-${
              isMobile ? 'mobile' : 'desktop'
            }.png`}
          />
          <a
            className={termsLinkClasses}
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.clearpay.co.uk/en-GB/terms-of-service"
          >
            Terms
          </a>
        </div>,
        { mode: 'bnplPaymentsBreakdown' }
      )
    }
  }

  return unitPrice >= MINIMUM_PRICE_THRESHOLD ? (
    <div className="BnplPaymentsBreakdown">
      {['clearpay'].map((paymentMethod) => {
        // add klarna back into the array to anable it on the PDP
        const paymentIconClasses = classnames(
          'BnplPaymentsBreakdown-paymentIcon',
          {
            'BnplPaymentsBreakdown-paymentIcon--klarna':
              paymentMethod === 'klarna',
            'BnplPaymentsBreakdown-paymentIcon--clearpay':
              paymentMethod === 'clearpay',
          }
        )

        return bnplPaymentOptions[paymentMethod] ? (
          <div
            key={paymentMethod}
            className="BnplPaymentsBreakdown-paymentMethod"
          >
            Or {bnplPaymentOptions[paymentMethod].instalments} payments of&nbsp;
            <b>{p(bnplPaymentOptions[paymentMethod].amount)}</b>&nbsp;with{' '}
            <Link
              className={`BnplPaymentsBreakdown-${paymentMethod}`}
              onClick={(event) => handleOnClick(event, paymentMethod)}
              target="_blank"
              to={
                paymentMethod === 'klarna' ? klarnaLandingPages[storeCode] : ''
              }
            >
              <Image
                alt={paymentMethod}
                className={paymentIconClasses}
                src={`/assets/common/images/bnpl-${paymentMethod}.svg`}
              />
            </Link>
          </div>
        ) : null
      })}
    </div>
  ) : null
}

BnplPaymentsBreakdown.propTypes = {
  unitPrice: PropTypes.string.isRequired,
  bnplPaymentOptions: PropTypes.object.isRequired,
  showModal: PropTypes.func.isRequired,
  storeCode: PropTypes.string.isRequired,
  isMobile: PropTypes.bool.isRequired,
}

BnplPaymentsBreakdown.contextTypes = {
  p: PropTypes.func,
}

export default BnplPaymentsBreakdown
