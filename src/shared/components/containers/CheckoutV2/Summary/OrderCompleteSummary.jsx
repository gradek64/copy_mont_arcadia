import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { contains, isEmpty } from 'ramda'
import { normalizePrice } from '../../../../lib/price'

// Selectors
import {
  extractDiscountInfo,
  getDeliveryDate,
  getSubTotal,
  isCollectFromOrder,
} from '../../../../selectors/checkoutSelectors'
import {
  isDDPStandaloneOrderCompleted,
  getDDPDefaultName,
  isDDPOrderCompleted,
} from '../../../../selectors/ddpSelectors'
import { getPaymentMethods } from '../../../../selectors/paymentMethodSelectors'
import {
  getCurrencyCode,
  getBrandName,
  getLogoVersion,
} from '../../../../selectors/configSelectors'
import { getStoreLocatorStores } from '../../../../selectors/storeLocatorSelectors'
import { isMobile } from '../../../../selectors/viewportSelectors'

// Components
import Espot from '../../Espot/Espot'
import PaymentSummary from '../../../common/PaymentSummary/PaymentSummary'
import OrderCompleteButton from '../../../common/OrderCompleteButton/OrderCompleteButton'
import OrderCompleteBasket from '../../../common/OrderCompleteBasket/OrderCompleteBasket'
import OrderCompleteDelivery from '../../../common/OrderCompleteDelivery/OrderCompleteDelivery'
import SandBox from '../../SandBox/SandBox'
import GuestRegisterForm from '../Guest/GuestRegisterForm'

// Constants
import { GCARD } from '../../../../constants/paymentTypes'
import espotsMobile from '../../../../constants/espotsMobile'
import cmsConsts from '../../../../constants/cmsConsts'

const mapStateToProps = (state) => ({
  brandName: getBrandName(state),
  currencyCode: getCurrencyCode(state),
  deliveryDate: getDeliveryDate(state),
  ddpDefaultName: getDDPDefaultName(state),
  discountInfo: extractDiscountInfo(state),
  isCollectFromOrder: isCollectFromOrder(state),
  isDDPOrderCompleted: isDDPOrderCompleted(state),
  isDDPStandaloneOrderCompleted: isDDPStandaloneOrderCompleted(state),
  isMobile: isMobile(state),
  logoVersion: getLogoVersion(state),
  minLaptop: contains(state.viewport.media, ['laptop', 'desktop']),
  orderSubtotal: getSubTotal(state),
  paymentMethods: getPaymentMethods(state),
  stores: getStoreLocatorStores(state),
})

