import PropTypes from 'prop-types'
import React from 'react'
import { browserHistory, Link } from 'react-router'
import Button from '../Button/Button'
import { TYPE } from '../../containers/OrderListContainer/types'

const AccountHeader = ({
  link,
  label,
  title,
  classNames,
  onLinkClick,
  type,
  l,
}) => {
  const classes = classNames
    ? `AccountHeader-row ${classNames}`
    : 'AccountHeader-row'

  return (
    <section className="AccountHeader">
      <div className="AccountHeader-navigation">
        <Link to={link} onClick={onLinkClick} className="NoLink">
          <p className="AccountHeader-back">{label}</p>
        </Link>
      </div>
      <div className={classes}>
        <div className="AccountHeader-title">
          <h1>{title}</h1>
        </div>
        {type === TYPE.RETURN && (
          <div className="AccountHeader-action">
            <p>{l`Looking to return an item?`}</p>
            <Button
              className="Button--secondary"
              clickHandler={() =>
                browserHistory.push('/my-account/order-history')
              }
            >
              {l`View Orders & Start A Return`}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

AccountHeader.propTypes = {
  label: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  classNames: PropTypes.string,
  type: PropTypes.string,
  l: PropTypes.func,
}

export default AccountHeader
