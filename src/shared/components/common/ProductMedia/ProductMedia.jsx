import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Carousel from '../../common/Carousel/Carousel'
import ProductVideo from '../../common/ProductVideo/ProductVideo'
import {
  IMAGE_SIZES,
  amplienceAssetsPropTypes,
  amplienceAssetsDefaultProps,
} from '../../../constants/amplience'

export default class ProductMedia extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    productId: PropTypes.number.isRequired,
    assets: PropTypes.array.isRequired,
    className: PropTypes.string,
    enableVideo: PropTypes.bool,
    enableImageOverlay: PropTypes.bool,
    amplienceAssets: amplienceAssetsPropTypes,
  }

  static defaultProps = {
    className: '',
    enableVideo: false,
    enableImageOverlay: false,
    amplienceAssets: amplienceAssetsDefaultProps,
  }

  state = {
    isVideoPlaying: false,
  }

  play = (enabled = !this.state.isVideoPlaying) => {
    this.setState({
      isVideoPlaying: enabled,
    })
  }

  render() {
    const {
      name,
      assets,
      enableVideo,
      enableImageOverlay,
      className,
      amplienceAssets,
      productId,
    } = this.props
    const video =
      enableVideo && assets.find((asset) => asset.assetType === 'VIDEO')
    const { isVideoPlaying } = this.state

    return (
      <div className={className}>
        <Carousel
          className={video ? 'Carousel--withVideo' : 'Carousel-imageCarousel'}
          name={name}
          imageOverlayAssets={assets}
          assets={assets.filter((asset) => asset.assetType === 'IMAGE_LARGE')}
          isHidden={isVideoPlaying}
          amplienceImages={amplienceAssets.images}
          sizes={IMAGE_SIZES.productMedia}
          enableImageOverlay={enableImageOverlay}
          useProgressiveJPG
          productId={productId}
        />
        {video && (
          <ProductVideo
            className="productVideo"
            videoUrl={video.url}
            amplienceVideo={amplienceAssets.video}
            isVideoPlaying={isVideoPlaying}
            play={this.play}
          />
        )}
      </div>
    )
  }
}
