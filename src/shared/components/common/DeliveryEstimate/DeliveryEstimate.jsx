import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { none, isEmpty, isNil, defaultTo, pathOr, pick, values } from 'ramda'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Image from '../../common/Image/Image'
import { normaliseEstimatedDeliveryDate } from '../../../lib/checkout-utilities/order-summary'
import { isGuestOrder } from '../../../selectors/checkoutSelectors'

const defaultToEmptyStr = defaultTo('')

@connect((state) => ({
  brandName: state.config.brandName,
  language: state.config.language,
  isGuestOrder: isGuestOrder(state),
}))
class DeliveryEstimate extends Component {
  static propTypes = {
    brandName: PropTypes.string.isRequired,
    className: PropTypes.string,
    deliveryType: PropTypes.string.isRequired,
    shippingInfo: PropTypes.shape({
      label: PropTypes.string.isRequired,
      deliveryType: PropTypes.string.isRequired,
      shipModeId: PropTypes.number.isRequired,
      additionalDescription: PropTypes.string,
      cost: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      nominatedDate: PropTypes.string,
      dayText: PropTypes.string,
      dateText: PropTypes.string,
      estimatedDelivery: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    address: PropTypes.shape({
      title: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      telephone: PropTypes.string,
      address1: PropTypes.string,
      address2: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      country: PropTypes.string,
      postcode: PropTypes.string,
      county: PropTypes.string,
    }),
    shouldDisplayAddress: PropTypes.bool,
    language: PropTypes.string,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    shouldDisplayAddress: true,
    language: 'en-GB',
  }

  addressExists = (address) =>
    none(
      isNil,
      values(pick(['firstName', 'address1', 'city', 'postcode'], address))
    )

  formatNominatedDate(deliveryDate) {
    const { language } = this.props
    const date = new Date(deliveryDate)
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return date.toLocaleString(language, options).replace(/,/g, '')
  }

  // WCS has two shipping types under HOME_EXPRESS
  // 'Nominated Delivery': exclusively uses nominatedDate, a day of the week chosen by the customer.
  // 'Tracked and Faster': exclusively uses estimatedDelivery, a date estimated by the system.
  //
  // It can be assumed that if the nominated date isn't provided then the shipping
  // method is 'Tracked and Faster' and carries an estimated delivery date.
  homeExpressDataLabel({ nominatedDate, estimatedDelivery }) {
    return nominatedDate
      ? this.formatNominatedDate(nominatedDate)
      : normaliseEstimatedDeliveryDate(defaultToEmptyStr(estimatedDelivery))
  }

  createDataLabel({
    homeExpressDeliverySelected,
    nominatedDate,
    estimatedDelivery,
  }) {
    return homeExpressDeliverySelected
      ? this.homeExpressDataLabel({ nominatedDate, estimatedDelivery })
      : normaliseEstimatedDeliveryDate(defaultToEmptyStr(estimatedDelivery))
  }

  renderDate() {
    const {
      shippingInfo: { deliveryType, nominatedDate, estimatedDelivery },
    } = this.props
    const { l } = this.context
    const homeExpressDeliverySelected = deliveryType === 'HOME_EXPRESS'

    const nominatedDateMissing = isNil(nominatedDate) || isEmpty(nominatedDate)
    const estimatedDeliveryDateMissing =
      isNil(estimatedDelivery) || isEmpty(estimatedDelivery)

    const dateMissing = homeExpressDeliverySelected
      ? nominatedDateMissing && estimatedDeliveryDateMissing
      : estimatedDeliveryDateMissing

    if (dateMissing) return null

    const dateLabel = this.createDataLabel({
      homeExpressDeliverySelected,
      nominatedDate,
      estimatedDelivery: pathOr('', 0, estimatedDelivery),
    })

    return (
      <div className="DeliveryEstimate-label">
        {l`Your order will be delivered no later than`}{' '}
        <span className="DeliveryEstimate-dateLabel">{dateLabel}</span>
      </div>
    )
  }

  renderAddressTitle = () => {
    const { brandName, deliveryType, isGuestOrder } = this.props
    const { l } = this.context
    const deliveryIconSrc = {
      HOME: `/assets/${brandName}/images/lorry-icon.svg`,
      STORE: `/assets/${brandName}/images/arcadia-store-icon.svg`,
      PARCELSHOP: `/assets/${brandName}/images/hermes-icon.svg`,
    }
    const changeDeliveryUrl = isGuestOrder
      ? '/guest/checkout/delivery'
      : '/checkout/delivery'

    return (
      <div className="DeliveryEstimate-title">
        <div className="DeliveryEstimate-groupLeft">
          <Image
            className="DeliveryEstimate-deliveryImage"
            src={deliveryIconSrc[deliveryType]}
          />
          <h3 className="DeliveryEstimate-deliveryTitle">{l`Delivery`}</h3>
        </div>
        <Link
          className="DeliveryEstimate-link"
          to={changeDeliveryUrl}
        >{l`Change`}</Link>
      </div>
    )
  }

  render() {
    const { address, shouldDisplayAddress, className } = this.props
    const {
      title,
      firstName,
      lastName,
      address1,
      city,
      postcode,
      country,
    } = this.props.address

    const name = `${title} ${firstName} ${lastName}`

    return (
      <div
        className={`DeliveryEstimate${
          className ? ` DeliveryEstimate--${className}` : ''
        }`}
      >
        {this.addressExists(address) &&
          shouldDisplayAddress && (
            <div className="DeliveryEstimate-address">
              {this.renderAddressTitle()}
              <div className="DeliveryEstimate-addressDetails">
                <div className="DeliveryEstimate-address--line">{name}</div>
                <div className="DeliveryEstimate-address--line">{address1}</div>
                <div className="DeliveryEstimate-address--line">{city}</div>
                <div className="DeliveryEstimate-address--line">{postcode}</div>
                <div className="DeliveryEstimate-address--line">{country}</div>
              </div>
            </div>
          )}
        {this.renderDate()}
      </div>
    )
  }
}

export default DeliveryEstimate
