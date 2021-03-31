import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { pathOr } from 'ramda'

// :: State -> MappedState
const mapState = pathOr({}, ['features', 'status'])

/**
 * Component for feature flag detection
 *
 * Example
 *
 * <FeatureCheck flag="MY_FEATURE_FLAG">
 *   <MyComponent />
 * </FeactureCheck>
 *
 * Useful if a component is used in areas where is is flagged AND not flagged.
 * If it is always flagged use `withFeatureCheck` below
 */
@connect(mapState)
class FeatureCheck extends Component {
  static propTypes = {
    flag: PropTypes.string,
    children: PropTypes.node,
  }

  render() {
    const { flag, children } = this.props
    return this.props[flag] ? children : null
  }
}

export default FeatureCheck

/**
 * Higher order component for feature flag detection. This may be a cleaner method
 * of the above as it doesn't litter render methods with <FeatureCheck> wrappers.
 *
 * Example #1
 *
 * const MyFlaggedComponent = withFeatureFlag('MY_FEATURE_FLAG')(MyComponent)
 *
 * Example #2
 *
 * @withFeatureFlag('MY_FEATURE_FLAG')
 * class MyComponent extends React.Component { ... }
 *
 * @param  {String} flag Feature flag to check
 * @return {Function} Function to call component with which returns the flagged component
 */
export const withFeatureCheck = (flag) => (Component) => {
  const withFeatureCheck = (props) => (
    <FeatureCheck flag={flag}>
      <Component {...props} />
    </FeatureCheck>
  )
  withFeatureCheck.WrappedComponent = Component
  withFeatureCheck.displayName = `FeatureCheck(${Component.name})`
  return withFeatureCheck
}
