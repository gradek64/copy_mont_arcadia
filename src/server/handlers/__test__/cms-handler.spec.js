import * as cmsHandler from '../cms-handler'
import * as superagent from '../../../shared/lib/superagent'

jest.mock('../../../shared/lib/superagent')

describe('cms-handler', () => {
  let mockReply
  let mockCode
  let recursiveSpy
  let postSpy
  let setSpy
  let sendSpy
  let redirectsSpy

  beforeAll(() => {
    jest.resetAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  describe('recursivelyFollowRedirectsAndSetCookies', () => {
    beforeEach(() => {
      mockReply = jest.fn()
      mockCode = jest.fn()
      mockReply.mockImplementation(
        jest.fn(() => {
          return { code: mockCode }
        })
      )
      recursiveSpy = jest.spyOn(
        cmsHandler,
        'recursivelyFollowRedirectsAndSetCookies'
      )
      postSpy = jest.spyOn(superagent.default, 'post')
      setSpy = jest.spyOn(superagent.default, 'set')
      sendSpy = jest.spyOn(superagent.default, 'send')
      redirectsSpy = jest.spyOn(superagent.default, 'redirects')
    })

    it('should call reply with an error when no action is provided', () => {
      cmsHandler.recursivelyFollowRedirectsAndSetCookies(
        mockReply,
        'post',
        {},
        undefined,
        'urlencoded-form'
      )

      expect(mockReply).toHaveBeenCalledWith(new Error('Empty location'))
    })

    it('should call reply with an error when there are more than 4 redirections', () => {
      cmsHandler.recursivelyFollowRedirectsAndSetCookies(
        mockReply,
        'post',
        {},
        'url/path',
        'urlencoded-form',
        [],
        5
      )

      expect(mockReply).toHaveBeenCalledWith(
        new Error('Maximum number of redirections exceeded')
      )
    })

    it('should not redirect when a valid response is immediately returned', async () => {
      const formData = {
        lord: 'have mercy',
      }

      redirectsSpy.mockReturnValueOnce({
        responseText:
          'Can a kangaroo jump higher than a house? Of course, a house doesn’t jump at all.',
        status: 200,
      })

      sendSpy.mockReturnValueOnce({
        redirects: redirectsSpy,
      })

      setSpy
        .mockReturnValueOnce({ set: setSpy })
        .mockReturnValueOnce({ set: setSpy })
        .mockReturnValueOnce({ send: sendSpy })

      postSpy.mockReturnValueOnce({
        set: setSpy,
      })

      await cmsHandler.recursivelyFollowRedirectsAndSetCookies(
        mockReply,
        'post',
        formData,
        'domain.tld/normalResponse',
        'urlencoded-form',
        [],
        0
      )

      expect(mockReply).toHaveBeenCalled()
      expect(mockCode).toHaveBeenCalledWith(200)
      expect(recursiveSpy).toHaveBeenCalledTimes(1)
      expect(recursiveSpy.mock.calls).toEqual([
        [
          expect.any(Function),
          'post',
          formData,
          'domain.tld/normalResponse',
          'urlencoded-form',
          [],
          0,
        ],
      ])
      expect(setSpy.mock.calls).toEqual([
        ['Content-Type', 'urlencoded-form'],
        [
          'User-Agent',
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
        ],
        ['Cookie', []],
      ])

      expect(postSpy.mock.calls).toEqual([
        ['domain.tld/normalResponse?geoip=noredirect'],
      ])
      expect(sendSpy.mock.calls).toEqual([[formData]])
    })

    it('should follow redirects by recursively calling itself and update cookies as it does it', async () => {
      const formData = {
        input: 'value',
      }

      redirectsSpy
        .mockImplementationOnce(() => {
          const errorMessage = {
            status: 302,
            response: {
              headers: {
                location: 'domain.tld/redirectPath002?geoip=noredirect',
                'set-cookie': 'Cookie: I5e6ftNpGsU',
              },
            },
          }

          throw errorMessage
        })
        .mockImplementationOnce(() => {
          const errorMessage = {
            status: 302,
            response: {
              headers: {
                location: 'domain.tld/redirectPath003?geoip=noredirect',
                'set-cookie': 'Cookie: Ye8mB6VsUHw',
              },
            },
          }

          throw errorMessage
        })
        .mockImplementationOnce(() => {
          return {
            responseText:
              'Can a kangaroo jump higher than a house? Of course, a house doesn’t jump at all.',
            status: 200,
          }
        })

      sendSpy
        .mockReturnValueOnce({
          redirects: redirectsSpy,
        })
        .mockReturnValueOnce({
          redirects: redirectsSpy,
        })
        .mockReturnValueOnce({
          redirects: redirectsSpy,
        })

      setSpy
        .mockReturnValueOnce({ set: setSpy })
        .mockReturnValueOnce({ set: setSpy })
        .mockReturnValueOnce({ send: sendSpy })
        .mockReturnValueOnce({ set: setSpy })
        .mockReturnValueOnce({ set: setSpy })
        .mockReturnValueOnce({ send: sendSpy })
        .mockReturnValueOnce({ set: setSpy })
        .mockReturnValueOnce({ set: setSpy })
        .mockReturnValueOnce({ send: sendSpy })

      postSpy.mockReturnValueOnce({
        set: setSpy,
      })

      await cmsHandler.recursivelyFollowRedirectsAndSetCookies(
        mockReply,
        'post',
        formData,
        'domain.tld/redirectPath001',
        'urlencoded-form',
        [],
        0
      )

      expect(mockReply).toHaveBeenCalled()
      expect(mockCode).toHaveBeenCalledWith(200)
      expect(recursiveSpy).toHaveBeenCalledTimes(3)

      expect(setSpy.mock.calls).toEqual([
        ['Content-Type', 'urlencoded-form'],
        [
          'User-Agent',
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
        ],
        ['Cookie', []],
        ['Content-Type', 'urlencoded-form'],
        [
          'User-Agent',
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
        ],
        ['Cookie', ['Cookie: I5e6ftNpGsU']],
        ['Content-Type', 'urlencoded-form'],
        [
          'User-Agent',
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
        ],
        ['Cookie', ['Cookie: I5e6ftNpGsU', 'Cookie: Ye8mB6VsUHw']],
      ])

      expect(recursiveSpy.mock.calls).toEqual([
        [
          expect.any(Function),
          'post',
          formData,
          'domain.tld/redirectPath001',
          'urlencoded-form',
          [],
          0,
        ],
        [
          expect.any(Function),
          'post',
          formData,
          'domain.tld/redirectPath002?geoip=noredirect',
          'urlencoded-form',
          ['Cookie: I5e6ftNpGsU'],
          1,
        ],
        [
          expect.any(Function),
          'post',
          formData,
          'domain.tld/redirectPath003?geoip=noredirect',
          'urlencoded-form',
          ['Cookie: I5e6ftNpGsU', 'Cookie: Ye8mB6VsUHw'],
          2,
        ],
      ])
      expect(sendSpy.mock.calls).toEqual([[formData], [formData], [formData]])
    })

    it('should call reply with an error when the response is bad', async () => {
      postSpy.mockImplementationOnce(() => {
        throw new Error('error')
      })

      await cmsHandler.recursivelyFollowRedirectsAndSetCookies(
        mockReply,
        'post',
        {},
        'domain.tld/redirectPath001',
        'urlencoded-form',
        [],
        0
      )

      expect(mockReply).toHaveBeenCalledWith(expect.any(Error))
    })
  })

  describe('montyCmsFormSubmitHandler', () => {
    beforeEach(() => {
      recursiveSpy = jest.spyOn(
        cmsHandler,
        'recursivelyFollowRedirectsAndSetCookies'
      )
    })

    it('should call recursivelyFollowRedirectsAndSetCookies', async () => {
      const request = {
        payload: {
          action: 'url.com/payload',
          method: 'post',
          formData: {
            mega: 'shove',
          },
          encType: 'crypto2',
        },
      }
      await cmsHandler.montyCmsFormSubmitHandler(request, jest.fn())
      expect(recursiveSpy).toHaveBeenCalledWith(
        expect.any(Function),
        'post',
        { mega: 'shove' },
        'url.com/payload',
        'crypto2'
      )
    })
  })
})
