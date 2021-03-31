import PropTypes from 'prop-types'
import React from 'react'
import classnames from 'classnames'

const renderBillingDetailsItems = (items) => {
  return items.map(([key, value]) => (
    <div key={key}>
      <dt className="AddressPreview-detailsTerm">{key}</dt>
      <dd className="AddressPreview-detailsDescription">{value}</dd>
    </div>
  ))
}

const AddressPreview = (
  { onClickChangeButton, address, details, heading, rightAlignedButton },
  { l }
) => {
  const { address1, address2, city, country, postcode, state } = address
  const { firstName, lastName, title } = details
  const billingDetailsItems = [
    ['Title', `${title} ${firstName || ''} ${lastName || ''}`],
    ['Address Line 1', address1],
    ['Address Line 2', address2],
    ['City', city],
    ['Postcode', postcode],
    ['Country', country],
    ['State', state],
  ]

  const buttonClassNames = classnames(
    'Button',
    'Button--secondary',
    'AddressPreview-button',
    { 'AddressPreview-button--rightAligned': rightAlignedButton }
  )

  return (
    <div className="AddressPreview">
      <div className="AddressPreview-col">
        {heading && (
          <h4 className="AddressPreview-header">{l`Billing address`}</h4>
        )}
        <dl className="AddressPreview-details">
          {renderBillingDetailsItems(billingDetailsItems)}
        </dl>
        <button className={buttonClassNames} onClick={onClickChangeButton}>
          {l`Change`}
        </button>
      </div>
    </div>
  )
}

AddressPreview.propTypes = {
  address: PropTypes.shape({
    address1: PropTypes.string,
    address2: PropTypes.string,
    city: PropTypes.string,
    country: PropTypes.string,
    postcode: PropTypes.string,
    state: PropTypes.string,
  }),
  details: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    title: PropTypes.string,
  }),
  onClickChangeButton: PropTypes.func.isRequired,
  heading: PropTypes.bool,
  rightAlignedButton: PropTypes.bool,
}

AddressPreview.defaultProps = {
  heading: false,
  rightAlignedButton: false,
}

AddressPreview.contextTypes = {
  l: PropTypes.func,
}

export default AddressPreview
