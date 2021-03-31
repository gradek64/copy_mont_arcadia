import deepFreeze from 'deep-freeze'

import testComponentHelper from 'test/unit/helpers/test-component'
import DeviceDataCollectionIFrame, {
  MAX_DDC_ATTEMPTS,
} from '../DeviceDataCollectionIFrame'

jest.mock('react-router', () => ({
  browserHistory: {
    replace: jest.fn(),
  },
}))
import { browserHistory } from 'react-router'

jest.mock('../../../../../client/lib/logger', () => ({
  nrBrowserLogError: jest.fn(),
}))
import { nrBrowserLogError } from '../../../../../client/lib/logger'

global.addEventListener = jest.fn()
global.removeEventListener = jest.fn()

const emptyProps = deepFreeze({
  concludeOrderCreation: () => {},
  clearPrePaymentConfig: () => {},
  clearFinalisedOrder: () => {},
})

const renderComponent = testComponentHelper(
  DeviceDataCollectionIFrame.WrappedComponent
)

describe('<DeviceDataCollectionIFrame />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  describe('@render', () => {
    it('should produce an invisible iframe', () => {
      expect(renderComponent(emptyProps).getTree()).toMatchSnapshot()
    })
  })

  describe('@buildForm', () => {
    it('should fill in the template form with the supplied parameters', () => {
      const { instance } = renderComponent(emptyProps)
      const htmlForm = instance.buildForm({
        formId: 'test-form-id',
        url: 'test-url',
        bin: 'test-bin',
        jwt: 'test-jwt',
      })
      expect(htmlForm).toMatchSnapshot()
    })
  })

  describe('@parseUrl', () => {
    it('should populate this.ddcUrl with a parsed version of a URL string', () => {
      const { instance } = renderComponent(emptyProps)
      instance.parseUrl('https://www.example.com')
      expect(instance.ddcUrl.host).toEqual('www.example.com')
    })

    it('should fail gracefully with an invalid URL', () => {
      const { instance } = renderComponent(emptyProps)
      instance.parseUrl('this-is-an-invalid-url')
      expect(instance.ddcUrl.protocol).toBeFalsy()
    })

    it('should throw without a string', () => {
      const { instance } = renderComponent(emptyProps)
      expect(() => instance.parseUrl()).toThrow()
      expect(() => instance.parseUrl(null)).toThrow()
    })
  })

  describe('@validateJwt', () => {
    const jwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2OWFkYzE4NS0xNzQ4LTQ1MjUtOWVmOS00M2YyNTlhMWMyZDYiLCJpYXQiOjE1NDg4Mzg4NTUsImlzcyI6IjViZDllMGU0NDQ0ZGNlMTUzNDI4Yzk0MCIsIk9yZ1VuaXRJZCI6IjViZDliNTVlNDQ0NDc2MWFjMGFmMWM4MCJ9.qTyYn4rItMMNdnh6ouqW6ZmcCNzaG9JI_GdWGIaq6rY'

    it('should return true for a correctly structured JWT', () => {
      const { instance } = renderComponent(emptyProps)
      expect(instance.validateJwt(jwt)).toBe(true)
    })

    it('should return false for an incorrectly structured JWT', () => {
      const { instance } = renderComponent(emptyProps)
      expect(instance.validateJwt()).toBe(false)
      expect(instance.validateJwt(null)).toBe(false)
      expect(instance.validateJwt('')).toBe(false)
      expect(instance.validateJwt(jwt.replace(/\./g, ''))).toBe(false)
      expect(instance.validateJwt(jwt.replace(/\./g, '!'))).toBe(false)
    })
  })

  describe('@validateBin', () => {
    it('should accept <bin> for tokenised cards', () => {
      const { instance } = renderComponent(emptyProps)
      expect(instance.validateBin('<bin>')).toBe(true)
    })

    it('should accept any card number starting with at least six digits', () => {
      const { instance } = renderComponent(emptyProps)
      expect(instance.validateBin('1')).toBe(false)
      expect(instance.validateBin('12345')).toBe(false)
      expect(instance.validateBin('123456')).toBe(true)
      expect(instance.validateBin('1234567')).toBe(true)
      expect(instance.validateBin('12345678901234567890')).toBe(true)
    })

    it('should reject other values and number formats', () => {
      const { instance } = renderComponent(emptyProps)
      expect(instance.validateBin()).toBe(false)
      expect(instance.validateBin(null)).toBe(false)
      expect(instance.validateBin('')).toBe(false)
      expect(instance.validateBin(' 123456 ')).toBe(false)
      expect(instance.validateBin('1234 5678 1234 5678')).toBe(false)
      expect(instance.validateBin('abcdef')).toBe(false)
    })
  })

  describe('@redirectOnError', () => {
    it('should clear payment data that may be sensitive', () => {
      const clearPrePaymentConfig = jest.fn()
      const clearFinalisedOrder = jest.fn()

      const { instance } = renderComponent({
        ...emptyProps,
        clearPrePaymentConfig,
        clearFinalisedOrder,
      })

      instance.redirectOnError({
        message: '',
        error: new Error(''),
      })

      expect(clearPrePaymentConfig).toHaveBeenCalledTimes(1)
      expect(clearFinalisedOrder).toHaveBeenCalledTimes(1)
    })

    it('should log full error details to New Relic', () => {
      const { instance } = renderComponent(emptyProps)

      const message = 'test-message'
      const error = new Error('test-error')
      instance.redirectOnError({
        message,
        error,
      })

      expect(nrBrowserLogError).toHaveBeenCalledTimes(1)
      expect(nrBrowserLogError).toHaveBeenCalledWith(message, error)
    })

    it('should log the message to New Relic if no extra error information is available', () => {
      const { instance } = renderComponent(emptyProps)

      const message = 'test-message'
      instance.redirectOnError({
        message,
      })

      expect(nrBrowserLogError).toHaveBeenCalledTimes(1)
      expect(nrBrowserLogError).toHaveBeenCalledWith(
        message,
        new Error(message)
      )
    })

    it('should redirect to /psd2-order-failure, including the message, exluding error details', () => {
      const { instance } = renderComponent(emptyProps)

      const message = 'test message'
      const error = new Error('test-error')
      const failureUrl = `/psd2-order-failure?error=${encodeURIComponent(
        message
      )}`
      instance.redirectOnError({
        message,
        error,
      })

      expect(browserHistory.replace).toHaveBeenCalledTimes(1)
      expect(browserHistory.replace).toHaveBeenCalledWith(failureUrl)
    })
  })

  describe('@cleanUpGlobals', () => {
    it('should cancel the watchdog timer if it exists', () => {
      const watchdogReference = {}
      const { instance } = renderComponent(emptyProps)

      instance.watchdog = watchdogReference
      instance.cleanUpGlobals()

      expect(clearTimeout).toHaveBeenCalledTimes(1)
      expect(clearTimeout).toHaveBeenCalledWith(watchdogReference)
      expect(instance.watchdog).toBeNull()
      expect(instance.ddcUrl).toBeNull()
      expect(instance.formElement).toBeNull()
      expect(instance.ddcAttempts).toBe(MAX_DDC_ATTEMPTS)
    })

    it('should remove ddcResponseListener() from the window context', () => {
      const { instance } = renderComponent(emptyProps)
      instance.cleanUpGlobals()
      expect(removeEventListener).toHaveBeenCalledTimes(1)
      expect(removeEventListener).toHaveBeenCalledWith(
        'message',
        instance.ddcResponseListener,
        false
      )
    })
  })

  describe('@authenticateWith3DS2', () => {
    it('should pass the sessionId to concludeOrderCreation() as dfReferenceId', () => {
      const sessionId = 'test-session-id'
      const concludeOrderCreation = jest.fn()

      const { instance } = renderComponent({
        ...emptyProps,
        concludeOrderCreation,
      })

      instance.authenticateWith3DS2({ dfReferenceId: sessionId })
      expect(concludeOrderCreation).toHaveBeenCalledTimes(1)
      expect(concludeOrderCreation).toHaveBeenCalledWith({
        threeDSecure: {
          dfReferenceId: sessionId,
        },
      })
    })
  })

  describe('@authenticateWith3DS1', () => {
    it('should pass an empty sessionId as dfReferenceId and a downgrade reason to concludeOrderCreation()', () => {
      const ddcDowngradeReason = 'test-reason'
      const concludeOrderCreation = jest.fn()

      const { instance } = renderComponent({
        ...emptyProps,
        concludeOrderCreation,
      })

      instance.authenticateWith3DS1({ ddcDowngradeReason })
      expect(concludeOrderCreation).toHaveBeenCalledTimes(1)
      expect(concludeOrderCreation).toHaveBeenCalledWith({
        threeDSecure: {
          dfReferenceId: '',
          ddcDowngradeReason,
        },
      })
    })
  })

  describe('@parseResponse', () => {
    it('should return parsed data when supplied with valid JSON', () => {
      const { instance } = renderComponent(emptyProps)
      const response = instance.parseResponse('{"test":"data"}')
      expect(response.test).toBe('data')
    })

    it('should return a function that captures a parsing error', () => {
      const { instance } = renderComponent(emptyProps)
      const errorHandler = jest.fn()
      const response = instance.parseResponse('|invalid!json|', errorHandler)
      response()
      expect(errorHandler).toHaveBeenCalledTimes(1)
    })
  })

  describe('@ddcResponseListener', () => {
    it('should ignore events from anywhere except the DDC origin', () => {
      const { instance } = renderComponent(emptyProps)
      instance.ddcUrl = {
        protocol: 'https:',
        slashes: true,
        host: 'www.example.com',
      }
      const event = {
        origin: 'https://www.somewhere-else.com',
      }
      const parseResponseSpy = jest.spyOn(instance, 'parseResponse')
      instance.ddcResponseListener(event)
      expect(parseResponseSpy).not.toHaveBeenCalled()
    })

    it('should respect slashes property from URL parser when testing origin URL', () => {
      const { instance } = renderComponent(emptyProps)
      instance.ddcUrl = {
        protocol: 'https:',
        slashes: false,
        host: 'www.example.com',
      }
      const event = {
        origin: 'https:www.somewhere-else.com',
      }
      const parseResponseSpy = jest.spyOn(instance, 'parseResponse')
      instance.ddcResponseListener(event)
      expect(parseResponseSpy).not.toHaveBeenCalled()
    })

    it('should clean up and redirect when the DDC response cannot be parsed as JSON', () => {
      const { instance } = renderComponent(emptyProps)
      instance.parseResponse = (_, errorHandler) => {
        return () => errorHandler(new Error('test-error'))
      }
      instance.ddcUrl = {
        protocol: 'https:',
        slashes: true,
        host: 'www.example.com',
      }
      const event = {
        origin: 'https://www.example.com',
      }
      const cleanUpSpy = jest.spyOn(instance, 'cleanUpGlobals')
      const redirectSpy = jest.spyOn(instance, 'redirectOnError')
      instance.ddcResponseListener(event)
      expect(cleanUpSpy).toHaveBeenCalledTimes(1)
      expect(redirectSpy).toHaveBeenCalledTimes(1)
    })

    it('should clean up and authenticate with 3D Secure v2 when the DDC response indicates this is possible', () => {
      const { instance } = renderComponent(emptyProps)
      instance.ddcUrl = {
        protocol: 'https:',
        slashes: true,
        host: 'www.example.com',
      }
      const sessionId = 'a811091a-68ef-4109-a7f0-93239b6acc74'
      const event = {
        origin: 'https://www.example.com',
        data: JSON.stringify({
          MessageType: 'profile.completed',
          Status: true,
          SessionId: sessionId,
        }),
      }

      const cleanUpSpy = jest.spyOn(instance, 'cleanUpGlobals')
      const authenticateSpy = jest.spyOn(instance, 'authenticateWith3DS2')
      instance.ddcResponseListener(event)
      expect(cleanUpSpy).toHaveBeenCalledTimes(1)
      expect(authenticateSpy).toHaveBeenCalledTimes(1)
      expect(authenticateSpy).toHaveBeenCalledWith({ dfReferenceId: sessionId })
    })

    it('should clean up and authenticate with 3D Secure v1 when the DDC response indicates a downgrade is possible', () => {
      const { instance } = renderComponent(emptyProps)
      instance.ddcUrl = {
        protocol: 'https:',
        slashes: true,
        host: 'www.example.com',
      }
      const sessionId = 'a811091a-68ef-4109-a7f0-93239b6acc74'
      const event = {
        origin: 'https://www.example.com',
        data: JSON.stringify({
          MessageType: 'profile.completed',
          Status: false,
          SessionId: sessionId,
        }),
      }
      const cleanUpSpy = jest.spyOn(instance, 'cleanUpGlobals')
      const authenticateSpy = jest.spyOn(instance, 'authenticateWith3DS1')
      instance.ddcResponseListener(event)
      expect(cleanUpSpy).toHaveBeenCalledTimes(1)
      expect(authenticateSpy).toHaveBeenCalledTimes(1)
      expect(authenticateSpy).toHaveBeenCalledWith({
        ddcDowngradeReason: 'DDC_3DS2_UNSUPPORTED',
      })
    })
  })

  describe('@shutdownWatchdog', () => {
    it('should blank the watchdog reference, clean up and authenticate with 3D Secure v1 to downgrade', () => {
      const { instance } = renderComponent(emptyProps)
      const cleanUpSpy = jest.spyOn(instance, 'cleanUpGlobals')
      const authenticateSpy = jest.spyOn(instance, 'authenticateWith3DS1')
      instance.shutdownWatchdog()
      expect(instance.watchdog).toBeNull()
      expect(cleanUpSpy).toHaveBeenCalledTimes(1)
      expect(authenticateSpy).toHaveBeenCalledWith({
        ddcDowngradeReason: 'DDC_RESPONSE_TIMEOUT',
      })
    })
  })

  describe('@startWatchdog', () => {
    it('should initiate a timeout in seconds', () => {
      const { instance } = renderComponent(emptyProps)
      const submitDdcRequestSpy = jest.spyOn(instance, 'submitDdcRequest')
      instance.startWatchdog({ timeoutSeconds: 10 })
      expect(instance.watchdog).toBeTruthy()
      expect(setTimeout).toHaveBeenCalledTimes(1)
      expect(submitDdcRequestSpy).not.toHaveBeenCalled()
      jest.runAllTimers()
      expect(submitDdcRequestSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('@submitDdcRequest', () => {
    it('should run without parameters', () => {
      const { instance } = renderComponent(emptyProps)
      expect(() => instance.submitDdcRequest()).not.toThrow()
    })

    it('should downgrade the transaction to 3DS1 when no component formElement is set', () => {
      const { instance } = renderComponent(emptyProps)
      const authenticateWith3DS1Spy = jest.spyOn(
        instance,
        'authenticateWith3DS1'
      )
      instance.submitDdcRequest({ ddcAttempts: 0 })
      expect(authenticateWith3DS1Spy).toHaveBeenCalledWith({
        ddcDowngradeReason: 'DDC_RESPONSE_TIMEOUT',
      })
    })

    it('should downgrade the transaction to 3DS1 when no component ddcAttempts is set', () => {
      const { instance } = renderComponent(emptyProps)
      const authenticateWith3DS1Spy = jest.spyOn(
        instance,
        'authenticateWith3DS1'
      )
      instance.submitDdcRequest({ formElement: {} })
      expect(authenticateWith3DS1Spy).toHaveBeenCalledWith({
        ddcDowngradeReason: 'DDC_RESPONSE_TIMEOUT',
      })
    })

    it('should downgrade the transaction to 3DS1 when the maximum number of retries has been exceeded', () => {
      const { instance } = renderComponent(emptyProps)
      const authenticateWith3DS1Spy = jest.spyOn(
        instance,
        'authenticateWith3DS1'
      )
      instance.submitDdcRequest({
        formElement: {},
        ddcAttempts: MAX_DDC_ATTEMPTS,
      })
      expect(authenticateWith3DS1Spy).toHaveBeenCalledWith({
        ddcDowngradeReason: 'DDC_RESPONSE_TIMEOUT',
      })
    })

    it('should submit a DDC request when the maximum number of retries has not been exceeded', () => {
      const submit = jest.fn()
      const { instance } = renderComponent(emptyProps)
      instance.submitDdcRequest({
        formElement: { submit },
        ddcAttempts: 0,
      })
      expect(submit).toHaveBeenCalled()
    })

    it('should clean up and redirect when form submission fails', () => {
      const submit = jest.fn(() => {
        throw new Error('submission-error')
      })
      const { instance } = renderComponent(emptyProps)
      const cleanUpSpy = jest.spyOn(instance, 'cleanUpGlobals')
      const redirectSpy = jest.spyOn(instance, 'redirectOnError')
      instance.submitDdcRequest({
        formElement: { submit },
        ddcAttempts: 0,
      })
      expect(submit).toHaveBeenCalledTimes(1)
      expect(cleanUpSpy).toHaveBeenCalledTimes(1)
      expect(redirectSpy).toHaveBeenCalledTimes(1)
      expect(redirectSpy.mock.calls[0][0].message).toBe(
        'Device Data Collection form submission fault'
      )
    })

    it('should retry when requests timeout', () => {
      const submit = jest.fn()
      const { instance } = renderComponent(emptyProps)
      const authenticateWith3DS1Spy = jest.spyOn(
        instance,
        'authenticateWith3DS1'
      )

      instance.submitDdcRequest({
        formElement: { submit },
        ddcAttempts: 0,
      })

      for (let i = 0; i < MAX_DDC_ATTEMPTS; i++) {
        jest.runAllTimers()
      }

      expect(submit).toHaveBeenCalledTimes(MAX_DDC_ATTEMPTS)
      expect(authenticateWith3DS1Spy).toHaveBeenCalledWith({
        ddcDowngradeReason: 'DDC_RESPONSE_TIMEOUT',
      })
    })
  })

  describe('@injectForm', () => {
    const div = deepFreeze({
      insertAdjacentHTML: jest.fn(),
    })

    const form = {}

    const iframe = deepFreeze({
      contentDocument: {
        createElement: () => div,
        body: {
          appendChild: () => {},
        },
        getElementById: jest.fn(() => form),
      },
    })

    it('should inject the form html into the supplied iframe and return the form element', () => {
      const formId = 'test-form-id'
      const html = `<form id="${formId}"></form>`
      const { instance } = renderComponent(emptyProps)
      const formElement = instance.injectForm({
        iframe,
        html,
        formId,
      })
      expect(div.insertAdjacentHTML).toHaveBeenCalledTimes(1)
      expect(div.insertAdjacentHTML.mock.calls[0][1]).toBe(html)
      expect(iframe.contentDocument.getElementById.mock.calls[0][0]).toBe(
        formId
      )
      expect(formElement).toBe(form)
    })

    it('should clean up and redirect when iframe injection fails', () => {
      div.insertAdjacentHTML.mockImplementationOnce(() => {
        throw new Error('insertion-error')
      })

      const formId = 'test-form-id'
      const html = `<form id="${formId}"></form>`
      const { instance } = renderComponent(emptyProps)
      const cleanUpSpy = jest.spyOn(instance, 'cleanUpGlobals')
      const redirectSpy = jest.spyOn(instance, 'redirectOnError')
      const formElement = instance.injectForm({
        iframe,
        html,
        formId,
      })

      expect(div.insertAdjacentHTML).toHaveBeenCalledTimes(1)
      expect(cleanUpSpy).toHaveBeenCalledTimes(1)
      expect(redirectSpy).toHaveBeenCalledTimes(1)
      expect(redirectSpy.mock.calls[0][0].message).toBe(
        'Device Data Collection form injection fault'
      )
      expect(formElement).toBeNull()
    })
  })

  describe('@componentDidMount', () => {
    const ddcUrl = 'https://www.example.com/ddc.html'
    const ddcJwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2OWFkYzE4NS0xNzQ4LTQ1MjUtOWVmOS00M2YyNTlhMWMyZDYiLCJpYXQiOjE1NDg4Mzg4NTUsImlzcyI6IjViZDllMGU0NDQ0ZGNlMTUzNDI4Yzk0MCIsIk9yZ1VuaXRJZCI6IjViZDliNTVlNDQ0NDc2MWFjMGFmMWM4MCJ9.qTyYn4rItMMNdnh6ouqW6ZmcCNzaG9JI_GdWGIaq6rY'
    const cardNumber = '4444333322221111'

    beforeEach(() => {
      process.browser = true
    })

    afterEach(() => {
      process.browser = false
    })

    it('should only mount in the browser', () => {
      process.browser = false
      const { instance } = renderComponent(emptyProps)
      const parseUrlSpy = jest.spyOn(instance, 'parseUrl')
      instance.componentDidMount()
      expect(parseUrlSpy).not.toHaveBeenCalled()
    })

    it('should redirect if the DDC URL is missing', () => {
      const { instance } = renderComponent(emptyProps)
      const redirectSpy = jest.spyOn(instance, 'redirectOnError')
      instance.componentDidMount()
      expect(redirectSpy).toHaveBeenCalledTimes(1)
      expect(redirectSpy.mock.calls[0][0].message).toBe(
        'Device Data Collection - DDC URL'
      )
    })

    it('should redirect if the DDC URL does not parse', () => {
      const { instance } = renderComponent({
        ...emptyProps,
        prePaymentConfig: {
          ddcUrl: null,
        },
      })
      const redirectSpy = jest.spyOn(instance, 'redirectOnError')
      instance.componentDidMount()
      expect(redirectSpy).toHaveBeenCalledTimes(1)
      expect(redirectSpy.mock.calls[0][0].message).toBe(
        'Device Data Collection - DDC URL'
      )
    })

    it('should redirect if the DDC URL is insecure', () => {
      const { instance } = renderComponent({
        ...emptyProps,
        prePaymentConfig: {
          ddcUrl: 'http://www.insecure.com/ddc.html',
        },
      })
      const redirectSpy = jest.spyOn(instance, 'redirectOnError')
      instance.componentDidMount()
      expect(redirectSpy).toHaveBeenCalledTimes(1)
      expect(redirectSpy.mock.calls[0][0].message).toBe(
        'Device Data Collection - Insecure DDC URL'
      )
    })

    it('should redirect if the DDC JWT fails validation', () => {
      const { instance } = renderComponent({
        ...emptyProps,
        prePaymentConfig: {
          ddcUrl,
          ddcJwt: 'invalid.jwt',
        },
      })
      const redirectSpy = jest.spyOn(instance, 'redirectOnError')
      instance.componentDidMount()
      expect(redirectSpy).toHaveBeenCalledTimes(1)
      expect(redirectSpy.mock.calls[0][0].message).toBe(
        'Device Data Collection - Missing or invalid JWT'
      )
    })

    it('should redirect if the BIN fails validation', () => {
      const { instance } = renderComponent({
        ...emptyProps,
        prePaymentConfig: {
          ddcUrl,
          ddcJwt,
        },
        cardNumber: '123',
      })
      const redirectSpy = jest.spyOn(instance, 'redirectOnError')
      instance.componentDidMount()
      expect(redirectSpy).toHaveBeenCalledTimes(1)
      expect(redirectSpy.mock.calls[0][0].message).toBe(
        'Device Data Collection - Missing or invalid BIN'
      )
    })

    it('should add ddcResponseListener() to the window context', () => {
      const { instance } = renderComponent({
        ...emptyProps,
        prePaymentConfig: {
          ddcUrl,
          ddcJwt,
        },
        cardNumber,
      })
      instance.componentDidMount()
      expect(addEventListener).toHaveBeenCalledTimes(1)
      expect(addEventListener).toHaveBeenCalledWith(
        'message',
        instance.ddcResponseListener,
        false
      )
    })

    it('should prefer a card number entered by the user over the stored BIN', () => {
      const binNumber = '987654'
      const { instance } = renderComponent({
        ...emptyProps,
        prePaymentConfig: {
          ddcUrl,
          ddcJwt,
          binNumber,
        },
        cardNumber,
      })
      const buildFormSpy = jest.spyOn(instance, 'buildForm')
      instance.componentDidMount()
      expect(buildFormSpy).toHaveBeenCalledWith({
        formId: expect.any(String),
        url: ddcUrl,
        bin: cardNumber,
        jwt: ddcJwt,
      })
    })

    it('should prefer a stored BIN when no card number is available in the UI', () => {
      const binNumber = '987654'
      const { instance } = renderComponent({
        ...emptyProps,
        prePaymentConfig: {
          ddcUrl,
          ddcJwt,
          binNumber,
        },
        cardNumber: null,
      })
      const buildFormSpy = jest.spyOn(instance, 'buildForm')
      instance.componentDidMount()
      expect(buildFormSpy).toHaveBeenCalledWith({
        formId: expect.any(String),
        url: ddcUrl,
        bin: binNumber,
        jwt: ddcJwt,
      })
    })

    it('should inject the DDC form and submit it', () => {
      const { instance } = renderComponent({
        ...emptyProps,
        prePaymentConfig: {
          ddcUrl,
          ddcJwt,
        },
        cardNumber,
      })
      const injectFormSpy = jest.spyOn(instance, 'injectForm')
      const submitDdcRequestSpy = jest.spyOn(instance, 'submitDdcRequest')
      instance.componentDidMount()
      expect(injectFormSpy).toHaveBeenCalledTimes(1)
      expect(submitDdcRequestSpy).toHaveBeenCalledTimes(1)
    })
  })
})
