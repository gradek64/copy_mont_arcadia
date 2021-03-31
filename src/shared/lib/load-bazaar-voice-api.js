function loadScript(brandName, bazaarVoiceId) {
  return new Promise((resolve) => {
    const src = `${
      window.location.protocol
    }//${brandName}.ugc.bazaarvoice.com/static/${bazaarVoiceId}/bvapi.js`

    window.loadScript({ src, isAsync: true, onload: resolve })
  })
}

export default function loadBazaarVoiceApi(brandName, bazaarVoiceId, callback) {
  return new Promise((resolve) => {
    loadScript(brandName, bazaarVoiceId).then(() => {
      if (callback) {
        callback()
      }
      const waitForBazaarToFullyLoad = setInterval(() => {
        if (document.getElementById('BVRRContentContainerID')) {
          clearInterval(waitForBazaarToFullyLoad)
          resolve()
        }
      }, 25)
    })
  })
}
