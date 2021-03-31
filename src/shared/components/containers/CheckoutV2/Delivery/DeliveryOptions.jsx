import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

const buttonClassName = (isLocationSelected) => {
  return classnames('DeliveryOption-content', {
    'DeliveryOption-content--selected': isLocationSelected,
  })
}

const DeliveryOptions = (
  { deliveryLocations, onChangeDeliveryLocation },
  { l }
) => (
  <article className="DeliveryOptions" aria-label="Delivery Location Options">
    {deliveryLocations.map((location) => (
      <div
        className={`DeliveryOption DeliveryOption--${location.deliveryLocationType.toLowerCase()}`}
        key={location.deliveryLocationType}
      >
        <button
          className={buttonClassName(location.selected)}
          onClick={onChangeDeliveryLocation.bind(null, location)}
          disabled={!location.enabled}
        >
          <span className="DeliveryOption-title h3">{l(location.title)}</span>
          <span className="DeliveryOption-description">
            {l(location.description)}
          </span>
          <span className="DeliveryOption-additionalDescription">
            {l(location.additionalDescription)}
          </span>
        </button>
      </div>
    ))}
  </article>
)

DeliveryOptions.propTypes = {
  deliveryLocations: PropTypes.arrayOf(
    PropTypes.shape({
      deliveryLocationType: PropTypes.string.isRequired,
      selected: PropTypes.boolean,
      label: PropTypes.string,
      iconUrl: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.description,
      additionalDescription: PropTypes.string.description,
      enabled: PropTypes.boolean,
    })
  ),
  onChangeDeliveryLocation: PropTypes.func,
}

DeliveryOptions.contextTypes = {
  l: PropTypes.func,
}

export default DeliveryOptions
