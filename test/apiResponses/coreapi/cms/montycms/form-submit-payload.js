import { setVariable } from '../../utilis'
import appPayload from './newsletter-apps-payload.json'

export const wcsformSubmitUrl = setVariable(
  ['cms', 'wcsformSubmitUrl'],
  'ts-tst1.tst.digital.arcadiagroup.co.uk/'
)

export const postCmsFormSuccess = (wcsUrl) => ({
  method: 'post',
  action: `https://${wcsUrl}/webapp/wcs/stores/servlet/AddSubscriberDetails`,
  encType: 'application/x-www-form-urlencoded',
  formData: {
    emailid: '1@3.com',
    confirmemailaddress: '1@3.com',
    forename: 'd',
    dd: '3',
    mm: '3',
    yy: '2003',
    town: 'ed',
    country: 'Afghanistan',
    student: 'Y',
    gradyear: '2018',
    feedback_form: 'maildb',
    emailserviceid: '8',
    sender: 'Topshop',
    from: 'noreply@https://www.topshop.com',
    fieldValue: '2',
    subscriptiondate: '',
    failureURL: '/en/tsuk/category/style-notes-error-17/home',
    successURL: '/en/tsuk/category/style-notes-success-18/home',
    subject: 'Topshop UK: Style Notes Sign Up',
    source: 'WEB',
    campaigncode: 'ORGANIC',
    storeId: '12556',
  },
})

export const postCmsFormSuccessApps = (wcsUrl) => {
  return {
    ...appPayload,
    cmsContent: {
      ...appPayload.cmsContent,
      formAttributes: {
        ...appPayload.cmsContent.formAttributes,
        action: `https://${wcsUrl}/webapp/wcs/stores/servlet/AddSubscriberDetails`,
      },
    },
  }
}
