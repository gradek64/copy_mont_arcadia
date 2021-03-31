import * as espotSelectors from '../espotSelectors'
import { shouldInvertHeaderEspotPositions } from '../brandConfigSelectors'
import {
  isFeatureCFSIEnabled,
  isFeatureShowCFSIEspotEnabled,
} from '../featureSelectors'
import desktopEspotConstants from '../../constants/espotsDesktop'

jest.mock('../brandConfigSelectors', () => ({
  shouldInvertHeaderEspotPositions: jest.fn(false),
}))

jest.mock('../featureSelectors', () => ({
  isFeatureCFSIEnabled: jest.fn(false),
  isFeatureShowCFSIEspotEnabled: jest.fn(false),
}))

describe('espot selectors', () => {
  beforeEach(() => jest.resetAllMocks())

  it('get default brand header espot name', () => {
    expect(espotSelectors.getBrandHeaderEspotName()).toBe(
      desktopEspotConstants.navigation.brandHeader
    )
  })

  it('get global espot as brand header espot name for specially configured brand', () => {
    shouldInvertHeaderEspotPositions.mockReturnValue(true)
    expect(espotSelectors.getBrandHeaderEspotName()).toBe(
      desktopEspotConstants.navigation.global
    )
  })

  it('get default global espot name', () => {
    expect(espotSelectors.getGlobalEspotName()).toBe(
      desktopEspotConstants.navigation.global
    )
  })

  it('get brand header espot as brand header espot name for specially configured brand', () => {
    shouldInvertHeaderEspotPositions.mockReturnValue(true)
    expect(espotSelectors.getGlobalEspotName()).toBe(
      desktopEspotConstants.navigation.brandHeader
    )
  })

  describe('espotSelectors selector', () => {
    it('should return undefined if not present in state', () => {
      expect(espotSelectors.getResponsiveCMSUrl({}, 'id')).toBeUndefined()
    })

    it('should return responsive CMS url from state', () => {
      const identifier = 'id'
      const responsiveCMSUrl = 'url'
      expect(
        espotSelectors.getResponsiveCMSUrl(
          {
            espot: {
              cmsData: {
                [identifier]: {
                  responsiveCMSUrl,
                },
              },
            },
          },
          identifier
        )
      ).toBe(responsiveCMSUrl)
    })
  })

  describe('isCFSIEspotEnabled selector', () => {
    it('returns true if both CFSI feature flags are enabled', () => {
      isFeatureCFSIEnabled.mockReturnValue(true)
      isFeatureShowCFSIEspotEnabled.mockReturnValue(true)
      expect(espotSelectors.isCFSIEspotEnabled()).toBe(true)
    })

    it('returns false if either CFSI feature flag is disabled', () => {
      isFeatureCFSIEnabled.mockReturnValue(false)
      isFeatureShowCFSIEspotEnabled.mockReturnValue(false)
      expect(espotSelectors.isCFSIEspotEnabled()).toBe(false)

      isFeatureCFSIEnabled.mockReturnValue(true)
      isFeatureShowCFSIEspotEnabled.mockReturnValue(false)
      expect(espotSelectors.isCFSIEspotEnabled()).toBe(false)

      isFeatureCFSIEnabled.mockReturnValue(false)
      isFeatureShowCFSIEspotEnabled.mockReturnValue(true)
      expect(espotSelectors.isCFSIEspotEnabled()).toBe(false)
    })
  })

  describe('getProductListEspots()', () => {
    const state = {
      espot: {
        cmsData: {
          montyHeaderEspot: {
            isPlpEspot: false,
            responsiveCMSUrl: '',
          },
          productList4: {
            isPlpEspot: true,
            position: '4',
            responsiveCMSUrl:
              '/cms/pages/json/json-0000141218/json-0000141218.json',
          },
          productList10: {
            isPlpEspot: true,
            position: '10',
            responsiveCMSUrl: '',
          },
        },
      },
    }

    it('should return espots with a responsiveCMSUrl', () => {
      const expected = [
        {
          identifier: 'productList4',
          isPlpEspot: true,
          position: '4',
          responsiveCMSUrl:
            '/cms/pages/json/json-0000141218/json-0000141218.json',
        },
      ]
      const espots = espotSelectors.getProductListEspots(state)
      expect(espots).toEqual(expected)
    })

    it('should return empty array if no espots are present', () => {
      const espots = espotSelectors.getProductListEspots()
      expect(espots).toEqual([])
    })
  })

  describe('abandonmentEspotErrored', () => {
    ;[true, false].forEach((bool) => {
      const state = {
        espot: {
          errors: {
            abandonmentModalError: bool,
          },
        },
      }

      it(`should return ${bool} from the abandonmentModalError state`, () => {
        expect(espotSelectors.abandonmentEspotErrored(state)).toBe(bool)
      })
    })
  })
})
