import { loadScript, PAYPAL_SDK_SRC } from '../paypal-utils'

describe('Loading PayPal', () => {
  global.window.loadScript = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()

    window.loadScript.mockImplementation(({ onload }) => {
      onload()
      return Promise.resolve()
    })
  })
  describe('loadScript', () => {
    it('should load the script', () => {
      return loadScript(
        'AbnMc0wAfzApiSeP69UkmECGALay5lvi2skegbzdIVptNWbpx-6kK1x5WCxK_3FfGh0WFRGpDhPkKoZ9'
      ).then(() => {
        expect(window.loadScript).toHaveBeenCalledTimes(1)
        expect(window.loadScript).toBeCalledWith(
          expect.objectContaining({
            isAsync: true,
            src: `${PAYPAL_SDK_SRC}?client-id=AbnMc0wAfzApiSeP69UkmECGALay5lvi2skegbzdIVptNWbpx-6kK1x5WCxK_3FfGh0WFRGpDhPkKoZ9&currency=GBP&intent=order`,
          })
        )
      })
    })
  })
})
