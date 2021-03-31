import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Image from '../../common/Image/Image'
import { path } from 'ramda'
import { heDecode } from '../../../lib/html-entities'
import storeHostMap from '../../../../server/api/hostsConfig/store_host_map.json'

const IS_ABSOLUTE_URL = /^(https?:)?\/\//i

@connect(
  (state) => ({
    apiEnvironment: state.debug.environment,
    storeCode: state.config.storeCode,
    location: state.routing.location,
  }),
  null
)
class ImageContainer extends Component {
  static propTypes = {
    subcategory: PropTypes.object,
    className: PropTypes.string,
    apiEnvironment: PropTypes.string,
    storeCode: PropTypes.string,
  }

  static defaultProps = {
    subcategory: {},
    apiEnvironment: 'prod',
  }

  getImageSrc = (subcategory, apiEnvironment, storeCode, storeHostMap) => {
    const { url } = subcategory.image
    if (IS_ABSOLUTE_URL.test(url)) {
      return url
    }
    const envPath = [apiEnvironment, storeCode]
    const host = path(envPath, storeHostMap)
    return `${host}${url}`
  }

  getStyles = (subcategory) => {
    // paddingTop must be a number and not a string
    const paddingTop = Number(subcategory.paddingTop) || 0
    return { paddingTop }
  }

  render() {
    const {
      props: { subcategory, className, apiEnvironment, storeCode },
      getImageSrc,
      getStyles,
    } = this

    return (
      <div className={className}>
        <Image
          className="MegaNav-image"
          lazyLoad
          src={getImageSrc(
            subcategory,
            apiEnvironment,
            storeCode,
            storeHostMap
          )}
          alt={heDecode(subcategory.label)}
          style={getStyles(subcategory)}
        />
      </div>
    )
  }
}

export default ImageContainer
