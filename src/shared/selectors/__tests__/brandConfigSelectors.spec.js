import {
  enableSizeGuideButtonAsSizeTile,
  enableDropdownForLongSizes,
  shouldInvertHeaderEspotPositions,
  enableQuickViewButtonOnBundlePages,
} from '../brandConfigSelectors'

describe('brand config selectors', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('enables size guide button as size tile ', () => {
    expect(
      enableSizeGuideButtonAsSizeTile({
        config: { brandName: 'dorothyperkins' },
      })
    ).toBeTruthy()
  })

  describe('enableDropdownForLongSizes', () => {
    it('return true for wallis and missselfridge', () => {
      expect(
        enableDropdownForLongSizes({ config: { brandName: 'wallis' } })
      ).toBe(true)
      expect(
        enableDropdownForLongSizes({ config: { brandName: 'missselfridge' } })
      ).toBe(true)
    })

    it('return false any brand other then wallis and missselfridge', () => {
      expect(
        enableDropdownForLongSizes({ config: { brandName: 'other-brands' } })
      ).toBe(false)
    })
  })

  it('enables size guide button as size tile ', () => {
    expect(
      enableSizeGuideButtonAsSizeTile({ config: { brandName: 'topman' } })
    ).toBeFalsy()
  })

  describe('enableQuickViewButtonOnBundlePages', () => {
    it('should return true', () => {
      expect(
        enableQuickViewButtonOnBundlePages({ config: { brandName: 'topshop' } })
      ).toBe(true)
    })
    it('should return false', () => {
      expect(
        enableQuickViewButtonOnBundlePages({ config: { brandName: 'topman' } })
      ).toBe(false)
    })
  })

  describe('shouldInvertHeaderEspotPositions', () => {
    it('return true for topshop', () => {
      expect(
        shouldInvertHeaderEspotPositions({ config: { brandName: 'topshop' } })
      ).toBe(true)
    })

    it('return true for wallis', () => {
      expect(
        shouldInvertHeaderEspotPositions({ config: { brandName: 'wallis' } })
      ).toBe(true)
    })

    it('return true for evans', () => {
      expect(
        shouldInvertHeaderEspotPositions({ config: { brandName: 'evans' } })
      ).toBe(true)
    })

    it('return true for missselfridge', () => {
      expect(
        shouldInvertHeaderEspotPositions({
          config: { brandName: 'missselfridge' },
        })
      ).toBe(true)
    })

    it('return true for topman', () => {
      expect(
        shouldInvertHeaderEspotPositions({ config: { brandName: 'topman' } })
      ).toBe(true)
    })

    it('return false for dorothyperkins', () => {
      expect(
        shouldInvertHeaderEspotPositions({
          config: { brandName: 'dorothyperkins' },
        })
      ).toBe(false)
    })

    it('return false for burton', () => {
      expect(
        shouldInvertHeaderEspotPositions({ config: { brandName: 'burton' } })
      ).toBe(false)
    })
  })
})
