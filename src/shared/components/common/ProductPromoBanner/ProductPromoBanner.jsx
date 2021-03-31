import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Image from '../Image/Image'
import { error as reportError } from '../../../../server/lib/logger'

class ProductPromoBanner extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    productURL: PropTypes.string.isRequired,
    isFeatureLogBadAttributeBannersEnabled: PropTypes.bool,
  }

  static defaultProps = {
    isFeatureLogBadAttributeBannersEnabled: false,
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
    const { productURL, src } = this.props

    if (this.props.isFeatureLogBadAttributeBannersEnabled) {
      reportError('Failed to load attribute banner', {
        message: 'Failed to load attribute banner',
        location: window.location.href,
        src,
        productURL,
      })
    }

    this.setState({ hasError: true })
  }

  render() {
    return (
      <div className="ProductPromoBanner">
        {!this.state.hasError && (
          <Image
            className="ProductPromoBanner-image"
            src={this.props.src}
            onError={this.handleError}
          />
        )}
      </div>
    )
  }
}

export default ProductPromoBanner
