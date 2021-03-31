import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Carousel from '../Carousel/Carousel'
import { setCarouselIndex } from '../../../actions/common/carousel-actions'
import { getCarouselSelectedIndex } from '../../../selectors/carouselSelectors'
import {
  IMAGE_SIZES,
  amplienceImagesPropTypes,
} from '../../../constants/amplience'

@connect(
  (state, props) => ({
    initialCarouselIndex: getCarouselSelectedIndex(
      state,
      props.sourceCarouselName
    ),
  }),
  { setCarouselIndex }
)
class ImageOverlay extends Component {
  static propTypes = {
    assets: PropTypes.array,
    amplienceImages: amplienceImagesPropTypes,
    setCarouselIndex: PropTypes.func,
    isFeatureCarouselThumbnailEnabled: PropTypes.bool,
  }

  static defaultProps = {
    assets: [],
    amplienceImages: [],
    setCarouselIndex: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      imageOverlayStyles: {},
    }
    this.delay = null
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateImageOverlayStyles)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateImageOverlayStyles)
  }

  updateImageOverlayStyles = () => {
    // Force styles to update when browser is re-sized
    clearTimeout(this.delay)
    this.setState({
      imageOverlayStyles: { display: 'none' },
    })
    this.delay = setTimeout(() => {
      this.setState({
        imageOverlayStyles: {},
      })
    }, 50)
  }

  gotoImage = (index) => {
    const { setCarouselIndex } = this.props
    setCarouselIndex('overlayCarousel', index)
  }

  render() {
    const {
      assets,
      isFeatureCarouselThumbnailEnabled,
      amplienceImages,
      initialCarouselIndex,
    } = this.props

    return (
      <div className="ImageOverlay" style={this.state.imageOverlayStyles}>
        {isFeatureCarouselThumbnailEnabled && (
          <Carousel
            name="overlayThumbs"
            mode="thumbnail"
            onClick={this.gotoImage}
            amplienceImages={amplienceImages}
            sizes={IMAGE_SIZES.thumbnails}
            assets={assets.filter((asset) => asset.assetType === 'IMAGE_SMALL')}
            initialIndex={initialCarouselIndex}
          />
        )}
        <Carousel
          name="overlayCarousel"
          className="Carousel--overlay"
          mode="modal-carousel"
          style={this.state.styles}
          amplienceImages={amplienceImages}
          sizes={IMAGE_SIZES.overlayLarge}
          assets={assets.filter((asset) => asset.assetType === 'IMAGE_LARGE')}
          initialIndex={initialCarouselIndex}
        />
      </div>
    )
  }
}

export default ImageOverlay
