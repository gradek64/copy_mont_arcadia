import { Component } from 'react'
import PropTypes from 'prop-types'

const POP_STATE_EVENT = 'popstate'

export class WindowNavigationListener extends Component {
  static contextTypes = {
    addListener: PropTypes.func,
    removeListener: PropTypes.func,
  }
  static propTypes = {
    modalOpen: PropTypes.bool,
    closeModal: PropTypes.func,
  }
  onBrowserNavigation = () => {
    const { modalOpen, closeModal } = this.props
    if (modalOpen && closeModal) closeModal()
    console.log(
      'POP_STATE_EVENT calling custom method event handler "onBrowserNavigation"'
    )
  }

  componentDidMount() {
    const { addListener } = this.context
    if (addListener) addListener(POP_STATE_EVENT, this.onBrowserNavigation)
  }

  componentWillUnmount() {
    const { removeListener } = this.context
    if (removeListener)
      removeListener(POP_STATE_EVENT, this.onBrowserNavigation)
  }

  render() {
    return this.props.children
  }
}
