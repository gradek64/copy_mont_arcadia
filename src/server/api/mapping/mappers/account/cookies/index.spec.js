import {
  logonHeaders,
  logonCookies,
  logoutCookies,
  registerCookies,
  authenticatedCookies,
} from './index'

import {
  cookieOptions,
  cookieOptionsBag,
  cookieOptionsAuth,
  cookieOptionsUserSeg,
  cookieOptionsUnset,
} from '../../../../../lib/auth'

const logonSetCookies = [
  {
    name: 'bvToken',
    options: cookieOptions,
    value: 'bvTokenValue',
  },
  {
    name: 'bagCount',
    options: cookieOptionsBag,
    value: '1',
  },
  {
    name: 'userSeg',
    options: cookieOptionsUserSeg,
    value: null,
  },
  {
    name: 'authenticated',
    options: cookieOptionsAuth,
    value: 'yes',
  },
  {
    name: 'klarnaClientToken',
    options: cookieOptionsUnset,
    value: null,
  },
  {
    name: 'klarnaSessionId',
    options: cookieOptionsUnset,
    value: null,
  },
]

const logonSetHeaders = [
  {
    name: 'bvtoken',
    value: 'bvTokenValue',
  },
]

const logoutSetCookies = [
  {
    name: 'bvToken',
    value: null,
    options: cookieOptionsUnset,
  },
  {
    name: 'bagCount',
    value: null,
    options: cookieOptionsUnset,
  },
  {
    name: 'authenticated',
    value: null,
    options: cookieOptionsAuth,
  },
  {
    name: 'userSeg',
    options: cookieOptionsUnset,
    value: null,
  },
  {
    name: 'klarnaClientToken',
    value: null,
    options: cookieOptionsUnset,
  },
  {
    name: 'klarnaSessionId',
    value: null,
    options: cookieOptionsUnset,
  },
]

const registerSetCookies = [
  {
    name: 'authenticated',
    options: cookieOptionsAuth,
    value: 'yes',
  },
  {
    name: 'bvToken',
    options: cookieOptions,
    value: 'bvTokenValue',
  },
]

const authenticatedSetCookies = [
  {
    name: 'authenticated',
    value: 'yes',
    options: cookieOptionsAuth,
  },
]

describe('cookies to set', () => {
  describe('logonCookies', () => {
    it('returns the cookies to set for Logon', () => {
      expect(logonCookies({ basketItemCount: 1 }, 'bvTokenValue')).toEqual(
        logonSetCookies
      )
    })
  })
  describe('logonHeaders', () => {
    it('returns the headers to set for Logon', () => {
      expect(logonHeaders('bvTokenValue')).toEqual(logonSetHeaders)
    })
  })
  describe('logoutCookies', () => {
    it('returns the cookies to set for Logout', () => {
      expect(logoutCookies()).toEqual(logoutSetCookies)
    })
  })
  describe('registerCookies', () => {
    it('returns the cookies to set for Register', () => {
      expect(registerCookies('bvTokenValue')).toEqual(registerSetCookies)
    })
  })
  describe('authenticatedCookies', () => {
    it('returns the cookies to set for authenticatation', () => {
      expect(authenticatedCookies()).toEqual(authenticatedSetCookies)
    })
  })
})
