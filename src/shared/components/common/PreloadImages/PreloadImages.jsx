import { Component } from 'react'
import PropTypes from 'prop-types'

// :: string -> Promise
const loadImage = (src) =>
  new Promise((resolve) => {
    const loader = new window.Image()
    loader.onload = resolve
    loader.onerror = resolve
    loader.src = src
  })

export default class PreloadImages extends Component {
  static propTypes = {
    render: PropTypes.func.isRequired,
    sources: PropTypes.arrayOf(PropTypes.string).isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      loaded: props.sources.length === 0,
    }
  }

  componentDidMount() {
    if (this.props.sources.length > 0) {
      Promise.all(this.props.sources.map(loadImage)).then(() => {
        if (this.unmounted) return
        this.setState({ loaded: true })
      })
    }
  }

  componentWillUnmount() {
    this.unmounted = true
  }

  render() {
    const { loaded } = this.state
    if (!loaded) return null
    return this.props.render()
  }
}
