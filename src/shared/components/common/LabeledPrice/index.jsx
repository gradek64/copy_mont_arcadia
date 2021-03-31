import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import Price from '../Price/Price'

const LabeledPrice = ({
  rrp,
  wasWasPrice,
  wasPrice,
  regPrice,
  brandName,
  l,
}) => {
  const price = rrp || wasWasPrice || wasPrice || regPrice
  let label = ''
  if (rrp) label = 'RRP'
  if (wasWasPrice || wasPrice) label = 'Was'
  if (regPrice) label = 'Now'
  if (brandName === 'dorothyperkins' || brandName === 'burton') label = ''

  return (
    <span
      className={cn({
        'HistoricalPrice-old': !regPrice,
        'HistoricalPrice-rrp': rrp,
        'HistoricalPrice-wasWas': wasWasPrice,
        'HistoricalPrice-was': wasPrice,
        'HistoricalPrice-promotion': regPrice,
      })}
    >
      {/* eslint-disable-next-line  */}
      {l`${label}`} <Price price={price} />
    </span>
  )
}

LabeledPrice.propTypes = {
  rrp: PropTypes.string,
  wasWasPrice: PropTypes.string,
  wasPrice: PropTypes.string,
  regPrice: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  l: PropTypes.func.isRequired,
}

export default LabeledPrice
