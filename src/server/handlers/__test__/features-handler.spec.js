import { type } from 'ramda'

import { consumerFeatureHandler } from '../features-handler'

const defaultReq = {
  headers: {
    'brand-code': 'tsuk',
  },
  params: {
    consumer: 'monty',
  },
}

describe('consumer feature handler', () => {
  it('returns monty feature flags if consumer is monty', () => {
    const fakeReply = jest.fn()
    consumerFeatureHandler(defaultReq, fakeReply)

    const res = fakeReply.mock.calls[0][0]
    expect(Array.isArray(res.features)).toBeTruthy()
    expect(res.features.length > 0).toBeTruthy()
  })

  describe('when consumer is app', () => {
    let PERSISTENT_LOGIN_BB_APPS_FEATURE_FLAG
    beforeAll(() => {
      PERSISTENT_LOGIN_BB_APPS_FEATURE_FLAG =
        process.env.PERSISTENT_LOGIN_BB_APPS_FEATURE_FLAG
    })
    afterAll(() => {
      process.env.PERSISTENT_LOGIN_BB_APPS_FEATURE_FLAG = PERSISTENT_LOGIN_BB_APPS_FEATURE_FLAG
    })

    const fakeReq = {
      ...defaultReq,
      params: {
        consumer: 'app',
      },
    }

    it('should return an object with flags', () => {
      const fakeReply = jest.fn()
      return consumerFeatureHandler(fakeReq, fakeReply).then(() => {
        const res = fakeReply.mock.calls[0][0]

        const body = JSON.parse(res)
        expect(body.success).toBe(true)
        expect(type(body.flags)).toBe('Object')
      })
    })

    it('should return the FEATURE_PERSISTENT_AUTH flag as true if PERSISTENT_LOGIN_BB_APPS_FEATURE_FLAG env var true', async () => {
      process.env.PERSISTENT_LOGIN_BB_APPS_FEATURE_FLAG = 'true'

      const fakeReply = jest.fn()

      return consumerFeatureHandler(fakeReq, fakeReply).then(() => {
        const res = fakeReply.mock.calls[0][0]
        const body = JSON.parse(res)
        expect(body.flags.FEATURE_PERSISTENT_AUTH).toBe(true)
      })
    })

    it('should return the FEATURE_PERSISTENT_AUTH flag as false if PERSISTENT_LOGIN_BB_APPS_FEATURE_FLAG env var false', async () => {
      process.env.PERSISTENT_LOGIN_BB_APPS_FEATURE_FLAG = 'false'

      const fakeReply = jest.fn()

      return consumerFeatureHandler(fakeReq, fakeReply).then(() => {
        const res = fakeReply.mock.calls[0][0]
        const body = JSON.parse(res)
        expect(body.flags.FEATURE_PERSISTENT_AUTH).toBe(false)
      })
    })

    it('should return the FEATURE_PERSISTENT_AUTH flag as false if PERSISTENT_LOGIN_BB_APPS_FEATURE_FLAG env var undefined', async () => {
      process.env.PERSISTENT_LOGIN_BB_APPS_FEATURE_FLAG = undefined

      const fakeReply = jest.fn()

      return consumerFeatureHandler(fakeReq, fakeReply).then(() => {
        const res = fakeReply.mock.calls[0][0]
        const body = JSON.parse(res)
        expect(body.flags.FEATURE_PERSISTENT_AUTH).toBe(false)
      })
    })
  })

  it('404 Not Found for invalid consumer', () => {
    const fakeReq = {
      ...defaultReq,
      params: {
        consumer: 'foo',
      },
    }

    const statusCodeSpy = jest.fn()
    const fakeReply = jest.fn().mockReturnValue({
      code: statusCodeSpy,
    })

    consumerFeatureHandler(fakeReq, fakeReply)

    const res = fakeReply.mock.calls[0][0]
    const body = JSON.parse(res)
    expect(body).toEqual({
      success: false,
      message: "Invalid consumer provided. Should be one of: 'app', 'monty'",
    })
    expect(statusCodeSpy).toHaveBeenCalledWith(404)
  })
})
