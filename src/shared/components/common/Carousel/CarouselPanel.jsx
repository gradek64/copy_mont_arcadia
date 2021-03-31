import React, { Component } from 'react'
import classNames from 'classnames'
import Hammer from 'react-hammerjs'
import PropTypes from 'prop-types'
import { path } from 'ramda'

export default class CarouselPanel extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    carousel: PropTypes.object.isRequired,
    assets: PropTypes.arrayOf(PropTypes.object).isRequired,
    backCarousel: PropTypes.func.isRequired,
    forwardCarousel: PropTypes.func.isRequired,
    mode: PropTypes.string,
    setCurrentItemReference: PropTypes.func,
    currentItemReferencePath: PropTypes.func,
    handleSwipe: PropTypes.func,
    arrowColor: PropTypes.string,
    className: PropTypes.string,
  }

  static defaultProps = {
    className: '',
  }

  constructor(props) {
    super(props)
    this.state = { shouldAnimate: false }
  }

  componentDidMount() {
    const {
      name,
      setCurrentItemReference,
      currentItemReferencePath,
    } = this.props
    if (currentItemReferencePath) {
      const currentIndex = path(['carousel', name, 'current'], this.props)
      setCurrentItemReference(
        name,
        currentItemReferencePath(this.props.assets[currentIndex])
      )
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      name,
      setCurrentItemReference,
      currentItemReferencePath,
    } = this.props

    const nextIndex = path(['carousel', name, 'current'], nextProps)
    const currentIndex = path(['carousel', name, 'current'], this.props)

    if (nextIndex !== currentIndex) {
      this.setState({ shouldAnimate: true })
      if (currentItemReferencePath) {
        setCurrentItemReference(
          name,
          currentItemReferencePath(nextProps.assets[nextIndex])
        )
      }
    }
  }

  renderControls() {
    const { name, arrowColor, backCarousel, forwardCarousel } = this.props

    return [
      <button
        key="left"
        className={classNames('Carousel-arrow', 'Carousel-arrow--left')}
        onClick={() => backCarousel(name)}
        aria-hidden="true"
        tabIndex="-1"
        style={{ backgroundColor: arrowColor }}
      />,
      <button
        key="right"
        className={classNames('Carousel-arrow', 'Carousel-arrow--right')}
        onClick={() => forwardCarousel(name)}
        aria-hidden="true"
        tabIndex="-1"
        style={{ backgroundColor: arrowColor }}
      />,
    ]
  }

  render() {
    const { assets, carousel, mode, name, handleSwipe, className } = this.props

    if (!carousel[name]) return null

    const { current, previous, direction, initialIndex } = carousel[name]

    const content = (
      <div className="Carousel-items" aria-hidden="true">
        <ul className="Carousel-list" tabIndex="-1">
          {assets.map((asset, i) => {
            const selected = current === i
            const isFirst = i === initialIndex
            const selectedClass = selected
              ? 'selected'
              : previous === i
                ? 'previous'
                : 'inactive'

            const itemClass = () => {
              if (!this.state.shouldAnimate && isFirst) {
                return 'Carousel-initialItem'
              }
              return `Carousel-${direction}Item`
            }

            return (
              <li // eslint-disable-line jsx-a11y/no-static-element-interactions
                key={`i${name}${i}`} // eslint-disable-line react/no-array-index-key
                ref={`CarouselItem${i}`}
                className={`Carousel-item foo-${i} is-${selectedClass} ${itemClass()}`}
              >
                <div>{asset}</div>
              </li>
            )
          })}
        </ul>
      </div>
    )

    return (
      <div // eslint-disable-line jsx-a11y/no-static-element-interactions
        className={`Carousel${mode ? ` Carousel--${mode}` : ''} ${className}`}
        ref={(Carousel) => {
          this.CarouselRef = Carousel
        }}
      >
        <Hammer onSwipe={handleSwipe} direction="DIRECTION_HORIZONTAL">
          {content}
        </Hammer>
        {assets.length > 1 && this.renderControls()}
      </div>
    )
  }
}
