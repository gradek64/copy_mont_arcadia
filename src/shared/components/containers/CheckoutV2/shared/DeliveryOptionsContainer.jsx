import PropTypes from 'prop-types'
import React, { useState, Fragment } from 'react'
import { connect } from 'react-redux'

import {
  getDeliveryCountry,
  getEnrichedDeliveryLocations,
  getSelectedDeliveryLocationType,
} from '../../../../../shared/selectors/checkoutSelectors'
import { getSavedAddresses } from '../../../../selectors/addressBookSelectors'
import withRestrictedActionDispatch from '../../../../lib/restricted-actions'
import QubitReact from 'qubit-react/wrapper'
// actions
import {
  selectDeliveryLocation,
  selectDeliveryStore,
  // EXP-313
  setStoreWithParcel,
} from '../../../../actions/common/checkoutActions'

// components
import DeliveryOptions from '../Delivery/DeliveryOptions'
import CheckoutPrimaryTitle from '../shared/CheckoutPrimaryTitle'
import Accordion from '../../../common/Accordion/Accordion'
import CheckoutSubPrimaryTitle from '../shared/CheckoutSubPrimaryTitle'

const mapStateToProps = (state) => ({
  deliveryLocations: getEnrichedDeliveryLocations(state),
  deliveryCountry: getDeliveryCountry(state),
  selectedDeliveryLocationType: getSelectedDeliveryLocationType(state),
  hasSavedAddresses: getSavedAddresses(state).length > 0,
})

const mapDispatchToProps = (dispatch, { onChangeDeliveryLocation } = {}) => ({
  onChangeDeliveryLocation:
    onChangeDeliveryLocation ||
    ((deliveryLocation) => dispatch(selectDeliveryLocation(deliveryLocation))),
  // EXP-313
  setStoreWithParcel: (val) => dispatch(setStoreWithParcel(val)),
})

const DeliveryOptionsContainer = (
  {
    deliveryLocations,
    deliveryCountry,
    onChangeDeliveryLocation,
    setStoreWithParcel,
    selectedDeliveryLocationType,
    hasSavedAddresses,
    setScrollToFirstErrorActive,
  },
  { l }
) => {
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false)
  const [isDeliveryLocationChanged, setIsDeliveryLocationChanged] = useState(
    false
  )

  const onAccordionToggle = () => {
    setIsAccordionExpanded(!isAccordionExpanded)
    setScrollToFirstErrorActive()
  }

  const handleOnChangeDeliveryLocation = (deliveryLocation) => {
    onChangeDeliveryLocation(deliveryLocation)
    setIsDeliveryLocationChanged(true)
    setIsAccordionExpanded(false)
    setScrollToFirstErrorActive()
  }

  const getAccordionSubHeaderText = () => {
    switch (selectedDeliveryLocationType) {
      case 'STORE':
        return l`Collect From Store`
      case 'PARCELSHOP':
        return l`Collect From ParcelShop`
      default:
        return l`Home Delivery`
    }
  }

  const deliveryOptions = () => (
    <Fragment>
      {/* EXP-313 */}
      <QubitReact
        id="qubit-checkout-delivery-locations"
        deliveryLocations={deliveryLocations}
        setStoreWithParcel={setStoreWithParcel}
        deliveryCountry={deliveryCountry}
        changeDeliveryLocation={handleOnChangeDeliveryLocation}
      >
        <DeliveryOptions
          deliveryLocations={deliveryLocations}
          onChangeDeliveryLocation={handleOnChangeDeliveryLocation}
        />
      </QubitReact>
    </Fragment>
  )

  const hideAccordion =
    !hasSavedAddresses &&
    selectedDeliveryLocationType === 'HOME' &&
    !isDeliveryLocationChanged

  if (deliveryLocations.length > 1) {
    return hideAccordion ? (
      <div className="DeliveryOptionsContainer DeliveryOptionsContainer-hideAccordion">
        <CheckoutPrimaryTitle isAugmented title={l`Delivery Method`} />
        {deliveryOptions()}
      </div>
    ) : (
      <div className="DeliveryOptionsContainer">
        <Accordion
          className={'Accordion--checkoutDeliveryTypeAccordion'}
          expanded={isAccordionExpanded}
          header={
            <CheckoutPrimaryTitle
              isAugmented={isAccordionExpanded && true}
              title={l`Delivery Method`}
            />
          }
          subHeader={
            isAccordionExpanded ? (
              ''
            ) : (
              <CheckoutSubPrimaryTitle title={getAccordionSubHeaderText()} />
            )
          }
          noContentBorderTop
          onAccordionToggle={onAccordionToggle}
          statusIndicatorText={isAccordionExpanded ? l`CANCEL` : l`CHANGE`}
          withoutBorders
          noHeaderPadding
          noContentPadding
          isDisabled={deliveryCountry !== 'United Kingdom'}
        >
          {deliveryOptions()}
        </Accordion>
      </div>
    )
  }

  return null
}

DeliveryOptionsContainer.propTypes = {
  deliveryLocations: PropTypes.array,
  onChangeDeliveryLocation: PropTypes.func.isRequired,
  selectedDeliveryLocationType: PropTypes.string.isRequired,
  deliveryCountry: PropTypes.string.isRequired,
  hasSavedAddresses: PropTypes.bool,
  setScrollToFirstErrorActive: PropTypes.func.isRequired,
}

DeliveryOptionsContainer.defaultProps = {
  deliveryLocations: [],
  hasSavedAddresses: false,
}

DeliveryOptionsContainer.contextTypes = {
  l: PropTypes.func,
}

export default withRestrictedActionDispatch({
  selectDeliveryLocation,
  selectDeliveryStore,
})(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DeliveryOptionsContainer)
)

export {
  DeliveryOptionsContainer as WrappedDeliveryOptionsContainer,
  mapStateToProps,
  mapDispatchToProps,
}
