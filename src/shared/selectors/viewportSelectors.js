import { path, contains } from 'ramda'
import { createSelector } from 'reselect'
import breakpoints from '../constants/responsive'

const viewPortsOrderedArray = ['mobile', 'tablet', 'laptop', 'desktop']

const getViewport = (state) => (state && state.viewport ? state.viewport : {})

const isBreakpoint = (breakpoint) =>
  createSelector(getViewport, (viewport) => viewport.media === breakpoint)

export const isMobile = isBreakpoint('mobile')
export const isDesktop = isBreakpoint('desktop')
export const isTablet = isBreakpoint('tablet')

function isViewPort(isMax, state) {
  return (viewPortName) => {
    const currentViewPort = path(['viewport', 'media'], state)
    if (!currentViewPort) return false
    const currentViewPortIndex = viewPortsOrderedArray.findIndex(
      (i) => i === viewPortName
    )
    const viewPortNamesArray = isMax
      ? viewPortsOrderedArray.slice(0, currentViewPortIndex + 1)
      : viewPortsOrderedArray.slice(currentViewPortIndex)
    return contains(currentViewPort, viewPortNamesArray)
  }
}

export const getWindowWidth = (state) => {
  const { width } = getViewport(state)

  return width || 0
}

export const getWindowHeight = (state) => {
  const { height } = getViewport(state)

  return height || 0
}

export function isMinViewPort(viewportName) {
  return (dispatch, getState) => isViewPort(false, getState())(viewportName)
}

export function isMaxViewPort(state) {
  return isViewPort(true, state)
}

export function isMobileBreakpoint(state) {
  return getWindowWidth(state) <= breakpoints.mobile.max
}

export const getHeight = getWindowHeight

export const isPortrait = (state) =>
  getWindowHeight(state) >= getWindowWidth(state)
export const isLandscape = (state) =>
  getWindowWidth(state) > getWindowHeight(state)

export const getViewportMedia = path(['viewport', 'media'])
