import createRender, { mockLocalise } from 'test/unit/helpers/test-component'
import RedirectionPrompt from '../RedirectionPrompt'
import ShippingDestinationFlag from '../../ShippingDestinationFlag/ShippingDestinationFlag'

const render = createRender(RedirectionPrompt)

describe('<RedirectionPrompt />', () => {
  let wrapper
  let props
  let setGeoIPCookiesFirstButton
  let setGeoIPCookiesSecondButton

  beforeEach(() => {
    setGeoIPCookiesFirstButton = jest.fn()
    setGeoIPCookiesSecondButton = jest.fn()
    props = {
      currentSiteRegion: 'us',
      userRegionPreference: 'uk',
      userISOPreference: 'GB',
      currentSiteISO: 'GB',
      setGeoIPCookies: jest
        .fn()
        .mockReturnValueOnce(setGeoIPCookiesFirstButton)
        .mockReturnValueOnce(setGeoIPCookiesSecondButton),
      showFootnote: true,
      geoTranslate: mockLocalise,
    }
    wrapper = render(props).wrapper
  })

  it('renders a heading', () => {
    const wrapperHeading = wrapper.find('h3')
    expect(wrapperHeading.text()).toBe('Country preferences')
  })

  it('renders an informative message', () => {
    const wrapperText = wrapper.find('p').first()
    expect(wrapperText.text()).toBe(
      'You are viewing the website for the us. Would you like to view the website for United Kingdom instead?'
    )
  })

  it('renders a redirect button with the geo preference country site flag', () => {
    const wrapperLink = wrapper.find('Button').last()
    const flag = wrapperLink.find(ShippingDestinationFlag)
    expect(wrapperLink.length).toBe(1)
    expect(flag.length).toBe(1)
    expect(flag.prop('shippingDestination')).toEqual('United Kingdom')
    expect(wrapperLink.contains('Take me to the United Kingdom site')).toBe(
      true
    )
  })

  it('renders a button with the current country site flag to close the modal and let the user stay where they are', () => {
    wrapper = render({ ...props, currentSiteISO: 'US' }).wrapper
    const wrapperButton = wrapper.find('Button').first()
    const flag = wrapperButton.find(ShippingDestinationFlag)
    expect(wrapperButton.length).toBe(1)
    expect(flag.length).toBe(1)
    expect(flag.prop('shippingDestination')).toEqual('United States')
    expect(wrapperButton.contains('Continue to the us site')).toBe(true)
  })

  it('displays a message describing what will happen should a user redirect', () => {
    const wrapperFootnote = wrapper.find('[data-id="GeoIPModal-Footnote"]')
    expect(wrapperFootnote.length).toBe(1)
    expect(wrapperFootnote.text()).toBe(
      'NOTE: If you choose to be redirected, you will be taken to the home page.'
    )
  })

  it('does not display the modal footnote if redirecting to a PDP page', () => {
    wrapper = render({ ...props, showFootnote: false }).wrapper
    const wrapperFootnote = wrapper.find('[data-id="GeoIPModal-Footnote"]')
    expect(wrapperFootnote.length).toBe(0)
  })

  describe('when the "continue to current site" button is clicked', () => {
    it('should call setGeoIPCookies with shouldRedirect = false', () => {
      expect(props.setGeoIPCookies.mock.calls[0][0]).toEqual({
        cookieValue: 'GB',
        shouldRedirect: false,
      })
      expect(setGeoIPCookiesFirstButton).not.toHaveBeenCalled()
      const redirectButton = wrapper.find('Button').first()
      redirectButton.prop('clickHandler')()
      expect(setGeoIPCookiesFirstButton).toHaveBeenCalled()
    })
  })

  describe('when the "redirect me" button is clicked', () => {
    it('should call setGeoIPCookies with shouldRedirect = true', () => {
      expect(props.setGeoIPCookies.mock.calls[1][0]).toEqual({
        cookieValue: 'GB',
        shouldRedirect: true,
      })
      expect(setGeoIPCookiesSecondButton).not.toHaveBeenCalled()
      const redirectButton = wrapper.find('Button').last()
      redirectButton.prop('clickHandler')()
      expect(setGeoIPCookiesSecondButton).toHaveBeenCalled()
    })
  })

  it('should include all required dictionary strings in its dictionaryStrings property', () => {
    expect(RedirectionPrompt.dictionaryStrings).toMatchSnapshot()
  })
})
