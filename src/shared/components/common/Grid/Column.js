import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

@connect((state) => ({
  isResponsive: state.features.status.FEATURE_RESPONSIVE,
}))
class Column extends Component {
  static propTypes = {
    isResponsive: PropTypes.bool.isRequired,
    mobile: PropTypes.string,
    responsive: PropTypes.string,
    className: PropTypes.string,
    componentType: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  }

  static defaultProps = {
    children: null,
    mobile: 'col-12',
    componentType: 'div',
    className: '',
    responsive: 'col',
  }

  render() {
    const {
      children,
      isResponsive,
      mobile,
      responsive,
      className,
      componentType,
      dispatch,
      ...props
    } = this.props

    const ComponentType = componentType

    return (
      <ComponentType
        {...props}
        className={`${isResponsive ? responsive : mobile} ${className}`
          .trim()
          .replace(/\s+/g, ' ')}
      >
        {children}
      </ComponentType>
    )
  }
}

export default Column
