// imports
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { pathOr } from 'ramda'
import { scrollElementIntoView } from '../../../../../lib/scroll-helper'
import {
  getDeliveryText,
  getDeliveryPriceText,
} from '../../../../../lib/checkout-utilities/delivery-options-utils'

// selectors
import {
  isDeliveryMethodSelected,
  isDeliveryMethodOfType,
} from '../../../../../testers/checkoutTesters'

// components
import DeliveryMethod from './DeliveryMethod'
import DeliveryOptions from './DeliveryOptions'
import ActiveDDPBanner from '../DigitalDeliveryPass/ActiveDDPBanner'
import DDPRenewal from '../DigitalDeliveryPass/DDPRenewal'
import DigitalDeliveryPass from '../DigitalDeliveryPass/DigitalDeliveryPass'
import DDPAppliedToOrderMsg from '../DigitalDeliveryPass/DDPAppliedToOrderMsg'
import Accordion from '../../../../common/Accordion/Accordion'
import Separator from '../../../../common/Separator/Separator'
import CheckoutPrimaryTitle from '../../shared/CheckoutPrimaryTitle'
import CheckoutSubPrimaryTitle from '../../shared/CheckoutSubPrimaryTitle'

// Qubit Wrapper
import QubitReact from 'qubit-react/wrapper'

