import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Image from '../Image/Image'

import { error as reportError } from '../../../../server/lib/logger'

class ProductAttributeBanner extends PureComponent {
  static propTypes = {
    src: PropTypes.string.isRequired,
    productURL: PropTypes.string.isRequired,
    isFeatureLogBadAttributeBannersEnabled: PropTypes.bool,
  }

  state = {
    hasError: false,
  }

  UNSAFE_componentWillReceiveProps({ src }) {
    if (this.props.src !== src) {
      this.setState({
        hasError: false,
      })
    }
  }

  handleError = () => {
    if (this.props.isFeatureLogBadAttributeBannersEnabled) {
      reportError('Failed to load attribute banner', {
        message: 'Failed to load attribute banner',
        src: this.props.src,
        location: window.location.href,
        productURL: this.props.productURL,
      })
    }

    this.setState({
      hasError: true,
    })
  }

  render() {
    const { src } = this.props
    const { hasError } = this.state

    if (hasError) return null

    return (
      <Image
        className={`ProductAttributeBanner`}
        src={src}
        onError={this.handleError}
      />
    )
  }
}

export default ProductAttributeBanner
