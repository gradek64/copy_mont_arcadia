import React from 'react'
import { browserHistory } from 'react-router'
import { assocPath, path } from 'ramda'
import { dispatch } from './get-value-from-store'
import { showSizeGuide, setSizeGuide } from '../actions/common/productsActions'
import { setProductIdQuickview } from '../actions/common/quickviewActions'
import { addDDPToBag } from '../actions/common/ddpActions'
import { showModal } from '../actions/common/modalActions'
import ProductQuickview from '../components/containers/ProductQuickview/ProductQuickview'
import uuid from 'uuid'
import { isIE11 } from './browser'
import { desktop, laptop } from '../constants/viewportConstants'

const getSandboxId = (pathname) => `Sandbox-${pathname}`

// adds/removes properties from window.sandbox object.
const setDataOnWindow = (data, path) => {
  window.sandbox = path ? assocPath(path, data, window.sandbox) : data
}

function unmountPreviousSandboxDOMNode(id) {
  if (window.sandbox && window.sandbox.unmounter) {
    window.sandbox.unmounter(id)
  }
}

function mapMountedSandboxDOMNodeToBundle() {
  if (
    !window.sandbox ||
    typeof window.sandbox.applyBundleMapping !== 'function'
  )
    return

  window.sandbox.applyBundleMapping()
}

function applyBundleMapping() {
  if (!Array.isArray(this.toBeMapped) || !this.toBeMapped.length) return // there is nothing to map

  const allItems = this.toBeMapped.filter((item) => {
    const bundle = item.props.bundle
    const func = this.jsBundles[bundle]
    if (func) {
      const componentDivId = getSandboxId(item.id)
      func(componentDivId, item.props) // render(<Comp {...item.props}/>, document.getElementById(`Sandbox-${item.id}`))

      window.sandbox.mapped.push(componentDivId) // we will use this to unmount this component (avoid memot) when another one is mounted e.g.: e-receipts -> students

      return false
    }
    return true
  })
  setDataOnWindow(allItems, ['toBeMapped'])
}

const historyPush = (url) => browserHistory.push(url)

const openQuickViewProduct = (productId) => {
  dispatch(setProductIdQuickview(productId))
  dispatch(showModal(<ProductQuickview />, { mode: 'sandboxQuickview' }))
}

// @TODO: Remove this API as soon as a SideBar has been implemented inside Monty-CMS.
const openSizeGuideDrawer = (sizeGuideType) => {
  dispatch((dispatch, getState) => {
    const state = getState()
    const {
      viewport: { media },
    } = state
    if (media === 'mobile') {
      historyPush(`/size-guide/${sizeGuideType}`)
    } else {
      dispatch(setSizeGuide(sizeGuideType))
      dispatch(showSizeGuide())
    }
  })
}

const addDDPToBasket = (skuId) => {
  dispatch(addDDPToBag(skuId))
}

const listeners = {
  get: [],
  set: [],
}

const registerListener = (operation, listener) => {
  if (!operation || (operation !== 'get' && operation !== 'set')) {
    throw new Error('Invalid proxy operation')
  }

  if (!listener || typeof listener !== 'function') {
    throw new Error('No sandbox listener provided.')
  }

  if (isIE11()) return

  const id = uuid()
  listeners[operation].push({
    id,
    listener,
  })
  return id
}

const removeListener = (operation, listenerId) => {
  if (!operation || (operation !== 'get' && operation !== 'set')) {
    throw new Error('Invalid proxy operation')
  }

  if (!listenerId) {
    throw new Error('listenerId required to detach listener')
  }

  listeners[operation] = listeners[operation].filter(
    ({ id }) => id !== listenerId
  )
}

const getHandler = (target, property, value, receiver) => {
  listeners.get.forEach(({ listener }) =>
    listener(target, property, value, receiver)
  )
  return target[property]
}

const setHandler = (target, property, value, receiver) => {
  listeners.set.forEach(({ listener }) =>
    listener(target, property, value, receiver)
  )
  target[property] = value
  return true
}

const mappedHandlers = {
  get: getHandler,
  set: setHandler,
}

// Initialize window.sandbox.
const checkCmsInit = () => {
  if (!window.sandbox || !window.sandbox.applyBundleMapping) {
    const dataSetByBundles = path(['sandbox', 'jsBundles'], window)
    setDataOnWindow({
      jsBundles: {
        ...dataSetByBundles,
      },
      toBeMapped: [],
      mapped: isIE11() ? [] : new Proxy([], mappedHandlers),
      applyBundleMapping,
      historyPush,
      openQuickViewProduct,
      openSizeGuideDrawer,
      addDDPToBasket,
    })
  }
}

const addElementToQueue = (id, props) => {
  const newItem = { id, props }
  const currentMapping = window.sandbox.toBeMapped
  const newMapping = currentMapping ? [...currentMapping, newItem] : [newItem]
  setDataOnWindow(newMapping, ['toBeMapped'])
}

const updateNewSandBox = (id, props) => {
  checkCmsInit()
  addElementToQueue(id, props)
}

// TODO remove this once WCS fixes URLs https://arcadiagroup.atlassian.net/browse/DES-3766
export const fixCmsUrl = (responsiveCMSUrl) => {
  if (!responsiveCMSUrl) {
    return ''
  }

  return responsiveCMSUrl.startsWith('/')
    ? responsiveCMSUrl
    : `/${responsiveCMSUrl}`
}

const sanitiseLocation = (location) => {
  if (!location) return null
  let { pathname } = location

  /**
   * Urls must be encoded over the wire
   */
  if (pathname && pathname.indexOf('/') !== -1) {
    /**
     * Client & Server handle accented urls differently.
     * If the accent's aren't encoded, encode them before encoding the path,
     * as opposed to sending the request in two different 'formats'
     */
    if (pathname === decodeURI(pathname)) {
      pathname = encodeURI(pathname)
    }

    pathname = encodeURIComponent(pathname)
  }

  return {
    pathname,
    search: location.search,
  }
}

/**
 * Making sure that if viewport media is laptop then we switch this to desktop as mcr doesnt know much about laptop view
 * @param queryParams
 * @returns {*|{viewPortMedia: string}}
 */
const updateViewportMedia = (queryParams) => {
  const viewPortMedia = path(['viewportMedia'], queryParams)

  if (viewPortMedia === laptop) {
    return {
      ...queryParams,
      viewportMedia: desktop,
    }
  }

  return queryParams
}

export default {
  updateNewSandBox,
  unmountPreviousSandboxDOMNode,
  mapMountedSandboxDOMNodeToBundle,
  sanitiseLocation,
  registerListener,
  removeListener,
  getSandboxId,
  updateViewportMedia,
}
