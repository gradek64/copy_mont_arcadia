import { Component } from 'react'
import PropTypes from 'prop-types'
import { WindowEventProvider } from './WindowEventProvider'
import throttle from 'lodash.throttle'

export class WindowScroll extends Component {
  constructor(props) {
    super(props)
    this.scrollHandler = throttle(this.handleScroll, props.scrollDelay)
  }

  static contextTypes = {
    ...WindowEventProvider.childContextTypes,
  }

  static propTypes = {
    children: PropTypes.element.isRequired,
    onScroll: PropTypes.func,
    onCustomScroll: PropTypes.func,
    onReachedPageBottom: PropTypes.func,
    scrollPastThreshold: PropTypes.number,
    pageBottomBuffer: PropTypes.number,
    scrollDelay: PropTypes.number.isRequired,
  }

  static defaultProps = {
    onScroll: () => undefined,
    onReachedPageBottom: () => undefined,
    scrollPastThreshold: 0,
    pageBottomBuffer: 0,
    scrollDelay: 300,
  }

  _hasPassedThreshold = false
  _hasReachedPageBottom = false

  handleScroll = (event, w = window) => {
    const { onScroll, onCustomScroll } = this.props

    if (onCustomScroll) {
      return onCustomScroll(event, w)
    }

    onScroll(event)
    this.checkScrollPassedThreshold(event, w)
    this.checkScrollReachedPageBottom(event, w)
  }

  checkScrollPassedThreshold(event, { innerHeight, scrollY, pageYOffset }) {
    const { onScrollPast, scrollPastThreshold } = this.props

    const scrollPosition = scrollY || pageYOffset

    if (scrollPastThreshold <= 0) return

    const heightThreshold =
      scrollPastThreshold <= 1
        ? innerHeight * scrollPastThreshold
        : scrollPastThreshold

    const hasPassedThreshold = scrollPosition > heightThreshold
    if (hasPassedThreshold !== this._hasPassedThreshold) {
      onScrollPast(hasPassedThreshold, event)
    }

    this._hasPassedThreshold = hasPassedThreshold
  }

  checkScrollReachedPageBottom(
    event,
    {
      innerHeight,
      scrollY,
      pageYOffset,
      document: {
        body: { offsetHeight },
      },
    }
  ) {
    const { onReachedPageBottom, pageBottomBuffer } = this.props

    const scrollPosition = scrollY || pageYOffset

    const hasReachedPageBottom =
      scrollPosition + innerHeight + pageBottomBuffer >= offsetHeight

    if (hasReachedPageBottom !== this._hasReachedPageBottom) {
      onReachedPageBottom(hasReachedPageBottom, event)
    }

    this._hasReachedPageBottom = hasReachedPageBottom
  }

  componentDidMount() {
    this.context.addListener('scroll', this.scrollHandler)
  }

  componentWillUnmount() {
    this.context.removeListener('scroll', this.scrollHandler)
  }

  render() {
    return this.props.children
  }
}
