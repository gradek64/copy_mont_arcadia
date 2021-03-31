import superagent from 'superagent'
import { nrBrowserLogError } from '../../client/lib/logger'

export const emitDressipiEvent = async (dressipiBaseUrl, event) => {
  const url = `${dressipiBaseUrl}/api/events`
  const response = await superagent
    .post(url)
    .send({ event })
    .withCredentials()
    .catch((error) => {
      nrBrowserLogError('dressipi event data error', error)
      throw error
    })

  return response.body
}