const OrderCompleteSummary = (
  {
    brandName,
    buttonClickHandler,
    deliveryDate,
    ddpDefaultName,
    discountInfo,
    isCollectFromOrder,
    isDDPOrderCompleted,
    isDDPStandaloneOrderCompleted,
    isDiscoverMoreEnabled,
    isMobile,
    logoVersion,
    minLaptop,
    orderCompleted,
    orderError,
    orderSubtotal,
    paymentMethods,
    stores,
  },
  { l }
) => {
  if (!orderCompleted || isEmpty(orderCompleted)) {
    return null
  }

  const payments = orderCompleted.paymentDetails.map((payment) => {
    // Checking the discount is applied to a payment method other than gift card
    const {
      cardNumberStar,
      selectedPaymentMethod,
      totalCost,
      totalCostAfterDiscount,
      paymentMethod,
      remainingBalance,
    } = payment

    // Extracting the payment method from the paymentConfig
    const method = paymentMethods.find((method) => {
      return (
        selectedPaymentMethod !== GCARD &&
        method.value === selectedPaymentMethod
      )
    })
    const isThirdPartyPaymentMethod = method && method.type === 'OTHER'

    const isDiscounted =
      (cardNumberStar || isThirdPartyPaymentMethod) &&
      totalCostAfterDiscount &&
      normalizePrice(totalCost) !== normalizePrice(totalCostAfterDiscount)

    return {
      method: paymentMethod,
      cardNumber: cardNumberStar,
      price: normalizePrice(totalCost),
      type: selectedPaymentMethod,
      isCardType: !isThirdPartyPaymentMethod,
      // priceAfterDiscount is returned only when a gift card is applied
      ...(isDiscounted && {
        priceAfterDiscount: normalizePrice(totalCostAfterDiscount),
      }),
      ...(selectedPaymentMethod === GCARD && {
        remainingBalance,
      }),
    }
  })

  const renderMobileEspot = () => (
    <SandBox
      cmsPageName={espotsMobile.orderConfirmation[0]}
      contentType={cmsConsts.ESPOT_CONTENT_TYPE}
      isInPageContent
    />
  )

  return (
    <section className="OrderCompleteSummary">
      <Helmet title={l`Your Order is Complete`} />
      {!orderError && (
        <div className="OrderCompleteSummary-success">
          <div className="OrderCompleteSummary-container">
            <div className="OrderCompleteSummary-left">
              <OrderCompleteDelivery
                brandName={brandName}
                ddpDefaultName={ddpDefaultName}
                deliveryDate={deliveryDate}
                orderCompleted={orderCompleted}
                isDDPStandaloneOrderCompleted={isDDPStandaloneOrderCompleted}
                isCollectFromOrder={isCollectFromOrder}
                isDDPOrderCompleted={isDDPOrderCompleted}
                logoVersion={logoVersion}
                minLaptop={minLaptop}
                stores={stores}
              />
              <Espot identifier="thankyouESpot1" />
              {isMobile && renderMobileEspot()}
              {orderCompleted.isGuestOrder &&
                !orderCompleted.isRegisteredEmail && (
                  <GuestRegisterForm l={l} />
                )}
              <PaymentSummary
                payments={payments}
                totalOrderPrice={orderCompleted.totalOrderPrice}
              />
              <Espot identifier="thankyouESpot2" />
              <Espot identifier="thankyouESpot3" />
            </div>
            <OrderCompleteBasket
              discountInfo={discountInfo}
              orderCompleted={orderCompleted}
              orderSubtotal={orderSubtotal}
              isDDPStandaloneOrderCompleted={isDDPStandaloneOrderCompleted}
              isMobile={isMobile}
            />
          </div>
          <OrderCompleteButton
            buttonClickHandler={buttonClickHandler}
            isDiscoverMoreEnabled={isDiscoverMoreEnabled}
            orderError={orderError}
            orderCompleted={orderCompleted}
          />
        </div>
      )}
    </section>
  )
}

OrderCompleteSummary.contextTypes = {
  l: PropTypes.func,
}

OrderCompleteSummary.propTypes = {
  brandName: PropTypes.string.isRequired,
  buttonClickHandler: PropTypes.func.isRequired,
  ddpDefaultName: PropTypes.string.isRequired,
  isDDPStandaloneOrderCompleted: PropTypes.bool.isRequired,
  isDiscoverMoreEnabled: PropTypes.bool.isRequired,
  logoVersion: PropTypes.string.isRequired,
  minLaptop: PropTypes.bool,
  orderCompleted: PropTypes.object.isRequired,
  paymentMethods: PropTypes.array.isRequired,
  deliveryDate: PropTypes.string,
  discountInfo: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      label: PropTypes.string,
    })
  ),
  isCollectFromOrder: PropTypes.bool,
  isDDPOrderCompleted: PropTypes.bool,
  isMobile: PropTypes.bool,
  orderError: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  orderSubtotal: PropTypes.string,
  stores: PropTypes.arrayOf(
    PropTypes.shape({
      storeId: PropTypes.string,
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    })
  ),
}

OrderCompleteSummary.defaultProps = {
  currencyCode: 'GBP',
  discountInfo: [],
  deliveryDate: '',
  isCollectFromOrder: false,
  isDDPOrderCompleted: false,
  isMobile: true,
  minLaptop: false,
  orderError: false,
  orderSubtotal: '',
  stores: [],
}

export default connect(mapStateToProps)(OrderCompleteSummary)
