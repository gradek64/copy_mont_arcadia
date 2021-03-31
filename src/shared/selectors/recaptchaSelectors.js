import { createSelector } from 'reselect'
import { isGuestOrder } from './checkoutSelectors'
import { isFeatureGuestRecaptchaEnabled } from './featureSelectors'
import { getGoogleRecaptchaSiteKey } from './configSelectors'

export const isGuestRecaptchaEnabled = (state) =>
  createSelector(
    isFeatureGuestRecaptchaEnabled,
    isGuestOrder,
    getGoogleRecaptchaSiteKey,
    (isGuestRecaptchaEnabled, isGuest, recaptchaSiteKey) => {
      return Boolean(isGuestRecaptchaEnabled && isGuest && recaptchaSiteKey)
    }
  )(state)
