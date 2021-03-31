import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import DynamicGoogleMap from './DynamicGoogleMap'
import {
  initMapWhenGoogleMapsAvailable,
  signStaticMapsUrl,
  loadGoogleMapScript,
} from '../../../actions/components/StoreLocatorActions'
import Loader from '../Loader/Loader'
import { latLngOrMarkersHaveChanged } from '../../../lib/google-utils'

@connect(
  () => ({}),
  {
    initMapWhenGoogleMapsAvailable,
    loadGoogleMapScript,
    signStaticMapsUrl,
  }
)
class GoogleMap extends Component {
  static propTypes = {
    borderless: PropTypes.bool,
    initMapWhenGoogleMapsAvailable: PropTypes.func,
    loadGoogleMapScript: PropTypes.func,
    className: PropTypes.string,
    currentLat: PropTypes.number,
    currentLng: PropTypes.number,
    markers: PropTypes.array,
    dimensions: PropTypes.object,
    iconDomain: PropTypes.string,
    zoom: PropTypes.number,
  }

  state = {
    isMapStatic: true,
    fallback: false,
    url: '',
    signature: '',
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  static defaultProps = {
    className: '',
  }

  componentDidMount() {
    const {
      currentLat,
      currentLng,
      markers,
      iconDomain,
      zoom,
      dimensions,
      signStaticMapsUrl,
    } = this.props
    if (dimensions && dimensions.width && dimensions.height) {
      signStaticMapsUrl(
        {
          currentLat,
          currentLng,
          markers,
          dimensions,
          iconDomain,
          zoom,
        },
        ({ url, signature }) =>
          this.setState({
            url,
            signature,
          })
      )
    }
  }

  componentDidUpdate(prevProps) {
    const {
      currentLat,
      currentLng,
      markers,
      iconDomain,
      zoom,
      dimensions,
      signStaticMapsUrl,
    } = this.props
    if (latLngOrMarkersHaveChanged(this.props, prevProps)) {
      signStaticMapsUrl(
        {
          currentLat,
          currentLng,
          markers,
          dimensions,
          iconDomain,
          zoom,
        },
        ({ url, signature }) =>
          this.setState({
            url,
            signature,
          })
      )
    }
  }

  switchToDynamicMap = () => {
    // Loader
    this.props.loadGoogleMapScript().finally(() => {
      this.setState({ isMapStatic: false })
    })
  }

  getMapError = () => {
    this.setState({
      fallback: true,
    })
  }

  renderMapImg = (url, l) => (
    <div
      className="GoogleMap--staticMap"
      tabIndex={0}
      role="button"
      onClick={() => this.switchToDynamicMap()}
    >
      {url ? (
        <img alt={l`static map`} src={url} onError={this.getMapError} />
      ) : (
        <Loader />
      )}
    </div>
  )

  render() {
    const { l } = this.context
    const { borderless, className, initMapWhenGoogleMapsAvailable } = this.props
    const classNames = classnames('GoogleMap', className, {
      'GoogleMap--borderless': borderless,
    })
    const { isMapStatic, fallback, url, signature } = this.state
    const mapUrl = fallback ? url : signature

    return (
      <div className={classNames}>
        {isMapStatic ? (
          this.renderMapImg(mapUrl, l)
        ) : (
          <DynamicGoogleMap
            initMapWhenGoogleMapsAvailable={initMapWhenGoogleMapsAvailable}
          />
        )}
      </div>
    )
  }
}

export default GoogleMap
