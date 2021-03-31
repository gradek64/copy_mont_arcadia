import testComponentHelper from 'test/unit/helpers/test-component'
import ThirdPartyPaymentIFrame from '../ThirdPartyPaymentIFrame'

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

describe('<ThirdPartyPaymentIFrame />', () => {
  const actionDomain = 'https://secure-test.worldpay.com'
  const actionPath =
    '/jsp/test/shopper/ThreeDResponseSimulator.jsp?orderCode=1234567890'
  const threeDSecureForm = `
    <form
      id="paymentForm"
      method='post'
      action='${actionDomain}${actionPath}'
    >
      <input
        type='hidden'
        name='TermUrl'
        value='http://local.m.topshop.com:8080/order-complete?ga=GA1.2.1234567890.0987654321&paymentMethod=VISA&langId=-1&orderId=1234567890&policyId=40006&tran_id=871050&catalogId=33057&notifyOrderSubmitted=0&storeId=12556&notifyShopper=0'
      />
      <input
        type='hidden'
        name='MD'
        value='MD_1234567890'
      />
      <textarea
        style='display:none;'
        name='PaReq'
      >
        eJxVUtuOgjAQ/RXis0tpKyhmrMF14/qAMSs/QKBZSORiC4u7X79TBdGTPsw5c2lnprC+FmfrRyqdV+VqQm1nYq0FRJmScnuSSaukgFBqHX9LK08xwvWo788XlDPuTQQcgy95EdBXEFjAZkAGiqkqyeKyERAnl83+IOgIIL0GhVT77bPL4G2Mu/uhjrXuKpUKyvjM9eYLIA8JyriQIqpq65RVNZAbhaRqy0b9igXzgAwEWnUWWdPUeklI13V2U9Uak+ykKoAYJ5Dx3cfWWBqLXfNUhH8fThiFLIwCdghesAJiIiCNGymYQ31n7lCLeks8Lgdy0yEuzCvEbnO0OJ/6Lg7hrkBtLgruhHPjeVYAV6FkmQy9DAzkta5KiRE49ocNqdSJmYbpa2rtNni9UYCM7bx/mqUkDU52huAIhhg2c3OY6jmOzDRzK28IEJNK+s2T/neg9fJr/gEIwb85
      </textarea>
    </form>
  `

  describe('@renders', () => {
    const renderComponent = testComponentHelper(ThirdPartyPaymentIFrame)

    it('without a 3D Secure form', () => {
      const props = {
        redirectionMode: 'three-d-secure-form',
      }

      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })

    it('with a 3D Secure form', () => {
      const props = {
        redirectionMode: 'three-d-secure-form',
        threeDSecureForm,
      }

      expect(renderComponent(props).getTree()).toMatchSnapshot()
    })
  })

  describe('@componentDidMount', () => {
    it('should call redirectThreeDSecure() when redirectionMode is three-d-secure-form', () => {
      const renderComponent = testComponentHelper(ThirdPartyPaymentIFrame)

      const props = {
        redirectionMode: 'three-d-secure-form',
        threeDSecureForm,
      }

      const { instance } = renderComponent(props)

      const spy = jest.spyOn(instance, 'redirectThreeDSecure')
      instance.componentDidMount()
      expect(spy).toHaveBeenCalled()
      expect(spy.mock.calls[0][0].threeDSecureForm).toBe(threeDSecureForm)
    })
  })

  describe('@redirectThreeDSecure', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should redirect to /psd2-order-failure when the 3D Secure form is missing', () => {
      const renderComponent = testComponentHelper(ThirdPartyPaymentIFrame)

      const props = {
        redirectionMode: 'three-d-secure-form',
        threeDSecureForm: null,
      }

      const { instance } = renderComponent(props)

      instance.componentDidMount()

      const failureUrl = `/psd2-order-failure?error=${encodeURIComponent(
        '3D Secure form missing'
      )}`
      expect(browserHistory.replace).toHaveBeenCalledWith(failureUrl)
    })

    it('should redirect to /psd2-order-failure when the 3D Secure injection fails', () => {
      const renderComponent = testComponentHelper(ThirdPartyPaymentIFrame)

      const props = {
        redirectionMode: 'three-d-secure-form',
        threeDSecureForm,
      }

      const { instance } = renderComponent(props)

      const div = {
        insertAdjacentHTML: () => {},
      }

      instance.iframeRef.current = {
        contentDocument: {
          createElement: () => div,
          body: {
            appendChild: () => {},
          },
          getElementById: () => ({
            submit: () => {
              throw new Error('submit-error')
            },
          }),
        },
      }

      instance.componentDidMount()

      const failureUrl = `/psd2-order-failure?error=${encodeURIComponent(
        '3D Secure form injection fault'
      )}`
      expect(browserHistory.replace).toHaveBeenCalledWith(failureUrl)

      // Does not leak technical error details to the front end
      expect(/submit-error/.test(browserHistory.replace.mock.calls[0][0])).toBe(
        false
      )

      // Logs full technical details to New Relic
      expect(nrBrowserLogError).toHaveBeenCalledWith(
        '3D Secure form injection fault',
        new Error('submit-error')
      )
    })
  })
})
