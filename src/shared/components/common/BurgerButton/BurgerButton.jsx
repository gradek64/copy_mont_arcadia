import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { isFeatureEnabled } from '../../../selectors/featureSelectors'

const mapStateToProps = (state) => ({
  isFeatureBurgerMenuIconWithTextEnabled: isFeatureEnabled(
    state,
    'FEATURE_BURGER_MENU_ICON_WITH_TEXT'
  ),
})
const BurgerButton = ({ isFeatureBurgerMenuIconWithTextEnabled }, { l }) => {
  const className = classnames('BurgerButton', {
    'BurgerButton-hasMenuTextIcon': isFeatureBurgerMenuIconWithTextEnabled,
  })
  return (
    <button
      title={l`Open categories menu`}
      aria-label={l`Open categories menu`}
      className={className}
    >
      {!isFeatureBurgerMenuIconWithTextEnabled && (
        <Fragment>
          <span className="BurgerButton-bar" />
          <span className="BurgerButton-bar" />
          <span className="BurgerButton-bar" />
        </Fragment>
      )}
    </button>
  )
}
BurgerButton.propTypes = {
  isFeatureBurgerMenuIconWithTextEnabled: PropTypes.bool.isRequired,
}
BurgerButton.contextTypes = {
  l: PropTypes.func,
}
export default connect(mapStateToProps)(BurgerButton)
