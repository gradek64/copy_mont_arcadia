import { path, pathOr } from 'ramda'
import { connect } from 'react-redux'

import { hasLength } from '../../../../lib/validator/validators'
import {
  getCheckoutAmount,
  getFormErrors,
  giftCardRedemptionPercentage,
  isGiftCardValueThresholdMet,
  isGiftCardRedemptionEnabled,
} from '../../../../selectors/checkoutSelectors'
import { isFeatureGiftCardsEnabled } from '../../../../selectors/featureSelectors'

// actions
import {
  addGiftCard,
  removeGiftCard,
  hideGiftCardBanner,
} from '../../../../actions/common/checkoutActions'
import {
  setAndValidateFormField,
  validateForm,
  setFormMeta,
  clearFormErrors,
  touchedFormField,
} from '../../../../actions/common/formActions'
import { sendAnalyticsClickEvent } from '../../../../analytics'

// components
import GiftCards from './GiftCards/GiftCards'

const validationSchema = {
  giftCardNumber: [
    'required',
    hasLength('Giftcard number needs to be 16 characters long.', 16),
    'numbersOnly',
  ],
  pin: [
    'required',
    hasLength('Giftcard PIN needs to be 4 characters long.', 4),
    'numbersOnly',
  ],
}

const emptyObject = {}

const mapStateToProps = (state, { showTotal = false }) => {
  const fields = state.forms.giftCard.fields
  const { giftCardNumber: giftCardNumberError, pin: pinError } = getFormErrors(
    'giftCard',
    state
  )

  return {
    fields,
    giftCardNumberError,
    pinError,
    giftCards: state.checkout.orderSummary.giftCards,
    total: (showTotal && getCheckoutAmount(state)) || '',
    errorMessage: pathOr(
      '',
      ['forms', 'giftCard', 'message', 'message'],
      state
    ),
    bannerMessage: state.forms.giftCard.banner,
    validationSchema:
      path(['giftCardNumber', 'value'], fields) ||
      path(['pin', 'value'], fields)
        ? validationSchema
        : emptyObject,
    isFeatureGiftCardsEnabled: isFeatureGiftCardsEnabled(state),
    giftCardRedemptionPercentage: giftCardRedemptionPercentage(state),
    isGiftCardValueThresholdMet: isGiftCardValueThresholdMet(state),
    isGiftCardRedemptionEnabled: isGiftCardRedemptionEnabled(state),
  }
}

const mapDispatchToProps = {
  onAddGiftCard: addGiftCard,
  onRemoveGiftCard: removeGiftCard,
  hideBanner: hideGiftCardBanner,
  setAndValidateField: setAndValidateFormField.bind(null, 'giftCard'),
  validate: validateForm.bind(null, 'giftCard'),
  touchField: touchedFormField.bind(null, 'giftCard'),
  setMeta: setFormMeta.bind(null, 'giftCard'),
  clearErrors: clearFormErrors.bind(null, 'giftCard'),
  sendAnalyticsClickEvent,
}

export { mapStateToProps, mapDispatchToProps }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GiftCards)
