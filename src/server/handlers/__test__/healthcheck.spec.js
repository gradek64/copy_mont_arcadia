const code = jest.fn()
const mockreply = jest.fn(() => ({
  code,
}))

jest.mock('../../../server/lib/logger', () => ({
  generateTransactionId: () => 'AAAAA',
  info: jest.fn(),
}))

import { info } from '../../../server/lib/logger'

describe('#Healthcheck Handler', () => {
  afterEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  it('calls the appropriate sub handlers', () => {
    jest.doMock('../../../shared/lib/superagent', () => ({
      cache: {
        db: {},
      },
    }))
    const { getHealthCheckHandler } = require('../healthcheck')

    getHealthCheckHandler({}, mockreply)

    expect(mockreply).toHaveBeenCalledTimes(1)
    expect(mockreply).toHaveBeenCalledWith('Ok')
    expect(code).toHaveBeenCalledWith(200)
    expect(info).toHaveBeenCalledTimes(2)
    expect(info).toHaveBeenCalledWith('health:check', {
      loggerMessage: 'redis',
      success: false,
      transactionId: 'AAAAA',
    })
  })

  it('returns 404 when no cache db', () => {
    jest.doMock('../../../shared/lib/superagent', () => ({}))
    const { getHealthCheckHandler } = require('../healthcheck')

    getHealthCheckHandler({}, mockreply)

    expect(mockreply).toHaveBeenCalledTimes(1)
    expect(mockreply).toHaveBeenCalledWith('No redis cache')
    expect(code).toHaveBeenCalledWith(404)
  })
})
