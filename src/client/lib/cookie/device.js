/**
 * @see https://51degrees.com/blog/website-optimisation-for-apple-devices-ipad-and-iphone
 */
function getiPadModel() {
  // Create a canvas element which can be used to retreive information about the GPU.
  let renderer
  const canvas = document.createElement('canvas')
  if (canvas) {
    const context =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (context) {
      const info = context.getExtension('WEBGL_debug_renderer_info')
      if (info) {
        renderer = context.getParameter(info.UNMASKED_RENDERER_WEBGL)
      }
    }
  }

  if (window.screen.height / window.screen.width === 1024 / 768) {
    // iPad, iPad 2, iPad Mini
    if (window.devicePixelRatio === 1) {
      switch (renderer) {
        default:
          return 'iPad, iPad 2, iPad Mini'
        case 'PowerVR SGX 535':
          return 'iPad'
        case 'PowerVR SGX 543':
          return 'iPad 2 or Mini'
      }
      // iPad 3, 4, 5, 6, Mini 2, Mini 3, Mini 4, Air, Air 2
    } else {
      switch (renderer) {
        default:
          return 'iPad 3, 4, 5, 6, Mini 2, Mini 3, Mini 4, Air, Air 2'
        case 'PowerVR SGX 543':
          return 'iPad 3'
        case 'PowerVR SGX 554':
          return 'iPad 4'
        case 'Apple A7 GPU':
          return 'iPad Air, Mini 2, Mini 3'
        case 'Apple A8X GPU':
          return 'iPad Air 2'
        case 'Apple A8 GPU':
          return 'iPad Mini 4'
        case 'Apple A9 GPU':
          return 'iPad 5, Pro 9.7'
        case 'Apple A10 GPU':
          return 'iPad 6'
      }
    }
    // iPad Pro 10.5
  } else if (window.screen.height / window.screen.width === 1112 / 834) {
    return 'iPad Pro 10.5'
    // iPad Pro 11
  } else if (window.screen.height / window.screen.width === 2388 / 1668) {
    return 'iPad Pro 11'
    // iPad Pro 12.9, Pro 12.9 (2nd Gen), Pro 12.9 (3rd Gen)
  } else if (window.screen.height / window.screen.width === 1366 / 1024) {
    switch (renderer) {
      default:
        return 'iPad Pro 12.9, Pro 12.9 (2nd Gen), Pro 12.9 (3rd Gen)'
      case 'Apple A12X GPU':
        return 'iPad Pro 12.9 (3rd Gen)'
      case 'Apple A10X GPU':
        return 'iPad Pro 12.9 (2nd Gen)'
      case 'Apple A9 GPU':
        return 'iPad Pro 12.9'
    }
  } else {
    return 'Not an iPad'
  }
}

export function setiPadModelVariableForIPad() {
  const version = getiPadModel()
  if (version === 'Not an iPad') return

  window.iPadModel = version
}
