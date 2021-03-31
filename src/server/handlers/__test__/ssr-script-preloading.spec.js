import nock from 'nock'
import Helmet from 'react-helmet'

import { createUnauthedReq } from './testHelpers/request'
import { createReplyMocks } from './testHelpers/reply'

import { serverSideRenderer } from '../server-side-renderer'

jest.mock('../../lib/get-assets-util')

import * as getAssets from '../../lib/get-assets'
import { generateAssets } from '../../lib/get-assets-util'

const fakeGeneratedAssets = {
  js: {
    'common/vendor.js': 'fakeAssets/common/vendor.js',
    'common/bundle.js': 'fakeAssets/common/bundle.js',
    'common/Home.js': 'fakeAssets/common/Home.js',
  },
}

describe('Server side render preloading scripts', () => {
  let originalFunctionalTests
  beforeAll(() => {
    Helmet.canUseDOM = false

    originalFunctionalTests = process.env.FUNCTIONAL_TESTS
    process.env.FUNCTIONAL_TESTS = ''
  })

  afterAll(() => {
    process.env.FUNCTIONAL_TESTS = originalFunctionalTests
  })

  beforeEach(jest.clearAllMocks)

  afterEach(nock.cleanAll)

  it('should preload the generated vendor, bundle and async chunk for SSRed route', async () => {
    nock('http://localhost:3000')
      .persist()
      .get(/.*/)
      .reply(200, {})

    const homeRoute = '/'
    const fakeReq = createUnauthedReq(homeRoute)
    const { mockReply, mockCode, mockView } = createReplyMocks()

    generateAssets.mockReturnValue(fakeGeneratedAssets)
    jest.spyOn(getAssets, 'getPreloadScripts')

    await serverSideRenderer(fakeReq, mockReply)

    expect(getAssets.getPreloadScripts).toHaveBeenCalled()
    expect(mockCode).toHaveBeenCalledWith(200)

    const viewData = mockView.mock.calls[0][1]
    expect(viewData.preloadScripts).toBe(
      [
        '<link rel="preload" href="fakeAssets/common/vendor.js" as="script" />',
        '<link rel="preload" href="fakeAssets/common/bundle.js" as="script" />',
        '<link rel="preload" href="fakeAssets/common/Home.js" as="script" />',
      ].join('\n')
    )
  })

  it('should defer MCR script', async () => {
    const mcrScript = {
      src: '/assets/content/cms/script.38c61f7e41e990558de70a14550376b1.js',
      type: 'text/javascript',
    }

    nock('http://localhost:3000')
      .persist()
      .get(/^\/((?!cmscontent).*)$/)
      .reply(200, {})

    nock('http://localhost:3000')
      .persist()
      .get(/\/cmscontent.*/)
      .reply(200, {
        head: {
          script: [mcrScript],
        },
      })

    generateAssets.mockReturnValue(fakeGeneratedAssets)

    const fakeReq = createUnauthedReq('/')
    const { mockReply, mockView, mockCode } = createReplyMocks()

    await serverSideRenderer(fakeReq, mockReply)

    expect(mockCode).toHaveBeenCalledWith(200)

    const viewData = mockView.mock.calls[0][1]
    const { scripts } = viewData
    expect(scripts).toContain(mcrScript.src)

    const scriptsArrayJSON = scripts.match(/window.loadScripts\((.+)\)/)[1]
    const scriptsArray = JSON.parse(scriptsArrayJSON)
    const mcrScriptToLoad = scriptsArray.find(
      (script) => script.src === mcrScript.src
    )
    expect(mcrScriptToLoad.defer).toBe(true)
    expect(mcrScriptToLoad.isAsync).toBe(true)
  })
})
