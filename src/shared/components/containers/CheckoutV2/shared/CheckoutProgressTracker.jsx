import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ProgressTracker from '../../../common/ProgressTracker/ProgressTracker'
import { getProgressTrackerSteps } from '../../../../selectors/checkoutSelectors'

const mapStateToProps = (state) => ({
  steps: getProgressTrackerSteps(state),
})

const CheckoutProgressTracker = ({ steps }) => <ProgressTracker steps={steps} />

CheckoutProgressTracker.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default connect(mapStateToProps)(CheckoutProgressTracker)
