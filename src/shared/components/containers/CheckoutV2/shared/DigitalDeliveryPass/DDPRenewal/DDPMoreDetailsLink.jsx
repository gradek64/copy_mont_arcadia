import React from 'react'
import { Link } from 'react-router'
import PropTypes from 'prop-types'

const landingPagesForDDP = {
  tsuk: '/en/tsuk/category/topshop-premier-8994768/home',
  tmuk: '/en/tmuk/category/topman-premier-8995089/home',
  dpuk: '/en/dpuk/category/digital-delivery-pass-8069175/home',
  msuk: '/en/msuk/category/miss-s-unlimited-8073836/home',
  bruk: '/en/bruk/category/ddp-8068633/home',
  wluk: '/en/wluk/category/unlimited-delivery-8036879/home',
  evuk: '/en/evuk/category/unlimited-delivery-8060594/home?TS=1566400554634',
}

const DDPMoreDetailsLink = ({ storeCode }) => {
  if (!landingPagesForDDP[storeCode]) return null
  return (
    <Link
      className="DDPMoreDetailsLink"
      to={landingPagesForDDP[storeCode]}
      target="_blank"
    >
      More details
    </Link>
  )
}

DDPMoreDetailsLink.propTypes = {
  storeCode: PropTypes.string.isRequired,
}

export default DDPMoreDetailsLink
