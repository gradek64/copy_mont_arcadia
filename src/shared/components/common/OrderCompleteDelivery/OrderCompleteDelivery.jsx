import React from 'react'
import { Link } from 'react-router'
import PropTypes from 'prop-types'
import { path, props } from 'ramda'

// Components
import { PrivacyGuard } from '../../../lib'
import Image from '../Image/Image'

// Utils
import {
  deliveryTypes,
  normaliseDeliveryType,
} from '../../../lib/checkout-utilities/order-summary'
import { trimStringEnds } from '../../../lib/string-utils'

const OrderCompleteDelivery = (
  {
    brandName,
    ddpDefaultName,
    deliveryDate,
    isCollectFromOrder,
    isDDPOrderCompleted,
    isDDPStandaloneOrderCompleted,
    logoVersion,
    minLaptop,
    orderCompleted,
    stores,
  },
  { l }
) => {
  const {
    deliveryAddress,
    isGuestOrder,
    orderId,
    deliveryCarrier,
    guestUserEmail,
  } = orderCompleted

  const addressLines = props(
    ['name', 'address1', 'address2', 'address3', 'address4', 'country'],
    deliveryAddress
  ).filter((availableAddressLine) => Boolean(availableAddressLine))

  const getDeliveryStore = () =>
    stores
      ? stores.find(
          (store) =>
            trimStringEnds(path(['address', 'postcode'], store)) ===
            trimStringEnds(
              path(['deliveryAddress', 'address4'], orderCompleted)
            )
        )
      : null

  const renderConfirmationCopy = () => {
    const orderConfirmationGuestCheckoutCopy = l`You'll get an order confirmation email shortly to`
    const orderConfirmationCopy = l`You'll get an order confirmation email shortly.`

    return isGuestOrder
      ? orderConfirmationGuestCheckoutCopy
      : orderConfirmationCopy
  }

  const renderDeliveryEstimation = () =>
    deliveryDate && (
      <div className="OrderCompleteDelivery-fields">
        <p className="OrderCompleteDelivery-collectFrom">{l`Your order will be delivered no later than`}</p>
        <PrivacyGuard>
          <p className="OrderCompleteDelivery-estimatedDelivery">
            {deliveryDate}
          </p>
        </PrivacyGuard>
        {isCollectFromOrder && (
          <p className="OrderCompleteDelivery-collectWithin">
            {l`We'll email you when it's ready to collect.`} (
            {l`Please collect within 10 days`})
          </p>
        )}
      </div>
    )

  const renderIcon = () => {
    const icon = path(
      ['icon'],
      deliveryTypes[normaliseDeliveryType(deliveryCarrier)]
    )

    return (
      Boolean(icon) && (
        <div className="OrderCompleteDelivery-deliveryIconContainer">
          <Image
            className="OrderCompleteDelivery-deliveryIcon"
            src={`/assets/${brandName}/images/${icon}?version=${logoVersion}`}
          />
        </div>
      )
    )
  }

  const renderOpeningHoursRow = (day, openingHours) => {
    return openingHours ? (
      <div className="OrderCompleteDelivery-openingHoursRow">
        <span>{`${day}: ${openingHours}`}</span>
      </div>
    ) : null
  }

  const renderStoreDetails = (store) => {
    const { openingHours } = store
    const arrWeekday = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    const weekDays = arrWeekday.every(
      (day) => openingHours[day] === openingHours.friday
    )
      ? renderOpeningHoursRow(l`Monday to Friday`, openingHours.monday)
      : arrWeekday.map((day) =>
          renderOpeningHoursRow(l(day), openingHours[day])
        )

    return openingHours.monday ||
      openingHours.saturday ||
      openingHours.sunday ? (
      <div className="OrderCompleteDelivery--store">
        <div className="OrderCompleteDelivery-openingHoursTitle">
          {minLaptop ? l`Store opening times` : l`Opening hours`}
        </div>
        <span>{weekDays}</span>
        <span>{renderOpeningHoursRow(l`Saturday`, openingHours.saturday)}</span>
        <span>{renderOpeningHoursRow(l`Sunday`, openingHours.sunday)}</span>
      </div>
    ) : null
  }

  const renderCollectFromOption = () => {
    const deliveryStore = getDeliveryStore()
    if (!deliveryStore) return null

    return (
      <div className="OrderCompleteDelivery-storeContainer">
        {renderStoreDetails(deliveryStore)}
      </div>
    )
  }

  return (
    <div className="OrderCompleteDelivery">
      <div className="OrderCompleteDelivery-orderDetailsHeader">
        <h1 className="OrderCompleteDelivery-orderDetailsHeader--item">{l`Thank You For Your Order`}</h1>
      </div>
      <div className="OrderCompleteDelivery-orderDetailsContainer">
        <div className="OrderCompleteDelivery-orderDetails">
          <div className="OrderCompleteDelivery-details">
            <div className="OrderCompleteDelivery-fields">
              <div>
                <span className="OrderCompleteDelivery-field">
                  {l`Order Number`}{' '}
                </span>
                <PrivacyGuard>
                  <span className="OrderCompleteDelivery-orderNumber">
                    {orderId}
                  </span>
                </PrivacyGuard>
              </div>
              <div>
                <span className="OrderCompleteDelivery-confirmationMail">
                  {renderConfirmationCopy()}
                </span>
              </div>
              {isGuestOrder && (
                <span className="OrderCompleteDelivery-guestUserEmail">
                  {guestUserEmail}
                </span>
              )}
            </div>
            {isDDPOrderCompleted && (
              <div>
                <span className="OrderCompleteDelivery-ddpSubscription">
                  {l`You can manage your ${ddpDefaultName} subscription in`}{' '}
                  <Link to={'/my-account'}>{l`My Account.`}</Link>
                </span>
              </div>
            )}
            {!isDDPStandaloneOrderCompleted && renderDeliveryEstimation()}
          </div>
          {!isDDPStandaloneOrderCompleted && (
            <div className="OrderCompleteDelivery-addressContainer">
              <h3 className="OrderCompleteDelivery-addressHeader">{l`Your order will be delivered to`}</h3>
              <div className="OrderCompleteDelivery-address">
                {renderIcon()}
                <div>
                  {addressLines.map((addressLine) => (
                    <div key={addressLine}>
                      <PrivacyGuard>
                        <span>{addressLine}</span>
                      </PrivacyGuard>
                    </div>
                  ))}
                  {isCollectFromOrder && renderCollectFromOption()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

OrderCompleteDelivery.propTypes = {
  brandName: PropTypes.string.isRequired,
  ddpDefaultName: PropTypes.string.isRequired,
  deliveryDate: PropTypes.string.isRequired,
  isDDPStandaloneOrderCompleted: PropTypes.bool.isRequired,
  isCollectFromOrder: PropTypes.bool.isRequired,
  isDDPOrderCompleted: PropTypes.bool.isRequired,
  logoVersion: PropTypes.string.isRequired,
  minLaptop: PropTypes.bool.isRequired,
  orderCompleted: PropTypes.object.isRequired,
  stores: PropTypes.arrayOf(
    PropTypes.shape({
      storeId: PropTypes.string,
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    })
  ).isRequired,
}

OrderCompleteDelivery.contextTypes = {
  l: PropTypes.func,
}

export default OrderCompleteDelivery
