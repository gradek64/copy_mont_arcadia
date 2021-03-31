import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class DynamicGoogleMap extends Component {
  state = {
    error: false,
  }

  static propTypes = {
    initMapWhenGoogleMapsAvailable: PropTypes.func.isRequired,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  reloadBrowser = () => {
    window.location.reload()
  }

  componentDidMount() {
    const { initMapWhenGoogleMapsAvailable } = this.props
    initMapWhenGoogleMapsAvailable().catch(() => {
      this.setState({ error: true })
    })
  }

  render() {
    const { l } = this.context
    // the dynamic map is rendered by google dynamically and appended
    // into the dom beneath the node with the class set to GoogleMap-map
    return (
      <div className="GoogleMap-map">
        {this.state.error && (
          <div className="GoogleMap-error">
            <p>{l('Unfortunately, we were unable to load the map.')}</p>
            <button
              className="Button"
              onClick={this.reloadBrowser}
            >{l`Reload`}</button>
          </div>
        )}
      </div>
    )
  }
}