const DeliveryMethods = (
  {
    // Properties / Values
    deliveryMethods,
    brandName,
    ddpDefaultName,
    isDDPActiveBannerEnabled,
    isDDPEnabled,
    isDDPPromoEnabled,
    isDDPOrder,
    showDDPPromo,
    deliveryCountry,
    isGuestOrder,
    // Actions
    onDeliveryMethodChange,
    onDeliveryOptionsChange,
    selectedDeliveryOptionFromBasket,
    savedAddresses,
    isCollection,
  },
  { l, p }
) => {
  const selectedDeliveryMethod = deliveryMethods.find(isDeliveryMethodSelected)
  const shouldShowDeliveryOptions =
    selectedDeliveryMethod &&
    selectedDeliveryMethod.enabled &&
    isDeliveryMethodOfType('HOME_EXPRESS', selectedDeliveryMethod) &&
    deliveryCountry === 'United Kingdom'

  const enabledDeliveryOptions = pathOr(
    [],
    ['deliveryOptions'],
    selectedDeliveryMethod
  ).filter((option) => option.enabled)

  const deliveryOptions = deliveryMethods.filter(
    ({ deliveryOptions }) => deliveryOptions.length > 0
  )
  const deliveryOptionsMapped = deliveryOptions.map(
    (option) => option.deliveryOptions
  )
  const accordionTitle = isCollection ? l`Collection Type` : l`Delivery Type`
  const initAccordionExpanded = savedAddresses && savedAddresses.length > 0
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(
    !initAccordionExpanded
  )

  const { plainLabel, shippingCost } = selectedDeliveryOptionFromBasket

  const shippingCostFormatted = getDeliveryPriceText(
    { cost: shippingCost },
    { l, p }
  )

  const deliveryOptionTitle = `${plainLabel} - ${shippingCostFormatted}`
  const deliveryText = getDeliveryText(
    {
      deliveryCountry,
      deliveryOptions,
      ...selectedDeliveryMethod,
    },
    { l }
  )

  const deliveryOptionSubTitle =
    deliveryText ||
    (selectedDeliveryMethod && selectedDeliveryMethod.additionalDescription)
  
  const shouldShowDeliveryPass = isDDPEnabled &&
    isDDPPromoEnabled &&
    showDDPPromo &&
    !isGuestOrder
  
  const shouldShowDDPAppliedToOrder = isDDPOrder && showDDPPromo

  const onAccordionToggle = () => {
    const el = document.querySelectorAll(
      '.Accordion.Accordion--checkoutDeliveryTypeAccordion'
    )[1]
    if(el) {
      setTimeout(() => {
        scrollElementIntoView(el, 500, 50)
      },500)
    }
    setIsAccordionExpanded(!isAccordionExpanded)
  }

  return deliveryMethods.length
    ? [
        isAccordionExpanded && [
          <Separator margin='30px 0 0' backgroundColor='none' />,
          <DDPRenewal/>,
          shouldShowDDPAppliedToOrder && [
            <DDPAppliedToOrderMsg
              brandName={brandName}
              ddpProductName={ddpDefaultName}
            />,
            <Separator margin='0 0 30px' backgroundColor='none' />,
          ],
          shouldShowDeliveryPass && [
            <DigitalDeliveryPass/>,
            <Separator margin='0 0 30px' backgroundColor='none' />,
          ],
        ],
        <Accordion
          className={'Accordion--checkoutDeliveryTypeAccordion'}
          expanded={isAccordionExpanded}
          header={
            <CheckoutPrimaryTitle
              isAugmented={isAccordionExpanded}
              title={accordionTitle}
            />
          }
          subHeader={
            isAccordionExpanded ? (
              ''
            ) : (
              <CheckoutSubPrimaryTitle
                title={deliveryOptionTitle}
                subTitle={deliveryOptionSubTitle}
              />
            )
          }
          noContentBorderTop
          onAccordionToggle={onAccordionToggle}
          statusIndicatorText={isAccordionExpanded ? l`CANCEL` : l`CHANGE`}
          withoutBorders
          noHeaderPadding
          noContentPadding
        >
          {isDDPActiveBannerEnabled && (
            <ActiveDDPBanner
              brandName={brandName}
              ddpProductName={ddpDefaultName}
            />
          )}
          {
            <div className={'DeliveryMethods-deliveryTypesContainer'}>
              <QubitReact
                id="qubit-checkout-deliveryMethods"
                deliveryMethods={deliveryMethods}
                onDeliveryMethodChange={onDeliveryMethodChange}
              >
                <div className="DeliveryMethods-options">
                  {deliveryMethods.map((deliveryMethod, i) => (
                    <DeliveryMethod
                      {...deliveryMethod}
                      key={deliveryMethod.deliveryType}
                      onChange={() => {
                        onDeliveryMethodChange(i)
                        if (shouldShowDeliveryOptions || !deliveryText)
                          onAccordionToggle()
                      }}
                      showDeliveryOptions={shouldShowDeliveryOptions}
                      deliveryCountry={deliveryCountry}
                      deliveryOptions={pathOr([], ['0'], deliveryOptionsMapped)}
                      deliveryText={getDeliveryText(
                        {
                          deliveryCountry,
                          deliveryOptions,
                          ...deliveryMethod,
                        },
                        { l }
                      )}
                    />
                  ))}
                </div>
              </QubitReact>
            </div>
          }
          {shouldShowDeliveryOptions && (
            <div className="DeliveryMethods-calendarView">
              <DeliveryOptions
                className="DeliveryOptionsSelect"
                deliveryType={selectedDeliveryMethod.deliveryType}
                deliveryOptions={enabledDeliveryOptions}
                onChange={onDeliveryOptionsChange.bind(null, 'HOME_EXPRESS')} // eslint-disable-line react/jsx-no-bind
                onAccordionToggle={onAccordionToggle}
              />
            </div>
          )}
        </Accordion>,
      ]
    : null
}

DeliveryMethods.propTypes = {
  deliveryMethods: PropTypes.arrayOf(
    PropTypes.shape({
      deliveryType: PropTypes.string,
      selected: PropTypes.bool,
      enabled: PropTypes.bool,
      cost: PropTypes.string,
      label: PropTypes.string,
      additionalDescription: PropTypes.string,
      deliveryOptions: PropTypes.arrayOf(
        PropTypes.shape({
          shipModeId: PropTypes.number,
          dayText: PropTypes.string,
          dateText: PropTypes.string,
          price: PropTypes.string,
          selected: PropTypes.bool,
        })
      ),
    })
  ),
  onDeliveryMethodChange: PropTypes.func,
  onDeliveryOptionsChange: PropTypes.func,
  brandName: PropTypes.string.isRequired,
  ddpDefaultName: PropTypes.string.isRequired,
  isDDPActiveBannerEnabled: PropTypes.bool.isRequired,
}

DeliveryMethods.defaultProps = {
  deliveryMethods: [],
  onDeliveryMethodChange: () => {},
  onDeliveryOptionsChange: () => {},
}

DeliveryMethods.contextTypes = {
  l: PropTypes.func,
  p: PropTypes.func,
}

export default DeliveryMethods
