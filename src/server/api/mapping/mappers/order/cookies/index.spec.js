import { klarnaCookies } from './index'
import { klarnaCookieOptions } from '../../../../../lib/auth'

const klarnaCreateSessionCookies = [
  {
    name: 'klarnaSessionId',
    options: klarnaCookieOptions,
    value: 'foo',
  },
  {
    name: 'klarnaClientToken',
    options: klarnaCookieOptions,
    value: 'bar',
  },
]

describe('Cookies to set', () => {
  describe('klarnaCookies', () => {
    it('should return the cookies set when creating a Klarna session', () => {
      expect(klarnaCookies({ sessionId: 'foo', clientToken: 'bar' })).toEqual(
        klarnaCreateSessionCookies
      )
    })
  })
})
