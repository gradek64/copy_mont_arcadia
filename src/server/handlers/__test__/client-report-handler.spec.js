import { processReport } from '../client-report-handler'

const mockReply = jest.fn()
const message = 'What are you doing, Dave?'
const namespace = 'odyssey-2001'
const req = {
  params: {
    ltype: 'debug',
  },
  payload: {
    namespace,
    message,
  },
}

jest.mock('../../lib/logger', () => ({
  debug: jest.fn(),
}))

import { debug } from '../../lib/logger'

describe('client-report-handler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call processReport', () => {
    processReport(req, mockReply)
    expect(mockReply).toHaveBeenCalledTimes(1)
    expect(debug).toHaveBeenCalledTimes(1)
    expect(debug).toHaveBeenCalledWith(`client:${namespace}`, {
      message,
    })
  })

  it('should handle foo call to itself', () => {
    const req2 = {
      ...req,
      params: {
        ltype: 'FOO',
      },
    }
    processReport(req2, mockReply)
    expect(mockReply).toHaveBeenCalledTimes(1)
  })
})
