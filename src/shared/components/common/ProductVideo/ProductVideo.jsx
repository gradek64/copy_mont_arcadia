import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Image from '../../common/Image/Image'
import PlayVideoButton from '../../common/PlayVideoButton/PlayVideoButton'
import FeatureCheck from '../../common/FeatureCheck/FeatureCheck'
import { isAmplienceFeatureEnabled } from '../../../selectors/featureSelectors'

import { VIDEO_FORMAT, VIDEO_SIZE } from '../../../constants/amplience'

@connect(
  (state) => ({
    isAmplienceEnabled: isAmplienceFeatureEnabled(state),
  }),
  {}
)
class ProductVideo extends Component {
  static propTypes = {
    className: PropTypes.string,
    videoUrl: PropTypes.string.isRequired,
    play: PropTypes.func.isRequired,
    isVideoPlaying: PropTypes.bool,
    isAmplienceEnabled: PropTypes.bool.isRequired,
    amplienceVideo: PropTypes.string,
  }

  static defaultProps = {
    className: '',
    isVideoPlaying: false,
    amplienceVideo: '',
  }

  componentDidMount() {
    if (this.video) {
      this.video.setAttribute('controlsList', 'nodownload')
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { isVideoPlaying } = this.props
    const { isVideoPlaying: nextIsVideoPlaying } = nextProps

    if (!isVideoPlaying && nextIsVideoPlaying) {
      this.playVideo()
    }

    if (isVideoPlaying && !nextIsVideoPlaying) {
      this.stopVideo()
    }
  }

  playVideo = () => {
    this.video.play()
  }

  stopVideo = () => {
    this.video.pause()
    this.video.currentTime = 0
  }

  render() {
    const {
      className,
      play,
      videoUrl,
      isVideoPlaying,
      isAmplienceEnabled,
      amplienceVideo,
    } = this.props
    const hideClass = isVideoPlaying ? '' : 'is-hidden'
    const video = isAmplienceEnabled
      ? `${amplienceVideo}/${VIDEO_FORMAT}_${VIDEO_SIZE}`
      : videoUrl

    return (
      <FeatureCheck flag="FEATURE_PRODUCT_VIDEO">
        <div>
          <div className="productVideoContainer">
            <div className={`ProductVideo ${className} ${hideClass}`}>
              <button
                className="ProductVideo-closeWrapper"
                onClick={() => {
                  play(false)
                }}
              >
                <Image
                  className="ProductVideo-close"
                  alt="Close Video"
                  src={'/assets/{brandName}/images/cancel.svg'}
                />
              </button>
              <div className="ProductVideo-container">
                <video
                  className="ProductVideo-video"
                  controls
                  muted
                  autoPlay
                  loop
                  ref={(element) => {
                    this.video = element
                  }}
                >
                  <source src={video} />
                </video>
              </div>
            </div>
          </div>
          <PlayVideoButton
            className="productVideoCTA Button--secondary"
            clickHandler={play}
            isVideoPlaying={isVideoPlaying}
          />
        </div>
      </FeatureCheck>
    )
  }
}

export default ProductVideo
