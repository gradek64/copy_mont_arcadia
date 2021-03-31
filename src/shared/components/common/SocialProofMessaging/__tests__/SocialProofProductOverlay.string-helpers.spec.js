import { getSocialProofProductOverlayText } from '../SocialProofProductOverlay.string-helpers'

describe('SocialProofCarouselOverlay strings helpers', () => {
  describe('@getSocialProofProductOverlayText', () => {
    it('returns default string if brand non existent', () => {
      expect(getSocialProofProductOverlayText('tm')).toBe(
        'HURRY, SELLING FAST!'
      )
    })

    it('returns correct string for miss sellfridge', () => {
      expect(getSocialProofProductOverlayText('ms')).toBe('SELLING FAST!')
    })
  })
})
