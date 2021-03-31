import PropTypes from 'prop-types'
import { pluck } from 'ramda'
import React, { PureComponent } from 'react'
import { scrollElementIntoView } from '../../../../../lib/scroll-helper'

// components
import Accordion from '../../../../common/Accordion/Accordion'
import Button from '../../../../common/Button/Button'
import Input from '../../../../common/FormComponents/Input/Input'
import Message from '../../../../common/FormComponents/Message/Message'
import Price from '../../../../common/Price/Price'
import GiftCard from './GiftCard'
import { GTM_ACTION, GTM_CATEGORY } from '../../../../../analytics'

const fieldType = PropTypes.shape({
  value: PropTypes.string,
  isDirty: PropTypes.bool,
  isTouched: PropTypes.bool,
  isFocused: PropTypes.bool,
})

const giftCardType = PropTypes.shape({
  giftCardId: PropTypes.string,
  giftCardNumber: PropTypes.string,
  amountUsed: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
})

export default class GiftCards extends PureComponent {
  static propTypes = {
    fields: PropTypes.shape({
      giftCardNumber: fieldType,
      pin: fieldType,
    }).isRequired,
    giftCardNumberError: PropTypes.string,
    pinError: PropTypes.string,
    giftCards: PropTypes.arrayOf(giftCardType),
    total: PropTypes.string,
    errorMessage: PropTypes.string,
    bannerMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    maxNumGiftCards: PropTypes.number,
    validationSchema: PropTypes.shape({
      giftCardNumber: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.func, PropTypes.string])
      ),
      pin: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.func, PropTypes.string])
      ),
    }),
    // functions
    onAddGiftCard: PropTypes.func.isRequired,
    onRemoveGiftCard: PropTypes.func.isRequired,
    hideBanner: PropTypes.func.isRequired,
    setAndValidateField: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    touchField: PropTypes.func.isRequired,
    setMeta: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    isFeatureGiftCardsEnabled: PropTypes.bool.isRequired,
    giftCardRedemptionPercentage: PropTypes.number.isRequired,
    isGiftCardValueThresholdMet: PropTypes.bool.isRequired,
    isGiftCardRedemptionEnabled: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    giftCardNumberError: '',
    pinError: '',
    giftCards: [],
    total: '',
    errorMessage: '',
    bannerMessage: '',
    maxNumGiftCards: 5,
    validationSchema: {
      giftCardNumber: [],
      pin: [],
    },
    isFeatureGiftCardsEnabled: false,
  }

  static contextTypes = {
    l: PropTypes.func,
  }

  state = {
    isAccordionExpanded: false,
  }

  static scrollToError() {
    scrollElementIntoView(document.querySelector('.GiftCards-message'))
  }

  UNSAFE_componentWillMount() {
    this.props.hideBanner()
  }

  componentWillUnmount() {
    this.props.clearErrors()
  }

  componentDidUpdate(prevProps) {
    const { validationSchema, validate } = this.props
    if (prevProps.validationSchema !== validationSchema) {
      validate(validationSchema)
    }
  }

  setAndValidateField = (field) => ({ target: { value } }) => {
    const { validationSchema, setAndValidateField } = this.props
    setAndValidateField(field, value, validationSchema[field])
  }

  touchField = (field) => () => {
    const { touchField, setMeta } = this.props
    touchField(field)
    setMeta('message', {})
  }

  addCardHandler = () => {
    const {
      onAddGiftCard,
      fields,
      sendAnalyticsClickEvent,
      setAndValidateField,
    } = this.props
    const { giftCardNumber, pin } = pluck('value', fields)

    if (giftCardNumber && pin) {
      sendAnalyticsClickEvent({
        category: GTM_CATEGORY.CHECKOUT,
        action: GTM_ACTION.GIFT_CARD,
        label: fields.giftCardNumber.value,
        value: '',
      })
      onAddGiftCard(pluck('value', fields))
    } else {
      // If gift card form is not completed force an error.
      // To force an error touchField for each field must be set to true
      // and setting the validation of each field to be required.
      this.props.touchField('giftCardNumber')
      this.props.touchField('pin')
      setAndValidateField('giftCardNumber', '', ['required'])
      setAndValidateField('pin', '', ['required'])
    }
  }

  onAccordionToggle = () => {
    this.setState((state) => ({
      isAccordionExpanded: !state.isAccordionExpanded,
    }))
    // Clear form errors when closing the gift card accordion
    if (!this.state.isAccordionExpanded) {
      this.props.clearErrors()
    }
  }

  /**
   * Test if there is something left to pay for the user
   * @param {string} total - the amount to pay left
   * @returns {bool} true if there is something left to pay
   *
   * @ example
   *    isSomethingLeftToPay('') => false
   *    isSomethingLeftToPay('10.00') => true
   *    isSomethingLeftToPay('0.00') => true
   */

  isSomethingLeftToPay = (total = '') =>
    !total || (!!total && parseFloat(total, 10) > 0)

  render() {
    const { l } = this.context
    const {
      fields,
      giftCardNumberError,
      pinError,
      giftCards,
      total,
      maxNumGiftCards,
      errorMessage,
      bannerMessage,
      onRemoveGiftCard,
      isFeatureGiftCardsEnabled,
      giftCardRedemptionPercentage,
      isGiftCardValueThresholdMet,
      isGiftCardRedemptionEnabled,
    } = this.props
    const message =
      giftCards.length >= maxNumGiftCards
        ? {
            value: l`You have added the maximum number of gift cards for this order.`,
            type: 'message',
          }
        : { value: errorMessage, type: 'error' }

    return (
      isFeatureGiftCardsEnabled && (
        <section className="GiftCards">
          <Accordion
            expanded={this.state.isAccordionExpanded}
            header={<h3>{l`Gift card`}</h3>}
            accordionName="giftCard"
            className={'GiftCards-accordion'}
            scrollPaneSelector=".GiftCards"
            noContentPadding
            onAccordionToggle={this.onAccordionToggle}
          >
            {!!bannerMessage && (
              <Message
                className="GiftCards-banner"
                message={bannerMessage}
                type="confirm"
              />
            )}
            {giftCards.map(({ giftCardId, giftCardNumber, amountUsed }) => (
              <GiftCard
                key={giftCardId}
                cardNumber={giftCardNumber}
                amountUsed={amountUsed}
                onRemove={onRemoveGiftCard.bind(null, giftCardId)} // eslint-disable-line react/jsx-no-bind
              />
            ))}
            {giftCards.length > 0 &&
              !!total && (
                <div className="GiftCards-row">
                  <span className="GiftCards-newTotalLabel">{l`Total left to pay`}</span>
                  <span className="GiftCards-newTotalValue">
                    <Price price={total} />
                  </span>
                </div>
              )}
            {giftCards.length < maxNumGiftCards &&
              !isGiftCardValueThresholdMet &&
              this.isSomethingLeftToPay(total) && (
                <div>
                  <Input
                    name="giftCardNumber"
                    field={fields.giftCardNumber}
                    type="text"
                    label={l`Gift card number`}
                    placeholder={l`Gift Card Number`}
                    errors={{ giftCardNumber: l(giftCardNumberError) }}
                    setField={this.setAndValidateField}
                    touchedField={this.touchField}
                    maxLength={16}
                    privacyProtected
                  />
                  <div className="GiftCards-row">
                    <Input
                      name="pin"
                      field={fields.pin}
                      type="text"
                      label={l`PIN`}
                      placeholder={l`Example: XXXX`}
                      errors={{ pin: l(pinError) }}
                      setField={this.setAndValidateField}
                      touchedField={this.touchField}
                      privacyProtected
                    />
                    <Button
                      clickHandler={this.addCardHandler}
                      isDisabled={!!(giftCardNumberError || pinError)}
                    >{l`Apply card`}</Button>
                  </div>
                </div>
              )}
            {!!message.value && (
              <Message
                className="GiftCards-message"
                message={message.value}
                type={message.type}
                onDidMount={GiftCards.scrollToError}
              />
            )}

            {isGiftCardRedemptionEnabled &&
              isGiftCardValueThresholdMet && (
                <Message
                  className="GiftCards-warning"
                  message={l`You can use gift cards to pay for up to ${giftCardRedemptionPercentage}% of each order. Any balance will remain on your gift card for future purchases.`}
                  type={'normal'}
                />
              )}
          </Accordion>
        </section>
      )
    )
  }
}
