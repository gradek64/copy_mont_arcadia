import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'ramda'
import OrderHistoryDetailsAddress from './OrderHistoryDetailsAddress'
import OrderHistoryDetailsPayment from './OrderHistoryDetailsPayment'
import OrderHistoryDetailsSummary from './OrderHistoryDetailsSummary'
import { PrivacyGuard } from '../../../lib'
import {
  getOrderDetailsDeliveryPostCode,
  getValidOrderStatusReturn,
  getValidUKOrdersCountries,
} from '../../../selectors/common/accountSelectors'
import {
  hasDDP,
  hasTrackingAvailable,
  hasNoTracking,
} from '../../../constants/trackingTypes'
import postCodeRules from '../../../constants/checkoutAddressFormRules'
import {
  OrderItem,
  DdpItems,
  TrackedItems,
  NonTrackedItems,
  StartAReturnButton,
} from './HistoryDetailsComponents'

export default class HistoryDetailsContainer extends Component {
  static propTypes = {
    orderDetails: PropTypes.object.isRequired,
    paramId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    orderReturnUrl: PropTypes.string,
    isFeatureOrderReturnsEnabled: PropTypes.bool,
    isFeatureTrackMyOrdersEnabled: PropTypes.bool,
    allowedReturnOrderCountry: PropTypes.string,
  }
  static contextTypes = {
    l: PropTypes.func,
  }
  static defaultProps = {
    isFeatureOrderReturnsEnabled: false,
    isFeatureTrackMyOrdersEnabled: false,
    orderReturnUrl: null,
    allowedReturnOrderCountry: 'United Kingdom',
  }

  render() {
    const {
      paramId,
      isFeatureOrderReturnsEnabled,
      orderReturnUrl,
      allowedReturnOrderCountry,
      isFeatureTrackMyOrdersEnabled,
      orderDetails: {
        statusCode,
        orderId,
        orderLines,
        orderLinesSortedByTracking,
        paymentDetails,
        deliveryMethod,
        deliveryType,
        deliveryDate,
        deliveryAddress,
        billingAddress,
        deliveryPrice,
        totalOrderPrice,
        status,
        isDDPOrder,
        isOrderFullyRefunded = false,
      },
    } = this.props
    const { l } = this.context
    const isDDPOrderOnly = isDDPOrder && orderLines.length === 1
    const { pattern } = postCodeRules[allowedReturnOrderCountry]
    const postCode = getOrderDetailsDeliveryPostCode(deliveryAddress)
    const validUKOrdersCountries = getValidUKOrdersCountries(deliveryAddress)
    const returnValidUkOrderReturn = () => {
      const validUkPostCode = new RegExp(pattern).test(postCode)
      return (
        validUKOrdersCountries &&
        validUkPostCode &&
        orderReturnUrl &&
        !isEmpty(orderLines)
      )
    }

    return (
      <div className="HistoryDetailsContainer">
        <section className="HistoryDetailsContainer-header">
          <div className="HistoryDetailsContainer-headerCol">
            <p className="HistoryDetailsContainer-orderNumberLabel">
              {l`Order Number`}:
            </p>
            {status &&
              !isDDPOrderOnly && (
                <p className="HistoryDetailsContainer-orderStatusLabel">
                  {l`Order status`}:
                </p>
              )}
          </div>
          <div className="HistoryDetailsContainer-headerCol">
            <p className="HistoryDetailsContainer-orderNumber">
              <PrivacyGuard>
                <strong className="HistoryDetailsContainer-orderId">
                  {orderId || paramId}
                </strong>
              </PrivacyGuard>
            </p>
            {status &&
              !isDDPOrderOnly && (
                <p className="HistoryDetailsContainer-orderStatus">
                  <PrivacyGuard>
                    <strong className="HistoryDetailsContainer-statusText">
                      {status}
                    </strong>
                  </PrivacyGuard>
                </p>
              )}
          </div>
        </section>

        {isFeatureTrackMyOrdersEnabled &&
          validUKOrdersCountries &&
          (orderLinesSortedByTracking && (
            <section className="HistoryDetailsContainer-list">
              {Object.keys(orderLinesSortedByTracking).map((key, _index) => {
                const index = _index + 1
                const deliveryMethodHeader = {
                  method: deliveryMethod,
                  date: deliveryDate,
                }
                const itemsTracked = Object.keys(
                  orderLinesSortedByTracking
                ).includes(hasTrackingAvailable)
                return (
                  <Fragment>
                    {key === hasDDP && (
                      <DdpItems
                        index={index}
                        ddpItems={orderLinesSortedByTracking[key]}
                      />
                    )}
                    {key === hasTrackingAvailable && (
                      <TrackedItems
                        index={index}
                        orderItems={orderLinesSortedByTracking[key]}
                        isTrackedShipment
                        l={l}
                        deliveryMethodHeader={deliveryMethodHeader}
                      />
                    )}
                    {key === hasNoTracking && (
                      <NonTrackedItems
                        showButton={
                          deliveryType === 'H'
                        } /* show if delivery type is home delivery */
                        index={index}
                        orderItems={orderLinesSortedByTracking[key]}
                        l={l}
                        deliveryMethod={deliveryMethod}
                        deliveryDate={deliveryDate}
                        itemsTracked={itemsTracked}
                      />
                    )}
                  </Fragment>
                )
              })}
            </section>
          ))}

        {/* Display the original orderItems if feature is not enabled */}
        {(!isFeatureTrackMyOrdersEnabled || !validUKOrdersCountries) &&
          (orderLines &&
            !isEmpty(orderLines) && (
              <section className="HistoryDetailsContainer-list">
                {orderLines.map((item, key) => (
                  <OrderItem data={{ item, key }} />
                ))}
              </section>
            ))}

        {/* Cannot find any orders display message */}
        {isEmpty(orderLines) && (
          <section className="HistoryDetailsContainer-notFound">{l`Order not found`}</section>
        )}

        {/* Display the total price */}
        {totalOrderPrice && (
          <OrderHistoryDetailsSummary
            deliveryPrice={deliveryPrice}
            totalOrderPrice={totalOrderPrice}
            isDDPOrder={isDDPOrder}
          />
        )}

        {isFeatureOrderReturnsEnabled &&
          !isOrderFullyRefunded &&
          returnValidUkOrderReturn() &&
          getValidOrderStatusReturn(statusCode) && (
            <div className="HistoryDetailsContainer-returns">
              <StartAReturnButton
                orderReturnUrl={`${orderReturnUrl}/returnPortal/Details?OrderNumber=${orderId}&DeliveryPostcode=${postCode}`}
                ctaText={l`START A RETURN`}
              />
            </div>
          )}
        {paymentDetails &&
          !isEmpty(paymentDetails) && (
            <div>
              <OrderHistoryDetailsAddress
                className="OrderHistoryDetailsAddress--delivery"
                address={deliveryAddress}
                deliveryMethod={deliveryMethod}
                type="shipping"
              />
              <OrderHistoryDetailsAddress
                className="OrderHistoryDetailsAddress--billing"
                address={billingAddress}
                type="billing"
              />
              <OrderHistoryDetailsPayment paymentDetails={paymentDetails} />
            </div>
          )}
      </div>
    )
  }
}
