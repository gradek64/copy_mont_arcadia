import Boom from 'boom'

// This code allows us to simulate a WCS timeout in dev
// you can curl /api/force-timeout?jsessionid=someJsessionId to cause the timeout
// or just go to /api/force-timeout in the browser once you have a session cookie
const armedJsessionIds = {}

function disarmJsessionid(jsessionid) {
  delete armedJsessionIds[jsessionid]
}

/**
 * Simulates a WCS timeout and disarms the timeout
 *
 * @param {String} jsessionid the jsessionid for which to run the simulation
 *
 * @returns a resolved promise with the value of a timeout error
 */
export function simulateTimeout(jsessionid) {
  disarmJsessionid(jsessionid)

  return Promise.resolve({
    body: {
      timeout: true,
    },
    status: 200,
  })
}

/**
 * Returns true if the simulated timeout is armed, otherwise returns false.
 *
 * @param {String} jsessionid the jsessionid for which the timeout may be armed
 *
 * @returns {Boolean} is the timeout triggered
 */
export function isTimeoutArmed(jsessionid) {
  return !!armedJsessionIds[jsessionid]
}

function armForJsessionId(jsessionid) {
  armedJsessionIds[jsessionid] = true
}

// sets a flag to simulate a timeout for a given jsessionid
export default (req, reply) => {
  const { query, state } = req
  const jsessionid = state.jsessionid || query.jsessionid

  if (!jsessionid) {
    return reply(
      Boom.badRequest(
        'You must provide the jsessionid of the session in which you wish to run this simulation.'
      )
    )
  }

  armForJsessionId(jsessionid)

  setTimeout(() => {
    disarmJsessionid(jsessionid)
  }, 60000)

  reply({
    success: true,
    message: `Timeout is armed for ${jsessionid}`,
  })
}
