import PropTypes from 'prop-types'
import { omit, pathOr } from 'ramda'
import React from 'react'
import { connect } from 'react-redux'

import { getDeliveryInstructionsSchema } from '../validationSchemas'
import {
  getDeliveryCountry,
  shouldDisplayDeliveryInstructions,
} from '../../../../../selectors/checkoutSelectors'

// actions
import {
  setAndValidateFormField,
  touchedFormField,
} from '../../../../../actions/common/formActions'

// components
import DeliveryInstructions from './DeliveryInstructions'

const mapStateToProps = (state) => {
  const deliveryCountry = getDeliveryCountry(state)
  const { fields = {}, errors = {} } = pathOr(
    { fields: {}, errors: {} },
    ['forms', 'checkout', 'deliveryInstructions'],
    state
  )
  const { deliveryInstructions: deliveryInstructionsField } = fields
  const { deliveryInstructions: deliveryInstructionsError } = errors

  return {
    shouldDisplay: shouldDisplayDeliveryInstructions(state),
    deliveryInstructionsField,
    deliveryInstructionsError,
    validationSchema: getDeliveryInstructionsSchema(deliveryCountry),
  }
}

const mapDispatchToProps = {
  setAndValidateFormField,
  touchFormField: touchedFormField,
}

const DeliveryInstructionsContainer = (props) => {
  const deliveryInstructionsProps = omit(['shouldDisplay'], props)

  return props.shouldDisplay ? (
    <DeliveryInstructions {...deliveryInstructionsProps} />
  ) : null
}

DeliveryInstructionsContainer.propTypes = {
  shouldDisplay: PropTypes.bool,
}

DeliveryInstructionsContainer.defaultProps = {
  shouldDisplay: false,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeliveryInstructionsContainer)

export {
  DeliveryInstructionsContainer as WrappedDeliveryInstructionsContainer,
  mapStateToProps,
  mapDispatchToProps,
}
