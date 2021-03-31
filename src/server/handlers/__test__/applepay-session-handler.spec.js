import request from 'superagent'
import applepaySessionHandler from './../applepay-session-handler'

// Mock filesystem to read the ApplePay certificates
jest.mock('fs', () => {
  const fileSystemMock = {
    'applepay/certificates/topman/applepay-cert.pem': 'topman certificate',
    'applepay/certificates/topshop/applepay-cert.pem': 'topshop certificate',
  }

  return {
    readFileSync: (path) => {
      return fileSystemMock[path]
    },
  }
})

jest.mock('superagent')
jest.mock('path', () => ({
  resolve: (_, relativePath) => relativePath,
}))

const mockRequestToApplepay = ({ error, body }) => {
  const send = jest.fn(
    () => (error ? Promise.reject({ body: error }) : Promise.resolve({ body }))
  )

  const key = jest.fn(() => ({
    send,
  }))
  const cert = jest.fn(() => ({
    key,
  }))
  const post = jest.fn(() => ({
    cert,
  }))

  return {
    send,
    key,
    cert,
    post,
  }
}

describe('applepay-session-handler', () => {
  describe('validationURL is not present', () => {
    const hostname = 'www.topman.com'

    it('returns a bad request response', async () => {
      const req = {
        info: {
          hostname,
        },
        query: {},
      }
      const reply = jest.fn()

      await applepaySessionHandler(req, reply)

      const expectedError = new Error(
        'validationUrl parameter is invalid or missing'
      )

      expect(reply).toHaveBeenCalledWith(expectedError)
    })
  })

  describe('validationURL is not valid', () => {
    const validationURL = 'http://example.com:123abc/foo'
    const hostname = 'www.topman.com'

    it('returns a bad request response', async () => {
      const req = {
        info: {
          hostname,
        },
        query: {
          validationURL,
        },
      }
      const reply = jest.fn()

      await applepaySessionHandler(req, reply)

      const expectedError = new Error(
        'validationUrl parameter is invalid or missing'
      )

      expect(reply).toHaveBeenCalledWith(expectedError)
    })
  })

  describe('validationURL is valid', () => {
    const validationURL =
      'https://apple-pay-gateway-nc-pod4.apple.com/paymentservices/startSession'
    const hostname = 'www.topman.com'

    const req = {
      info: {
        hostname,
      },
      query: {
        validationURL,
      },
    }

    describe('certificate is present', () => {
      it('calls validationUrl', async () => {
        const { send, key, cert, post } = mockRequestToApplepay({
          body: { status: 'ok' },
        })
        const reply = jest.fn()

        request.post = post

        await applepaySessionHandler(req, reply)

        expect(post).toHaveBeenCalledWith(validationURL)
        expect(cert).toHaveBeenCalledWith('topman certificate')
        expect(key).toHaveBeenCalledWith('topman certificate')
        expect(send).toHaveBeenCalledWith({
          merchantIdentifier: 'merchant.com.topman.test',
          displayName: 'Topman',
          initiative: 'web',
          initiativeContext: hostname,
        })

        expect(reply).toHaveBeenCalledWith({ status: 'ok' })
      })

      it('returns an error if applepay call fails', async () => {
        const { send, key, cert, post } = mockRequestToApplepay({
          error: { message: 'Invalid session url' },
        })
        const reply = jest.fn()

        request.post = post

        await applepaySessionHandler(req, reply)

        expect(post).toHaveBeenCalledWith(validationURL)
        expect(cert).toHaveBeenCalledWith('topman certificate')
        expect(key).toHaveBeenCalledWith('topman certificate')
        expect(send).toHaveBeenCalledWith({
          merchantIdentifier: 'merchant.com.topman.test',
          displayName: 'Topman',
          initiative: 'web',
          initiativeContext: hostname,
        })

        expect(reply).toHaveBeenCalledWith(
          new Error('ApplePay validation session request failed')
        )
      })

      describe('WCS environment is prod', () => {
        const wcsEnv = process.env.WCS_ENVIRONMENT

        beforeEach(() => {
          process.env.WCS_ENVIRONMENT = 'prod'
        })

        afterEach(() => {
          process.env.WCS_ENVIRONMENT = wcsEnv
        })

        it('calls validationUrl with the correct merchantIdentifier', async () => {
          const { send, key, cert, post } = mockRequestToApplepay({
            body: { status: 'ok' },
          })
          const reply = jest.fn()

          request.post = post

          await applepaySessionHandler(req, reply)

          expect(post).toHaveBeenCalledWith(validationURL)
          expect(cert).toHaveBeenCalledWith('topman certificate')
          expect(key).toHaveBeenCalledWith('topman certificate')
          expect(send).toHaveBeenCalledWith({
            merchantIdentifier: 'merchant.com.topman.applepay',
            displayName: 'Topman',
            initiative: 'web',
            initiativeContext: hostname,
          })

          expect(reply).toHaveBeenCalledWith({ status: 'ok' })
        })
      })
    })

    describe('certificate is not present', () => {
      it('returns a 404', async () => {
        const req = {
          info: {
            hostname: 'www.burton.co.uk',
          },
          query: {
            validationURL,
          },
        }

        const reply = jest.fn()

        await applepaySessionHandler(req, reply)

        expect(reply).toHaveBeenCalledWith(new Error('Not Found'))
      })
    })
  })
})
