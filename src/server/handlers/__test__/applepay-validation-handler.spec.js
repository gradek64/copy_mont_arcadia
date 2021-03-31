import applePayValidationHandler from '../applepay-validation-handler'
import path from 'path'

jest.mock('path')

describe('applepay-validation-handler', () => {
  it('replies with a different validation file depending on current hostname', () => {
    const hostname = 'stage.m.topshop.com'
    const type = jest.fn()

    const req = {
      info: {
        hostname,
      },
    }
    const reply = {
      file: jest.fn(() => ({
        type,
      })),
    }

    path.join = jest.fn((__dirname, path) => path)

    applePayValidationHandler(req, reply)

    expect(reply.file).toHaveBeenCalledWith(
      `../../../applepay/validation/${hostname}/apple-developer-merchantid-domain-association.txt`
    )

    expect(type).toHaveBeenCalledWith('text/plain')
  })
})
