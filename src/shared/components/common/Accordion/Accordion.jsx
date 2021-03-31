import classnames from 'classnames'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { path, equals } from 'ramda'
import keys from '../../../constants/keyboardKeys'
import Loader from '../Loader/Loader'

export default class Accordion extends Component {
  static propTypes = {
    accordionName: PropTypes.string,
    expanded: PropTypes.bool,
    showLoader: PropTypes.bool,
    header: PropTypes.node.isRequired,
    children: PropTypes.node,
    className: PropTypes.string,
    noContentPadding: PropTypes.bool,
    noContentBorderTop: PropTypes.bool,
    noHeaderPadding: PropTypes.bool,
    noMaxHeight: PropTypes.bool,
    onAccordionToggle: PropTypes.func,
    noExpandedHeaderBackground: PropTypes.bool,
    arrowStyle: PropTypes.oneOf(['primary', 'secondary']),
    arrowPosition: PropTypes.oneOf(['left', 'right', 'hidden']),
    subHeader: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    withoutBorders: PropTypes.bool,
    statusIndicatorText: PropTypes.string,
    isDisabled: PropTypes.bool,
  }

  static defaultProps = {
    accordionName: '',
    expanded: false,
    showLoader: false,
    className: '',
    noContentBorderTop: false,
    noExpandedHeaderBackground: false,
    noMaxHeight: false,
    arrowStyle: 'primary',
    arrowPosition: 'left',
    children: null,
    onAccordionToggle: () => {},
    subHeader: '',
    withoutBorders: false,
    statusIndicatorText: '',
    isDisabled: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      expanded: props.expanded,
      expandedHeight: 0,
      hasCollapseAnimationFinished: !props.expanded,
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.expanded !== this.state.expanded) {
      this.setState({ expanded: nextProps.expanded })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.expanded !== nextState.expanded ||
      this.state.expandedHeight !== nextState.expandedHeight ||
      !equals(this.props.children, nextProps.children) ||
      (this.props.showLoader && !nextProps.showLoader) ||
      !equals(this.props.className, nextProps.className)
    )
  }

  componentDidMount() {
    this.updateExpandedHeight()
  }

  componentDidUpdate() {
    this.updateExpandedHeight()
  }

  updateExpandedHeight = () => {
    const newHeight = this.props.noMaxHeight
      ? 'none'
      : path(['scrollHeight'], this.accordionWrapper)

    if (newHeight === undefined) {
      return
    }

    if (newHeight !== this.state.expandedHeight) {
      this.setState({ expandedHeight: newHeight })
    }
  }

  toggle = (ev) => {
    if (ev) {
      ev.preventDefault()
    }

    const {
      accordionName,
      children,
      onAccordionToggle,
      isDisabled,
    } = this.props
    const notExpanded = !this.state.expanded

    if (!children || isDisabled) {
      return null
    }

    if (notExpanded) {
      this.setState({ hasCollapseAnimationFinished: false })
    }

    onAccordionToggle(accordionName, notExpanded)

    this.setState((state) => ({ expanded: !state.expanded }))
  }

  onKeyDown = ({ keyCode }) => {
    if (keyCode === keys.ENTER || keyCode === keys.SPACE) {
      this.toggle()
    }
  }

  handleOnTransactionEnd = () => {
    if (!this.props.expanded)
      this.setState({ hasCollapseAnimationFinished: true })
  }

  render() {
    const {
      children,
      className,
      header,
      noContentPadding,
      noHeaderPadding,
      noContentBorderTop,
      noExpandedHeaderBackground,
      arrowStyle,
      arrowPosition,
      showLoader,
      subHeader,
      statusIndicatorText,
      withoutBorders,
      isDisabled,
    } = this.props
    const { expanded } = this.state
    const classNames = classnames('Accordion', className, {
      'Accordion-withoutBorders': withoutBorders,
      'is-expanded': expanded,
    })
    const headerClassNames = classnames(Accordion.headerClassName, {
      [`${className}-headerContainer`]: !!className,
      'Accordion-header--noExpandedBackground': noExpandedHeaderBackground,
      'is-padded': !noHeaderPadding,
    })
    const iconClassNames = classnames(
      'Accordion-icon',
      `Accordion-icon--${arrowStyle}`,
      `Accordion-icon--${arrowPosition}`,
      {
        'Accordion-icon--hidden': !children || isDisabled,
      }
    )
    const statusIndicatorTextClassNames = classnames(
      'Accordion-statusIndicatorText',
      {
        'Accordion-statusIndicatorText--hidden': !children || isDisabled,
      }
    )
    const ctaClassNames = statusIndicatorText
      ? statusIndicatorTextClassNames
      : iconClassNames

    const childrenWithProps =
      children &&
      React.Children.map(
        children,
        (child) =>
          child &&
          React.cloneElement(child, {
            hidden: !expanded && this.state.hasCollapseAnimationFinished,
          })
      )

    return (
      <article
        className={classNames}
        ref={(accordion) => {
          this.accordion = accordion
        }}
      >
        <div // eslint-disable-line jsx-a11y/no-static-element-interactions
          className={headerClassNames}
          onClick={this.toggle}
          onKeyDown={this.onKeyDown}
          style={!isDisabled && children ? {} : { cursor: 'auto' }}
        >
          <div className={ctaClassNames}>
            {statusIndicatorText ? <a href="#">{statusIndicatorText}</a> : ''}
          </div>
          <header
            className="Accordion-title"
            role="button"
            tabIndex="0"
            aria-pressed={expanded}
          >
            {header}
          </header>
          {subHeader && <span className="Accordion-subTitle">{subHeader}</span>}
        </div>
        <div
          className="Accordion-wrapper"
          onTransitionEnd={() => this.handleOnTransactionEnd()}
          style={{ maxHeight: expanded ? this.state.expandedHeight : 0 }}
          ref={(accordionWrapper) => {
            this.accordionWrapper = accordionWrapper
          }}
        >
          {showLoader && <Loader />}
          {children && (
            <div
              className={classnames(`Accordion-content`, {
                [`${className}-content`]: !!className,
                'is-padded': !noContentPadding,
                'is-visible': !showLoader,
                'Accordion-content--borderTop': !noContentBorderTop,
              })}
            >
              {typeof children === 'object' ? childrenWithProps : children}
            </div>
          )}
        </div>
      </article>
    )
  }
}

Accordion.headerClassName = 'Accordion-header'
