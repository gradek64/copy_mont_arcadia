jest.unmock('superagent')
import superagent from 'superagent'

describe('/cmscontent', () => {
  function fetchCmscontent(cmsPageName) {
    return superagent.get('localhost:3000/cmscontent').query({
      storeCode: 'tsuk',
      brandName: 'topshop',
      siteId: '12556',
      cmsPageName,
    })
  }

  test('404 missing content is cached in redis', async () => {
    const cmsPageName = `missing-${Math.floor(Math.random() * 100)}`

    const response = await fetchCmscontent(cmsPageName)

    if (!('x-redis-cache' in response.headers)) {
      console.error('No REDIS_URL set in monty server env vars') // eslint-disable-line
      return
    }

    expect(response.headers['x-redis-cache']).toBe('false')
    expect(response.statusCode).toBe(200)

    const secondResponse = await fetchCmscontent(cmsPageName)
    expect(secondResponse.headers['x-redis-cache']).toBe('true')
    expect(response.statusCode).toBe(200)
  })
})
