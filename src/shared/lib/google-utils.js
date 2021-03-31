import { path } from 'ramda'

/**
 * @typedef LocationProps
 * @property {number} currentLat
 * @property {number} currentLng
 * @property {Array.<[number, number]>} markers
 */

/**
 * Takes properties used to determine location of google maps and the positions of
 * any location markers, and compares them to find any changes.
 * @param {LocationProps} props
 * @param {LocationProps} prevProps
 * @returns {boolean}
 */
export const latLngOrMarkersHaveChanged = (props, prevProps) => {
  const { currentLat, currentLng, markers } = props
  return (
    currentLat !== prevProps.currentLat ||
    currentLng !== prevProps.currentLng ||
    markers.length !== prevProps.markers.length
  )
}

/**
 * This functions takes a google maps service name and returns when it is
 * available to use.
 *
 * It will check 10 times before throwing an error, the default interval is 3 seconds.
 */
export const pollForGoogleService = (servicePath, interval = 3000) => {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(servicePath) || !servicePath.length)
      return reject('No google service specified')

    let count = 0
    const maxCount = 30000 / interval

    const runner = () => {
      if (
        process.browser &&
        window.google &&
        window.google.maps &&
        path(servicePath, window.google.maps)
      ) {
        // eslint-disable-next-line no-use-before-define
        clearInterval(Interval)
        return resolve()
      }

      if (count >= maxCount) {
        // eslint-disable-next-line no-use-before-define
        clearInterval(Interval)
        if (!window.google) {
          reject(`Google object not found in time`)
        } else if (!window.google.maps) {
          reject(`Google maps object not found in time`)
        } else {
          reject(`No Google service '${servicePath.join('.')}' found in time`)
        }
      }
      count += 1
    }

    const Interval = setInterval(runner, interval)
    runner()
  })
}
