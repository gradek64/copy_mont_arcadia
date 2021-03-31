import nock from 'nock'
import { emitDressipiEvent } from '../dressipi-utils'
import { nrBrowserLogError } from '../../../client/lib/logger'

jest.mock('../../../client/lib/logger', () => ({
  nrBrowserLogError: jest.fn(),
}))

describe('emitDressipiEvent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    nock.cleanAll()
    process.env.DRESSIPI_ENVIRONMENT = 'https://dressipi-staging'
  })

  const url = '/api/events'

  it('should return an object with a success property set to true', async () => {
    const nockScope = nock(`${process.env.DRESSIPI_ENVIRONMENT}.topshop.com`)
      .post(url)
      .reply(200, { success: true })

    const dressipiEvent = {
      event_type: 'pdp',
      product_code: 'TSUK!@£$',
      root_event_id: '1234',
      content_id: '4321',
    }

    await emitDressipiEvent(
      `${process.env.DRESSIPI_ENVIRONMENT}.topshop.com`,
      dressipiEvent
    ).then((res) => {
      expect(nockScope.isDone()).toBe(true)
      expect(res.success).toBe(true)
    })
  })

  it('should return an error and call NR logger when the response is unsuccessful', async () => {
    nock(`${process.env.DRESSIPI_ENVIRONMENT}.topshop.com`)
      .post(url)
      .reply(400, {})

    const dressipiEvent = {
      event_type: 'pdp',
      product_code: 'TSUK!@£$',
      root_event_id: 'a bad event ID',
      content_id: '4321',
    }

    await emitDressipiEvent(
      `${process.env.DRESSIPI_ENVIRONMENT}.topshop.com`,
      dressipiEvent
    ).catch((error) => {
      expect(error.message).toEqual('Bad Request')
      expect(nrBrowserLogError).toHaveBeenCalledTimes(1)
      expect(nrBrowserLogError).toBeCalledWith(
        'dressipi event data error',
        error
      )
    })
  })
})
