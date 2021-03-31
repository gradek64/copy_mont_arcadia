import Link from '../../common/Link'
import OrderHistoryDetailsElement from './OrderHistoryDetailsElement'
import React from 'react'
import { isEmpty } from 'ramda'

export const StartAReturnButton = ({
  orderReturnUrl = '',
  ctaText = undefined,
}) => {
  return !isEmpty(orderReturnUrl) ? (
    <Link
      isExternal
      target="_blank"
      to={orderReturnUrl}
      rel="noopener noreferrer"
      className={`Button Button--secondary Button--linkButton Button--startReturn`}
    >
      {ctaText}
    </Link>
  ) : (
    <Link
      disabled
      className={`Button Button--secondary Button--linkButton Button--startReturn`}
    >
      {ctaText}
    </Link>
  )
}

export const TrackMyOrderButton = ({
  trackingUrl = undefined,
  ctaText = undefined,
}) => {
  const disabledClassName = !trackingUrl ? 'Button--isDisabled' : 'enabled'

  return (
    <Link
      isExternal
      target="_blank"
      to={trackingUrl}
      rel="noopener noreferrer"
      className={`Button Button--linkButton Button--trackOrder ${disabledClassName}`}
    >
      {ctaText}
    </Link>
  )
}

export const NotYetDispatchedButton = ({ ctaText = undefined }) => {
  return (
    <Link
      isExternal
      rel="noopener noreferrer"
      className="Button Button--linkButton Button--trackOrder Button--isDisabled"
    >
      {ctaText}
    </Link>
  )
}

export const OrderItem = ({ data } = {}) => {
  const {
    item: {
      imageUrl,
      name,
      lineNo,
      size,
      unitPrice,
      wasPrice,
      total,
      quantity,
      isDDPProduct,
      colour,
    },
    key,
  } = data

  return (
    <OrderHistoryDetailsElement
      key={key} // eslint-disable-line react/no-array-index-key
      imageUrl={imageUrl}
      productName={name}
      productCode={lineNo}
      size={size}
      price={unitPrice}
      wasPrice={wasPrice}
      total={total}
      quantity={quantity}
      isDDPProduct={isDDPProduct}
      colour={colour}
    />
  )
}

export const DeliveryDetailsHeader = ({
  deliveryDetails = false,
  deliveryNumber = undefined,
  l = undefined,
  message = undefined,
}) => {
  const { method, date } = deliveryDetails

  return (
    <section className="HistoryDetailsContainer-header">
      <div className="HistoryDetailsContainer-headerCol">
        {deliveryNumber && (
          <p className="HistoryDetailsContainer-orderDeliveryLabel">
            {l`Delivery`} {`${deliveryNumber}`}:
          </p>
        )}
      </div>
      <div className="HistoryDetailsContainer-headerCol">
        <p className="HistoryDetailsContainer-orderStatus">
          {deliveryDetails &&
            method &&
            date && <strong>{`${method} - ${l`Arriving by`} ${date}`}</strong>}
          {message && <span>{message}</span>}
        </p>
      </div>
    </section>
  )
}

export const DdpItems = ({ index = undefined, ddpItems = [] }) => {
  return (
    !!(ddpItems && ddpItems.length) && (
      <div className="order-items-ddp" data-order={index + 1}>
        {ddpItems.map((item, key) => <OrderItem data={{ item, key }} />)}
      </div>
    )
  )
}

export const TrackedItems = ({
  index = undefined,
  orderItems = [],
  isTrackedShipment = undefined,
  l = undefined,
  deliveryMethodHeader = undefined,
}) => {
  return (
    !!isTrackedShipment &&
    orderItems &&
    Object.keys(orderItems).length && (
      <div className="order-items-tracking" data-order={index}>
        {Object.keys(orderItems).map((key, keyIndex) => {
          return (
            <div className="shipment-items" data-shipment-order={keyIndex + 1}>
              {' '}
              {orderItems[key].map((item, _index) => {
                const index = _index + 1
                const shipmentNumber = Object.keys(orderItems).indexOf(key) + 1
                const lastOrderItem = orderItems[key].length
                return (
                  <React.Fragment>
                    {index === 1 && (
                      <DeliveryDetailsHeader
                        deliveryDetails={
                          shipmentNumber === 1 ? deliveryMethodHeader : false
                        }
                        deliveryNumber={shipmentNumber}
                        l={l}
                      />
                    )}
                    <OrderItem data={{ item, key }} />
                    {index === lastOrderItem &&
                      item.retailStoreTrackingUrl && (
                        <TrackMyOrderButton
                          trackingUrl={item.retailStoreTrackingUrl}
                          ctaText={l`TRACK MY ORDER`}
                        />
                      )}
                  </React.Fragment>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  )
}

export const NonTrackedItems = ({
  index = undefined,
  orderItems = [],
  isTrackedShipment = undefined,
  l = undefined,
  showButton = false,
  itemsTracked = undefined,
  deliveryMethod = undefined,
  deliveryDate = undefined,
}) => {
  return (
    !isTrackedShipment &&
    !!(orderItems && orderItems.length) && (
      <div className="order-items-no-tracking" data-shipment-order={index}>
        {itemsTracked ? (
          <DeliveryDetailsHeader
            message={l`Remaining items to be delivered`}
            l={l}
          />
        ) : (
          <DeliveryDetailsHeader
            deliveryDetails={{
              method: deliveryMethod,
              date: deliveryDate,
            }}
            l={l}
          />
        )}
        {orderItems.map((item, key) => <OrderItem data={{ item, key }} />)}
        {showButton && (
          <NotYetDispatchedButton ctaText={l`NOT YET DISPATCHED`} />
        )}
      </div>
    )
  )
}
