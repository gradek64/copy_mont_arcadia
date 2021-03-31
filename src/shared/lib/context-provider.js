import PropTypes from 'prop-types'
import { Component, Children } from 'react'

class Provider extends Component {
  static propTypes = {
    localise: PropTypes.func.isRequired,
    formatPrice: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
  }

  static childContextTypes = {
    l: PropTypes.func.isRequired,
    p: PropTypes.func.isRequired,
  }

  getChildContext() {
    return {
      l: this.props.localise,
      p: this.props.formatPrice,
    }
  }

  render() {
    const { children } = this.props
    return Children.only(children)
  }
}

export default Provider
