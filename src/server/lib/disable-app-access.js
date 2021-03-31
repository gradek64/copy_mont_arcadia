/* eslint no-undef:0 */
if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'object') {
  __REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function noop() {}
}

if (typeof window.devToolsExtension === 'function') {
  window.devToolsExtension = false
}
