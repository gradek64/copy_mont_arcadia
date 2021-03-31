/* eslint-disable */

var listening = false
var hijacking = false
var hijack = function() {} // noop

// determine if the current element and event can be hijacked, returning
// the pathname if so, after preventingDefault
function tryHijack(evt, elem) {
  if (elem.href && elem.href.includes('insideout.topshop.com')) {
    // In case of lfw Blog Feed link we don't want the hijacking to be executed.
    return false
  }
  if (elem.tagName && elem.tagName === 'A') {
    evt.preventDefault() // hijack link
    return elem.pathname + elem.search // and return its pathname & querystring
  } else {
    return false
  }
}

function clickHandler(evt) {
  if (!hijacking) {
    return true
  }

  var pathname = tryHijack(evt, evt.target)

  if (pathname) {
    hijack(pathname)
  } else {
    // walk the parents, looking for an anchor
    var current = evt.target.parentElement
    while (current !== null) {
      pathname = tryHijack(evt, current)
      if (pathname) {
        hijack(pathname)
        break
      } else {
        current = current.parentElement
      }
    }
  }
  return false
}
// allow diabling && enabling
function enable() {
  return (hijacking = true)
}

function disable() {
  return (hijacking = false)
}

function isHijacking() {
  return hijacking
}

// expose these functions
var facade = {
  isHijacking: isHijacking,
  enable: enable,
  disable: disable,
}

export default function linkHijack(callback) {
  // only throw if we're not already setup
  if (!listening && typeof callback !== 'function') {
    throw new Error('expected a callback for hijacking')
  }

  // not listening means we've not setup
  if (!listening) {
    // set our hijack function to be the one passed in
    hijack = callback
    document.addEventListener('click', clickHandler, true)
    // set states
    listening = true
    hijacking = true
  }

  return facade
}
