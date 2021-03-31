import PropTypes from 'prop-types'
import classnames from 'classnames'
import React from 'react'

const CheckoutSubPrimaryTitle = ({ title, subTitle }) => {
  return (
    <span
      className={classnames('CheckoutSubPrimaryTitle', {
        'CheckoutSubPrimaryTitle-withSubTitle': subTitle,
      })}
    >
      <span className={'CheckoutSubPrimaryTitle--title'}>{title}</span>
      {subTitle && (
        <span className={'CheckoutSubPrimaryTitle--subTitle'}>{subTitle}</span>
      )}
    </span>
  )
}

CheckoutSubPrimaryTitle.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
}

export default CheckoutSubPrimaryTitle
