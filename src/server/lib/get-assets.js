import { readFileSync } from 'fs'
import { path } from 'ramda'
import { resolve } from 'path'
import { generateAssets, disableClientAppAccess } from './get-assets-util'
import privacyPolicyUrls from '../../shared/components/common/PrivacyNotice/PrivacyPolicyUrls.json'

const loaderPath = resolve(__dirname, './client-script-loader.js')
const loaderScript = readFileSync(loaderPath, 'utf8')
const preloadScriptsSrcs = ['common/vendor.js', 'common/bundle.js']
/* Use preloading to ensure that loading important
 *  scripts are not blocked by other lower priority
 *  assets loading.
 */
export function getPreloadScripts(chunks) {
  const generatedAssets = generateAssets()
  const chunksMapped = chunks.map((href) => ({
    src: href,
  }))

  return preloadScriptsSrcs
    .map((href) => ({ src: generatedAssets.js[href] }))
    .concat(chunksMapped)
    .map(({ src }) => `<link rel="preload" href="${src}" as="script" />`)
    .join('\n')
}
export function getScripts({
  region,
  lang,
  features = {},
  smartServeId,
  trustArcDomain,
  brandName,
  mcrScript = undefined,
  chunks,
}) {
  const generatedAssets = generateAssets()
  const mappedPreloadedScripts = preloadScriptsSrcs.map((src) => ({
    src: generatedAssets.js[src],
  }))
  let scriptsToLoad = [
    ...chunks.map((chunkSrc) => ({ src: chunkSrc })),
    ...mappedPreloadedScripts,
    {
      src: generatedAssets.js['common/service-desk.js'],
      afterLoad: true,
    },
    ...(path(['status', 'FEATURE_COOKIE_MANAGER'], features)
      ? [
          {
            afterLoad: true,
            isAsync: true,
            src: `//consent.trustarc.com/notice?domain=${trustArcDomain}&c=teconsent&language=${lang}&js=nj&noticeType=bb&gtm=1&privacypolicylink=${privacyPolicyUrls[brandName][region]}&cookieLink=${privacyPolicyUrls[brandName][region]}`,
          },
        ]
      : []),
  ]

  if (mcrScript) {
    const mappedScript = mcrScript.map((script) => {
      return {
        src: script.src,
        defer: true,
        isAsync: true,
      }
    })
    scriptsToLoad = [...scriptsToLoad, ...mappedScript]
  }

  if (smartServeId) {
    const smartServeScript = {
      defer: true,
      isAsync: true,
      src: `https://static.goqubit.com/smartserve-${smartServeId}.js`,
    }
    scriptsToLoad = [...scriptsToLoad, smartServeScript]
  }

  const scripts = [
    disableClientAppAccess(),
    loaderScript,
    `window.loadScripts(${JSON.stringify(scriptsToLoad)})`,
  ]

  return `<script type="text/javascript">${scripts.join(';')}</script>`
}
