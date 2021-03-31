import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as carouselActions from '../../../actions/common/carousel-actions'
import { showModal } from '../../../actions/common/modalActions'
import { isFeatureCarouselThumbnailEnabled } from '../../../selectors/featureSelectors'
import { getRoutePath } from '../../../selectors/routingSelectors'
import {
  imageSizesPropTypes,
  amplienceImagesPropTypes,
} from '../../../constants/amplience'
import {
  sendAnalyticsClickEvent,
  GTM_CATEGORY,
  GTM_ACTION,
} from '../../../analytics'

import CarouselNormal from './CarouselNormal'
import CarouselFlat from './CarouselFlat'
import CarouselThumbnail from './CarouselThumbnail'
import CarouselPanel from './CarouselPanel'
import ImageOverlay from '../../common/ImageOverlay/ImageOverlay'

@connect(
  (state) => ({
    carousel: state.carousel,
    isMobile: state.viewport.media === 'mobile',
    touchEnabled: state.viewport.touch,
    isFeatureCarouselThumbnailEnabled: isFeatureCarouselThumbnailEnabled(state),
    routePath: getRoutePath(state),
  }),
  { ...carouselActions, showModal, sendAnalyticsClickEvent }
)
class Carousel extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    mode: PropTypes.string,
    className: PropTypes.string,
    carousel: PropTypes.object,
    initCarousel: PropTypes.func.isRequired,
    backCarousel: PropTypes.func,
    forwardCarousel: PropTypes.func,
    assets: PropTypes.array,
    amplienceImages: amplienceImagesPropTypes,
    sizes: imageSizesPropTypes,
    imageOverlayAssets: PropTypes.array,
    type: PropTypes.string,
    enableImageOverlay: PropTypes.bool,
    sendAnalyticsClickEvent: PropTypes.func.isRequired,
    routePath: PropTypes.string.isRequired,
    useProgressiveJPG: PropTypes.bool,
    initialIndex: PropTypes.number,
  }

  static defaultProps = {
    enableImageOverlay: false,
    assets: [],
    amplienceImages: [],
    imageOverlayAssets: [],
    mode: '',
    className: '',
    sizes: null,
    useProgressiveJPG: false,
    initialIndex: 0,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  componentDidMount() {
    const { assets, initCarousel, name, initialIndex } = this.props

    if (assets instanceof Array) {
      initCarousel(name, assets.length, initialIndex || 0)
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const prevProps = this.props
    if (
      prevProps.productId !== nextProps.productId ||
      nextProps.assets.length !== prevProps.assets.length
    )
      prevProps.initCarousel(
        nextProps.name,
        nextProps.assets.length,
        nextProps.initialIndex
      )
  }

  handleSwipe = (e) => {
    const { forwardCarousel, backCarousel, name, carousel, assets } = this.props

    if (carousel[name].zoom === 1 && assets.length > 1) {
      if (e.direction === 2) {
        forwardCarousel(name)
      } else if (e.direction === 4) {
        backCarousel(name)
      }
    }
  }

  showImageOverlay = () => {
    const {
      isMobile,
      enableImageOverlay,
      imageOverlayAssets,
      showModal,
      isFeatureCarouselThumbnailEnabled,
      amplienceImages,
      sendAnalyticsClickEvent,
      routePath,
      name,
    } = this.props

    if (!isMobile && enableImageOverlay) {
      sendAnalyticsClickEvent({
        category: GTM_CATEGORY.PDP,
        action: GTM_ACTION.IMAGE_OVERLAY,
        label: routePath,
      })
      showModal(
        <ImageOverlay
          assets={imageOverlayAssets}
          amplienceImages={amplienceImages}
          isFeatureCarouselThumbnailEnabled={isFeatureCarouselThumbnailEnabled}
          sourceCarouselName={name}
        />,
        { mode: 'imageCarousel' }
      )
    }
  }

  render() {
    const { mode, carousel, name } = this.props
    if (!carousel[name]) return null

    // using switch causes unit test errors, so falling back on if/else
    if (mode === 'flat') {
      return (
        <CarouselFlat
          handleSwipe={this.handleSwipe}
          onClick={this.showImageOverlay}
          {...this.props}
        />
      )
    } else if (mode === 'thumbnail') {
      return (
        <CarouselThumbnail
          handleSwipe={this.handleSwipe}
          onClick={this.showImageOverlay}
          {...this.props}
        />
      )
    } else if (mode === 'panel') {
      return (
        <CarouselPanel
          handleSwipe={this.handleSwipe}
          onClick={this.showImageOverlay}
          {...this.props}
        />
      )
    }

    return (
      <CarouselNormal
        showcase={mode !== 'nodes'}
        handleSwipe={this.handleSwipe}
        onClick={this.showImageOverlay}
        {...this.props}
      />
    )
  }
}

export default Carousel
