import { postMontyCmsFormHandler } from '../cms'
import { postCmsFormSuccess, wcsformSubmitUrl } from './form-submit-payload'
import { getResponseAndSessionCookies } from '../../utilis/redis'

describe('POST: montycms submit form handler', () => {
  let test
  beforeAll(async () => {
    try {
      test = await postMontyCmsFormHandler(postCmsFormSuccess(wcsformSubmitUrl))
    } catch (e) {
      test = e
    }
  }, 30000)

  it('should return success for "sign up to style notes"', async () => {
    expect(test.statusCode).toEqual(200)
    expect(typeof test.body).toEqual('object')
  })

  // Remove once redis is removed
  it('should keep redis cookies in sync with client', async () => {
    const { responseCookies, session } = await getResponseAndSessionCookies(
      test
    )
    expect(responseCookies).toMatchSession(session)
  })
})
