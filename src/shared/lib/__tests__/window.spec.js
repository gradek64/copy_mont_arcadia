import { isProductionBrandHost } from '../window'

describe('Window.js', () => {
  it('handles different versions of environments for brand', () => {
    expect(
      isProductionBrandHost('local.m.topshop.com', 'www.topshop.com')
    ).toBe(true)
    expect(
      isProductionBrandHost('stage.m.topshop.com', 'www.topshop.com')
    ).toBe(true)
    expect(
      isProductionBrandHost('integration.m.topshop.com', 'www.topshop.com')
    ).toBe(true)
    expect(
      isProductionBrandHost('showcase.m.topshop.com', 'www.topshop.com')
    ).toBe(true)
    expect(isProductionBrandHost('m.topshop.com', 'www.topshop.com')).toBe(true)
    expect(isProductionBrandHost('m.topshop.com', 'www.topshop.co.uk')).toBe(
      false
    )
    expect(isProductionBrandHost('m.topshop.co.uk', 'www.topshop.com')).toBe(
      false
    )
    expect(isProductionBrandHost('m.topshop.co.uk', 'www.topshop.co.uk')).toBe(
      true
    )
    expect(
      isProductionBrandHost('local.m.de.topshop.com', 'de.topshop.com')
    ).toBe(true)
  })
})
