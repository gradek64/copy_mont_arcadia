import nock from 'nock'
import { woosmapFetch } from '../woosmap-utils'

describe('woosmap-utils', () => {
  const preferredISOs = ['GB', 'FR', 'SP']
  const searchTerm = 'xxx'

  beforeEach(() => {
    window.WOOSMAP_API_KEY = 'fake_woosmap_key'
  })

  afterEach(() => {
    delete window.WOOSMAP_API_KEY
    return nock.cleanAll
  })

  it('if the request is successful', async () => {
    nock('https://api.woosmap.com')
      .get(
        `/localities/autocomplete/?components=country:GB%7Ccountry:FR%7Ccountry:SP&input=${searchTerm}&key=${
          window.WOOSMAP_API_KEY
        }`
      )
      .reply(200, {
        localities: [
          {
            public_id: 'b',
            description: ' 2 road london',
            location: { lat: 1, lng: 2 },
          },
        ],
      })

    await woosmapFetch(preferredISOs, searchTerm).then((body) => {
      expect(window.WOOSMAP_API_KEY).toBe('fake_woosmap_key')
      expect(body).toEqual([
        {
          key: 'b',
          description: ' 2 road london',
          location: { lat: 1, long: 2 },
        },
      ])
    })
  })

  describe('if the request is unsuccessful', () => {
    process.browser = true
    const mockNoticeError = jest.fn()
    window.NREUM = {
      noticeError: mockNoticeError,
    }

    beforeEach(() => {
      nock('https://api.woosmap.com')
        .get(
          `/localities/autocomplete/?components=country:GB%7Ccountry:FR%7Ccountry:SP&input=${searchTerm}&key=${
            window.WOOSMAP_API_KEY
          }`
        )
        .reply(401, { Error: 'Unauthorized' })
    })
    it('should respond with he correct error message', async () => {
      await woosmapFetch(preferredISOs, searchTerm).catch((err) => {
        expect(err.status).toBe(401)
        expect(err.message).toEqual('Unauthorized')
      })
    })
    it('should call newRelic', () => {
      expect(mockNoticeError).toHaveBeenCalledWith(new Error('Unauthorized'), {
        extraDetail: 'woosmap-error',
      })
    })
  })
})
