export const allowDebug = () => ({ type: 'ALLOW_DEBUG' })
export const setDebugInfo = (payload) => ({
  type: 'SET_DEBUG_INFO',
  ...payload,
})
export const showDebug = () => ({ type: 'SHOW_DEBUG' })
export const hideDebug = () => ({ type: 'HIDE_DEBUG' })
