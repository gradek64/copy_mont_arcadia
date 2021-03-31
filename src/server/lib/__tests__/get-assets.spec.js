import { getScripts, getPreloadScripts } from '../get-assets'

// Fake Assets
jest.mock('../get-assets-util', () => ({
  generateAssets: () => {
    return {
      css: {
        'tsuk/styles.css': 'AAAAAA',
      },
      js: {
        'common/vendor.js': 'CCCCC',
        'common/bundle.js': 'CCCCC',
        'common/service-desk.js': 'DDDD',
      },
    }
  },
  disableClientAppAccess: jest.fn(),
}))

describe('get-assets', () => {
  const mockChunks = [
    './fakeChunk/Home.js',
    './fakeChunk/PLP.js',
    './fakeChunk/PDP.js',
  ]

  describe('getPreloadScripts', () => {
    it('should generate preload links', () => {
      const result = getPreloadScripts(mockChunks)

      expect(result).toMatchSnapshot()

      const links = result.split('\n')

      links.forEach((link) => {
        expect(link).toContain('rel="preload"')
        expect(/href="[^"]+"/.test(link)).toBe(true)
        expect(link).toContain('as="script"')
      })

      expect(links.length).toBe(5)
    })
  })

  describe('getScripts', () => {
    it('should generate scripts', () => {
      expect(
        getScripts({ opentagRef: 'hello', chunks: mockChunks })
      ).toMatchSnapshot()
    })
    it('should exclude qubit', () => {
      expect(getScripts({ chunks: mockChunks })).toMatchSnapshot()
    })

    it('should include qubit', () => {
      expect(
        getScripts({ opentagRef: 'hello', chunks: mockChunks })
      ).toMatchSnapshot()
    })
    it('should include qubit and experiences (smartServe)', () => {
      expect(
        getScripts({
          opentagRef: 'hello',
          chunks: mockChunks,
          smartServeId: 10,
        })
      ).toMatchSnapshot()
    })
    it('should add trustarc third party script if FEATURE_COOKIE_MANAGER is enabled', () => {
      const features = {
        status: {
          FEATURE_COOKIE_MANAGER: true,
        },
      }
      const lang = 'en'
      const trustArcDomain = 'topshop.com'
      const brandName = 'topshop'
      const region = 'uk'
      expect(
        getScripts({
          features,
          lang,
          trustArcDomain,
          brandName,
          region,
          chunks: mockChunks,
        })
      ).toMatchSnapshot()
    })
    it('should not add trustarc third party script if FEATURE_COOKIE_MANAGER is disabled', () => {
      const features = {
        status: {
          FEATURE_COOKIE_MANAGER: false,
        },
      }
      const lang = 'en'
      expect(
        getScripts({ features, lang, chunks: mockChunks })
      ).toMatchSnapshot()
    })
    it('should generate MCR scripts', () => {
      expect(
        getScripts({ mcrScript: [{ src: 'random_src' }], chunks: mockChunks })
      ).toMatchSnapshot()
    })
    it('should not generate MCR scripts', () => {
      expect(
        getScripts({ mcrScript: undefined, chunks: mockChunks })
      ).toMatchSnapshot()
    })
  })
})
