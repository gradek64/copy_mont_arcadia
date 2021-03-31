/* eslint-disable */

// This script is injected into browser without transipiling and must be ES5 compliant

var afterLoadScripts = []
window.loadScript = function(attrs) {
  var script = document.createElement('script')
  script.src = attrs.src
  script.async = attrs.isAsync
  script.defer = attrs.defer
  script.type = 'text/javascript'
  script.onload = attrs.onload
  script.onerror = attrs.onerror
  if (attrs.id) script.id = attrs.id
  if (attrs.afterLoad) {
    afterLoadScripts.push(script)
  } else {
    document.body.appendChild(script)
  }
}

window.addEventListener('load', function() {
  for (var i = 0; i < afterLoadScripts.length; i++) {
    document.body.appendChild(afterLoadScripts[i])
  }
})

window.loadScripts = function(scripts) {
  scripts.forEach(window.loadScript)
}

if (
  !(
    'Promise' in window &&
    'Map' in window &&
    'includes' in String.prototype &&
    'find' in Array.prototype
  )
) {
  window.loadScripts([
    {
      src: '//cdnjs.cloudflare.com/ajax/libs/core-js/2.5.1/shim.min.js',
      isAsync: false,
    },
  ])
}
