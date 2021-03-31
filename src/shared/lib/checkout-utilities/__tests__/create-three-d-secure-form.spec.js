import {
  createRawThreeDSecure1Form,
  createThreeDSecure1Form,
  createThreeDSecureFlexForm,
} from '../create-three-d-secure-form'

const md = 'test-md'
const paReq = 'test-pareq'
const action =
  'https://secure-test.worldpay.com/jsp/test/shopper/ThreeDResponseSimulator.jsp?orderCode=2118975_TS_UK_GB_1516719083461'
const originalTermUrl =
  'https://ts.stage.arcadiagroup.ltd.uk/webapp/wcs/stores/servlet/PunchoutPaymentCallBack?orderId=2118975&catalogId=33057&policyId=40006&tran_id=556806&storeId=12556&langId=-1&notifyShopper=0&notifyOrderSubmitted=0'
const challengeJwt = 'test-jwt'
const challengeUrl =
  'https://secure-test.worldpay.com/shopper/3ds/challenge.html'

describe('createRawThreeDSecure1Form', () => {
  it('creates a 3D Secure v1 form', () => {
    const expectedForm = createRawThreeDSecure1Form({
      action,
      md,
      paReq,
      orderCompleteReturnUrl: 'https://return.url',
    })

    expect(expectedForm).toMatchSnapshot()
  })

  it('creates a 3D Secure v1 form with a formId', () => {
    const expectedForm = createRawThreeDSecure1Form({
      action,
      md,
      paReq,
      orderCompleteReturnUrl: 'https://return.url',
      formId: 'paymentForm',
    })

    expect(expectedForm).toMatchSnapshot()
  })

  it('creates a 3D Secure v1 form with a submission script', () => {
    const expectedForm = createRawThreeDSecure1Form({
      action,
      md,
      paReq,
      orderCompleteReturnUrl: 'https://return.url',
      includeSubmitScript: true,
    })

    expect(expectedForm).toMatchSnapshot()
  })
})

describe('createThreeDSecure1Form', () => {
  it('creates a 3D Secure v1 form configured to return to /order-complete', () => {
    const expectedForm = createThreeDSecure1Form({
      action,
      md,
      paReq,
      wcsReturnUrl: originalTermUrl,
      montyReturnUrl:
        'http://local.m.topshop.com:8080/order-complete?paymentMethod=VISA',
    })
    expect(expectedForm).toMatchSnapshot()

    const regFormId = /id='paymentForm'/
    expect(regFormId.test(expectedForm)).toBeTruthy()

    const expectedTermUrlValue = /name='TermUrl' value='(.+)'\/>/.exec(
      expectedForm
    )[1]
    const regOrderPath = /\/order-complete\?/
    expect(regOrderPath.test(expectedTermUrlValue)).toBeTruthy()
  })

  it('creates a 3D Secure v1 form configured to return to /psd2-order-punchout', () => {
    const expectedForm = createThreeDSecure1Form({
      action,
      md,
      paReq,
      wcsReturnUrl: originalTermUrl,
      montyReturnUrl:
        'http://local.m.topshop.com:8080/psd2-order-punchout?paymentMethod=VISA',
    })
    expect(expectedForm).toMatchSnapshot()

    const regFormId = /id='paymentForm'/
    expect(regFormId.test(expectedForm)).toBeTruthy()

    const expectedTermUrlValue = /name='TermUrl' value='(.+)'\/>/.exec(
      expectedForm
    )[1]
    const regOrderPath = /\/psd2-order-punchout\?/
    expect(regOrderPath.test(expectedTermUrlValue)).toBeTruthy()
  })
})

describe('createThreeDSecureFlexForm', () => {
  it('creates a 3D Secure Flex form with MD', () => {
    const expectedForm = createThreeDSecureFlexForm({
      challengeJwt,
      challengeUrl,
      md,
    })

    expect(expectedForm).toMatchSnapshot()
  })

  it('creates a 3D Secure Flex form without MD', () => {
    const expectedForm = createThreeDSecureFlexForm({
      challengeJwt,
      challengeUrl,
    })

    expect(expectedForm).toMatchSnapshot()
  })
})
