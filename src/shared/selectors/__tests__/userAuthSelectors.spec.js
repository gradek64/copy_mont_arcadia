import * as userAuthSelectors from '../userAuthSelectors'
import { isFeatureRememberMeEnabled } from '../featureSelectors'

jest.mock('../featureSelectors')

describe('isUserAuthenticated', () => {
  it('returns false if user is not authenticated', () => {
    expect(
      userAuthSelectors.isUserAuthenticated({
        auth: {
          authentication: false,
        },
      })
    ).toBe(false)
  })

  it('returns false if user is partially authenticated', () => {
    expect(
      userAuthSelectors.isUserAuthenticated({
        auth: {
          authentication: 'partial',
        },
      })
    ).toBe(false)
  })

  it('returns true if user is fully authenticated', () => {
    expect(
      userAuthSelectors.isUserAuthenticated({
        auth: {
          authentication: 'full',
        },
      })
    ).toBe(true)
  })

  it('returns true when rememberMe feature is enabled and user is fully authenticated', () => {
    isFeatureRememberMeEnabled.mockReturnValue(true)

    expect(
      userAuthSelectors.isUserAuthenticated({
        auth: {
          authentication: 'full',
        },
      })
    ).toBe(true)
  })

  it('returns false when rememberMe feature is enabled and user is partially authenticated', () => {
    isFeatureRememberMeEnabled.mockReturnValue(true)

    expect(
      userAuthSelectors.isUserAuthenticated({
        auth: {
          authentication: 'partial',
        },
      })
    ).toBe(false)
  })
})

describe('isUserPartiallyAuthenticate', () => {
  it('returns false if user is not authenticated', () => {
    expect(
      userAuthSelectors.isUserPartiallyAuthenticated({
        auth: {
          authentication: false,
        },
      })
    ).toBe(false)
  })

  it('returns true if user is partially authenticated', () => {
    expect(
      userAuthSelectors.isUserPartiallyAuthenticated({
        auth: {
          authentication: 'partial',
        },
      })
    ).toBe(true)
  })

  it('returns false if user is fully authenticated', () => {
    expect(
      userAuthSelectors.isUserPartiallyAuthenticated({
        auth: {
          authentication: 'full',
        },
      })
    ).toBe(false)
  })
})

describe('isUserAtLeastPartiallyAuthenticated', () => {
  function createAuthState(level) {
    return {
      auth: {
        authentication: level,
      },
    }
  }

  it('should return true if the user is fully authenticated', () => {
    const fullAuthState = createAuthState('full')

    expect(
      userAuthSelectors.isUserAtLeastPartiallyAuthenticated(fullAuthState)
    ).toBe(true)
  })

  it('should return true if the user is partially authenticated', () => {
    const partialAuthState = createAuthState('partial')

    expect(
      userAuthSelectors.isUserAtLeastPartiallyAuthenticated(partialAuthState)
    ).toBe(true)
  })

  it('should return false if the user is not authenticated at all', () => {
    const notAuthState = createAuthState(false)

    expect(
      userAuthSelectors.isUserAtLeastPartiallyAuthenticated(notAuthState)
    ).toBe(false)
  })

  it('should default to false', () => {
    expect(userAuthSelectors.isUserAtLeastPartiallyAuthenticated({})).toBe(
      false
    )
  })
})
