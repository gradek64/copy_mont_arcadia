import { createStaticMapUrl } from '../google-static-map'

describe('createStaticMapUrl', () => {
  const params = {
    currentLat: 1,
    currentLng: 2,
    markers: [],
    dimensions: { width: 362, height: 650 },
    iconDomain: 'static.topshop.com',
    zoom: 1,
  }

  const markers = [
    [51.5157, -0.141396],
    [51.514043, -0.157231],
    [51.509599, -0.123069],
    [51.499783, -0.163677],
  ]

  const iconUrl = `https://${params.iconDomain}/v1/static/store-markers`

  beforeAll(() => {
    window.GOOGLE_API_KEY = 'dummyapikey'
  })

  it('should return a url with all the passed params and no markers', () => {
    const url = createStaticMapUrl(params)
    expect(url).toContain('center=1%2C2')
    expect(url).toContain('zoom=1')
    expect(url).toContain('size=362x650')
    expect(url).toContain('maptype=roadmap')
    expect(url).toContain(
      'style=feature%3Apoi%7Cvisibility%3Aoff%26style%3Dfeature%3Apoi.park%7Cvisibility%3Aon'
    )
    expect(url).not.toContain('markers=')
  })

  it('should return a url with all parameters and markers', () => {
    const url = createStaticMapUrl({
      ...params,
      markers,
    })

    expect(url).toContain(`markers=icon${encodeURIComponent(`:${iconUrl}`)}`)
    expect(url).toContain(
      '%7C51.5157%2C-0.141396%7C51.514043%2C-0.157231%7C51.509599%2C-0.123069%7C51.499783%2C-0.163677'
    )
  })
})
