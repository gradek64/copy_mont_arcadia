// eslint-disable-next-line localisation
require('@babel/register')

jest.unmock('superagent')
import superagent from 'superagent'
import eps from '../routes_tests'
import { headers } from '../utilis'

export const getCmsPageName = async (pageName) => {
  const cmsPageBody = await superagent
    .get(eps.cms.cmsPageName.path(pageName))
    .set(headers)
  return cmsPageBody
}

export const getCmsSeo = async (pageName) => {
  const cmsSeoBody = await superagent
    .get(eps.cms.cmsSeo.path(pageName))
    .set(headers)
  return cmsSeoBody
}

export const postMontyCmsFormHandler = async (payload) => {
  const cmsSeoBody = await superagent
    .post(eps.cms.montyCmsFormHandler.path)
    .set(headers)
    .send(payload)
  return cmsSeoBody
}

export const postCmsFormHandler = async (payload) => {
  const cmsSeoBody = await superagent
    .post(eps.cms.cmsFormHandler.path)
    .set(headers)
    .send(payload)
  return cmsSeoBody
}
