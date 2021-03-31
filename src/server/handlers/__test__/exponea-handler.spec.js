import nock from 'nock'
import deepFreeze from 'deep-freeze'
import Boom from 'boom'
import exponeaHandler from '../exponea-handler'

jest.mock('boom', () => ({
  badData: jest.fn(),
}))

const exponeaUrl = 'https://api.mktg.arcadiagroup.co.uk/'
const exponeaEndPoint = '/managed-tags/show'
const hostname = 'local.m.topshop.com'
const company_id = '47e0be88-c234-11e8-9d3f-0a580a204314'
const current_url = 'get_consent_url'
const memberId =
  '6588a2bb407bb53f542f6b090f9b3a93bbaa24df061dca 80a43d8d7c02a48627'
const link =
  'https://cdn.mktg.arcadiagroup.co.uk/topshop-dev/e/eyJjdXN0b21lcl9pZCI6eyIgYiI6Ik5XTmhNV1ZoTldVMFl6UXhZak13TURFME4yWTJaRGRtIn0sIm1hbmFnZWRfdGFnX2lkIjoiNWM4ZmNjOTA2NTU4ZTMwMDE0ZjhkODBlIn0.3lL2jY7UFaMd6leX_vPguRLM45M/consent'
const replyMocked = jest.fn()

const data = deepFreeze({
  data: [
    {
      definition: link,
      type: 'js',
      uses_overlay: false,
    },
  ],
  errors: [],
  success: true,
})

describe('My Preferences - Link Exponea', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return the My Preferences link to exponea', async () => {
    nock(exponeaUrl)
      .post(exponeaEndPoint, {
        company_id,
        current_url,
        customer_ids: {
          hash_member_id: memberId,
        },
      })
      .reply(200, data)

    await exponeaHandler(
      {
        info: { hostname },
        current_url,
        payload: {
          memberId,
        },
      },
      replyMocked
    )

    expect(replyMocked).toHaveBeenCalledWith({ link })
  })

  it('should return the message EXPONEA LINK NOT AVAILABLE if exponea preferences link is not returned', async () => {
    const responseWithNoLink = {
      data: [],
      errors: [],
      success: true,
    }

    nock(exponeaUrl)
      .post(exponeaEndPoint, {
        company_id,
        current_url,
        customer_ids: {
          hash_member_id: memberId,
        },
      })
      .reply(200, responseWithNoLink)

    await exponeaHandler(
      {
        info: { hostname },
        current_url,
        payload: {
          memberId,
        },
      },
      replyMocked
    )

    expect(Boom.badData).toHaveBeenCalledWith('EXPONEA LINK NOT AVAILABLE')
  })
})
