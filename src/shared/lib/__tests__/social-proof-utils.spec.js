import {
  exceedsMaxSocialProofViewCount,
  incrementSocialProofViewCounter,
} from '../social-proof-utils'
import { createStorageWrapper } from '../../../client/lib/storageWrapperFactory'

jest.mock('../../../client/lib/storageWrapperFactory')

describe('social-proof', () => {
  describe('exceedsMaxSocialProofViewCount', () => {
    const maximumViews = 3

    it('should return true if the view counter exceeds the maximum views limit in the config', () => {
      createStorageWrapper.mockReturnValue({
        getItem: jest.fn().mockReturnValue({ PDP: 7 }),
      })

      expect(exceedsMaxSocialProofViewCount('PDP', maximumViews)).toBe(true)
    })

    it('should return true if the view counter equals the maximum views limit in the config', () => {
      createStorageWrapper.mockReturnValue({
        getItem: jest.fn().mockReturnValue({ PDP: 3 }),
      })

      expect(exceedsMaxSocialProofViewCount('PDP', maximumViews)).toBe(true)
    })

    it('should return false if the view counter is lower than the maximum views limit in the config', () => {
      createStorageWrapper.mockReturnValue({
        getItem: jest.fn().mockReturnValue({ PDP: 1 }),
      })

      expect(exceedsMaxSocialProofViewCount('PDP', maximumViews)).toBe(false)
    })

    it('should return false if there is no maximum view limit in the config', () => {
      createStorageWrapper.mockReturnValue({
        getItem: jest.fn().mockReturnValue({ PDP: 4 }),
      })

      expect(exceedsMaxSocialProofViewCount('PDP', undefined)).toBe(false)
    })

    it('should return false if there is no matching view counter & maximum view limit in the config', () => {
      createStorageWrapper.mockReturnValue({
        getItem: jest.fn().mockReturnValue({ minibag: 4 }),
      })

      expect(exceedsMaxSocialProofViewCount('PDP', maximumViews)).toBe(false)
    })
  })

  describe('incrementSocialProofViewCounter', () => {
    it('should start the social proof counter at 1, if it doesnt exist', () => {
      createStorageWrapper.mockReturnValue({
        getItem: jest.fn().mockReturnValue({}),
        setItem: jest.fn(),
      })

      incrementSocialProofViewCounter('PLP')

      expect(createStorageWrapper().setItem).toHaveBeenCalledWith(
        'social_proof_view_count',
        { PLP: 1 }
      )
    })
    it('should increment by 1 for existing social proof counters', () => {
      createStorageWrapper.mockReturnValue({
        getItem: jest.fn().mockReturnValue({ PLP: 2 }),
        setItem: jest.fn(),
      })

      incrementSocialProofViewCounter('PLP')

      expect(createStorageWrapper().setItem).toHaveBeenCalledWith(
        'social_proof_view_count',
        { PLP: 3 }
      )
    })
    it('should not replace or affect other counters when incrementing', () => {
      createStorageWrapper.mockReturnValue({
        getItem: jest.fn().mockReturnValue({ PLP: 1, minibag: 2 }),
        setItem: jest.fn(),
      })

      incrementSocialProofViewCounter('PLP')

      expect(createStorageWrapper().setItem).toHaveBeenCalledWith(
        'social_proof_view_count',
        { PLP: 2, minibag: 2 }
      )
    })
  })
})
