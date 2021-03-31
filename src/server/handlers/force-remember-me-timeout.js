import Boom from 'boom'

// This code allows us to simulate a WCS remember me timeout in dev
// you can curl /api/force-remember-me-timeout?jsessionid=someJsessionId to cause the timeout
// or just go to /api/force-remember-me-timeout in the browser once you have a session cookie
const armedJsessionIds = {}

function disarmJsessionid(jsessionid) {
  delete armedJsessionIds[jsessionid]
}

/**
 * Resets the timeout and returns a resolved
 * promise which represents the expected WCS response
 *
 * @param {String} jsessionid the jsessionid for which to run the simulation
 *
 * @returns A resolved promise representing a remember me timeout
 */
export function simulateRememberMeTimeout(jsessionid) {
  disarmJsessionid(jsessionid)

  return Promise.resolve({
    body: {
      success: false,
      isLoggedIn: true,
      rememberMeLogonForm: {
        loginForm: {
          logonId: 'test@testing.com',
          rememberMe: true,
        },
      },
      personal_details: {
        registerType: 'R',
        profileType: 'C',
      },
      MiniBagForm: {
        products: {
          Product: [],
        },
      },
    },
  })
}

/**
 * Returns true if the simulated timeout is triggered to run, otherwise returns false.
 *
 * @param {String} jsessionid the jsessionid for which the timeout may be armed
 *
 * @returns {Boolean} is the timeout armed
 */
export function isRememberMeTimeoutArmed(jsessionid) {
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
    message: `'Remember Me' timeout is armed for ${jsessionid}`,
  })
}
