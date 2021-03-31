const SocialProofProductOverlayText = {
  default: 'HURRY, SELLING FAST!',
  ms: 'SELLING FAST!',
}

export const getSocialProofProductOverlayText = (brandCode) =>
  SocialProofProductOverlayText[brandCode] ||
  SocialProofProductOverlayText.default
