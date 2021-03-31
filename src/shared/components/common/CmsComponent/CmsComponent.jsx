import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImageList from '../ImageList/ImageList'
import Carousel from '../Carousel/Carousel'
import * as carouselActions from '../../../actions/common/carousel-actions'
import removeProtocol from '../../../../shared/lib/remove-http'
import { resizeIframe } from '../../../../shared/lib/cmslib'

export const cmsTypes = ['imagelist', 'carousel', 'video', 'iframe', 'html']

@connect(
  (state) => ({
    viewportHeight: state.viewport.height,
    lang: state.config.lang,
    hash: state.routing.location.hash,
  }),
  carouselActions
)
class CmsComponent extends Component {
  static propTypes = {
    initCarousel: PropTypes.func.isRequired,
    type: PropTypes.string,
    data: PropTypes.object.isRequired,
    name: PropTypes.string,
    viewportHeight: PropTypes.number,
    lang: PropTypes.string,
    hash: PropTypes.string,
  }

  UNSAFE_componentWillMount() {
    const { initCarousel, type, data, name } = this.props

    if (type === 'carousel' && data && data.assets) {
      const assets = (data && data.assets) || []
      initCarousel(name, assets.length)
    }
  }

  setClassName(component) {
    const {
      data: { className },
    } = this.props
    return `CmsComponent CmsComponent--${component}${
      className ? ` CmsComponent-${className}` : ''
    }`
  }

  renderImageList({ columns, assets, options }) {
    return (
      <div className={this.setClassName('imageList')}>
        <ImageList
          columns={columns}
          images={assets}
          margin={options && options.margin}
        />
      </div>
    )
  }

  renderCarousel(data) {
    if (!data.assets || !Array.isArray(data.assets)) return null

    const { name } = this.props
    const assets = data.assets.map((asset) => ({
      ...asset,
      url: asset.source,
    }))
    // We receive autoplay as a string value from the CMS, therefore we have to convert it to a boolean value.
    const autoplay = data.options && data.options.autoplay === 'true'
    const arrowColor = data.options && data.options.arrow
    return (
      <div
        className={this.setClassName('carousel')}
        style={{ margin: data.options && data.options.margin }}
      >
        <Carousel
          mode="cmsContent"
          lazyLoad
          assets={assets}
          autoplay={autoplay}
          name={name}
          arrowColor={arrowColor}
        />
      </div>
    )
  }

  renderVideo({ source, poster, youtube, margin, caption }) {
    const { lang } = this.props
    if (!source && !youtube) return null

    return (
      <div style={{ margin }} className={this.setClassName('videoContainer')}>
        {youtube ? (
          <iframe
            className="CmsComponent-video CmsComponent-youtube"
            src={`${removeProtocol(
              youtube
            )}?rel=0&amp;controls=0&amp;showinfo=0`}
            frameBorder="0"
            allowFullScreen
          />
        ) : (
          <video
            src={removeProtocol(source)}
            poster={poster}
            controls
            preload="none"
            className="CmsComponent-video"
          >
            {caption && <track kind="subtitles" srcLang={lang} src={caption} />}
          </video>
        )}
      </div>
    )
  }

  renderIframe({ source, height, margin }) {
    if (!source) return null
    const { viewportHeight, hash } = this.props

    source = `${removeProtocol(source.replace(/&amp;/g, '&'))}${
      source.includes('#') ? '' : hash
    }`

    return (
      <iframe
        ref={(el) => resizeIframe(el, viewportHeight)}
        src={source}
        height={height}
        style={{ margin }}
        className={this.setClassName('iframe')}
        frameBorder="0"
      />
    )
  }

  renderHtml({ markup, margin }) {
    return (
      <div
        style={{ margin }}
        className={this.setClassName('html')}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    )
  }

  render() {
    const { type, data } = this.props

    const renderFn = {
      imagelist: () => this.renderImageList(data),
      carousel: () => this.renderCarousel(data),
      video: () => this.renderVideo(data),
      iframe: () => this.renderIframe(data),
      html: () => this.renderHtml(data),
    }

    return renderFn[type] ? renderFn[type]() : null
  }
}

export default CmsComponent
