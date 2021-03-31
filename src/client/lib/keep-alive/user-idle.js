import throttle from 'lodash.throttle'

const idleTime = 1000 * 30
let isIdle = false
let userActivityTimeout
let activityCb = () => {}

const userIdleMonitor = () => {
  window.clearTimeout(userActivityTimeout)
  if (isIdle) {
    isIdle = false
    activityCb()
  }
  userActivityTimeout = window.setTimeout(() => {
    isIdle = true
  }, idleTime)
}

document.addEventListener('click', userIdleMonitor, { passive: true })
document.addEventListener('touchstart', userIdleMonitor, { passive: true })
document.addEventListener(
  'scroll',
  throttle(userIdleMonitor, 1000, { trailing: false }),
  { passive: true }
)

export const onUserActiveFromIdle = (fn) => {
  activityCb = fn
}

export const userIsIdle = () => isIdle

// initialise
export const initialise = () => userIdleMonitor()
