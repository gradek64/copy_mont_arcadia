import { setHostnameProperties } from '../hostnameActions'

describe('#setHostnameProperties', () => {
  it('should set the correct values when hostname is mobile & non-dev', () => {
    expect(setHostnameProperties('m.topshop.com')).toEqual({
      type: 'SET_HOSTNAME_PROPERTIES',
      isMobile: true,
      isMobileMainDev: false,
      isDesktopMainDev: false,
    })
  })

  it('should set the correct values when hostname is mobile & dev', () => {
    expect(
      setHostnameProperties(
        'ts-acc1.acc.digital.arcadiagroup.co.uk/en/tsuk/product/mid-blue-jamie-jeans-7947602'
      )
    ).toEqual({
      type: 'SET_HOSTNAME_PROPERTIES',
      isMobile: false,
      isMobileMainDev: true,
      isDesktopMainDev: false,
    })
  })

  it('should set the correct values when hostname is desktop & non-dev', () => {
    expect(setHostnameProperties('www.topshop.com')).toEqual({
      type: 'SET_HOSTNAME_PROPERTIES',
      isMobile: false,
      isMobileMainDev: false,
      isDesktopMainDev: false,
    })
  })

  it('should set the correct values when hostname is desktop & dev', () => {
    expect(
      setHostnameProperties(
        'ts.stage.arcadiagroup.ltd.uk/wcsstore/TopShop/images/catalog/62M65IPLM_small.jpg'
      )
    ).toEqual({
      type: 'SET_HOSTNAME_PROPERTIES',
      isMobile: false,
      isMobileMainDev: false,
      isDesktopMainDev: true,
    })
  })
})
